import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Your Project API",
      version: "1.0.0",
      description: "API documentation for MERN backend",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    paths: {
      "/api/users/all": {
        get: {
          summary: "Get all users",
          tags: ["Users"],
          responses: {
            200: {
              description: "All users fetched successfully",
            },
            404: {
              description: "No users found",
            },
            500: {
              description: "Internal server error",
            },
          },
        },
      },

      "/api/users/profile": {
        get: {
          summary: "Get logged in user profile",
          tags: ["Users"],
          security: [
            {
              bearerAuth: [],
            },
          ],
          responses: {
            200: {
              description: "User profile fetched successfully",
            },
            401: {
              description: "Unauthorized - Token missing or invalid",
            },
            404: {
              description: "User not found",
            },
          },
        },
      },
    },
  },

  apis: [], 
};

const specs = swaggerJsdoc(options);

export default specs;
