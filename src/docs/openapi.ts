export const openapiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Content Security API",
    version: "1.0.0",
  },
  servers: [
    {
      url: "http://localhost:4000",
    },
  ],
  paths: {
    "/api/ContentSecurity": {
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
                $ref: "#/components/schemas/CreateContentSecurityDto", // ✅ use only msisdn + consented_to_install
              },
            },
          },
        },
        responses: {
          "201": { description: "Created" },
        },
      },
    },
    "/api/ContentSecurity/msisdn/{msisdn}": {
      get: {
        summary: "Get Content Security by MSISDN",
        parameters: [
          {
            name: "msisdn",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "OK" },
          "404": { description: "Not Found" },
        },
      },
    },
  },
  components: {
    schemas: {
      CreateContentSecurityDto: { // ✅ new schema for POST
        type: "object",
        properties: {
          msisdn: { type: "string" },
          service_id: { type: "string" },
          ctx: { type: "string" },
          ext_ref: { type: "string" },
          transaction_id: { type: "string" },
          source: { type: "string" },
          mno: { type: "string" }
        },
        required: ["msisdn", "consented_to_install"],
      },
    },
  },
};
