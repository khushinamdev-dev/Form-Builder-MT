import { useLoaderData, useNavigate } from "react-router";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  let b2bCustomers = [];
  let errors = [];

  // Query submissions database (Metaobjects) to find approved B2B customers
  try {
    const response = await admin.graphql(`
      query GetSubmissionsForCustomers {
        metaobjects(type: "$app:submissions", first: 50, sortKey: "updated_at", reverse: true) {
          nodes {
            id
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

    b2bCustomers = nodes
      .map((node) => {
        const fields = node.fields.reduce((acc, f) => {
          acc[f.key] = f.value;
          return acc;
        }, {});

        const category = fields.category || "custom";
        const status = fields.status || "Submitted";

        // Only include approved B2B customers
        if (category !== "b2b" || status !== "Approved") {
          return null;
        }

        let payload = {};
        try {
          payload = JSON.parse(fields.payload || "{}");
        } catch (_) { }

        const email = payload["Email"] || payload["Email Address"] || payload["email"] || "—";
        const phone = payload["Phone"] || payload["Phone Number"] || payload["phone"] || "—";
        const companyName = payload["Company Name"] || payload["Company"] || payload["Business Name"] || payload["company_name"] || "Approved Company";

        return {
          id: node.id,
          name: fields.customer_name || "Anonymous B2B Customer",
          email,
          phone,
          companyName,
          approvedAt: node.updatedAt,
        };
      })
      .filter(Boolean);

  } catch (err) {
    console.error("Error loading approved B2B customers:", err);
    errors.push("Failed to fetch approved B2B customers: " + err.message);
  }

  return { b2bCustomers, errors };
};

const Customers = () => {
  const { b2bCustomers, errors } = useLoaderData();
  const navigate = useNavigate();

  return (
    <s-page heading="Approved B2B Customers">
      {/* Header with back navigation */}
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
          <s-heading>Approved B2B Customers</s-heading>
        </s-stack>
      </s-stack>

      {errors.length > 0 && (
        <s-box padding="base" className="error-alert-box">
          {errors.map((err, i) => (
            <s-text key={i} tone="warning" className="error-alert-text">⚠ {err}</s-text>
          ))}
        </s-box>
      )}

      <s-box className="margin-bottom-16">
        <s-text tone="subdued">
          Showing {b2bCustomers.length} customer{b2bCustomers.length === 1 ? "" : "s"} approved and created via B2B onboarding.
        </s-text>
      </s-box>

      {b2bCustomers.length === 0 ? (
        <s-box padding="base" textAlign="center" className="empty-customers-card">
          <s-stack gap="base" padding="base">
            <s-heading level="3">No approved B2B customers yet</s-heading>
            <s-paragraph>
              When you approve a pending B2B form submission, the customer's B2B Company contact will display in this list.
            </s-paragraph>
            <s-button onClick={() => navigate("/app/submissions")}>View Pending Submissions</s-button>
          </s-stack>
        </s-box>
      ) : (
        <s-box>
          <s-section padding="none">
            <s-table>
              <s-table-header-row>
                <s-table-header>Customer Name</s-table-header>
                <s-table-header>Approved Company</s-table-header>
                <s-table-header>Email</s-table-header>
                <s-table-header>Phone</s-table-header>
                <s-table-header>Approved At</s-table-header>
                <s-table-header>Submission ID</s-table-header>
              </s-table-header-row>
              <s-table-body>
                {b2bCustomers.map((cust) => {
                  return (
                    <s-table-row key={cust.id} className="table-row" >
                      <s-table-cell>
                        <s-text fontWeight="semibold">{cust.name}</s-text>
                      </s-table-cell>
                      <s-table-cell>
                        <s-badge tone="success">{cust.companyName}</s-badge>
                      </s-table-cell>
                      <s-table-cell>
                        <s-text>{cust.email}</s-text>
                      </s-table-cell>
                      <s-table-cell>
                        <s-text>{cust.phone}</s-text>
                      </s-table-cell>
                      <s-table-cell>
                        <s-text tone="subdued">
                          {new Date(cust.approvedAt).toLocaleString("en-US", {
                            dateStyle: "medium",
                            timeStyle: "short"
                          })}
                        </s-text>
                      </s-table-cell>
                      <s-table-cell>
                        <s-text tone="subdued" className="submission-id-text">
                          {cust.id.split("/").pop()}
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

export default Customers;