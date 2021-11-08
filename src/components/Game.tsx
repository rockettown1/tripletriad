import { useState, useEffect } from "react";
import { useTrail, animated } from "react-spring";
import styled from "styled-components";
import { images } from "../assets/images";
import { Card, WinLogic, shuffleMusic, mainMusic, fanfare } from "../utils";
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
}: GameProps) => {
  const [playCard, setPlayCard] = useState<Card | null>(null);
  const [hoveredCard, setHoveredCard] = useState<Card | null>(null);
  const [count, setCount] = useState<CountType>({ player: 0, opponent: 0 });
  const [currentPlayer, setCurrentPlayer] = useState<string>("");
  const [showArrow, setShowArrow] = useState<boolean>(true);

  useEffect(() => {
    mainMusic.pause();
    if (playMusic) {
      fanfare.pause();
      mainMusic.pause();
      shuffleMusic.currentTime = 0;
      shuffleMusic.play();
    }
  }, []);

  useEffect(() => {
    if (currentPlayer === "player1") {
      setShowArrow(true);
    } else {
      setShowArrow(false);
    }
  }, [currentPlayer]);

  const updatePicked = (index: number, player: string) => {
    let temp: Card[] = [];
    if (player === "player1") {
      temp = [...yourCards];
    } else {
      temp = [...oppsCards];
    }
    temp.forEach((card) => {
      card.picked = false;
    });
    temp[index].picked = true;
    setPlayCard(temp[index]);

    if (player === "player1") {
      setYourCards(temp);
    } else {
      setOppsCards(temp);
    }
  };

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
      />
      <Board
        currentCard={playCard}
        setCurrentCard={setPlayCard}
        yourCards={yourCards}
        oppsCards={oppsCards}
        setYourCards={setYourCards}
        setOppsCards={setOppsCards}
        hoveredCard={hoveredCard}
        cardCount={cardCount}
        score={count}
        playSounds={playSounds}
        currentPlayer={currentPlayer}
        setCurrentPlayer={setCurrentPlayer}
        status={status}
        setStatus={setStatus}
      />
      <CardsContainer
        yourCards={oppsCards}
        side="right"
        updatePicked={updatePicked}
        setHoveredCard={setHoveredCard}
        count={count}
        showArrow={!showArrow}
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
