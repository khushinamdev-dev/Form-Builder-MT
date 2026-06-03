import { useState, useEffect } from "react";
import { useLoaderData, useOutletContext, useFetcher } from "react-router";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  let forms = [];
  let error = null;

  try {
    const response = await admin.graphql(`
      query GetFormsForTranslation {
        metaobjects(type: "$app:forms_data", first: 50, sortKey: "updated_at", reverse: true) {
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

    const json = await response.json();
    if (json.errors?.length) {
      throw new Error(json.errors.map((e) => e.message).join(", "));
    }

    const nodes = json.data?.metaobjects?.nodes || [];

    forms = nodes.map((node) => {
      const fieldsMap = (node.fields || []).reduce((acc, f) => {
        acc[f.key] = f.value;
        return acc;
      }, {});

      let config = {};
      try {
        config = JSON.parse(fieldsMap.data || "{}");
      } catch (_) { }

      return {
        id: node.id,
        formId: node.handle,
        formName: config.formName || config.headerTitle || "Untitled Form",
        headerTitle: config.headerTitle || "",
        description: config.description || "",
        footerSubmitText: config.footerSubmitText || "Submit",
        successTitle: config.successTitle || "Thanks for getting in touch!",
        successMessage: config.successMessage || "",
        formFields: config.fields || [],
        translations: config.translations || {},
      };
    });
  } catch (err) {
    error = err.message;
    console.error("Error loading forms for translation:", err);
  }

  return { forms, error };
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const formId = formData.get("formId");
  const translationsStr = formData.get("translations");

  if (!formId || !translationsStr) {
    return Response.json({ error: "Missing required parameters" }, { status: 400 });
  }

  try {
    // 1. Fetch current metaobject data to avoid wiping out config properties
    const response = await admin.graphql(
      `
      query GetFormConfigForTranslationUpdate($handle: MetaobjectHandleInput!) {
        metaobjectByHandle(handle: $handle) {
          fields {
            key
            value
          }
        }
      }
      `,
      { variables: { handle: { type: "$app:forms_data", handle: formId } } }
    );

    const json = await response.json();
    const metaobject = json.data?.metaobjectByHandle;
    if (!metaobject) {
      return Response.json({ error: "Form not found on Shopify" }, { status: 404 });
    }

    const fieldsMap = (metaobject.fields || []).reduce((acc, f) => {
      acc[f.key] = f.value;
      return acc;
    }, {});

    let config = {};
    try {
      config = JSON.parse(fieldsMap.data || "{}");
    } catch (_) { }

    // 2. Overlay new translations object
    config.translations = JSON.parse(translationsStr);

    // 3. Save back to Shopify metaobject
    const saveResponse = await admin.graphql(
      `
      mutation SaveTranslations($handle: MetaobjectHandleInput!, $metaobject: MetaobjectUpsertInput!) {
        metaobjectUpsert(handle: $handle, metaobject: $metaobject) {
          metaobject { id }
          userErrors { field message }
        }
      }
      `,
      {
        variables: {
          handle: { type: "$app:forms_data", handle: formId },
          metaobject: {
            fields: [
              { key: "data", value: JSON.stringify(config) }
            ]
          }
        }
      }
    );

    const saveJson = await saveResponse.json();
    const userErrors = saveJson.data?.metaobjectUpsert?.userErrors;
    if (userErrors?.length) {
      return Response.json({ error: userErrors.map((e) => e.message).join(", ") }, { status: 400 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Action translation save error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
};

export default function Translation() {
  const { forms, error } = useLoaderData();
  const { shopLocales } = useOutletContext();
  const fetcher = useFetcher();

  // Pick target locales (non-primary ones)
  const targetLocales = shopLocales.filter((l) => !l.primary) || [];
  const primaryLocale = shopLocales.find((l) => l.primary) || { locale: "en", name: "English" };

  const [selectedLanguage, setSelectedLanguage] = useState(
    targetLocales[0]?.locale || "de"
  );

  // Selected form state
  const [selectedFormId, setSelectedFormId] = useState(() => {
    return forms && forms.length > 0 ? forms[0].formId : "";
  });
  // Maintain local translations state for in-place editing
  const [translationsMap, setTranslationsMap] = useState({});

  useEffect(() => {
    if (forms) {
      const initialMap = {};
      forms.forEach((form) => {
        initialMap[form.formId] = form.translations || {};
      });
      setTranslationsMap(initialMap);
    }
  }, [forms]);

  useEffect(() => {
    if (forms && forms.length > 0) {
      if (!forms.some((f) => f.formId === selectedFormId)) {
        setSelectedFormId(forms[0].formId);
      }
    } else {
      setSelectedFormId("");
    }
  }, [forms, selectedFormId]);

  const handleTranslationChange = (formId, key, value, fieldId = null) => {
    setTranslationsMap((prev) => {
      const formTrans = prev[formId] || {};
      const localeTrans = formTrans[selectedLanguage] || {};

      if (fieldId) {
        // Field translation
        const fieldsTrans = localeTrans.fields || {};
        const fieldTrans = fieldsTrans[fieldId] || {};
        return {
          ...prev,
          [formId]: {
            ...formTrans,
            [selectedLanguage]: {
              ...localeTrans,
              fields: {
                ...fieldsTrans,
                [fieldId]: {
                  ...fieldTrans,
                  [key]: value,
                },
              },
            },
          },
        };
      } else {
        // General form translation
        return {
          ...prev,
          [formId]: {
            ...formTrans,
            [selectedLanguage]: {
              ...localeTrans,
              [key]: value,
            },
          },
        };
      }
    });
  };

  const handleSaveTranslations = (formId) => {
    const formTrans = translationsMap[formId] || {};
    fetcher.submit(
      {
        formId,
        translations: JSON.stringify(formTrans),
      },
      { method: "post" }
    );
  };

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.success) {
        if (window.shopify && window.shopify.toast) {
          window.shopify.toast.show("Translations saved successfully!");
        } else {
          alert("Translations saved successfully!");
        }
      } else if (fetcher.data.error) {
        alert("Failed to save: " + fetcher.data.error);
      }
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <s-page heading="Translation">
      <s-stack padding="base none" gap="large">
        {/* Language selector mapping header */}
        <s-stack direction="inline" alignItems="center" gap="large">
          <s-stack direction="inline" alignItems="center" gap="small">
            <s-stack direction="inline" alignItems="center" justifyContent="space-between" gap="small">
              <s-heading>{primaryLocale.name}  </s-heading>
              <s-badge tone="success"> Primary</s-badge>
            </s-stack>
            <s-icon type="arrow-right" />

            <s-stack inlineSize="200px">
              <s-select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                {targetLocales.map((locale) => (
                  <s-option key={locale.locale} value={locale.locale}>
                    {locale.name} ({locale.locale.toUpperCase()})
                  </s-option>
                ))}
              </s-select>
            </s-stack>
          </s-stack>
        </s-stack>

        {/* Form Selector Buttons */}
        {forms.length > 0 && (
          <s-stack direction="inline" gap="small">
            {forms.map((form) => (
              <s-button
                key={form.formId}
                variant={selectedFormId === form.formId ? "primary" : "secondary"}
                onClick={() => setSelectedFormId(form.formId)}
              >
                {form.formName}
              </s-button>
            ))}
          </s-stack>
        )}
      </s-stack>

      {error && <s-text tone="critical">⚠ {error}</s-text>}

      <s-stack gap="base" style={{ marginTop: "16px" }}>
        {forms.length === 0 ? (
          <s-section>
            <s-stack justifyContent="center" alignItems="center" padding="large">
              <s-heading level="3">No forms found to translate</s-heading>
              <s-paragraph>Create a form first from the Forms dashboard.</s-paragraph>
            </s-stack>
          </s-section>
        ) : (
          (() => {
            const form = forms.find((f) => f.formId === selectedFormId) || forms[0];
            if (!form) return null;

            const trans = translationsMap[form.formId]?.[selectedLanguage] || {};
            const isSaving = fetcher.state !== "idle" && fetcher.formData?.get("formId") === form.formId;

            return (
              <s-section padding="none" key={form.formId}>
                <s-box padding="base">
                  <s-stack gap="large">
                    {/* Form-level content */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      {/* Row 1: Title */}
                      <s-grid gridTemplateColumns="repeat(12, 1fr)" gap="base" alignItems="center">
                        <s-grid-item gridColumn="span 5">
                          <s-text-field label="Title" value={form.formName} disabled />
                        </s-grid-item>
                        <s-grid-item gridColumn="span 2">
                          <s-icon type="arrow-right" />
                        </s-grid-item>
                        <s-grid-item gridColumn="span 5">
                          <s-text-field
                            label="Title"
                            value={trans.formName || ""}
                            onChange={(e) => handleTranslationChange(form.formId, "formName", e.currentTarget.value)}
                          />
                        </s-grid-item>
                      </s-grid>

                      <s-grid gridTemplateColumns="repeat(12, 1fr)" gap="base" alignItems="center">
                        <s-grid-item gridColumn="span 5">
                          <s-text-area label="Description" value={form.description} disabled rows={2}></s-text-area>
                        </s-grid-item>
                        <s-grid-item gridColumn="span 2" style={{ textAlign: "center" }}>
                          <s-icon type="arrow-right" />
                        </s-grid-item>
                        <s-grid-item gridColumn="span 5">
                          <s-text-area
                            label="Description"
                            value={trans.description || ""}
                            onChange={(e) => handleTranslationChange(form.formId, "description", e.currentTarget.value)}
                            rows={2}
                          ></s-text-area>
                        </s-grid-item>
                      </s-grid>

                      {/* Row 3: Submit Button */}
                      <s-grid gridTemplateColumns="repeat(12, 1fr)" gap="base" alignItems="center">
                        <s-grid-item gridColumn="span 5">
                          <s-text-field label="Submit button" value={form.footerSubmitText} disabled />
                        </s-grid-item>
                        <s-grid-item gridColumn="span 2" style={{ textAlign: "center" }}>
                          <s-icon type="arrow-right" />
                        </s-grid-item>
                        <s-grid-item gridColumn="span 5">
                          <s-text-field
                            label="Submit button"
                            value={trans.footerSubmitText || ""}
                            onChange={(e) => handleTranslationChange(form.formId, "footerSubmitText", e.currentTarget.value)}
                          />
                        </s-grid-item>
                      </s-grid>

                      <s-grid gridTemplateColumns="repeat(12, 1fr)" gap="base" alignItems="center">
                        <s-grid-item gridColumn="span 5">
                          <s-text-area label="Success message" value={form.successMessage || form.successTitle} disabled rows={2}></s-text-area>
                        </s-grid-item>
                        <s-grid-item gridColumn="span 2" style={{ textAlign: "center" }}>
                          <s-icon type="arrow-right" />
                        </s-grid-item>
                        <s-grid-item gridColumn="span 5">
                          <s-text-area
                            label="Success message"
                            value={trans.successMessage || trans.successTitle || ""}
                            onChange={(e) => handleTranslationChange(form.formId, "successMessage", e.currentTarget.value)}
                            rows={2}
                          ></s-text-area>
                        </s-grid-item>
                      </s-grid>
                    </div>

                    {/* Form Fields Section */}
                    {form.formFields.length > 0 && (
                      <s-stack gap="base" style={{ marginTop: "24px" }}>
                        <s-heading level="4" style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#6d7175" }}>
                          Form fields
                        </s-heading>

                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                          {form.formFields
                            .filter((f) => f.type !== "heading" && f.type !== "paragraph" && f.type !== "divider")
                            .map((field) => {
                              const fieldTrans = trans.fields?.[field.id] || {};
                              return (
                                <div key={field.id} style={{ padding: "12px", border: "1px solid #f1f2f4", borderRadius: "8px", background: "#fcfcfc" }}>
                                  <s-grid gridTemplateColumns="repeat(12, 1fr)" gap="base" alignItems="center">
                                    {/* Left Original */}
                                    <s-grid-item gridColumn="span 5">
                                      <s-stack gap="small">
                                        <s-text-field label="Label" value={field.label} disabled />
                                        {field.placeholder && <s-text-field label="Placeholder" value={field.placeholder} disabled />}
                                      </s-stack>
                                    </s-grid-item>

                                    {/* Middle Indicator */}
                                    <s-grid-item gridColumn="span 2" style={{ textAlign: "center" }}>
                                      <s-icon type="arrow-right" />
                                    </s-grid-item>

                                    {/* Right Translation */}
                                    <s-grid-item gridColumn="span 5">
                                      <s-stack gap="small">
                                        <s-text-field
                                          label="Label"
                                          value={fieldTrans.label || ""}
                                          onChange={(e) => handleTranslationChange(form.formId, "label", e.currentTarget.value, field.id)}
                                        />
                                        {field.placeholder && (
                                          <s-text-field
                                            label="Placeholder "
                                            value={fieldTrans.placeholder || ""}
                                            onChange={(e) => handleTranslationChange(form.formId, "placeholder", e.currentTarget.value, field.id)}
                                          />
                                        )}
                                      </s-stack>
                                    </s-grid-item>
                                  </s-grid>
                                </div>
                              );
                            })}
                        </div>
                      </s-stack>
                    )}

                    {/* Action Save Button */}
                    <s-stack direction="inline" justifyContent="flex-end" style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid #e1e3e5" }}>
                      <s-button
                        variant="primary"
                        onClick={() => handleSaveTranslations(form.formId)}
                        disabled={isSaving}
                      >
                        {isSaving ? "Saving..." : "Save Translations"}
                      </s-button>
                    </s-stack>
                  </s-stack>
                </s-box>
              </s-section>
            );
          })()
        )}
      </s-stack>
    </s-page>
  );
}
