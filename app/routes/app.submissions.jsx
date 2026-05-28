import { useLoaderData, useNavigate, useFetcher, useSearchParams } from "react-router";
import { authenticate } from "../shopify.server";
import { useState, useEffect } from "react";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  try {
    const response = await admin.graphql(`
      query GetSubmissions {
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

    const submissions = nodes.map((node) => {
      const fields = node.fields.reduce((acc, f) => {
        acc[f.key] = f.value;
        return acc;
      }, {});

      return {
        id: node.id,
        submittedAt: node.updatedAt,
        customerName: fields.customer_name || "Anonymous",
        formName: fields.form_name || "Untitled",
        formId: fields.form_id || "",
        category: fields.category || "custom",
        status: fields.status || "Submitted",
        payload: JSON.parse(fields.payload || "{}"),
      };
    });

    return { submissions };
  } catch (err) {
    console.error("Error fetching submissions:", err);
    return { submissions: [], error: err.message };
  }
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  const submissionId = formData.get("submissionId");
  const payloadStr = formData.get("payload") || "{}";
  const formId = formData.get("formId") || "";

  if (!submissionId) {
    return Response.json({ error: "Submission ID is required" }, { status: 400 });
  }

  try {
    if (intent === "reject") {
      const response = await admin.graphql(
        `
        mutation UpdateSubmissionStatus($id: ID!, $metaobject: MetaobjectUpdateInput!) {
            metaobjectUpdate(id: $id, metaobject: $metaobject) {
                metaobject { id }
                userErrors { field message }
            }
        }
        `,
        {
          variables: {
            id: submissionId,
            metaobject: {
              fields: [
                { key: "status", value: "Rejected" }
              ]
            }
          }
        }
      );
      const json = await response.json();
      const userErrors = json.data?.metaobjectUpdate?.userErrors;
      if (userErrors?.length) {
        return Response.json({ error: userErrors.map((e) => e.message).join(", ") }, { status: 400 });
      }
      return Response.json({ success: true, status: "Rejected" });
    }

    if (intent === "accept") {
      const payload = JSON.parse(payloadStr);

      // Load form details to check B2B customerTag
      let customerTag = "";
      if (formId) {
        try {
          const formProfileResponse = await admin.graphql(
            `
            query GetFormProfile($handle: MetaobjectHandleInput!) {
                metaobjectByHandle(handle: $handle) {
                    fields {
                        key
                        value
                    }
                }
            }
          `,
            {
              variables: {
                handle: { type: "$app:profile", handle: formId },
              },
            }
          );
          const formProfileJson = await formProfileResponse.json();
          const formFields = formProfileJson.data?.metaobjectByHandle?.fields || [];
          const formFieldMap = formFields.reduce((acc, f) => {
            acc[f.key] = f.value;
            return acc;
          }, {});
          if (formFieldMap.bio) {
            const bio = JSON.parse(formFieldMap.bio || "{}");
            customerTag = bio.customerTag || "";
          }
        } catch (e) {
          console.error("Error loading form profile for customer tags:", e);
        }
      }

      const companyInput = {
        company: {
          name: payload["Company Name"] || payload["Company"] || payload["Business Name"] || payload["company_name"] || "New B2B Company"
        },
        companyContact: {
          firstName: payload["First Name"] || payload["first_name"] || "B2B",
          lastName: payload["Last Name"] || payload["last_name"] || "Contact",
          email: payload["Email"] || payload["Email Address"] || payload["email"] || ""
        }
      };

      if (companyInput.companyContact.firstName === "B2B" && companyInput.companyContact.lastName === "Contact") {
        const fullName = payload["Name"] || payload["Full Name"] || payload["full_name"] || "";
        if (fullName) {
          const parts = fullName.trim().split(/\s+/);
          companyInput.companyContact.firstName = parts[0] || "B2B";
          companyInput.companyContact.lastName = parts.slice(1).join(" ") || "Contact";
        }
      }

      const companyResponse = await admin.graphql(
        `
        mutation CreateCompanyWithContact($input: CompanyCreateInput!) {
            companyCreate(input: $input) {
                company {
                    id
                    name
                    mainContact {
                        id
                        customer {
                            id
                        }
                    }
                }
                userErrors {
                    field
                    message
                    code
                }
            }
        }
        `,
        {
          variables: {
            input: companyInput
          }
        }
      );

      const companyJson = await companyResponse.json();
      if (companyJson.errors?.length) {
        return Response.json({ error: companyJson.errors.map(e => e.message).join(", ") }, { status: 400 });
      }

      const userErrors = companyJson.data?.companyCreate?.userErrors;
      if (userErrors?.length) {
        return Response.json({ error: userErrors.map((e) => e.message).join(", ") }, { status: 400 });
      }

      const createdCompany = companyJson.data?.companyCreate?.company;
      const customerId = createdCompany?.mainContact?.customer?.id;

      // Apply B2B Customer Tags if set
      if (customerId && customerTag) {
        try {
          const tagsArray = customerTag.split(",").map(t => t.trim()).filter(Boolean);
          if (tagsArray.length > 0) {
            await admin.graphql(
              `
              mutation UpdateCustomerTags($input: CustomerInput!) {
                  customerUpdate(input: $input) {
                      customer {
                          id
                          tags
                      }
                      userErrors {
                          field
                          message
                      }
                  }
              }
              `,
              {
                variables: {
                  input: {
                    id: customerId,
                    tags: tagsArray
                  }
                }
              }
            );
          }
        } catch (tagErr) {
          console.error("Error applying customer tags on acceptance:", tagErr);
        }
      }

      const updateResponse = await admin.graphql(
        `
        mutation UpdateSubmissionStatus($id: ID!, $metaobject: MetaobjectUpdateInput!) {
            metaobjectUpdate(id: $id, metaobject: $metaobject) {
                metaobject { id }
                userErrors { field message }
            }
        }
        `,
        {
          variables: {
            id: submissionId,
            metaobject: {
              fields: [
                { key: "status", value: "Approved" }
              ]
            }
          }
        }
      );

      const updateJson = await updateResponse.json();
      const updateErrors = updateJson.data?.metaobjectUpdate?.userErrors;
      if (updateErrors?.length) {
        return Response.json({ error: "Company created, but status update failed: " + updateErrors.map((e) => e.message).join(", ") }, { status: 400 });
      }

      return Response.json({ success: true, status: "Approved", companyId: createdCompany?.id });
    }

    return Response.json({ error: "Invalid intent" }, { status: 400 });
  } catch (err) {
    console.error("Action error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
};

const Submissions = () => {
  const { submissions, error } = useLoaderData();
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const [searchParams] = useSearchParams();
  const formNameParam = searchParams.get("formName");

  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);
  const [selectedFormFilter, setSelectedFormFilter] = useState(formNameParam || "All");

  useEffect(() => {
    if (formNameParam) {
      setSelectedFormFilter(formNameParam);
    }
  }, [formNameParam]);

  const formNames = ["All", ...new Set(submissions.map((s) => s.formName).filter(Boolean))];

  const filteredSubmissions = selectedFormFilter === "All"
    ? submissions
    : submissions.filter((s) => s.formName === selectedFormFilter);

  const selectedSubmission = submissions.find((s) => s.id === selectedSubmissionId);

  const handleAccept = (sub) => {
    fetcher.submit(
      {
        intent: "accept",
        submissionId: sub.id,
        formId: sub.formId || "",
        payload: JSON.stringify(sub.payload),
      },
      { method: "post" }
    );
  };

  const handleReject = (sub) => {
    fetcher.submit(
      {
        intent: "reject",
        submissionId: sub.id,
      },
      { method: "post" }
    );
  };

  return (
    <s-page heading="Submissions">
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
          <s-heading>Submissions</s-heading>
        </s-stack>
      </s-stack>

      {error && <s-text tone="critical">⚠ {error}</s-text>}

      {submissions.length === 0 ? (
        /* Empty State */
        <s-stack
          justifyContent="center"
          alignItems="center"
          gap="base"
          padding="base"
        >
          <s-box inlineSize="350px" padding="base" textAlign="center">
            <s-stack padding="base none" gap="base">
              <s-heading padding="base">No submissions yet</s-heading>
              <s-paragraph>
                When clients submit forms, their data will appear here.
              </s-paragraph>
            </s-stack>
          </s-box>
        </s-stack>
      ) : (
        /* Submissions Table with Only Name, Category, Status, Submitted At */
        <s-box>
          <s-stack
            padding="base none"
            direction="inline"
            justifyContent="space-between"
            alignItems="center"
            style={{ marginBottom: "12px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <s-text fontWeight="semibold">Filter by Form:</s-text>
              <select
                className="premium-select"
                value={selectedFormFilter}
                onChange={(e) => setSelectedFormFilter(e.target.value)}
              >
                {formNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <s-stack>
              <s-text tone="subdued">
                Showing {filteredSubmissions.length} of {submissions.length} submissions
              </s-text>
            </s-stack>
          </s-stack>

          <s-section padding="none">
            <s-table>
              <s-table-header-row>
                <s-table-header>Name</s-table-header>
                <s-table-header>Form Name</s-table-header>
                <s-table-header>Category</s-table-header>
                <s-table-header>Status</s-table-header>
                <s-table-header>Submitted At</s-table-header>
              </s-table-header-row>
              <s-table-body>
                {filteredSubmissions.map((sub) => (
                  <s-table-row
                    key={sub.id}
                    onClick={() => setSelectedSubmissionId(sub.id)}
                  >
                    <s-table-cell>
                      <s-clickable type="button">
                        <s-text fontWeight="semibold">{sub.customerName}</s-text>
                      </s-clickable>
                    </s-table-cell>
                    <s-table-cell>
                      <s-text>{sub.formName}</s-text>
                    </s-table-cell>
                    <s-table-cell>
                      <s-badge tone={sub.category === "b2b" ? "success" : "info"}>
                        {sub.category === "b2b" ? "B2B" : "Custom"}
                      </s-badge>
                    </s-table-cell>
                    <s-table-cell>
                      <s-badge tone={
                        sub.status === "Approved" ? "success" : 
                        sub.status === "Pending" ? "attention" : 
                        sub.status === "Rejected" ? "critical" : "info"
                      }>
                        {sub.status}
                      </s-badge>
                    </s-table-cell>
                    <s-table-cell>
                      <s-text tone="subdued">
                        {new Date(sub.submittedAt).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </s-text>
                    </s-table-cell>
                  </s-table-row>
                ))}
              </s-table-body>
            </s-table>
          </s-section>
        </s-box>
      )}

      {/* Submission details Popup Modal */}
      {selectedSubmission && (
        <div
          className="submission-overlay"
          onClick={() => setSelectedSubmissionId(null)}
        >
          <div
            className="submission-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <s-stack gap="base">
              <s-stack
                direction="inline"
                justifyContent="space-between"
                alignItems="center"
              >
                <s-heading level="2">Submission Details</s-heading>
                <s-button onClick={() => setSelectedSubmissionId(null)}>
                  Close
                </s-button>
              </s-stack>
              <s-divider />

              {/* Form & Submitter Summary Cards */}
              <div className="summary-grid">
                <div className="summary-card">
                  <div className="card-label">Form Name</div>
                  <div className="card-value">{selectedSubmission.formName}</div>
                </div>
                <div className="summary-card">
                  <div className="card-label">Category</div>
                  <div className="card-value">
                    <span className={`category-badge ${selectedSubmission.category}`}>
                      {selectedSubmission.category === "b2b" ? "B2B" : "Custom"}
                    </span>
                  </div>
                </div>
                <div className="summary-card">
                  <div className="card-label">Submitted At</div>
                  <div className="card-value">
                    {new Date(selectedSubmission.submittedAt).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </div>
                </div>
                <div className="summary-card">
                  <div className="card-label">Status</div>
                  <div className="card-value">
                    <span className="status-badge">{selectedSubmission.status}</span>
                  </div>
                </div>
              </div>

              <s-divider />

              <s-text fontWeight="bold" tone="subdued">Submitted Values</s-text>
              <div className="payload-list">
                {Object.entries(selectedSubmission.payload).map(
                  ([key, value]) => (
                    <div key={key} className="payload-item">
                      <div className="payload-key">{key}</div>
                      <div className="payload-value">
                        {typeof value === "object" ? JSON.stringify(value, null, 2) : String(value)}
                      </div>
                    </div>
                  ),
                )}
              </div>

              {selectedSubmission.category === "b2b" && selectedSubmission.status === "Pending" && (
                <>
                  <s-divider />
                  <div className="b2b-action-panel">
                    <div style={{ marginBottom: "12px" }}>
                      <s-text fontWeight="bold" tone="warning">B2B Onboarding Approval</s-text>
                    </div>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <button
                        className="b2b-btn accept"
                        disabled={fetcher.state !== "idle"}
                        onClick={() => handleAccept(selectedSubmission)}
                      >
                        {fetcher.state !== "idle" && fetcher.formData?.get("intent") === "accept" ? "Accepting..." : "Accept & Create Company"}
                      </button>
                      <button
                        className="b2b-btn reject"
                        disabled={fetcher.state !== "idle"}
                        onClick={() => handleReject(selectedSubmission)}
                      >
                        {fetcher.state !== "idle" && fetcher.formData?.get("intent") === "reject" ? "Rejecting..." : "Reject Application"}
                      </button>
                    </div>
                    {fetcher.data?.error && (
                      <div className="b2b-error">
                        ⚠ {fetcher.data.error}
                      </div>
                    )}
                  </div>
                </>
              )}
            </s-stack>
          </div>
        </div>
      )}

      {/* Styled Premium Aesthetics */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .submission-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(17, 24, 39, 0.4);
          backdrop-filter: blur(8px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          animation: fadeIn 0.25s ease-out;
        }
        .submission-modal {
          background: #ffffff;
          border: 1px solid rgba(229, 231, 235, 0.8);
          padding: 28px;
          border-radius: 16px;
          width: 550px;
          max-width: 90%;
          max-height: 85vh;
          overflow-y: auto;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin: 8px 0;
        }
        .summary-card {
          background: #f9fafb;
          border: 1px solid #f3f4f6;
          border-radius: 8px;
          padding: 12px;
        }
        .card-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #6b7280;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .card-value {
          font-size: 14px;
          color: #111827;
          font-weight: 500;
        }
        .category-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 9999px;
        }
        .category-badge.b2b {
          background-color: #eff6ff;
          color: #1d4ed8;
        }
        .category-badge.custom {
          background-color: #f0fdf4;
          color: #047857;
        }
        .status-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 9999px;
          background-color: #f3f4f6;
          color: #374151;
        }
        .payload-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 6px;
        }
        .payload-item {
          border: 1px solid #f3f4f6;
          border-radius: 8px;
          padding: 12px;
          background: #fff;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .payload-item:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        .payload-key {
          font-size: 12px;
          font-weight: 600;
          color: #4b5563;
          margin-bottom: 2px;
        }
        .payload-value {
          font-size: 14px;
          color: #111827;
          line-height: 1.5;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(16px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .b2b-action-panel {
          background: #fbfbfb;
          border: 1px dashed #e5e7eb;
          border-radius: 12px;
          padding: 16px;
          margin-top: 8px;
        }
        .b2b-btn {
          flex: 1;
          padding: 10px 16px;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .b2b-btn.accept {
          background-color: #008060;
          color: white;
        }
        .b2b-btn.accept:hover:not(:disabled) {
          background-color: #006e52;
          transform: translateY(-1px);
        }
        .b2b-btn.reject {
          background-color: #f3f4f6;
          color: #d32f2f;
          border: 1px solid #e5e7eb;
        }
        .b2b-btn.reject:hover:not(:disabled) {
          background-color: #fcebeb;
          transform: translateY(-1px);
        }
        .b2b-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .b2b-error {
          color: #d32f2f;
          background-color: #ffebee;
          padding: 10px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          margin-top: 12px;
          border: 1px solid #ffcdd2;
        }
        .premium-select {
          appearance: none;
          background-color: #ffffff;
          border: 1px solid #bbc3c9;
          border-radius: 8px;
          color: #202223;
          font-family: inherit;
          font-size: 14px;
          font-weight: 500;
          height: 36px;
          padding: 0 32px 0 12px;
          cursor: pointer;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%235c5f62' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 8px center;
          background-repeat: no-repeat;
          background-size: 20px;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          min-width: 200px;
        }
        .premium-select:hover {
          border-color: #8c9196;
        }
        .premium-select:focus {
          border-color: #008060;
          box-shadow: 0 0 0 2px rgba(0, 128, 96, 0.15);
        }
      `,
        }}
      />
    </s-page>
  );
};

export default Submissions;
