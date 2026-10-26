# Waiting for an answer

Create returns an id like `hnd_...`. Keep that id. Status is `new`, then `in_progress` once a device or the signed link is opened, then `completed` after submit.

## How to poll

1. Call `wait_for_handoff` with `{ "id": "hnd_..." }`. Optional `timeout_ms` is an integer from 0 to 25000. The default is 20000.
2. A completed handoff returns the result JSON below. Use it.
3. `{ "status": "pending" }` means they have not finished. The tool call succeeds. `detail` says to call again. Pending may include `routing`, `answers` so far, and `answered_by`.
4. Repeat a few times if they are likely to answer now. Then stop. Report that the handoff is waiting. Do the parts of the task that do not need the answer.
5. `get_handoff_result` is the same read without blocking. `get_handoff_status` returns the handoff object (type, title, status, source, file paths) and does not wait for completion.

Cursor, Claude Code, and Codex do not wake you when the device submits. `wait_for_handoff` is the path that returns the answer. A `callback_url` on create is a public `https` endpoint the inbox POSTs after submit. The submit still succeeds if that endpoint fails. Polling the result is the source of truth. The webhook does not carry file bytes.

The device can submit once. A later submit is 409. While the handoff is still open, `get_handoff_result` returns pending, and that result is a successful tool call.

## HUI and HTML

```json
{
  "id": "hnd_...",
  "type": "ui",
  "status": "completed",
  "recognized_text": null,
  "answers": { "decision": { "value": "approve" } },
  "summary_text": "Approved",
  "skipped": [],
  "hidden": [],
  "uploads": [],
  "answer": { "via": "device" },
  "files": { "pdf": null, "pages": [] }
}
```

Grade from `answers`. There is no handwriting transcript. `recognized_text` is null. HTML uses the same result shape with `type: "html"`. File fields show up in `uploads` as `{ "field", "filename", "content_type", "bytes", "path" }` and are copied onto `answers[field]`. Download `path` with your bearer token.

## Worksheet and other pencil types

```json
{
  "id": "hnd_...",
  "type": "worksheet",
  "status": "completed",
  "recognized_text": "--- page 1 ---\n...",
  "page_count": 1,
  "files": {
    "pdf": "/handoffs/hnd_.../files/result.pdf",
    "pages": ["/handoffs/hnd_.../files/page-1.png"]
  }
}
```

`page_count` on the result is how many PNGs came back. `files.pdf` is the filled PDF. `GET /handoffs/:id/result.pdf` is that file. `recognized_text` comes from on-device Vision, includes the printed problems, and mangles math. Grade from the PDF. Treat the transcript as a hint.

## Pending shape

```json
{
  "id": "hnd_...",
  "status": "pending",
  "detail": "Not completed yet. Call wait_for_handoff again.",
  "answers": [],
  "answered_by": null
}
```

`answered_by` on a completed result is the user who submitted (`user_id`, `display_name`, `handle`, `email`). With `routing: "all"`, each person submits, and completion waits until every answerer has. Other recipients see who answered. They do not see someone else's ink.

## Claude Code tasks

Claude Code 2.1.304 and later can follow an MCP task after the tool call returns, including after you leave the session. This server does not return a task handle yet. A separate change will teach `wait_for_handoff` to do that. Until it ships, call `wait_for_handoff` yourself.

## Errors

401 means the token is missing or revoked. 403 means the key's role cannot do that. 404 means the id is missing or belongs to another account. An empty object is not how a foreign id looks.
