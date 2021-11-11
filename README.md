# Triple Triad

### (Card game from Final Fantasy 8) 🚀

Just for fun weekend project (working but unfinished). Built quite quickly so expect a lot of refactoring required/making code DRYer.

NOTE: This is just client-side code only (non of your data will be persisted, if you win cards for example) So refresh the page and all will be lost. I've still got to write the cpu algorithm so you'll have to also control the second player yourself if you want to have a mess around with it now.

Also, if you're familiar with FF8 - it only has the basic Open rule as of yet.

[Play it here](https://rockettown1.github.io/tripletriad/)

## RULES:

1. You have a collection of cards (at least 5, but could be loads)
2. You select 5 cards from your collection to battle, and so does your opponent.
3. You take it in turns to place your cards on the Triple Triad board.
4. Each card has 4 stats (top, left, bottom, right)
5. If a player puts down a card with a better stat to those adjacent, that player wins that/those cards.
6. The player who owns the most cards when the board is full is the winner.
7. The winning player may then take a card from their opponent.
8. You can then play another round.

If a player has less than 5 cards in their collection (the min number to play, the game is over and you've lost!) In this app, player 1 is the main player, so the game ends when player 1 can no longer play a round.

### Todo

- [ ] Write the CPU algorithm
- [ ] Online multiplayer
- [ ] Add styling
- [ ] Add a server to store current card deck and any cards won/lost
- [ ] Additional region rules from Final Fantasy 8
- [ ] Add testing

#### Known bugs/issues

Due to browser security differences, Safari might have some issues with playing music.
This app was just for fun/practice and HAS NOT been adequately tested in any way.  
There's a bug if you have two of the same card in your hand. Using one will manipulate the other. I'll fix it when I find time, just avoid doing that for now 😅

---

#### Credits

Thanks Andy for suggesting the challenge, providing the card images and the json stats file. This one was definitely an interesting one.
