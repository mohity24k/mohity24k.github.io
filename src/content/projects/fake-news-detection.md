---
title: Multimodal Fake News Detection
summary: A BERT + ResNet-50 model that reads a post's text and image together to flag fake news.
world: lab
tags: [ai, research]
status: completed
date: 2025-03-01
platform: github
metrics:
  - value: "91.7%"
    label: accuracy / F1
  - value: "20%"
    label: fewer errors than text-only
featured: true
featuredOrder: 1
# TODO(mohit): replace each of these, then remove it from the list.
#   date     → the real completion date
#   cover    → add `cover: ./fake-news-detection.png` (and `coverAlt`)
#   codeUrl  → add `codeUrl: https://github.com/...`
placeholder: [date, cover, codeUrl, body]
---

## Problem

Detecting fake news from a post's text and its image together, instead of from the text alone.

<!-- TODO(mohit): one or two sentences on the dataset and why this problem interested you. -->

## What I built

A multimodal classifier that combines **BERT** for the text with **ResNet-50** for the image.

<!-- TODO(mohit): how the two branches are fused, how it was trained. -->

## Results

- **91.7%** accuracy / F1
- **20%** error reduction compared with a text-only baseline

## Stack

BERT, ResNet-50.

<!-- TODO(mohit): add the rest of the stack (framework, libraries, training hardware). -->
