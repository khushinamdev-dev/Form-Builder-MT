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
                        <s-section className="choice-card" onClick={() => navigate("/app/scratch")}>
                            <s-box className="visual-container">
                                <s-box className="scratch-glow"></s-box>
                                <s-box className="scratch-visual">
                                    <s-text className="scratch-plus-icon">+</s-text>
                                </s-box>
                            </s-box>
                            <s-stack className="choice-text-container" gap="small">
                                <s-heading level="3" className="choice-title">Start From Scratch</s-heading>
                                <s-text className="choice-desc">Create fully custom forms, layouts, or workflows completely from the ground up.</s-text>
                            </s-stack>
                            <s-button className="action-btn" variant="primary">
                                Create Form
                            </s-button>
                        </s-section>
                    </s-grid-item>

                    {/* Template Card */}
                    <s-grid-item gridColumn="span 6">
                        <s-section className="choice-card" onClick={() => navigate("/app/template")}>
                            <s-box className="visual-container">
                                <s-box className="template-visual">
                                    {/* Layer 1 */}
                                    <s-box className="template-layer template-layer-1">
                                        <s-box className="mock-line"></s-box>
                                        <s-box className="mock-line short"></s-box>
                                        <s-box className="mock-line accent"></s-box>
                                    </s-box>
                                    {/* Layer 2 */}
                                    <s-box className="template-layer template-layer-2">
                                        <s-box className="mock-line accent"></s-box>
                                        <s-box className="mock-line"></s-box>
                                        <s-box className="mock-line short"></s-box>
                                    </s-box>
                                    {/* Layer 3 */}
                                    <s-box className="template-layer template-layer-3">
                                        <s-box className="mock-line"></s-box>
                                        <s-box className="mock-line short"></s-box>
                                        <s-box className="mock-line accent"></s-box>
                                    </s-box>
                                </s-box>
                            </s-box>
                            <s-stack className="choice-text-container" gap="small">
                                <s-heading level="3" className="choice-title">Create From Template</s-heading>
                                <s-text className="choice-desc">Jumpstart your workflow with a professional, pre-built template layout.</s-text>
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