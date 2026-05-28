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
      <style>{`
        .category-panel-cont {
          background: #ffffff;
          border: 1px solid #e1e3e5;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          padding: 24px;
          margin-bottom: 28px;
          display: block;
        }
            
        .category-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 12px;
        }
        
        .category-column {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        // .category-btn {
        //   width: 100%;
        //   height: 48px; 
        //   display: inline-flex;
        //   align-items: center;
        //   justify-content: center;
        //   background: #f6f6f7;
        //   border: 1px solid #e1e3e5;
        //   border-radius: 24px;
        //   padding: 6px 12px;
        //   font-size: 12px;
        //   font-weight: 500;
        //   color: #202223;
        //   cursor: pointer;
        //   transition: all 0.2s ease-in-out;
        //   text-align: center;
        //   line-height: 1.3;
        //   outline: none;
        //   box-shadow: 0 1px 2px rgba(0,0,0,0.02);
        //   box-sizing: border-box;
        // }

        .category-btn:hover {
          background: #edeeee;
          border-color: #c9cccf;
          transform: translateY(-1px);
        }

        // .category-btn.active {
        //   background: #202223;
        //   border-color: #202223;
        //   color: #ffffff;
        //   box-shadow: 0 2px 4px rgba(0,0,0,0.15);
        // }

        .template-card {
          border: 1px solid #e1e3e5;
          border-radius: 12px;
          background: #ffffff;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .template-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 20px rgba(0, 0, 0, 0.08);
          border-color: #c9cccf;
        }

        .template-preview-box {
          padding: 24px 20px 0 20px;
          background: #f4f6f8;
          border-bottom: 1px solid #f1f2f3;
          height: 200px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          overflow: hidden;
          position: relative;
        }

        .template-preview-image-wrapper {
          width: 100%;
          height: 100%;
          background: #ffffff;
          border: 1px solid #e1e3e5;
          border-bottom: none;
          border-radius: 8px 8px 0 0;
          box-shadow: 0 4px 10px rgba(0,0,0,0.03);
          overflow: hidden;
          transition: transform 0.3s ease;
        }

        .template-card:hover .template-preview-image-wrapper {
          transform: scale(1.03);
        }

        .template-preview-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
        }

        .template-card-body {
          padding: 20px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .template-card-title {
          font-size: 15px;
          font-weight: 600;
          color: #202223;
          margin: 0;
        }

        .template-card-desc {
          font-size: 13px;
          color: #6d7175;
          line-height: 1.5;
          margin: 0 0 12px 0;
          flex-grow: 1;
        }

        .template-card s-button {
          width: 100%;
          margin-top: auto;
        }

        .no-templates-card {
          background: #f6f6f7;
          border: 1px dashed #c9cccf;
          border-radius: 8px;
          padding: 48px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
      `}</style>

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
