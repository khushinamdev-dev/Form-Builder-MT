import { useLoaderData, useNavigate } from "react-router";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
    const { admin } = await authenticate.admin(request);

    let forms = [];
    let error = null;

    try {
        const response = await admin.graphql(`
            query GetForms {
                metaobjects(type: "$app:profile", first: 50, sortKey: "updated_at", reverse: true) {
                    nodes {
                        id
                        handle
                        type
                        updatedAt
                        fields {
                            key
                            value
                        }
                    }
                }
            }
        `);

        const json = await response.json();
        const nodes = json.data?.metaobjects?.nodes || [];

        forms = nodes.map(node => ({
            id: node.id,
            handle: node.handle,
            type: node.type,
            updatedAt: node.updatedAt,
            name: node.fields.find(f => f.key === "full_name")?.value || "Untitled Form",
            role: node.fields.find(f => f.key === "role")?.value || "—",
            active: node.fields.find(f => f.key === "active")?.value === "true",
        }));
    } catch (err) {
        error = err.message;
        console.error("Error fetching forms:", err);
    }

    return { forms, error };
};

const Forms = () => {
    const { forms, error } = useLoaderData();
    const navigate = useNavigate();

    const formatDate = (isoString) => {
        if (!isoString) return "—";
        return new Date(isoString).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    // Extract short ID from handle for display
    const shortId = (handle) => handle?.length > 20 ? handle.slice(0, 22) + "…" : handle;

    return (
        <s-page heading="Forms">

            {/* Header row */}
            <s-stack direction="inline" justifyContent="space-between" alignItems="center" padding="base none">
                <s-stack direction="inline" alignItems="center" gap="base">
                    <s-button onClick={() => navigate("/app")}>
                        <s-icon type="arrow-left" tone="warning"></s-icon>
                    </s-button>
                    <s-heading>Forms</s-heading>
                </s-stack>
                <s-button variant="primary" onClick={() => navigate("/app/template")}>Create Form</s-button>
            </s-stack>

            {/* Error banner */}
            {error && (
                <div style={{ padding: "12px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", color: "#991b1b", fontSize: "13px", marginBottom: "16px" }}>
                    ⚠ {error}
                </div>
            )}

            {forms.length === 0 ? (
                /* Empty state */
                <s-stack justifyContent="center" alignItems="center" gap="base" padding="base">
                    <s-box inlineSize="350px" padding="base" textAlign="center">
                        <s-image
                            src="https://app.customerfields.com/images/forms-empty-state.png"
                            alt="Empty state"
                            borderWidth="base"
                            borderStyle="solid"
                            borderColor="subdued"
                            borderRadius="large"
                            objectFit="cover"
                            aspectRatio="1/1"
                        ></s-image>
                        <s-stack padding="base none" gap="base">
                            <s-heading padding="base">Ask your customers anything</s-heading>
                            <s-paragraph>Choose a template, customize, and install wherever you want.</s-paragraph>
                            <s-button variant="primary" onClick={() => navigate("/app/template")}>Create Form</s-button>
                        </s-stack>
                    </s-box>
                </s-stack>
            ) : (
                /* Forms table */
                <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>

                    {/* Table header bar */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #e5e7eb", background: "#f9fafb" }}>
                        <span style={{ fontSize: "14px", fontWeight: "600", color: "#111827" }}>
                            All Forms <span style={{ background: "#e0e7ff", color: "#4f46e5", borderRadius: "10px", padding: "2px 8px", fontSize: "12px", marginLeft: "8px" }}>{forms.length}</span>
                        </span>
                    </div>

                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                            <thead>
                                <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                                    <th style={{ padding: "12px 20px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.5px" }}>Form Name</th>
                                    <th style={{ padding: "12px 20px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.5px" }}>Unique ID</th>
                                    <th style={{ padding: "12px 20px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.5px" }}>Type</th>
                                    <th style={{ padding: "12px 20px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.5px" }}>Status</th>
                                    <th style={{ padding: "12px 20px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.5px" }}>Last Updated</th>
                                </tr>
                            </thead>
                            <tbody>
                                {forms.map((form, i) => (
                                    <tr
                                        key={form.id}
                                        onClick={() => navigate(`/app/form-published/${form.handle}?title=${encodeURIComponent(form.name)}`)}
                                        style={{
                                            borderBottom: i < forms.length - 1 ? "1px solid #f3f4f6" : "none",
                                            cursor: "pointer",
                                            transition: "background 0.15s",
                                        }}
                                        onMouseOver={e => e.currentTarget.style.background = "#f9fafb"}
                                        onMouseOut={e => e.currentTarget.style.background = "transparent"}
                                    >
                                        {/* Form Name */}
                                        <td style={{ padding: "14px 20px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #6366f1, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                        <polyline points="14 2 14 8 20 8" />
                                                    </svg>
                                                </div>
                                                <span style={{ fontWeight: "600", color: "#111827" }}>{form.name}</span>
                                            </div>
                                        </td>

                                        {/* Unique ID */}
                                        <td style={{ padding: "14px 20px" }}>
                                            <code style={{ fontSize: "12px", color: "#4f46e5", background: "#ede9fe", padding: "3px 8px", borderRadius: "6px", fontFamily: "monospace", fontWeight: "600" }}>
                                                {shortId(form.handle)}
                                            </code>
                                        </td>

                                        {/* Type */}
                                        <td style={{ padding: "14px 20px" }}>
                                            <span style={{ background: "#f0fdf4", color: "#047857", borderRadius: "6px", padding: "3px 10px", fontSize: "12px", fontWeight: "600" }}>
                                                {form.role}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td style={{ padding: "14px 20px" }}>
                                            <span style={{
                                                display: "inline-flex", alignItems: "center", gap: "5px",
                                                background: form.active ? "#ecfdf5" : "#f3f4f6",
                                                color: form.active ? "#047857" : "#6b7280",
                                                borderRadius: "12px", padding: "3px 10px", fontSize: "12px", fontWeight: "600"
                                            }}>
                                                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: form.active ? "#10b981" : "#9ca3af", display: "inline-block" }} />
                                                {form.active ? "Active" : "Inactive"}
                                            </span>
                                        </td>

                                        {/* Last Updated */}
                                        <td style={{ padding: "14px 20px", color: "#6b7280" }}>
                                            {formatDate(form.updatedAt)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

        </s-page>
    );
};

export default Forms;