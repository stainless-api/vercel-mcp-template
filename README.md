# Vercel MCP Server Template

This template enables you to run a Stainless-generated MCP (Model Context Protocol) server as a remote MCP server on Vercel using the mcp-handler package.

## Overview

This template provides a Next.js-based serverless application that hosts your MCP tools on Vercel with bearer token authentication. The main entry point is `app/[transport]/route.ts` which handles MCP protocol requests.

## Implementation Requirements

### 1. Replace Package Imports

In `app/[transport]/route.ts`, you need to replace three placeholder imports with your Stainless-generated packages:

```typescript
// Replace these imports:
import endpoints from 'YOUR_MCP_PACKAGE/tools';
import { initServer } from 'YOUR_MCP_PACKAGE/server';
import YourSDK from 'YOUR_SDK_PACKAGE';
```

### 2. Implement Token Verification

The `verifyToken` function must be implemented to validate bearer tokens with your identity provider:

```typescript
const verifyToken = async (req: Request, bearerToken?: string): Promise<AuthInfo | undefined> => {
  // TODO: Implement your IdP integration here
  // Should return:
  // {
  //   token: string,      // The validated token
  //   clientId: string,   // Client identifier
  //   scopes: string[]    // Array of authorized scopes
  // }
  // if valid, or undefined if invalid
};
```

### 3. Initialize Your Client

Replace the placeholder client initialization with your actual SDK client:

```typescript
// Replace:
const client = YourSDK(
  auth: authInfo.token,
)

// With your actual client initialization:
const client = new SDK({
  auth: authInfo.token,
  // ... other configuration
});
```
