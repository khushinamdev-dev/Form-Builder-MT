import { useState } from "react";
import { useNavigate } from "react-router";

// Initial set of fields for the Wholesale Form
const initialFields = [
    { id: "email",        label: "Email",                       type: "email",  placeholder: "Enter your email",              required: true  },
    { id: "website",      label: "Company Website",              type: "url",    placeholder: "https://example.com",           required: true,  singletonType: "biz-website"  },
    { id: "phone",        label: "Phone Number",                 type: "tel",    placeholder: "+91 81234 56789",               required: false },
    { id: "lastName",     label: "Last Name",                    type: "text",   placeholder: "Enter last name",               required: true  },
    { id: "firstName",    label: "First Name",                   type: "text",   placeholder: "Enter first name",              required: true  },
    { id: "address",      label: "Company Address",              type: "text",   placeholder: "Enter company address",         required: true,  singletonType: "biz-address"  },
    { id: "businessType", label: "Type of Business",             type: "text",   placeholder: "e.g. Retailer, Distributor",    required: true,  singletonType: "biz-type"     },
    { id: "taxId",        label: "Tax ID/EIN",                   type: "text",   placeholder: "Enter Tax ID",                  required: true,  singletonType: "biz-tax-id"   },
    { id: "taxDoc",       label: "State Tax ID Documentation",   type: "file",   placeholder: "",                              required: false, singletonType: "biz-tax-doc"  },
    { id: "referral",     label: "How did you hear about us?",   type: "select", options: ["Google", "Social Media", "Word of Mouth", "Other"], required: false }
];

// Helper function to return SVG icon for a field type
const getFieldIcon = (type) => {
    switch (type) {
        case "email":
            return (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
            );
        case "url":
            return (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" >
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
            );
        case "tel":
        case "phone":
            return (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
            );
        case "password":
            return (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
            );
        case "country":
            return (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
            );
        case "checkboxes":
        case "consent":
            return (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 11 12 14 22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
            );
        case "select":
        case "dropdown":
            return (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            );
        case "radio":
            return (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
            );
        case "button":
            return (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M15 15l-3-3 3-3" />
                    <path d="M18 12H6" />
                </svg>
            );
        case "number":
            return (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="4" y1="9" x2="20" y2="9" />
                    <line x1="4" y1="15" x2="20" y2="15" />
                    <line x1="10" y1="3" x2="8" y2="21" />
                    <line x1="16" y1="3" x2="14" y2="21" />
                </svg>
            );
        case "rating":
            return (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            );
        case "heading":
            return (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="4" x2="4" y2="20" />
                    <line x1="20" y1="4" x2="20" y2="20" />
                </svg>
            );
        case "paragraph":
            return (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="21" y1="10" x2="3" y2="10" />
                    <line x1="21" y1="6" x2="3" y2="6" />
                    <line x1="21" y1="14" x2="3" y2="14" />
                    <line x1="21" y1="18" x2="3" y2="18" />
                </svg>
            );
        case "divider":
            return (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            );
        case "textarea":
            return (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M21 12H3M12 3v18" />
                </svg>
            );
        default:
            return (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" >
                    <path d="M4 7V4h16v3M9 20h6M12 4v16" />
                </svg>
            );
    }
};

const tabs = [
    {
        id: "elements", label: "Elements", icon: "theme-template"
    },
    { id: "appearance", label: "Appearance", icon: "paint-brush-round" },
    { id: "after-submit", label: "After submit", icon: "cursor" },
    { id: "mail", label: "Mail", icon: "email" },
    { id: "settings", label: "Settings", icon: "settings" }
];

// Business/Company singleton field definitions (only one of each allowed per form)
const businessFields = [
    { id: "biz-company-name", label: "Company Name", icon: "🏢", singletonType: "biz-company-name" },
    { id: "biz-company-email", label: "Business Email", icon: "📧", singletonType: "biz-company-email" },
    { id: "biz-company-phone", label: "Business Phone", icon: "☎", singletonType: "biz-company-phone" },
    { id: "biz-address", label: "Company Address", icon: "📍", singletonType: "biz-address" },
    { id: "biz-city", label: "City", icon: "🌆", singletonType: "biz-city" },
    { id: "biz-state", label: "State / Province", icon: "🗺", singletonType: "biz-state" },
    { id: "biz-zip", label: "ZIP / Postal Code", icon: "📮", singletonType: "biz-zip" },
    { id: "biz-country", label: "Country", icon: "🌍", singletonType: "biz-country" },
    { id: "biz-tax-id", label: "Tax ID / EIN", icon: "🪪", singletonType: "biz-tax-id" },
    { id: "biz-vat", label: "VAT Number", icon: "📑", singletonType: "biz-vat" },
    { id: "biz-reg-number", label: "Registration Number", icon: "🔖", singletonType: "biz-reg-number" },
    { id: "biz-industry", label: "Industry / Sector", icon: "🏭", singletonType: "biz-industry" },
    { id: "biz-type", label: "Business Type", icon: "🗂", singletonType: "biz-type" },
    { id: "biz-employees", label: "No. of Employees", icon: "👥", singletonType: "biz-employees" },
    { id: "biz-website", label: "Company Website", icon: "🔗", singletonType: "biz-website" },
    { id: "biz-tax-doc", label: "Tax Documentation", icon: "📎", singletonType: "biz-tax-doc" },
];

