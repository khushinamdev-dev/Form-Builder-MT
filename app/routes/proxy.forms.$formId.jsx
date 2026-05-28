import { authenticate } from "../shopify.server";
import { parseFormCategory } from "../utils/form-category";

function jsonResponse(body, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=60",
    },
  });
}

async function loadFormMetaobject(admin, formId) {
  const response = await admin.graphql(
    `
        query GetStorefrontForm($handle: MetaobjectHandleInput!) {
            metaobjectByHandle(handle: $handle) {
                id
                handle
                fields {
                    key
                    value
                }
            }
        }
    `,
    {
      variables: {
        handle: { type: "$app:profile", handle: formId },
      },
    },
  );

  const json = await response.json();

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join(", "));
  }

  return json.data?.metaobjectByHandle;
}

function buildFormPayload(metaobject) {
  const fieldMap = metaobject.fields.reduce((acc, f) => {
    acc[f.key] = f.value;
    return acc;
  }, {});

  let config = {};
  try {
    config = JSON.parse(fieldMap.bio || "{}");
  } catch (_) {}

  if (fieldMap.active === "false") {
    return { error: "This form is not active", status: 403 };
  }

  return {
    data: {
      id: metaobject.handle,
      title: config.headerTitle || fieldMap.full_name || "Form",
      description: config.description || "",
      primaryColor: config.primaryColor || "#008060",
      afterSubmitAction: config.afterSubmitAction || "successful",
      successTitle: config.successTitle || "Thanks for getting in touch!",
      successMessage: config.successMessage || "We appreciate you contacting us. One of our colleagues will get back in touch with you soon!<br/><br/>Have a great day!",
      redirectUrl: config.redirectUrl || "",
      customerTag: config.customerTag || "",
      fields: config.fields || [],
    },
  };
}

