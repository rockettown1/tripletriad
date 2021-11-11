import { useState, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import { Status } from "../App";
import { Card, startingCards } from "../utils";
import { images } from "../assets/images";
import { useNavigate } from "react-router-dom";

type WCProps = {
  status: Status;
  yourCards: Card[];
  oppsCards: Card[];
  setYourCards: React.Dispatch<React.SetStateAction<Card[]>>;
  setOppsCards: React.Dispatch<React.SetStateAction<Card[]>>;
  allYourCards: Card[];
  P2cpu: boolean;
};

const WinnersChoice = ({
  status,
  yourCards,
  setYourCards,
  setOppsCards,
  oppsCards,
  allYourCards,
  P2cpu,
}: WCProps) => {
  const [choice, setChoice] = useState<{ card: Card; index: number } | null>(
    null
  );

  const navigate = useNavigate();

  const takeCard = (card: Card, index: number) => {
    card.animate = true;
    setChoice({ card, index });
  };

  useEffect(() => {
    //this handles cpu stealing a card
    if (P2cpu) {
      if (
        status?.details.winner !== "player1" &&
        status?.details.winner !== undefined
      ) {
        const temp1 = [...yourCards];
        let index = Math.floor(Math.random() * 5);
        let randCard = temp1[index];
        takeCard(randCard, index);
        const merge = [...new Set([...temp1, ...allYourCards])];
        merge.splice(merge.indexOf(randCard), 1);
      }
    }
  }, []);

  useEffect(() => {
    if (choice) {
      setTimeout(() => {
        navigate("/select");
      }, 2000);
      const temp1 = [...yourCards];
      const temp2 = [...oppsCards];
      if (status?.details.winner === "player1") {
        temp1.push(choice.card);
        setYourCards([...new Set([...temp1, ...allYourCards])]);
        temp2.splice(choice.index, 1);
      } else {
        temp2.push(choice.card);
        const merge = [...new Set([...temp1, ...allYourCards])];
        merge.splice(merge.indexOf(choice.card), 1);
        setYourCards(merge);
      }

      //when the opponent will eventually be another human who wants to keep track of their cards then pass in temp + adjustments. For now just generate a random 5 cards for next game.
      setTimeout(() => {
        setOppsCards(startingCards(5));
      }, 2000);
    }
  }, [choice]);

  return (
    <Container>
      <h1 style={{ color: "red" }}>
        {choice !== null
          ? status?.details.winner === "player1"
            ? `${choice.card.name} card gained`
            : `${choice.card.name} card lost`
          : status?.details.message}
      </h1>

      <DeckContainer>
        <PlayerDeck>
          <h3>Please select a card from your opponent:</h3>
          {(status?.details.winner === "player1" ? oppsCards : yourCards).map(
            (card, index) => {
              return (
                <CardImg
                  key={index}
                  claim={card.animate}
                  id="loser"
                  player={
                    status?.details.winner === "player1" ? "player2" : "player1"
                  }
                  src={images[card.image].default}
                  alt="card"
                  onClick={() => takeCard(card, index)}
                />
              );
            }
          )}
        </PlayerDeck>
        <PlayerDeck>
          {(!(status?.details.winner === "player1")
            ? oppsCards
            : yourCards
          ).map((card, index) => {
            return (
              <CardImg
                key={index}
                id="winner"
                claim={false}
                player={status?.details.winner}
                src={images[card.image].default}
                alt="card"
              />
            );
          })}
        </PlayerDeck>
        {choice !== null && (
          <WonImg src={images[choice.card!.image].default} reverse />
        )}
      </DeckContainer>
    </Container>
  );
};

export default WinnersChoice;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
`;

const scale = keyframes`
0% {
    transform: scale(1) rotateY(0) translateY(0)
}
50% {
    transform: scale(1.3) rotateY(180deg) translateY(300px)
}
100% {
    transform: scale(1) rotateY(360deg) translateY(1000px)
}
`;

type ImageProps = {
  claim: boolean | undefined;
  player: string | undefined;
  id: string;
};

const PlayerDeck = styled.div`
  margin-bottom: 50px;
`;

const DeckContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const CardImg = styled.img<ImageProps>`
  height: ${({ id }) => (id === "loser" ? "200px" : "100px")};
  border: ${({ player }) =>
    player === "player1"
      ? "5px solid rgb(70, 130, 199)"
      : "5px solid rgb(204, 86, 116)"};
  margin: 5px;
  animation: ${({ claim }) =>
    claim &&
    css`
      ${scale} 0.5s linear
    `};
  animation-fill-mode: forwards;
  &:hover {
    transform: ${({ id }) => (id === "loser" ? "scale(1.02)" : "scale(1)")};
    cursor: ${({ id }) => (id === "loser" ? "pointer" : "")};
  }
`;

type WonProps = {
  reverse: boolean;
};

const WonImg = styled.img<WonProps>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  height: 500px;
  animation: ${css`
    ${scale} 0.5s linear
  `};
  animation-direction: reverse;
  animation-fill-mode: forwards;
`;
