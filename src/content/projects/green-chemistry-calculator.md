---
title: Automated Green Chemistry & Reaction Metrics Calculator
summary: Pulls reactions out of PDFs, converts them to SMILES and scores them on PMI, atom economy, E-factor, EcoScale and GHS hazards.
world: lab
tags: [chemistry, pharma]
status: completed
date: 2025-09-01
platform: streamlit
featured: true
featuredOrder: 2
# TODO(mohit): replace each of these, then remove it from the list.
#   date     → the real completion date
#   cover    → add `cover: ./green-chemistry-calculator.png` (a dashboard screenshot works well)
#   liveUrl  → add `liveUrl: https://<your-app>.streamlit.app`
#   codeUrl  → add `codeUrl: https://github.com/...`
# TODO(mohit): the write-up below states only what is on your CV. To finish it:
#   - Who this is for and what prompted it.
#   - Add detail on each step.
#   - What it can process today, an example reaction and its scores.
#   - Add the rest of the stack (PDF parsing, cheminformatics libraries).
placeholder: [date, cover, liveUrl, codeUrl, body]
---

## Problem

Working out green chemistry and reaction metrics automatically from a written procedure.

## What I built

A pipeline that goes from a document to a scorecard:

1. **PDF extraction** of the reaction details
2. Conversion of the compounds to **SMILES**
3. Calculation of **PMI**, **Atom Economy**, **E-Factor** and **EcoScale**, plus **GHS** hazard information
4. A **Streamlit dashboard** to explore the results

## Results

A Streamlit dashboard that reports the metrics above.

## Stack

Streamlit.

