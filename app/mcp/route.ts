import { baseURL } from "@/baseUrl";
import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { searchProducts } from "@/lib/priceTracker";

const getAppsSdkCompatibleHtml = async (baseUrl: string, path: string) => {
  const result = await fetch(`${baseUrl}${path}`);
  return await result.text();
};

type ContentWidget = {
  id: string;
  title: string;
  templateUri: string;
  invoking: string;
  invoked: string;
  html: string;
  description: string;
  widgetDomain: string;
};

function widgetMeta(widget: ContentWidget) {
  return {
    "openai/outputTemplate": widget.templateUri,
    "openai/toolInvocation/invoking": widget.invoking,
    "openai/toolInvocation/invoked": widget.invoked,
    "openai/widgetAccessible": false,
    "openai/resultCanProduceWidget": true,
  } as const;
}

const handler = createMcpHandler(async (server) => {
  const html = await getAppsSdkCompatibleHtml(baseURL, "/");

  const contentWidget: ContentWidget = {
    id: "show_content",
    title: "Show Content",
    templateUri: "ui://widget/content-template.html",
    invoking: "Loading content...",
    invoked: "Content loaded",
    html: html,
    description: "Displays the homepage content",
    widgetDomain: "https://nextjs.org/docs",
  };
  server.registerResource(
    "content-widget",
    contentWidget.templateUri,
    {
      title: contentWidget.title,
      description: contentWidget.description,
      mimeType: "text/html+skybridge",
      _meta: {
        "openai/widgetDescription": contentWidget.description,
        "openai/widgetPrefersBorder": true,
      },
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "text/html+skybridge",
          text: `<html>${contentWidget.html}</html>`,
          _meta: {
            "openai/widgetDescription": contentWidget.description,
            "openai/widgetPrefersBorder": true,
            "openai/widgetDomain": contentWidget.widgetDomain,
          },
        },
      ],
    })
  );

  server.registerTool(
    contentWidget.id,
    {
      title: contentWidget.title,
      description:
        "Fetch and display the homepage content with the name of the user",
      inputSchema: {
        name: z.string().describe("The name of the user to display on the homepage"),
      },
      _meta: widgetMeta(contentWidget),
    },
    async ({ name }) => {
      return {
        content: [
          {
            type: "text",
            text: name,
          },
        ],
        structuredContent: {
          name: name,
          timestamp: new Date().toISOString(),
        },
        _meta: widgetMeta(contentWidget),
      };
    }
  );

  // === PRODUCT SEARCH TOOL WITH WIDGET ===
  const searchWidget: ContentWidget = {
    id: "search_products",
    title: "Product Search Results",
    templateUri: "ui://widget/search-results.html",
    invoking: "🔍 Searching for products...",
    invoked: "✅ Search complete",
    html: await getAppsSdkCompatibleHtml(baseURL, "/search-results"),
    description: "Display product search results with prices and retailers",
    widgetDomain: "shopping",
  };

  server.registerResource(
    "search-results-widget",
    searchWidget.templateUri,
    {
      title: searchWidget.title,
      description: searchWidget.description,
      mimeType: "text/html+skybridge",
      _meta: {
        "openai/widgetDescription": searchWidget.description,
        "openai/widgetPrefersBorder": true,
      },
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "text/html+skybridge",
          text: `<html>${searchWidget.html}</html>`,
          _meta: {
            "openai/widgetDescription": searchWidget.description,
            "openai/widgetPrefersBorder": true,
            "openai/widgetDomain": searchWidget.widgetDomain,
          },
        },
      ],
    })
  );

  server.registerTool(
    searchWidget.id,
    {
      title: "Search Products",
      description: "Search for products in Canadian stores (Walmart, Amazon, etc.) and find the best prices",
      inputSchema: {
        query: z.string().describe("The product to search for (e.g., 'iPhone 15', 'coffee maker')"),
      },
      _meta: widgetMeta(searchWidget),
    },
    async ({ query }) => {
      const products = await searchProducts(query);
      
      if (products.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `No products found for "${query}". Try a different search term.`,
            },
          ],
        };
      }

      const cheapest = products[0];
      const resultText = `Found ${products.length} products for "${query}".\n\n` +
        `🏆 CHEAPEST: ${cheapest.title}\n` +
        `Price: $${cheapest.price.toFixed(2)}\n` +
        `Retailer: ${cheapest.retailer}\n` +
        `${cheapest.discountPercentage ? `Discount: ${cheapest.discountPercentage}% off\n` : ''}`;

      return {
        content: [
          {
            type: "text",
            text: resultText,
          },
        ],
        structuredContent: {
          query,
          products: products.slice(0, 10),
          totalResults: products.length,
        },
        _meta: widgetMeta(searchWidget),
      };
    }
  );
});

export const GET = handler;
export const POST = handler;
