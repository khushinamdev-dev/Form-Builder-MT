import { Outlet, useLoaderData, useRouteError } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { AppProvider } from "@shopify/shopify-app-react-router/react";
import { authenticate } from "../shopify.server";
import {
  ensureProfileMetaobjectDefinition,
  ensureSubmissionMetaobjectDefinition,
} from "./metaobject-utils.server";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  // eslint-disable-next-line no-undef
  const apiKey = process.env.SHOPIFY_API_KEY || "";

  // Ensure metaobject definitions exist on app load
  await ensureProfileMetaobjectDefinition(admin);
  await ensureSubmissionMetaobjectDefinition(admin);
  return { apiKey };
};

export default function App() {
  const { apiKey } = useLoaderData();

  return (
    <AppProvider embedded apiKey={apiKey}>
      <s-app-nav>
        <s-link href="/app">Home</s-link>
        <s-link href="/app/forms">Forms</s-link>
        <s-link href="/app/submissions">Submissions</s-link>
        <s-link href="/app/customers">Customers</s-link>
      </s-app-nav>
      <Outlet />
    </AppProvider>
  );
}

// Shopify needs React Router to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
