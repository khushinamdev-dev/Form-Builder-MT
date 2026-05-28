import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { authenticate } from "../shopify.server";
import {
  getCategoryDisplay,
  getEditorPathForCategory,
  parseFormCategory,
} from "../utils/form-category";

function getFieldValue(fields, key) {
  return fields?.find((f) => f.key === key)?.value ?? null;
}

function fieldsToRecord(fields) {
  return (fields || []).reduce((acc, { key, value }) => {
    acc[key] = value;
    return acc;
  }, {});
}

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

    if (json.errors?.length) {
      throw new Error(json.errors.map((e) => e.message).join(", "));
    }

    const nodes = json.data?.metaobjects?.nodes || [];

    forms = nodes.map((node) => {
      const allFields = fieldsToRecord(node.fields);

      return {
        id: node.id,
        formId: node.handle,
        createdAt: node.updatedAt,
        // All metaobject fields (full_name, email, role, bio, active, rating, …)
        fields: allFields,
        // Table columns only
        name: getFieldValue(node.fields, "full_name") || "Untitled Form",
        category: parseFormCategory(allFields.bio, allFields.role),
      };
    });
  } catch (err) {
    error = err.message;
    console.error("Error fetching forms:", err);
  }

  return { forms, error };
};

const Forms = () => {
  const { forms, error } = useLoaderData();
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("All");

  const filteredForms = forms.filter((form) => {
    if (selectedFilter === "All") return true;
    if (selectedFilter === "B2B") return form.category === "b2b";
    if (selectedFilter === "Custom") return form.category === "custom";
    return true;
  });

  const formatDate = (isoString) => {
    if (!isoString) return "—";
    return new Date(isoString).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <s-page heading="Forms">
      {/* Header row */}
      <s-stack
        direction="inline"
        justifyContent="space-between"
        alignItems="center"
        padding="base none"
      >
        <s-stack direction="inline" alignItems="center" gap="base">
          <s-button onClick={() => navigate("/app")}>
            <s-icon type="arrow-left" tone="warning"></s-icon>
          </s-button>
          <s-heading>Forms</s-heading>
        </s-stack>
        <s-button variant="primary" onClick={() => navigate("/app/create-form")}>
          Create Form
        </s-button>
      </s-stack>

      {/* Error banner */}
      {error && <s-text>⚠ {error}</s-text>}

      {forms.length === 0 ? (
        /* Empty state */
        <s-stack
          justifyContent="center"
          alignItems="center"
          gap="base"
          padding="base"
        >
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
              <s-paragraph>
                Choose a template, customize, and install wherever you want.
              </s-paragraph>
              <s-button
                variant="primary"
                onClick={() => navigate("/app/template")}
              >
                Create Form
              </s-button>
            </s-stack>
          </s-box>
        </s-stack>
      ) : (
        /* Forms table */
        <s-box>
          <s-stack
            padding="base none"
            direction="inline"
            justifyContent="space-between"
          >
            <div style={{ display: "flex", gap: "8px" }}>
              <s-button
                variant={selectedFilter === "All" ? "secondary" : "tertiary"}
                onClick={() => setSelectedFilter("All")}
              >
                All
              </s-button>
              <s-button
                variant={selectedFilter === "B2B" ? "secondary" : "tertiary"}
                onClick={() => setSelectedFilter("B2B")}
              >
                B2B
              </s-button>
              <s-button
                variant={selectedFilter === "Custom" ? "secondary" : "tertiary"}
                onClick={() => setSelectedFilter("Custom")}
              >
                Custom
              </s-button>
            </div>

            <s-stack>
              <s-text>Total : {filteredForms.length}</s-text>
            </s-stack>
          </s-stack>

          <s-section padding="none">
            <s-table>
              <s-table-header-row>
                <s-table-header>Form Name</s-table-header>
                <s-table-header>Form ID</s-table-header>
                <s-table-header>Type</s-table-header>
                <s-table-header>Last Updated</s-table-header>
                <s-table-header>Submissions</s-table-header>
              </s-table-header-row>

              <s-table-body>
                {filteredForms.map((form) => {
                  const display = getCategoryDisplay(form.category);

                  return (
                    <s-table-row
                      key={form.id}
                      onClick={() =>
                        navigate(
                          `${getEditorPathForCategory(
                            form.category,
                          )}?formId=${encodeURIComponent(form.formId)}`,
                        )
                      }
                    >
                      <s-table-cell>
                        <s-clickable type="button">
                          <s-stack
                            direction="inline"
                            gap="small"
                            alignItems="center"
                          >
                            {/* <s-icon source="file" /> */}
                            <s-text fontWeight="semibold">{form.name}</s-text>
                          </s-stack>
                        </s-clickable>
                      </s-table-cell>

                      <s-table-cell>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            flexWrap: "nowrap",
                            verticalAlign: "middle",
                          }}
                        >
                          <s-text>{form.formId || "—"}</s-text>
                          {form.formId && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(form.formId);
                                if (window.shopify && window.shopify.toast) {
                                  window.shopify.toast.show("Form ID copied!");
                                }
                              }}
                              style={{
                                background: "none",
                                border: "none",
                                padding: "4px",
                                cursor: "pointer",
                                color: "#6d7175",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "4px",
                                transition: "all 0.2s ease",
                                margin: "0",
                                outline: "none",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#eef0f1";
                                e.currentTarget.style.color = "#008060";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "transparent";
                                e.currentTarget.style.color = "#6d7175";
                              }}
                              title="Copy Form ID"
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ display: "block" }}
                              >
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </s-table-cell>

                      <s-table-cell>
                        <s-badge tone="success">{display.label}</s-badge>
                      </s-table-cell>

                      <s-table-cell>
                        <s-text tone="subdued">
                          {formatDate(form.createdAt)}
                        </s-text>
                      </s-table-cell>

                      <s-table-cell>
                        <s-clickable
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/app/submissions?formName=${encodeURIComponent(form.name)}`);
                          }}
                        >
                          <s-stack direction="inline" gap="small" alignItems="center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.0"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              style={{ verticalAlign: "middle", color: "#6b7280" }}
                            >
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            <s-text tone="subdued">View</s-text>
                          </s-stack>
                        </s-clickable>
                      </s-table-cell>
                    </s-table-row>
                  );
                })}
              </s-table-body>
            </s-table>
          </s-section>
        </s-box>
      )}
    </s-page>
  );
};

export default Forms;
