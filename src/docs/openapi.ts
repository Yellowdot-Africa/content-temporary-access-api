import dotenv from "dotenv";
dotenv.config();

export const openapiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Content Security API",
    version: "1.0.0",
  },
  servers: [
    {
      url: `${process.env.BASE_URL}`
    },
  ],
  paths: {
    "/api/v1/content-security": {
      get: {
        summary: "Get list of Content Securitys",
        responses: {
          "200": { description: "OK" },
        },
      },
      post: {
        summary: "Create new Content Security",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateContentSecurityDto",
              },
            },
          },
        },
        responses: {
          "201": { description: "Created" },
        },
      },
    },
    "/api/v1/content-security/filter": {
      get: {
        summary: "Filter Content Security by optional msisdn and service_id",
        parameters: [
          {
            name: "msisdn",
            in: "query",
            required: false,
            schema: { type: "string" },
            description: "Optional MSISDN to filter results",
          },
          {
            name: "service_id",
            in: "query",
            required: false,
            schema: { type: "string" },
            description: "Optional service ID to filter results",
          },
        ],
        responses: {
          "200": { description: "Filtered results returned" },
          "404": { description: "No matching records found" },
        },
      },
    }
  },
  components: {
    schemas: {
      CreateContentSecurityDto: {
        type: "object",
        properties: {
          msisdn: { type: "string" },
          service_id: { type: "string" },
          ctx: { type: "string" },
          ext_ref: { type: "string" },
          transaction_id: { type: "string" },
          source: { type: "string" },
          mno: { type: "string" },
        },
        required: ["msisdn", "consented_to_install"],
      },
    },
  },
};
