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
                handle: { type: "$app:forms_data", handle: formId },
              },
            }
          );
          const formProfileJson = await formProfileResponse.json();
          const formFields = formProfileJson.data?.metaobjectByHandle?.fields || [];
          const formFieldMap = formFields.reduce((acc, f) => {
            acc[f.key] = f.value;
            return acc;
          }, {});
          if (formFieldMap.data) {
            const bio = JSON.parse(formFieldMap.data || "{}");
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
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (formNameParam) {
      setSelectedFormFilter(formNameParam);
    }
  }, [formNameParam]);

  const formNames = ["All", ...new Set(submissions.map((s) => s.formName).filter(Boolean))];

  const filteredSubmissions = submissions.filter((sub) => {
    // 1. Form dropdown filter
    if (selectedFormFilter !== "All" && sub.formName !== selectedFormFilter) {
      return false;
    }

    // 2. Search query text match filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();

      const matchesName = (sub.customerName || "").toLowerCase().includes(query);
      const matchesForm = (sub.formName || "").toLowerCase().includes(query);
      const matchesCategory = (sub.category || "").toLowerCase().includes(query);
      const matchesStatus = (sub.status || "").toLowerCase().includes(query);

      // Search in submitted payload field values
      const matchesPayload = Object.values(sub.payload || {}).some((val) =>
        String(val || "").toLowerCase().includes(query)
      );

      return matchesName || matchesForm || matchesCategory || matchesStatus || matchesPayload;
    }

    return true;
  });

  const selectedSubmission = submissions.find((s) => s.id === selectedSubmissionId);

  const isAccepting = fetcher.state !== "idle" && fetcher.formData?.get("intent") === "accept";
  const isRejecting = fetcher.state !== "idle" && fetcher.formData?.get("intent") === "reject";

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

  useEffect(() => {
    const modalD = document.getElementById("details-modal");

    const handleCloseD = () => { setSelectedSubmissionId(null); };

    if (modalD) {
      modalD.addEventListener("close", handleCloseD);
      modalD.addEventListener("hide", handleCloseD);
      modalD.addEventListener("s-hide", handleCloseD);
      modalD.addEventListener("s-close", handleCloseD);
    }

    return () => {
      if (modalD) {
        modalD.removeEventListener("close", handleCloseD);
        modalD.removeEventListener("hide", handleCloseD);
        modalD.removeEventListener("s-hide", handleCloseD);
        modalD.removeEventListener("s-close", handleCloseD);
      }
    };
  }, [selectedSubmissionId]);

  useEffect(() => {
    const modal = document.getElementById("details-modal");
    if (modal) {
      if (selectedSubmissionId) {
        if (typeof modal.show === "function") {
          modal.show();
        } else {
          modal.setAttribute("open", "");
        }
      } else {
        if (typeof modal.hide === "function") {
          modal.hide();
        } else {
          modal.removeAttribute("open");
        }
      }
    }
  }, [selectedSubmissionId]);

  const handleExport = () => {
    if (filteredSubmissions.length === 0) {
      alert("No submissions to export.");
      return;
    }

    const csvRows = [];
    const payloadKeysSet = new Set();
    filteredSubmissions.forEach(sub => {
      Object.keys(sub.payload || {}).forEach(key => payloadKeysSet.add(key));
    });
    const payloadKeys = Array.from(payloadKeysSet);

    const headers = ["Name", "Form Name", "Category", "Status", "Submitted At", ...payloadKeys];
    csvRows.push(headers.map(h => `"${h.replace(/"/g, '""')}"`).join(","));

    filteredSubmissions.forEach(sub => {
      const row = [
        sub.customerName,
        sub.formName,
        sub.category,
        sub.status,
        new Date(sub.submittedAt).toLocaleString(),
        ...payloadKeys.map(key => {
          const val = sub.payload?.[key] || "";
          return typeof val === "object" ? JSON.stringify(val) : String(val);
        })
      ];
      csvRows.push(row.map(val => `"${val.replace(/"/g, '""')}"`).join(","));
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `submissions_export_${Date.now()}.csv`);
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <s-page heading="Submissions" >
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
        <s-stack direction="inline" gap="base">
          <s-button onClick={handleExport}>
            Export
          </s-button>
        </s-stack>
      </s-stack>

      <s-section>

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
            <s-stack gap="base" padding="base none">
              {/* Form Filter Selector (above search) */}
              <s-stack gap="small" inlineSize="350px" >
                <s-grid gridTemplateColumns="repeat(12, 1fr)" gap="small" justifyContent="space-between" alignItems="center">
                  <s-grid-item gridColumn="span 4" >
                    <s-text tone="subdued">Filter by Form :</s-text>
                  </s-grid-item>
                  <s-grid-item gridColumn="span 8" >
                    <s-select
                      value={selectedFormFilter}
                      onChange={(e) => setSelectedFormFilter(e.target.value)}
                    >
                      {formNames.map((name) => (
                        <s-option key={name} value={name}>
                          {name}
                        </s-option>
                      ))}
                    </s-select>
                  </s-grid-item>
                </s-grid>
              </s-stack>

              {/* Search Submission Input */}
              <s-stack>
                <s-search-field
                  name="submissionSearch"
                  placeholder="Search Submission"
                  value={searchQuery}
                  onInput={(e) => setSearchQuery(e.currentTarget.value || e.target.value || "")}
                  onChange={(e) => setSearchQuery(e.currentTarget.value || e.target.value || "")}
                  inlineSize="fill"
                ></s-search-field>
              </s-stack>
            </s-stack>
            {/* <s-stack
            padding="base none"
            direction="inline"
            justifyContent="space-between"
            alignItems="center"

          >
            <s-stack direction="inline" justifyContent="space-between" alignItems="center" >


            </s-stack>

            <s-stack>
              <s-text tone="subdued">
                Showing {filteredSubmissions.length} of {submissions.length} submissions
              </s-text>
            </s-stack>
          </s-stack> */}

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
                      className="table-row"
                      key={sub.id}
                      onClick={() => setSelectedSubmissionId(sub.id)}
                    >
                      <s-table-cell>
                        <s-button
                          variant="tertiary"
                          commandFor="details-modal"
                          command="--show"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSubmissionId(sub.id);
                          }}
                        >
                          <s-text fontWeight="semibold">{sub.customerName}</s-text>
                        </s-button>
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
        <s-modal id="details-modal" heading="Submission Details" open={selectedSubmissionId ? true : undefined}>
          {selectedSubmission && (
            <s-stack gap="large">
              {/* Form & Submitter Summary Cards */}
              <s-grid gridTemplateColumns="repeat(2, 1fr)" gap="base">
                <s-grid-item gridColumn="span 1">
                  <s-box className="summary-card" style={{ height: "100%" }}>
                    <s-stack gap="extra-tight">
                      <s-text className="card-label" tone="subdued" style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", color: "#6b7280" }}>Form Name</s-text>
                      <s-text className="card-value" fontWeight="bold">{selectedSubmission.formName}</s-text>
                    </s-stack>
                  </s-box>
                </s-grid-item>
                <s-grid-item gridColumn="span 1">
                  <s-box className="summary-card" style={{ height: "100%" }}>
                    <s-stack gap="extra-tight">
                      <s-text className="card-label" tone="subdued" style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", color: "#6b7280" }}>Category</s-text>
                      <s-box>
                        <s-text className={`category-badge ${selectedSubmission.category}`}>
                          {selectedSubmission.category === "b2b" ? "B2B" : "Custom"}
                        </s-text>
                      </s-box>
                    </s-stack>
                  </s-box>
                </s-grid-item>
                <s-grid-item gridColumn="span 1">
                  <s-box className="summary-card" style={{ height: "100%" }}>
                    <s-stack gap="extra-tight">
                      <s-text className="card-label" tone="subdued" style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", color: "#6b7280" }}>Submitted At</s-text>
                      <s-text className="card-value" fontWeight="semibold">
                        {new Date(selectedSubmission.submittedAt).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </s-text>
                    </s-stack>
                  </s-box>
                </s-grid-item>
                <s-grid-item gridColumn="span 1">
                  <s-box className="summary-card" style={{ height: "100%" }}>
                    <s-stack gap="extra-tight">
                      <s-text className="card-label" tone="subdued" style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", color: "#6b7280" }}>Status</s-text>
                      <s-box>
                        <s-text className="status-badge">{selectedSubmission.status}</s-text>
                      </s-box>
                    </s-stack>
                  </s-box>
                </s-grid-item>
              </s-grid>

              <s-divider />

              <s-stack gap="base">
                <s-text fontWeight="bold" tone="subdued">Submitted Values</s-text>
                <s-grid gridTemplateColumns="repeat(2, 1fr)" gap="base">
                  {Object.entries(selectedSubmission.payload).map(
                    ([key, value]) => (
                      <s-grid-item key={key} gridColumn="span 1">
                        <s-box className="payload-item" style={{ height: "100%", padding: "12px", border: "1px solid #f3f4f6", borderRadius: "8px", background: "#fff" }}>
                          <s-stack gap="extra-tight">
                            <s-text className="payload-key" tone="subdued" style={{ fontSize: "12px", fontWeight: "600", color: "#4b5563" }}>{key}</s-text>
                            <s-text className="payload-value" fontWeight="semibold" style={{ fontSize: "14px", color: "#111827", lineHeight: "1.5" }}>
                              {typeof value === "object" ? JSON.stringify(value, null, 2) : String(value)}
                            </s-text>
                          </s-stack>
                        </s-box>
                      </s-grid-item>
                    ),
                  )}
                </s-grid>
              </s-stack>

              {selectedSubmission.category === "b2b" && selectedSubmission.status === "Pending" && (
                <>
                  <s-divider />
                  <s-box className="b2b-action-panel" style={{ padding: "16px", border: "1px dashed #e5e7eb", borderRadius: "12px", background: "#fbfbfb" }}>
                    <s-stack gap="base">
                      <s-box className="b2b-action-title-box">
                        <s-text fontWeight="bold" tone="warning">B2B Onboarding Approval</s-text>
                      </s-box>
                      <s-stack direction="inline" gap="base">
                        <s-button
                          className={` ${isAccepting ? "disabled" : ""}`}
                          disabled={isAccepting}
                          onClick={() => {
                            if (fetcher.state !== "idle") return;
                            handleAccept(selectedSubmission);
                          }}
                        >
                          {isAccepting ? "Accepting..." : "Accept & Create Company"}
                        </s-button>
                        <s-button
                          className={` ${isRejecting ? "disabled" : ""}`}
                          disabled={isRejecting}
                          onClick={() => {
                            if (fetcher.state !== "idle") return;
                            handleReject(selectedSubmission);
                          }}
                        >
                          {isRejecting ? "Rejecting..." : "Reject Application"}
                        </s-button>
                      </s-stack>
                      {fetcher.data?.error && (
                        <s-box className="b2b-error">
                          ⚠ {fetcher.data.error}
                        </s-box>
                      )}
                    </s-stack>
                  </s-box>
                </>
              )}
            </s-stack>
          )}
          <s-button slot="secondary-actions" commandFor="details-modal" command="--hide">
            Close
          </s-button>
        </s-modal>

      </s-section>
    </s-page>
  );
};

export default Submissions;
