---
title: Hindi Text-to-Speech with XTTS-v2
summary: A fine-tune of XTTS-v2 for Hindi speech on about 10 hours of audio, lowering eval loss by 12.7%.
world: lab
tags: [ai]
status: completed
date: 2025-06-01
platform: github
metrics:
  - value: "−12.7%"
    label: eval loss
  - value: "4,586"
    label: clips · about 10 h of audio
art: waveform
featured: true
featuredOrder: 3
# TODO(mohit): replace each of these, then remove it from the list.
#   date     → the real completion date
#   cover    → add `cover: ./hindi-tts-xtts.png` (and `coverAlt`)
#   codeUrl  → add `codeUrl: https://github.com/...`
# TODO(mohit): the write-up below states only what is on your CV. To finish it:
#   - Why Hindi TTS, and what the base model got wrong.
#   - Data preparation, training setup.
#   - Add audio samples if you can share them.
#   - Add the rest of the stack (framework, data tooling, training hardware).
placeholder: [date, cover, codeUrl, body]
---

## Problem

Hindi speech synthesis with an open text-to-speech model.

## What I built

A fine-tune of **XTTS-v2** on roughly **10 hours** of Hindi audio, split into **4,586 clips**.

## Results

- Eval loss down **12.7%**

## Stack

XTTS-v2.

