/**
 * Utility functions for managing Shopify Metaobject Definitions.
 * These functions ensure that necessary metaobject definitions exist in the store.
 */

/**
 * Generic function to ensure a metaobject definition exists.
 * @param {function} admin - The authenticated admin GraphQL client.
 * @param {object} definitionConfig - Configuration for the metaobject definition.
 * @returns {Promise<object|null>} The created or existing metaobject definition, or null if an error occurred.
 */
async function ensureMetaobjectDefinition(admin, definitionConfig) {
  const { name, type, access, fieldDefinitions } = definitionConfig;

  try {
    // 1. Check if the definition already exists
    const checkResponse = await admin.graphql(
      `
            query GetMetaobjectDefinitionByType($type: String!) {
                metaobjectDefinitionByType(type: $type) {
                    id
                    name
                    type
                }
            }
        `,
      { variables: { type } },
    );

    const checkJson = await checkResponse.json();
    if (checkJson.data?.metaobjectDefinitionByType) {
      console.log(`Metaobject Definition '${name}' (${type}) already exists.`);
      return checkJson.data.metaobjectDefinitionByType;
    }

    // 2. If it doesn't exist, create it
    const createResponse = await admin.graphql(
      `
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
        `,
      {
        variables: {
          definition: {
            name,
            type,
            access,
            fieldDefinitions,
          },
        },
      },
    );

    const createJson = await createResponse.json();
    const userErrors = createJson.data?.metaobjectDefinitionCreate?.userErrors;
    if (userErrors?.length) {
      console.error(
        `Error creating Metaobject Definition '${name}': ${userErrors.map((e) => e.message).join(", ")}`,
      );
      return null;
    }

    console.log(
      `Metaobject Definition '${name}' (${type}) created successfully.`,
    );
    return createJson.data?.metaobjectDefinitionCreate?.metaobjectDefinition;
  } catch (error) {
    console.error(`Failed to ensure Metaobject Definition '${name}':`, error);
    return null;
  }
}

export async function ensureProfileMetaobjectDefinition(admin) {
  const profileDefinitionConfig = {
    name: "Profile",
    type: "$app:profile",
    access: {
      admin: "MERCHANT_READ_WRITE",
      storefront: "PUBLIC_READ",
    },
    fieldDefinitions: [
      { name: "Full Name", key: "full_name", type: "single_line_text_field" },
      { name: "Email", key: "email", type: "single_line_text_field" },
      { name: "Role", key: "role", type: "single_line_text_field" },
      { name: "Bio", key: "bio", type: "multi_line_text_field" },
      { name: "Active", key: "active", type: "boolean" },
      { name: "Rating", key: "rating", type: "number_integer" },
    ],
  };
  return ensureMetaobjectDefinition(admin, profileDefinitionConfig);
}

export async function ensureSubmissionMetaobjectDefinition(admin) {
  const submissionDefinitionConfig = {
    name: "Submission Forms",
    type: "$app:submissions",
    access: { admin: "MERCHANT_READ_WRITE", storefront: "PUBLIC_READ" },
    fieldDefinitions: [
      { name: "Form ID", key: "form_id", type: "single_line_text_field" },
      { name: "Form Name", key: "form_name", type: "single_line_text_field" },
      {
        name: "Customer Name",
        key: "customer_name",
        type: "single_line_text_field",
      },
      { name: "Category", key: "category", type: "single_line_text_field" },
      { name: "Status", key: "status", type: "single_line_text_field" },
      { name: "Payload", key: "payload", type: "multi_line_text_field" },
    ],
  };
  return ensureMetaobjectDefinition(admin, submissionDefinitionConfig);
}
