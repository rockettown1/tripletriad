Notes on creating an evaluation function (AI for cpu)

Plan: general advice suggests creating heuristic functions to play the game by until the 'moves to end game' are small enough to run a minimax algorithm without a huge number of computations.

#### Heuristic functions for triple triad (not in an order)

- if going first, play into a corner and put your lowest numbers facing out.
- if a card is already on the board which can be attacked (not yours), check the space around it, pick your card, compare values which which has a higher ranking than the card on the board.
- (be aware of other sides): ie. if on the top row and **cell below is empty**, pick a card with a decent bottom stat
- same as above for bottom row, left column and right column.
- If you can't flip a card just play any
- Unfinished document...
