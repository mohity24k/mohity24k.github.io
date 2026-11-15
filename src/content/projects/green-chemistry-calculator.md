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
placeholder: [date, cover, liveUrl, codeUrl, body]
---

## Problem

Working out green chemistry and reaction metrics automatically from a written procedure.

<!-- TODO(mohit): who this is for and what prompted it. -->

## What I built

A pipeline that goes from a document to a scorecard:

1. **PDF extraction** of the reaction details
2. Conversion of the compounds to **SMILES**
3. Calculation of **PMI**, **Atom Economy**, **E-Factor** and **EcoScale**, plus **GHS** hazard information
4. A **Streamlit dashboard** to explore the results

<!-- TODO(mohit): add detail on each step. -->

## Results

A Streamlit dashboard that reports the metrics above.

<!-- TODO(mohit): what it can process today, an example reaction and its scores. -->

## Stack

Streamlit.

<!-- TODO(mohit): add the rest of the stack (PDF parsing, cheminformatics libraries). -->
