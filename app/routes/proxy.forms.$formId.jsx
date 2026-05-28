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
      // All appearance fields
      borderRadius: config.borderRadius || "8px",
      fontFamily: config.fontFamily || "inherit",
      backgroundColor: config.backgroundColor || "#ffffff",
      titleColor: config.titleColor || "#202223",
      titleFontSize: config.titleFontSize || "26px",
      descriptionColor: config.descriptionColor || "#6d7175",
      descriptionFontSize: config.descriptionFontSize || "14px",
      labelColor: config.labelColor || "#202223",
      labelFontSize: config.labelFontSize || "14px",
      inputBgColor: config.inputBgColor || "#ffffff",
      inputTextColor: config.inputTextColor || "#202223",
      inputBorderColor: config.inputBorderColor || "#bbc3c9",
      btnTextColor: config.btnTextColor || "#ffffff",
      footerSubmitText: config.footerSubmitText || "Submit",
      footerShowReset: config.footerShowReset || false,
      footerFullWidth: config.footerFullWidth || false,
    },
  };
}

function renderField(f, d) {
  const br = d.borderRadius;
  const inputStyle = `width:100%;padding:10px 12px;border:1px solid ${d.inputBorderColor};border-radius:${br};box-sizing:border-box;font-size:${d.labelFontSize};background:${d.inputBgColor};color:${d.inputTextColor};outline:none;font-family:${d.fontFamily};`;
  const labelHtml = `<label class="fb-label" style="display:block;font-weight:500;margin-bottom:5px;font-size:${d.labelFontSize};color:${d.labelColor};">${f.label}${f.required ? ' <span style="color:#d82c0d;">*</span>' : ""}</label>`;
  const name = f.label.replace(/"/g, "&quot;");
  const req = f.required ? "required" : "";
  const ph = (f.placeholder || "").replace(/"/g, "&quot;");

  let input = "";

  if (f.type === "select" || f.type === "dropdown") {
    const opts = (f.options || []).map((o) => `<option value="${o}">${o}</option>`).join("");
    input = `<select style="${inputStyle}" name="${name}" ${req}><option value="">Select an option...</option>${opts}</select>`;
  } else if (f.type === "textarea") {
    input = `<textarea style="${inputStyle}min-height:100px;resize:vertical;" name="${name}" placeholder="${ph}" ${req}></textarea>`;
  } else if (f.type === "checkboxes" || f.type === "radio") {
    const inputType = f.type === "checkboxes" ? "checkbox" : "radio";
    const opts = (f.options || []).map((o) => `<label style="display:flex;align-items:center;gap:8px;margin-bottom:6px;font-size:${d.labelFontSize};color:${d.inputTextColor};cursor:pointer;"><input type="${inputType}" name="${name}" value="${o}" style="accent-color:${d.primaryColor};width:16px;height:16px;"> ${o}</label>`).join("");
    input = `<div>${opts}</div>`;
  } else if (f.type === "consent") {
    input = `<label style="display:flex;align-items:flex-start;gap:8px;font-size:${d.labelFontSize};color:${d.inputTextColor};cursor:pointer;"><input type="checkbox" name="${name}" ${req} style="accent-color:${d.primaryColor};width:16px;height:16px;margin-top:2px;"> <span>${f.placeholder || f.label}</span></label>`;
    return `<div class="fb-field" style="margin-bottom:16px;grid-column:span 6;">${input}</div>`;
  } else if (f.type === "date") {
    input = `<input style="${inputStyle}" type="date" name="${name}" ${req}>`;
  } else if (f.type === "number") {
    input = `<input style="${inputStyle}" type="number" name="${name}" placeholder="${ph}" ${req}>`;
  } else if (f.type === "email") {
    input = `<input style="${inputStyle}" type="email" name="${name}" placeholder="${ph}" ${req}>`;
  } else if (f.type === "tel" || f.type === "phone") {
    input = `<input style="${inputStyle}" type="tel" name="${name}" placeholder="${ph}" ${req}>`;
  } else if (f.type === "url") {
    input = `<input style="${inputStyle}" type="url" name="${name}" placeholder="${ph}" ${req}>`;
  } else if (f.type === "heading") {
    return `<div style="margin-bottom:16px;grid-column:span 6;"><h3 style="margin:0;color:${d.titleColor};font-family:${d.fontFamily};">${f.label}</h3></div>`;
  } else if (f.type === "paragraph") {
    return `<div style="margin-bottom:16px;color:${d.descriptionColor};font-size:${d.descriptionFontSize};font-family:${d.fontFamily};grid-column:span 6;">${f.label}</div>`;
  } else if (f.type === "divider") {
    return `<hr style="border:none;border-top:1px solid ${d.inputBorderColor};margin:16px 0;grid-column:span 6;">`;
  } else if (f.type === "range") {
    input = `<input style="width:100%;accent-color:${d.primaryColor};" type="range" name="${name}" ${req}>`;
  } else if (f.type === "color") {
    input = `<input style="width:60px;height:36px;border:1px solid ${d.inputBorderColor};border-radius:${br};padding:2px;background:${d.inputBgColor};cursor:pointer;" type="color" name="${name}">`;
  } else if (f.type === "switch") {
    input = `<label style="display:flex;align-items:center;gap:10px;cursor:pointer;"><input type="checkbox" name="${name}" style="accent-color:${d.primaryColor};width:18px;height:18px;"> <span style="font-size:${d.labelFontSize};color:${d.inputTextColor};">${f.placeholder || "Toggle"}</span></label>`;
  } else {
    // Default: text input
    input = `<input style="${inputStyle}" type="text" name="${name}" placeholder="${ph}" ${req}>`;
  }

  // Grid layout column spanning logic
  const isNaturallyFull = [
    "file",
    "select",
    "dropdown",
    "textarea",
    "heading",
    "paragraph",
    "divider",
    "button",
    "repeater",
    "matrix",
    "html",
    "image-options",
    "signature",
    "product",
    "feedback",
    "hidden",
  ].includes(f.type);

  let gridSpan = "span 6";
  if (f.columnWidth === "33%") {
    gridSpan = "span 2";
  } else if (f.columnWidth === "50%") {
    gridSpan = "span 3";
  } else if (f.columnWidth === "100%") {
    gridSpan = "span 6";
  } else {
    gridSpan = isNaturallyFull ? "span 6" : "span 3";
  }

  return `<div class="fb-field" style="grid-column:${gridSpan};margin-bottom:8px;">${labelHtml}${input}</div>`;
}

// Return the rendered HTML form
function renderHtmlForm(d) {
  const submitBtnStyle = `
    display:block;
    width:${d.footerFullWidth ? "100%" : "auto"};
    background:${d.primaryColor};
    color:${d.btnTextColor};
    border:none;
    padding:12px 28px;
    border-radius:${d.borderRadius};
    font-weight:600;
    cursor:pointer;
    font-size:16px;
    margin-top:16px;
    font-family:${d.fontFamily};
    transition:opacity 0.2s;
  `;

  const fieldsHtml = (d.fields || []).map((f) => renderField(f, d)).join("");

  return `
<style>
  .fb-storefront-form * {
    box-sizing: border-box;
  }
  #fb-form-el {
    display: grid !important;
    grid-template-columns: repeat(6, 1fr) !important;
    gap: 16px !important;
    width: 100% !important;
  }
  .fb-submit-container {
    grid-column: span 6 !important;
  }
  @media (max-width: 600px) {
    #fb-form-el {
      grid-template-columns: 1fr !important;
      gap: 12px !important;
    }
    .fb-field {
      grid-column: span 1 !important;
    }
  }
</style>
<div class="fb-storefront-form" style="font-family:${d.fontFamily};max-width:620px;margin:0 auto;padding:32px;border-radius:${d.borderRadius};background:${d.backgroundColor};box-sizing:border-box;">
  <div id="fb-container">
    <h2 style="margin:0 0 8px;color:${d.titleColor};font-size:${d.titleFontSize};font-family:${d.fontFamily};">${d.title}</h2>
    ${d.description ? `<p style="color:${d.descriptionColor};font-size:${d.descriptionFontSize};margin:0 0 24px;font-family:${d.fontFamily};">${d.description}</p>` : ""}
    <form id="fb-form-el">
      ${fieldsHtml}
      <div class="fb-submit-container" style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;grid-column:span 6;">
        ${d.footerShowReset ? `<button type="reset" style="${submitBtnStyle}background:#f1f3f4;color:#202223;">Reset</button>` : ""}
        <button type="submit" id="fb-submit-btn" style="${submitBtnStyle}">${d.footerSubmitText}</button>
      </div>
    </form>
  </div>
  <div id="fb-success" style="display:none;text-align:center;color:${d.primaryColor};font-weight:600;padding:40px 20px;border:1px solid ${d.inputBorderColor};background:${d.backgroundColor};border-radius:${d.borderRadius};">
    <h3 style="color:${d.titleColor};font-family:${d.fontFamily};">${d.successTitle}</h3>
    <p style="color:${d.descriptionColor};font-family:${d.fontFamily};">${d.successMessage}</p>
  </div>
  <script>
    document.getElementById('fb-form-el').addEventListener('submit', async function(e) {
      e.preventDefault();
      var btn = document.getElementById('fb-submit-btn');
      btn.disabled = true;
      btn.style.opacity = '0.6';
      btn.innerText = 'Submitting...';
      var formData = new FormData(e.target);
      var payload = {};
      formData.forEach(function(value, key) { payload[key] = value; });
      try {
        var response = await fetch(window.location.href, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (response.ok) {
          var action = '${d.afterSubmitAction}';
          var redirectUrl = '${d.redirectUrl}';
          if (action === 'redirect' && redirectUrl) {
            window.location.href = redirectUrl;
          } else if (action === 'clear') {
            e.target.reset();
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.innerText = '${d.footerSubmitText}';
            alert('${d.successTitle}');
          } else if (action === 'hide') {
            document.getElementById('fb-container').style.display = 'none';
          } else {
            document.getElementById('fb-form-el').style.display = 'none';
            document.getElementById('fb-success').style.display = 'block';
          }
        } else {
          alert('There was an error submitting the form. Please try again.');
          btn.disabled = false;
          btn.style.opacity = '1';
          btn.innerText = '${d.footerSubmitText}';
        }
      } catch(err) {
        console.error(err);
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.innerText = '${d.footerSubmitText}';
      }
    });
  </script>
</div>
`.trim();
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

    // Return rendered HTML form instead of JSON, using all saved appearance values
    const html = renderHtmlForm(result.data);

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
