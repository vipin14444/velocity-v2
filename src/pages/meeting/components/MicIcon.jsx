import styled from "styled-components";
import { ReactComponent as Mic } from "../icons/mic.svg";
import { ReactComponent as Simple } from "../icons/simple_mic.svg";

const MicIcon = ({ type = "default" }) => {
    return (
        <IconContainer>
            {type === "default" ? (
                <Mic className="mic-icon" />
            ) : (
                <Simple className="mic-icon" />
            )}
        </IconContainer>
    );
};

export default MicIcon;

const IconContainer = styled.div`
    display: grid;
    place-content: center;
`;
