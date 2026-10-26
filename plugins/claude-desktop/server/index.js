#!/usr/bin/env node
// Stdio proxy to the remote Invoke Human MCP server.
// Claude's directory listing uses the HTTPS URL. This bundle is the desktop
// install for an agent key. It does not embed that key.

const endpoint = process.env.INVOKE_HUMAN_MCP_URL || "https://invokehumantool.com/mcp";
const token = (process.env.HANDOFFS_TOKEN || "").trim();

let buffer = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  buffer += chunk;
  let newline = buffer.indexOf("\n");
  while (newline >= 0) {
    const line = buffer.slice(0, newline).trim();
    buffer = buffer.slice(newline + 1);
    if (line) void forward(line);
    newline = buffer.indexOf("\n");
  }
});

async function forward(line) {
  let id;
  let hasId = false;
  try {
    const message = JSON.parse(line);
    hasId = Object.prototype.hasOwnProperty.call(message, "id");
    id = hasId ? message.id : undefined;
  } catch {
    hasId = false;
  }
  try {
    const headers = {
      "content-type": "application/json",
      accept: "application/json, text/event-stream",
    };
    if (token) headers.authorization = `Bearer ${token}`;
    const response = await fetch(endpoint, { method: "POST", headers, body: line });
    const text = (await response.text()).trim();
    if (!text) {
      if (!hasId || response.status === 202) return;
      write({ jsonrpc: "2.0", id: id ?? null, error: { code: -32000, message: `Empty response (${response.status})` } });
      return;
    }
    const payload = payloadFrom(text);
    if (payload) {
      process.stdout.write(`${JSON.stringify(payload)}\n`);
      return;
    }
    write({ jsonrpc: "2.0", id: id ?? null, error: { code: -32000, message: `Unexpected response (${response.status})` } });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    write({ jsonrpc: "2.0", id: id ?? null, error: { code: -32000, message } });
  }
}

function payloadFrom(text) {
  if (text.startsWith("{") || text.startsWith("[")) return JSON.parse(text);
  const data = text
    .split("\n")
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trim())
    .filter((line) => line && line !== "[DONE]");
  if (data.length === 0) return null;
  return JSON.parse(data[data.length - 1]);
}

function write(body) {
  process.stdout.write(`${JSON.stringify(body)}\n`);
}
