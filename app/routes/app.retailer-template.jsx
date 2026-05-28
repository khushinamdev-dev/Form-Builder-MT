import { useLoaderData, useSearchParams } from "react-router";
import FormBuilder from "../components/form-builder/FormBuilder";
import { saveFormAction } from "../components/form-builder/save-form-action.server";
import { retailerB2BFormConfig, retailerCustomFormConfig } from "../components/form-builder/form-configs";
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

export default function RetailerTemplate() {
    const { existingForm } = useLoaderData();
    const [searchParams] = useSearchParams();
    const category = searchParams.get("category") || "b2b";

    const config = (category === "b2b" || category === "retailer-application") 
        ? retailerB2BFormConfig 
        : retailerCustomFormConfig;

    return <FormBuilder config={config} existingForm={existingForm} />;
}
