---
name: invoke-human
description: Ask a person through Invoke Human (MCP at invokehumantool.com, tools send_ui_handoff and validate_ui) when a decision, approval, worksheet, sketch, or form needs a human. Use for HUI 0.1 documents, picking a handoff type, waiting on answers, and the etiquette of one clear ask. Decide yourself when the task already has an answer.
---

# Invoke Human

Invoke Human sends a handoff to one person's Apple devices. They answer on the device, or in a browser. You get structured answers, or a filled PDF.

The remote MCP server is `https://invokehumantool.com/mcp`. Sign-in is OAuth 2.1 with PKCE, dynamic client registration, and scope `handoffs`. If `send_ui_handoff` and `validate_ui` are missing, stop and ask the person to connect that server. Install steps live in the repo at `docs/install.md`. Installable client packages live at `plugins/README.md`.

## When to ask

Ask when the outcome depends on something only that person knows or should own:

- a decision they must make (ship, approve, pick)
- a preference you cannot defend from the task, the repo, or what they already said
- handwriting, a markup of a page, or a sketch
- a review of text you should not send on their behalf

Decide yourself when the task already answers it, a documented default is safe, or you can undo the choice. Proceed, and say what you assumed. A handoff is for a real ask, not a courtesy ping.

## Pick a type

| You need | Send | They do |
| --- | --- | --- |
| One question | `send_ui_handoff` with a single input | Tap an answer |
| A worksheet, review, or sketch on paper | `send_handoff` | Write or draw; you get a PDF |
| Several fields | `send_ui_handoff` with `children` or `steps` | Fill a form |

A question is one `approval`, `choice`, or `text`. Use a worksheet (`type: "worksheet"`, markdown or `problems`) when the answer is work on a page, including math. Use `approval`, `review`, or `sketch` on `send_handoff` when the page itself is the point. Use a HUI form when you need more than one value back as JSON.

`send_html_handoff` is the older tap-and-type path. Prefer HUI. Pencil types come back as a PDF and a handwriting transcript. Grade the PDF. The transcript includes the printed prompt and is often wrong on math.

## Write a small HUI document

A document is JSON: `"hui": "0.1"`, and either `children` or `steps`. Sending both is invalid. No HTML, CSS, colors, fonts, or JavaScript.

Call `validate_ui` with `{ "ui": <document> }` before `send_ui_handoff`. `{ "ok": false, "diagnostics": [...] }` is a successful tool call. Read `path`, `code`, and `message`, fix the document, and validate again. Send only when `ok` is true. Leave `lenient` unset so unknown properties stay errors.

`send_ui_handoff` requires `title`, `from_agent`, and `ui`. `from_agent` is the short name on the device.

One question:

```json
{
  "hui": "0.1",
  "title": "Ship 3.2?",
  "children": [
    {
      "kind": "approval",
      "id": "decision",
      "label": "Ship 3.2 on Friday?",
      "required": true
    }
  ]
}
```

Field ids match `^[a-z][a-z0-9_]{0,40}$`. `approval` is required unless you set `required: false`. The stored value is `{ "value": "approve" }` or `{ "value": "reject" }`, and includes `reason` when you set `reason: true`. `visibleIf` and `requiredIf` use `== != < > in && || !` plus field ids, strings, numbers, `true`, `false`, `null`, and lists.

An agent key does not receive `answer_url`. The owner key and the account's device key do, for an HTML or UI handoff whose routing is `owner`. That link can be used once. Leave it out of the chat, commits, and issues. A view, answer, or reassign share does not receive it. Those people answer with the device key.

Catalog, expressions, limits, and diagnostics: [references/hui.md](references/hui.md). The closed schema is `worker/schema/hui-0.1.schema.json`. The worker validator, which `validate_ui` runs, is the source of truth. Product notes are in `docs/hui.md`.

## Wait

Status moves from `new` to `in_progress` when they open it, then to `completed` on submit.

Call `wait_for_handoff` with the id. It blocks about 20 seconds (maximum 25) and returns either the completed result or `{ "status": "pending" }`. Pending is a successful tool call. Call it again a few times while they are likely at the device. Then stop. Tell them the handoff is waiting, and continue only the work that does not depend on the answer.

`get_handoff_result` is the same check without the wait. `get_handoff_status` reads type, title, and status. Another account's id is a 404.

A completed HUI or HTML result is `answers` keyed by field id, plus `summary_text` on HUI. A completed worksheet result is PDF and page paths. Download those paths with the same bearer token. Result shapes: [references/waiting.md](references/waiting.md).

## Etiquette

- One clear ask. The title is the question. Add `instructions` only when the title is not enough.
- Offer a default you can defend, as the first choice or in the label, and say what you will do if they do not answer by `due`.
- Set `due` when lateness matters. `YYYY-MM-DD` is stored as `T23:59:59Z` that day. A full ISO timestamp is stored as given.
- Keep a form answerable in a minute or two. Prefer one step. A second step needs a reason. Seven always-visible inputs on a step is the comfort line; more is a warning.
- Send once. A second send creates a second handoff. There is no idempotency key.
- Required fields are the ones you cannot proceed without. Everything else stays optional.

## Examples

Question, after `validate_ui` returns `ok: true`:

```json
{
  "title": "Ship 3.2?",
  "from_agent": "release",
  "due": "2026-10-16",
  "ui": {
    "hui": "0.1",
    "children": [
      { "kind": "approval", "id": "decision", "label": "Ship 3.2 on Friday?" }
    ]
  }
}
```

Worksheet, via `send_handoff`. Grade the PDF when it comes back.

```json
{
  "type": "worksheet",
  "from_agent": "tutor",
  "title": "Warmup",
  "problems": [{ "prompt": "Solve $x^2 - 1 = 0$.", "answer_lines": 6 }]
}
```

A form adds fields to `children`. Put a follow-up behind `visibleIf`, naming another field id, so it stays hidden until it matters:

```json
{ "kind": "slider", "id": "rollout", "label": "Rollout", "min": 1, "max": 100, "step": 1, "unit": "%", "visibleIf": "plan == 'friday'" }
```

Full payloads, including a choice and the conditional form, are in [references/examples.md](references/examples.md).
