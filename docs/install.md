# Install

The hosted MCP server is `https://invokehumantool.com/mcp`. Connecting without an `Authorization` header starts OAuth 2.1 (PKCE S256). The server registers public clients at `POST /register` (`token_endpoint_auth_method: none`) and accepts a client id that is an `https` URL. The only scope is `handoffs`. Access tokens last one hour. Refresh tokens last 30 days. A static agent key still works as `Authorization: Bearer wk_...` and skips the browser.

Discovery:

- `https://invokehumantool.com/.well-known/oauth-protected-resource/mcp`
- `https://invokehumantool.com/.well-known/oauth-authorization-server`

The agent skill ships at [`skills/invoke-human`](../skills/invoke-human). Copy that directory and keep the folder name `invoke-human`. The file the host reads is `SKILL.md`. Installable packages for each client are in [`plugins/README.md`](../plugins/README.md). Each package carries its own copy of this skill. The steps below are the manual path, for a host that is not using a package.

| Host | Where to put the skill |
| --- | --- |
| Claude Code, this project | `.claude/skills/invoke-human` |
| Claude Code, all projects | `~/.claude/skills/invoke-human` |
| Codex, this project | `.agents/skills/invoke-human` |
| Codex, all projects | `~/.agents/skills/invoke-human` |
| Cursor, this project | `.agents/skills/invoke-human` or `.cursor/skills/invoke-human` |
| Cursor, all projects | `~/.agents/skills/invoke-human` or `~/.cursor/skills/invoke-human` |

Cursor also loads `.claude/skills`, `.codex/skills`, and the same folders under your home directory.

## Claude Code

Leave the header off so Claude Code starts OAuth. Then run `/mcp` and authenticate, or `claude mcp login invoke-human`.

```bash
claude mcp add --transport http invoke-human https://invokehumantool.com/mcp
```

Install the skill next to that server. From a checkout of this repo:

```bash
mkdir -p ~/.claude/skills
cp -R skills/invoke-human ~/.claude/skills/invoke-human
```

Claude Code watches `~/.claude/skills` once that directory exists. If this is the first skill on the machine, restart Claude Code so it starts watching. For one repository, copy into `.claude/skills/invoke-human` and commit it if the team should share it.

A static agent key:

```bash
claude mcp add --transport http invoke-human https://invokehumantool.com/mcp \
  --header "Authorization: Bearer ${HANDOFFS_TOKEN}"
```

Docs: <https://code.claude.com/docs/en/mcp> and <https://code.claude.com/docs/en/skills>

## Claude (claude.ai and Claude Desktop)

Remote MCP is a custom connector. Claude connects to it from Anthropic's network, including when you add it in Claude Desktop. Free plans can add one custom connector.

Pro and Max:

1. Open Customize → Connectors.
2. Choose + Add, then Add custom connector.
3. Name it `Invoke Human`.
4. Paste `https://invokehumantool.com/mcp` and continue.
5. Review the authentication Claude detected.
6. Under Authentication, choose Sign in now, or Sign in when needed.
7. Under OAuth client, choose Register automatically. That uses dynamic client registration. Claude's published identity also works, because a client id that is an `https` URL is accepted.
8. Add the connector and finish sign-in. The consent screen is for scope `handoffs`.

Team and Enterprise: an Owner adds it first under Organization settings → Connectors → Add → Custom → Web, with the same name, URL, and OAuth choices. Members then open Customize → Connectors and choose Connect.

Turn the connector on for a chat from the + menu, then Connectors.

### Desktop bundle

An `.mcpb` bundle cannot point at this server. Manifest schema 0.4 requires a local stdio process (`server.type` of `python`, `node`, `binary`, or `uv`) and rejects unknown fields. A remote URL is an open proposal, not a field you can ship ([modelcontextprotocol/mcpb#176](https://github.com/modelcontextprotocol/mcpb/issues/176)).

`plugins/claude-desktop/invoke-human.mcpb` is a stdio proxy for an agent key you already have. Leave the key blank and use the custom connector above when you want the browser sign-in. Directory review uses the remote URL, not the bundle. Install the file from Claude Desktop → Settings → Extensions → Advanced → Install Extension.

Guide: <https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp>

## ChatGPT

Developer mode, then a custom MCP connector.

1. Turn on Developer mode. In Settings → Apps (or Connectors) → Advanced settings, enable Developer mode. On a workspace, an admin enables it first under Workspace Settings → Permissions & Roles → Connected Data / Create custom MCP connectors.
2. Open [ChatGPT plugins](https://chatgpt.com/plugins), choose the plus button, then Add custom MCP server.
3. Name it `Invoke Human`. Set the server URL to `https://invokehumantool.com/mcp`. Set authentication to OAuth.
4. If the form offers Scan tools, run it and finish the OAuth prompt before you create the connector.
5. Confirm the risk notice, create the plugin, then install it and enable it in a chat.

The authorization request must use the scope `handoffs` and no other scope. `offline_access` is not advertised, and a request that includes it is rejected. Refresh tokens are still issued with the authorization-code grant and last 30 days. If ChatGPT asks you to sign in again after the access token expires, that is the reconnect path.

Docs: <https://developers.openai.com/api/docs/guides/custom-mcp-server> and <https://help.openai.com/en/articles/12584461-developer-mode-and-mcp-apps-in-chatgpt>

## Cursor

One click installs the server. Cursor asks before it writes the config, then starts OAuth because the server answers unauthenticated calls with `401`. Leave headers unset so dynamic client registration runs. The scope it should request is `handoffs`.

[Add Invoke Human to Cursor](cursor://anysphere.cursor-deeplink/mcp/install?name=invoke-human&config=eyJ1cmwiOiJodHRwczovL2ludm9rZWh1bWFudG9vbC5jb20vbWNwIn0=)

```text
cursor://anysphere.cursor-deeplink/mcp/install?name=invoke-human&config=eyJ1cmwiOiJodHRwczovL2ludm9rZWh1bWFudG9vbC5jb20vbWNwIn0=
```

The `config` value is the base64 encoding of `{"url":"https://invokehumantool.com/mcp"}`.

The same entry in `~/.cursor/mcp.json`, or in a project `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "invoke-human": {
      "url": "https://invokehumantool.com/mcp"
    }
  }
}
```

Copy the skill into `.agents/skills/invoke-human` (this project) or `~/.cursor/skills/invoke-human` (every project on this machine).

Docs: <https://cursor.com/docs/mcp/install-links> and <https://cursor.com/docs/skills>

## Codex

```bash
codex mcp add invoke-human --url https://invokehumantool.com/mcp
codex mcp login invoke-human --scopes handoffs
```

Or in `~/.codex/config.toml`. Omit `bearer_token_env_var` so Codex uses OAuth.

```toml
[mcp_servers.invoke-human]
url = "https://invokehumantool.com/mcp"
```

A headless agent key, with the variable name rather than the token:

```toml
[mcp_servers.invoke-human]
url = "https://invokehumantool.com/mcp"
bearer_token_env_var = "HANDOFFS_TOKEN"
```

Copy the skill to `~/.agents/skills/invoke-human`, or to `.agents/skills/invoke-human` in a repository Codex is launched from.

Docs: <https://developers.openai.com/codex/mcp> and <https://developers.openai.com/codex/skills>
