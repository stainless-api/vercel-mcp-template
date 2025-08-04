import { createMcpHandler } from 'mcp-handler';
import { endpoints } from '@stainless-api/hello-example-mcp/tools.js';
import { executeHandler } from '@stainless-api/hello-example-mcp/server.js';
import Hello from '@stainless-api/hello-example/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';


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
      if (authInfo) {
        throw new Error(`Not expecting authentication`);
      }

      const { name, arguments: args } = request.params;
      const endpoint = endpointMap[name];
      if (!endpoint) {
        throw new Error(`Unknown tool: ${name}`);
      }
      
      // TODO: Initialize your client with the appropriate auth token
      const client = new Hello();

      try {
        return executeHandler(endpoint.tool, endpoint.handler, client, args, {});
      } catch (e) {
        console.error(e);
        throw e;
      }
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

/*
// Verify token function that extracts auth info from the bearer token
const verifyToken = async (req: Request, bearerToken?: string): Promise<AuthInfo | undefined> => {
  // TODO: Call into your own IdP to verify your token; return an AuthInfo if valid or undefined if invalid
  throw new Error(`unimplemented`);
};

const authenticatedHandler = withMcpAuth(handler, verifyToken, {
  required: true
});
*/

export { handler as GET, handler as POST, handler as DELETE };
