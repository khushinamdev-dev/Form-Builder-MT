import { useLoaderData, useNavigate } from "react-router";
import { authenticate } from "../shopify.server";

export const loader = async ({ request, params }) => {
    const { admin } = await authenticate.admin(request);
    const { formId } = params;

    // Read formTitle from query param (passed via redirect from action)
    const url = new URL(request.url);
    const formTitle = url.searchParams.get("title") || "Untitled Form";

    let metaobject = null;
    let savedFields = [];

    try {
        const response = await admin.graphql(`
            query GetFormMetaobject($handle: MetaobjectHandleInput!) {
                metaobjectByHandle(handle: $handle) {
                    id
                    handle
                    type
                    fields {
                        key
                        value
                    }
                }
            }
        `, {
            variables: {
                handle: { type: "$app:profile", handle: formId }
            }
        });

        const json = await response.json();
        metaobject = json.data?.metaobjectByHandle || null;

        if (metaobject) {
            const bioField = metaobject.fields.find(f => f.key === "bio");
            if (bioField?.value) {
                try {
                    const parsed = JSON.parse(bioField.value);
                    savedFields = parsed.fields || [];
                } catch (_) {}
            }
        }
    } catch (err) {
        console.error("Error fetching metaobject:", err);
    }

    return { formId, formTitle, metaobject, savedFields };
};

