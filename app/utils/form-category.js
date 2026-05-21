export const FORM_CATEGORIES = {
    b2b: { label: "B2B", background: "#eff6ff", color: "#1d4ed8" },
    custom: { label: "Custom", background: "#f0fdf4", color: "#047857" },
};

/** Resolve b2b | custom from metaobject bio JSON or role field fallback. */
export function parseFormCategory(bioValue, roleValue) {
    if (bioValue) {
        try {
            const bio = JSON.parse(bioValue);
            if (bio.category === "b2b" || bio.category === "custom") {
                return bio.category;
            }
        } catch (_) {}
    }

    const role = (roleValue || "").toLowerCase();
    if (
        role.includes("wholesale") ||
        role.includes("retailer") ||
        role.includes("supplier") ||
        role.includes("vendor")
    ) {
        return "b2b";
    }

    return "custom";
}

export function getCategoryDisplay(category) {
    return FORM_CATEGORIES[category] || FORM_CATEGORIES.custom;
}

/** Route path for the form builder that matches b2b vs custom. */
export function getEditorPathForCategory(category) {
    return category === "b2b" ? "/app/wholesale-form" : "/app/contact";
}
