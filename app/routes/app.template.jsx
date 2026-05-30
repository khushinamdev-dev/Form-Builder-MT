import { useState } from "react";
import { useNavigate } from "react-router";

const templatesData = [
  {
    id: "contact-us",
    title: "Contact Us Form",
    description: "Captures basic customer details like name, email, phone, and address",
    category: "contact",
    path: "/app/contact",
    buttonText: "Use Template",
    image: "/contact.png",
  },
  {
    id: "customer-feedback",
    title: "Customer Feedback Form",
    description: "Captures basic customer and company details",
    category: "feedback",
    path: "/app/retailer-template",
    buttonText: "Use Template",
    image: "/feedback.png",
  },
  // {
  //   id: "vendor-registration",
  //   title: "Vendor Registration Form",
  //   description: "Captures exhaustive company details in a 2 page form",
  //   category: "b2b",
  //   path: "/app/supplier-template",
  //   buttonText: "Use B2B Template",
  //   image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=250&fit=crop&q=80",
  // },
  {
    id: "product-inquiry",
    title: "Product Inquiry Form",
    description: "Captures customer inquiry details for specific products",
    category: "lead-gen",
    path: "/app/supplier-template",
    buttonText: "Use Template",
    image: "/product-enquiry.png",
  },
  {
    id: "return-refund",
    title: "Return/Refund Request Form",
    description: "Handles customer product return and refund requests",
    category: "return",
    path: "/app/supplier-template",
    buttonText: "Use Template",
    image: "/refund.png",
  },
  {
    id: "warranty-registration",
    title: "Warranty Registration Form",
    description: "Registers product purchase details and warranty parameters",
    category: "registration",
    path: "/app/supplier-template",
    buttonText: "Use Template",
    image: "/warranty.png",
  },
  {
    id: "appointment-booking",
    title: "Appointment Booking Form",
    description: "Allows customers to schedule dates and slots",
    category: "reservation",
    path: "/app/supplier-template",
    buttonText: "Use Template",
    image: "/appointment.png",
  },
  {
    id: "event-registration",
    title: "Event Registration Form",
    description: "Collects guest lists and RSVP responses for events",
    category: "rsvp",
    path: "/app/supplier-template",
    buttonText: "Use Template",
    image: "/rsvp.png",
  },
  {
    id: "newsletter-signup",
    title: "Newsletter Signup Form",
    description: "Captures subscribers and opt-ins for regular newsletters",
    category: "signup",
    path: "/app/supplier-template",
    buttonText: "Use Template",
    image: "/news.png",
  },
  {
    id: "support-ticket",
    title: "Support Ticket Form",
    description: "Submits detailed technical or support query details",
    category: "contact",
    path: "/app/supplier-template",
    buttonText: "Use Template",
    image: "/support.png",
  },
  {
    id: "survey",
    title: "Survey Form",
    description: "Collects rich customer feedback and market opinions",
    category: "survey",
    path: "/app/supplier-template",
    buttonText: "Use Template",
    image: "/satisfaction.png",
  },
  {
    id: "membership-signup",
    title: "Membership Signup Form",
    description: "Gathers registrations for community or club memberships",
    category: "signup",
    path: "/app/supplier-template",
    buttonText: "Use Template",
    image: "/vip.png",
  },
  {
    id: "custom-order-request",
    title: "Custom Order Request Form",
    description: "Collects bespoke custom manufacturing order parameters",
    category: "order",
    path: "/app/supplier-template",
    buttonText: "Use Template",
    image: "/custom-order.png",
  },
  {
    id: "wholesale-registration",
    title: "Wholesale Registration Form",
    description: "Captures basic customer details like name, email, phone, and address",
    category: "b2b",
    path: "/app/wholesale-form",
    buttonText: "Use B2B Template",
    image: "/wholesale1.png",
  },
  {
    id: "retailer-application",
    title: "Retailer Application Form",
    description: "Captures basic customer and company details",
    category: "b2b",
    path: "/app/retailer-template",
    buttonText: "Use B2B Template",
    image: "/retailer.png",
  },
  {
    id: "supplier-onboarding",
    title: "Supplier Onboarding Form",
    description: "Captures exhaustive company details in a 2 page form",
    category: "b2b",
    path: "/app/supplier-template",
    buttonText: "Use B2B Template",
    image: "/supplier.png",
  },
];

const categories = [
  { id: "all", label: "All Templates" },
  { id: "registration", label: "Registration Forms" },
  { id: "rsvp", label: "RSVP Forms" },
  { id: "contact", label: "Contact Forms" },
  { id: "signup", label: "Signup Forms" },
  { id: "survey", label: "Survey Forms" },
  { id: "b2b", label: "Wholesale" },
  { id: "reservation", label: "Reservation Forms" },
  { id: "lead-gen", label: "Lead Gen Forms" },
  { id: "feedback", label: "Feedback Forms" },
  { id: "return", label: "Return Forms" },
  { id: "order", label: "Order Forms" },
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
      <s-stack
        direction="inline"
        alignItems="center"
        gap="base"
        padding="base none"
      >
        <s-button onClick={() => navigate("/app/create-form")}>
          <s-icon type="arrow-left"> </s-icon>
        </s-button>
        <s-heading>Templates</s-heading>
      </s-stack>

      <s-stack padding="base none">
        <s-search-field
          name="orderSearch"
          placeholder="Search Form"
          value={searchQuery}
          onInput={(e) => setSearchQuery(e.target.value)}
          onChange={(e) => setSearchQuery(e.target.value)}
        ></s-search-field>
      </s-stack>

      {/* Category Panel using Spruce Web Components */}
      <s-section className="">
        <div className="category-grid">
          {categories.map((item) => {
            const isActive = selectedCategory === item.id;
            return (
              <s-button
                variant={isActive ? "primary" : "tertiary"}
                className={`category-btn ${isActive ? "active" : ""}`}
                key={item.id}
                onClick={() => setSelectedCategory(item.id)}
              >
                {item.label}
              </s-button>
            );
          })}
        </div>
      </s-section>



      <s-grid gridTemplateColumns="repeat(12, 1fr)" gap="base">
        {filteredTemplates.length === 0 ? (
          <s-grid-item gridColumn="span 12">
            <div className="no-templates-card">
              <s-heading>No templates found</s-heading>
              <s-text>There are no templates available matching your filter or search criteria.</s-text>
              <s-button variant="primary" onClick={() => navigate("/app/scratch?category=custom")}>
                Start from a Blank Form
              </s-button>
            </div>
          </s-grid-item>
        ) : (
          filteredTemplates.map((template) => (
            <s-grid-item key={template.id} gridColumn="span 4" gridRow="span 4">
              <div className="template-card">
                {template.image && (
                  <div className="template-preview-box">
                    <div className="template-preview-image-wrapper">
                      <img
                        className="template-preview-image"
                        src={template.image}
                        alt={template.title}
                        loading="lazy"
                      />
                    </div>
                  </div>
                )}
                <div className="template-card-body">
                  <h3 className="template-card-title">{template.title}</h3>
                  <p className="template-card-desc">{template.description}</p>
                  <s-button
                    variant="primary"
                    onClick={() =>
                      navigate(`${template.path}?category=${template.id}`)
                    }
                  >
                    {template.buttonText}
                  </s-button>
                </div>
              </div>
            </s-grid-item>
          ))
        )}
      </s-grid>
    </s-page>
  );
};

export default Templates;
