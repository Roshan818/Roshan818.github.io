---
layout: post
title: "<<FILL: Reproducing [paper] — what matched and what didn't>>"
date: 2026-09-14
description: "<<FILL: one sentence, shows in the post list and link previews>>"
tags: state-estimation reproduction
categories: paper-reproductions
giscus_comments: false
related_posts: true
---

<!--
RENAME THIS FILE. Jekyll requires YYYY-MM-DD-slug.md and parses the date from the
filename, so the date up top and the date in the name must match.

Structure that works. This is the shape that makes a reproduction post worth
reading, and it is close to the inverse of how most people write them:

1. WHAT YOU SET OUT TO REPRODUCE — two sentences. Paper, the one claim you
   targeted. Not a summary of the method; the reader can open the paper.

2. WHAT YOU BUILT — implemented from the paper, or extended released code?
   Say which. If you used the authors' code unchanged, this isn't a
   reproduction and the post should be framed differently.

3. WHAT THE PAPER DOESN'T TELL YOU — the highest-value section, and the one
   nobody writes. Initialisation, hyperparameters that turned out to matter,
   preprocessing left unstated, a constant that only appears in a figure
   caption. Every choice you had to guess at.

4. RESULTS, INCLUDING THE GAP — your numbers next to theirs. If you got 71%
   against a reported 78%, say so and say what you think accounts for it.
   A close-but-not-matching result honestly reported is far more credible
   than a suspiciously exact match.

5. WHAT YOU'D CHECK NEXT — two or three lines. Shows you have a model of why
   the gap exists rather than just an observation that it does.

Length: 800-1500 words. Long enough to show the work, short enough to finish.

The one failure mode to avoid: writing a tutorial. A clean explanation of the
method demonstrates that you can read. Showing what broke when you built it
demonstrates that you can do research. Only one of those is scarce.

Include the plots. Link the repo at the top and the bottom.

Delete this whole comment block before publishing.
-->

## The claim

<<FILL>>

## What I built

<<FILL>>

## What the paper leaves out

<<FILL>>

## Results

<<FILL — table comparing your numbers to the reported ones>>

## Where the gap comes from

<<FILL>>

---

Code: <<FILL: repo link>>