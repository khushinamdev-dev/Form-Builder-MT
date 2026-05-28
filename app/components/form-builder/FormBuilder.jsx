import { useState, useEffect, useRef } from "react";
import {
  useNavigate,
  useSubmit,
  useActionData,
  useSearchParams,
} from "react-router";
import Editor from "react-simple-wysiwyg";

const countriesList = [
  { code: "IN", name: "India", dial: "+91" },
  { code: "US", name: "United States", dial: "+1" },
  { code: "GB", name: "United Kingdom", dial: "+44" },
  { code: "CA", name: "Canada", dial: "+1" },
  { code: "AU", name: "Australia", dial: "+61" },
  { code: "NZ", name: "New Zealand", dial: "+64" },
  { code: "SG", name: "Singapore", dial: "+65" },
  { code: "AE", name: "United Arab Emirates", dial: "+971" },
  { code: "SA", name: "Saudi Arabia", dial: "+966" },
  { code: "ZA", name: "South Africa", dial: "+27" },
  { code: "DE", name: "Germany", dial: "+49" },
  { code: "FR", name: "France", dial: "+33" },
  { code: "IT", name: "Italy", dial: "+39" },
  { code: "ES", name: "Spain", dial: "+34" },
  { code: "JP", name: "Japan", dial: "+81" },
  { code: "CN", name: "China", dial: "+86" },
  { code: "BR", name: "Brazil", dial: "+55" },
  { code: "MX", name: "Mexico", dial: "+52" },
  { code: "RU", name: "Russia", dial: "+7" },
  { code: "NL", name: "Netherlands", dial: "+31" },
  { code: "CH", name: "Switzerland", dial: "+41" },
  { code: "SE", name: "Sweden", dial: "+46" },
  { code: "NO", name: "Norway", dial: "+47" },
  { code: "FI", name: "Finland", dial: "+358" },
  { code: "DK", name: "Denmark", dial: "+45" },
  { code: "IE", name: "Ireland", dial: "+353" },
  { code: "HK", name: "Hong Kong", dial: "+852" },
  { code: "MY", name: "Malaysia", dial: "+60" },
  { code: "TH", name: "Thailand", dial: "+66" },
  { code: "PH", name: "Philippines", dial: "+63" },
  { code: "ID", name: "Indonesia", dial: "+62" },
  { code: "VN", name: "Vietnam", dial: "+84" },
  { code: "KR", name: "South Korea", dial: "+82" },
  { code: "TR", name: "Turkey", dial: "+90" },
  { code: "PK", name: "Pakistan", dial: "+92" },
  { code: "BD", name: "Bangladesh", dial: "+880" },
  { code: "LK", name: "Sri Lanka", dial: "+94" },
  { code: "NP", name: "Nepal", dial: "+977" },
  { code: "EG", name: "Egypt", dial: "+20" },
  { code: "NG", name: "Nigeria", dial: "+234" },
  { code: "KE", name: "Kenya", dial: "+254" },
  { code: "AR", name: "Argentina", dial: "+54" },
  { code: "CL", name: "Chile", dial: "+56" },
  { code: "CO", name: "Colombia", dial: "+57" },
  { code: "PE", name: "Peru", dial: "+51" },
  { code: "PL", name: "Poland", dial: "+48" },
  { code: "UA", name: "Ukraine", dial: "+380" },
  { code: "RO", name: "Romania", dial: "+40" },
  { code: "GR", name: "Greece", dial: "+30" },
  { code: "PT", name: "Portugal", dial: "+351" },
  { code: "AT", name: "Austria", dial: "+43" },
  { code: "BE", name: "Belgium", dial: "+32" },
];

// Helper function to return SVG icon for a field type
const StarIcon = ({ filled, color = "#ffb400", strokeColor = "#2e4a3f", size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? color : "none"}
    stroke={filled ? color : strokeColor}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ transition: "all 0.15s ease", cursor: "pointer" }}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const HeartIcon = ({ filled, color = "#d82c0d", strokeColor = "#2e4a3f", size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? color : "none"}
    stroke={filled ? color : strokeColor}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ transition: "all 0.15s ease", cursor: "pointer" }}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const SmileIcon = ({ filled, color = "#ffb400", strokeColor = "#2e4a3f", size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? color : "none"}
    stroke={filled ? color : strokeColor}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ transition: "all 0.15s ease", cursor: "pointer" }}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" />
    <line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
);

const ThumbIcon = ({ filled, color = "#008060", strokeColor = "#2e4a3f", size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? color : "none"}
    stroke={filled ? color : strokeColor}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ transition: "all 0.15s ease", cursor: "pointer" }}
  >
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
  </svg>
);

