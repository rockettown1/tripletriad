import styled from "styled-components";

type InfoPopupProps = {
  name: string | undefined;
};
const InfoPopup = ({ name }: InfoPopupProps) => {
  return (
    <Container show={name !== undefined}>
      <p>Info</p>
      <h3>{name}</h3>
    </Container>
  );
};

export default InfoPopup;

type ContainerProps = {
  show: boolean;
};

const Container = styled.div<ContainerProps>`
  width: 350px;
  height: 75px;
  z-index: 12;
  border: 3px solid #858585;
  background-color: rgb(30, 30, 37);
  position: absolute;
  bottom: 40px;
  color: white;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.5s all;
  opacity: ${({ show }) => (show ? 1 : 0)};
  h3 {
  }

  p {
    position: absolute;
    top: 0;
    left: 0;
    margin: 10px;
  }
`;
