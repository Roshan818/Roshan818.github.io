---
layout: page
title: Domain-Specific Question Answering
description: Inter-IIT Tech Meet — gold medal, DevRev problem statement.
img: assets/img/projects/devrev.jpg
github: https://github.com/Roshan818/Inter-IIT-11-Devrev
importance: 5
category: research
---

Team entry for DevRev's "Expert Answers in a Flash" problem statement at the 11th Inter-IIT
Tech Meet (Dec 2022 – Feb 2023), which won gold.

**The problem.** Cut down how many support queries reach a human agent: given a user's
question, find the knowledge-base article that answers it and highlight the answer span.
Concretely, (1) decide whether a question is answerable from a set of themed paragraphs and
return the right paragraph, and (2) predict the exact answer text and its start index. The
training data was a subset of SQuAD 2.0, and the pipeline was judged on accuracy, latency and
resource use together.

**The approach.** The final pipeline had three stages:

1. **Previously answered questions.** Paraphrase known questions with a T5 paraphraser and
   fuzzy-match incoming queries against them, so repeats skip the expensive path.
2. **Sentence retrieval.** Retrieve a dynamically chosen top-K of sentences as context. The
   retriever was trained without labels using GenQ: generate synthetic queries for unlabeled
   passages, then fine-tune a bi-encoder on the (query, passage) pairs with Multiple
   Negatives Ranking loss. NER-based re-ranking kept the candidates relevant.
3. **Question answering** on the retrieved context, optimised with ONNX export and
   quantisation (fastT5), bringing latency down to about 250 ms.

{% include figure.liquid loading="eager" path="assets/img/projects/devrev.jpg" title="Final pipeline" class="img-fluid rounded z-depth-1" %}

**Team:** [@SpyzzVVarun](https://github.com/SpyzzVVarun), [@amish1706](https://github.com/amish1706),
[@Nidhi15-02](https://github.com/Nidhi15-02), [@Roshan818](https://github.com/Roshan818).

**Documents:** [Final report](/assets/pdf/devrev_final_report.pdf) ·
[Code](https://github.com/Roshan818/Inter-IIT-11-Devrev)

{% comment %}<<FILL: The problem statement in two sentences — what had to be answered, over what
corpus, and under what constraint (latency? no fine-tuning? limited compute?).>>{% endcomment %}

{% comment %}<<FILL: The approach. Your repo tags mention GenQ, fastT5 and domain-specific QA, so
presumably synthetic query generation for retriever training plus a distilled/quantised
T5 for inference. Describe what you actually did rather than the tag list.>>{% endcomment %}

{% comment %}<<FILL: What you personally owned. This was a team entry, and admissions committees read
Inter-IIT entries knowing they're team efforts. Naming your specific contribution is more
credible than describing the whole system as though you built all of it.>>{% endcomment %}

**Result.** Gold medal at Inter-IIT Tech Meet 11.0.