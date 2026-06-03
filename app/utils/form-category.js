export const FORM_CATEGORIES = {
    b2b: { label: "B2B", background: "#eff6ff", color: "#1d4ed8" },
    custom: { label: "Custom", background: "#f0fdf4", color: "#047857" },
};

/** Resolve b2b | custom from metaobject data JSON or form field fallback. */
export function parseFormCategory(dataValue, formValue) {
    if (dataValue) {
        try {
            const data = JSON.parse(dataValue);
            if (data.category === "b2b" || data.category === "custom") {
                return data.category;
            }
        } catch (_) { }
    }

    const form = (formValue || "").toLowerCase();
    if (
        form.includes("wholesale") ||
        form.includes("retailer") ||
        form.includes("supplier") ||
        form.includes("vendor")
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
