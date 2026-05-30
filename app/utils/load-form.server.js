/** Load an existing form metaobject for editing in the builder. */
export async function loadFormForEdit(admin, formId) {
    const response = await admin.graphql(
        `
        query GetFormForEdit($handle: MetaobjectHandleInput!) {
            metaobjectByHandle(handle: $handle) {
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

    const metaobject = json.data?.metaobjectByHandle;
    if (!metaobject) return null;

    const fieldMap = metaobject.fields.reduce((acc, f) => {
        acc[f.key] = f.value;
        return acc;
    }, {});

    let bio = {};
    try {
        bio = JSON.parse(fieldMap.bio || "{}");
    } catch (_) {}

    const savedFields = (bio.fields || []).map((f) => ({
        id: f.id,
        label: f.label,
        type: f.type,
        placeholder: f.placeholder || "",
        required: !!f.required,
        page: f.page || 1,
        ...(f.options ? { options: f.options } : {}),
        ...(f.singletonType ? { singletonType: f.singletonType } : {}),
    }));

    const savedPages =
        bio.pages?.length > 0
            ? bio.pages
            : Array.from({ length: Math.max(bio.pageCount || 1, 1) }, (_, i) => ({
                  id: i + 1,
                  title: `Page ${i + 1}`,
              }));

    const formName = fieldMap.full_name || "Untitled Form";

    return {
        formId: metaobject.handle,
        title: formName,
        formName,
        headerTitle: bio.headerTitle || formName,
        description: bio.description || "",
        category: bio.category || null,
        role: fieldMap.role || "",
        primaryColor: bio.primaryColor || "#008060",
        borderRadius: bio.borderRadius || "8px",
        fontFamily: bio.fontFamily || "Inter, sans-serif",
        backgroundColor: bio.backgroundColor || "#ffffff",
        titleColor: bio.titleColor || "#202223",
        titleFontSize: bio.titleFontSize || "26px",
        descriptionColor: bio.descriptionColor || "#6d7175",
        descriptionFontSize: bio.descriptionFontSize || "14px",
        labelColor: bio.labelColor || "#202223",
        labelFontSize: bio.labelFontSize || "14px",
        inputBgColor: bio.inputBgColor || "#ffffff",
        inputTextColor: bio.inputTextColor || "#202223",
        inputBorderColor: bio.inputBorderColor || "#bbc3c9",
        btnTextColor: bio.btnTextColor || "#ffffff",
        afterSubmitAction: bio.afterSubmitAction || "successful",
        successTitle: bio.successTitle || "Thanks for getting in touch!",
        successMessage: bio.successMessage || "We appreciate you contacting us. One of our colleagues will get back in touch with you soon!<br/><br/>Have a great day!",
        redirectUrl: bio.redirectUrl || "",
        customerTag: bio.customerTag || "",
        footerText: bio.footerText || "",
        footerPreviousText: bio.footerPreviousText || "Previous",
        footerNextText: bio.footerNextText || "Next",
        footerSubmitText: bio.footerSubmitText || "Submit",
        footerShowReset: !!bio.footerShowReset,
        footerFullWidth: !!bio.footerFullWidth,
        fields: savedFields,
        pages: savedPages,
        rules: bio.rules || [],
        emailTemplates: bio.emailTemplates || null,
    };
}
