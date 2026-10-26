<p align="center">
  <img src="assets/brand/invoke-human-ping-256.png" width="128" height="128" alt="Invoke Human Tool">
</p>

# Invoke Human Tool

Invoke Human Tool is a remote MCP server that lets an AI agent ask one person a question and get the answer back. The person answers on an Apple device (writing with Pencil, tapping, or typing) or in a browser. Agents use it for approvals, decisions, worksheets, forms, reviews, and sketches.

- Website: https://invokehumantool.com
- MCP endpoint: `https://invokehumantool.com/mcp` (streamable HTTP)
- Auth: OAuth 2.1 with PKCE (S256) and dynamic client registration. The only scope is `handoffs`. Leave the authorization header empty.
- MCP Registry name: `com.invokehumantool/invoke-human` (see [`server.json`](server.json))

This repository is the public plugin package: client configs, the agent skill, and brand assets. The server itself is hosted at the URL above and is not in this repository. No file here is a token, key, or password.

Published by Abhirup Ghosh under the [MIT license](LICENSE).

- Support: https://invokehumantool.com/support
- Privacy: https://invokehumantool.com/privacy
- Terms: https://invokehumantool.com/terms

## Tools

| Tool | What it does |
| --- | --- |
| `send_handoff` | Send a worksheet, form, approval, review, or sketch to the person. |
| `send_html_handoff` | Send a form the person taps or types. |
| `send_ui_handoff` | Send a HUI 0.1 form. |
| `validate_ui` | Check a HUI document without sending it. |
| `share_handoff` | Invite more people to a handoff. |
| `delegate_handoff` | Forward a handoff you can reassign. |
| `get_handoff_status` | Read one handoff's status. |
| `get_handoff_result` | Read the completed answer. |
| `wait_for_handoff` | Wait until the handoff is submitted. |

The send, share, and delegate tools reach a real person, so clients should treat them as actions that need confirmation.

## Install

Any MCP client that supports remote servers with OAuth: add `https://invokehumantool.com/mcp` and sign in when prompted. Full per-client steps are in [`docs/install.md`](docs/install.md).

Claude Code, from this repo:

```text
/plugin marketplace add abhirupghosh/invoke-human-plugins
/plugin install invoke-human@invoke-human
```

Cursor:

[Add Invoke Human to Cursor](cursor://anysphere.cursor-deeplink/mcp/install?name=invoke-human&config=eyJ1cmwiOiJodHRwczovL2ludm9rZWh1bWFudG9vbC5jb20vbWNwIn0=)

Codex:

```bash
codex mcp add invoke-human --url https://invokehumantool.com/mcp
codex mcp login invoke-human --scopes handoffs
```

## Layout

| Path | Contents |
| --- | --- |
| `server.json` | Official MCP Registry record |
| `glama.json` | Glama maintainer record |
| `skills/invoke-human` | The agent skill (`SKILL.md` plus references) |
| `plugins/chatgpt` | ChatGPT / Codex plugin package |
| `plugins/claude-code` | Claude Code plugin (also listed by `.claude-plugin/marketplace.json`) |
| `plugins/claude-desktop` | Claude Desktop `.mcpb` bundle, a stdio proxy for an existing agent key |
| `plugins/codex` | Codex config example and `AGENTS.md` |
| `plugins/cursor` | Cursor plugin (also listed by `.cursor-plugin/marketplace.json`) |
| `plugins/gemini-cli` | Gemini CLI extension |
| `plugins/grok` | Remote connector settings for Grok |
| `plugins/vscode` | VS Code / Copilot `mcp.json` |
| `plugins/shared` | Shared commands and icons |
| `assets/brand` | The Ping mark (SVG and PNG) |