const getFieldIcon = (type) => {
  switch (type) {
    case "email":
      return <s-icon type="email" />;
    case "url":
      return <s-icon type="link" />;
    case "tel":
    case "phone":
      return (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      );
    case "password":
      return (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      );
    case "country":
      return (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
    case "checkboxes":
    case "consent":
      return (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <polyline points="9 11 12 14 22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      );
    case "select":
    case "dropdown":
      return (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      );
    case "radio":
      return (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case "button":
      return (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M15 15l-3-3 3-3" />
          <path d="M18 12H6" />
        </svg>
      );
    case "number":
      return (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <line x1="4" y1="9" x2="20" y2="9" />
          <line x1="4" y1="15" x2="20" y2="15" />
          <line x1="10" y1="3" x2="8" y2="21" />
          <line x1="16" y1="3" x2="14" y2="21" />
        </svg>
      );
    case "rating":
      return (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    case "heading":
      return (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="4" x2="4" y2="20" />
          <line x1="20" y1="4" x2="20" y2="20" />
        </svg>
      );
    case "paragraph":
      return (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <line x1="21" y1="10" x2="3" y2="10" />
          <line x1="21" y1="6" x2="3" y2="6" />
          <line x1="21" y1="14" x2="3" y2="14" />
          <line x1="21" y1="18" x2="3" y2="18" />
        </svg>
      );
    case "divider":
      return (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      );
    case "textarea":
      return (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M21 12H3M12 3v18" />
        </svg>
      );
    default:
      return (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M4 7V4h16v3M9 20h6M12 4v16" />
        </svg>
      );
  }
};

const tabs = [
  {
    id: "elements",
    label: "Elements",
    icon: "theme-template",
  },
  { id: "appearance", label: "Appearance", icon: "paint-brush-round" },
  { id: "after-submit", label: "After submit", icon: "cursor" },
  { id: "mail", label: "Mail", icon: "email" },
  { id: "rules", label: "Rules", icon: "filter" },
  { id: "settings", label: "Settings", icon: "settings" },
];

// Business/Company singleton field definitions (only one of each allowed per form)
const businessFields = [
  {
    id: "biz-company-name",
    label: "Company Name",
    icon: "🏢",
    singletonType: "biz-company-name",
  },
  {
    id: "biz-company-email",
    label: "Business Email",
    icon: "📧",
    singletonType: "biz-company-email",
  },
  {
    id: "biz-company-phone",
    label: "Business Phone",
    icon: "☎",
    singletonType: "biz-company-phone",
  },
  {
    id: "biz-address",
    label: "Company Address",
    icon: "📍",
    singletonType: "biz-address",
  },
  { id: "biz-city", label: "City", icon: "🌆", singletonType: "biz-city" },
  {
    id: "biz-state",
    label: "State / Province",
    icon: "🗺",
    singletonType: "biz-state",
  },
  {
    id: "biz-zip",
    label: "ZIP / Postal Code",
    icon: "📮",
    singletonType: "biz-zip",
  },
  {
    id: "biz-country",
    label: "Country",
    icon: "🌍",
    singletonType: "biz-country",
  },
  {
    id: "biz-tax-id",
    label: "Tax ID / EIN",
    icon: "🪪",
    singletonType: "biz-tax-id",
  },
  { id: "biz-vat", label: "VAT Number", icon: "📑", singletonType: "biz-vat" },
  {
    id: "biz-reg-number",
    label: "Registration Number",
    icon: "🔖",
    singletonType: "biz-reg-number",
  },
  {
    id: "biz-industry",
    label: "Industry / Sector",
    icon: "🏭",
    singletonType: "biz-industry",
  },
  {
    id: "biz-type",
    label: "Business Type",
    icon: "🗂",
    singletonType: "biz-type",
  },
  {
    id: "biz-employees",
    label: "No. of Employees",
    icon: "👥",
    singletonType: "biz-employees",
  },
  {
    id: "biz-website",
    label: "Company Website",
    icon: "🔗",
    singletonType: "biz-website",
  },
  {
    id: "biz-tax-doc",
    label: "Tax Documentation",
    icon: "📎",
    singletonType: "biz-tax-doc",
  },
];

const elementCategories = [
  {
    title: "Business / Company",
    isBusiness: true,
    items: businessFields,
  },
  {
    title: "Contact info",
    items: [
      { id: "email", label: "Email", icon: "✉" },
      { id: "name", label: "Name", icon: "@" },
      { id: "phone", label: "Phone", icon: "📞" },
      { id: "password", label: "Password", icon: "🔑" },
      { id: "country", label: "Country", icon: "🌐" },
    ],
  },
  {
    title: "Text",
    items: [
      { id: "text", label: "Text", icon: "Aa" },
      { id: "textarea", label: "Textarea", icon: "📝" },
    ],
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
      { id: "switch", label: "Switch", icon: "⚙" },
    ],
  },
  {
    title: "Number",
    items: [
      { id: "number", label: "Number", icon: "#" },
      { id: "range", label: "Range slider", icon: "⇔" },
    ],
  },
  {
    title: "Input",
    items: [
      { id: "url", label: "Url", icon: "🔗" },
      { id: "date", label: "Date", icon: "📅" },
      { id: "file", label: "File upload", icon: "📎" },
      { id: "color", label: "Color picker", icon: "🎨" },
    ],
  },
  {
    title: "Ratings",
    items: [
      { id: "rating", label: "Rating star", icon: "★" },
      { id: "feedback", label: "Feedback", icon: "💬" },
    ],
  },
  {
    title: "Products",
    items: [
      { id: "product", label: "Product", icon: "📦" },
      { id: "quantity", label: "Quantity", icon: "🔢" },
      { id: "color-swatch", label: "Color swatch", icon: "🎨" },
    ],
  },
  {
    title: "Advanced",
    items: [
      { id: "repeater", label: "Repeater", icon: "↻" },
      { id: "signature", label: "Signature", icon: "✍" },
      { id: "hidden", label: "Hidden", icon: "👁" },
      { id: "matrix", label: "Matrix", icon: "⊞" },
      { id: "html", label: "HTML", icon: "<>" },
    ],
  },
  {
    title: "Static text",
    items: [
      { id: "heading", label: "Heading", icon: "T" },
      { id: "paragraph", label: "Paragraph", icon: "¶" },
      { id: "divider", label: "Divider", icon: "―" },
    ],
  },
];

// Generate a unique form ID (UUID v4 style)
function generateFormId() {
  return (
    "form-" +
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    })
  );
}

const isBusinessFieldInUse = (item, fields) => {
  if (!item.singletonType) return false;

  return fields.some((f) => {
    // 1. Direct singletonType match
    if (f.singletonType === item.singletonType) return true;

    // 2. ID match fallbacks for initial B2B fields
    if (item.singletonType === "biz-website" && (f.id === "website" || f.id === "biz-website" || f.type === "biz-website")) return true;
    if (item.singletonType === "biz-address" && (f.id === "address" || f.id === "biz-address" || f.type === "biz-address")) return true;
    if (item.singletonType === "biz-type" && (f.id === "businessType" || f.id === "biz-type" || f.type === "biz-type")) return true;
    if (item.singletonType === "biz-tax-id" && (f.id === "taxId" || f.id === "biz-tax-id" || f.type === "biz-tax-id")) return true;
    if (item.singletonType === "biz-tax-doc" && (f.id === "taxDoc" || f.id === "biz-tax-doc" || f.type === "biz-tax-doc")) return true;

    // 3. Robust Label-based semantic match (helps for old/legacy custom forms)
    const normLabel = (f.label || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    const normItemLabel = (item.label || "").toLowerCase().replace(/[^a-z0-9]/g, "");

    // Exact semantic label match (e.g. "company name" === "company name")
    if (normLabel && normLabel === normItemLabel) return true;

    // Substring checks for close matches
    if (item.singletonType === "biz-company-name" && (normLabel.includes("companyname") || normLabel.includes("businessname"))) return true;
    if (item.singletonType === "biz-company-email" && (normLabel.includes("businessemail") || normLabel.includes("companyemail"))) return true;
    if (item.singletonType === "biz-company-phone" && (normLabel.includes("businessphone") || normLabel.includes("companyphone"))) return true;
    if (item.singletonType === "biz-tax-id" && (normLabel.includes("taxid") || normLabel.includes("ein"))) return true;
    if (item.singletonType === "biz-tax-doc" && (normLabel.includes("taxdoc") || normLabel.includes("taxdocument"))) return true;

    return false;
  });
};

export default function FormBuilder({ config, existingForm = null }) {
  const navigate = useNavigate();
  const submit = useSubmit();
  const actionData = useActionData();
  const [searchParams] = useSearchParams();
  const isEditing = !!existingForm?.formId;
  const categoryParam = searchParams.get("category");
  const [formCategory, setFormCategory] = useState(() =>
    existingForm?.category === "custom" || existingForm?.category === "b2b"
      ? existingForm.category
      : categoryParam === "custom" || categoryParam === "b2b"
        ? categoryParam
        : config.defaultCategory,
  );

  // Builder states
  const [fields, setFields] = useState(() =>
    existingForm?.fields?.length ? existingForm.fields : config.initialFields,
  );
  const [previewRatings, setPreviewRatings] = useState({});
  const [pages, setPages] = useState(() =>
    existingForm?.pages?.length
      ? existingForm.pages
      : [{ id: 1, title: "Page 1" }],
  );
  const [addingToPage, setAddingToPage] = useState(1);
  const [activePreviewPage, setActivePreviewPage] = useState(1);
  const [collapsedPages, setCollapsedPages] = useState({});
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [activeTab, setActiveTab] = useState("elements"); // "elements" | "appearance" | "after-submit" | "mail" | "integration" | "settings"
  const [previewMode, setPreviewMode] = useState("desktop"); // "desktop" | "mobile"

  const togglePageCollapse = (pageId) => {
    setCollapsedPages((prev) => ({
      ...prev,
      [pageId]: !prev[pageId],
    }));
  };
  const [formName, setFormName] = useState(
    () => existingForm?.formName || existingForm?.title || config.formTitle,
  );
  const [formHeaderTitle, setFormHeaderTitle] = useState(
    () => existingForm?.headerTitle || existingForm?.title || config.formTitle,
  );
  const [formDescription, setFormDescription] = useState(
    () => existingForm?.description || config.formDescription,
  );
  const [footerText, setFooterText] = useState(
    () => existingForm?.footerText || "",
  );
  const [footerPreviousText, setFooterPreviousText] = useState(
    () => existingForm?.footerPreviousText || "Previous",
  );
  const [footerNextText, setFooterNextText] = useState(
    () => existingForm?.footerNextText || "Next",
  );
  const [footerSubmitText, setFooterSubmitText] = useState(
    () => existingForm?.footerSubmitText || "Submit",
  );
  const [footerShowReset, setFooterShowReset] = useState(
    () => !!existingForm?.footerShowReset,
  );
  const [footerFullWidth, setFooterFullWidth] = useState(
    () => !!existingForm?.footerFullWidth,
  );
  const [bannerVisible, setBannerVisible] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const [showAddMenu, setShowAddMenu] = useState(false);

  // Form Styling States (for the Appearance tab)
  const [primaryColor, setPrimaryColor] = useState(
    () => existingForm?.primaryColor || "#008060",
  );
  const [borderRadius, setBorderRadius] = useState(() => existingForm?.borderRadius || "8px");
  const [fontFamily, setFontFamily] = useState(() => existingForm?.fontFamily || "Inter, sans-serif");
  const [backgroundColor, setBackgroundColor] = useState(() => existingForm?.backgroundColor || "#ffffff");

  const [titleColor, setTitleColor] = useState(() => existingForm?.titleColor || "#202223");
  const [titleFontSize, setTitleFontSize] = useState(() => existingForm?.titleFontSize || "26px");
  const [descriptionColor, setDescriptionColor] = useState(() => existingForm?.descriptionColor || "#6d7175");
  const [descriptionFontSize, setDescriptionFontSize] = useState(() => existingForm?.descriptionFontSize || "14px");
  const [labelColor, setLabelColor] = useState(() => existingForm?.labelColor || "#202223");
  const [labelFontSize, setLabelFontSize] = useState(() => existingForm?.labelFontSize || "14px");
  const [inputBgColor, setInputBgColor] = useState(() => existingForm?.inputBgColor || "#ffffff");
  const [inputTextColor, setInputTextColor] = useState(() => existingForm?.inputTextColor || "#202223");
  const [inputBorderColor, setInputBorderColor] = useState(() => existingForm?.inputBorderColor || "#bbc3c9");
  const [btnTextColor, setBtnTextColor] = useState(() => existingForm?.btnTextColor || "#ffffff");

  // After Submit States
  const [afterSubmitAction, setAfterSubmitAction] = useState(
    () => existingForm?.afterSubmitAction || "successful",
  ); // "successful" | "clear" | "redirect" | "hide"
  const [successTitle, setSuccessTitle] = useState(
    () => existingForm?.successTitle || "Thanks for getting in touch!",
  );
  const [afterSubmitDiscount, setAfterSubmitDiscount] = useState(
    () => existingForm?.afterSubmitDiscount || "",
  );
  const [successMessage, setSuccessMessage] = useState(
    () => existingForm?.successMessage || "We appreciate you contacting us. One of our colleagues will get back in touch with you soon!<br/><br/>Have a great day!",
  );
  const [redirectUrl, setRedirectUrl] = useState(
    () => existingForm?.redirectUrl || "",
  );
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Email Template States
  const [activeEmailTemplate, setActiveEmailTemplate] = useState(null);
  const [emailTemplates, setEmailTemplates] = useState(config.emailTemplates);
  const updateEmailTemplate = (key, field, value) => {
    setEmailTemplates((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  // Integration States
  const [customerTag, setCustomerTag] = useState(
    () => existingForm?.customerTag || config.customerTag || "",
  );
  const [syncMetafields, setSyncMetafields] = useState(true);

  // Rules States
  const [rules, setRules] = useState(() => existingForm?.rules || []);
  const [editingRuleId, setEditingRuleId] = useState(null);
  const [ruleField, setRuleField] = useState("");
  const [ruleCondition, setRuleCondition] = useState("empty"); // "empty" | "not_empty" | "equals" | "contains"
  const [ruleValue, setRuleValue] = useState("");
  const [ruleAction, setRuleAction] = useState("show"); // "show" | "hide" | "require" | "optional"
  const [ruleTarget, setRuleTarget] = useState("");

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
    setFields(fields.filter((f) => f.id !== id));
    if (selectedFieldId === id) setSelectedFieldId(null);
    triggerToast("Field removed");
  };

  // Delete Page
  const deletePage = (pageId) => {
    if (pages.length <= 1) {
      triggerToast("Form must have at least one page");
      return;
    }
    // Remove the page and reindex remaining ones
    const updatedPages = pages.filter((p) => p.id !== pageId);
    const reindexedPages = updatedPages.map((p, idx) => ({
      ...p,
      id: idx + 1,
      title: `Page ${idx + 1}`,
    }));
    setPages(reindexedPages);

    // Delete fields of the deleted page and shift remaining ones
    const updatedFields = fields
      .filter((f) => (f.page || 1) !== pageId)
      .map((f) => {
        const fieldPage = f.page || 1;
        if (fieldPage > pageId) {
          return { ...f, page: fieldPage - 1 };
        }
        return f;
      });
    setFields(updatedFields);

    // Adjust active preview page
    if (activePreviewPage >= pageId) {
      setActivePreviewPage(Math.max(1, activePreviewPage - 1));
    }
    triggerToast("Page removed");
  };

  // Add Field — handles both regular types and singleton business fields
  const addField = (type, customLabel, singletonType) => {
    // Block re-adding a singleton business field that is already in the form
    const itemDummy = { singletonType, label: customLabel };
    if (singletonType && isBusinessFieldInUse(itemDummy, fields))
      return;
    const id = `field_${Date.now()}`;
    let label =
      customLabel ||
      `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`;
    let placeholder = `Enter ${label.toLowerCase()}`;
    let options = undefined;

    if (type === "consent") {
      placeholder = "I agree to the terms and conditions";
    } else if (type === "select" || type === "dropdown") {
      placeholder = "Select option...";
      options = ["Option 1", "Option 2", "Option 3"];
    } else if (
      type === "checkboxes" ||
      type === "radio" ||
      type === "image-options"
    ) {
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
      placeholder = "Select date";
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
      page: addingToPage,
      ...(options ? { options } : {}),
      ...(singletonType ? { singletonType } : {}),
    };
    setFields([...fields, newField]);
    setSelectedFieldId(id);
    setShowAddMenu(false);
    triggerToast(`${label} added`);
  };

  // Selected field details
  const selectedField = fields.find((f) => f.id === selectedFieldId);

  // Update selected field property
  const updateSelectedField = (key, value) => {
    setFields(
      fields.map((f) => {
        if (f.id === selectedFieldId) {
          return { ...f, [key]: value };
        }
        return f;
      }),
    );
  };

  // Save form config to metaobject (keeps same ID when editing)
  const handleContinue = () => {
    const formId = isEditing ? existingForm.formId : generateFormId();
    const data = new FormData();
    data.append("formId", formId);
    data.append("formName", formName);
    data.append("formHeaderTitle", formHeaderTitle);
    data.append("formDescription", formDescription);
    data.append("formCategory", formCategory);
    data.append("formRole", config.formRole);
    data.append("primaryColor", primaryColor);
    data.append("borderRadius", borderRadius);
    data.append("fontFamily", fontFamily);
    data.append("backgroundColor", backgroundColor);
    data.append("titleColor", titleColor);
    data.append("titleFontSize", titleFontSize);
    data.append("descriptionColor", descriptionColor);
    data.append("descriptionFontSize", descriptionFontSize);
    data.append("labelColor", labelColor);
    data.append("labelFontSize", labelFontSize);
    data.append("inputBgColor", inputBgColor);
    data.append("inputTextColor", inputTextColor);
    data.append("inputBorderColor", inputBorderColor);
    data.append("btnTextColor", btnTextColor);
    data.append("fields", JSON.stringify(fields));
    data.append("pages", JSON.stringify(pages));
    data.append("afterSubmitAction", afterSubmitAction);
    data.append("successTitle", successTitle);
    data.append("successMessage", successMessage);
    data.append("redirectUrl", redirectUrl);
    data.append("customerTag", customerTag);
    data.append("footerText", footerText);
    data.append("footerPreviousText", footerPreviousText);
    data.append("footerNextText", footerNextText);
    data.append("footerSubmitText", footerSubmitText);
    data.append("footerShowReset", footerShowReset ? "true" : "false");
    data.append("footerFullWidth", footerFullWidth ? "true" : "false");
    data.append("rules", JSON.stringify(rules));
    data.append("isNew", isEditing ? "false" : "true");
    submit(data, { method: "post" });
  };

  const saveBarId = "settings-save-bar";

  // Snapshot of the last-saved state — used to detect real changes
  const savedStateRef = useRef(null);

  // Build a serialisable snapshot of every tracked state value
  const buildSnapshot = () => JSON.stringify({
    formName, formHeaderTitle, formDescription,
    footerText, footerPreviousText, footerNextText, footerSubmitText,
    footerShowReset, footerFullWidth,
    primaryColor, borderRadius, fontFamily, backgroundColor,
    titleColor, titleFontSize, descriptionColor, descriptionFontSize,
    labelColor, labelFontSize, inputBgColor, inputTextColor, inputBorderColor, btnTextColor,
    afterSubmitAction, successTitle, afterSubmitDiscount, successMessage,
    redirectUrl, customerTag, rules,
    fields, pages,
  });

  // Show/hide save bar based on whether current state differs from saved snapshot
  const syncSaveBar = (snapshot) => {
    const isDirty = savedStateRef.current !== null && snapshot !== savedStateRef.current;
    if (typeof window !== "undefined" && window.shopify) {
      if (isDirty) {
        window.shopify.saveBar.show(saveBarId);
      } else {
        window.shopify.saveBar.hide(saveBarId);
      }
    }
  };


  // Drag and Drop reordering state & handlers
  const [draggedFieldId, setDraggedFieldId] = useState(null);
  const isDragging = useRef(false);
  const isResetting = useRef(false); // prevents save bar from re-appearing during discard/save resets
  const dragStartOrderRef = useRef("");
  const fieldsRef = useRef(fields);

  useEffect(() => {
    fieldsRef.current = fields;
  }, [fields]);

  // No-op kept for compatibility — save bar is driven by the state snapshot watcher below
  const handleFieldInput = () => { };

  const handleDragStart = (e, fieldId) => {
    isDragging.current = true;
    dragStartOrderRef.current = fieldsRef.current.map((f) => f.id).join(",");
    setDraggedFieldId(fieldId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, targetFieldId) => {
    e.preventDefault();
    if (draggedFieldId === null || draggedFieldId === targetFieldId) return;

    setFields((prevFields) => {
      const draggedIndex = prevFields.findIndex((f) => f.id === draggedFieldId);
      const targetIndex = prevFields.findIndex((f) => f.id === targetFieldId);

      if (draggedIndex === -1 || targetIndex === -1) return prevFields;

      // We only reorder fields that are on the same page
      const draggedField = prevFields[draggedIndex];
      const targetField = prevFields[targetIndex];
      if ((draggedField.page || 1) !== (targetField.page || 1)) return prevFields;

      const updatedFields = [...prevFields];
      const [removed] = updatedFields.splice(draggedIndex, 1);
      updatedFields.splice(targetIndex, 0, removed);
      return updatedFields;
    });
  };

  const handleDragEnd = () => {
    isDragging.current = false;
    setDraggedFieldId(null);

    // Only trigger the Save Bar if the field order actually changed
    const currentOrder = fieldsRef.current.map((f) => f.id).join(",");
    if (currentOrder !== dragStartOrderRef.current) {
      handleFieldInput();
    }
  };

  const handleDiscard = () => {
    isResetting.current = true;
    // Reset all state variables to original loader/draft values
    setFormName(existingForm?.formName || existingForm?.title || config.formTitle);
    setFormHeaderTitle(existingForm?.headerTitle || existingForm?.title || config.formTitle);
    setFormDescription(existingForm?.description || config.formDescription);
    setFooterText(existingForm?.footerText || "");
    setFooterPreviousText(existingForm?.footerPreviousText || "Previous");
    setFooterNextText(existingForm?.footerNextText || "Next");
    setFooterSubmitText(existingForm?.footerSubmitText || "Submit");
    setFooterShowReset(!!existingForm?.footerShowReset);
    setFooterFullWidth(!!existingForm?.footerFullWidth);
    setFields(existingForm?.fields?.length ? existingForm.fields : config.initialFields);
    setPages(existingForm?.pages?.length ? existingForm.pages : [{ id: 1, title: "Page 1" }]);
    // Styling states reset
    setPrimaryColor(existingForm?.primaryColor || "#008060");
    setBorderRadius(existingForm?.borderRadius || "8px");
    setFontFamily(existingForm?.fontFamily || "Inter, sans-serif");
    setBackgroundColor(existingForm?.backgroundColor || "#ffffff");
    setTitleColor(existingForm?.titleColor || "#202223");
    setTitleFontSize(existingForm?.titleFontSize || "26px");
    setDescriptionColor(existingForm?.descriptionColor || "#6d7175");
    setDescriptionFontSize(existingForm?.descriptionFontSize || "14px");
    setLabelColor(existingForm?.labelColor || "#202223");
    setLabelFontSize(existingForm?.labelFontSize || "14px");
    setInputBgColor(existingForm?.inputBgColor || "#ffffff");
    setInputTextColor(existingForm?.inputTextColor || "#202223");
    setInputBorderColor(existingForm?.inputBorderColor || "#bbc3c9");
    setBtnTextColor(existingForm?.btnTextColor || "#ffffff");
    // After submit states reset
    setAfterSubmitAction(existingForm?.afterSubmitAction || "successful");
    setSuccessTitle(existingForm?.successTitle || "Thanks for getting in touch!");
    setAfterSubmitDiscount(existingForm?.afterSubmitDiscount || "");
    setSuccessMessage(existingForm?.successMessage || "We appreciate you contacting us. One of our colleagues will get back in touch with you soon!<br/><br/>Have a great day!");
    setRedirectUrl(existingForm?.redirectUrl || "");
    setCustomerTag(existingForm?.customerTag || "");
    setRules(existingForm?.rules || []);
    // Hide the save bar and re-enable the watcher after React flushes
    setTimeout(() => {
      isResetting.current = false;
      if (typeof window !== "undefined" && window.shopify) {
        window.shopify.saveBar.hide(saveBarId);
      }
    }, 0);
    triggerToast("Changes discarded");
  };

  const handleSave = () => {
    isResetting.current = true;
    // Capture a fresh snapshot NOW (before submit) and store it as saved
    const snapshot = buildSnapshot();
    savedStateRef.current = snapshot;
    if (typeof window !== "undefined" && window.shopify) {
      window.shopify.saveBar.hide(saveBarId);
    }
    triggerToast(config.saveToastMessage);
    handleContinueRef.current();
    setTimeout(() => { isResetting.current = false; }, 0);
  };

  // Safe ref wrappers to avoid stale closure issues in document event listeners
  const handleContinueRef = useRef(handleContinue);
  const handleSaveRef = useRef(handleSave);
  const handleDiscardRef = useRef(handleDiscard);

  useEffect(() => {
    handleContinueRef.current = handleContinue;
    handleSaveRef.current = handleSave;
    handleDiscardRef.current = handleDiscard;
  });

  // Listen for Shopify Admin Save Bar native events
  useEffect(() => {
    const onSave = () => handleSaveRef.current();
    const onDiscard = () => handleDiscardRef.current();
    document.addEventListener("shopify:save", onSave);
    document.addEventListener("shopify:discard", onDiscard);
    return () => {
      document.removeEventListener("shopify:save", onSave);
      document.removeEventListener("shopify:discard", onDiscard);
    };
  }, []);

  // Monitor all state changes — compare against saved snapshot, show/hide save bar accordingly
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      // On first render, capture the initial saved state snapshot
      const initial = buildSnapshot();
      savedStateRef.current = initial;
      isFirstRender.current = false;
      return;
    }
    if (isDragging.current || isResetting.current) return;
    const snapshot = buildSnapshot();
    syncSaveBar(snapshot);
  }, [
    fields, pages, formName, formHeaderTitle, formDescription,
    footerText, footerPreviousText, footerNextText, footerSubmitText,
    footerShowReset, footerFullWidth,
    primaryColor, borderRadius, fontFamily, backgroundColor,
    titleColor, titleFontSize, descriptionColor, descriptionFontSize,
    labelColor, labelFontSize, inputBgColor, inputTextColor, inputBorderColor, btnTextColor,
    afterSubmitAction, successTitle, afterSubmitDiscount, successMessage,
    redirectUrl, customerTag, rules,
  ]);
  return (
    <s-page>
      {/* Shopify imperative Save Bar */}
      <ui-save-bar id={saveBarId}>
        <button variant="primary" onClick={handleSave}></button>
        <button onClick={handleDiscard}></button>
      </ui-save-bar>

      {/* Top Header Bar using Spruce Stack */}
      <s-stack
        direction="inline"
        justifyContent="space-between"
        alignItems="center"
        padding="none none base none"
      >
        <s-stack direction="inline" alignItems="center" padding="none" gap="base">
          <s-button
            onClick={() => {
              const isScratch = config.formRole === "Custom Form" || (typeof window !== "undefined" && window.location.pathname.includes("/scratch"));
              if (isEditing) {
                navigate("/app/forms");
              } else if (isScratch) {
                navigate("/app/create-form");
              } else {
                navigate("/app/template");
              }
            }}
          >
            <s-icon type="arrow-left"> </s-icon>
          </s-button>
          <s-stack gap="small">
            <s-heading>{config.pageHeading}</s-heading>
            {/* {isEditing && (
              <s-text tone="subdued">
                Editing · ID: {existingForm.formId}
              </s-text>
            )} */}
          </s-stack>
        </s-stack>
        <s-stack>
          <s-button variant="primary" onClick={handleContinue}>
            {isEditing ? "Save changes" : "Continue"}
          </s-button>
        </s-stack>
      </s-stack>

      {/* Horizontal Navigation Tabs (Placed above middle elements panel) */}
      <s-stack direction="inline" gap="base" padding="base none">
        {tabs
          .filter((tab) => formCategory === "b2b" || tab.id !== "settings")
          .map((tab) => (
            <s-button
              key={tab.id}
              variant={activeTab === tab.id ? "secondary" : "tertiary"}
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedFieldId(null);
              }}
            >
              <s-stack direction="inline" gap="base">
                <s-icon type={tab.icon} color="subdued"></s-icon>
                {tab.label}
              </s-stack>
            </s-button>
          ))}
      </s-stack>

      {/* Main Workspace Layout using Spruce Grid */}
      <s-grid gridTemplateColumns="repeat(12, 1fr)" gap="base">
        {/* Left Side Pane: Horizontal Nav Tab + Elements List */}
        <s-grid-item gridColumn="span 4">
          <s-scroll-box blockSize="620px" padding="none ">

            <s-section>
              {/* Sub-Pane Body based on activeTab */}
              <s-stack padding="none" gap="base">
                {activeTab === "elements" && (
                  <>
                    {selectedFieldId === null ? (
                      // Normal Elements list panel
                      <s-section padding="none" gap="none">
                        <s-stack padding="none" gap="base">
                          {/* Internal Form Settings */}
                          <s-stack
                            gap="base"

                          >
                            <s-stack direction="inline" alignItems="center" gap="small" >
                              <s-checkbox
                                id="enable-b2b-checkbox"
                                label=" Enable B2B"
                                checked={formCategory === "b2b"}
                                onChange={(e) => {
                                  handleFieldInput();
                                  const checked = e.target.checked;
                                  setFormCategory(checked ? "b2b" : "custom");
                                  if (!checked && activeTab === "settings") {
                                    setActiveTab("elements");
                                  }
                                }}

                              ></s-checkbox>
                              {/* <input
                                type="checkbox"
                                id="enable-b2b-checkbox"
                                checked={formCategory === "b2b"}
                                onChange={(e) => {
                                  handleFieldInput();
                                  const checked = e.target.checked;
                                  setFormCategory(checked ? "b2b" : "custom");
                                  if (!checked && activeTab === "settings") {
                                    setActiveTab("elements");
                                  }
                                }}
                              />
                              <label
                                htmlFor="enable-b2b-checkbox"
                                style={{
                                  fontSize: "14px",
                                  fontWeight: "500",
                                  color: "#202223",
                                  cursor: "pointer",
                                }}
                              >
                                Enable B2B
                              </label> */}
                            </s-stack>
                            <s-text-field
                              label="Form name"
                              value={formName}
                              onInput={handleFieldInput}
                              onChange={(e) => setFormName(e.currentTarget.value)}

                            />
                          </s-stack>


                          {/* Premium Clickable Header card in the Elements list */}
                          <s-button inlineSize="fill" className="tree-field-item" onClick={() => setSelectedFieldId("form-header")} onMouseEnter={(e) => {
                            if (selectedFieldId !== "form-header") {
                              e.currentTarget.style.borderColor = "#bbc3c9";
                              e.currentTarget.style.background = "#f6f6f7";
                            }
                          }}
                            onMouseLeave={(e) => {
                              if (selectedFieldId !== "form-header") {
                                e.currentTarget.style.borderColor = "#e1e3e5";
                                e.currentTarget.style.background = "#ffffff";
                              }
                            }}>
                            Header
                          </s-button>
                          {/* <div
                            onClick={() => setSelectedFieldId("form-header")}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              padding: "8px 12px",
                              background: selectedFieldId === "form-header" ? "rgba(0, 128, 96, 0.05)" : "#ffffff",
                              border: selectedFieldId === "form-header" ? "1px solid #008060" : "1px solid #e1e3e5",
                              borderRadius: "8px",
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                              marginBottom: "12px",
                              boxShadow: selectedFieldId === "form-header" ? "0 1px 3px rgba(0, 128, 96, 0.1)" : "none",
                            }}
                            onMouseEnter={(e) => {
                              if (selectedFieldId !== "form-header") {
                                e.currentTarget.style.borderColor = "#bbc3c9";
                                e.currentTarget.style.background = "#f6f6f7";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (selectedFieldId !== "form-header") {
                                e.currentTarget.style.borderColor = "#e1e3e5";
                                e.currentTarget.style.background = "#ffffff";
                              }
                            }}
                          >

                            <span
                              style={{
                                fontSize: "14px",
                                fontWeight: "600",
                                color: selectedFieldId === "form-header" ? "#008060" : "#202223",
                              }}
                            >
                              Header
                            </span>
                          </div> */}

                          <s-heading level="3">Elements</s-heading>



                          {pages.map((page) => {
                            const pageFields = fields.filter(
                              (f) => (f.page || 1) === page.id,
                            );
                            return (
                              <s-stack gap="small" key={page.id}>
                                {/* Page Title Row */}
                                <s-stack
                                  direction="inline"
                                  gap="small"
                                  className="cursor-pointer"
                                  onClick={() => togglePageCollapse(page.id)}
                                >
                                  <s-icon type={collapsedPages[page.id] ? "caret-right" : "caret-down"} />
                                  {/* <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    style={{
                                      color: "#6d7175",
                                      transform: collapsedPages[page.id]
                                        ? "rotate(-90deg)"
                                        : "rotate(0deg)",
                                      transition: "transform 0.2s ease",
                                    }}
                                  >
                                    <path d="m6 9 6 6 6-6" />
                                  </svg> */}

                                  <s-icon type="folder" />
                                  {/* <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    style={{ color: "#6d7175" }}
                                  >
                                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                                  </svg> */}
                                  <s-text

                                  >
                                    {page.title}
                                  </s-text>
                                  {pages.length > 1 && (
                                    <s-button

                                      title="Delete Page"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deletePage(page.id);
                                      }}
                                    >
                                      {/* <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      >
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        <line
                                          x1="10"
                                          y1="11"
                                          x2="10"
                                          y2="17"
                                        ></line>
                                        <line
                                          x1="14"
                                          y1="11"
                                          x2="14"
                                          y2="17"
                                        ></line>
                                      </svg> */}
                                      <s-icon type="delete" />
                                    </s-button>
                                  )}
                                </s-stack>

                                {/* Indented Fields Tree with Left Dotted Line */}
                                {!collapsedPages[page.id] && (
                                  <s-stack className="tree-dotted-line">
                                    {pageFields.map((field, idx) => (



                                      <s-button inlineSize="fill" key={field.id}
                                        className={`tree-field-item ${selectedFieldId === field.id ? "active" : ""}`}
                                        onClick={() => setSelectedFieldId(field.id)} >
                                        {field.label}
                                      </s-button>
                                    ))}

                                    {/* Add element button inside the indent */}
                                    <s-box
                                      className="add-tree-item"
                                      onClick={() => {
                                        setAddingToPage(page.id);
                                        setShowAddMenu(true);
                                      }}
                                      padding="none"
                                    >
                                      <s-stack
                                        direction="inline"
                                        alignItems="center"
                                        gap="small"
                                      >
                                        <s-icon type="plus-circle"></s-icon>
                                        <s-text
                                          style={{
                                            color: "#005ccc",
                                            fontSize: "14px",
                                            fontWeight: "500",
                                          }}
                                        >
                                          Add element
                                        </s-text>
                                      </s-stack>
                                    </s-box>
                                  </s-stack>
                                )}
                              </s-stack>
                            );
                          })}

                          {/* Add page button outside the indent */}
                          <s-box
                            className="add-tree-item"
                            padding="none"
                            onClick={() => {
                              const newPageNum = pages.length + 1;
                              setPages([
                                ...pages,
                                { id: newPageNum, title: `Page ${newPageNum}` },
                              ]);
                              setActivePreviewPage(newPageNum);
                              triggerToast(`Page ${newPageNum} added`);
                            }}
                          >
                            <s-stack
                              direction="inline"
                              alignItems="center"
                              gap="small"
                            >
                              <s-icon type="plus-circle"></s-icon>

                              <s-text>Add page</s-text>
                            </s-stack>
                          </s-box>

                          {/* Premium Clickable Footer card in the Elements list */}
                          <s-button
                            inlineSize="fill"
                            className="tree-field-item"
                            onClick={() => setSelectedFieldId("form-footer")}

                            onMouseEnter={(e) => {
                              if (selectedFieldId !== "form-footer") {
                                e.currentTarget.style.borderColor = "#bbc3c9";
                                e.currentTarget.style.background = "#f6f6f7";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (selectedFieldId !== "form-footer") {
                                e.currentTarget.style.borderColor = "#e1e3e5";
                                e.currentTarget.style.background = "#ffffff";
                              }
                            }}
                          >
                            Footer
                          </s-button>

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
                    ) : selectedFieldId === "form-header" ? (
                      // Detail Editor for Form Header
                      <s-section padding="none" gap="none">
                        <s-stack gap="base" padding="base">
                          <s-stack
                            direction="inline"
                            alignItems="center"
                            gap="base" >
                            <s-button
                              variant="secondary"
                              onClick={() => setSelectedFieldId(null)}
                            >
                              <s-icon type="arrow-left"></s-icon>
                            </s-button>
                            <s-heading level="3">Edit Header</s-heading>
                          </s-stack>

                          <s-stack gap="base">
                            <s-text-field
                              label="Form title"
                              value={formHeaderTitle}
                              onInput={handleFieldInput}
                              onChange={(e) =>
                                setFormHeaderTitle(e.currentTarget.value)
                              }
                              details="Header displayed at the top of the form"
                            />

                            <s-textarea
                              label="Form description"
                              value={formDescription}
                              onChange={(e) => {
                                handleFieldInput();
                                setFormDescription(e.currentTarget.value);
                              }}
                              rows={5}
                              placeholder="Short text below the form title"
                            />
                          </s-stack>
                        </s-stack>
                      </s-section>
                    ) : selectedFieldId === "form-footer" ? (
                      // Detail Editor for Form Footer
                      <s-section padding="none" gap="none">
                        <s-stack gap="base" padding="none">
                          {/* Back Header Nav */}
                          <s-stack
                            direction="inline"
                            alignItems="center"
                            gap="base">
                            <s-button
                              variant="secondary"
                              onClick={() => setSelectedFieldId(null)}
                            >
                              <s-icon type="arrow-left"></s-icon>
                            </s-button>
                            <s-heading level="3">Footer</s-heading>
                          </s-stack>

                          <s-stack gap="base">
                            {/* Rich text / Description block */}
                            <s-textarea
                              label="Text"
                              value={footerText}
                              onChange={(e) => {
                                handleFieldInput();
                                setFooterText(e.currentTarget.value);
                              }}
                              rows={4}
                              placeholder="Write any footer text or instructions here"
                            />

                            {/* Previous button text input */}
                            <s-text-field
                              label="Previous"
                              value={footerPreviousText}
                              onInput={handleFieldInput}
                              onChange={(e) =>
                                setFooterPreviousText(e.currentTarget.value)
                              }
                            />

                            {/* Next button text input */}
                            <s-text-field
                              label="Next"
                              value={footerNextText}
                              onInput={handleFieldInput}
                              onChange={(e) =>
                                setFooterNextText(e.currentTarget.value)
                              }
                            />

                            {/* Submit text input */}
                            <s-text-field
                              label="Submit text"
                              value={footerSubmitText}
                              onInput={handleFieldInput}
                              onChange={(e) =>
                                setFooterSubmitText(e.currentTarget.value)
                              }
                            />

                            {/* Reset Button Toggle */}
                            <s-stack direction="inline" alignItems="center" gap="small" style={{ marginTop: "8px" }}>

                              <s-checkbox
                                label="Reset button" id="footer-reset-checkbox"
                                checked={footerShowReset}
                                onChange={(e) => {
                                  handleFieldInput();
                                  setFooterShowReset(e.target.checked);
                                }} ></s-checkbox>

                            </s-stack>

                            {/* Full width toggle */}
                            <s-stack direction="inline" alignItems="center" gap="small">
                              <s-checkbox
                                label="Full width footer button"
                                id="footer-full-width-checkbox"
                                checked={footerFullWidth}
                                onChange={(e) => {
                                  handleFieldInput();
                                  setFooterFullWidth(e.target.checked);
                                }}
                              ></s-checkbox>

                            </s-stack>
                          </s-stack>
                        </s-stack>
                      </s-section>
                    ) : (
                      // Detail Editor when a field is selected
                      <s-section>
                        <s-stack gap="base" padding="none" >
                          <s-stack
                            direction="inline"
                            alignItems="center"
                            gap="base">
                            <s-button
                              variant="secondary"
                              onClick={() => setSelectedFieldId(null)}
                            >
                              <s-icon type="arrow-left"></s-icon>
                            </s-button>
                            <s-heading level="3">Edit Field</s-heading>
                          </s-stack>

                          <s-stack gap="base">
                            {/* Label */}
                            <s-text-field
                              label="Label"
                              value={selectedField.label || ""}
                              onChange={(e) =>
                                updateSelectedField(
                                  "label",
                                  e.currentTarget.value,
                                )
                              }
                            ></s-text-field>

                            {/* Placeholder */}
                            {selectedField.type !== "file" &&
                              selectedField.type !== "divider" &&
                              selectedField.type !== "rating" &&
                              selectedField.type !== "feedback" &&
                              selectedField.type !== "signature" &&
                              selectedField.type !== "product" && (
                                <s-text-field
                                  label="Placeholder"
                                  value={selectedField.placeholder || ""}
                                  onChange={(e) =>
                                    updateSelectedField(
                                      "placeholder",
                                      e.currentTarget.value,
                                    )
                                  }
                                ></s-text-field>
                              )}

                            {/* Description */}
                            <s-text-field
                              label="Description"
                              value={selectedField.description || ""}
                              onChange={(e) =>
                                updateSelectedField(
                                  "description",
                                  e.currentTarget.value,
                                )
                              }
                            ></s-text-field>

                            {/* Default Value */}
                            {selectedField.type !== "file" &&
                              selectedField.type !== "divider" &&
                              selectedField.type !== "rating" &&
                              selectedField.type !== "feedback" &&
                              selectedField.type !== "signature" &&
                              selectedField.type !== "product" && (
                                <s-text-field
                                  label="Default value"
                                  value={selectedField.defaultValue || ""}
                                  onChange={(e) =>
                                    updateSelectedField(
                                      "defaultValue",
                                      e.currentTarget.value,
                                    )
                                  }
                                ></s-text-field>
                              )}

                            {/* Default Country for Phone/Tel fields */}
                            {(selectedField.type === "phone" ||
                              selectedField.type === "tel") && (
                                <s-stack gap="small">

                                  <s-select
                                    label="Default Country"
                                    onChange={(e) => {
                                      handleFieldInput();
                                      updateSelectedField(
                                        "defaultCountry",
                                        e.target.value,
                                      );
                                    }}>
                                    {countriesList.map((c) => (
                                      <s-option value={selectedField.defaultCountry || "IN"}
                                        key={c.code} value={c.code}>
                                        {c.name} ({c.dial})
                                      </s-option>
                                    ))}
                                  </s-select>
                                </s-stack>
                              )}

                            {/* Options for selects */}
                            {(selectedField.type === "select" ||
                              selectedField.type === "dropdown" ||
                              selectedField.type === "checkboxes" ||
                              selectedField.type === "radio") && (
                                <s-text-field
                                  label="Options (comma separated)"
                                  value={
                                    selectedField.options
                                      ? selectedField.options.join(", ")
                                      : ""
                                  }
                                  onChange={(e) =>
                                    updateSelectedField(
                                      "options",
                                      e.currentTarget.value
                                        .split(",")
                                        .map((s) => s.trim()),
                                    )
                                  }
                                ></s-text-field>
                              )}

                            {/* Checkboxes stacked */}
                            <s-stack gap="small">
                              {/* Limit characters */}
                              {[
                                "text",
                                "textarea",
                                "email",
                                "url",
                                "password",
                              ].includes(selectedField.type) && (
                                  <s-stack gap="small">
                                    <s-stack
                                      direction="inline"
                                      gap="small"
                                      alignItems="center"
                                    >
                                      <s-checkbox
                                        label="Limit characters"
                                        id="limit-characters-checkbox"
                                        checked={
                                          selectedField.limitCharacters || false
                                        }
                                        onChange={(e) =>
                                          updateSelectedField(
                                            "limitCharacters",
                                            e.target.checked,
                                          )
                                        }
                                      ></s-checkbox>

                                    </s-stack>

                                    {selectedField.limitCharacters && (
                                      <s-stack gap="small">
                                        <s-stack direction="inline" gap="base">
                                          <s-number-field
                                            label="Min characters"
                                            value={selectedField.minCharacters ?? ""}
                                            onChange={(e) =>
                                              updateSelectedField(
                                                "minCharacters",
                                                e.target.value === "" ? "" : parseInt(e.target.value, 10)
                                              )
                                            }></s-number-field>

                                          <s-number-field
                                            label="Max characters"
                                            value={selectedField.maxCharacters ?? ""}
                                            onChange={(e) =>
                                              updateSelectedField(
                                                "maxCharacters",
                                                e.target.value === "" ? "" : parseInt(e.target.value, 10)
                                              )
                                            }></s-number-field>


                                        </s-stack>
                                        <s-text >
                                          Note: If you don't want to set a maximum number of characters, please leave this field blank instead of setting it to 0.
                                        </s-text>
                                      </s-stack>
                                    )}
                                  </s-stack>
                                )}

                              {/* Hide label */}
                              {selectedField.type !== "divider" &&
                                selectedField.type !== "heading" &&
                                selectedField.type !== "paragraph" && (
                                  <s-checkbox
                                    label="Hide label"
                                    id="hide-label-checkbox"
                                    checked={selectedField.hideLabel || false}
                                    onChange={(e) =>
                                      updateSelectedField(
                                        "hideLabel",
                                        e.target.checked,
                                      )
                                    }
                                  ></s-checkbox>
                                )}

                              {/* Required */}
                              {selectedField.type !== "heading" &&
                                selectedField.type !== "paragraph" &&
                                selectedField.type !== "divider" &&
                                selectedField.type !== "button" && (
                                  <s-checkbox
                                    label="Required"
                                    id="required-checkbox"
                                    checked={selectedField.required || false}
                                    onChange={(e) =>
                                      updateSelectedField(
                                        "required",
                                        e.target.checked,
                                      )
                                    }
                                  ></s-checkbox>
                                )}
                              {/* Rating special fields */}
                              {(selectedField.type === "rating" ||
                                selectedField.type === "feedback") && (
                                  <s-stack gap="small" style={{ marginTop: "8px" }}>
                                    <s-checkbox
                                      label="Choose another icon"
                                      id="choose-another-icon-checkbox"
                                      checked={selectedField.chooseAnotherIcon || false}
                                      onChange={(e) =>
                                        updateSelectedField(
                                          "chooseAnotherIcon",
                                          e.target.checked,
                                        )
                                      }
                                    ></s-checkbox>

                                    {selectedField.chooseAnotherIcon && (
                                      <s-stack gap="small" style={{ paddingLeft: "24px", marginTop: "4px" }}>
                                        <s-select
                                          label="Select Icon"
                                          value={selectedField.ratingIcon || "star"}
                                          onChange={(e) =>
                                            updateSelectedField(
                                              "ratingIcon",
                                              e.target.value,
                                            )
                                          }
                                        >
                                          <s-option value="star">Star (⭐)</s-option>
                                          <s-option value="heart">Heart (❤️)</s-option>
                                          <s-option value="smile">Smile (😊)</s-option>
                                          <s-option value="thumb">Thumb up (👍)</s-option>
                                        </s-select>
                                      </s-stack>
                                    )}

                                    <s-checkbox
                                      label="Show number under icon"
                                      id="show-number-under-icon-checkbox"
                                      checked={selectedField.showNumberUnderIcon || false}
                                      onChange={(e) =>
                                        updateSelectedField(
                                          "showNumberUnderIcon",
                                          e.target.checked,
                                        )
                                      }
                                      style={{ marginTop: "4px" }}
                                    ></s-checkbox>
                                  </s-stack>
                                )}


                              {/* Enter numbers only */}
                              {["text", "number"].includes(
                                selectedField.type,
                              ) && (
                                  <s-checkbox
                                    label="Enter numbers only"
                                    id="numbers-only-checkbox"
                                    checked={selectedField.numbersOnly || false}
                                    onChange={(e) =>
                                      updateSelectedField(
                                        "numbersOnly",
                                        e.target.checked,
                                      )
                                    }
                                  ></s-checkbox>
                                )}

                              {/* Show required note if hide label */}
                              {selectedField.type !== "divider" &&
                                selectedField.type !== "heading" &&
                                selectedField.type !== "paragraph" && (
                                  <s-checkbox
                                    label="Show required note if hide label?"
                                    id="show-required-note-checkbox"
                                    checked={
                                      selectedField.showRequiredNoteIfHideLabel ||
                                      false
                                    }
                                    onChange={(e) =>
                                      updateSelectedField(
                                        "showRequiredNoteIfHideLabel",
                                        e.target.checked,
                                      )
                                    }
                                  ></s-checkbox>
                                )}
                            </s-stack>

                            {/* Column width */}
                            <s-stack gap="small" style={{ marginTop: "12px" }}>
                              <s-text
                                style={{
                                  fontSize: "12px",
                                  color: "#6d7175",
                                  fontWeight: "500",
                                }}
                              >
                                Column width
                              </s-text>
                              <div
                                style={{
                                  display: "flex",
                                  background: "#f1f2f4",
                                  borderRadius: "8px",
                                  padding: "3px",
                                  border: "1px solid #bbc3c9",
                                }}
                              >
                                {["33%", "50%", "100%"].map((w) => {
                                  const isActive =
                                    selectedField.columnWidth === w ||
                                    (!selectedField.columnWidth && w === "50%");
                                  return (
                                    <button
                                      key={w}
                                      onClick={() =>
                                        updateSelectedField("columnWidth", w)
                                      }
                                      style={{
                                        flex: 1,
                                        border: "none",
                                        background: isActive
                                          ? "#ffffff"
                                          : "transparent",
                                        borderRadius: "6px",
                                        padding: "6px 0",
                                        fontSize: "13px",
                                        fontWeight: isActive ? "600" : "400",
                                        color: isActive ? "#202223" : "#6d7175",
                                        boxShadow: isActive
                                          ? "0 1px 3px rgba(0,0,0,0.1)"
                                          : "none",
                                        cursor: "pointer",
                                        transition: "all 0.15s ease",
                                      }}
                                    >
                                      {w}
                                    </button>
                                  );
                                })}
                              </div>
                            </s-stack>

                            <s-divider></s-divider>

                            <s-button
                              variant="secondary"
                              tone="critical"
                              onClick={() => deleteField(selectedField.id)}
                              style={{ width: "100%" }}
                            >
                              Delete Field
                            </s-button>
                          </s-stack>
                        </s-stack>
                      </s-section>
                    )}
                  </>
                )}

                {activeTab === "appearance" && (
                  <s-section padding="none">
                    <s-stack gap="base" padding="none">
                      <s-heading level="3">Appearance settings</s-heading>

                      {/* Group 1: General Layout & Font */}
                      <s-heading level="4" style={{ color: "#6d7175", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "12px" }}>
                        General Layout & Font
                      </s-heading>

                      {/* Font Family */}
                      <s-select
                        label="Font Family"
                        value={fontFamily}
                        onChange={(e) => {
                          handleFieldInput();
                          setFontFamily(e.currentTarget.value);
                        }}
                      >
                        <s-option value="Inter, sans-serif">Inter</s-option>
                        <s-option value="Outfit, sans-serif">Outfit</s-option>
                        <s-option value="system-ui, sans-serif">System UI</s-option>
                        <s-option value="Georgia, serif">Georgia</s-option>
                      </s-select>

                      {/* Border Radius */}
                      <s-select
                        label="Border Radius"
                        value={borderRadius}
                        onChange={(e) => {
                          handleFieldInput();
                          setBorderRadius(e.currentTarget.value);
                        }}
                      >
                        <s-option value="0px">Square (0px)</s-option>
                        <s-option value="4px">Soft (4px)</s-option>
                        <s-option value="8px">Standard (8px)</s-option>
                        <s-option value="16px">Rounded (16px)</s-option>
                        <s-option value="30px">Pill (30px)</s-option>
                      </s-select>

                      {/* Form Background */}
                      <s-stack gap="small">
                        <s-text style={{ fontSize: "14px", fontWeight: "500", color: "#202223" }}>
                          Form Background Color
                        </s-text>
                        <s-color-picker
                          value={backgroundColor}
                          onChange={(e) => {
                            handleFieldInput();
                            setBackgroundColor(e.target.value);
                          }}
                        ></s-color-picker>
                        <s-text-field
                          value={backgroundColor}
                          onInput={handleFieldInput}
                          onChange={(e) => setBackgroundColor(e.currentTarget.value)}
                        />
                      </s-stack>

                      {/* Group 2: Form Header Text Styling */}
                      <s-heading level="4" style={{ color: "#6d7175", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "16px" }}>
                        Form Header Text Styling
                      </s-heading>

                      {/* Title Color */}
                      <s-stack gap="small">
                        <s-text style={{ fontSize: "14px", fontWeight: "500", color: "#202223" }}>
                          Title Color
                        </s-text>
                        <s-color-picker
                          value={titleColor}
                          onChange={(e) => {
                            handleFieldInput();
                            setTitleColor(e.target.value);
                          }}
                        ></s-color-picker>
                        <s-text-field
                          value={titleColor}
                          onInput={handleFieldInput}
                          onChange={(e) => setTitleColor(e.currentTarget.value)}
                        />
                      </s-stack>

                      {/* Title Font Size */}
                      <s-select
                        label="Title Font Size"
                        value={titleFontSize}
                        onChange={(e) => {
                          handleFieldInput();
                          setTitleFontSize(e.currentTarget.value);
                        }}
                      >
                        <s-option value="20px">Small (20px)</s-option>
                        <s-option value="24px">Medium (24px)</s-option>
                        <s-option value="26px">Standard (26px)</s-option>
                        <s-option value="28px">Large (28px)</s-option>
                        <s-option value="32px">Extra Large (32px)</s-option>
                        <s-option value="36px">Display (36px)</s-option>
                      </s-select>

                      {/* Description Color */}
                      <s-stack gap="small">
                        <s-text style={{ fontSize: "14px", fontWeight: "500", color: "#202223" }}>
                          Description Color
                        </s-text>
                        <s-color-picker
                          value={descriptionColor}
                          onChange={(e) => {
                            handleFieldInput();
                            setDescriptionColor(e.target.value);
                          }}
                        ></s-color-picker>
                        <s-text-field
                          value={descriptionColor}
                          onInput={handleFieldInput}
                          onChange={(e) => setDescriptionColor(e.currentTarget.value)}
                        />
                      </s-stack>

                      {/* Description Font Size */}
                      <s-select
                        label="Description Font Size"
                        value={descriptionFontSize}
                        onChange={(e) => {
                          handleFieldInput();
                          setDescriptionFontSize(e.currentTarget.value);
                        }}
                      >
                        <s-option value="12px">Small (12px)</s-option>
                        <s-option value="13px">Medium Small (13px)</s-option>
                        <s-option value="14px">Standard (14px)</s-option>
                        <s-option value="16px">Large (16px)</s-option>
                        <s-option value="18px">Extra Large (18px)</s-option>
                      </s-select>

                      {/* Group 3: Form Fields & Inputs */}
                      <s-heading level="4" style={{ color: "#6d7175", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "16px" }}>
                        Form Fields & Inputs
                      </s-heading>

                      {/* Label Color */}
                      <s-stack gap="small">
                        <s-text style={{ fontSize: "14px", fontWeight: "500", color: "#202223" }}>
                          Field Label Color
                        </s-text>
                        <s-color-picker
                          value={labelColor}
                          onChange={(e) => {
                            handleFieldInput();
                            setLabelColor(e.target.value);
                          }}
                        ></s-color-picker>
                        <s-text-field
                          value={labelColor}
                          onInput={handleFieldInput}
                          onChange={(e) => setLabelColor(e.currentTarget.value)}
                        />
                      </s-stack>

                      {/* Label Font Size */}
                      <s-select
                        label="Field Label Font Size"
                        value={labelFontSize}
                        onChange={(e) => {
                          handleFieldInput();
                          setLabelFontSize(e.currentTarget.value);
                        }}
                      >
                        <s-option value="12px">Small (12px)</s-option>
                        <s-option value="13px">Medium Small (13px)</s-option>
                        <s-option value="14px">Standard (14px)</s-option>
                        <s-option value="15px">Medium Large (15px)</s-option>
                        <s-option value="16px">Large (16px)</s-option>
                      </s-select>

                      {/* Input Background Color */}
                      <s-stack gap="small">
                        <s-text style={{ fontSize: "14px", fontWeight: "500", color: "#202223" }}>
                          Input Background Color
                        </s-text>
                        <s-color-picker
                          value={inputBgColor}
                          onChange={(e) => {
                            handleFieldInput();
                            setInputBgColor(e.target.value);
                          }}
                        ></s-color-picker>
                        <s-text-field
                          value={inputBgColor}
                          onInput={handleFieldInput}
                          onChange={(e) => setInputBgColor(e.currentTarget.value)}
                        />
                      </s-stack>

                      {/* Input Text Color */}
                      <s-stack gap="small">
                        <s-text style={{ fontSize: "14px", fontWeight: "500", color: "#202223" }}>
                          Input Text Color
                        </s-text>
                        <s-color-picker
                          value={inputTextColor}
                          onChange={(e) => {
                            handleFieldInput();
                            setInputTextColor(e.target.value);
                          }}
                        ></s-color-picker>
                        <s-text-field
                          value={inputTextColor}
                          onInput={handleFieldInput}
                          onChange={(e) => setInputTextColor(e.currentTarget.value)}
                        />
                      </s-stack>

                      {/* Input Border Color */}
                      <s-stack gap="small">
                        <s-text style={{ fontSize: "14px", fontWeight: "500", color: "#202223" }}>
                          Input Border Color
                        </s-text>
                        <s-color-picker
                          value={inputBorderColor}
                          onChange={(e) => {
                            handleFieldInput();
                            setInputBorderColor(e.target.value);
                          }}
                        ></s-color-picker>
                        <s-text-field
                          value={inputBorderColor}
                          onInput={handleFieldInput}
                          onChange={(e) => setInputBorderColor(e.currentTarget.value)}
                        />
                      </s-stack>

                      {/* Group 4: Buttons & Interactions */}
                      <s-heading level="4" style={{ color: "#6d7175", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "16px" }}>
                        Buttons & Actions
                      </s-heading>

                      {/* Primary Brand Color (Submit Button Background) */}
                      <s-stack gap="small">
                        <s-text style={{ fontSize: "14px", fontWeight: "500", color: "#202223" }}>
                          Button Background Color (Primary Color)
                        </s-text>
                        <s-color-picker
                          value={primaryColor}
                          onChange={(e) => {
                            handleFieldInput();
                            setPrimaryColor(e.target.value);
                          }}
                        ></s-color-picker>
                        <s-text-field
                          value={primaryColor}
                          onInput={handleFieldInput}
                          onChange={(e) => setPrimaryColor(e.currentTarget.value)}
                        />
                      </s-stack>

                      {/* Button Text Color */}
                      <s-stack gap="small">
                        <s-text style={{ fontSize: "14px", fontWeight: "500", color: "#202223" }}>
                          Button Text Color
                        </s-text>
                        <s-color-picker
                          value={btnTextColor}
                          onChange={(e) => {
                            handleFieldInput();
                            setBtnTextColor(e.target.value);
                          }}
                        ></s-color-picker>
                        <s-text-field
                          value={btnTextColor}
                          onInput={handleFieldInput}
                          onChange={(e) => setBtnTextColor(e.currentTarget.value)}
                        />
                      </s-stack>
                    </s-stack>
                  </s-section>
                )}

                {activeTab === "after-submit" && (
                  <s-section>
                    <s-stack gap="base" style={{ padding: "8px 0" }}>
                      <s-heading
                        level="3"
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#202223",
                        }}
                      >
                        After submit
                      </s-heading>

                      {/* Action Select Web Component */}
                      <s-select
                        label="Action"
                        value={afterSubmitAction}
                        onChange={(e) =>
                          setAfterSubmitAction(e.currentTarget.value)
                        }
                      >
                        <s-option value="successful" >Show successful message</s-option>
                        <s-option value="clear">Clear form</s-option>
                        <s-option value="redirect">Redirect to page</s-option>
                        {/* <s-option value="hide">Hide form</s-option> */}
                      </s-select>

                      {afterSubmitAction === "redirect" && (
                        <s-text-field
                          label="Redirect URL"
                          value={redirectUrl}
                          onChange={(e) => setRedirectUrl(e.currentTarget.value)}
                          placeholder="e.g. /pages/thank-you"
                          details="URL where customers will be redirected on successful submission"
                        ></s-text-field>
                      )}

                      {afterSubmitAction === "successful" && (
                        <>
                          {/* Title Input Web Component */}
                          <div style={{ position: "relative" }}>
                            <s-text-field
                              label="Title"
                              value={successTitle}
                              onChange={(e) => setSuccessTitle(e.currentTarget.value)}
                            ></s-text-field>

                          </div>

                          {/* Message Editor using Spruce structures */}
                          <s-stack gap="small">
                            <s-stack
                              direction="inline"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <s-text
                                style={{
                                  fontSize: "12px",
                                  color: "#6d7175",
                                  fontWeight: "500",
                                }}
                              >
                                Message
                              </s-text>
                              {/* DB symbol icon */}
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#6d7175"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ cursor: "pointer" }}
                              >
                                <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                                <path d="M3 5V19A9 3 0 0 0 21 19V5"></path>
                                <path d="M3 12A9 3 0 0 0 21 12"></path>
                              </svg>
                            </s-stack>

                            <div
                              style={{
                                border: "1px solid #bbc3c9",
                                borderRadius: "6px",
                                overflow: "hidden",
                                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                              }}
                            >
                              <Editor
                                value={successMessage}
                                onChange={(e) => setSuccessMessage(e.target.value)}
                                style={{
                                  minHeight: "140px",
                                  fontSize: "14px",
                                  color: "#202223",
                                  lineHeight: "1.5",
                                  fontFamily: "inherit",
                                }}
                              />
                            </div>
                          </s-stack>
                        </>
                      )}
                    </s-stack>
                  </s-section>
                )}

                {activeTab === "mail" && (
                  <s-stack gap="base">
                    {!activeEmailTemplate ? (
                      <s-section gap="base">
                        {/* <s-heading level="3">Mail &amp; Notifications</s-heading> */}
                        <s-text

                        >
                          {config.mailDescription}
                        </s-text>


                        <s-heading
                          level="4"
                          padding="base"
                        >
                          Email to Customers
                        </s-heading>
                        {[
                          {
                            key: "submitted",
                            label: "Application submitted",
                            desc: "Sent automatically when a customer submits the form",
                            icon: (
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                              </svg>
                            ),
                          },
                          ...(formCategory === "b2b" ? [
                            {
                              key: "approved",
                              label: "Application approved",
                              desc: "Sent when admin approves the application",
                              icon: (
                                <svg
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                  <polyline points="9 11 11 13 15 9" />
                                </svg>
                              ),
                            },
                            {
                              key: "rejected",
                              label: "Application rejected",
                              desc: "Sent when admin rejects the application",
                              icon: (
                                <svg
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <circle cx="12" cy="12" r="10" />
                                  <line x1="15" y1="9" x2="9" y2="15" />
                                  <line x1="9" y1="9" x2="15" y2="15" />
                                </svg>
                              ),
                            },
                          ] : []),
                        ].map((item) => {
                          const isEnabled =
                            emailTemplates[item.key].enabled === "enabled";
                          return (
                            <div
                              key={item.key}
                              className="email-template-card"
                              onClick={() => setActiveEmailTemplate(item.key)}
                            >
                              <div className="email-template-card-icon">
                                {item.icon}
                              </div>
                              <div className="email-template-card-info">
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <span className="email-template-card-title">
                                    {item.label}
                                  </span>
                                  <span
                                    className={`email-status-badge ${isEnabled ? "enabled" : "disabled"}`}
                                  >
                                    {isEnabled ? "Enabled" : "Disabled"}
                                  </span>
                                </div>
                                <div className="email-template-card-desc">
                                  {item.desc}
                                </div>
                              </div>
                              <div className="email-template-card-chevron">
                                <svg
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                              </div>
                            </div>
                          );
                        })}


                        <div style={{ marginTop: "16px" }}>
                          <s-heading
                            level="4"
                            style={{
                              fontSize: "11px",
                              fontWeight: "700",
                              color: "#6d7175",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                              marginBottom: "8px",
                            }}
                          >
                            Email to Store Admin
                          </s-heading>
                          {(() => {
                            const isAdminEnabled =
                              emailTemplates.admin.enabled === "enabled";
                            return (
                              <div
                                className="email-template-card"
                                onClick={() => setActiveEmailTemplate("admin")}
                              >
                                <div className="email-template-card-icon">
                                  <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                  </svg>
                                </div>
                                <div className="email-template-card-info">
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <span className="email-template-card-title">
                                      Application received
                                    </span>
                                    <span
                                      className={`email-status-badge ${isAdminEnabled ? "enabled" : "disabled"}`}
                                    >
                                      {isAdminEnabled ? "Enabled" : "Disabled"}
                                    </span>
                                  </div>
                                  <div className="email-template-card-desc">
                                    Sent to store admin on new submissions
                                  </div>
                                </div>
                                <div className="email-template-card-chevron">
                                  <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                  </svg>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </s-section>
                    ) : (
                      <s-section gap="base">
                        <div className="email-edit-header">
                          <button
                            type="button"
                            className="email-back-btn"
                            onClick={() => setActiveEmailTemplate(null)}
                            aria-label="Go back"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <line x1="19" y1="12" x2="5" y2="12"></line>
                              <polyline points="12 19 5 12 12 5"></polyline>
                            </svg>
                          </button>
                          <div className="email-header-text">
                            {/* <div className="email-header-breadcrumb">
                              Mail &amp; Notifications / Template
                            </div> */}
                            <s-heading
                              level="3"
                              style={{
                                fontSize: "16px",
                                fontWeight: "600",
                                color: "#202223",
                              }}
                            >
                              {activeEmailTemplate === "submitted"
                                ? "Application Submitted"
                                : activeEmailTemplate === "approved"
                                  ? "Application Approved"
                                  : activeEmailTemplate === "rejected"
                                    ? "Application Rejected"
                                    : "Application Received"}
                            </s-heading>
                          </div>
                        </div>

                        <s-select
                          label="Email notifications"
                          value={emailTemplates[activeEmailTemplate].enabled}
                          onChange={(e) =>
                            updateEmailTemplate(
                              activeEmailTemplate,
                              "enabled",
                              e.currentTarget.value,
                            )
                          }
                        >
                          <s-option value="disabled">Disabled</s-option>
                          <s-option value="enabled">Enabled</s-option>
                        </s-select>

                        <s-text-field
                          label="Reply to"
                          placeholder="e.g. support@example.com"
                          value={emailTemplates[activeEmailTemplate].replyTo}
                          onChange={(e) =>
                            updateEmailTemplate(
                              activeEmailTemplate,
                              "replyTo",
                              e.currentTarget.value,
                            )
                          }
                          details="Customer replies will be sent here"
                        ></s-text-field>

                        <s-text-field
                          label="Subject"
                          value={emailTemplates[activeEmailTemplate].subject}
                          onChange={(e) =>
                            updateEmailTemplate(
                              activeEmailTemplate,
                              "subject",
                              e.currentTarget.value,
                            )
                          }
                        ></s-text-field>

                        <s-stack gap="small">
                          <s-text
                            style={{
                              fontSize: "12px",
                              color: "#6d7175",
                              fontWeight: "500",
                            }}
                          >
                            Email Body
                          </s-text>
                          <div
                            style={{
                              border: "1px solid #bbc3c9",
                              borderRadius: "6px",
                              overflow: "hidden",
                              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                            }}
                          >
                            <Editor
                              value={emailTemplates[activeEmailTemplate].body}
                              onChange={(e) =>
                                updateEmailTemplate(
                                  activeEmailTemplate,
                                  "body",
                                  e.target.value,
                                )
                              }
                              style={{
                                minHeight: "200px",
                                fontSize: "14px",
                                color: "#202223",
                                lineHeight: "1.6",
                                fontFamily: "inherit",
                              }}
                            />
                          </div>
                        </s-stack>

                        <div className="variables-helper-container">
                          <div className="variables-helper-title">
                            Available Personalization Tokens
                          </div>
                          <div className="variables-helper-desc">
                            Click any token to copy and insert it into your email
                            subject or body:
                          </div>
                          <div className="variables-chips-grid">
                            {[
                              { token: "{{firstName}}", label: "First Name" },
                              { token: "{{lastName}}", label: "Last Name" },
                              { token: "{{email}}", label: "Customer Email" },
                              { token: "{{companyName}}", label: "Company Name" },
                              { token: "{{storeName}}", label: "Store Name" },
                            ].map((item) => (
                              <button
                                key={item.token}
                                type="button"
                                className="variable-chip"
                                onClick={() => {
                                  navigator.clipboard.writeText(item.token);
                                  triggerToast(
                                    `Copied ${item.token} to clipboard!`,
                                  );
                                }}
                                title={`Copy ${item.token}`}
                              >
                                <span className="variable-chip-token">
                                  {item.token}
                                </span>
                                <span className="variable-chip-label">
                                  {item.label}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </s-section>
                    )}
                  </s-stack>
                )}

                {activeTab === "integration" && (
                  <s-stack gap="base">
                    <s-heading level="3">Integrations & Syncing</s-heading>
                    <s-text
                      style={{
                        fontSize: "12px",
                        color: "#6d7175",
                        lineHeight: "1.4",
                      }}
                    >
                      Connect the registration form data directly with your
                      Shopify storefront backend.
                    </s-text>

                    {formCategory === "b2b" && (
                      <s-text-field
                        label="Apply Customer Tags"
                        value={customerTag}
                        onChange={(e) => setCustomerTag(e.currentTarget.value)}
                        details="Comma separated tags to assign to the registered customer account."
                      ></s-text-field>
                    )}

                    <s-checkbox
                      label="Sync details to customer metafields"
                      id="sync-metafield"
                      checked={syncMetafields}
                      onChange={(e) => setSyncMetafields(e.target.checked)}
                      style={{ marginTop: "8px" }}
                    ></s-checkbox>
                  </s-stack>
                )}

                {activeTab === "rules" && (
                  <s-stack gap="base" style={{ padding: "8px 0" }}>
                    <s-heading level="3">Conditional Rules</s-heading>
                    <s-text style={{ fontSize: "13px", color: "#6d7175", lineHeight: "1.4" }}>
                      Create conditional logic to show, hide, or require fields dynamically based on the inputs provided by your customers.
                    </s-text>

                    {editingRuleId === null ? (
                      <s-stack gap="base" style={{ marginTop: "8px" }}>
                        {rules.length === 0 ? (
                          <s-stack
                            style={{
                              padding: "24px",
                              border: "1px dashed #e1e3e5",
                              borderRadius: "8px",
                              textAlign: "center",
                              background: "#fafafb",
                            }}
                          >
                            <s-text >
                              No active conditional rules for this form.
                            </s-text>
                            <s-stack justifyContent="center" padding="base none" >
                              <s-button
                                variant="secondary"
                                onClick={() => {
                                  setEditingRuleId("new");
                                  setRuleField(fields[0]?.id || "");
                                  setRuleCondition("empty");
                                  setRuleValue("");
                                  setRuleAction("show");
                                  setRuleTarget(fields[0]?.id || "");
                                }}
                              >
                                Add your first rule
                              </s-button>
                            </s-stack>
                          </s-stack>
                        ) : (
                          <s-stack gap="small">
                            {rules.map((rule, idx) => {
                              const srcField = fields.find(f => f.id === rule.fieldId);
                              const tgtField = fields.find(f => f.id === rule.targetFieldId);
                              const conditionLabels = {
                                empty: "is empty",
                                not_empty: "is not empty",
                                equals: "equals",
                                contains: "contains",
                              };
                              const actionLabels = {
                                show: "Show",
                                hide: "Hide",
                                require: "Make required",
                                optional: "Make optional",
                              };

                              return (
                                <div
                                  key={rule.id || idx}
                                  style={{
                                    border: "1px solid #e1e3e5",
                                    borderRadius: "8px",
                                    padding: "12px 16px",
                                    background: "#ffffff",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                                  }}
                                >
                                  <s-stack gap="extra-tight" style={{ flex: 1 }}>
                                    <s-text fontWeight="semibold" style={{ fontSize: "13px", color: "#202223" }}>
                                      Rule {idx + 1}
                                    </s-text>
                                    <s-text style={{ fontSize: "12px", color: "#6d7175", lineHeight: "1.4" }}>
                                      If <strong>{srcField?.label || srcField?.type || "Field"}</strong>{" "}
                                      {conditionLabels[rule.condition]}{" "}
                                      {["equals", "contains"].includes(rule.condition) && `"${rule.value}"`},{" "}
                                      then <strong>{actionLabels[rule.action]}</strong>{" "}
                                      <strong>{tgtField?.label || tgtField?.type || "Target Field"}</strong>.
                                    </s-text>
                                  </s-stack>
                                  <s-stack direction="inline" gap="small" alignItems="center">
                                    <s-button
                                      variant="tertiary"
                                      onClick={() => {
                                        setEditingRuleId(rule.id || idx.toString());
                                        setRuleField(rule.fieldId);
                                        setRuleCondition(rule.condition);
                                        setRuleValue(rule.value || "");
                                        setRuleAction(rule.action);
                                        setRuleTarget(rule.targetFieldId);
                                      }}
                                    >
                                      Edit
                                    </s-button>
                                    <s-button
                                      variant="tertiary"
                                      tone="critical"
                                      onClick={() => {
                                        const newRules = rules.filter((_, i) => i !== idx);
                                        setRules(newRules);
                                        handleFieldInput();
                                      }}
                                    >
                                      Delete
                                    </s-button>
                                  </s-stack>
                                </div>
                              );
                            })}
                            <s-button
                              variant="secondary"
                              onClick={() => {
                                setEditingRuleId("new");
                                setRuleField(fields[0]?.id || "");
                                setRuleCondition("empty");
                                setRuleValue("");
                                setRuleAction("show");
                                setRuleTarget(fields[0]?.id || "");
                              }}
                              style={{ alignSelf: "flex-start", marginTop: "8px" }}
                            >
                              Add another rule
                            </s-button>
                          </s-stack>
                        )}
                      </s-stack>
                    ) : (
                      <s-stack gap="base" style={{ border: "1px solid #e1e3e5", borderRadius: "8px", padding: "16px", background: "#ffffff", marginTop: "8px" }}>
                        <s-heading level="4" style={{ fontSize: "14px", fontWeight: "600" }}>
                          {editingRuleId === "new" ? "Create Rule" : "Edit Rule"}
                        </s-heading>

                        <s-stack gap="small" style={{ marginTop: "8px" }}>
                          <s-select
                            label="If customer fills field"
                            value={ruleField}
                            onChange={(e) => setRuleField(e.currentTarget.value)}
                          >
                            {fields.map(f => (
                              <s-option key={f.id} value={f.id}>{f.label || f.type}</s-option>
                            ))}
                          </s-select>

                          <s-select
                            label="Condition"
                            value={ruleCondition}
                            onChange={(e) => setRuleCondition(e.currentTarget.value)}
                          >
                            <s-option value="empty">is empty</s-option>
                            <s-option value="not_empty">is not empty</s-option>
                            <s-option value="equals">equals</s-option>
                            <s-option value="contains">contains</s-option>
                          </s-select>

                          {["equals", "contains"].includes(ruleCondition) && (
                            <s-text-field
                              label="Value"
                              value={ruleValue}
                              onChange={(e) => setRuleValue(e.currentTarget.value)}
                              placeholder="e.g. business"
                            />
                          )}

                          <s-select
                            label="Then action"
                            value={ruleAction}
                            onChange={(e) => setRuleAction(e.currentTarget.value)}
                          >
                            <s-option value="show">Show field</s-option>
                            <s-option value="hide">Hide field</s-option>
                            <s-option value="require">Make field required</s-option>
                            <s-option value="optional">Make field optional</s-option>
                          </s-select>

                          <s-select
                            label="Target field"
                            value={ruleTarget}
                            onChange={(e) => setRuleTarget(e.currentTarget.value)}
                          >
                            {fields.map(f => (
                              <s-option key={f.id} value={f.id}>{f.label || f.type}</s-option>
                            ))}
                          </s-select>

                          <s-stack direction="inline" gap="small" style={{ marginTop: "16px" }}>
                            <s-button
                              variant="primary"
                              onClick={() => {
                                if (editingRuleId === "new") {
                                  const newRule = {
                                    id: "rule_" + Date.now(),
                                    fieldId: ruleField,
                                    condition: ruleCondition,
                                    value: ruleValue,
                                    action: ruleAction,
                                    targetFieldId: ruleTarget,
                                  };
                                  setRules([...rules, newRule]);
                                } else {
                                  const newRules = rules.map((r, i) => {
                                    if (r.id === editingRuleId || i.toString() === editingRuleId) {
                                      return {
                                        ...r,
                                        fieldId: ruleField,
                                        condition: ruleCondition,
                                        value: ruleValue,
                                        action: ruleAction,
                                        targetFieldId: ruleTarget,
                                      };
                                    }
                                    return r;
                                  });
                                  setRules(newRules);
                                }
                                setEditingRuleId(null);
                                handleFieldInput();
                              }}
                            >
                              Save Rule
                            </s-button>
                            <s-button
                              variant="tertiary"
                              onClick={() => setEditingRuleId(null)}
                            >
                              Cancel
                            </s-button>
                          </s-stack>
                        </s-stack>
                      </s-stack>
                    )}
                  </s-stack>
                )}

                {activeTab === "settings" && (
                  <s-section>
                    <s-stack gap="base">
                      <s-heading level="3">General Settings</s-heading>

                      <s-stack gap="small">
                        <s-text style={{ fontSize: "12px", color: "#6d7175" }}>
                          Success Message Heading
                        </s-text>
                        <s-text-field
                          value={successTitle}
                          onChange={(e) => setSuccessTitle(e.currentTarget.value)}
                        ></s-text-field>
                      </s-stack>

                      {formCategory === "b2b" && (
                        <s-stack gap="small" style={{ marginTop: "8px" }}>
                          <s-text style={{ fontSize: "12px", color: "#6d7175" }}>
                            Auto-tag customer (comma separated)
                          </s-text>
                          <s-text-field
                            value={customerTag}
                            onChange={(e) => setCustomerTag(e.currentTarget.value)}
                            placeholder="e.g. Wholesale, B2B, Partner"
                            details="Enter tags separated by commas to automatically assign to the customer on submission"
                          ></s-text-field>
                        </s-stack>
                      )}

                      <s-checkbox
                        label="Require customer login before submission"
                        id="require-account-field"
                      ></s-checkbox>
                    </s-stack>
                  </s-section>
                )}
              </s-stack>
            </s-section>{" "}
          </s-scroll-box>
        </s-grid-item>

        {/* Center / Right Area: Preview Canvas Workspace */}
        <s-grid-item gridColumn="span 8" >
          {/* Conditional Mobile Frame container */}
          <s-scroll-box blockSize="620px" padding="none base">
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
                  padding: "15px",
                  boxSizing: "border-box",
                }}
              >
                {formSubmitted || (activeTab === "after-submit" && afterSubmitAction === "successful") ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: "300px",
                      textAlign: "center",
                      padding: "40px 20px",
                    }}
                  >
                    {/* Success checkmark icon */}
                    <div
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "50%",
                        background: "rgba(0, 128, 96, 0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "20px",
                        color: "#008060",
                      }}
                    >
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <h2
                      style={{
                        fontSize: "20px",
                        fontWeight: "600",
                        color: "#202223",
                        marginBottom: "12px",
                      }}
                    >
                      {successTitle}
                    </h2>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#6d7175",
                        lineHeight: "1.6",
                        maxWidth: "450px",
                      }}
                      dangerouslySetInnerHTML={{ __html: successMessage }}
                    />
                    {afterSubmitDiscount && (
                      <div
                        style={{
                          marginTop: "24px",
                          padding: "12px 20px",
                          border: "1px dashed #008060",
                          borderRadius: "8px",
                          background: "rgba(0, 128, 96, 0.02)",
                          display: "inline-flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "11px",
                            color: "#6d7175",
                            textTransform: "uppercase",
                            fontWeight: "600",
                          }}
                        >
                          Your discount code
                        </span>
                        <span
                          style={{
                            fontSize: "18px",
                            fontWeight: "700",
                            color: "#008060",
                            letterSpacing: "1px",
                          }}
                        >
                          {afterSubmitDiscount}
                        </span>
                      </div>
                    )}

                    {/* <button
                      onClick={() => {
                        setFormSubmitted(false);
                        setActivePreviewPage(1);
                      }}
                      style={{
                        marginTop: "32px",
                        backgroundColor: "transparent",
                        border: "1px solid #bbc3c9",
                        borderRadius: borderRadius,
                        padding: "8px 16px",
                        cursor: "pointer",
                        fontSize: "13px",
                        color: "#202223",
                        fontWeight: "500",
                      }}
                    >
                      Reset Form Preview
                    </button> */}
                  </div>
                ) : (
                  <>
                    {/* Form Header */}
                    <div
                      onClick={() => {
                        setActiveTab("elements");
                        setSelectedFieldId("form-header");
                      }}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        marginBottom: "0px",
                        textAlign: "center",
                        cursor: "pointer",
                        padding: "8px",
                        borderRadius: "8px",
                        transition: "all 0.2s ease",
                        border: selectedFieldId === "form-header" ? "2px solid #008060" : "2px dashed transparent",
                        background: selectedFieldId === "form-header" ? "rgba(0, 128, 96, 0.03)" : "transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (selectedFieldId !== "form-header") {
                          e.currentTarget.style.border = "2px dashed #008060";
                          e.currentTarget.style.background = "rgba(0, 128, 96, 0.02)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedFieldId !== "form-header") {
                          e.currentTarget.style.border = "2px dashed transparent";
                          e.currentTarget.style.background = "transparent";
                        }
                      }}
                      title="Click to edit form title & description"
                    >
                      <h1 className="preview-title">{formHeaderTitle}</h1>
                      <p className="preview-description">{formDescription}</p>
                    </div>

                    {/* Stepper Progress Bar for Multi-page Forms */}
                    {pages.length > 1 && (
                      <div
                        className="stepper-progress-container"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "16px 0 28px 0",
                          position: "relative",
                          width: "100%",
                        }}
                      >
                        {/* Progress Line */}
                        <div
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "10%",
                            right: "10%",
                            height: "2px",
                            background: "#e1e3e5",
                            zIndex: 1,
                            transform: "translateY(-50%)",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              background: primaryColor,
                              width: `${((activePreviewPage - 1) / (pages.length - 1)) * 100}%`,
                              transition: "width 0.3s ease",
                            }}
                          />
                        </div>

                        {/* Dots */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "80%",
                            zIndex: 2,
                            position: "relative",
                          }}
                        >
                          {pages.map((page, idx) => {
                            const isActive = activePreviewPage === page.id;
                            const isCompleted = activePreviewPage > page.id;
                            return (
                              <div
                                key={page.id}
                                onClick={() => setActivePreviewPage(page.id)}
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  cursor: "pointer",
                                }}
                              >
                                <div
                                  style={{
                                    width: "24px",
                                    height: "24px",
                                    borderRadius: "50%",
                                    background:
                                      isCompleted || isActive
                                        ? primaryColor
                                        : "#ffffff",
                                    border: `2px solid ${isCompleted || isActive ? primaryColor : "#bbc3c9"}`,
                                    color:
                                      isCompleted || isActive
                                        ? "#ffffff"
                                        : "#6d7175",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "11px",
                                    fontWeight: "bold",
                                    transition: "all 0.3s ease",
                                    boxShadow: isActive
                                      ? `0 0 0 4px ${primaryColor}33`
                                      : "none",
                                  }}
                                >
                                  {isCompleted ? "✓" : page.id}
                                </div>
                                <span
                                  style={{
                                    fontSize: "11px",
                                    marginTop: "4px",
                                    color: isActive ? primaryColor : "#6d7175",
                                    fontWeight: isActive ? "600" : "450",
                                  }}
                                >
                                  {page.title}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Form Fields Grid */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          previewMode === "mobile" ? "1fr" : "repeat(6, 1fr)",
                        gap: "16px",
                      }}
                    >
                      {fields
                        .filter((f) => (f.page || 1) === activePreviewPage)
                        .map((field) => {
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
                          ].includes(field.type);
                          let gridSpan = "span 6";
                          if (previewMode !== "mobile") {
                            if (field.columnWidth === "33%") {
                              gridSpan = "span 2";
                            } else if (field.columnWidth === "50%") {
                              gridSpan = "span 3";
                            } else if (field.columnWidth === "100%") {
                              gridSpan = "span 6";
                            } else {
                              gridSpan = isNaturallyFull ? "span 6" : "span 3";
                            }
                          }

                          const showLabel =
                            !field.hideLabel &&
                            field.type !== "heading" &&
                            field.type !== "paragraph" &&
                            field.type !== "divider" &&
                            field.type !== "button" &&
                            field.type !== "hidden";
                          const showAsterisk =
                            field.required &&
                            (showLabel || field.showRequiredNoteIfHideLabel);

                          return (
                            <div
                              key={field.id}
                              style={{
                                gridColumn: gridSpan,
                                opacity: draggedFieldId === field.id ? 0.4 : 1,
                                transition: "opacity 0.2s ease, transform 0.2s ease",
                              }}
                              draggable={true}
                              onDragStart={(e) => handleDragStart(e, field.id)}
                              onDragOver={(e) => handleDragOver(e, field.id)}
                              onDragEnd={handleDragEnd}
                            >
                              <div
                                className="draggable-field-wrapper"
                                style={{
                                  padding: "8px",
                                  border:
                                    selectedFieldId === field.id
                                      ? "1px solid #008060"
                                      : "1px dashed #e1e3e5",
                                  backgroundColor: selectedFieldId === field.id ? "rgba(0, 128, 96, 0.02)" : "#ffffff",
                                  borderRadius: "8px",
                                  cursor: "grab",
                                  position: "relative",
                                }}
                                onClick={() => setSelectedFieldId(field.id)}
                              >
                                {/* Grab Drag indicator on hover */}
                                <div className="drag-indicator">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#bbc3c9" strokeWidth="3" strokeLinecap="round">
                                    <circle cx="8" cy="5" r="1" />
                                    <circle cx="16" cy="5" r="1" />
                                    <circle cx="8" cy="12" r="1" />
                                    <circle cx="16" cy="12" r="1" />
                                    <circle cx="8" cy="19" r="1" />
                                    <circle cx="16" cy="19" r="1" />
                                  </svg>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "6px",
                                  }}
                                >
                                  {showLabel && (
                                    <label
                                      style={{
                                        fontSize: labelFontSize,
                                        fontWeight: "500",
                                        color: labelColor,
                                        display: "block",
                                      }}
                                    >
                                      {field.label}{" "}
                                      {showAsterisk && (
                                        <span
                                          style={{
                                            color: "#d82c0d",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          *
                                        </span>
                                      )}
                                    </label>
                                  )}

                                  {field.hideLabel &&
                                    field.showRequiredNoteIfHideLabel &&
                                    field.required && (
                                      <div
                                        style={{
                                          fontSize: "11px",
                                          color: "#d82c0d",
                                          fontWeight: "500",
                                        }}
                                      >
                                        * Required
                                      </div>
                                    )}

                                  {field.type === "heading" ? (
                                    <h3
                                      style={{
                                        fontSize: "18px",
                                        fontWeight: "600",
                                        margin: "8px 0 2px 0",
                                        color: "#202223",
                                      }}
                                    >
                                      {field.label}
                                    </h3>
                                  ) : field.type === "paragraph" ? (
                                    <p
                                      style={{
                                        fontSize: "13px",
                                        color: "#6d7175",
                                        margin: "2px 0 6px 0",
                                        lineHeight: "1.4",
                                      }}
                                    >
                                      {field.placeholder ||
                                        "Paragraph text goes here..."}
                                    </p>
                                  ) : field.type === "divider" ? (
                                    <hr
                                      style={{
                                        border: "none",
                                        borderTop: "1px dashed #dcdfe3",
                                        margin: "12px 0 4px 0",
                                      }}
                                    />
                                  ) : field.type === "hidden" ? (
                                    <div
                                      style={{
                                        padding: "8px 12px",
                                        background: "#f6f6f7",
                                        border: "1px dashed #bbc3c9",
                                        borderRadius: "6px",
                                        fontSize: "12px",
                                        color: "#6d7175",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px",
                                      }}
                                    >
                                      <span>👁</span> Hidden field — not visible
                                      to users
                                    </div>
                                  ) : field.type === "rating" ? (
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "8px",
                                        padding: "8px 0",
                                      }}
                                    >
                                      <div
                                        style={{
                                          display: "flex",
                                          gap: "14px",
                                          alignItems: "center",
                                        }}
                                      >
                                        {[1, 2, 3, 4, 5].map((num) => {
                                          const currentRating = previewRatings[field.id] || 0;
                                          const isFilled = num <= currentRating;
                                          const iconType = field.ratingIcon || "star";
                                          return (
                                            <div
                                              key={num}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setPreviewRatings((prev) => ({
                                                  ...prev,
                                                  [field.id]: currentRating === num ? 0 : num,
                                                }));
                                              }}
                                              style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                gap: "6px",
                                              }}
                                            >
                                              {iconType === "heart" ? (
                                                <HeartIcon filled={isFilled} size={36} color={primaryColor} strokeColor={labelColor || "#2e4a3f"} />
                                              ) : iconType === "smile" ? (
                                                <SmileIcon filled={isFilled} size={36} color={primaryColor} strokeColor={labelColor || "#2e4a3f"} />
                                              ) : iconType === "thumb" ? (
                                                <ThumbIcon filled={isFilled} size={36} color={primaryColor} strokeColor={labelColor || "#2e4a3f"} />
                                              ) : (
                                                <StarIcon filled={isFilled} size={38} color={primaryColor} strokeColor={labelColor || "#2e4a3f"} />
                                              )}
                                              {field.showNumberUnderIcon && (
                                                <span
                                                  style={{
                                                    fontSize: "12px",
                                                    color: "#6d7175",
                                                    fontWeight: "550",
                                                    marginTop: "2px",
                                                  }}
                                                >
                                                  {num}
                                                </span>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  ) : field.type === "feedback" ? (
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "8px",
                                        padding: "8px 0",
                                      }}
                                    >
                                      <div
                                        style={{
                                          display: "flex",
                                          gap: "18px",
                                          alignItems: "center",
                                        }}
                                      >
                                        {[
                                          { emoji: "😠", label: "Very Bad" },
                                          { emoji: "🙁", label: "Bad" },
                                          { emoji: "😐", label: "Neutral" },
                                          { emoji: "🙂", label: "Good" },
                                          { emoji: "😄", label: "Excellent" },
                                        ].map((item, idx) => {
                                          const val = idx + 1;
                                          const currentRating = previewRatings[field.id] || 0;
                                          const isActive = val === currentRating;
                                          return (
                                            <div
                                              key={val}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setPreviewRatings((prev) => ({
                                                  ...prev,
                                                  [field.id]: currentRating === val ? 0 : val,
                                                }));
                                              }}
                                              style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                gap: "6px",
                                                cursor: "pointer",
                                                transform: isActive ? "scale(1.2)" : "scale(1)",
                                                filter: isActive ? "grayscale(0%)" : "grayscale(100%)",
                                                opacity: isActive ? 1 : 0.4,
                                                transition: "all 0.2s ease",
                                              }}
                                            >
                                              <span style={{ fontSize: "32px", lineHeight: "1" }}>{item.emoji}</span>
                                              {field.showNumberUnderIcon && (
                                                <span
                                                  style={{
                                                    fontSize: "11px",
                                                    color: "#6d7175",
                                                    fontWeight: "550",
                                                    marginTop: "2px",
                                                  }}
                                                >
                                                  {val}
                                                </span>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  ) : field.type === "button" ? (
                                    <button
                                      style={{
                                        backgroundColor: primaryColor,
                                        color: btnTextColor,
                                        border: "none",
                                        padding: "10px 16px",
                                        borderRadius: borderRadius,
                                        width: "100%",
                                        fontWeight: "500",
                                        fontSize: "14px",
                                        cursor: "pointer",
                                      }}
                                    >
                                      {field.label}
                                    </button>
                                  ) : field.type === "switch" ? (
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        padding: "6px 0",
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: "40px",
                                          height: "22px",
                                          background: "#bbc3c9",
                                          borderRadius: "11px",
                                          position: "relative",
                                          cursor: "pointer",
                                        }}
                                      >
                                        <div
                                          style={{
                                            width: "18px",
                                            height: "18px",
                                            background: "#fff",
                                            borderRadius: "50%",
                                            position: "absolute",
                                            top: "2px",
                                            left: "2px",
                                            boxShadow:
                                              "0 1px 3px rgba(0,0,0,0.2)",
                                          }}
                                        />
                                      </div>
                                      <span
                                        style={{
                                          fontSize: "13px",
                                          color: "#6d7175",
                                        }}
                                      >
                                        Off
                                      </span>
                                    </div>
                                  ) : field.type === "range" ? (
                                    <div style={{ padding: "8px 0" }}>
                                      <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        defaultValue="50"
                                        style={{
                                          width: "100%",
                                          accentColor: primaryColor,
                                        }}
                                      />
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                          fontSize: "11px",
                                          color: "#6d7175",
                                        }}
                                      >
                                        <span>0</span>
                                        <span>100</span>
                                      </div>
                                    </div>
                                  ) : field.type === "color" ||
                                    field.type === "color-swatch" ? (
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        padding: "4px 0",
                                      }}
                                    >
                                      <input
                                        type="color"
                                        defaultValue={primaryColor}
                                        style={{
                                          width: "38px",
                                          height: "38px",
                                          border: "1px solid #dcdfe3",
                                          borderRadius: "6px",
                                          padding: "2px",
                                          cursor: "pointer",
                                        }}
                                      />
                                      <span
                                        style={{
                                          fontSize: "13px",
                                          color: "#6d7175",
                                        }}
                                      >
                                        {field.type === "color-swatch"
                                          ? "Pick a color swatch"
                                          : "Pick a color"}
                                      </span>
                                    </div>
                                  ) : field.type === "signature" ? (
                                    <div
                                      style={{
                                        height: "80px",
                                        border: "1px dashed #bbc3c9",
                                        borderRadius: "6px",
                                        background: "#fafafa",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "12px",
                                        color: "#6d7175",
                                      }}
                                    >
                                      ✍ Sign here
                                    </div>
                                  ) : field.type === "product" ? (
                                    <div
                                      style={{
                                        border: "1px solid #dcdfe3",
                                        borderRadius: "6px",
                                        padding: "10px 12px",
                                        background: "#f6f6f7",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: "36px",
                                          height: "36px",
                                          background: "#e1e3e5",
                                          borderRadius: "4px",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        📦
                                      </div>
                                      <span
                                        style={{
                                          fontSize: "13px",
                                          color: "#6d7175",
                                        }}
                                      >
                                        Select a product...
                                      </span>
                                    </div>
                                  ) : field.type === "quantity" ? (
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                      }}
                                    >
                                      <button
                                        style={{
                                          width: "32px",
                                          height: "32px",
                                          border: "1px solid #dcdfe3",
                                          borderRadius: "6px",
                                          background: "#fff",
                                          fontSize: "16px",
                                          cursor: "pointer",
                                        }}
                                      >
                                        −
                                      </button>
                                      <input
                                        type="number"
                                        defaultValue="1"
                                        min="1"
                                        style={{
                                          width: "60px",
                                          height: "32px",
                                          textAlign: "center",
                                          border: "1px solid #dcdfe3",
                                          borderRadius: "6px",
                                          fontSize: "14px",
                                        }}
                                      />
                                      <button
                                        style={{
                                          width: "32px",
                                          height: "32px",
                                          border: "1px solid #dcdfe3",
                                          borderRadius: "6px",
                                          background: "#fff",
                                          fontSize: "16px",
                                          cursor: "pointer",
                                        }}
                                      >
                                        +
                                      </button>
                                    </div>
                                  ) : field.type === "repeater" ? (
                                    <div
                                      style={{
                                        border: "1px dashed #bbc3c9",
                                        borderRadius: "6px",
                                        padding: "12px",
                                        background: "#fafafa",
                                      }}
                                    >
                                      <div
                                        style={{
                                          fontSize: "12px",
                                          color: "#6d7175",
                                          marginBottom: "8px",
                                        }}
                                      >
                                        ↻ Repeater group
                                      </div>
                                      <div
                                        style={{
                                          height: "30px",
                                          background: "#e1e3e5",
                                          borderRadius: "4px",
                                        }}
                                      />
                                      <button
                                        style={{
                                          marginTop: "8px",
                                          fontSize: "12px",
                                          color: primaryColor,
                                          background: "none",
                                          border: `1px solid ${primaryColor}`,
                                          borderRadius: "4px",
                                          padding: "4px 8px",
                                          cursor: "pointer",
                                        }}
                                      >
                                        + Add item
                                      </button>
                                    </div>
                                  ) : field.type === "matrix" ? (
                                    <div style={{ overflowX: "auto" }}>
                                      <table
                                        style={{
                                          width: "100%",
                                          borderCollapse: "collapse",
                                          fontSize: "12px",
                                        }}
                                      >
                                        <thead>
                                          <tr>
                                            <td style={{ padding: "4px" }}></td>
                                            {["Col 1", "Col 2"].map((c, i) => (
                                              <th
                                                key={i}
                                                style={{
                                                  padding: "4px 8px",
                                                  color: "#6d7175",
                                                  fontWeight: "500",
                                                }}
                                              >
                                                {c}
                                              </th>
                                            ))}
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {(
                                            field.options || ["Row 1", "Row 2"]
                                          ).map((row, i) => (
                                            <tr key={i}>
                                              <td
                                                style={{
                                                  padding: "4px 8px",
                                                  color: "#202223",
                                                }}
                                              >
                                                {row}
                                              </td>
                                              {["Col 1", "Col 2"].map(
                                                (_, j) => (
                                                  <td
                                                    key={j}
                                                    style={{
                                                      padding: "4px 8px",
                                                      textAlign: "center",
                                                    }}
                                                  >
                                                    <input
                                                      type="radio"
                                                      name={`matrix_${field.id}_${i}`}
                                                    />
                                                  </td>
                                                ),
                                              )}
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  ) : field.type === "html" ? (
                                    <div
                                      style={{
                                        border: "1px solid #dcdfe3",
                                        borderRadius: "6px",
                                        padding: "10px 12px",
                                        background: "#f6f6f7",
                                        fontSize: "12px",
                                        fontFamily: "monospace",
                                        color: "#202223",
                                      }}
                                    >
                                      {field.placeholder ||
                                        "<p>Custom HTML</p>"}
                                    </div>
                                  ) : field.type === "image-options" ? (
                                    <div
                                      style={{
                                        display: "flex",
                                        gap: "8px",
                                        flexWrap: "wrap",
                                      }}
                                    >
                                      {(
                                        field.options || [
                                          "Option 1",
                                          "Option 2",
                                        ]
                                      ).map((opt, i) => (
                                        <div
                                          key={i}
                                          style={{
                                            border: "1px solid #dcdfe3",
                                            borderRadius: "6px",
                                            padding: "8px 12px",
                                            background: "#f6f6f7",
                                            fontSize: "12px",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px",
                                          }}
                                        >
                                          <div
                                            style={{
                                              width: "28px",
                                              height: "28px",
                                              background: "#e1e3e5",
                                              borderRadius: "4px",
                                            }}
                                          />
                                          {opt}
                                        </div>
                                      ))}
                                    </div>
                                  ) : field.type === "checkboxes" || field.type === "radio" ? (
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "8px",
                                        padding: "4px 0",
                                      }}
                                    >
                                      {(
                                        field.options || [
                                          "Option 1",
                                          "Option 2",
                                        ]
                                      ).map((opt, i) => (
                                        <label
                                          key={i}
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            fontSize: labelFontSize,
                                            color: labelColor,
                                            cursor: "pointer",
                                          }}
                                        >
                                          <input
                                            type={
                                              field.type === "checkboxes"
                                                ? "checkbox"
                                                : "radio"
                                            }
                                            name={field.id}
                                            disabled={true}
                                            style={{
                                              accentColor: primaryColor,
                                            }}
                                          />
                                          {opt}
                                        </label>
                                      ))}
                                    </div>
                                  ) : field.type === "consent" ? (
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        padding: "4px 0",
                                      }}
                                    >
                                      <label
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "8px",
                                          fontSize: labelFontSize,
                                          color: labelColor,
                                          cursor: "pointer",
                                        }}
                                      >
                                        <input
                                          type="checkbox"
                                          name={field.id}
                                          disabled={true}
                                          style={{
                                            accentColor: primaryColor,
                                          }}
                                        />
                                        <span>{field.placeholder || "I agree to the terms and conditions"}</span>
                                      </label>
                                    </div>
                                  ) : field.type === "textarea" ? (
                                    <textarea
                                      className="field-preview-input"
                                      placeholder={field.placeholder}
                                      readOnly={true}
                                      defaultValue={field.defaultValue || ""}
                                      minLength={
                                        field.limitCharacters && field.minCharacters ? field.minCharacters : undefined
                                      }
                                      maxLength={
                                        field.limitCharacters && field.maxCharacters ? field.maxCharacters : undefined
                                      }
                                      rows={3}
                                    />
                                  ) : field.type === "select" ||
                                    field.type === "dropdown" ? (
                                    <select
                                      className="field-preview-select"
                                      disabled={true}
                                      style={{
                                        width: "100%",
                                        height: "38px",
                                        border: "1px solid #dcdfe3",
                                        background: "#f6f6f7",
                                        borderRadius: "8px",
                                        padding: "0 12px",
                                        cursor: "grab",
                                      }}
                                    >
                                      <option>
                                        {field.placeholder ||
                                          "Select option..."}
                                      </option>
                                      {field.options?.map((opt, i) => (
                                        <option key={i}>{opt}</option>
                                      ))}
                                    </select>
                                  ) : field.type === "file" ? (
                                    <div className="file-upload-preview-box">
                                      <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                      >
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                                      </svg>
                                      <span>Click or drag file to upload</span>
                                    </div>
                                  ) : (
                                    <div className="input-with-flag-container">
                                      {(field.type === "tel" ||
                                        field.type === "phone") && (
                                          <div className="tel-flag-container">
                                            <select
                                              className="tel-flag-select"
                                              value={field.defaultCountry || "IN"}
                                              onChange={(e) => {
                                                const newCountryCode = e.target.value;
                                                // Update field in form builder state
                                                setFields(
                                                  fields.map((f) => {
                                                    if (f.id === field.id) {
                                                      return { ...f, defaultCountry: newCountryCode };
                                                    }
                                                    return f;
                                                  })
                                                );
                                                handleFieldInput();
                                              }}
                                            >
                                              {countriesList.map((c) => (
                                                <option key={c.code} value={c.code}>
                                                  {c.name} ({c.dial})
                                                </option>
                                              ))}
                                            </select>
                                            <div className="tel-flag-display">
                                              {(() => {
                                                const currentCountry = countriesList.find(
                                                  (c) => c.code === (field.defaultCountry || "IN")
                                                ) || countriesList[0];
                                                return (
                                                  <>
                                                    <span style={{ fontWeight: "600", fontSize: "13px", color: "#202223" }}>{currentCountry.code}</span>
                                                    <span className="tel-code">{currentCountry.dial}</span>
                                                  </>
                                                );
                                              })()}
                                              <span className="tel-dropdown-arrow">▼</span>
                                            </div>
                                          </div>
                                        )}
                                      <input
                                        type={
                                          field.type === "phone"
                                            ? "tel"
                                            : field.type === "name"
                                              ? "text"
                                              : field.type
                                        }
                                        className="field-preview-input"
                                        placeholder={(() => {
                                          if (field.type === "tel" || field.type === "phone") {
                                            const basePlaceholder = field.placeholder || "12345 67890";
                                            return basePlaceholder.replace(/^\+\d+\s*/, "");
                                          }
                                          return field.placeholder;
                                        })()}
                                        readOnly={true}
                                        defaultValue={field.defaultValue || ""}
                                        minLength={
                                          field.limitCharacters && field.minCharacters ? field.minCharacters : undefined
                                        }
                                        maxLength={
                                          field.limitCharacters && field.maxCharacters ? field.maxCharacters : undefined
                                        }
                                      />
                                    </div>
                                  )}

                                  {field.description && (
                                    <div
                                      style={{
                                        fontSize: "11px",
                                        color: "#6d7175",
                                        marginTop: "2px",
                                      }}
                                    >
                                      {field.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>

                    {/* Wrapper for preview footer */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFieldId("form-footer");
                      }}
                      style={{
                        marginTop: "24px",
                        padding: "12px",
                        borderRadius: "8px",
                        border:
                          selectedFieldId === "form-footer"
                            ? "1px solid #008060"
                            : "1px dashed transparent",
                        backgroundColor:
                          selectedFieldId === "form-footer"
                            ? "rgba(0, 128, 96, 0.02)"
                            : "transparent",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (selectedFieldId !== "form-footer") {
                          e.currentTarget.style.borderColor = "#e1e3e5";
                          e.currentTarget.style.backgroundColor = "#fafafa";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedFieldId !== "form-footer") {
                          e.currentTarget.style.borderColor = "transparent";
                          e.currentTarget.style.backgroundColor = "transparent";
                        }
                      }}
                    >
                      {/* Footer text below fields in the preview canvas */}
                      {footerText && (
                        <div
                          style={{
                            fontSize: "13px",
                            color: "#6d7175",
                            lineHeight: "1.5",
                            textAlign: "left",
                            paddingBottom: "12px",
                            borderBottom: "1px solid #f1f1f1",
                            marginBottom: "12px",
                          }}
                        >
                          {footerText}
                        </div>
                      )}

                      {/* Navigation Buttons for Multi-page / Single-page Form */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: footerFullWidth ? "column" : "row",
                          justifyContent: footerFullWidth ? "stretch" : (activePreviewPage > 1 ? "space-between" : "center"),
                          gap: "12px",
                          alignItems: footerFullWidth ? "stretch" : "center",
                        }}
                      >
                        {activePreviewPage > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActivePreviewPage(activePreviewPage - 1);
                              setSelectedFieldId("form-footer");
                            }}
                            style={{
                              backgroundColor: "transparent",
                              border: `1px solid #dcdfe3`,
                              borderRadius: borderRadius,
                              color: "#202223",
                              padding: "10px 20px",
                              cursor: "pointer",
                              fontWeight: "500",
                              transition: "background 0.2s",
                              width: footerFullWidth ? "100%" : "auto",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background = "#f6f6f7")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = "transparent")
                            }
                          >
                            {footerPreviousText || "Back"}
                          </button>
                        )}

                        <div
                          style={{
                            display: "flex",
                            flexDirection: footerFullWidth ? "column" : "row",
                            gap: "8px",
                            width: footerFullWidth ? "100%" : "auto",
                            justifyContent: footerFullWidth ? "stretch" : (activePreviewPage > 1 ? "flex-end" : "center"),
                          }}
                        >
                          {footerShowReset && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                triggerToast("Form input reset");
                                setSelectedFieldId("form-footer");
                              }}
                              style={{
                                backgroundColor: "#f6f6f7",
                                border: `1px solid #dcdfe3`,
                                borderRadius: borderRadius,
                                color: "#374151",
                                padding: "10px 20px",
                                cursor: "pointer",
                                fontWeight: "500",
                                transition: "background 0.2s",
                                width: footerFullWidth ? "100%" : "auto",
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.background = "#eef0f1")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.background = "#f6f6f7")
                              }
                            >
                              Reset
                            </button>
                          )}

                          {activePreviewPage < pages.length ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActivePreviewPage(activePreviewPage + 1);
                                setSelectedFieldId("form-footer");
                              }}
                              style={{
                                backgroundColor: primaryColor,
                                borderRadius: borderRadius,
                                color: btnTextColor,
                                border: "none",
                                padding: "10px 20px",
                                cursor: "pointer",
                                fontWeight: "500",
                                width: footerFullWidth ? "100%" : "auto",
                              }}
                            >
                              {footerNextText || "Next"}
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setFormSubmitted(true);
                                triggerToast(
                                  "Mock form submitted in preview mode!",
                                );
                                setSelectedFieldId("form-footer");
                              }}
                              style={{
                                backgroundColor: primaryColor,
                                borderRadius: borderRadius,
                                color: btnTextColor,
                                border: "none",
                                padding: "10px 20px",
                                cursor: "pointer",
                                fontWeight: "500",
                                width: footerFullWidth ? "100%" : "auto",
                              }}
                            >
                              {footerSubmitText || "Submit"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {previewMode === "mobile" && (
                <div className="mobile-frame-footer">
                  <div className="home-indicator"></div>
                </div>
              )}
            </div>
          </s-scroll-box>
        </s-grid-item>
      </s-grid>

      {showAddMenu && (
        <div
          className="add-field-overlay"
          onClick={() => setShowAddMenu(false)}
        >
          <div className="add-field-modal" onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 24px",
                borderBottom: "1px solid #e1e3e5",
                background: "#ffffff",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#202223",
                }}
              >
                Add element
              </h2>
              <button
                onClick={() => setShowAddMenu(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "#6d7175",
                }}
              >
                ×
              </button>
            </div>
            <div className="modal-grid">
              {elementCategories
                .filter((cat) => formCategory === "b2b" || !cat.isBusiness)
                .map((cat, idx) => (
                  <div
                    key={idx}
                    className={`modal-category${cat.isBusiness ? " modal-category--business" : ""}`}
                  >
                    <div
                      className={`modal-category-title${cat.isBusiness ? " modal-category-title--business" : ""}`}
                    >
                      {cat.isBusiness && (
                        <span style={{ marginRight: "6px" }}>🏢</span>
                      )}
                      {cat.title}
                      {cat.isBusiness && (
                        <span
                          style={{
                            marginLeft: "8px",
                            fontSize: "11px",
                            fontWeight: "500",
                            color: "#6d7175",
                          }}
                        >
                          — fields below can only be added once
                        </span>
                      )}
                    </div>
                    {/* Business fields render in their own 4-col sub-grid */}
                    <div className={cat.isBusiness ? "biz-items-grid" : ""}>
                      {cat.items.map((item) => {
                        const isInUse = isBusinessFieldInUse(item, fields);
                        return (
                          <button
                            key={item.id}
                            className={`modal-item-btn${isInUse ? " modal-item-btn--disabled" : ""}`}
                            disabled={isInUse}
                            title={
                              isInUse
                                ? `"${item.label}" is already added to the form`
                                : `Add ${item.label}`
                            }
                            onClick={() =>
                              !isInUse &&
                              addField(item.id, item.label, item.singletonType)
                            }
                          >
                            <span className="modal-item-icon">{item.icon}</span>
                            <span className="modal-item-label">{item.label}</span>
                            {isInUse && (
                              <span className="modal-item-in-use-badge">
                                In use
                              </span>
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
      {toastMessage && <div className="builder-toast">{toastMessage}</div>}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .tree-dotted-line {
          border-left: 1px dotted #bbc3c9;
          padding-left: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 4px;
        }

        .cursor-pointer{
        cursor: pointer;
        }

        .tree-page-title-row {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          padding: 6px 8px;
          border-radius: 6px;
          position: relative;
          transition: background 0.2s;
        }

        .tree-page-title-row:hover {
          background: #f1f2f4;
        }

        .tree-page-title-row .delete-page-btn {
          display: none;
          margin-left: auto;
          color: #d82c0d;
          background: none;
          border: none;
          cursor: pointer;
          padding: 2px;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: background 0.2s;
        }

        .tree-page-title-row .delete-page-btn:hover {
          background: rgba(216, 44, 13, 0.08);
        }

        .tree-page-title-row:hover .delete-page-btn {
          display: flex;
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
          font-size: ${titleFontSize};
          font-weight: 700;
          color: ${titleColor};
          margin: 0px;
          outline: none;
          border: 1px transparent dashed;
          padding: 0px;
          transition: border-color 0.2s;
        }
        .preview-title:hover {
          border-color: #008060;
        }
        .preview-description {
          font-size: ${descriptionFontSize};
          color: ${descriptionColor};
          outline: none;
          border: 1px transparent dashed;
          padding: 2px;
        }
        .preview-description:hover {
          border-color: #008060;
        }

        .draggable-field-wrapper {
          position: relative;
          transition: all 0.2s ease-in-out;
        }
        .draggable-field-wrapper:hover {
          background-color: #f9fafb !important;
          border-color: #bbc3c9 !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        .draggable-field-wrapper .drag-indicator {
          position: absolute;
          top: 8px;
          right: 8px;
          opacity: 0;
          transition: opacity 0.2s ease-in-out;
          cursor: grab;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          background: #ffffff;
          border-radius: 4px;
          border: 1px solid #e1e3e5;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          z-index: 10;
        }
        .draggable-field-wrapper:hover .drag-indicator {
          opacity: 1;
        }

        .field-preview-input {
          width: 100%;
          border: 1px solid ${inputBorderColor};
          background: ${inputBgColor};
          height: 38px;
          padding: 0 12px;
          border-radius: ${borderRadius};
          font-size: 13px;
          color: ${inputTextColor};
          box-sizing: border-box;
        }
        textarea.field-preview-input {
          height: auto;
          padding: 8px 12px;
        }
        .input-with-flag-container {
          display: flex;
          align-items: center;
          background: ${inputBgColor};
          border: 1px solid ${inputBorderColor};
          border-radius: ${borderRadius};
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
        .tel-flag-container {
          position: relative;
          display: flex;
          align-items: center;
          background: #f6f6f7;
          border-right: 1px solid ${inputBorderColor};
          height: 38px;
          cursor: pointer;
        }
        .tel-flag-select {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
          z-index: 2;
        }
        .tel-flag-display {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0 10px;
          font-size: 14px;
          color: #202223;
          pointer-events: none;
          z-index: 1;
          white-space: nowrap;
        }
        .tel-dropdown-arrow {
          font-size: 8px;
          color: #6d7175;
          margin-left: 2px;
          transition: transform 0.2s ease;
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

        /* Modern Email Template Selection Cards */
        .email-template-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px;
          background: #ffffff;
          border: 1px solid #e1e3e5;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
          margin-bottom: 8px;
        }

        .email-template-card:hover {
          border-color: #008060;
          background: #fbfdfc;
          transform: translateY(-1px);
          box-shadow: 0 3px 8px rgba(0, 128, 96, 0.06);
        }

        .email-template-card:active {
          transform: translateY(0);
          box-shadow: 0 1px 3px rgba(0, 128, 96, 0.02);
        }

        .email-template-card-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          background: #f4f6f8;
          border-radius: 6px;
          color: #6d7175;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .email-template-card:hover .email-template-card-icon {
          background: #e2f1e8;
          color: #008060;
        }

        .email-template-card-info {
          flex: 1;
          margin-left: 12px;
          text-align: left;
        }

        .email-template-card-title {
          font-size: 13px;
          font-weight: 600;
          color: #202223;
        }

        .email-template-card-desc {
          font-size: 11px;
          color: #6d7175;
          margin-top: 1px;
        }

        .email-template-card-chevron {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8c9196;
          transition: transform 0.2s ease, color 0.2s ease;
          flex-shrink: 0;
        }

        .email-template-card:hover .email-template-card-chevron {
          transform: translateX(2px);
          color: #008060;
        }

        .email-status-badge {
          font-size: 9px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          padding: 1px 5px;
          border-radius: 4px;
          display: inline-block;
          margin-left: 8px;
          line-height: 1.4;
        }

        .email-status-badge.enabled {
          background: #e2f1e8;
          color: #008060;
        }

        .email-status-badge.disabled {
          background: #f6f6f7;
          color: #6d7175;
        }

        /* In-place Navigation & Header styling */
        .email-edit-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 4px 0 14px 0;
          border-bottom: 1px solid #e1e3e5;
          margin-bottom: 14px;
        }

        .email-back-btn {
          background: #ffffff;
          border: 1px solid #bbc3c9;
          border-radius: 6px;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #202223;
          transition: all 0.15s ease;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          padding: 0;
        }

        .email-back-btn:hover {
          background: #f6f6f7;
          border-color: #8c9196;
        }

        .email-back-btn:active {
          background: #edeeef;
          transform: scale(0.96);
        }

        .email-header-text {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .email-header-breadcrumb {
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          color: #6d7175;
          letter-spacing: 0.04em;
          margin-bottom: 1px;
        }

        /* WYSIWYG Editor Styling Overrides */
        .rsw-editor {
          border: 1px solid #bbc3c9 !important;
          border-radius: 6px !important;
          background: #ffffff !important;
          box-shadow: 0 1px 2px rgba(0,0,0,0.04) !important;
          overflow: hidden !important;
          font-family: inherit !important;
          transition: border-color 0.15s ease, box-shadow 0.15s ease !important;
        }

        .rsw-editor:focus-within {
          border-color: #008060 !important;
          box-shadow: 0 0 0 1px #008060, 0 1px 2px rgba(0,0,0,0.04) !important;
        }

        .rsw-toolbar {
          background: #f6f6f7 !important;
          border-bottom: 1px solid #e1e3e5 !important;
          padding: 6px 8px !important;
          display: flex !important;
          flex-wrap: wrap !important;
          gap: 4px !important;
          align-items: center !important;
        }

        .rsw-btn {
          background: transparent !important;
          border: none !important;
          border-radius: 4px !important;
          color: #4a4a4a !important;
          cursor: pointer !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 13px !important;
          font-weight: 500 !important;
          height: 26px !important;
          min-width: 26px !important;
          padding: 2px 6px !important;
          transition: all 0.15s ease !important;
        }

        .rsw-btn:hover {
          background: #e1e3e5 !important;
          color: #202223 !important;
        }

        .rsw-btn[data-active="true"] {
          background: #008060 !important;
          color: #ffffff !important;
        }

        .rsw-dd {
          background: transparent !important;
          border: none !important;
          border-radius: 4px !important;
          color: #4a4a4a !important;
          cursor: pointer !important;
          font-size: 12px !important;
          height: 26px !important;
          padding: 2px 6px !important;
          transition: all 0.15s ease !important;
        }

        .rsw-dd:hover {
          background: #e1e3e5 !important;
        }

        .rsw-ce {
          padding: 12px 14px !important;
          min-height: 160px !important;
          font-size: 13.5px !important;
          color: #202223 !important;
          line-height: 1.5 !important;
          outline: none !important;
          background: #ffffff !important;
          box-sizing: border-box !important;
        }

        /* Variables Helper Styling */
        .variables-helper-container {
          background: #fafafb;
          border: 1px solid #e1e3e5;
          border-radius: 8px;
          padding: 12px;
          margin-top: 14px;
          text-align: left;
        }

        .variables-helper-title {
          font-size: 12px;
          font-weight: 600;
          color: #202223;
          margin-bottom: 4px;
        }

        .variables-helper-desc {
          font-size: 11px;
          color: #6d7175;
          margin-bottom: 8px;
        }

        .variables-chips-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .variable-chip {
          background: #ffffff;
          border: 1px solid #dcdfe3;
          border-radius: 6px;
          padding: 4px 8px;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
          font-family: inherit;
          outline: none;
        }

        .variable-chip:hover {
          border-color: #008060;
          background: #fbfdfc;
          box-shadow: 0 1px 3px rgba(0, 128, 96, 0.08);
        }

        .variable-chip:active {
          transform: scale(0.98);
        }

        .variable-chip-token {
          font-size: 10.5px;
          font-family: monospace;
          font-weight: 600;
          color: #008060;
          background: #e2f1e8;
          padding: 1px 4px;
          border-radius: 3px;
        }

        .variable-chip-label {
          font-size: 10.5px;
          color: #6d7175;
        }
      `,
        }}
      />
    </s-page>
  );
}
