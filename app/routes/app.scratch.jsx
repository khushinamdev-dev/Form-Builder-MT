import { useLoaderData } from "react-router";
import FormBuilder from "../components/form-builder/FormBuilder";
import { saveFormAction } from "../components/form-builder/save-form-action.server";
import { scratchFormConfig } from "../components/form-builder/form-configs";
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

export default function ScratchForm() {
    const { existingForm } = useLoaderData();
    return <FormBuilder config={scratchFormConfig} existingForm={existingForm} />;
}
