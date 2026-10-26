---
description: Read the status and answer of a handoff
---

Read a handoff on the signed-in Invoke Human account. Do not invent an id.

1. Use the id the person named, or the id from the handoff you just sent. An id looks like `hnd_...`. If you have neither, say so and stop.
2. Call `get_handoff_status` with that id.
3. If the status is `completed`, call `get_handoff_result` and report `answers` or the PDF path. If it is still open, say the status and stop. `get_handoff_result` may also return `status: pending`, which is success.
4. Another account's id is not found. Do not guess a different account.

The argument is the handoff id.
