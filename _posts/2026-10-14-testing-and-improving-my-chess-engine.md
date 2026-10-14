---
layout: post
title: "Testing and improving my chess engine: from about 1060 to about 1650"
date: 2026-10-14
description: "Three years later I came back to my chess engine, tested its rules properly, measured its strength against Stockfish, and improved it one measured change at a time."
tags: chess search python
categories: projects
giscus_comments: false
related_posts: false
---

In 2023 I wrote a chess engine in Python (how it works is in the
[previous post](/blog/2023/building-a-chess-engine/)). Back then I never measured it properly.
Three years later I came back to it with one rule: **nothing counts unless it is measured.**
First the rules, then the strength, then every change, one at a time.

## Step 1: are the rules even right?

A chess engine can play convincing games while still getting rare rules wrong, and you would
never notice by playing it. So before touching the AI, I tested move generation against two
references.

**Perft.** "Performance test" is the standard check: from a given position, count every
possible sequence of moves to a fixed depth. From the starting position there are exactly 20
positions after one move, 400 after two, and 8,902 after three. These numbers are published for
a set of tricky test positions, so if your count is off by even one, you have a bug.

**A second opinion.** I also played thousands of random games and, at every move, compared my
engine's list of legal moves with [python-chess](https://python-chess.readthedocs.io/), a
well-tested chess library.

The first run was humbling: **28 of 150 random games** hit a position where the two disagreed.
Chasing them down found six real bugs, all in rare situations:

- When a **black** rook moved, the code removed **white's** castling rights (a copy-paste slip).
- Undoing a move could corrupt the castling history, because the current castling rights and the
  saved history were the same object in memory.
- Castling ignored squares attacked by pawns, so the king could castle through an attacked square.
- A pinned pawn was not allowed to step forward along its own pin line, which is legal.
- En passant is the classic trap. When your king and an enemy rook are on the same rank and an
  en passant capture removes **two** pawns from that rank at once, it can expose your king. The
  check for this kept scanning past the rook and treated the king behind it as a blocker.
- Capturing a checking pawn en passant was not recognised as a way out of check, because the
  capturing pawn doesn't land on the checker's square.

After fixing them, the engine agreed with python-chess on every one of **573,257 positions** in
3,000 random games, and these tests now run automatically on every change. The lesson: "it plays
fine" says nothing about correctness. Only an independent reference does.

## Step 2: how strong is it, really?

I had once believed this engine was around 1800. To find out properly, I played it against
**Stockfish**, the strongest open-source engine, limited to a fixed rating with its `UCI_Elo`
setting. The lowest setting is 1320.

To keep the test fair:

- **100 games per match**, at 20 seconds per side plus 0.2 seconds per move.
- **20 common openings, each played twice** with colours swapped, so neither side gets the
  easier half.
- **The same machine and settings** for every version, with every game saved.

**Turning a score into a rating.** The Elo system says that if you are rated D points above
your opponent, you are expected to score

$$E = \frac{1}{1 + 10^{-D/400}}$$

Turned around, a score $$s$$ means you are $$D = 400 \log_{10}\frac{s}{1-s}$$ points above the
opponent. The original engine scored **18.5%** against Stockfish 1320 (11 wins, 15 draws,
74 losses), so $$D = 400 \log_{10}(0.185/0.815) \approx -258$$: a rating of about **1060**. With
100 games the uncertainty is real, about ±80, so I report a range (970 to 1130), not one number.

So, not 1800. About 1060.

**Why it loses.** I ran Stockfish over all 100 games to find the engine's mistakes. It made
**277 big blunders**, moves that throw away three pawns' worth or more: about three a game.
Three quarters were quiet moves, not captures, and in more than a third of them the opponent's
best reply was simply to take something. The engine wasn't seeing the tactics just past its
search depth. That pointed straight at the first fix.

## Change 1: quiescence search (+205)

The engine searched four moves deep and then judged the position, wherever it was. Imagine the
last move it looks at is its queen taking a pawn. At that point it is a pawn up, so the line
looks great. One move later the queen gets recaptured, but that move is past the horizon, so
the engine never sees it. This is the **horizon effect**, and it explains a lot of those blunders.

