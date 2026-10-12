---
layout: post
title: "Building a chess engine with Negamax and alpha-beta pruning"
date: 2023-08-15
description: "A Pygame chess engine built on classical search: board representation, legal move generation, and the algorithms that pick a move."
tags: chess search python
categories: projects
giscus_comments: false
related_posts: false
---

In August 2023 I built a chess engine from scratch in Python with Pygame. It supports
two-player and single-player games and handles the awkward rules (castling, en passant,
promotion). The bot uses classical search rather than a neural network, and reached roughly
1800 when I played it against Stockfish. Code is on [GitHub](https://github.com/Roshan818/ChessEngine).

{% include figure.liquid loading="eager" path="assets/img/posts/chess/figure1.png" title="Engine overview" class="img-fluid rounded z-depth-1" %}

Classical engines search the game tree to a fixed depth, score the positions they reach with
a hand-written evaluation function, and choose the move that does best against the opponent's
best reply. That is a different approach from neural engines, which learn their evaluation.

## How the engine works

**Board representation.** The board is an 8×8 array of integers. White pieces are 1 to 6,
black pieces −1 to −6, and empty squares 0.

{% include figure.liquid loading="lazy" path="assets/img/posts/chess/gamestate.png" title="Board representation" class="img-fluid rounded z-depth-1" %}

**Move generation.** For each piece on the board, a piece-specific function generates its
moves. Pins and checks are tracked while generating, so a pinned piece can only move along
the pin line. Pawn moves cover double steps, captures, promotion and en passant; the king's
moves include castling.

{% include figure.liquid loading="lazy" path="assets/img/posts/chess/chess_moves.jpg" title="Move generation" class="img-fluid rounded z-depth-1" %}

**Move validation.** A move is legal if it appears in the list of valid moves for the current
position. When the king is in check, that list is cut down to moves that block the check,
capture the checking piece, or move the king.

**Evaluation.** The evaluation checks each position for threats, pins and checks.

**Move selection.** The bot can pick moves four ways: at random, or with Minimax, Negamax, or
Negamax with alpha-beta pruning.

## The search algorithms

### Minimax

{% include figure.liquid loading="lazy" path="assets/img/posts/chess/chess_minimax.png" title="Minimax" class="img-fluid rounded z-depth-1" %}

Minimax assumes both sides play their best. It runs a depth-first search to a fixed depth,
scores the leaf positions with the evaluation function, and backs the scores up the tree:
the side to move takes the maximum, the opponent the minimum. The search is exhaustive, so
the cost grows exponentially with depth.

### Negamax

{% include figure.liquid loading="lazy" path="assets/img/posts/chess/plminmax.gif" title="Negamax" class="img-fluid rounded z-depth-1" %}

Chess is zero-sum, so a position's value for one player is the negative of its value for the
other. Negamax uses this to fold the maximising and minimising branches of Minimax into a
single recursive function. It searches the same tree, with less code and fewer places for
bugs.

### Alpha-beta pruning

{% include figure.liquid loading="lazy" path="assets/img/posts/chess/alpha-beta.jpg" title="Alpha-beta pruning" class="img-fluid rounded z-depth-1" %}

Alpha-beta keeps two bounds during the search: alpha, the score the maximising side is already
guaranteed, and beta, the most the minimising side will allow. Once a branch can't change the
final decision, the engine stops searching it. The result is identical to plain Minimax, but
far fewer nodes are evaluated, so the engine can search deeper in the same time.
