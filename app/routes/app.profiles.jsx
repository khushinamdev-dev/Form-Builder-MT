import { useLoaderData, useActionData, Form, useNavigation } from "react-router";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  let definition = null;
  let profiles = [];
  let error = null;

  try {
    // 1. Fetch the Profile Metaobject Definition
    const defResponse = await admin.graphql(`
      query GetProfileDefinition {
        metaobjectDefinitionByType(type: "$app:profile") {
          id
          name
          type
          fieldDefinitions {
            name
            key
            type {
              name
            }
          }
        }
      }
    `);
    const defData = await defResponse.json();
    definition = defData.data?.metaobjectDefinitionByType || null;

    // 2. Fetch current Metaobject entries if definition exists
    if (definition) {
      const profilesResponse = await admin.graphql(`
        query GetProfiles {
          metaobjects(type: "$app:profile", first: 50) {
            nodes {
              id
              handle
              fields {
                key
                value
              }
            }
          }
        }
      `);
      const profilesData = await profilesResponse.json();
      profiles = profilesData.data?.metaobjects?.nodes || [];
    }
  } catch (err) {
    error = err.message;
  }

  return { definition, profiles, error };
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  try {
    if (intent === "create_definition") {
      const variables = {
        definition: {
          name: "Profile",
          type: "$app:profile",
          access: {
            admin: "MERCHANT_READ_WRITE",
            storefront: "PUBLIC_READ",
          },
          fieldDefinitions: [
            {
              name: "Full Name",
              key: "full_name",
              type: "single_line_text_field"
            },
            {
              name: "Email",
              key: "email",
              type: "single_line_text_field"
            },
            {
              name: "Role",
              key: "role",
              type: "single_line_text_field"
            },
            {
              name: "Bio",
              key: "bio",
              type: "multi_line_text_field"
            },
            {
              name: "Active",
              key: "active",
              type: "boolean"
            },
            {
              name: "Rating",
              key: "rating",
              type: "number_integer"
            }
          ]
        }
      };

      console.log("Creating Metaobject Definition with variables:", JSON.stringify(variables, null, 2));

      const response = await admin.graphql(`
        mutation CreateMetaobjectDefinition($definition: MetaobjectDefinitionCreateInput!) {
          metaobjectDefinitionCreate(definition: $definition) {
            metaobjectDefinition {
              id
              name
              type
            }
            userErrors {
              field
              message
              code
            }
          }
        }
      `, {
        variables
      });

      const json = await response.json();
      console.log("Create Metaobject Response JSON:", JSON.stringify(json, null, 2));

      const userErrors = json.data?.metaobjectDefinitionCreate?.userErrors;
      if (userErrors && userErrors.length > 0) {
        return { error: `Errors creating definition: ${userErrors.map(e => e.message).join(", ")}` };
      }
      return { success: "Profile Metaobject definition created successfully!" };
    }

    if (intent === "seed_data") {
      const profiles = [
        {
          handle: 'profile-john-doe',
          full_name: 'John Doe',
          email: 'john@example.com',
          role: 'Manager',
          bio: 'Leads the sales team.',
          active: 'true',
          rating: '5',
        },
        {
          handle: 'profile-jane-smith',
          full_name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'Developer',
          bio: 'Backend specialist.',
          active: 'true',
          rating: '4',
        },
        {
          handle: 'profile-alex-lee',
          full_name: 'Alex Lee',
          email: 'alex@example.com',
          role: 'Designer',
          bio: 'Works on UX/UI.',
          active: 'false',
          rating: '3',
        },
        {
          handle: 'profile-maria-garcia',
          full_name: 'Maria Garcia',
          email: 'maria@example.com',
          role: 'Support',
          bio: 'Customer support lead.',
          active: 'true',
          rating: '5',
        },
      ];

      const created = [];
      for (const profile of profiles) {
        const response = await admin.graphql(`
          mutation UpsertProfile(
            $handle: MetaobjectHandleInput!
            $metaobject: MetaobjectUpsertInput!
          ) {
            metaobjectUpsert(handle: $handle, metaobject: $metaobject) {
              metaobject {
                id
                type
                handle
              }
              userErrors {
                field
                message
              }
            }
          }
        `, {
          variables: {
            handle: {
              type: '$app:profile',
              handle: profile.handle,
            },
            metaobject: {
              fields: [
                { key: 'full_name', value: profile.full_name },
                { key: 'email', value: profile.email },
                { key: 'role', value: profile.role },
                { key: 'bio', value: profile.bio },
                { key: 'active', value: profile.active },
                { key: 'rating', value: profile.rating },
              ],
            },
          }
        });

        const json = await response.json();
        const userErrors = json.data?.metaobjectUpsert?.userErrors;
        if (userErrors && userErrors.length > 0) {
          return { error: `Errors seeding profile ${profile.full_name}: ${userErrors.map(e => e.message).join(", ")}` };
        }
        created.push(json.data.metaobjectUpsert.metaobject);
      }

      return { success: `Successfully seeded ${created.length} dummy profiles!` };
    }

    if (intent === "delete_all") {
      // 1. Fetch current metaobjects
      const fetchResponse = await admin.graphql(`
        query GetProfiles {
          metaobjects(type: "$app:profile", first: 50) {
            nodes {
              id
            }
          }
        }
      `);
      const fetchJson = await fetchResponse.json();
      const nodes = fetchJson.data?.metaobjects?.nodes || [];

      // 2. Delete each one
      for (const node of nodes) {
        await admin.graphql(`
          mutation DeleteMetaobject($id: ID!) {
            metaobjectDelete(id: $id) {
              deletedId
              userErrors {
                field
                message
              }
            }
          }
        `, {
          variables: { id: node.id }
        });
      }

      return { success: `Successfully deleted all (${nodes.length}) profile entries!` };
    }
  } catch (err) {
    return { error: err.message };
  }

  return null;
};