The fix is **quiescence search** ("quiet" search). When the main search hits its depth limit, it
doesn't evaluate right away. It keeps searching, but **only captures**, until the position is
quiet. Captures run out quickly, so this extra search stays small.

One detail makes it work: the side to move is allowed to **stand pat**, meaning it declines to
capture and takes the current evaluation. Otherwise the search would assume you _must_ capture,
even when every capture loses material. With stand pat, a capture only counts if it improves on
doing nothing. (When in check, standing pat isn't allowed, because you have to deal with the
check, so all moves are searched.)

I added **move ordering** at the same time: captures first (taking a big piece with a small one
first of all), then quiet moves that caused a cutoff elsewhere in the tree. As the previous post
explains, alpha-beta prunes far more when good moves come first.

**Result: 42.5% against Stockfish 1320, up from 18.5%. About 1270, up 205 points.**

## Change 2: a transposition table (no measurable change)

The same position can be reached by different move orders. 1.e4 e5 2.Nf3 and 1.Nf3 e5 2.e4
lead to the same board. A **transposition table** remembers positions the search has already
analysed: how deep, what score, and which move was best. The next time it meets the same position,
it can reuse the result or at least try that best move first.

There is a subtlety. Because of alpha-beta, a stored score is often not exact. If a search was
cut off, all you know is that the position is _at least_ (or _at most_) some value. So each entry
also records which of the three it is (exact, lower bound or upper bound), and it is only
reused when that is enough to answer the new question.

**Result: exactly the same score as before**, 42.5%. Different games, same result. That
surprised me at first, but it makes sense: in a few seconds this engine only reaches depth 3 or
4, and in such small trees, positions rarely repeat. I kept it, because it matters more as
searches get deeper, but I'm not claiming a gain I didn't measure.

## Change 3: piece-square tables (+335)

Looking through the games, one moment stood out. After 1.e4 e5 2.Nf3 Nc6, the engine played
**3.Ng1**, moving its knight straight back home. With material as its only measure, every quiet
move is worth exactly the same, so it had no reason to prefer developing a piece over undoing
development.

**Piece-square tables** give each piece a small bonus or penalty for each square. Knights like
the centre and hate the edge. Pawns are worth more as they advance. Rooks like the seventh rank.
The king is the interesting one. In the middlegame it should hide behind its pawns, but in the
endgame, with the queens gone, it becomes a fighting piece and belongs in the centre. So the
king uses two tables and blends between them as pieces come off the board. That is called a
_tapered_ evaluation.

After this change, the same position gets 3.Nc3, a normal developing move.

**Result: 83.5% against Stockfish 1320.** At that score the opponent is too weak to measure
against reliably, so I played another 100 games against **Stockfish 1600**. It scored 58.5%,
which gives $$D = 400 \log_{10}(0.585/0.415) \approx +60$$, so **about 1660** (range 1600 to 1730).

| Version                            | vs Stockfish 1320     | Rating |
| ---------------------------------- | --------------------- | ------ |
| Original (2023)                    | 18.5%                 | ~1060  |
| + quiescence search, move ordering | 42.5%                 | ~1270  |
| + transposition table              | 42.5%                 | ~1270  |
| + piece-square tables              | 83.5% (58.5% vs 1600) | ~1650  |

## What I'd be careful about

- **This is Stockfish's rating scale, not a human one.** It is consistent for comparing versions
  of my engine, but a "1650" here is not the same as 1650 on Lichess or for FIDE.
- **20 openings is a small set.** Each was played several times in a 100-game match, so the games
  aren't fully independent and the error bars are a little optimistic. A larger opening set is
  the next thing to fix.
- **Python is slow.** The engine checks about 7,000 positions a second, while serious engines
  check millions. Most of its remaining weakness is simply not seeing far enough.

## What's next

The engine is getting a Lichess bot account so it can earn a public rating against real
opponents. After that: making it faster, a proper study of how much each component contributes,
and then letting the evaluation **learn** its own weights from games instead of hand-written
tables. That last part is where this project turns into machine learning.

All the games, scripts and results are in the
[repository](https://github.com/Roshan818/ChessEngine/tree/main/results).
