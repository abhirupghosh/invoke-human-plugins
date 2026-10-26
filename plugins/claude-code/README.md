# Invoke Human for Claude Code

Invoke Human asks one person a question and brings the answer back to Claude Code. They can write on an Apple device, or tap and type through a form in the browser. This plugin connects Claude to the remote MCP server at https://invokehumantool.com/mcp. Sign-in is OAuth, and the only scope is handoffs. Leave the authorization header empty so Claude opens the browser.

The plugin is published by Abhirup Ghosh under the MIT license. Support is https://invokehumantool.com/support. The privacy policy is https://invokehumantool.com/privacy and the terms are https://invokehumantool.com/terms.

Install it from the public repository with `/plugin marketplace add abhirupghosh/invoke-human-plugins` and then `/plugin install invoke-human@invoke-human`. The commands are `/invoke-human:ask-human` and `/invoke-human:handoff-status`. A pending result from `wait_for_handoff` means the person has not submitted yet, and that is a successful call.
