import { useState, useEffect } from "react";
import styled from "styled-components";
import "./App.css";
import Mute from "./components/Mute";
import Home from "./components/Home";
import Selection from "./components/Selection";
import Game from "./components/Game";
import WinnersChoice from "./components/WinnersChoice";
import { startingCards, Card } from "./utils/";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useWindowSize } from "./utils/useWindowSize";
import backgroundImage from "./assets/images/other/card-board.png";
import ff8 from "./assets/images/other/FFVIII_logo.png";
import tt from "./assets/images/other/tripletriad.png";

export type Status = {
  status: boolean;
  details: { winner: string | undefined; message: string };
} | null;

function App() {
  const [yourCards, setYourCards] = useState<Card[]>([]);
  const [oppsCards, setOppsCards] = useState<Card[]>([]);
  const [selectedCount, setSelectedCount] = useState<number>(0);
  const [selection, setSelection] = useState<Card[]>([]);
  const [playMusic, setPlayMusic] = useState<boolean>(false);
  const [playSounds, setPlaySounds] = useState<boolean>(false);
  const [status, setStatus] = useState<Status | null>(null);
  const [P2human, setP2human] = useState<boolean>(false);
  const [P2cpu, setP2cpu] = useState<boolean>(true);

  let navigate = useNavigate();
  let { pathname } = useLocation();
  let { width } = useWindowSize();

  useEffect(() => {
    navigate("/");
    //randomly assign cards when app first loaded
    setYourCards(startingCards(10));
    setOppsCards(startingCards(5));
  }, []);

  const selectPlayable = (index: number) => {
    //reset opponent cards if this is not first time here
    const opps = [...oppsCards];
    for (const card of opps) {
      card.available = true;
      card.animate = false;
      card.player = "";
    }
    setOppsCards(opps);
    //select 5 from starting 10
    const allCards = [...yourCards];

    //Note: there's currently a bug when trying to play more than 1 of the same card.

    allCards[index].player = "player1";
    //resetting incase they've been animated in the past
    allCards[index].animate = false;

    if (selectedCount < 5) {
      if (!allCards[index].selected) {
        allCards[index].selected = true;
        setSelectedCount((prev) => prev + 1);
      } else {
        allCards[index].selected = false;
        setSelectedCount((prev) => prev - 1);
      }
    }
    if (selectedCount === 5) {
      if (allCards[index].selected) {
        allCards[index].selected = false;
        setSelectedCount((prev) => prev - 1);
      }
    }
    //update your cards with the ones you've selected to play with.
    setYourCards(allCards);
  };

  return width! < 1000 ? (
    <Container>
      <h1>You need to play this on a bigger screen.</h1>
    </Container>
  ) : (
    <Container>
      {pathname !== "/" && (
        <Mute
          playMusic={playMusic}
          playSounds={playSounds}
          setPlayMusic={setPlayMusic}
          setPlaySounds={setPlaySounds}
        />
      )}
      <Routes>
        <Route
          path="/"
          element={
            <Home
              setPlayMusic={setPlayMusic}
              playMusic={playMusic}
              setPlaySounds={setPlaySounds}
              playSounds={playSounds}
              P2human={P2human}
              setP2human={setP2human}
              P2cpu={P2cpu}
              setP2cpu={setP2cpu}
            />
          }
        />
        <Route
          path="/select"
          element={
            <Selection
              allCards={yourCards}
              selectedCount={selectedCount}
              setSelectedCount={setSelectedCount}
              selectPlayable={selectPlayable}
              selection={selection}
              setSelection={setSelection}
              setStatus={setStatus}
            />
          }
        />
        <Route
          path="/game"
          element={
            <Game
              yourCards={selection}
              setYourCards={setSelection}
              oppsCards={oppsCards}
              setOppsCards={setOppsCards}
              playMusic={playMusic}
              playSounds={playSounds}
              status={status}
              setStatus={setStatus}
              P2cpu={P2cpu}
            />
          }
        />
        <Route
          path="/winner"
          element={
            <WinnersChoice
              yourCards={selection}
              allYourCards={yourCards}
              oppsCards={oppsCards}
              setYourCards={setYourCards}
              setOppsCards={setOppsCards}
              status={status}
              P2cpu={P2cpu}
            />
          }
        />
      </Routes>
      {/* Dirty hacker */}
      <img src={backgroundImage} style={{ display: "none" }} alt="hidden" />
      <img src={ff8} style={{ display: "none" }} alt="hidden" />
      <img src={tt} style={{ display: "none" }} alt="hidden" />
    </Container>
  );
}

export default App;

const Container = styled.div`
  text-align: center;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;
