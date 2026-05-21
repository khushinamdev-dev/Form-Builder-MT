import { redirect } from "react-router";
import { authenticate } from "../../shopify.server";

export async function saveFormAction({ request }) {
    const { admin } = await authenticate.admin(request);
    const fd = await request.formData();
    const formId = fd.get("formId");
    const formName = fd.get("formName") || fd.get("formTitle") || "Untitled Form";
    const formHeaderTitle = fd.get("formHeaderTitle") || formName;
    const formDescription = fd.get("formDescription") || "";
    const formRole = fd.get("formRole") || "Form";
    const formCategory = fd.get("formCategory") === "custom" ? "custom" : "b2b";
    const primaryColor = fd.get("primaryColor") || "#008060";
    let parsedFields = [];
    try {
        parsedFields = JSON.parse(fd.get("fields") || "[]");
    } catch (_) {}
    let parsedPages = [];
    try {
        parsedPages = JSON.parse(fd.get("pages") || "[]");
    } catch (_) {}

    const bioContent = JSON.stringify({
        description: formDescription,
        headerTitle: formHeaderTitle,
        category: formCategory,
        fieldCount: parsedFields.length,
        pageCount: parsedPages.length,
        pages: parsedPages,
        primaryColor,
        fields: parsedFields.map((f) => ({
            id: f.id,
            label: f.label,
            type: f.type,
            required: !!f.required,
            placeholder: f.placeholder || "",
            page: f.page || 1,
            ...(f.options ? { options: f.options } : {}),
            ...(f.singletonType ? { singletonType: f.singletonType } : {}),
        })),
    });

    const response = await admin.graphql(
        `
        mutation UpsertFormProfile(
            $handle: MetaobjectHandleInput!
            $metaobject: MetaobjectUpsertInput!
        ) {
            metaobjectUpsert(handle: $handle, metaobject: $metaobject) {
                metaobject { id handle }
                userErrors { field message }
            }
        }
    `,
        {
            variables: {
                handle: { type: "$app:profile", handle: formId },
                metaobject: {
                    fields: [
                        { key: "full_name", value: formName },
                        { key: "email", value: "form@app.local" },
                        { key: "role", value: formRole },
                        { key: "bio", value: bioContent },
                        { key: "active", value: "true" },
                        { key: "rating", value: "5" },
                    ],
                },
            },
        }
    );

    const json = await response.json();
    const userErrors = json.data?.metaobjectUpsert?.userErrors;
    if (userErrors?.length) {
        return { error: userErrors.map((e) => e.message).join(", ") };
    }
    return redirect(`/app/form-published/${formId}?title=${encodeURIComponent(formName)}`);
}
