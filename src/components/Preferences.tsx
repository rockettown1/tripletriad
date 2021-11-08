import { useState } from "react";
import { mainMusic, capture, cardSound, startSound } from "../utils";
import styled from "styled-components";
import Switch from "react-switch";

type PreferencesProps = {
  playMusic: boolean;
  setPlayMusic: React.Dispatch<React.SetStateAction<boolean>>;
  playSounds: boolean;
  setPlaySounds: React.Dispatch<React.SetStateAction<boolean>>;
  setOpponent: React.Dispatch<React.SetStateAction<string>>;
  show: React.Dispatch<React.SetStateAction<boolean>>;
};

const Preferences = ({
  playMusic,
  setPlayMusic,
  playSounds,
  setPlaySounds,
  setOpponent,
  show,
}: PreferencesProps) => {
  const [P2human, setP2human] = useState<boolean>(true);
  const [P2cpu, setP2cpu] = useState<boolean>(false);

  const handleMusic = (nextChecked: boolean) => {
    setPlayMusic(nextChecked);
    if (nextChecked) {
      mainMusic.currentTime = 0;
      mainMusic.play();
    } else {
      mainMusic.pause();
    }
  };
  const handleSounds = (nextChecked: boolean) => {
    setPlaySounds(nextChecked);
  };

  const handleOpp = (type: string) => {
    switch (type) {
      case "human_local":
        setP2human(true);
        setP2cpu(false);
        setOpponent("human");
        break;
      case "cpu":
        setP2human(false);
        setP2cpu(true);
        setOpponent("cpu");
        break;
      default:
        console.log("how did you reach here?");
    }
  };
  return (
    <Container>
      <Box>
        <h3>Welcome, please set your preferences:</h3>
        <label>
          <span>Play against another human (local)</span>
          <Switch checked={P2human} onChange={() => handleOpp("human_local")} />
        </label>
        <label>
          <span>Play against the CPU</span>
          <Switch checked={P2cpu} onChange={() => handleOpp("cpu")} />
        </label>
        <label>
          <span>Play against another human (online)</span>
          <Switch checked={false} onChange={() => {}} disabled />
        </label>
        <label>
          <span>Play Music</span>
          <Switch checked={playMusic} onChange={handleMusic} />
        </label>
        <label>
          <span>Play SoundFX</span>
          <Switch checked={playSounds} onChange={handleSounds} />
        </label>
        <Button onClick={() => show(false)}>OK, looks good.</Button>
        <p>
          I recommend playing music and sounds for the FFVIII experience, but
          you'll be able to mute at any time.
        </p>
      </Box>
    </Container>
  );
};

export default Preferences;

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.98);
  color: white;
  label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 400px;
    margin-bottom: 20px;
  }
  span {
    margin-right: 50px;
  }
`;

const Box = styled.div`
  height: 500px;
  width: 500px;
  background-color: black;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  h3 {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
  p {
    position: absolute;
    bottom: 0;
    margin: 15px;
  }
`;

const Button = styled.button`
  height: 40px;
`;
