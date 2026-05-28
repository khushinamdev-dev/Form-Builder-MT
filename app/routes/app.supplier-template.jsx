import { useLoaderData, useSearchParams } from "react-router";
import FormBuilder from "../components/form-builder/FormBuilder";
import { saveFormAction } from "../components/form-builder/save-form-action.server";
import { 
    supplierB2BFormConfig, 
    supplierCustomFormConfig,
    productInquiryFormConfig,
    returnRefundFormConfig,
    warrantyRegistrationFormConfig,
    appointmentBookingFormConfig,
    eventRegistrationFormConfig,
    newsletterSignupFormConfig,
    supportTicketFormConfig,
    surveyFormConfig,
    membershipSignupFormConfig,
    customOrderRequestFormConfig
} from "../components/form-builder/form-configs";
import { authenticate } from "../shopify.server";
import { loadFormForEdit } from "../utils/load-form.server";

export const loader = async ({ request }) => {
    const { admin } = await authenticate.admin(request);
    const formId = new URL(request.url).searchParams.get("formId");

    if (!formId) {
        return { existingForm: null };
    }

    const existingForm = await loadFormForEdit(admin, formId);
    if (!existingForm) {
        throw new Response("Form not found", { status: 404 });
    }
    return { existingForm };
};

export const action = saveFormAction;

export default function SupplierTemplate() {
    const { existingForm } = useLoaderData();
    const [searchParams] = useSearchParams();
    const category = searchParams.get("category") || "b2b";

    const configsMap = {
        "b2b": supplierB2BFormConfig,
        "vendor-registration": supplierB2BFormConfig,
        "supplier-onboarding": supplierB2BFormConfig,
        "custom": supplierCustomFormConfig,
        "product-inquiry": productInquiryFormConfig,
        "return-refund": returnRefundFormConfig,
        "warranty-registration": warrantyRegistrationFormConfig,
        "appointment-booking": appointmentBookingFormConfig,
        "event-registration": eventRegistrationFormConfig,
        "newsletter-signup": newsletterSignupFormConfig,
        "support-ticket": supportTicketFormConfig,
        "survey": surveyFormConfig,
        "membership-signup": membershipSignupFormConfig,
        "custom-order-request": customOrderRequestFormConfig,
    };

    const config = configsMap[category] || supplierCustomFormConfig;

    return <FormBuilder config={config} existingForm={existingForm} />;
}
