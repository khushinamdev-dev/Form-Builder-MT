const defaultEmailTemplates = (formLabel) => ({
    submitted: {
        enabled: "disabled",
        replyTo: "",
        subject: `${formLabel} Received - {{storeName}}`,
        body: `<p>Hi {{firstName}}</p><p>Thank you for your ${formLabel.toLowerCase()} to {{storeName}}.</p><p>We will review your submission and get back to you shortly.</p><p>Thank you<br/>{{storeName}}</p>`,
    },
    approved: {
        enabled: "disabled",
        replyTo: "",
        subject: `Your ${formLabel} has been Approved - {{storeName}}`,
        body: `<p>Hi {{firstName}}</p><p>Congratulations! Your ${formLabel.toLowerCase()} to {{storeName}} has been approved.</p><p>Thank you<br/>{{storeName}}</p>`,
    },
    rejected: {
        enabled: "disabled",
        replyTo: "",
        subject: `Update on your ${formLabel} - {{storeName}}`,
        body: `<p>Hi {{firstName}}</p><p>Thank you for your submission to {{storeName}}.</p><p>After reviewing your request, we are unable to proceed at this time.</p><p>Thank you<br/>{{storeName}}</p>`,
    },
    admin: {
        enabled: "disabled",
        replyTo: "",
        subject: `New ${formLabel} Received`,
        body: `<p>A new ${formLabel.toLowerCase()} has been received.</p><p>Please review the submission in your admin dashboard.</p>`,
    },
});

export const wholesaleFormConfig = {
    initialFields: [
        { id: "email", label: "Email", type: "email", placeholder: "Enter your email", required: true },
        { id: "website", label: "Company Website", type: "url", placeholder: "https://example.com", required: true, singletonType: "biz-website" },
        { id: "phone", label: "Phone Number", type: "tel", placeholder: "+91 81234 56789", required: false },
        { id: "lastName", label: "Last Name", type: "text", placeholder: "Enter last name", required: true },
        { id: "firstName", label: "First Name", type: "text", placeholder: "Enter first name", required: true },
        { id: "address", label: "Company Address", type: "text", placeholder: "Enter company address", required: true, singletonType: "biz-address" },
        { id: "businessType", label: "Type of Business", type: "text", placeholder: "e.g. Retailer, Distributor", required: true, singletonType: "biz-type" },
        { id: "taxId", label: "Tax ID/EIN", type: "text", placeholder: "Enter Tax ID", required: true, singletonType: "biz-tax-id" },
        { id: "taxDoc", label: "State Tax ID ", type: "file", placeholder: "", required: false, singletonType: "biz-tax-doc" },
        { id: "referral", label: "How did you hear about us?", type: "select", options: ["Google", "Social Media", "Word of Mouth", "Other"], required: false },
    ],
    defaultCategory: "b2b",
    formTitle: "Wholesale Application",
    formDescription: "Submit your information and we'll get back to you shortly.",
    pageHeading: "Wholesale form",
    formRole: "Wholesale Form",
    customerTag: "Wholesale",
    saveToastMessage: "Wholesale Form saved successfully!",
    mailDescription: "Configure automatic emails sent when users submit this wholesale form.",
    autoTagLabel: 'Auto-tag customer as "Wholesale"',
    emailTemplates: {
        submitted: {
            enabled: "disabled",
            replyTo: "",
            subject: "Wholesale Application Received - {{storeName}}",
            body: "<p>Hi {{firstName}}</p><p>Thank you for your wholesale application to {{storeName}}.</p><p>We will review your submitted details and share your application status shortly over email.</p><p>Thank you<br/>{{storeName}}</p>",
        },
        approved: {
            enabled: "disabled",
            replyTo: "",
            subject: "Your Wholesale Application has been Approved - {{storeName}}",
            body: "<p>Hi {{firstName}}</p><p>Congratulations! Your wholesale application to {{storeName}} has been approved.</p><p>Thank you<br/>{{storeName}}</p>",
        },
        rejected: {
            enabled: "disabled",
            replyTo: "",
            subject: "Update on your Wholesale Application - {{storeName}}",
            body: "<p>Hi {{firstName}}</p><p>Thank you for applying for a wholesale account with {{storeName}}.</p><p>After reviewing your application, we are unable to approve your request at this time.</p><p>Thank you<br/>{{storeName}}</p>",
        },
        admin: {
            enabled: "disabled",
            replyTo: "",
            subject: "New Wholesale Application Received",
            body: "<p>A new wholesale application has been received.</p><p>Please review the application in your admin dashboard.</p>",
        },
    },
};

export const contactFormConfig = {
    initialFields: [
        { id: "firstName", label: "First Name", type: "text", placeholder: "Enter your first name", required: true },
        { id: "lastName", label: "Last Name", type: "text", placeholder: "Enter your last name", required: true },
        { id: "email", label: "Email", type: "email", placeholder: "Enter your email", required: true },
        { id: "phone", label: "Phone Number", type: "tel", placeholder: "+1 234 567 8900", required: false },
        { id: "message", label: "Message", type: "textarea", placeholder: "How can we help you?", required: true },
    ],
    defaultCategory: "custom",
    formTitle: "Contact Us",
    formDescription: "Send us a message and we'll respond as soon as possible.",
    pageHeading: "Contact form",
    formRole: "Contact Form",
    customerTag: "Contact",
    saveToastMessage: "Contact Form saved successfully!",
    mailDescription: "Configure automatic emails sent when users submit this contact form.",
    autoTagLabel: 'Auto-tag customer as "Contact"',
    emailTemplates: defaultEmailTemplates("Contact Form"),
};
