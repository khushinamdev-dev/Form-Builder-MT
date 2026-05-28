let Pricing = () => {
    return (
        <s-page heading="Select Plan" >
            <s-banner heading="Select the plan below to start your 7-day free trial (Cancel anytime)" tone="info" dismissible>
                Free trial includes unlimited access to all features.

            </s-banner>

            <s-grid gridTemplateColumns="repeat(12, 1fr)" gap="base">
                <s-grid-item gridColumn="span 4" gridRow="span 1">
                    <s-section>
                        <s-stack direction="horizontal" alignItems="center" justifyContent="center" >
                            <s-heading>Free</s-heading>
                            <s-stack direction="inline" alignItems="center" justifyContent="center" >

                                <s-heading>$0</s-heading><s-text>/month</s-text>
                            </s-stack>
                            <s-stack gap="base" padding="base" >
                                <s-button variant="primary">Choose this plan</s-button>
                            </s-stack>
                            <s-unordered-list>
                                <s-list-item>Free to use, no charge</s-list-item>
                                <s-list-item>10 fields per form</s-list-item>

                                <s-list-item>All field types (checkbox, radio, dropdown…)</s-list-item>
                                <s-list-item>Popup, Bubble or Embed Form</s-list-item>
                                <s-list-item>1 form</s-list-item>
                                <s-list-item>Unlimited submission noti via Shopify Flow</s-list-item>

                            </s-unordered-list>
                        </s-stack>
                    </s-section>
                </s-grid-item>
                <s-grid-item gridColumn="span 4" gridRow="span 1">
                    <s-section>
                        <s-stack direction="horizontal" alignItems="center" justifyContent="center" >
                            <s-heading>Basic</s-heading>
                            <s-stack direction="inline" alignItems="center" justifyContent="center" >

                                <s-heading>$5.99</s-heading><s-text>/month</s-text>
                            </s-stack>
                            <s-stack gap="base" padding="base" >
                                <s-button variant="primary">Choose this plan</s-button>
                            </s-stack>
                            <s-unordered-list>
                                <s-list-item>Grow your business with unlimited forms</s-list-item>
                                <s-list-item>50 fields per form</s-list-item>

                                <s-list-item>All field types (checkbox, radio, dropdown…)</s-list-item>
                                <s-list-item>Popup, Bubble or Embed Form</s-list-item>
                                <s-list-item>1 form</s-list-item>
                                <s-list-item>Unlimited submission noti via Shopify Flow</s-list-item>

                            </s-unordered-list>
                        </s-stack>
                    </s-section>
                </s-grid-item>
                <s-grid-item gridColumn="span 4" gridRow="span 1">
                    <s-section>
                        <s-stack direction="horizontal" alignItems="center" justifyContent="center" >
                            <s-heading>Grow</s-heading>
                            <s-stack direction="inline" alignItems="center" justifyContent="center" >

                                <s-heading>$7.99</s-heading><s-text>/month</s-text>
                            </s-stack>
                            <s-stack gap="base" padding="base" >
                                <s-button variant="primary">Choose this plan</s-button>
                            </s-stack>
                            <s-unordered-list >
                                <s-list-item>Grow your business with unlimited forms</s-list-item>
                                <s-list-item>50 fields per form</s-list-item>

                                <s-list-item>All field types (checkbox, radio, dropdown…)</s-list-item>
                                <s-list-item>Popup, Bubble or Embed Form</s-list-item>
                                <s-list-item>1 form</s-list-item>
                                <s-list-item>Unlimited submission noti via Shopify Flow</s-list-item>

                            </s-unordered-list>
                        </s-stack>
                    </s-section>
                </s-grid-item>
            </s-grid>

        </s-page >
    )
}

export default Pricing;