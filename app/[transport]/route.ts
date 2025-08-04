import { createMcpHandler, withMcpAuth } from 'mcp-handler';
import { endpoints } from 'YOUR_MCP_PACKAGE/tools';
import { executeHandler } from 'YOUR_MCP_PACKAGE/server';
import YourSDK from 'YOUR_SDK_PACKAGE';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { AuthInfo } from "@modelcontextprotocol/sdk/server/auth/types.js";


const handler = createMcpHandler(
  async (server) => {
    const baseServer = server.server;

    baseServer.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: endpoints.map((endpoint) => endpoint.tool),
      };
    });

    const endpointMap = Object.fromEntries(endpoints.map((endpoint) => [endpoint.tool.name, endpoint]));
    baseServer.setRequestHandler(CallToolRequestSchema, async (request, { authInfo }) => {
      if (!authInfo) {
        throw new Error(`Must be authenticated`);
      }

      const { name, arguments: args } = request.params;
      const endpoint = endpointMap[name];
      if (!endpoint) {
        throw new Error(`Unknown tool: ${name}`);
      }
      
      // TODO: Initialize your client with the appropriate auth token
      const client = new YourSDK({
        auth: authInfo.token,
      });

      return executeHandler(endpoint.tool, endpoint.handler, client, args, {});
    });
  },
  {
    capabilities: {
      tools: {},
    },
  },
  {
    basePath: "",
    verboseLogs: true,
    maxDuration: 60,
  }
);

// Verify token function that extracts auth info from the bearer token
const verifyToken = async (req: Request, bearerToken?: string): Promise<AuthInfo | undefined> => {
  // TODO: Call into your own IdP to verify your token; return an AuthInfo if valid or undefined if invalid
  throw new Error(`unimplemented`);
};

const authenticatedHandler = withMcpAuth(handler, verifyToken, {
  required: true
});

export { authenticatedHandler as GET, authenticatedHandler as POST, authenticatedHandler as DELETE };