const elementCategories = [
    {
        title: "Business / Company",
        isBusiness: true,
        items: businessFields
    },
    {
        title: "Contact info",
        items: [
            { id: "email", label: "Email", icon: "✉" },
            { id: "name", label: "Name", icon: "@" },
            { id: "phone", label: "Phone", icon: "📞" },
            { id: "password", label: "Password", icon: "🔑" },
            { id: "country", label: "Country", icon: "🌐" }
        ]
    },
    {
        title: "Text",
        items: [
            { id: "text", label: "Text", icon: "Aa" },
            { id: "textarea", label: "Textarea", icon: "📝" }
        ]
    },
    {
        title: "Selects",
        items: [
            { id: "checkboxes", label: "Checkboxes", icon: "☑" },
            { id: "dropdown", label: "Dropdown", icon: "▼" },
            { id: "radio", label: "Radio buttons", icon: "◉" },
            { id: "consent", label: "Consent", icon: "✔" },
            { id: "image-options", label: "Image options", icon: "🖼" },
            { id: "button", label: "Button", icon: "🖱" },
            { id: "switch", label: "Switch", icon: "⚙" }
        ]
    },
    {
        title: "Number",
        items: [
            { id: "number", label: "Number", icon: "#" },
            { id: "range", label: "Range slider", icon: "⇔" }
        ]
    },
    {
        title: "Input",
        items: [
            { id: "url", label: "Url", icon: "🔗" },
            { id: "date", label: "Date time", icon: "📅" },
            { id: "file", label: "File upload", icon: "📎" },
            { id: "color", label: "Color picker", icon: "🎨" }
        ]
    },
    {
        title: "Ratings",
        items: [
            { id: "rating", label: "Rating star", icon: "★" },
            { id: "feedback", label: "Feedback", icon: "💬" }
        ]
    },
    {
        title: "Products",
        items: [
            { id: "product", label: "Product", icon: "📦" },
            { id: "quantity", label: "Quantity", icon: "🔢" },
            { id: "color-swatch", label: "Color swatch", icon: "🎨" }
        ]
    },
    {
        title: "Advanced",
        items: [
            { id: "repeater", label: "Repeater", icon: "↻" },
            { id: "signature", label: "Signature", icon: "✍" },
            { id: "hidden", label: "Hidden", icon: "👁" },
            { id: "matrix", label: "Matrix", icon: "⊞" },
            { id: "html", label: "HTML", icon: "<>" }
        ]
    },
    {
        title: "Static text",
        items: [
            { id: "heading", label: "Heading", icon: "T" },
            { id: "paragraph", label: "Paragraph", icon: "¶" },
            { id: "divider", label: "Divider", icon: "―" }
        ]
    }
];

