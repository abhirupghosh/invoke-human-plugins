# Invoke Human for VS Code and Copilot

`mcp.json` is the VS Code MCP config. `copilot.mcp.json` is the same server in the shape Copilot expects. Both point at https://invokehumantool.com/mcp and leave the OAuth client id unset so the editor can register a public client. The scope to approve is handoffs. There is no marketplace package for this host. Copy the file you need into the project or into your Copilot MCP config.

The server asks one person and returns the answer, either as a filled PDF or as structured JSON. Abhirup Ghosh publishes these config files under the MIT license. Support is https://invokehumantool.com/support. Privacy is https://invokehumantool.com/privacy and terms are https://invokehumantool.com/terms. Do not commit an access token next to these files.
