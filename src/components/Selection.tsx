import { useEffect } from "react";
import styled from "styled-components";
import { Card } from "../utils";
import { images } from "../assets/images";
import { useNavigate } from "react-router-dom";

type LandingProps = {
  allCards: Card[];
  selectedCount: number;
  selectPlayable(index: number): void;
  selection: Card[];
  setSelection: React.Dispatch<React.SetStateAction<Card[]>>;
  setSelectedCount: React.Dispatch<React.SetStateAction<number>>;
};

const Selection = ({
  allCards,
  selectedCount,
  setSelectedCount,
  selectPlayable,
  selection,
  setSelection,
}: LandingProps) => {
  let navigate = useNavigate();

  useEffect(() => {
    const temp = [...allCards];
    for (const card of temp) {
      card.selected = false;
      card.player = "player1";
      card.available = true;
    }
    setSelection([]);
    setSelectedCount(0);
    if (allCards.length < 5) {
      alert(
        "You don't have enough cards to play! Refresh the page to start again. This is a work in progress and a better UI for this will be added eventually"
      );
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
