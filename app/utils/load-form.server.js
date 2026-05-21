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
        fields: savedFields,
        pages: savedPages,
    };
}
