---
layout: post
title: "How my chess engine thinks: minimax, negamax and alpha-beta"
date: 2023-08-15
description: "A chess engine written from scratch in Python, and the three ideas behind how it picks a move: look ahead, assume the opponent plays well, and skip what can't matter."
tags: chess search python
categories: projects
giscus_comments: false
related_posts: false
---

In August 2023 I wrote a chess engine from scratch in Python. It has a Pygame board you can
play on, it knows all the rules (castling, en passant, promotion), and it plays against you.
No chess libraries and no neural networks: just a board, a list of legal moves, and a way of
looking ahead. The code is on [GitHub](https://github.com/Roshan818/ChessEngine).

This post explains how it decides what to play. The ideas are old (the core of it is from the
1950s) but they are worth understanding properly, because almost every game-playing program
before AlphaZero was built on them.

{% include figure.liquid loading="eager" path="assets/img/posts/chess/figure1.png" title="Engine overview" class="img-fluid rounded z-depth-1" %}

## The board and the rules

The board is an 8×8 grid. Each square holds a two-letter code: the colour, then the piece.
`wK` is the white king, `bp` a black pawn, `--` an empty square. Simple, readable, and easy to
debug by printing.

{% include figure.liquid loading="lazy" path="assets/img/posts/chess/gamestate.png" title="Board representation" class="img-fluid rounded z-depth-1" %}

Generating legal moves is more work than it looks. Each piece type has its own function: rooks
slide along ranks and files until they hit something, bishops along diagonals, knights jump,
pawns do several different things depending on where they are. The hard part is that a move
is only legal if it doesn't leave your own king in check.

The lazy way is to try every move, then check whether your king is attacked. That works but it
is slow. Instead, before generating moves, the engine looks outward from its own king in all
eight directions and along the knight jumps. That tells it two things:

- **Checks:** which enemy pieces are attacking the king right now. If there is one, the only
  legal moves are to capture it, block it, or move the king. If there are two, only the king
  can move.
- **Pins:** which of its own pieces are the only thing standing between the king and an enemy
  rook, bishop or queen. A pinned piece may only move along the line of the pin.

With that information worked out once, each piece's moves can be generated directly as legal
moves, with no trial and error.

{% include figure.liquid loading="lazy" path="assets/img/posts/chess/chess_moves.jpg" title="Move generation" class="img-fluid rounded z-depth-1" %}

## Idea 1: look ahead, and assume the opponent is good (minimax)

Suppose you could score any position with a number: positive is good for white, negative is
good for black. The simplest scoring is material: pawn 1, knight and bishop 3, rook 5, queen 9.

The naive engine would play whichever move leads to the best score right away. That fails
instantly. Taking a pawn looks great until the opponent takes your queen back. So you have to
look at the opponent's reply too, and theirs is chosen to be bad for you.

That is minimax. Picture the moves as a tree. At white's turns, white picks the child with the
**max**imum score. At black's turns, black picks the **min**imum. You score the positions at
the bottom of the tree and pass the values up.

{% include figure.liquid loading="lazy" path="assets/img/posts/chess/chess_minimax.png" title="Minimax" class="img-fluid rounded z-depth-1" %}

A tiny example. White has two moves, A and B, and black has two replies to each:

| White plays | Black replies | Score after |
| ----------- | ------------- | ----------- |
| A           | a1            | +3          |
| A           | a2            | +5          |
| B           | b1            | −2          |
| B           | b2            | +9          |

B contains the best position on the board (+9), so it is tempting. But black chooses the reply,
and after B black plays b1 and white ends up at −2. After A, black's best is a1, which still
leaves white at +3. So minimax says A is worth +3, B is worth −2, and white plays A. It picks
the move with the best **worst case**, which is exactly what you want against an opponent who
is trying to beat you.

The engine does this four moves deep (two for each side), then scores the positions at the
bottom with the material count.

## Idea 2: one function instead of two (negamax)

Writing minimax means writing the same code twice, once for the maximising side and once for
the minimising side. Negamax notices that chess is zero-sum: a position worth +3 to white is
worth −3 to black. So instead of switching between max and min, every side maximises its _own_
score, and the score is negated when it is passed up one level:

```text
score(position) = max over moves of ( −score(position after move) )
```

It searches exactly the same tree and gets exactly the same answer as minimax, in half the code.
Less code means fewer places for a bug that only affects one colour, which in a chess engine is
a very real kind of bug.

{% include figure.liquid loading="lazy" path="assets/img/posts/chess/plminmax.gif" title="Negamax" class="img-fluid rounded z-depth-1" %}

## Idea 3: skip what can't change the answer (alpha-beta pruning)

Minimax is expensive. A chess position has about 35 legal moves on average, so looking four
moves deep means about 35⁴, or 1.5 million positions. My Python engine scores a few thousand
positions a second, so that is several minutes per move.

Alpha-beta pruning gives the same answer while skipping most of the tree. Go back to the example,
and search it in order:

1. White looks at A. Black's replies give +3 and +5, so black would pick +3. **A is worth +3.**
2. White looks at B. The first reply, b1, gives −2. At that moment white knows B is worth
   **at most −2**, because black can always choose b1.
3. White already has +3 from A. Whatever b2 turns out to be, it can only make B worse for white,
   never better than −2. So white never looks at b2 at all.

That is the whole trick: once you have found a reply that **refutes** a move (shows it is worse
than something you already have), you don't need to see the rest of the replies. It is
completely safe. The answer is identical to plain minimax; only the work is smaller.

{% include figure.liquid loading="lazy" path="assets/img/posts/chess/alpha-beta.jpg" title="Alpha-beta pruning" class="img-fluid rounded z-depth-1" %}

The names come from the two numbers the search carries down the tree:

- **alpha:** the best score the side to move is already guaranteed somewhere else.
- **beta:** the most the opponent will allow, because they have a better option elsewhere.

If a move's score reaches beta, the opponent will never let this position happen, so the rest of
the moves here are pointless. That is a "cutoff".

How much does it save? It depends on the order you try the moves in. In the example, the
pruning only happened because the refuting reply (b1) was searched first. If b2 had come first,
white would have had to look at both. If the best moves
always come first, alpha-beta at depth 4 needs only about 35² + 35² ≈ 2,500 positions instead
of 1.5 million (a result from Knuth and Moore, 1975). With the worst possible order it saves
nothing at all. So **good move ordering matters almost as much as the algorithm itself**, and
it is where a lot of real engine work goes.

## What this engine can and can't do

With alpha-beta and material counting, the engine plays real chess: it doesn't hang pieces in
one move, it takes free material, and it finds short mates. It also has very visible limits:

- **It only counts material.** It has no idea that a knight in the centre is better than one in
  the corner, or that a king in the open is in danger. All quiet moves look the same to it.
- **It stops dead at depth 4.** If the position at the bottom of the tree is in the middle of an
  exchange, it evaluates it there anyway: it sees itself winning a pawn and misses the recapture
  one move later. This is called the horizon effect.

Both problems have well-known fixes, and in 2026 I came back to measure the engine properly and
try them. That is the [next post](/blog/2026/testing-and-improving-my-chess-engine/).