export default function FormPublished() {
    const { formId, formTitle, metaobject, savedFields } = useLoaderData();
    const navigate = useNavigate();

    const publishedAt = new Date().toLocaleString("en-US", {
        dateStyle: "long",
        timeStyle: "short",
    });

    const getField = (key) => metaobject?.fields?.find(f => f.key === key)?.value || "—";

    const handleCopy = () => {
        navigator.clipboard.writeText(formId);
    };

    return (
        <s-page>
            <s-stack direction="inline" alignItems="center" gap="base" padding="base none">
                <s-button onClick={() => navigate(-1)}>
                    <s-icon type="arrow-left"></s-icon>
                </s-button>
            </s-stack>

            {/* Hero */}
            <div style={{
                background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #0e7490 100%)",
                borderRadius: "16px", padding: "48px 40px", textAlign: "center",
                position: "relative", overflow: "hidden", marginBottom: "28px",
            }}>
                <div style={{ position: "absolute", top: "-40px", left: "-40px", width: "180px", height: "180px", borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
                <div style={{ position: "absolute", bottom: "-60px", right: "-60px", width: "240px", height: "240px", borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
                <div style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    width: "72px", height: "72px", borderRadius: "50%",
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    boxShadow: "0 0 32px rgba(16,185,129,0.45)", marginBottom: "24px",
                }}>
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>
                <h1 style={{ margin: "0 0 10px", fontSize: "30px", fontWeight: "700", color: "#fff", letterSpacing: "-0.5px" }}>
                    Form Saved & Published!
                </h1>
                <p style={{ margin: 0, fontSize: "15px", color: "rgba(255,255,255,0.65)", maxWidth: "480px", marginLeft: "auto", marginRight: "auto" }}>
                    <strong style={{ color: "rgba(255,255,255,0.9)" }}>{formTitle}</strong> has been saved to your Shopify metaobjects and is now live.
                </p>
            </div>

            <s-grid gridTemplateColumns="repeat(12, 1fr)" gap="base">

                {/* Unique ID card */}
                <s-grid-item gridColumn="span 8">
                    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "28px 32px", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                            <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "linear-gradient(135deg, #6366f1, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                            </div>
                            <h2 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#111827" }}>Unique Form ID</h2>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "#f8fafc", border: "1.5px solid #e0e7ff", borderRadius: "10px", padding: "14px 18px" }}>
                            <code style={{ flex: 1, fontSize: "14px", fontFamily: "'Courier New', monospace", fontWeight: "700", color: "#4f46e5", wordBreak: "break-all" }}>
                                {formId}
                            </code>
                            <button onClick={handleCopy} title="Copy ID" style={{ flexShrink: 0, background: "#4f46e5", color: "white", border: "none", borderRadius: "8px", padding: "8px 16px", fontSize: "13px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="9" y="9" width="13" height="13" rx="2" />
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                </svg>
                                Copy
                            </button>
                        </div>
                        <p style={{ margin: "14px 0 0", fontSize: "13px", color: "#6b7280", lineHeight: "1.6" }}>
                            This ID uniquely identifies your form in Shopify metaobjects. Use it to embed the form on your storefront or configure automations.
                        </p>
                    </div>
                </s-grid-item>

                {/* Summary card */}
                <s-grid-item gridColumn="span 4">
                    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "28px 24px", boxShadow: "0 1px 8px rgba(0,0,0,0.06)", height: "100%", boxSizing: "border-box" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                            <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "linear-gradient(135deg, #10b981, #059669)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                </svg>
                            </div>
                            <h2 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#111827" }}>Summary</h2>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            {[
                                { label: "Form Name", value: getField("full_name") },
                                { label: "Type", value: getField("role") },
                                { label: "Status", value: getField("active") === "true" ? "🟢 Active" : "⚫ Inactive" },
                                { label: "Published At", value: publishedAt },
                                { label: "Saved to Metaobject", value: metaobject ? "✅ Yes" : "❌ No" },
                            ].map(({ label, value }) => (
                                <div key={label} style={{ borderBottom: "1px solid #f3f4f6", paddingBottom: "10px" }}>
                                    <div style={{ fontSize: "11px", fontWeight: "600", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "3px" }}>{label}</div>
                                    <div style={{ fontSize: "13px", fontWeight: "600", color: "#111827" }}>{value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </s-grid-item>

                {/* Saved fields table */}
                {savedFields.length > 0 && (
                    <s-grid-item gridColumn="span 12">
                        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "28px 32px", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
                            <h2 style={{ margin: "0 0 20px", fontSize: "16px", fontWeight: "700", color: "#111827" }}>
                                📋 Saved Form Fields ({savedFields.length})
                            </h2>
                            <div style={{ overflowX: "auto", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                                    <thead>
                                        <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                                            <th style={{ padding: "10px 16px", fontWeight: "600", color: "#374151" }}>#</th>
                                            <th style={{ padding: "10px 16px", fontWeight: "600", color: "#374151" }}>Field Label</th>
                                            <th style={{ padding: "10px 16px", fontWeight: "600", color: "#374151" }}>Type</th>
                                            <th style={{ padding: "10px 16px", fontWeight: "600", color: "#374151", textAlign: "center" }}>Required</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {savedFields.map((field, i) => (
                                            <tr key={field.id || i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                                                <td style={{ padding: "10px 16px", color: "#9ca3af" }}>{i + 1}</td>
                                                <td style={{ padding: "10px 16px", fontWeight: "600", color: "#111827" }}>{field.label}</td>
                                                <td style={{ padding: "10px 16px" }}>
                                                    <span style={{ background: "#ede9fe", color: "#6d28d9", borderRadius: "6px", padding: "2px 8px", fontSize: "11px", fontWeight: "600", fontFamily: "monospace" }}>
                                                        {field.type}
                                                    </span>
                                                </td>
                                                <td style={{ padding: "10px 16px", textAlign: "center" }}>
                                                    <span style={{ background: field.required ? "#ecfdf5" : "#f3f4f6", color: field.required ? "#047857" : "#6b7280", borderRadius: "12px", padding: "2px 10px", fontSize: "11px", fontWeight: "600" }}>
                                                        {field.required ? "Yes" : "No"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </s-grid-item>
                )}

                {/* Next steps */}
                <s-grid-item gridColumn="span 12">
                    <div style={{ background: "linear-gradient(135deg, #f0fdf4, #ecfdf5)", border: "1px solid #a7f3d0", borderRadius: "12px", padding: "24px 32px" }}>
                        <h3 style={{ margin: "0 0 16px", fontSize: "15px", fontWeight: "700", color: "#065f46" }}>✅ What's next?</h3>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                            {[
                                { icon: "🔗", title: "Embed on Storefront", desc: "Use your form ID to embed this form on any page via the theme extension block." },
                                { icon: "📊", title: "View Submissions", desc: "Track incoming responses directly from the Submissions tab in the dashboard." },
                                { icon: "⚙️", title: "Configure Automations", desc: "Set up email notifications or approval flows from the form settings." },
                            ].map(({ icon, title, desc }) => (
                                <div key={title} style={{ background: "white", borderRadius: "10px", padding: "16px 20px", border: "1px solid #d1fae5" }}>
                                    <div style={{ fontSize: "24px", marginBottom: "8px" }}>{icon}</div>
                                    <div style={{ fontSize: "13px", fontWeight: "700", color: "#065f46", marginBottom: "6px" }}>{title}</div>
                                    <div style={{ fontSize: "12px", color: "#6b7280", lineHeight: "1.5" }}>{desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </s-grid-item>

                {/* Actions */}
                <s-grid-item gridColumn="span 12">
                    <s-stack direction="inline" gap="base">
                        <s-button variant="primary" onClick={() => navigate("/app/submissions")}>View Submissions</s-button>
                        <s-button onClick={() => navigate("/app/forms")}>Back to Forms</s-button>
                    </s-stack>
                </s-grid-item>

            </s-grid>
        </s-page>
    );
}
