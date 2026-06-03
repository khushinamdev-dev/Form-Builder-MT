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
                metaobjects(type: "$app:forms_data", first: 50, sortKey: "updated_at", reverse: true) {
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

      let parsedData = {};
      try {
        parsedData = JSON.parse(allFields.data || "{}");
      } catch (_) { }

      return {
        id: node.id,
        formId: node.handle,
        createdAt: node.updatedAt,
        fields: allFields,
        name: parsedData.formName || parsedData.headerTitle || "Untitled Form",
        category: parseFormCategory(allFields.data, allFields.form),
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
            <s-stack direction="inline" gap="small">
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
            </s-stack>

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
                      className="table-row"
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
                        <s-stack
                          direction="inline"
                          gap="small"
                          alignItems="center"
                        >
                          <s-button variant="tertiary" >
                            {form.name}
                          </s-button>
                        </s-stack>
                      </s-table-cell>

                      <s-table-cell>
                        <s-stack
                          direction="inline"
                          gap="small"
                          alignItems="center"
                          className="form-id-cell-container"
                        >
                          <s-text>{form.formId || "—"}</s-text>
                          {form.formId && (
                            <s-button
                              type="button"
                              variant="tertiary"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(form.formId);
                                if (window.shopify && window.shopify.toast) {
                                  window.shopify.toast.show("Form ID copied!");
                                }
                              }}
                              className="copy-id-btn"
                              title="Copy Form ID"
                            >
                              <s-icon type="clipboard" />
                            </s-button>
                          )}
                        </s-stack>
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
                        <s-stack direction="inline" gap="small" alignItems="center">
                          <s-button variant="tertiary" onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/app/submissions?formName=${encodeURIComponent(form.name)}`);
                          }}>
                            <s-icon type="view" />
                            <s-text tone="subdued">View</s-text>
                          </s-button>
                        </s-stack>
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