export const loader = async ({ request, params }) => {
  const { formId } = params;

  if (!formId) {
    return jsonResponse({ error: "Form ID is required" }, 400);
  }

  try {
    const context = await authenticate.public.appProxy(request);

    if (!context.admin) {
      return jsonResponse(
        { error: "Form Builder app is not installed on this store" },
        404,
      );
    }

    const metaobject = await loadFormMetaobject(context.admin, formId);

    if (!metaobject) {
      return jsonResponse({ error: "Form not found. Check the Form ID." }, 404);
    }

    const result = buildFormPayload(metaobject);

    if (result.error) {
      return jsonResponse({ error: result.error }, result.status);
    }

    const acceptHeader = request.headers.get("Accept") || "";
    if (acceptHeader.includes("application/json")) {
      return jsonResponse(result.data);
    }

    // Return rendered HTML form instead of JSON
    const html = `
            <div class="fb-storefront-form">
                <style>
                    .fb-storefront-form { font-family: inherit; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e1e3e5; border-radius: 8px; background: #fff; }
                    .fb-storefront-form h2 { margin-top: 0; color: #202223; font-size: 24px; }
                    .fb-storefront-form p { color: #6d7175; margin-bottom: 24px; }
                    .fb-field { margin-bottom: 20px; }
                    .fb-label { display: block; font-weight: 500; margin-bottom: 6px; font-size: 14px; color: #202223; }
                    .fb-input { width: 100%; padding: 12px; border: 1px solid #c9cccf; border-radius: 4px; box-sizing: border-box; font-size: 14px; }
                    .fb-submit { width: 100%; background: ${result.data.primaryColor || "#008060"}; color: #fff; border: none; padding: 14px; border-radius: 4px; font-weight: 600; cursor: pointer; font-size: 16px; margin-top: 10px; }
                    .fb-success { display: none; text-align: center; color: #008060; font-weight: 600; padding: 40px 20px; border: 1px solid #e2f1e8; background: #fbfdfc; border-radius: 8px; }
                </style>
                <div id="fb-container">
                    <h2>${result.data.title}</h2>
                    <p>${result.data.description}</p>
                    <form id="fb-form-el">
                        ${result.data.fields
                          .map(
                            (f) => `
                            <div class="fb-field">
                                <label class="fb-label">${f.label}${f.required ? " *" : ""}</label>
                                ${
                                  f.type === "select" || f.type === "dropdown"
                                    ? `<select class="fb-input" name="${f.label}" ${f.required ? "required" : ""}>
                                        <option value="">Select an option...</option>
                                        ${(f.options || []).map((o) => `<option value="${o}">${o}</option>`).join("")}
                                       </select>`
                                    : `<input class="fb-input" type="${f.type === "email" ? "email" : "text"}" name="${f.label}" ${f.required ? "required" : ""} placeholder="${f.placeholder || ""}">`
                                }
                            </div>
                        `,
                          )
                          .join("")}
                        <button type="submit" class="fb-submit">Submit Information</button>
                    </form>
                </div>
                <div id="fb-success" class="fb-success">
                    <h3>${result.data.successTitle}</h3>
                    <p>${result.data.successMessage}</p>
                </div>
                <script>
                    document.getElementById('fb-form-el').addEventListener('submit', async (e) => {
                        e.preventDefault();
                        const btn = e.target.querySelector('button');
                        btn.disabled = true;
                        btn.innerText = 'Submitting...';
                        
                        const formData = new FormData(e.target);
                        const payload = {};
                        formData.forEach((value, key) => payload[key] = value);

                        try {
                            const response = await fetch(window.location.href, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(payload)
                            });
                            if (response.ok) {
                                const action = '${result.data.afterSubmitAction}';
                                const redirectUrl = '${result.data.redirectUrl}';
                                if (action === 'redirect' && redirectUrl) {
                                    window.location.href = redirectUrl;
                                } else if (action === 'clear') {
                                    e.target.reset();
                                    btn.disabled = false;
                                    btn.innerText = 'Submit Information';
                                    alert('${result.data.successTitle}');
                                } else if (action === 'hide') {
                                    document.getElementById('fb-container').style.display = 'none';
                                } else {
                                    // successful
                                    document.getElementById('fb-form-el').style.display = 'none';
                                    document.getElementById('fb-success').style.display = 'block';
                                }
                            } else {
                                alert('There was an error submitting the form. Please try again.');
                                btn.disabled = false;
                                btn.innerText = 'Submit Information';
                            }
                        } catch (err) {
                            console.error(err);
                            btn.disabled = false;
                        }
                    });
                </script>
            </div>
        `;

    return new Response(html, { headers: { "Content-Type": "text/html" } });
  } catch (err) {
    if (err instanceof Response) {
      const text = await err.text().catch(() => "");
      console.error("App proxy auth error:", err.status, text);
      return jsonResponse(
        {
          error:
            "App proxy authentication failed. Reinstall the app and try again.",
        },
        err.status || 500,
      );
    }

    console.error("Storefront form proxy error:", err);
    return jsonResponse({ error: err.message || "Failed to load form" }, 500);
  }
};

export const action = async ({ request, params }) => {
  const { formId } = params;
  const context = await authenticate.public.appProxy(request);
  const admin = context.admin;

  if (!admin) return jsonResponse({ error: "Unauthorized" }, 401);

  try {
    const payload = await request.json();
    const metaobject = await loadFormMetaobject(admin, formId);
    if (!metaobject) return jsonResponse({ error: "Form not found" }, 404);

    const fields = metaobject.fields.reduce((acc, f) => {
      acc[f.key] = f.value;
      return acc;
    }, {});

    const formName = fields.full_name || "Untitled Form";
    const category = parseFormCategory(fields.bio, fields.role);
    const customerName =
      payload["Name"] ||
      payload["Full Name"] ||
      payload["First Name"] ||
      payload["Email"] ||
      "Anonymous";

    await admin.graphql(
      `
            mutation CreateSubmission($metaobject: MetaobjectCreateInput!) {
                metaobjectCreate(metaobject: $metaobject) {
                    metaobject { id }
                    userErrors { field message }
                }
            }
        `,
      {
        variables: {
          metaobject: {
            type: "$app:submissions",
            fields: [
              { key: "form_id", value: formId },
              { key: "form_name", value: formName },
              { key: "customer_name", value: customerName },
              { key: "category", value: category },
              { key: "status", value: category === "b2b" ? "Pending" : "Submitted" },
              { key: "payload", value: JSON.stringify(payload) },
            ],
          },
        },
      },
    );

    return jsonResponse({ success: true });
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
};
