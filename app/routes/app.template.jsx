import { useState } from "react";
import { useNavigate } from "react-router";

const templatesData = [
    {
        id: "contact-us",
        title: "Contact Us Form",
        description: "Captures basic customer details like name, email, phone, and address",
        category: "custom",
        path: "/app/contactUsTemp",
        buttonText: "Contact Us",
    },
    {
        id: "customer-feedback",
        title: "Customer Feedback Form",
        description: "Captures basic customer and company details",
        category: "custom",
        path: "/app/retailer-template",
        buttonText: "Retailer",
    },
    {
        id: "vendor-registration",
        title: "Vendor Registration Form",
        description: "Captures exhaustive company details in a 2 page form",
        category: "b2b",
        path: "/app/supplier-template",
        buttonText: "Supplier",
    },
    {
        id: "product-inquiry",
        title: "Product Inquiry Form",
        description: "Captures exhaustive company details in a 2 page form",
        category: "custom",
        path: "/app/supplier-template",
        buttonText: "Supplier",
    },
    {
        id: "return-refund",
        title: "Return/Refund Request Form",
        description: "Captures exhaustive company details in a 2 page form",
        category: "custom",
        path: "/app/supplier-template",
        buttonText: "Supplier",
    },
    {
        id: "warranty-registration",
        title: "Warranty Registration Form",
        description: "Captures exhaustive company details in a 2 page form",
        category: "custom",
        path: "/app/supplier-template",
        buttonText: "Supplier",
    },
    {
        id: "appointment-booking",
        title: "Appointment Booking Form",
        description: "Captures exhaustive company details in a 2 page form",
        category: "custom",
        path: "/app/supplier-template",
        buttonText: "Supplier",
    },
    {
        id: "event-registration",
        title: "Event Registration Form",
        description: "Captures exhaustive company details in a 2 page form",
        category: "custom",
        path: "/app/supplier-template",
        buttonText: "Supplier",
    },
    {
        id: "newsletter-signup",
        title: "Newsletter Signup Form",
        description: "Captures exhaustive company details in a 2 page form",
        category: "custom",
        path: "/app/supplier-template",
        buttonText: "Supplier",
    },
    {
        id: "support-ticket",
        title: "Support Ticket Form",
        description: "Captures exhaustive company details in a 2 page form",
        category: "custom",
        path: "/app/supplier-template",
        buttonText: "Supplier",
    },
    {
        id: "survey",
        title: "Survey Form",
        description: "Captures exhaustive company details in a 2 page form",
        category: "custom",
        path: "/app/supplier-template",
        buttonText: "Supplier",
    },
    {
        id: "membership-signup",
        title: "Membership Signup Form",
        description: "Captures exhaustive company details in a 2 page form",
        category: "custom",
        path: "/app/supplier-template",
        buttonText: "Supplier",
    },
    {
        id: "custom-order-request",
        title: "Custom Order Request Form",
        description: "Captures exhaustive company details in a 2 page form",
        category: "custom",
        path: "/app/supplier-template",
        buttonText: "Supplier",
    },
    {
        id: "wholesale-registration",
        title: "Wholesale Registration Form",
        description: "Captures basic customer details like name, email, phone, and address",
        category: "b2b",
        path: "/app/wholesale-form",
        buttonText: "Wholesale",
    },
    {
        id: "retailer-application",
        title: "Retailer Application Form",
        description: "Captures basic customer and company details",
        category: "b2b",
        path: "/app/retailer-template",
        buttonText: "Retailer",
    },
    {
        id: "supplier-onboarding",
        title: "Supplier Onboarding Form",
        description: "Captures exhaustive company details in a 2 page form",
        category: "b2b",
        path: "/app/supplier-template",
        buttonText: "Supplier",
    },
];

const Templates = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    const filteredTemplates = templatesData
        .filter((template) => {
            const matchesCategory =
                selectedCategory === "all" || template.category === selectedCategory;
            const matchesSearch =
                template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                template.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        })
        .sort((a, b) => a.title.localeCompare(b.title));

    return (
        <s-page>
            <s-stack direction="inline" alignItems="center" gap="base" padding="base none">
                <s-button onClick={() => navigate("/app/forms")}>
                    <s-icon type="arrow-left" tone="warning"> </s-icon>
                </s-button>
            </s-stack>

            <s-section>
                <s-stack padding="none none base none">
                    <s-heading>Start From Scratch</s-heading>
                </s-stack>
                <s-stack gap="base">
                    <s-text>Create fully custom forms or workflows from the ground up.</s-text>
                    <s-button variant="secondary">New Form</s-button>
                </s-stack>
            </s-section>

            <s-stack justifyContent="center" alignItems="center">
                <s-heading> Create a new Form from pre build template </s-heading>
            </s-stack>

            <s-stack padding="base">
                <s-search-field
                    label="Form Name "
                    name="orderSearch"
                    value={searchQuery}
                    onInput={(e) => setSearchQuery(e.target.value)}
                    onChange={(e) => setSearchQuery(e.target.value)}
                ></s-search-field>
            </s-stack>

            <s-stack padding="base" direction="inline" gap="base">
                <s-button
                    variant={selectedCategory === "all" ? "primary" : "secondary"}
                    onClick={() => setSelectedCategory("all")}
                >
                    All
                </s-button>
                <s-button
                    variant={selectedCategory === "b2b" ? "primary" : "secondary"}
                    onClick={() => setSelectedCategory("b2b")}
                >
                    B2B
                </s-button>
                <s-button
                    variant={selectedCategory === "custom" ? "primary" : "secondary"}
                    onClick={() => setSelectedCategory("custom")}
                >
                    Custom
                </s-button>
            </s-stack>

            <s-grid gridTemplateColumns="repeat(12, 1fr)" gap="base">
                {filteredTemplates.map((template) => (
                    <s-grid-item key={template.id} gridColumn="span 4" gridRow="span 3">
                        <s-section padding="none">
                            <s-stack>
                                <s-box inlineSize="300px" padding="base" gap="base">
                                    <s-stack
                                        padding="base none"
                                        gap="base"
                                        direction="inline"
                                        justifyContent="center"
                                        alignItems="center"
                                    >
                                        <s-heading>{template.title}</s-heading>
                                    </s-stack>
                                </s-box>
                                <s-stack padding="base" gap="base">
                                    <s-text>{template.description}</s-text>
                                    <s-button onClick={() => navigate(template.path)}>
                                        {template.buttonText}
                                    </s-button>
                                </s-stack>
                            </s-stack>
                        </s-section>
                    </s-grid-item>
                ))}
            </s-grid>
        </s-page>
    );
};

export default Templates;
