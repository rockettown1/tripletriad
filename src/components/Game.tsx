import { useState, useEffect } from "react";
import styled from "styled-components";
import {
  checkStats,
  pickRandomIndex,
  randomlyPickCell,
  isFull,
} from "../utils";
import {
  Card,
  WinLogic,
  shuffleMusic,
  mainMusic,
  fanfare,
  removeCardAfterPlaying,
  cardSound,
} from "../utils";
import Board from "./Board";
import CardsContainer from "./CardsContainer";
import { Status } from "../App";

type GameProps = {
  yourCards: Card[];
  oppsCards: Card[];
  setYourCards: React.Dispatch<React.SetStateAction<Card[]>>;
  setOppsCards: React.Dispatch<React.SetStateAction<Card[]>>;
  playMusic: boolean;
  playSounds: boolean;
  status: Status;
  setStatus: React.Dispatch<React.SetStateAction<Status | null>>;
  P2cpu: boolean;
};

type CountType = {
  player: number;
  opponent: number;
};

const Game = ({
  yourCards,
  oppsCards,
  setYourCards,
  setOppsCards,
  playMusic,
  playSounds,
  status,
  setStatus,
  P2cpu,
}: GameProps) => {
  const [playCard, setPlayCard] = useState<Card | null>(null);
  const [hoveredCard, setHoveredCard] = useState<Card | null>(null);
  const [count, setCount] = useState<CountType>({ player: 0, opponent: 0 });
  const [currentPlayer, setCurrentPlayer] = useState<string>("player1");
  const [showArrow, setShowArrow] = useState<boolean>(true);
  const [board, setBoard] = useState<(Card | null)[][]>([
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]);

  useEffect(() => {
    mainMusic.pause();
    if (playMusic) {
      fanfare.pause();
      mainMusic.pause();
      shuffleMusic.currentTime = 0;
      shuffleMusic.play();
    }
    //initialise hands when game starts
    const temp1 = [...yourCards];
    const temp2 = [...oppsCards];
    for (const card of temp1) {
      card.picked = false;
    }
    for (const card of temp2) {
      card.picked = false;
    }

    setYourCards(temp1);
    setOppsCards(temp2);
  }, []);

  const updatePicked = (index: number, player: string) => {
    let temp: Card[] = [];
    if (player === "player1") {
      temp = [...yourCards];
      temp.forEach((card) => {
        card.picked = false;
      });
    } else {
      temp = [...oppsCards];
    }

    temp[index].picked = true;
    setPlayCard(temp[index]);

    if (player === "player1") {
      setYourCards(temp);
    } else {
      setOppsCards(temp);
    }
  };

  const setCellValue = (
    row: number,
    index: number,
    board: (Card | null)[][]
  ) => {
    const gameBoard = [...board];
    if (playCard !== null) {
      if (gameBoard[row][index] === null) {
        gameBoard[row][index] = playCard;

        setBoard(gameBoard);
        if (playSounds) {
          cardSound.play();
        }
        if (currentPlayer === "player1") {
          setCurrentPlayer("player2");
        } else {
          setCurrentPlayer("player1");
        }
        //remove card from hand
        removeCardAfterPlaying(
          playCard.player === "player1" ? yourCards : oppsCards,
          playCard,
          playCard.player === "player1" ? setYourCards : setOppsCards
        );
        setPlayCard(null);

        //value checks results handled here
        checkStats(gameBoard, row, index, setBoard, playSounds);
      }
    }
    return gameBoard;
  };

  useEffect(() => {
    if (!isFull(board)) {
      if (currentPlayer === "player1") {
        setShowArrow(true);
      } else {
        setShowArrow(false);
        //Handle CPU from here
        if (P2cpu) {
          setTimeout(() => {
            if (showArrow) {
              let index = pickRandomIndex(oppsCards);
              setTimeout(() => {
                updatePicked(index, "player2");
              }, 500);
            }
            let cell = randomlyPickCell(board);

            setCellValue(cell.rr, cell.rc, board);
          }, 800);
        }
      }
    }
  }, [currentPlayer, oppsCards]);

  type Details = {
    winner: string | undefined;
    message: string;
  };

  const cardCount = (
    winLogic: WinLogic,
    board: (Card | null)[][]
  ): { status: boolean; details: Details } => {
    const allCardsInGame = [...yourCards, ...oppsCards];
    let count = 0;
    for (const card of allCardsInGame) {
      if (card.player === "player1") {
        count++;
      }
    }

    setCount({ player: count, opponent: 10 - count });
    //winLogic returns game status and a message, and cardCount is passing that on
    return winLogic(board, { player: count, opponent: 10 - count }, playMusic);
  };

  return (
    <Container>
      <CardsContainer
        yourCards={yourCards}
        side="left"
        updatePicked={updatePicked}
        setHoveredCard={setHoveredCard}
        count={count}
        showArrow={showArrow}
        P2cpu={P2cpu}
      />
      <Board
        setOppsCards={setOppsCards}
        hoveredCard={hoveredCard}
        cardCount={cardCount}
        playSounds={playSounds}
        currentPlayer={currentPlayer}
        setCurrentPlayer={setCurrentPlayer}
        status={status}
        setStatus={setStatus}
        board={board}
        setCellValue={setCellValue}
      />
      <CardsContainer
        yourCards={oppsCards}
        side="right"
        updatePicked={updatePicked}
        setHoveredCard={setHoveredCard}
        count={count}
        showArrow={!showArrow}
        P2cpu={P2cpu}
      />
    </Container>
  );
};

export default Game;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  padding: 0 50px;
  box-sizing: border-box;

  -moz-transform: scale(0.75, 0.75); /* Moz-browsers */
  zoom: 0.75; /* Other non-webkit browsers */
  zoom: 75%; /* Webkit browsers */
`;
