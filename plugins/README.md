# Invoke Human client packages

The remote server is `https://invokehumantool.com/mcp`. Sign-in is OAuth 2.1 with PKCE S256 and dynamic client registration. The only scope is `handoffs`. No package in this tree contains a token, a client secret, or a password.

Each directory is self-contained, with its own README, MIT license, and (where the host loads one) a copy of the `skills/invoke-human` skill.

| Directory | Client |
| --- | --- |
| `chatgpt` | ChatGPT and Codex plugin (`plugin.json`, `mcp.json`, skill) |
| `claude-code` | Claude Code plugin (`.claude-plugin/plugin.json`, `.mcp.json`, commands, skill) |
| `claude-desktop` | Claude Desktop MCPB bundle (local stdio proxy for an agent key) |
| `codex` | Codex `config.toml` example, `AGENTS.md`, skill |
| `cursor` | Cursor plugin (`.cursor-plugin/plugin.json`, `mcp.json`, rules, commands, skill) |
| `gemini-cli` | Gemini CLI extension (`gemini-extension.json`, `GEMINI.md`, skill) |
| `grok` | Connector settings to add in chat |
| `vscode` | VS Code and Copilot `mcp.json` |
| `shared` | Commands and icons shared by the packages |

Install steps for each client are in [`../docs/install.md`](../docs/install.md).
