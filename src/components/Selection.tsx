import { useEffect } from "react";
import styled from "styled-components";
import { Card } from "../utils";
import { images } from "../assets/images";
import { useNavigate } from "react-router-dom";
import { Status } from "../App";

type LandingProps = {
  allCards: Card[];
  selectedCount: number;
  selectPlayable(index: number): void;
  selection: Card[];
  setSelection: React.Dispatch<React.SetStateAction<Card[]>>;
  setSelectedCount: React.Dispatch<React.SetStateAction<number>>;
  setStatus: React.Dispatch<React.SetStateAction<Status>>;
};

const Selection = ({
  allCards,
  selectedCount,
  setSelectedCount,
  selectPlayable,
  selection,
  setSelection,
  setStatus,
}: LandingProps) => {
  let navigate = useNavigate();

  useEffect(() => {
    const temp = [...allCards];
    for (const card of temp) {
      card.selected = false;
      card.player = "player1";
      card.available = true;
      card.picked = false;
    }
    setSelection([]);
    setSelectedCount(0);
    if (allCards.length < 5) {
      navigate("/");
    }
  }, []);

  const startGame = () => {
    //your cards you're taking to the game
    const temp = [...selection];
    for (const card of allCards) {
      if (card.selected) {
        temp.push(card);
      }
    }
    setSelection(temp);
    setStatus({ status: false, details: { winner: "", message: "" } });
    navigate("/game");
  };

  return (
    <div>
      <h1>Select 5 cards</h1>
      {allCards.map((card, index) => {
        return (
          <CardImg
            selected={card.selected}
            onClick={() => selectPlayable(index)}
            key={index}
            src={images[card.image].default}
            alt={card.name}
          />
        );
      })}
      <p>{selectedCount}</p>
      {selectedCount === 5 && (
        <button onClick={() => startGame()}>Play these cards</button>
      )}
    </div>
  );
};

export default Selection;

type CardImgProps = {
  selected?: boolean;
};

const CardImg = styled.img<CardImgProps>`
  height: 120px;
  width: 100px;
  margin: 3px;
  box-sizing: border-box;
  border: ${({ selected }) =>
    selected ? "5px solid rgb(70, 130, 199)" : "none"};
  transition: 0.3s transform;
  &:hover {
    transform: translateY(-20px);
    cursor: pointer;
  }
`;
