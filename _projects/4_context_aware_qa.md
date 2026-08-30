---
layout: page
title: Context-Aware Document Q&A
description: Retrieval-augmented generation over PDFs and web content, with a Streamlit interface.
img: assets/img/projects/rag.png
importance: 4
category: software
github: https://github.com/Roshan818/ContextAwareQ-A
---

A retrieval-augmented generation system for querying documents in natural language.

**Pipeline.** Documents (PDFs or scraped web content) are chunked and embedded with
sentence-transformers, indexed in a FAISS vector store, and retrieved at query time to
condition a Gemini call. A Streamlit front end handles upload and chat.

<<FILL: The decisions worth writing about. Chunk size and overlap — what did you settle
on and why? How many chunks do you retrieve? Did you try reranking? Where does it still
fail — questions spanning multiple documents, tables, anything needing numbers?

Retrieval quality is where every RAG system actually lives or dies, and a page that
discusses it honestly reads completely differently from one that lists the stack.>>

<<TODO: deploy on Streamlit Community Cloud (free) and link it. It's already a Streamlit
app, so this is close to zero work and turns the page into something someone can try.>>