import styled, { keyframes, css } from "styled-components";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card, startingCards } from "../utils";
import { images } from "../assets/images";
import boardBackground from "../assets/images/other/card-board.png";
import arrow from "../assets/images/other/triangle.png";
import InfoPopup from "./InfoPopup";
import { Status } from "../App";
import { winLogic, WinLogic, startSound } from "../utils/";

type Details = {
  winner: string | undefined;
  message: string;
};

type BoardProps = {
  setOppsCards: React.Dispatch<React.SetStateAction<Card[]>>;
  hoveredCard: Card | null;
  cardCount: (
    winLogic: WinLogic,
    board: (Card | null)[][]
  ) => { status: boolean; details: Details };
  playSounds: boolean;
  currentPlayer: string;
  setCurrentPlayer: React.Dispatch<React.SetStateAction<string>>;
  status: Status;
  setStatus: React.Dispatch<React.SetStateAction<Status | null>>;
  board: (Card | null)[][];
  setCellValue: (row: number, index: number, board: (Card | null)[][]) => void;
};

const Board = ({
  setOppsCards,
  hoveredCard,
  cardCount,
  playSounds,
  currentPlayer,
  setCurrentPlayer,
  status,
  setStatus,
  board,
  setCellValue,
}: BoardProps) => {
  // prettier-ignore

  const [endGame, setEndGame] = useState<boolean>(false);
  const [finalMsg, setFinalMsg] = useState<string>("");
  const [showArrow, setShowArrow] = useState<boolean>(true);

  const navigate = useNavigate();

  useEffect(() => {
    //selecting a player to go first
    Math.random() > 0.5 && setCurrentPlayer("player2");

    if (playSounds) {
      startSound.play();
    }

    setTimeout(() => {
      setShowArrow(false);
    }, 1200);
  }, []);

  useEffect(() => {
    if (!status?.status) {
      const stateOfPlay = cardCount(winLogic, board);
      setStatus(stateOfPlay);
      setEndGame(stateOfPlay.status);
      setFinalMsg(stateOfPlay.details.message);
    }
  }, [board]);

  useEffect(() => {
    if (endGame) {
      setTimeout(() => {
        if (status?.details.winner) {
          //if there's a winner
          navigate("/winner");
        } else {
          //if draw
          setOppsCards(startingCards(5));
          navigate("/select");
        }
      }, 5000);
    }
  }, [endGame]);

  return (
    <Container>
      <BackgroundImage src={boardBackground} />
      {showArrow && <Arrow src={arrow} player={currentPlayer} />}
      {[0, 1, 2].map((row, index) => {
        return (
          <Row
            key={index}
            row={row}
            board={board}
            setCellValue={setCellValue}
          />
        );
      })}
      <InfoPopup name={hoveredCard?.name} />
      {endGame && <Message>{finalMsg}</Message>}
    </Container>
  );
};

export default Board;

type RowProps = {
  board: (Card | null)[][];
  row: number;
  setCellValue(row: number, index: number, board: (Card | null)[][]): void;
  key: number;
};

const Row = ({ board, row, setCellValue, key }: RowProps) => {
  return (
    <RowContainer key={key}>
      {board.map((_, index) => {
        return (
          <Cell
            key={index}
            onClick={() => setCellValue(row, index, board)}
            flip={board[row][index]?.animate}
          >
            {board[row][index] && (
              <CardImg
                src={images[board[row][index]!.image].default}
                player={board[row][index]?.player}
              />
            )}
          </Cell>
        );
      })}
    </RowContainer>
  );
};

const Container = styled.div`
  margin-top: 30px;
  height: 600px;
  width: 540px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const BackgroundImage = styled.img`
  position: absolute;
  height: 700px;
  width: 1080px;
  border-radius: 15px;
  box-shadow: 0px 1px 20px 1px rgba(0, 0, 0, 0.8);
`;

const RowContainer = styled.div`
  width: 100%;
  display: flex;
`;

type CellProps = {
  flip: boolean | undefined;
};

const Cell = styled.div<CellProps>`
  height: 200px;
  width: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  box-sizing: border-box;
  animation: ${({ flip }) =>
    flip &&
    css`
      ${scale} 0.5s linear
    `};
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }
`;

type CardImgProps = {
  player: string | undefined;
};
const CardImg = styled.img<CardImgProps>`
  height: 196px;
  width: 176px;
  box-sizing: border-box;
  border: ${({ player }) =>
    player === "player1"
      ? "5px solid rgb(70, 130, 199)"
      : "5px solid rgb(204, 86, 116)"};
`;

const Message = styled.h1`
  font-size: 150px;
  position: absolute;
  z-index: 20;
  color: white;
`;

const scale = keyframes`
0% {
    transform: scale(1) rotateY(0)
}
50% {
    transform: scale(1.3) rotateY(180deg)
}
100% {
    transform: scale(1) rotateY(360deg)
}
`;

const spin = (player: string) => keyframes`
0% {
    transform: rotateZ(90deg)
}
50% {
    transform: rotateZ(720deg)
}
100% {
    transform: ${player === "player1" ? "rotateZ(990deg)" : "rotateZ(1170deg)"}
}
`;

type ArrowProps = {
  player: string;
};

const Arrow = styled.img<ArrowProps>`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  margin: auto;
  z-index: 20;
  height: 150px;
  width: 150px;
  animation: ${({ player }) => spin(player)} 0.3s linear 3;
  animation-fill-mode: forwards;
`;
