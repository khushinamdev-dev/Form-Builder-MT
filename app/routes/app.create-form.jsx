import { useNavigate } from "react-router";

let CreateForm = () => {
    const navigate = useNavigate();
    return (
        <s-page>
            <s-stack
                direction="inline"
                alignItems="center"
                gap="base"
                padding="base none"
            >
                <s-button onClick={() => navigate("/app/forms")}>
                    <s-icon type="arrow-left"> </s-icon>
                </s-button>
                <s-heading>Create Form</s-heading>
            </s-stack>

            <s-box padding="none" className="create-form-container">
                <s-stack padding="none none base none" className="header-section" justifyContent="center" alignItems="center" gap="small">
                    <s-heading level="1">How would you like to start?</s-heading>
                    <s-text className="header-subtitle">Choose between building from a clean slate or using a curated template layout</s-text>
                </s-stack>

                <s-grid gridTemplateColumns="repeat(12, 1fr)" gap="base" className="cards-grid">
                    {/* Scratch Card */}
                    <s-grid-item gridColumn="span 6">
                        <s-section onClick={() => navigate("/app/scratch")}>
                            <s-stack inlineSize="280px" justifyContent="center" alignItems="center" >
                                <s-image
                                    src="/Start_from_scratch.png"
                                    alt="Start From Scratch"
                                    objectFit="contain"
                                ></s-image>
                            </s-stack>
                            <s-stack gap="small">
                                <s-heading level="3" >Start From Scratch</s-heading>
                                <s-text >Create fully custom forms, layouts, or workflows completely from the ground up.</s-text>
                            </s-stack>
                            <s-button className="action-btn" variant="primary">
                                Create Form
                            </s-button>
                        </s-section>
                    </s-grid-item>

                    {/* Template Card */}
                    <s-grid-item gridColumn="span 6">
                        <s-section onClick={() => navigate("/app/template")}>
                            <s-stack inlineSize="280px" justifyContent="center" alignItems="center" >

                                <s-image
                                    src="/Create_From_template.png"
                                    alt="Create From Template"
                                    objectFit="contain"
                                ></s-image>
                            </s-stack>
                            <s-stack gap="small">
                                <s-heading level="3" >Create From Template</s-heading>
                                <s-text >Jumpstart your workflow with a professional, pre-built template layout.</s-text>
                            </s-stack>
                            <s-button className="action-btn" variant="primary">
                                Select Template
                            </s-button>
                        </s-section>
                    </s-grid-item>
                </s-grid>
            </s-box>
        </s-page>
    )
}

export default CreateForm;