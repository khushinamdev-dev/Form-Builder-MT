import { useLoaderData, useNavigate } from "react-router";
import { authenticate } from "../shopify.server";

export const loader = async ({ request, params }) => {
    const { admin } = await authenticate.admin(request);
    const { formId } = params;

    // Read formTitle from query param (passed via redirect from action)
    const url = new URL(request.url);
    const formTitle = url.searchParams.get("title") || "Untitled Form";

    let metaobject = null;
    let savedFields = [];

    try {
        const isGid = formId.startsWith("gid://");

        const response = await admin.graphql(
            isGid
                ? `
            query GetFormMetaobjectById($id: ID!) {
                metaobject(id: $id) {
                    id
                    handle
                    type
                    fields {
                        key
                        value
                    }
                }
            }
        `
                : `
            query GetFormMetaobjectByHandle($handle: MetaobjectHandleInput!) {
                metaobjectByHandle(handle: $handle) {
                    id
                    handle
                    type
                    fields {
                        key
                        value
                    }
                }
            }
        `,
            {
                variables: isGid
                    ? { id: formId }
                    : { handle: { type: "$app:forms_data", handle: formId } },
            }
        );

        const json = await response.json();
        metaobject = isGid
            ? json.data?.metaobject || null
            : json.data?.metaobjectByHandle || null;

        if (metaobject) {
            const bioField = metaobject.fields.find(f => f.key === "data");
            if (bioField?.value) {
                try {
                    const parsed = JSON.parse(bioField.value);
                    savedFields = parsed.fields || [];
                } catch (_) { }
            }
        }
    } catch (err) {
        console.error("Error fetching metaobject:", err);
    }

    return { formId, formTitle, metaobject, savedFields };
};

export default function FormPublished() {
    const { formId, formTitle, metaobject, savedFields } = useLoaderData();
    const navigate = useNavigate();

    const publishedAt = new Date().toLocaleString("en-US", {
        dateStyle: "long",
        timeStyle: "short",
    });

    const getField = (key) => metaobject?.fields?.find(f => f.key === key)?.value || "—";

    const handleCopy = () => {
        navigator.clipboard.writeText(formId);
    };

    return (
        <s-page>
            <s-stack direction="inline" alignItems="center" gap="base" padding="base none">
                <s-button onClick={() => navigate(-1)}>
                    <s-icon type="arrow-left"></s-icon>
                </s-button>
            </s-stack>

            {/* Hero Section */}
            <s-section>
                <s-stack justifyContent="center" alignItems="center" gap="base">
                    <s-box>
                        <s-icon type="check-circle" />
                    </s-box>
                    <s-heading level="1">
                        Form Saved & Published!
                    </s-heading>
                    <s-text>
                        <s-text>{formTitle}</s-text> has been successfully saved in your store and is now live.
                    </s-text>
                </s-stack>
            </s-section>

            <s-grid gridTemplateColumns="repeat(12, 1fr)" gap="base">

                {/* Unique ID Card */}
                <s-grid-item gridColumn="span 6">
                    <s-section>
                        <s-stack gap="base">
                            <s-stack gap="small">
                                <s-stack direction="inline" alignItems="center" gap="small">
                                    <s-box>
                                        <s-icon type="link" />
                                    </s-box>
                                    <s-heading level="2">Unique Form ID</s-heading>
                                </s-stack>

                                <s-stack direction="inline" alignItems="center" padding="large none" gap="large">
                                    <s-text tone="success" color="subdued" >
                                        {formId}
                                    </s-text>
                                    <s-button onClick={handleCopy} title="Copy ID" variant="primary">
                                        Copy
                                    </s-button>

                                </s-stack>

                                <s-text>
                                    Use this ID to uniquely identify your form  and render it live on your theme storefront.
                                </s-text>
                            </s-stack>
                        </s-stack>
                    </s-section>
                </s-grid-item>

                {/* Storefront Integration Card */}
                <s-grid-item gridColumn="span 6">
                    <s-section>
                        <s-stack gap="base">
                            <s-stack direction="inline" alignItems="center" gap="small">
                                <s-box>
                                    <s-icon type="settings" />
                                </s-box>
                                <s-heading level="2">Show on your storefront</s-heading>
                            </s-stack>
                            <s-stack gap="small">
                                {[
                                    "Online Store → Customize theme",
                                    "Add block → Form Builder",
                                    "Paste this Form ID into the block setting",
                                    "Save the theme"
                                ].map((text, idx) => (
                                    <s-stack key={idx} direction="inline" alignItems="center" gap="small">
                                        <s-box>
                                            {idx + 1}
                                        </s-box>
                                        <s-text>
                                            {text}
                                        </s-text>
                                    </s-stack>
                                ))}
                            </s-stack>
                        </s-stack>
                    </s-section>
                </s-grid-item>

                {/* Next Steps Section */}
                <s-grid-item gridColumn="span 12">
                    <s-box>
                        <s-stack direction="inline" alignItems="center" padding="none none base none" >
                            <s-heading level="3">
                                What's next?
                            </s-heading>
                        </s-stack>
                        <s-grid gridTemplateColumns="repeat(3, 1fr)" gap="base">
                            {[
                                { title: "Embed on Storefront", desc: "Use your form ID to embed this form on any page via the theme extension block." },
                                { title: "View Submissions", desc: "Track incoming responses directly from the Submissions tab in the dashboard." },
                                { title: "Configure Automations", desc: "Set up email notifications or approval flows from the form settings." },
                            ].map(({ icon, title, desc }) => (
                                <s-grid-item key={title} gridColumn="span 1">
                                    <s-section>
                                        <s-stack gap="small">

                                            <s-heading level="3">
                                                {title}
                                            </s-heading>
                                            <s-text>
                                                {desc}
                                            </s-text>
                                        </s-stack>
                                    </s-section>
                                </s-grid-item>
                            ))}
                        </s-grid>
                    </s-box>
                </s-grid-item>

                {/* Actions Footer */}
                <s-grid-item gridColumn="span 12">
                    <s-stack direction="inline" gap="base">
                        <s-button variant="primary" onClick={() => navigate("/app/submissions")}>View Submissions</s-button>
                        <s-button onClick={() => navigate("/app/forms")}>Back to Forms</s-button>
                    </s-stack>
                </s-grid-item>

            </s-grid>
        </s-page>
    );
}
