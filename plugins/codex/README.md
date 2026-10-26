# Invoke Human for Codex

Codex reaches Invoke Human as a remote MCP server. Paste `config.example.toml` into `~/.codex/config.toml`, or run `codex mcp add invoke-human --url https://invokehumantool.com/mcp` and then `codex mcp login invoke-human --scopes handoffs`. Leave the bearer line commented out so Codex starts OAuth instead of reading a token from the environment.

The skill in this folder tells Codex when to ask a person and how to wait. A pending `wait_for_handoff` result is success. Sending again creates a second handoff.

Abhirup Ghosh publishes this package under the MIT license. Support is https://invokehumantool.com/support. Privacy is https://invokehumantool.com/privacy and terms are https://invokehumantool.com/terms. The public ChatGPT directory uses the sibling `chatgpt` package, which carries the same server.
