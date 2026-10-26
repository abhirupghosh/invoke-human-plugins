---
description: Send one question to the person and wait for the answer
---

Send one clear ask through the Invoke Human server `https://invokehumantool.com/mcp`.

1. Read the invoke-human skill and pick a type. A yes or no, a choice, or a short form is `send_ui_handoff`. Work on a page is `send_handoff`. Prefer HUI over `send_html_handoff`.
2. Call `validate_ui` before `send_ui_handoff`. `ok: false` is a successful tool call. Fix the document and validate again.
3. Send once. A second send creates a second handoff.
4. Call `wait_for_handoff` with the returned id. `status: pending` is success. Call it a few more times if they are likely at the device, then stop and say the handoff is waiting.
5. Grade a HUI or HTML result from `answers`. Grade a worksheet from the PDF. The handwriting transcript is a hint.

Claude Code can follow an MCP task natively once this server returns a task handle. That change is separate. Until it ships, call `wait_for_handoff`.

The argument is the question to ask. If it is empty, ask what they want to send before you create a handoff.
