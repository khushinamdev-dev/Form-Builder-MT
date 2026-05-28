import { useNavigate } from "react-router"



export default function Index() {
  const navigate = useNavigate();
  return (
    <s-page heading="Form Builder" inline-size="base">
      <s-stack padding="base none" gap="base"  >
        <s-heading>Any questions? Reach out anytime - We're here to help!</s-heading>
      </s-stack>
      <s-section  >
        <s-stack direction="inline" alignItems="center" justifyContent="space-between" >

          {/* <s-divider color="strong"  ></s-divider> */}
          <s-stack gap="base">

            <s-text>We’ll assist you in setting up the app, forms, configurations and any other questions you may have.

            </s-text>
            <s-button variant="primary">Contact Us</s-button>
          </s-stack>

          <s-box inlineSize="100px" padding="base" textAlign="center">
            <s-image
              src="support.svg"
              alt="Empty state"

              objectFit="cover"
              aspectRatio="1/1"
            ></s-image>
          </s-box>

        </s-stack>
      </s-section>



      <s-grid gridTemplateColumns="repeat(3, 1fr)" gap="base">
        <s-grid-item gridColumn="span 1 " gridRow="span 1">
          <s-section >
            <s-heading>0</s-heading>
            <s-text>Total Active Forms </s-text>
            {/* <s-stack direction="horizontal" padding="base none none none" >
                <s-button-group>
                  <s-button slot="secondary-actions" >Forms</s-button>

                </s-button-group>
              </s-stack> */}
          </s-section>
        </s-grid-item>

        <s-grid-item gridColumn="span 1" gridRow="span 1">
          <s-section>
            <s-heading>0</s-heading>
            <s-text>Total Submissions</s-text>
            {/* <s-stack direction="horizontal" padding="base none none none" >
                <s-button-group>
                  <s-button slot="secondary-actions" >Submissions</s-button>

                </s-button-group>
              </s-stack> */}
          </s-section>
        </s-grid-item>
        <s-grid-item gridColumn="span 1" gridRow="span 1">
          <s-section  >
            <s-heading>0</s-heading>
            <s-text>Last 30 days Submissions
            </s-text>
            {/* <s-stack direction="horizontal" padding="base none none none" >

                <s-button-group>
                  <s-button slot="secondary-actions" >Submissions</s-button>

                </s-button-group>
              </s-stack> */}
          </s-section>
        </s-grid-item>

        {/* <s-grid-item gridColumn="span 1" gridRow="span 1">
          <s-section>
            <s-heading>Create a new form
            </s-heading>
            <s-text>Customize forms to fit your store
            </s-text>
            <s-stack direction="horizontal" padding="base none" >
              <s-button-group>
                <s-button slot="secondary-actions" >New Form</s-button>

              </s-button-group>
            </s-stack>
          </s-section>
        </s-grid-item> */}
      </s-grid>


      <s-stack padding="base none" >
        <s-heading>Create a form</s-heading>
      </s-stack>

      <s-section >
        <s-stack direction="inline" alignItems="center" justifyContent="space-between" >


          <s-stack gap="base">

            <s-text>Create professional forms with our visual, no-code builder - every change appears instantly as you design.
            </s-text>
            <s-button variant="primary" onClick={() => navigate("/app/forms")} >New Form</s-button>
          </s-stack>

          <s-box inlineSize="100px" padding="base" textAlign="center">
            <s-image
              src="create.svg"
              alt="Empty state"

              objectFit="cover"
              aspectRatio="1/1"
            ></s-image>
          </s-box>
        </s-stack>
      </s-section>

      <s-section >
        <s-stack padding="none none base none" >
          <s-heading>What do you think? Leave a review!

          </s-heading>
        </s-stack>
        <s-stack gap="base">

          <s-text>Please take a minute to share your experience using Customer Fields with other merchants on Shopify.


          </s-text>
          <s-button variant="secondary">Leave a review</s-button>
        </s-stack>
      </s-section>
    </s-page>
  )
}


