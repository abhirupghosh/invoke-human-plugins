# Examples

`from_agent` is the name on the device. `title` is the ask. Pass `source` when a session name will help them recognize which chat sent it.

## One question

Validate, then send. If they do not answer by Friday, the default in the label is the one you will use.

```json
{
  "title": "Ship 3.2?",
  "from_agent": "release",
  "due": "2026-10-16",
  "ui": {
    "hui": "0.1",
    "title": "Ship 3.2?",
    "summary": "One tap",
    "children": [
      {
        "kind": "markdown",
        "text": "I will ship on Friday if you do not answer."
      },
      {
        "kind": "approval",
        "id": "decision",
        "label": "Ship 3.2 on Friday?",
        "reason": true
      }
    ]
  }
}
```

Call `validate_ui` with `{ "ui": <the ui object> }`. On `ok: true`, call `send_ui_handoff` with the object above. The completed `answers.decision.value` is `approve` or `reject`. A reason, when they wrote one, is `answers.decision.reason`.

A choice, when the answer is not yes or no:

```json
{
  "hui": "0.1",
  "children": [
    {
      "kind": "choice",
      "id": "plan",
      "label": "Ship when?",
      "required": true,
      "options": [
        { "value": "friday", "label": "Friday", "detail": "Default" },
        { "value": "monday", "label": "Monday" }
      ]
    }
  ]
}
```

## Worksheet

Use `send_handoff` when they should write on the page. Markdown is the shortest worksheet. `$...$` marks a small bit of math.

```json
{
  "type": "worksheet",
  "from_agent": "tutor",
  "title": "Warmup",
  "due": "2026-10-14",
  "problems": [
    { "prompt": "Solve $x^2 - 1 = 0$.", "answer_lines": 6 }
  ]
}
```

`answer_lines` is 1–30 and defaults to 6. Up to 40 problems. When it is completed, download `files.pdf` and grade that. Use `recognized_text` only as a hint.

A sketch uses the same tool with `"type": "sketch"` and a `prompt` instead of problems.

## A short form

Two fields, one of them conditional. Validate before sending.

```json
{
  "title": "Launch plan",
  "from_agent": "release",
  "due": "2026-10-16",
  "instructions": "About a minute.",
  "ui": {
    "hui": "0.1",
    "title": "Launch plan",
    "summary": "Two answers",
    "children": [
      {
        "kind": "choice",
        "id": "plan",
        "label": "Ship when?",
        "required": true,
        "options": [
          { "value": "friday", "label": "Friday" },
          { "value": "monday", "label": "Monday" }
        ]
      },
      {
        "kind": "slider",
        "id": "rollout",
        "label": "Rollout",
        "min": 1,
        "max": 100,
        "step": 1,
        "unit": "%",
        "visibleIf": "plan == 'friday'"
      },
      {
        "kind": "text",
        "id": "note",
        "label": "Note",
        "multiline": true,
        "required": false
      }
    ]
  }
}
```

`rollout` is absent from `answers` when Monday is selected, and its id is in `hidden`. `note` is in `skipped` when they leave it blank.

A worked launch plan with steps, a disclosure, and bound options is `examples/launch-plan.hui.json` in the repo. Copy the shape, then cut it down. Most asks do not need two steps.
