import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Circle App API",
      version: "1.0.0",
      description:
        "API documentation for Circle App backend (Express + Prisma + PostgreSQL).",
    },
    servers: [
      {
        url: process.env.APP_URL || "http://localhost:5000",
      },
    ],
    tags: [
      { name: "Auth" },
      { name: "Threads" },
      { name: "Replies" },
      { name: "Likes" },
      { name: "Follows" },
      { name: "Users" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            code: { type: "integer", example: 500 },
            status: { type: "string", example: "error" },
            message: { type: "string", example: "Failed to process request." },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["username", "name", "email", "password"],
          properties: {
            username: { type: "string", example: "john_doe" },
            name: { type: "string", example: "John Doe" },
            email: { type: "string", format: "email", example: "john@example.com" },
            password: { type: "string", example: "securepassword" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["identifier", "password"],
          properties: {
            identifier: { type: "string", example: "john_doe" },
            password: { type: "string", example: "securepassword" },
          },
        },
        AuthData: {
          type: "object",
          properties: {
            user_id: { type: "string" },
            username: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
            avatar: { type: "string", nullable: true },
            token: { type: "string" },
          },
        },
        ProfileData: {
          type: "object",
          properties: {
            user_id: { type: "string" },
            username: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
            avatar: { type: "string", nullable: true },
            bio: { type: "string", nullable: true },
          },
        },
        ThreadCreateRequest: {
          type: "object",
          properties: {
            content: {
              type: "string",
              example: "Ini adalah postingan pertama saya!",
            },
            image: {
              type: "string",
              format: "binary",
              description: "Optional image file upload.",
            },
          },
        },
        ThreadListItem: {
          type: "object",
          properties: {
            id: { type: "string" },
            content: { type: "string" },
            image: { type: "string", nullable: true },
            likes: { type: "integer" },
            replies: { type: "integer" },
            liked: { type: "boolean" },
            created_at: { type: "string", format: "date-time" },
            user: {
              type: "object",
              properties: {
                id: { type: "string" },
                username: { type: "string" },
                name: { type: "string" },
                profile_picture: { type: "string", nullable: true },
              },
            },
          },
        },
        ReplyCreateRequest: {
          type: "object",
          properties: {
            content: { type: "string", example: "Ini reply untuk thread ini." },
            image: {
              type: "string",
              format: "binary",
              description: "Optional image file upload.",
            },
          },
        },
        FollowActionRequest: {
          type: "object",
          properties: {
            followed_user_id: { type: "string", example: "target_user_id" },
            followed_id: { type: "string", example: "target_user_id" },
          },
        },
        LikeActionRequest: {
          type: "object",
          properties: {
            thread_id: { type: "string", example: "thread_id_here" },
            tweet_id: { type: "string", example: "thread_id_here" },
          },
        },
        SearchUser: {
          type: "object",
          properties: {
            id: { type: "string" },
            username: { type: "string" },
            name: { type: "string" },
            avatar: { type: "string", nullable: true },
            is_following: { type: "boolean" },
          },
        },
      },
    },
    paths: {
      "/api/v1/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "Register new user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/RegisterRequest" },
              },
            },
          },
          responses: {
            "200": {
              description: "Register success",
            },
            "400": {
              description: "Validation error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },
      "/api/v1/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Login user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginRequest" },
              },
            },
          },
          responses: {
            "200": {
              description: "Login success",
            },
            "500": {
              description: "Invalid login",
            },
          },
        },
      },
      "/api/v1/auth/me": {
        get: {
          tags: ["Auth"],
          summary: "Get current user profile",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "Profile fetched",
            },
          },
        },
        patch: {
          tags: ["Auth"],
          summary: "Update current user profile",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: false,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
                    username: { type: "string" },
                    name: { type: "string" },
                    bio: { type: "string" },
                    avatar: { type: "string", format: "binary" },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Profile updated",
            },
          },
        },
      },
      "/api/v1/threads": {
        get: {
          tags: ["Threads"],
          summary: "Get thread list",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "Thread list fetched",
            },
          },
        },
        post: {
          tags: ["Threads"],
          summary: "Create new thread",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: { $ref: "#/components/schemas/ThreadCreateRequest" },
              },
            },
          },
          responses: {
            "201": {
              description: "Thread created",
            },
          },
        },
      },
      "/api/v1/thread/{threadId}": {
        get: {
          tags: ["Threads"],
          summary: "Get thread detail by id",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "threadId",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": {
              description: "Thread detail fetched",
            },
            "404": {
              description: "Thread not found",
            },
          },
        },
      },
      "/api/v1/thread/{threadId}/replies": {
        get: {
          tags: ["Replies"],
          summary: "Get replies by thread id",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "threadId",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": {
              description: "Replies fetched",
            },
          },
        },
      },
      "/api/v1/reply": {
        get: {
          tags: ["Replies"],
          summary: "Get replies by query thread_id",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "thread_id",
              in: "query",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": {
              description: "Replies fetched",
            },
          },
        },
        post: {
          tags: ["Replies"],
          summary: "Create reply",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "thread_id",
              in: "query",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: { $ref: "#/components/schemas/ReplyCreateRequest" },
              },
            },
          },
          responses: {
            "201": {
              description: "Reply created",
            },
          },
        },
      },
      "/api/v1/like": {
        post: {
          tags: ["Likes"],
          summary: "Like thread",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LikeActionRequest" },
              },
            },
          },
          responses: {
            "200": {
              description: "Liked successfully",
            },
          },
        },
        delete: {
          tags: ["Likes"],
          summary: "Unlike thread",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LikeActionRequest" },
              },
            },
          },
          responses: {
            "200": {
              description: "Unliked successfully",
            },
          },
        },
      },
      "/api/v1/follows": {
        get: {
          tags: ["Follows"],
          summary: "Get followers/following",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "type",
              in: "query",
              required: false,
              schema: {
                type: "string",
                enum: ["followers", "following"],
              },
            },
          ],
          responses: {
            "200": {
              description: "Follow list fetched",
            },
          },
        },
        post: {
          tags: ["Follows"],
          summary: "Follow user",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/FollowActionRequest" },
              },
            },
          },
          responses: {
            "200": {
              description: "Follow success",
            },
          },
        },
        delete: {
          tags: ["Follows"],
          summary: "Unfollow user",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/FollowActionRequest" },
              },
            },
          },
          responses: {
            "200": {
              description: "Unfollow success",
            },
          },
        },
      },
      "/api/v1/users/search": {
        get: {
          tags: ["Users"],
          summary: "Search users by name or username",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "q",
              in: "query",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": {
              description: "Search results fetched",
            },
          },
        },
      },
      "/api/v1/users/suggested": {
        get: {
          tags: ["Users"],
          summary: "Get suggested users",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "Suggested users fetched",
            },
          },
        },
      },
    },
  },
  apis: [],
});

