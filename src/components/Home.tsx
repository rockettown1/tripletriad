import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useSpring, animated, useChain, useSpringRef } from "react-spring";
import FFVIII from "../assets/images/other/FFVIII_logo.png";
import TT from "../assets/images/other/tripletriad.png";
import { mainMusic } from "../utils";
import { useNavigate } from "react-router-dom";
import Preferences from "./Preferences";

type HomeProps = {
  playMusic: boolean;
  setPlayMusic: React.Dispatch<React.SetStateAction<boolean>>;
  playSounds: boolean;
  setPlaySounds: React.Dispatch<React.SetStateAction<boolean>>;
  setOpponent: React.Dispatch<React.SetStateAction<string>>;
};

const Home = (props: HomeProps) => {
  const [showPreferences, setShowPreferences] = useState<boolean>(true);
  const ref1 = useSpringRef();
  const ref2 = useSpringRef();

  const fadeInOut = useSpring({
    ref: ref1,
    to: !showPreferences ? [{ opacity: 1 }, { opacity: 0 }] : [],
    from: { opacity: 0 },
    config: {
      duration: 2000,
    },
  });
  const fadeIn = useSpring({
    ref: ref2,
    to: !showPreferences ? { opacity: 1 } : {},
    from: { opacity: 0 },
    config: {
      duration: 1000,
    },
  });

  useChain([ref1, ref2]);

  let navigate = useNavigate();
  return (
    <div>
      {showPreferences && <Preferences {...props} show={setShowPreferences} />}

      {!showPreferences && (
        <IntroContainer>
          <Logo style={fadeInOut} src={FFVIII} alt="ff8 logo" />

          <Title style={fadeIn}>
            <h1>Let's Play</h1>
            <img src={TT} alt="ff8 logo" />
            <button onClick={() => navigate("/select")}>New Game</button>
            <button onClick={() => alert("I don't do anythning yet")}>
              About
            </button>
          </Title>
        </IntroContainer>
      )}
    </div>
  );
};

export default Home;

const IntroContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Logo = styled(animated.img)`
  position: absolute;
  opacity: 0;
`;
const Title = styled(animated.div)`
  display: flex;
  background-color: white;
  flex-direction: column;
  align-items: center;
  position: absolute;
  opacity: 0;
  button {
    margin-top: 30px;
  }
`;