export default function WholesaleForm() {


    const navigate = useNavigate();

    // Builder states
    const [fields, setFields] = useState(initialFields);
    const [selectedFieldId, setSelectedFieldId] = useState(null);
    const [activeTab, setActiveTab] = useState("elements"); // "elements" | "appearance" | "after-submit" | "mail" | "integration" | "settings"
    const [previewMode, setPreviewMode] = useState("desktop"); // "desktop" | "mobile"
    const [formTitle, setFormTitle] = useState("Wholesale Application");
    const [formDescription, setFormDescription] = useState("Submit your information and we'll get back to you shortly.");
    const [bannerVisible, setBannerVisible] = useState(true);
    const [toastMessage, setToastMessage] = useState("");
    const [showAddMenu, setShowAddMenu] = useState(false);

    // Form Styling States (for the Appearance tab)
    const [primaryColor, setPrimaryColor] = useState("#008060");
    const [borderRadius, setBorderRadius] = useState("8px");
    const [fontFamily, setFontFamily] = useState("Inter, sans-serif");
    const [backgroundColor, setBackgroundColor] = useState("#ffffff");

    // After Submit States
    const [successTitle, setSuccessTitle] = useState("Application Submitted!");
    const [successMessage, setSuccessMessage] = useState("Thank you for your application! We will review your details and contact you shortly.");

    // Integration States
    const [customerTag, setCustomerTag] = useState("Wholesale");
    const [syncMetafields, setSyncMetafields] = useState(true);

    // Show Toast helper
    const triggerToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => {
            setToastMessage("");
        }, 3000);
    };

    // Field Reordering Helpers
    const moveField = (index, direction) => {
        const newIndex = direction === "up" ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= fields.length) return;
        const updated = [...fields];
        const temp = updated[index];
        updated[index] = updated[newIndex];
        updated[newIndex] = temp;
        setFields(updated);
        triggerToast("Field reordered");
    };

    // Delete Field
    const deleteField = (id) => {
        setFields(fields.filter(f => f.id !== id));
        if (selectedFieldId === id) setSelectedFieldId(null);
        triggerToast("Field removed");
    };

    // Add Field — handles both regular types and singleton business fields
    const addField = (type, customLabel, singletonType) => {
        // Block re-adding a singleton business field that is already in the form
        if (singletonType && fields.some(f => f.singletonType === singletonType)) return;
        const id = `field_${Date.now()}`;
        let label = customLabel || `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`;
        let placeholder = `Enter ${label.toLowerCase()}`;
        let options = undefined;

        if (type === "select" || type === "dropdown") {
            placeholder = "Select option...";
            options = ["Option 1", "Option 2", "Option 3"];
        } else if (type === "checkboxes" || type === "radio" || type === "image-options") {
            options = ["Option 1", "Option 2"];
        } else if (type === "divider") {
            label = "Divider";
            placeholder = "";
        } else if (type === "paragraph") {
            label = "Paragraph text content";
            placeholder = "Enter your paragraph text here...";
        } else if (type === "heading") {
            label = "Heading Title";
            placeholder = "";
        } else if (type === "rating" || type === "feedback") {
            placeholder = "";
        } else if (type === "switch") {
            label = customLabel || "Toggle Switch";
            placeholder = "";
        } else if (type === "range") {
            label = customLabel || "Range Slider";
            placeholder = "";
        } else if (type === "date") {
            placeholder = "Select date & time";
        } else if (type === "file") {
            placeholder = "";
        } else if (type === "color" || type === "color-swatch") {
            placeholder = "";
        } else if (type === "product") {
            label = customLabel || "Product Selector";
            placeholder = "";
        } else if (type === "quantity") {
            label = customLabel || "Quantity";
            placeholder = "1";
        } else if (type === "repeater") {
            label = customLabel || "Repeater Group";
            placeholder = "";
        } else if (type === "signature") {
            label = customLabel || "Signature";
            placeholder = "";
        } else if (type === "hidden") {
            label = customLabel || "Hidden Field";
            placeholder = "";
        } else if (type === "matrix") {
            label = customLabel || "Matrix / Grid";
            options = ["Row 1", "Row 2"];
            placeholder = "";
        } else if (type === "html") {
            label = customLabel || "Custom HTML";
            placeholder = "<p>Your custom HTML here...</p>";
        }

        const newField = {
            id,
            label,
            type,
            placeholder,
            required: false,
            ...(options ? { options } : {}),
            ...(singletonType ? { singletonType } : {})
        };
        setFields([...fields, newField]);
        setSelectedFieldId(id);
        setShowAddMenu(false);
        triggerToast(`${label} added`);
    };

    // Selected field details
    const selectedField = fields.find(f => f.id === selectedFieldId);

    // Update selected field property
    const updateSelectedField = (key, value) => {
        setFields(fields.map(f => {
            if (f.id === selectedFieldId) {
                return { ...f, [key]: value };
            }
            return f;
        }));
    };

    // Save Mock
    const handleSave = () => {
        triggerToast("Wholesale Form saved successfully!");
    };

    return (
        <s-page>
            {/* Top Header Bar using Spruce Stack */}
            <s-stack direction="inline" justifyContent="space-between" alignItems="center" padding="base">
                <s-stack direction="inline" alignItems="center" gap="base">
                    <s-button onClick={() => navigate("/app/template")}>
                        <s-icon type="arrow-left" > </s-icon>
                    </s-button>
                    <s-heading>Wholesale form</s-heading>
                </s-stack>

                <s-stack direction="inline" alignItems="center" gap="base">
                    {/* Viewport switches */}
                    <s-button-group>
                        <s-button
                            variant={previewMode === "mobile" ? "primary" : "secondary"}
                            onClick={() => setPreviewMode("mobile")}
                        >
                            Mobile
                        </s-button>
                        <s-button
                            variant={previewMode === "desktop" ? "primary" : "secondary"}
                            onClick={() => setPreviewMode("desktop")}
                        >
                            Desktop
                        </s-button>
                    </s-button-group>


                </s-stack>
            </s-stack>
            {/* Horizontal Navigation Tabs (Placed above middle elements panel) */}
            <s-stack direction="inline" gap="base" padding="base">
                {tabs.map((tab) => (
                    <s-button
                        key={tab.id}
                        variant={activeTab === tab.id ? "secondary" : "tertiary"}
                        onClick={() => { setActiveTab(tab.id); setSelectedFieldId(null); }}
                    >
                        <s-stack direction="inline" gap="base" minInlineSize="150px" alignItems="center" justifyContent="center" inlineSize="fill" >

                            <s-icon type={tab.icon} color="subdued"></s-icon>
                            {tab.label}
                        </s-stack>
                    </s-button>
                ))}
            </s-stack>


            {/* Main Workspace Layout using Spruce Grid */}
            <s-grid gridTemplateColumns="repeat(12, 1fr)" gap="none" >

                {/* Left Side Pane: Horizontal Nav Tab + Elements List */}
                <s-grid-item gridColumn="span 4">



                    {/* Sub-Pane Body based on activeTab */}
                    <s-stack padding="base" gap="base" style={{ flex: 1, overflowY: "auto" }}>
                        {activeTab === "elements" && (
                            <>
                                {selectedFieldId === null ? (
                                    // Normal Elements list panel
                                    <s-section padding="none" gap="none" >
                                        <s-stack padding="base" gap="base">
                                            <s-heading level="3">Elements</s-heading>

                                            <s-stack gap="base">
                                                {/* Page 1 Tree Node */}
                                                <s-stack gap="small">

                                                    {/* Page 1 Title Row */}
                                                    <s-stack direction="inline" alignItems="center" gap="small" style={{ cursor: "pointer", padding: "4px 8px" }}>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: "#6d7175" }}>
                                                            <path d="m6 9 6 6 6-6" />
                                                        </svg>
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: "#6d7175" }}>
                                                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                                                        </svg>
                                                        <s-text style={{ fontSize: "14px", fontWeight: "600", color: "#202223" }}>Page 1</s-text>
                                                    </s-stack>

                                                    {/* Indented Fields Tree with Left Dotted Line */}
                                                    <s-stack className="tree-dotted-line">
                                                        {fields.map((field, idx) => (
                                                            <s-box
                                                                key={field.id}
                                                                className={`tree-field-item ${selectedFieldId === field.id ? "active" : ""}`}
                                                                onClick={() => setSelectedFieldId(field.id)}
                                                                padding="none"
                                                                style={{ border: "none", background: "none" }}
                                                            >
                                                                <s-stack direction="inline" alignItems="center" gap="small" style={{ flex: 1, minWidth: 0 }}>
                                                                    <s-text className="field-type-icon">
                                                                        {getFieldIcon(field.type)}
                                                                    </s-text>
                                                                    <s-text className="field-label-text">{field.label}</s-text>
                                                                </s-stack>
                                                            </s-box>
                                                        ))}

                                                        {/* Add element button inside the indent */}
                                                        <s-box
                                                            className="add-tree-item"
                                                            onClick={() => setShowAddMenu(true)}
                                                            padding="none"
                                                            style={{ border: "none", background: "none" }}
                                                        >
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#005ccc" strokeWidth="2.5">
                                                                <circle cx="12" cy="12" r="10" />
                                                                <line x1="12" y1="8" x2="12" y2="16" />
                                                                <line x1="8" y1="12" x2="16" y2="12" />
                                                            </svg>
                                                            <s-text style={{ color: "#005ccc", fontSize: "14px", fontWeight: "500" }}>Add element</s-text>
                                                        </s-box>
                                                    </s-stack>
                                                </s-stack>

                                                {/* Add page button outside the indent */}
                                                <s-box
                                                    className="add-tree-item"
                                                    style={{ marginLeft: "8px", marginTop: "4px", border: "none", background: "none" }}
                                                    padding="none"
                                                >
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#005ccc" strokeWidth="2.5">
                                                        <circle cx="12" cy="12" r="10" />
                                                        <line x1="12" y1="8" x2="12" y2="16" />
                                                        <line x1="8" y1="12" x2="16" y2="12" />
                                                    </svg>
                                                    <s-text style={{ color: "#005ccc", fontSize: "14px", fontWeight: "500" }}>Add page</s-text>
                                                </s-box>
                                            </s-stack>

                                            {/* {bannerVisible && (
                                                <s-box padding="base" style={{ background: "rgba(0, 128, 96, 0.04)", border: "1px solid rgba(0, 128, 96, 0.15)", borderRadius: "6px", position: "relative", marginTop: "auto" }}>
                                                    <s-stack direction="inline" justifyContent="space-between" alignItems="flex-start">
                                                        <s-stack gap="small">
                                                            <s-text style={{ fontSize: "12px", color: "#202223" }}>Looking for a form to schedule appointments?</s-text>
                                                            <s-text style={{ fontSize: "12px", color: "#008060", textDecoration: "underline", fontWeight: "500", cursor: "pointer" }}>Try Appointment Booking!</s-text>
                                                        </s-stack>
                                                        <s-button variant="secondary" onClick={() => setBannerVisible(false)} style={{ minWidth: "auto", padding: "0 6px" }}>×</s-button>
                                                    </s-stack>
                                                </s-box>
                                            )} */}
                                        </s-stack>
                                    </s-section>
                                ) : (


                                    // Detail Editor when a field is selected
                                    <s-section>
                                        <s-stack gap="base">
                                            <s-stack direction="inline" alignItems="center" gap="base" style={{ borderBottom: "1px solid #e1e3e5", paddingBottom: "12px" }}>
                                                <s-button variant="secondary" onClick={() => setSelectedFieldId(null)}>
                                                    <s-icon type="arrow-left"></s-icon>
                                                </s-button>
                                                <s-heading level="3">Edit Field</s-heading>
                                            </s-stack>

                                            <s-stack gap="base">
                                                <s-text-field
                                                    label="Field Label"
                                                    value={selectedField.label}
                                                    onChange={(e) => updateSelectedField("label", e.currentTarget.value)}
                                                ></s-text-field>

                                                {selectedField.type !== "file" && selectedField.type !== "select" && selectedField.type !== "dropdown" && selectedField.type !== "checkboxes" && selectedField.type !== "radio" && selectedField.type !== "divider" && selectedField.type !== "rating" && (
                                                    <s-text-field
                                                        label="Placeholder / Default Text"
                                                        value={selectedField.placeholder || ""}
                                                        onChange={(e) => updateSelectedField("placeholder", e.currentTarget.value)}
                                                    ></s-text-field>
                                                )}

                                                {(selectedField.type === "select" || selectedField.type === "dropdown" || selectedField.type === "checkboxes" || selectedField.type === "radio") && (
                                                    <s-text-field
                                                        label="Options (comma separated)"
                                                        value={selectedField.options ? selectedField.options.join(", ") : ""}
                                                        onChange={(e) => updateSelectedField("options", e.currentTarget.value.split(",").map(s => s.trim()))}
                                                    ></s-text-field>
                                                )}

                                                {selectedField.type !== "heading" && selectedField.type !== "paragraph" && selectedField.type !== "divider" && selectedField.type !== "button" && (
                                                    <s-stack direction="inline" gap="small" alignItems="center" style={{ marginTop: "8px" }}>
                                                        <input
                                                            type="checkbox"
                                                            id="required-checkbox"
                                                            checked={selectedField.required || false}
                                                            onChange={(e) => updateSelectedField("required", e.target.checked)}
                                                            style={{ width: "16px", height: "16px", accentColor: "#008060", cursor: "pointer" }}
                                                        />
                                                        <label htmlFor="required-checkbox" style={{ fontSize: "13px", color: "#202223", cursor: "pointer" }}>Required field</label>
                                                    </s-stack>
                                                )}

                                                <s-divider></s-divider>

                                                <s-button variant="secondary" tone="critical" onClick={() => deleteField(selectedField.id)} style={{ width: "100%" }}>
                                                    Delete Field
                                                </s-button>
                                            </s-stack>
                                        </s-stack>
                                    </s-section>
                                )}
                            </>
                        )}

                        {activeTab === "appearance" && (
                            <s-stack gap="base">
                                <s-heading level="3">Appearance settings</s-heading>

                                <s-stack gap="small">
                                    <s-text style={{ fontSize: "12px", color: "#6d7175" }}>Primary Brand Color</s-text>
                                    <s-stack direction="inline" gap="small">
                                        <input
                                            type="color"
                                            value={primaryColor}
                                            onChange={(e) => setPrimaryColor(e.target.value)}
                                            style={{ width: "42px", height: "38px", padding: "0", border: "1px solid #bbc3c9", cursor: "pointer" }}
                                        />
                                        <s-text-field
                                            value={primaryColor}
                                            onChange={(e) => setPrimaryColor(e.currentTarget.value)}
                                            style={{ flex: 1 }}
                                        ></s-text-field>
                                    </s-stack>
                                </s-stack>

                                <s-select
                                    label="Border Radius"
                                    value={borderRadius}
                                    onChange={(e) => setBorderRadius(e.currentTarget.value)}
                                >
                                    <s-option value="0px">Square (0px)</s-option>
                                    <s-option value="4px">Soft (4px)</s-option>
                                    <s-option value="8px">Standard (8px)</s-option>
                                    <s-option value="16px">Rounded (16px)</s-option>
                                    <s-option value="30px">Pill (30px)</s-option>
                                </s-select>

                                <s-select
                                    label="Font Family"
                                    value={fontFamily}
                                    onChange={(e) => setFontFamily(e.currentTarget.value)}
                                >
                                    <s-option value="Inter, sans-serif">Inter</s-option>
                                    <s-option value="Outfit, sans-serif">Outfit</s-option>
                                    <s-option value="system-ui, sans-serif">System UI</s-option>
                                    <s-option value="Georgia, serif">Georgia</s-option>
                                </s-select>

                                <s-stack gap="small">
                                    <s-text style={{ fontSize: "12px", color: "#6d7175" }}>Form Background</s-text>
                                    <s-stack direction="inline" gap="small">
                                        <input
                                            type="color"
                                            value={backgroundColor}
                                            onChange={(e) => setBackgroundColor(e.target.value)}
                                            style={{ width: "42px", height: "38px", padding: "0", border: "1px solid #bbc3c9", cursor: "pointer" }}
                                        />
                                        <s-text-field
                                            value={backgroundColor}
                                            onChange={(e) => setBackgroundColor(e.currentTarget.value)}
                                            style={{ flex: 1 }}
                                        ></s-text-field>
                                    </s-stack>
                                </s-stack>
                            </s-stack>
                        )}

                        {activeTab === "after-submit" && (
                            <s-stack gap="base">
                                <s-heading level="3">After Submit Workflow</s-heading>
                                <s-text style={{ fontSize: "12px", color: "#6d7175", lineHeight: "1.4" }}>
                                    Configure what happens directly after a customer successfully submits this form.
                                </s-text>

                                <s-text-field
                                    label="Success Message Heading"
                                    value={successTitle}
                                    onChange={(e) => setSuccessTitle(e.currentTarget.value)}
                                ></s-text-field>

                                <s-stack gap="small">
                                    <s-text style={{ fontSize: "12px", color: "#6d7175" }}>Success Message Description</s-text>
                                    <textarea
                                        value={successMessage}
                                        onChange={(e) => setSuccessMessage(e.target.value)}
                                        rows={4}
                                        style={{ border: "1px solid #bbc3c9", borderRadius: "6px", padding: "8px 12px", fontSize: "13px", width: "100%", boxSizing: "border-box" }}
                                    />
                                </s-stack>

                                <s-select label="Submission Action" value="message">
                                    <s-option value="message">Display Success Message</s-option>
                                    <s-option value="redirect">Redirect to a Custom Page</s-option>
                                </s-select>
                            </s-stack>
                        )}

                        {activeTab === "mail" && (
                            <s-stack gap="base">
                                <s-heading level="3">Mail & Notifications</s-heading>
                                <s-text style={{ fontSize: "12px", color: "#6d7175", lineHeight: "1.4" }}>
                                    Configure automatic emails sent when users submit this wholesale form.
                                </s-text>

                                <s-box padding="base" style={{ border: "1px solid #e1e3e5", borderRadius: "6px", background: "#fafafb" }}>
                                    <s-stack gap="small">
                                        <s-stack direction="inline" justifyContent="space-between" alignItems="center">
                                            <s-text style={{ fontWeight: "600" }}>Confirmation Email</s-text>
                                            <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: "#e2f1e8", color: "#008060", fontWeight: "600" }}>Active</span>
                                        </s-stack>
                                        <s-text style={{ fontSize: "13px", color: "#6d7175" }}>Sent to: Submitter</s-text>
                                        <s-button variant="secondary" style={{ marginTop: "4px" }}>Customize template</s-button>
                                    </s-stack>
                                </s-box>

                                <s-box padding="base" style={{ border: "1px solid #e1e3e5", borderRadius: "6px", background: "#fafafb" }}>
                                    <s-stack gap="small">
                                        <s-stack direction="inline" justifyContent="space-between" alignItems="center">
                                            <s-text style={{ fontWeight: "600" }}>New Submission Alert</s-text>
                                            <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: "#e2f1e8", color: "#008060", fontWeight: "600" }}>Active</span>
                                        </s-stack>
                                        <s-text style={{ fontSize: "13px", color: "#6d7175" }}>Sent to: Admin</s-text>
                                        <s-button variant="secondary" style={{ marginTop: "4px" }}>Customize template</s-button>
                                    </s-stack>
                                </s-box>
                            </s-stack>
                        )}

                        {activeTab === "integration" && (
                            <s-stack gap="base">
                                <s-heading level="3">Integrations & Syncing</s-heading>
                                <s-text style={{ fontSize: "12px", color: "#6d7175", lineHeight: "1.4" }}>
                                    Connect the registration form data directly with your Shopify storefront backend.
                                </s-text>

                                <s-text-field
                                    label="Apply Customer Tags"
                                    value={customerTag}
                                    onChange={(e) => setCustomerTag(e.currentTarget.value)}
                                    details="Comma separated tags to assign to the registered customer account."
                                ></s-text-field>

                                <s-stack direction="inline" gap="small" alignItems="center" style={{ marginTop: "8px" }}>
                                    <input
                                        type="checkbox"
                                        id="sync-metafield"
                                        checked={syncMetafields}
                                        onChange={(e) => setSyncMetafields(e.target.checked)}
                                        style={{ width: "16px", height: "16px", accentColor: "#008060", cursor: "pointer" }}
                                    />
                                    <label htmlFor="sync-metafield" style={{ fontSize: "13px", color: "#202223", cursor: "pointer" }}>Sync details to customer metafields</label>
                                </s-stack>
                            </s-stack>
                        )}

                        {activeTab === "settings" && (
                            <s-stack gap="base">
                                <s-heading level="3">General Settings</s-heading>

                                <s-stack gap="small">
                                    <s-text style={{ fontSize: "12px", color: "#6d7175" }}>Success Message Heading</s-text>
                                    <s-text-field value={successTitle} onChange={(e) => setSuccessTitle(e.currentTarget.value)}></s-text-field>
                                </s-stack>

                                <s-stack direction="inline" gap="small" alignItems="center" style={{ marginTop: "8px" }}>
                                    <input type="checkbox" id="auto-tag-field" defaultChecked style={{ width: "16px", height: "16px", accentColor: "#008060", cursor: "pointer" }} />
                                    <label htmlFor="auto-tag-field" style={{ fontSize: "13px", color: "#202223", cursor: "pointer" }}>Auto-tag customer as "Wholesale"</label>
                                </s-stack>

                                <s-stack direction="inline" gap="small" alignItems="center">
                                    <input type="checkbox" id="require-account-field" style={{ width: "16px", height: "16px", accentColor: "#008060", cursor: "pointer" }} />
                                    <label htmlFor="require-account-field" style={{ fontSize: "13px", color: "#202223", cursor: "pointer" }}>Require customer login before submission</label>
                                </s-stack>
                            </s-stack>
                        )}
                    </s-stack>
                </s-grid-item>

                {/* Center / Right Area: Preview Canvas Workspace */}
                <s-grid-item gridColumn="span 8" style={{ overflowY: "auto", padding: "40px 20px", display: "flex", justifyContent: "center", alignItems: "flex-start" }}>

                    {/* Conditional Mobile Frame container */}
                    <div className={`preview-container ${previewMode}`}>
                        {previewMode === "mobile" && (
                            <div className="mobile-frame-header">
                                <div className="camera-notch"></div>
                                <div className="mobile-status-indicators">
                                    <span>9:41</span>
                                    <div className="right-indicators">📶 🔋</div>
                                </div>
                            </div>
                        )}

                        <div
                            style={{
                                fontFamily: fontFamily,
                                borderRadius: borderRadius,
                                backgroundColor: backgroundColor,
                                minHeight: "100%",
                                padding: "32px",
                                boxSizing: "border-box"
                            }}
                        >
                            {/* Form Header */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "28px", textAlign: "center" }}>
                                <h1
                                    className="preview-title"
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => setFormTitle(e.currentTarget.textContent || "")}
                                >
                                    {formTitle}
                                </h1>
                                <p
                                    className="preview-description"
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => setFormDescription(e.currentTarget.textContent || "")}
                                >
                                    {formDescription}
                                </p>
                            </div>

                            {/* Form Fields Grid */}
                            <div style={{ display: "grid", gridTemplateColumns: previewMode === "mobile" ? "1fr" : "1fr 1fr", gap: "16px" }}>
                                {fields.map((field) => (
                                    <div
                                        key={field.id}
                                        style={{ gridColumn: ["file", "select", "dropdown", "textarea", "heading", "paragraph", "divider", "button", "repeater", "matrix", "html", "image-options", "signature", "product", "feedback", "hidden"].includes(field.type) ? "span 2" : "span 1" }}
                                    >
                                        <div
                                            style={{
                                                padding: "8px",
                                                border: selectedFieldId === field.id ? "1px solid #008060" : "1px solid transparent",
                                                borderRadius: "6px",
                                                cursor: "pointer"
                                            }}
                                            onClick={() => setSelectedFieldId(field.id)}
                                        >
                                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                                {field.type !== "heading" && field.type !== "paragraph" && field.type !== "divider" && field.type !== "button" && field.type !== "hidden" && (
                                                    <label style={{ fontSize: "13px", fontWeight: "500", color: "#202223", display: "block" }}>
                                                        {field.label} {field.required && <span style={{ color: "#d82c0d", fontWeight: "bold" }}>*</span>}
                                                    </label>
                                                )}

                                                {field.type === "heading" ? (
                                                    <h3 style={{ fontSize: "18px", fontWeight: "600", margin: "8px 0 2px 0", color: "#202223" }}>{field.label}</h3>
                                                ) : field.type === "paragraph" ? (
                                                    <p style={{ fontSize: "13px", color: "#6d7175", margin: "2px 0 6px 0", lineHeight: "1.4" }}>{field.placeholder || "Paragraph text goes here..."}</p>
                                                ) : field.type === "divider" ? (
                                                    <hr style={{ border: "none", borderTop: "1px dashed #dcdfe3", margin: "12px 0 4px 0" }} />
                                                ) : field.type === "hidden" ? (
                                                    <div style={{ padding: "8px 12px", background: "#f6f6f7", border: "1px dashed #bbc3c9", borderRadius: "6px", fontSize: "12px", color: "#6d7175", display: "flex", alignItems: "center", gap: "6px" }}>
                                                        <span>👁</span> Hidden field — not visible to users
                                                    </div>
                                                ) : field.type === "rating" || field.type === "feedback" ? (
                                                    <div style={{ display: "flex", gap: "6px", fontSize: "20px", color: "#ffb400", padding: "4px 0" }}>
                                                        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                                                    </div>
                                                ) : field.type === "button" ? (
                                                    <button style={{ backgroundColor: primaryColor, color: "#ffffff", border: "none", padding: "10px 16px", borderRadius: borderRadius, width: "100%", fontWeight: "500", fontSize: "14px", cursor: "pointer" }}>
                                                        {field.label}
                                                    </button>
                                                ) : field.type === "switch" ? (
                                                    <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "6px 0" }}>
                                                        <div style={{ width: "40px", height: "22px", background: "#bbc3c9", borderRadius: "11px", position: "relative", cursor: "pointer" }}>
                                                            <div style={{ width: "18px", height: "18px", background: "#fff", borderRadius: "50%", position: "absolute", top: "2px", left: "2px", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                                                        </div>
                                                        <span style={{ fontSize: "13px", color: "#6d7175" }}>Off</span>
                                                    </div>
                                                ) : field.type === "range" ? (
                                                    <div style={{ padding: "8px 0" }}>
                                                        <input type="range" min="0" max="100" defaultValue="50" style={{ width: "100%", accentColor: primaryColor }} />
                                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#6d7175" }}><span>0</span><span>100</span></div>
                                                    </div>
                                                ) : field.type === "color" || field.type === "color-swatch" ? (
                                                    <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "4px 0" }}>
                                                        <input type="color" defaultValue={primaryColor} style={{ width: "38px", height: "38px", border: "1px solid #dcdfe3", borderRadius: "6px", padding: "2px", cursor: "pointer" }} />
                                                        <span style={{ fontSize: "13px", color: "#6d7175" }}>{field.type === "color-swatch" ? "Pick a color swatch" : "Pick a color"}</span>
                                                    </div>
                                                ) : field.type === "signature" ? (
                                                    <div style={{ height: "80px", border: "1px dashed #bbc3c9", borderRadius: "6px", background: "#fafafa", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#6d7175" }}>
                                                        ✍ Sign here
                                                    </div>
                                                ) : field.type === "product" ? (
                                                    <div style={{ border: "1px solid #dcdfe3", borderRadius: "6px", padding: "10px 12px", background: "#f6f6f7", display: "flex", alignItems: "center", gap: "10px" }}>
                                                        <div style={{ width: "36px", height: "36px", background: "#e1e3e5", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>📦</div>
                                                        <span style={{ fontSize: "13px", color: "#6d7175" }}>Select a product...</span>
                                                    </div>
                                                ) : field.type === "quantity" ? (
                                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                        <button style={{ width: "32px", height: "32px", border: "1px solid #dcdfe3", borderRadius: "6px", background: "#fff", fontSize: "16px", cursor: "pointer" }}>−</button>
                                                        <input type="number" defaultValue="1" min="1" style={{ width: "60px", height: "32px", textAlign: "center", border: "1px solid #dcdfe3", borderRadius: "6px", fontSize: "14px" }} />
                                                        <button style={{ width: "32px", height: "32px", border: "1px solid #dcdfe3", borderRadius: "6px", background: "#fff", fontSize: "16px", cursor: "pointer" }}>+</button>
                                                    </div>
                                                ) : field.type === "repeater" ? (
                                                    <div style={{ border: "1px dashed #bbc3c9", borderRadius: "6px", padding: "12px", background: "#fafafa" }}>
                                                        <div style={{ fontSize: "12px", color: "#6d7175", marginBottom: "8px" }}>↻ Repeater group</div>
                                                        <div style={{ height: "30px", background: "#e1e3e5", borderRadius: "4px" }} />
                                                        <button style={{ marginTop: "8px", fontSize: "12px", color: primaryColor, background: "none", border: `1px solid ${primaryColor}`, borderRadius: "4px", padding: "4px 8px", cursor: "pointer" }}>+ Add item</button>
                                                    </div>
                                                ) : field.type === "matrix" ? (
                                                    <div style={{ overflowX: "auto" }}>
                                                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                                                            <thead>
                                                                <tr>
                                                                    <td style={{ padding: "4px" }}></td>
                                                                    {["Col 1", "Col 2"].map((c, i) => <th key={i} style={{ padding: "4px 8px", color: "#6d7175", fontWeight: "500" }}>{c}</th>)}
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {(field.options || ["Row 1", "Row 2"]).map((row, i) => (
                                                                    <tr key={i}>
                                                                        <td style={{ padding: "4px 8px", color: "#202223" }}>{row}</td>
                                                                        {["Col 1", "Col 2"].map((_, j) => <td key={j} style={{ padding: "4px 8px", textAlign: "center" }}><input type="radio" name={`matrix_${field.id}_${i}`} /></td>)}
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                ) : field.type === "html" ? (
                                                    <div style={{ border: "1px solid #dcdfe3", borderRadius: "6px", padding: "10px 12px", background: "#f6f6f7", fontSize: "12px", fontFamily: "monospace", color: "#202223" }}>
                                                        {field.placeholder || "<p>Custom HTML</p>"}
                                                    </div>
                                                ) : field.type === "image-options" ? (
                                                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                                        {(field.options || ["Option 1", "Option 2"]).map((opt, i) => (
                                                            <div key={i} style={{ border: "1px solid #dcdfe3", borderRadius: "6px", padding: "8px 12px", background: "#f6f6f7", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                                                                <div style={{ width: "28px", height: "28px", background: "#e1e3e5", borderRadius: "4px" }} />
                                                                {opt}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : field.type === "checkboxes" || field.type === "radio" || field.type === "consent" ? (
                                                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "4px 0" }}>
                                                        {(field.options || ["Option 1", "Option 2"]).map((opt, i) => (
                                                            <label key={i} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#202223", cursor: "pointer" }}>
                                                                <input type={field.type === "checkboxes" || field.type === "consent" ? "checkbox" : "radio"} name={field.id} style={{ accentColor: primaryColor }} />
                                                                {opt}
                                                            </label>
                                                        ))}
                                                    </div>
                                                ) : field.type === "textarea" ? (
                                                    <textarea
                                                        className="field-preview-input"
                                                        placeholder={field.placeholder}
                                                        rows={3}
                                                    />
                                                ) : field.type === "select" || field.type === "dropdown" ? (
                                                    <select className="field-preview-select" style={{ width: "100%", height: "38px", border: "1px solid #dcdfe3", background: "#f6f6f7", borderRadius: "8px", padding: "0 12px" }}>
                                                        <option>{field.placeholder || "Select option..."}</option>
                                                        {field.options?.map((opt, i) => (
                                                            <option key={i}>{opt}</option>
                                                        ))}
                                                    </select>
                                                ) : field.type === "file" ? (
                                                    <div className="file-upload-preview-box">
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                                                        </svg>
                                                        <span>Click or drag file to upload</span>
                                                    </div>
                                                ) : (
                                                    <div className="input-with-flag-container">
                                                        {(field.type === "tel" || field.type === "phone") && (
                                                            <div className="tel-flag">
                                                                🇮🇳 <span className="tel-code">+91</span>
                                                            </div>
                                                        )}
                                                        <input
                                                            type={field.type === "phone" ? "tel" : field.type === "name" ? "text" : field.type}
                                                            className="field-preview-input"
                                                            placeholder={field.placeholder}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Submit button preview styled with selected brand theme */}
                            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "32px" }}>
                                <button
                                    onClick={() => triggerToast("Mock form submitted in preview mode!")}
                                    style={{
                                        backgroundColor: primaryColor,
                                        borderRadius: borderRadius,
                                        color: "#ffffff",
                                        border: "none",
                                        padding: "10px 20px",
                                        cursor: "pointer",
                                        fontWeight: "500"
                                    }}
                                >
                                    Submit Information
                                </button>
                            </div>
                        </div>


                        {previewMode === "mobile" && (
                            <div className="mobile-frame-footer">
                                <div className="home-indicator"></div>
                            </div>
                        )}
                    </div>
                </s-grid-item>
            </s-grid>

            {showAddMenu && (
                <div className="add-field-overlay" onClick={() => setShowAddMenu(false)}>
                    <div className="add-field-modal" onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid #e1e3e5", background: "#ffffff" }}>
                            <h2 style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: "#202223" }}>Add element</h2>
                            <button onClick={() => setShowAddMenu(false)} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#6d7175" }}>×</button>
                        </div>
                        <div className="modal-grid">
                            {elementCategories.map((cat, idx) => (
                                <div key={idx} className={`modal-category${cat.isBusiness ? " modal-category--business" : ""}`}>
                                    <div className={`modal-category-title${cat.isBusiness ? " modal-category-title--business" : ""}`}>
                                        {cat.isBusiness && (
                                            <span style={{ marginRight: "6px" }}>🏢</span>
                                        )}
                                        {cat.title}
                                        {cat.isBusiness && (
                                            <span style={{ marginLeft: "8px", fontSize: "11px", fontWeight: "500", color: "#6d7175" }}>
                                                — fields below can only be added once
                                            </span>
                                        )}
                                    </div>
                                    {/* Business fields render in their own 4-col sub-grid */}
                                    <div className={cat.isBusiness ? "biz-items-grid" : ""}>
                                        {cat.items.map((item) => {
                                            const isInUse = item.singletonType && fields.some(f => f.singletonType === item.singletonType);
                                            return (
                                                <button
                                                    key={item.id}
                                                    className={`modal-item-btn${isInUse ? " modal-item-btn--disabled" : ""}`}
                                                    disabled={isInUse}
                                                    title={isInUse ? `"${item.label}" is already added to the form` : `Add ${item.label}`}
                                                    onClick={() => !isInUse && addField(item.id, item.label, item.singletonType)}
                                                >
                                                    <span className="modal-item-icon">{item.icon}</span>
                                                    <span className="modal-item-label">{item.label}</span>
                                                    {isInUse && (
                                                        <span className="modal-item-in-use-badge">In use</span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Dynamic Toast Feedback */}
            {toastMessage && (
                <div className="builder-toast">
                    {toastMessage}
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
        .tree-dotted-line {
          border-left: 1px dotted #bbc3c9;
          margin-left: 14px;
          padding-left: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 4px;
        }

        .tree-field-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 10px;
          border-radius: 6px;
          cursor: pointer;
          background: transparent;
          transition: background 0.2s, color 0.2s;
          position: relative;
        }

        .tree-field-item:hover {
          background: #f1f2f4;
        }

        .tree-field-item.active {
          background: rgba(0, 128, 96, 0.06);
          color: #008060;
          font-weight: 500;
        }

        .field-type-icon {
          color: #6d7175;
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .tree-field-item.active .field-type-icon {
          color: #008060;
        }

        .field-label-text {
          font-size: 14px;
          color: #202223;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .hover-actions {
          display: none;
          gap: 4px;
          flex-shrink: 0;
        }

        .tree-field-item:hover .hover-actions {
          display: flex;
        }

        .small-action-btn {
          border: 1px solid #e1e3e5;
          background: #ffffff;
          padding: 2px 5px;
          font-size: 9px;
          cursor: pointer;
          border-radius: 3px;
          color: #6d7175;
          line-height: 1;
        }

        .small-action-btn:hover {
          background: #f1f2f4;
          color: #202223;
          border-color: #bbc3c9;
        }

        .small-action-btn.delete:hover {
          background: #fff0ef;
          color: #d82c0d;
          border-color: #d82c0d;
        }

        .add-tree-item {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          padding: 8px 10px;
          border-radius: 6px;
          transition: background 0.2s;
          position: relative;
        }

        .add-tree-item:hover {
          background: rgba(0, 92, 187, 0.05);
        }

        .add-field-popup {

          position: absolute;
          bottom: 42px;
          left: 0;
          width: 100%;
          background: #ffffff;
          border: 1px solid #e1e3e5;
          border-radius: 6px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          z-index: 100;
          display: flex;
          flex-direction: column;
          padding: 4px 0;
        }
        .add-field-popup button {
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          padding: 8px 12px;
          font-size: 13px;
          cursor: pointer;
          color: #202223;
        }
        .add-field-popup button:hover {
          background: #f6f6f7;
          color: #008060;
        }

        /* Preview Canvas Workspace */
        .preview-container {
          background: #ffffff;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          width: 100%;
          max-width: 800px;
          min-height: 500px;
          border-radius: 8px;
          border: 1px solid #e1e3e5;
          overflow: hidden;
        }
        
        /* Mobile Frame Mockup Styles */
        .preview-container.mobile {
          width: 375px;
          max-width: 375px;
          border: 12px solid #202223;
          border-radius: 36px;
          min-height: 680px;
          background: #fcfcfc;
          position: relative;
        }
        .mobile-frame-header {
          height: 38px;
          background: #202223;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          justify-content: center;
          font-size: 11px;
          padding: 0 16px;
        }
        .camera-notch {
          width: 120px;
          height: 18px;
          background: #202223;
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 12px;
          position: absolute;
          top: 0;
          z-index: 10;
        }
        .mobile-status-indicators {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 4px;
        }
        .right-indicators {
          display: flex;
          gap: 6px;
        }
        .mobile-frame-footer {
          height: 24px;
          background: #ffffff;
          display: flex;
          justify-content: center;
          align-items: center;
          border-top: 1px solid #f1f2f4;
        }
        .home-indicator {
          width: 120px;
          height: 4px;
          background: #8c9196;
          border-radius: 2px;
        }

        .preview-title {
          font-size: 26px;
          font-weight: 700;
          color: #202223;
          margin-bottom: 8px;
          outline: none;
          border: 1px transparent dashed;
          padding: 2px;
          transition: border-color 0.2s;
        }
        .preview-title:hover {
          border-color: #008060;
        }
        .preview-description {
          font-size: 14px;
          color: #6d7175;
          outline: none;
          border: 1px transparent dashed;
          padding: 2px;
        }
        .preview-description:hover {
          border-color: #008060;
        }

        .field-preview-input {
          width: 100%;
          border: 1px solid #dcdfe3;
          background: #f6f6f7;
          height: 38px;
          padding: 0 12px;
          border-radius: 8px;
          font-size: 13px;
          color: #202223;
          box-sizing: border-box;
        }
        textarea.field-preview-input {
          height: auto;
          padding: 8px 12px;
        }
        .input-with-flag-container {
          display: flex;
          align-items: center;
          background: #f6f6f7;
          border: 1px solid #dcdfe3;
          border-radius: 8px;
          overflow: hidden;
          width: 100%;
        }
        .input-with-flag-container input {
          border: none;
          background: none;
          height: 36px;
          outline: none;
          flex: 1;
          padding: 0 10px;
        }
        .tel-flag {
          display: flex;
          align-items: center;
          gap: 4px;
          padding-left: 10px;
          font-size: 14px;
          color: #4a4a4a;
        }
        .tel-code {
          font-size: 11px;
          color: #6d7175;
          font-weight: 500;
        }
        
        .file-upload-preview-box {
          border: 1px dashed #c9cccf;
          background: #fafafb;
          border-radius: 8px;
          padding: 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          color: #6d7175;
          font-size: 12px;
        }

        /* Toast styles */
        .builder-toast {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          background: #202223;
          color: #ffffff;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 14px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 1000;
          font-family: Inter, sans-serif;
          animation: slideUpFadeIn 0.25s ease-out;
        }

        @keyframes slideUpFadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, 10px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        .add-field-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          z-index: 1000;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: Inter, sans-serif;
        }

        .add-field-modal {
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
          width: 900px;
          max-width: 90vw;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid #e1e3e5;
          animation: fadeIn 0.2s ease-out;
        }

        .modal-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          padding: 24px;
          overflow-y: auto;
          background: #fafafb;
        }

        /* Business / Company category — spans full width of the modal grid */
        .modal-category--business {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          gap: 0;
          background: linear-gradient(135deg, rgba(0,92,187,0.035) 0%, rgba(0,128,96,0.035) 100%);
          border: 1px solid rgba(0,92,187,0.18);
          border-radius: 10px;
          padding: 16px 18px 18px;
        }

        .modal-category-title--business {
          font-size: 13px;
          font-weight: 700;
          color: #005cbb;
          letter-spacing: 0.02em;
          border-bottom: 1px solid rgba(0,92,187,0.18) !important;
          padding-bottom: 10px;
          margin-bottom: 14px;
          text-transform: none;
          display: flex;
          align-items: center;
        }

        /* 4-column sub-grid for business field buttons */
        .biz-items-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }

        .modal-category {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .modal-category-title {
          font-size: 13px;
          font-weight: 600;
          color: #202223;
          margin-bottom: 8px;
          text-transform: capitalize;
          border-bottom: 1px solid #e1e3e5;
          padding-bottom: 4px;
        }

        .modal-item-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 10px;
          background: #ffffff;
          border: 1px solid #e1e3e5;
          border-radius: 6px;
          cursor: pointer;
          width: 100%;
          text-align: left;
          transition: all 0.15s ease;
          box-sizing: border-box;
          position: relative;
        }

        .modal-item-btn:hover:not(.modal-item-btn--disabled) {
          background: #f6f6f7;
          border-color: #bbc3c9;
          transform: translateY(-1px);
        }

        .modal-item-btn:active:not(.modal-item-btn--disabled) {
          transform: scale(0.98);
        }

        /* Disabled / In-use state for singleton business fields */
        .modal-item-btn--disabled {
          opacity: 0.52;
          cursor: not-allowed;
          background: #f6f6f7;
          border-color: #e1e3e5;
        }

        .modal-item-btn--disabled .modal-item-label {
          color: #8c9196;
        }

        .modal-item-in-use-badge {
          margin-left: auto;
          font-size: 9px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #008060;
          background: #e2f1e8;
          border-radius: 3px;
          padding: 2px 5px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .modal-item-icon {
          font-size: 14px;
          color: #6d7175;
          width: 20px;
          text-align: center;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .modal-item-label {
          font-size: 13px;
          font-weight: 500;
          color: #202223;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
      `}} />
        </s-page>
    );
}