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
    const borderRadius = fd.get("borderRadius") || "8px";
    const fontFamily = fd.get("fontFamily") || "Inter, sans-serif";
    const backgroundColor = fd.get("backgroundColor") || "#ffffff";
    const titleColor = fd.get("titleColor") || "#202223";
    const titleFontSize = fd.get("titleFontSize") || "26px";
    const descriptionColor = fd.get("descriptionColor") || "#6d7175";
    const descriptionFontSize = fd.get("descriptionFontSize") || "14px";
    const labelColor = fd.get("labelColor") || "#202223";
    const labelFontSize = fd.get("labelFontSize") || "14px";
    const inputBgColor = fd.get("inputBgColor") || "#ffffff";
    const inputTextColor = fd.get("inputTextColor") || "#202223";
    const inputBorderColor = fd.get("inputBorderColor") || "#bbc3c9";
    const btnTextColor = fd.get("btnTextColor") || "#ffffff";

    const afterSubmitAction = fd.get("afterSubmitAction") || "successful";
    const successTitle = fd.get("successTitle") || "Thanks for getting in touch!";
    const successMessage = fd.get("successMessage") || "";
    const redirectUrl = fd.get("redirectUrl") || "";
    const customerTag = fd.get("customerTag") || "";
    const footerText = fd.get("footerText") || "";
    const footerPreviousText = fd.get("footerPreviousText") || "Previous";
    const footerNextText = fd.get("footerNextText") || "Next";
    const footerSubmitText = fd.get("footerSubmitText") || "Submit";
    const footerShowReset = fd.get("footerShowReset") === "true";
    const footerFullWidth = fd.get("footerFullWidth") === "true";
    const multiPageLayout = fd.get("multiPageLayout") || "buttons";

    let parsedFields = [];
    try {
        parsedFields = JSON.parse(fd.get("fields") || "[]");
    } catch (_) {}
    let parsedPages = [];
    try {
        parsedPages = JSON.parse(fd.get("pages") || "[]");
    } catch (_) {}
    let parsedRules = [];
    try {
        parsedRules = JSON.parse(fd.get("rules") || "[]");
    } catch (_) {}
    let parsedEmailTemplates = null;
    try {
        parsedEmailTemplates = JSON.parse(fd.get("emailTemplates") || "null");
    } catch (_) {}
    let parsedTranslations = {};
    try {
        parsedTranslations = JSON.parse(fd.get("translations") || "{}");
    } catch (_) {}

    const bioContent = JSON.stringify({
        description: formDescription,
        headerTitle: formHeaderTitle,
        category: formCategory,
        fieldCount: parsedFields.length,
        pageCount: parsedPages.length,
        pages: parsedPages,
        primaryColor,
        borderRadius,
        fontFamily,
        backgroundColor,
        titleColor,
        titleFontSize,
        descriptionColor,
        descriptionFontSize,
        labelColor,
        labelFontSize,
        inputBgColor,
        inputTextColor,
        inputBorderColor,
        btnTextColor,
        afterSubmitAction,
        successTitle,
        successMessage,
        redirectUrl,
        customerTag,
        footerText,
        footerPreviousText,
        footerNextText,
        footerSubmitText,
        footerShowReset,
        footerFullWidth,
        multiPageLayout,
        rules: parsedRules,
        emailTemplates: parsedEmailTemplates,
        translations: parsedTranslations,
        fields: parsedFields.map((f) => ({
            ...f,
            required: !!f.required,
            placeholder: f.placeholder || "",
            page: f.page || 1,
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

    const isNew = fd.get("isNew") === "true";
    if (isNew) {
        // New form — go to the published/success page
        return redirect(`/app/form-published/${formId}?title=${encodeURIComponent(formName)}`);
    }

    // Editing existing form — stay on the same page
    return { success: true, formId };
}
