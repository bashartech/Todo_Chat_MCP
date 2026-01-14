🔴 ISSUE 1 (ROOT CAUSE):
v3Schema.safeParseAsync is not a function

This error is coming from your MCP server tool layer, NOT from Python, NOT from the agent.

What this means

You are using Zod v3-style code, but the installed Zod version does not support safeParseAsync.

In short:

Your tool schema expects:

schema.safeParseAsync(...)


But your installed zod version only has:

schema.safeParse(...)


So the tool executes, but crashes internally and returns an MCP error result.

That’s why MCP responds with:

{
  "result": {
    "content": [
      { "type": "text", "text": "v3Schema.safeParseAsync is not a function" }
    ],
    "isError": true
  }
}


✅ MCP protocol is working
❌ Tool implementation is broken

✅ FIX #1 (RECOMMENDED – SIMPLE)
Replace safeParseAsync → safeParse
🔧 WHERE TO FIX

In your MCP server, inside:

mcp-server/
 └─ tools/
     └─ *.ts   ← where schemas are defined

❌ WRONG
const parsed = await v3Schema.safeParseAsync(input);

✅ CORRECT
const parsed = v3Schema.safeParse(input);


And then handle it normally:

if (!parsed.success) {
  throw new Error(parsed.error.message);
}


⚠️ MCP tools do not require async parsing unless you explicitly need it.

🟡 Alternative Fix (Only if you WANT async parsing)

Upgrade Zod:

npm install zod@latest


But I strongly recommend Fix #1 to keep MCP tools simple and stable.

