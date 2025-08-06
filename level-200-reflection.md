# Level 200 Code Comparison – Hendrine Zeraua

_Comparing my Level 100 project with Mohamed Ibrahim’s Level 100 implementation_

## Differences

- Mohamed’s project uses one large function `makePageForEpisodes`, while I split mine into smaller ones.
- He uses 3-column CSS grid right away, whereas I originally used 4 columns and later updated it.
- My project uses a `<template>` element to build cards; Mohamed’s version creates them in one loop.

## What I Prefer About My Version

- More colorful and visually engaging design.
- Cleaner function breakdown using `createEpisodeCard()`.
- I added comments and used semantic HTML tags.

## What I Prefer About Their Version

- Code is simple, clean, and very easy to follow.
- CSS Grid layout is consistent and well-spaced.
- Less overcomplication — it "just works."

## What I Learned

- Simpler code is often easier to understand and change.
- CSS Grid with `repeat(3, 1fr)` is a clean way to do responsive layouts.
- It’s helpful to use clear variable names like `episodeList` and `card`.
