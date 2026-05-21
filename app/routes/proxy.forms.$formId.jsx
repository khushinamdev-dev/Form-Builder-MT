import { authenticate } from "../shopify.server";

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
        }
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
                404
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

        return jsonResponse(result.data);
    } catch (err) {
        if (err instanceof Response) {
            const text = await err.text().catch(() => "");
            console.error("App proxy auth error:", err.status, text);
            return jsonResponse(
                { error: "App proxy authentication failed. Reinstall the app and try again." },
                err.status || 500
            );
        }

        console.error("Storefront form proxy error:", err);
        return jsonResponse(
            { error: err.message || "Failed to load form" },
            500
        );
    }
};
