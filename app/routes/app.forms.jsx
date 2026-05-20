import { useNavigate } from "react-router"

const Forms = () => {
    const navigate = useNavigate();
    return (
        <s-page heading="Forms" >


            <s-stack direction="inline" justifyContent="space-between" alignItems="center" padding="base none">
                <s-stack direction="inline" alignItems="center" gap="base">
                    <s-button onClick={() => navigate("/app")}>
                        <s-icon type="arrow-left" tone="warning"></s-icon>
                    </s-button>
                    <s-heading>Forms</s-heading>
                </s-stack>
                <s-button variant="primary" onClick={() => navigate("/app/template")}>Create Form</s-button>
            </s-stack>

            <s-button-group>
                <s-button slot="secondary-actions">All</s-button>
                <s-button slot="secondary-actions">B2B</s-button>
                <s-button slot="secondary-actions" tone="critical">Custom</s-button>
            </s-button-group>
            <s-stack justifyContent="center" alignItems="center" gap="base" padding="base">
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
                    <s-stack padding="base none" gap="base" >
                        <s-heading padding="base">Ask your customers anything</s-heading>
                        <s-paragraph>Choose a template, customize, and install wherever you want.</s-paragraph>
                        <s-button variant="primary" onClick={() => navigate("/app/template")}>Create Form</s-button>

                    </s-stack>
                </s-box>
            </s-stack>

        </s-page>
    )
}

export default Forms