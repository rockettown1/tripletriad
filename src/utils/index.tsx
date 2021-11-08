//enable dynamic loading of images
import { Cards } from "../stats.json";
import victory from "../assets/music/fanfare.mp3";
import TT from "../assets/music/shuffle.mp3";
import balamb from "../assets/music/balamb.mp3";
import captureSound from "../assets/music/capture.mp3";
import cardFX from "../assets/music/card.mp3";
import startFX from "../assets/music/start.mp3";

export const shuffleMusic = new Audio(TT);
export const mainMusic = new Audio(balamb);
export const fanfare = new Audio(victory);
export const cardSound = new Audio(cardFX);
export const startSound = new Audio(startFX);
export const capture = new Audio(captureSound);

shuffleMusic.loop = true;
mainMusic.loop = true;

export type Card = {
  name: string;
  image: string;
  level: number;
  topStat: number;
  bottomStat: number;
  leftStat: number;
  rightStat: number;
  selected?: boolean;
  picked?: boolean;
  player?: string;
  available?: boolean;
  animate?: boolean;
};

export const startingCards = (amount: number): Card[] => {
  let AllCards = [...Cards];

  let temp: Card[] = [];
  let i = 0;
  while (i < amount - 1) {
    let matchFound = false;
    if (temp.length === 0) {
      temp.push(AllCards[Math.floor(Math.random() * 109)]);
    }
    let randomNum = Math.floor(Math.random() * 109);
    for (const card of temp) {
      if (AllCards[randomNum].name === card.name) {
        matchFound = true;
        break;
      }
    }
    if (matchFound) {
      continue;
    } else {
      temp.push(AllCards[randomNum]);
      i++;
    }
  }

  for (const card of temp) {
    card.available = true;
    card.animate = false;
  }

  //need to do a deep copy of all the objects (cards) in the array, so that if both players happen to have the same card, they aren't both pointing to the same memory location by reference. If this just returned the temp array for both players, properties would be shared! Return a deep array copy
  return temp.map((card) => {
    return { ...card };
  });
};

export const removeCardAfterPlaying = (
  cards: Card[],
  currentCard: Card,
  setter: React.Dispatch<React.SetStateAction<Card[]>>
) => {
  const arrCopy = [...cards];
  let cardIndex = 0;
  try {
    cardIndex = arrCopy.findIndex((card) => card.name === currentCard.name);
  } catch (error) {
    console.log(error);
  }

  arrCopy[cardIndex].available = false;
  setter(arrCopy);
};

type CheckStats = {
  (
    gameBoard: (Card | null)[][],
    row: number,
    index: number,
    setter: React.Dispatch<React.SetStateAction<(Card | null)[][]>>,
    playSounds: boolean
  ): void;
};

export const checkStats: CheckStats = (
  gameBoard,
  row,
  index,
  setter,
  playSounds
) => {
  //TODO: Make this function DRYer
  const board = [...gameBoard];

  //Rows
  const checkAbove = () => {
    //animate trigger for this row
    const flip = () => {
      board[row - 1][index]!.animate = true;
      setTimeout(() => {
        board[row - 1][index]!.animate = false;
      }, 1000);
    };

    //logic start
    if (board[row - 1][index] !== null) {
      if (
        board[row][index]!.topStat > board[row - 1][index]!.bottomStat &&
        board[row][index]!.player !== board[row - 1][index]!.player
      ) {
        if (board[row][index]!.player === "player1") {
          board[row - 1][index]!.player = "player1";
          flip();
        } else {
          board[row - 1][index]!.player = "";
          flip();
        }
        playSounds && capture.play();
      } else {
        console.log("Your card does not flip that card");
      }
      setter(board);
    }
  };

  const checkBelow = () => {
    const flip = () => {
      board[row + 1][index]!.animate = true;
      setTimeout(() => {
        board[row + 1][index]!.animate = false;
      }, 1000);
    };
    if (board[row + 1][index] !== null) {
      if (
        board[row][index]!.bottomStat > board[row + 1][index]!.topStat &&
        board[row][index]!.player !== board[row + 1][index]!.player
      ) {
        if (board[row][index]!.player === "player1") {
          board[row + 1][index]!.player = "player1";
          flip();
        } else {
          board[row + 1][index]!.player = "";
          flip();
        }
        playSounds && capture.play();
      } else {
        console.log("Your card does not flip that card");
      }
      setter(board);
    }
  };

  //Columns
  const checkLeft = () => {
    const flip = () => {
      board[row][index - 1]!.animate = true;
      setTimeout(() => {
        board[row][index - 1]!.animate = false;
      }, 1000);
    };
    if (board[row][index - 1] !== null) {
      if (
        board[row][index]!.leftStat > board[row][index - 1]!.rightStat &&
        board[row][index]!.player !== board[row][index - 1]!.player
      ) {
        if (board[row][index]!.player === "player1") {
          board[row][index - 1]!.player = "player1";
          flip();
        } else {
          board[row][index - 1]!.player = "";
          flip();
        }
        playSounds && capture.play();
      } else {
        console.log("Your card does not flip that card");
      }
      setter(board);
    }
  };

  const checkRight = () => {
    const flip = () => {
      board[row][index + 1]!.animate = true;
      setTimeout(() => {
        board[row][index + 1]!.animate = false;
      }, 1000);
    };

    if (board[row][index + 1] !== null) {
      if (
        board[row][index]!.rightStat > board[row][index + 1]!.leftStat &&
        board[row][index]!.player !== board[row][index + 1]!.player
      ) {
        if (board[row][index]!.player === "player1") {
          board[row][index + 1]!.player = "player1";
          flip();
        } else {
          board[row][index + 1]!.player = "";
          flip();
        }
        playSounds && capture.play();
      } else {
        console.log("Your card does not flip that card");
      }
      setter(board);
    }
  };
  //check rows
  switch (row) {
    case 0:
      checkBelow();
      break;
    case 1:
      checkAbove();
      checkBelow();
      break;
    case 2:
      checkAbove();
      break;
    default:
      console.log("incorrect");
  }

  //check columns
  switch (index) {
    case 0:
      checkRight();
      break;
    case 1:
      checkLeft();
      checkRight();
      break;
    case 2:
      checkLeft();
      break;
    default:
      console.log("incorrect");
  }
};

export type WinLogic = {
  (
    board: (Card | null)[][],
    score: { player: number; opponent: number },
    playMusic: boolean
  ): {
    status: boolean;
    details: Details;
  };
};

type Details = {
  winner: string | undefined;
  message: string;
};

export const winLogic: WinLogic = (board, score, playMusic) => {
  //if the board is full, then the game is over and we compare the scores

  let status = false;
  let details: Details = { winner: "", message: "" };
  let nullCount = 0;
  for (const arr of board) {
    for (const cell of arr) {
      if (cell === null) {
        nullCount++;
      }
    }
  }

  if (nullCount === 0) {
    status = true;
    if (playMusic) {
      shuffleMusic.pause();
      fanfare.currentTime = 0;
      fanfare.play();
      fanfare.onended = () => {
        // mainMusic.currentTime = 0;
        mainMusic.play();
      };
    }
    if (score.player > score.opponent) {
      details = { winner: "player1", message: "Player 1 wins!" };
    } else if (score.opponent > score.player) {
      details = { winner: "player2", message: "Player 2 wins!" };
    } else {
      details = { winner: undefined, message: "Draw!" };
    }
  }

  return { status, details };
};
