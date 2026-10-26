# Invoke Human for Gemini CLI

This extension connects the Gemini CLI to Invoke Human at https://invokehumantool.com/mcp. The server asks one person a question and returns the answer. They write on an Apple device or answer a form in the browser. OAuth is enabled and the only requested scope is handoffs. `GEMINI.md` is the context file the CLI reads alongside the extension manifest.

Abhirup Ghosh publishes the extension under the MIT license. Support is https://invokehumantool.com/support. Privacy is https://invokehumantool.com/privacy and terms are https://invokehumantool.com/terms.

Link it from a checkout with `gemini extensions link plugins/gemini-cli`, then run `gemini extensions validate plugins/gemini-cli` and `/mcp auth invoke-human`. A subdirectory install from a GitHub URL is still not reliable, so prefer linking this folder or installing from a repository whose root is the extension.
