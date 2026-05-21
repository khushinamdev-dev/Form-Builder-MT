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
        <s-button variant="primary" onClick={() => navigate("/app/template")}>
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
            <s-button-group>
              <s-button slot="secondary-actions">All</s-button>
              <s-button slot="secondary-actions">B2B</s-button>
              <s-button slot="secondary-actions" tone="critical">
                Custom
              </s-button>
            </s-button-group>

            <s-stack>
              <s-text>Total : {forms.length}</s-text>
            </s-stack>
          </s-stack>

          <s-section padding="none">
            <s-table>
              <s-table-header-row>
                <s-table-header>Form Name</s-table-header>
                <s-table-header>Form ID</s-table-header>
                <s-table-header>Type</s-table-header>
                <s-table-header>Last Updated</s-table-header>
              </s-table-header-row>

              <s-table-body>
                {forms.map((form) => {
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
                        <s-badge>{form.formId || "—"}</s-badge>
                      </s-table-cell>

                      <s-table-cell>
                        <s-badge tone="success">{display.label}</s-badge>
                      </s-table-cell>

                      <s-table-cell>
                        <s-text tone="subdued">
                          {formatDate(form.createdAt)}
                        </s-text>
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
