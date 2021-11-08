import { useState, useEffect } from "react";
import Switch from "react-switch";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import {
  mainMusic,
  shuffleMusic,
  fanfare,
  capture,
  cardSound,
  startSound,
} from "../utils";

type MuteProps = {
  playMusic: boolean;
  playSounds: boolean;
  setPlayMusic: React.Dispatch<React.SetStateAction<boolean>>;
  setPlaySounds: React.Dispatch<React.SetStateAction<boolean>>;
};

const Mute = ({
  playMusic,
  playSounds,
  setPlayMusic,
  setPlaySounds,
}: MuteProps) => {
  const [music, setMusic] = useState<boolean>(playMusic);
  const [sounds, setSounds] = useState<boolean>(playSounds);
  const { pathname } = useLocation();

  useEffect(() => {
    if (music) {
    }
  }, [music]);

  const muteMusic = (nextChecked: boolean) => {
    if (playMusic) {
      mainMusic.muted = !nextChecked;
      shuffleMusic.muted = !nextChecked;
      fanfare.muted = !nextChecked;
      setMusic(nextChecked);
    } else {
      if (nextChecked) {
        if (pathname === "/game") {
          shuffleMusic.play();
          fanfare.muted = false;
        } else {
          mainMusic.play();
        }
      }
      setPlayMusic(true);
      setMusic(nextChecked);
    }
  };

  const muteSounds = (nextChecked: boolean) => {
    if (playSounds) {
      capture.muted = !nextChecked;
      cardSound.muted = !nextChecked;
      startSound.muted = !nextChecked;
      setSounds(nextChecked);
    } else {
      if (nextChecked) {
        capture.muted = false;
        cardSound.muted = false;
        startSound.muted = false;
      }
      setPlaySounds(true);
      setSounds(nextChecked);
    }
  };

  return (
    <Container>
      <label>
        <span>Music</span>
        <Switch checked={music} onChange={muteMusic} />
      </label>
      <label>
        <span>Sounds</span>
        <Switch checked={sounds} onChange={muteSounds} />
      </label>
    </Container>
  );
};

export default Mute;

const Container = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 30px;
  label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 150px;
    margin-bottom: 5px;
  }
`;