export default function ProfilesPage() {
  const { definition, profiles, error: loaderError } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  // Helper to extract field value from metaobject fields list
  const getFieldValue = (fields, key) => {
    const field = fields.find(f => f.key === key);
    return field ? field.value : "";
  };

  return (
    <s-page heading="Profiles Metaobjects">
      {/* Premium Gradient Header block */}
      <div style={{
        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        padding: "24px 32px",
        borderRadius: "12px",
        color: "white",
        marginBottom: "24px",
        boxShadow: "0 4px 15px rgba(16, 185, 129, 0.15)",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.08)"
        }} />
        <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "700", letterSpacing: "-0.5px" }}>Profiles Manager</h1>
        <p style={{ margin: "8px 0 0 0", fontSize: "14px", opacity: 0.9 }}>
          Configure, generate, and manage your Shopify app-owned profile metaobjects in one place.
        </p>
      </div>

      {/* Notifications block */}
      {(actionData?.success || loaderError) && (
        <div style={{
          padding: "16px 20px",
          borderRadius: "8px",
          marginBottom: "24px",
          backgroundColor: actionData?.success ? "#ecfdf5" : "#fef2f2",
          border: actionData?.success ? "1px solid #a7f3d0" : "1px solid #fecaca",
          color: actionData?.success ? "#065f46" : "#991b1b",
          fontSize: "14px",
          fontWeight: "500",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          animation: "slideDown 0.3s ease-out"
        }}>
          <span style={{ fontSize: "18px" }}>{actionData?.success ? "✓" : "⚠"}</span>
          <span>{actionData?.success || loaderError}</span>
        </div>
      )}

      {actionData?.error && (
        <div style={{
          padding: "16px 20px",
          borderRadius: "8px",
          marginBottom: "24px",
          backgroundColor: "#fef2f2",
          border: "1px solid #fecaca",
          color: "#991b1b",
          fontSize: "14px",
          fontWeight: "500",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <span style={{ fontSize: "18px" }}>⚠</span>
          <span>{actionData.error}</span>
        </div>
      )}

      {/* Grid Layout */}
      <s-grid gridTemplateColumns="repeat(12, 1fr)" gap="base">
        
        {/* Definition Status Section */}
        <s-grid-item gridColumn="span 4">
          <s-section heading="Metaobject Definition">
            <div style={{ padding: "8px 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <span style={{
                  display: "inline-block",
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: definition ? "#10b981" : "#f59e0b",
                  boxShadow: definition ? "0 0 8px #10b981" : "0 0 8px #f59e0b"
                }} />
                <span style={{ fontWeight: "600", fontSize: "15px" }}>
                  {definition ? "Definition Created" : "Definition Missing"}
                </span>
              </div>

              {!definition ? (
                <div>
                  <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: "1.5", marginBottom: "20px" }}>
                    The profile metaobject definition with type <code>$app:profile</code> needs to be created on your shop before entries can be populated.
                  </p>
                  <Form method="post">
                    <input type="hidden" name="intent" value="create_definition" />
                    <s-button variant="primary" style={{ width: "100%" }} disabled={isSubmitting}>
                      {isSubmitting ? "Creating..." : "Create Definition"}
                    </s-button>
                  </Form>
                </div>
              ) : (
                <div>
                  <div style={{ backgroundColor: "#f9fafb", borderRadius: "8px", padding: "12px 16px", marginBottom: "20px", border: "1px solid #f3f4f6" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f3f4f6", fontSize: "13px" }}>
                      <span style={{ color: "#6b7280" }}>Name:</span>
                      <span style={{ fontWeight: "600" }}>{definition.name}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f3f4f6", fontSize: "13px" }}>
                      <span style={{ color: "#6b7280" }}>Type:</span>
                      <span style={{ fontWeight: "600", fontFamily: "monospace" }}>{definition.type}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: "13px" }}>
                      <span style={{ color: "#6b7280" }}>Fields:</span>
                      <span style={{ fontWeight: "600" }}>{definition.fieldDefinitions?.length || 0} fields</span>
                    </div>
                  </div>

                  <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>Schema Fields</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {definition.fieldDefinitions?.map((field) => (
                      <div key={field.key} style={{ display: "flex", justifyContent: "space-between", backgroundColor: "#f3f4f6", padding: "8px 12px", borderRadius: "6px", fontSize: "12px" }}>
                        <span style={{ fontWeight: "600" }}>{field.name} ({field.key})</span>
                        <span style={{ color: "#6b7280", fontFamily: "monospace" }}>{field.type.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </s-section>
        </s-grid-item>

        {/* Profiles Table / Entries List */}
        <s-grid-item gridColumn="span 8">
          <s-section heading="Metaobject Entries">
            {!definition ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <span style={{ fontSize: "48px", opacity: 0.3 }}>⚙</span>
                <h3 style={{ fontSize: "16px", fontWeight: "600", marginTop: "16px" }}>Setup Required</h3>
                <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "8px" }}>
                  Please create the profile metaobject definition using the panel on the left to start seeding or viewing profiles.
                </p>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <span style={{ fontSize: "14px", color: "#6b7280" }}>
                    Total active profiles: <strong style={{ color: "#111827" }}>{profiles.length}</strong>
                  </span>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <Form method="post">
                      <input type="hidden" name="intent" value="seed_data" />
                      <s-button variant="primary" disabled={isSubmitting}>
                        {isSubmitting ? "Processing..." : "Seed Dummy Profiles"}
                      </s-button>
                    </Form>
                    {profiles.length > 0 && (
                      <Form method="post">
                        <input type="hidden" name="intent" value="delete_all" />
                        <s-button tone="critical" disabled={isSubmitting}>
                          {isSubmitting ? "Deleting..." : "Delete All"}
                        </s-button>
                      </Form>
                    )}
                  </div>
                </div>

                {profiles.length === 0 ? (
                  <div style={{
                    textAlign: "center",
                    padding: "48px 24px",
                    border: "2px dashed #e5e7eb",
                    borderRadius: "10px",
                    backgroundColor: "#f9fafb"
                  }}>
                    <span style={{ fontSize: "40px" }}>👥</span>
                    <h4 style={{ fontSize: "15px", fontWeight: "600", marginTop: "12px" }}>No Profiles Found</h4>
                    <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px", marginBottom: "20px" }}>
                      There are no profile entries in the store. Click the button below to populate the store with dummy profiles.
                    </p>
                    <Form method="post">
                      <input type="hidden" name="intent" value="seed_data" />
                      <s-button variant="primary" disabled={isSubmitting}>
                        Seed Dummy Profiles (4 Entries)
                      </s-button>
                    </Form>
                  </div>
                ) : (
                  <div style={{ overflowX: "auto", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                          <th style={{ padding: "12px 16px", fontWeight: "600", color: "#374151" }}>Full Name / Role</th>
                          <th style={{ padding: "12px 16px", fontWeight: "600", color: "#374151" }}>Email</th>
                          <th style={{ padding: "12px 16px", fontWeight: "600", color: "#374151" }}>Bio</th>
                          <th style={{ padding: "12px 16px", fontWeight: "600", color: "#374151", textAlign: "center" }}>Active</th>
                          <th style={{ padding: "12px 16px", fontWeight: "600", color: "#374151", textAlign: "center" }}>Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        {profiles.map((profile) => {
                          const fullName = getFieldValue(profile.fields, "full_name");
                          const role = getFieldValue(profile.fields, "role");
                          const email = getFieldValue(profile.fields, "email");
                          const bio = getFieldValue(profile.fields, "bio");
                          const active = getFieldValue(profile.fields, "active");
                          const rating = getFieldValue(profile.fields, "rating");

                          return (
                            <tr key={profile.id} style={{ borderBottom: "1px solid #e5e7eb", transition: "background-color 0.2s" }} className="hoverable-row">
                              <td style={{ padding: "12px 16px" }}>
                                <div style={{ fontWeight: "600", color: "#111827" }}>{fullName}</div>
                                <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px" }}>{role}</div>
                              </td>
                              <td style={{ padding: "12px 16px", color: "#4b5563" }}>{email}</td>
                              <td style={{ padding: "12px 16px", color: "#6b7280", maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={bio}>
                                {bio}
                              </td>
                              <td style={{ padding: "12px 16px", textAlign: "center" }}>
                                <span style={{
                                  display: "inline-block",
                                  padding: "2px 8px",
                                  borderRadius: "12px",
                                  fontSize: "11px",
                                  fontWeight: "600",
                                  backgroundColor: active === "true" ? "#ecfdf5" : "#f3f4f6",
                                  color: active === "true" ? "#047857" : "#4b5563"
                                }}>
                                  {active === "true" ? "Yes" : "No"}
                                </span>
                              </td>
                              <td style={{ padding: "12px 16px", textAlign: "center", fontWeight: "600" }}>
                                <span style={{ color: "#d97706" }}>★</span> {rating}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </s-section>
        </s-grid-item>

      </s-grid>

      {/* Styled components and custom animations */}
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hoverable-row:hover {
          background-color: #f9fafb;
        }
      `}</style>
    </s-page>
  );
}
