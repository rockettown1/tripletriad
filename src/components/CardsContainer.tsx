import React, { useState, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import { useTrail, animated } from "react-spring";
import { images } from "../assets/images";
import { Card } from "../utils";
import arrow from "../assets/images/other/triangle.png";

type CardsContainerProps = {
  yourCards: Card[];
  side: string;
  updatePicked(index: number, player: string): void;
  setHoveredCard: React.Dispatch<React.SetStateAction<Card | null>>;
  count: { player: number; opponent: number };
  showArrow: boolean;
  P2cpu: boolean;
};

const CardsContainer = ({
  yourCards,
  side,
  updatePicked,
  setHoveredCard,
  count,
  showArrow,
  P2cpu,
}: CardsContainerProps) => {
  const [delay, setDelay] = useState(false);

  useEffect(() => {
    setDelay(false);
    setTimeout(() => {
      setDelay(true);
    }, 1200);
  }, []);

  return (
    <Container>
      {showArrow && delay && <Arrow src={arrow} side={side} />}
      <Trail>
        {yourCards.length > 0 &&
          yourCards.map((card, index) => {
            return (
              card.available && (
                <CardImg
                  index={index}
                  key={index}
                  src={images[card.image].default}
                  side={side}
                  picked={card.picked}
                  onClick={() => {
                    if (P2cpu) {
                      showArrow &&
                        card.player === "player1" &&
                        updatePicked(
                          index,
                          side === "left" ? "player1" : "cpu"
                        );
                    } else {
                      showArrow &&
                        updatePicked(
                          index,
                          side === "left" ? "player1" : "cpu"
                        );
                    }
                  }}
                  onMouseOver={() => setHoveredCard(card)}
                  onMouseLeave={() => setHoveredCard(null)}
                />
              )
            );
          })}
      </Trail>
      <Count>{side === "left" ? count.player : count.opponent}</Count>
    </Container>
  );
};

export default CardsContainer;

type CardImgProps = {
  side: string;
  picked: boolean | undefined;
  index: number;
};

const Container = styled.div`
  position: relative;
  min-width: 180px;
  width: 180px;
  height: 475px;
  padding-top: 150px;
  margin: 0 75px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 15;
`;

const CardImg = styled.img<CardImgProps>`
  height: 200px;
  cursor: pointer;
  box-sizing: border-box;
  width: 180px;
  margin-top: -110px;
  position: relative;
  z-index: ${(p) => p.index};
  transform: ${({ picked, side }) =>
    picked
      ? side === "left"
        ? "translateX(50px)"
        : "translateX(-50px)"
      : null};
  &:hover {
    border: ${({ side }) =>
      side === "left"
        ? "2px solid rgb(70, 130, 199)"
        : "2px solid rgb(204, 86, 116)"};
  }
`;

//animated trail component

type TrailProps = {
  children: React.ReactNode;
};

const Trail = ({ children }: TrailProps) => {
  const items = React.Children.toArray(children);
  const trail = useTrail(items.length, {
    config: { mass: 5, tension: 2000, friction: 200 },
    y: 0,
    from: { y: -1500 },
  });

  return (
    <div>
      {trail.reverse().map((style, index) => {
        return (
          <animated.div key={index} style={style}>
            {items[index]}
          </animated.div>
        );
      })}
    </div>
  );
};

const Count = styled(animated.h1)`
  color: #e2e2e2;
  -webkit-text-stroke-width: 2px;
  -webkit-text-stroke-color: #1d1d1d;
  font-size: 90px;
  position: absolute;
  text-shadow: 2px 2px 10px rgb(53, 53, 53);
  bottom: -100px;
  z-index: 16;
`;

const grow = keyframes`
0%{
    transform: scale(1) rotateZ(180deg)
}
50% {
    transform: scale(1.1) rotateZ(180deg)
}
100% {
    transform: scale(1) rotateZ(180deg)
}
`;

type ArrowProps = {
  side: string;
};

const Arrow = styled.img<ArrowProps>`
  height: 70px;
  width: 70px;
  margin-top: -150px;
  z-index: 20;
  transform: ${({ side }) => side === "right" && "rotateZ(180deg)"};
  position: absolute;
  animation: ${({ side }) =>
    side === "left" &&
    css`
      ${grow} 1s linear infinite
    `};
`;
