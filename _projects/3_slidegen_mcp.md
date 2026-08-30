---
layout: page
title: SlideGen — an MCP toolchain
description: Three Model Context Protocol servers turning documents into structured slide decks.
img: assets/img/projects/slidegen.png
importance: 3
category: software
github: https://github.com/Roshan818/SlideGen_MCP
---

Three Model Context Protocol servers that together handle a document-to-deck workflow,
wired into Claude Desktop through its JSON server config and managed with
[`uv`](https://github.com/astral-sh/uv).

- **`documentation`** — scrapes a webpage and summarises it
- **`pdf_analyzer`** — extracts and processes content from PDFs
- **`ppt_generator`** — turns the extracted content into structured PowerPoint slides

**Why MCP.** The interesting constraint is that each server has to expose its capability
as a tool description clear enough for a model to choose it correctly without being told.
Most of the work was not the PowerPoint generation — it was designing tool boundaries so
the model reaches for the right server unprompted.

<<FILL: What broke, and what you'd do differently. Anything about how you had to phrase
tool descriptions before the model used them properly is the most interesting content
here, because almost nobody writes that part down.>>