# HUI 0.1

A UI handoff is a JSON document. The person answers with native controls, or in a browser through the signed link. You get values keyed by field id, plus `summary_text`.

Validate with `validate_ui` before `send_ui_handoff`. The tool runs the worker validator. `ok: false` is still a successful tool call. `diagnostics[]` has `severity` (`error` or `warning`), `code`, `path`, and `message`. Fix errors and call again. Warnings (for example too many inputs on one step) still allow `ok: true`. `send_ui_handoff` rejects an invalid document.

`lenient: true` turns unknown properties into warnings and drops them. Leave it off while you are writing the document.

The closed catalog is `worker/schema/hui-0.1.schema.json` in the Invoke Human repo. This note matches that schema and `worker/src/hui/validate.ts`.

## Document

```json
{ "hui": "0.1", "title": "Short title", "summary": "One line", "children": [] }
```

| Field | Rule |
| --- | --- |
| `hui` | Must be `"0.1"`. |
| `title` | Optional here. 1–140 characters. `send_ui_handoff` still requires its own `title`. |
| `summary` | Optional. Up to 200 characters. Shown as the time estimate or subtitle. |
| `children` | A flat list of nodes. Use this for one screen. |
| `steps` | 1–6 steps. Each step has `id`, `title`, and `children`. |
| `data` | JSON object. Options and text may point into it with `{ "$bind": "/pointer" }`. |

Send `steps` or `children`, not both. `steps` is only at the top. A narrow window shows one step at a time. A wide window scrolls every step.

## Kinds

Display: `markdown`, `heading`, `callout`. They take `text`. `heading` has `level` 1, 2, or 3.

Inputs, each with an `id` and a `label`:

| Kind | Answer | Notes |
| --- | --- | --- |
| `text` | string | `multiline`, `maxLength` 1–8000, `format` `email`, `url`, or `number` |
| `number` | number | `min`, `max`, `step`, `unit` |
| `choice` | one option value | `options` required. `style` is `list`, `menu`, or `segmented` (the renderer may ignore it). `allowOther` adds a write-in. |
| `multichoice` | array of option values | `options` required. `min` and `max` count how many they may pick. |
| `approval` | `{ "value": "approve" }` or `"reject"` | Required unless `required` is false. Label defaults to "Decision". `reason: true` asks for a short reason. |
| `rating` | integer 1 to `max` | `max` is 3–10, default 5. |
| `slider` | number | `min` and `max` required, `min < max`. `step` must be greater than 0. `unit` such as `%`. |
| `toggle` | boolean | Off is a real answer, not a skip. |
| `date` | `YYYY-MM-DD` | Optional `min` and `max` in the same shape. |
| `time` | `HH:MM` | Optional `min` and `max`. |

Structure: `section` and `group` are the same titled block (`label`, `children`). `disclosure` starts closed and needs a `label`. `columns` is two columns on a wide window and a stack on a narrow one. Put extra inputs in a disclosure when a step would otherwise show more than seven inputs that are always visible. That density check is a warning, `too_many_inputs`.

`tone` is `default`, `accent`, or `warning`. `emphasis` is true or false. Colors, fonts, and pixel sizes are rejected.

## Ids, options, expressions

An id matches `^[a-z][a-z0-9_]{0,40}$`, is unique in the document, and is the key in `answers`. `true`, `false`, `null`, and `in` are reserved.

An option is `{ "value": "a", "label": "Friday", "detail": "optional" }`. `id` is accepted as an alias of `value`. Values are unique per field. `"__other__"` is reserved. At most 40 options on a field and 200 in the document. `options` may instead be `{ "$bind": "/plans" }` into `data`, where `/plans` is an array of those option objects. `text` may bind the same way.

`visibleIf` and `requiredIf` are strings, at most 240 characters. Grammar: `== != < > in && || !`, field ids, quoted strings, numbers, `true`, `false`, `null`, and lists. No JavaScript, no function calls. `visible_if` and `required_if` are accepted and stored as the camel-case names. A hidden field is listed in `hidden` and is not required. Referencing a field that does not exist is an error.

## Limits

| Limit | Value |
| --- | --- |
| Document | 200,000 bytes |
| Nodes | 60 |
| Inputs | 40 |
| Steps | 6 |
| Nesting depth | 6 |
| Options | 40 per field, 200 total |
| Always-visible inputs per step | 7, then a warning |
| Diagnostics returned | 40 |

## What you get back

```json
{
  "type": "ui",
  "hui": "0.1",
  "status": "completed",
  "answers": { "plan": "friday", "decision": { "value": "approve" } },
  "summary_text": "Ship when?: Friday · Approved",
  "skipped": ["note"],
  "hidden": [],
  "uploads": []
}
```

`skipped` lists inputs they left empty. `summary_text` is a one-line rendering of the answers. Read `answers` when you need the raw values. `answer` adds `via` (`link` or `device`) and, when the client sent them, `device`, `size_class`, and `duration_ms`.
