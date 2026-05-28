import { useNavigate } from "react-router";

let CreateForm = () => {
    const navigate = useNavigate();
    return (
        <s-page>
            <style>{`
                .create-form-container {
                    
                    padding: 0 20px;
                    font-family: 'Inter', sans-serif;
                    display: block;
                }

                .header-section {
                    text-align: center;
                    margin-bottom: 48px;
                    animation: fadeInUp 0.6s ease-out;
                }

                .header-subtitle {
                    font-size: 16px;
                    color: #6d7175;
                    margin-top: 8px;
                    font-weight: 400;
                    display: block;
                }

                .cards-grid {
                    margin-top: 24px;
                }

                .choice-card {
                    background: #ffffff;
                    border: 1px solid #e1e3e5;
                    border-radius: 24px;
                    padding: 26px 26px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
                    position: relative;
                    overflow: hidden;
                    // height: 500px;
                    box-sizing: border-box;
                    animation: fadeInUp 0.8s ease-out;
                }

                .choice-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 6px;
                    // background: linear-gradient(90deg, #008060 0%, #00a877 100%);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                // .choice-card:first-child::before {
                //     background: linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%);
                // }

                // .choice-card:hover {
                //     transform: translateY(-8px);
                //     box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
                //     border-color: #bbc3c9;
                // }

                .choice-card:hover::before {
                    opacity: 1;
                }

                /* Custom Visual Mockups */
                .visual-container {
                    width: 100%;
                    height: 180px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 24px;
                    position: relative;
                }

                /* Scratch Visual (Magic Wand / Blank Grid) */
                .scratch-visual {
                    width: 140px;
                    height: 140px;
                    background: radial-gradient(circle at top left, #f9fafb 0%, #f3f4f6 100%);
                    border-radius: 20px;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid #e5e7eb;
                    box-shadow: 0 8px 20px rgba(0,0,0,0.03);
                    transition: transform 0.4s ease;
                    z-index: 1;
                }

                .choice-card:hover .scratch-visual {
                    transform: scale(1.05) rotate(-2deg);
                }

                .scratch-plus-icon {
                    font-size: 54px;
                    font-weight: 200;
                    color: #4f46e5;
                    animation: pulse 2s infinite;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .scratch-glow {
                    position: absolute;
                    width: 120px;
                    height: 120px;
                    background: rgba(79, 70, 229, 0.12);
                    filter: blur(25px);
                    border-radius: 50%;
                    z-index: 0;
                    display: block;
                }

                /* Template Visual (Overlapping Cards) */
                .template-visual {
                    width: 160px;
                    height: 140px;
                    position: relative;
                    display: block;
                }

                .template-layer {
                    width: 100px;
                    height: 100px;
                    background: #ffffff;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    position: absolute;
                    box-shadow: 0 8px 16px rgba(0,0,0,0.04);
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    display: flex;
                    flex-direction: column;
                    padding: 10px;
                    box-sizing: border-box;
                    gap: 6px;
                }

                .template-layer-1 {
                    top: 25px;
                    left: 5px;
                    z-index: 1;
                    transform: rotate(-8deg);
                    background: #f9fafb;
                }

                .template-layer-2 {
                    top: 10px;
                    left: 30px;
                    z-index: 2;
                    transform: rotate(2deg);
                    border-color: #008060;
                }

                .template-layer-3 {
                    top: 25px;
                    left: 55px;
                    z-index: 3;
                    transform: rotate(10deg);
                    background: #f3f4f6;
                }

                .choice-card:hover .template-layer-2 {
                    transform: translateY(-8px) scale(1.04) rotate(0deg);
                    box-shadow: 0 15px 30px rgba(0, 128, 96, 0.08);
                }

                .choice-card:hover .template-layer-1 {
                    transform: translateX(-6px) rotate(-14deg);
                }

                .choice-card:hover .template-layer-3 {
                    transform: translateX(6px) rotate(16deg);
                }

                /* Layer mock form lines */
                .mock-line {
                    height: 6px;
                    background: #e5e7eb;
                    border-radius: 4px;
                    width: 100%;
                    display: block;
                }

                .mock-line.short {
                    width: 60%;
                }

                .mock-line.accent {
                    background: rgba(0, 128, 96, 0.2);
                }

                .template-layer-2 .mock-line.accent {
                    background: #008060;
                    opacity: 0.7;
                }

                .choice-text-container {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    margin-bottom: 24px;
                }

                .choice-title {
                    font-size: 20px;
                    font-weight: 600;
                    color: #202223;
                    margin: 0;
                    display: block;
                }

                .choice-desc {
                    font-size: 14px;
                    color: #6d7175;
                    line-height: 1.5;
                    margin: 0;
                    max-width: 280px;
                    display: block;
                }

                .action-btn {
                    width: 100%;
                    height: 46px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .choice-card:first-child .action-btn::part(button) {
                    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
                    border: none;
                    color: #ffffff;
                    border-radius: 23px;
                    font-weight: 600;
                    box-shadow: 0 4px 10px rgba(79, 70, 229, 0.2);
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .choice-card:first-child:hover .action-btn::part(button) {
                    background: linear-gradient(135deg, #4338ca 0%, #6d28d9 100%);
                    transform: scale(1.02);
                    box-shadow: 0 6px 15px rgba(79, 70, 229, 0.3);
                }

                .choice-card:last-child .action-btn::part(button) {
                    background: linear-gradient(135deg, #008060 0%, #00a877 100%);
                    border: none;
                    color: #ffffff;
                    border-radius: 23px;
                    font-weight: 600;
                    box-shadow: 0 4px 10px rgba(0, 128, 96, 0.2);
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .choice-card:last-child:hover .action-btn::part(button) {
                    background: linear-gradient(135deg, #006e52 0%, #009669 100%);
                    transform: scale(1.02);
                    box-shadow: 0 6px 15px rgba(0, 128, 96, 0.3);
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes pulse {
                    0%, 100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                    50% {
                        transform: scale(1.1);
                        opacity: 0.8;
                    }
                }
            `}</style>

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