import styled from "styled-components";
import { ReactComponent as Muted } from "../icons/muted.svg";
import { ReactComponent as Simple } from "../icons/simple_muted.svg";

const MutedIcon = ({ type = "default" }) => {
    return (
        <IconContainer>
            {type === "default" ? (
                <Muted className="muted-icon" />
            ) : (
                <Simple className="muted-icon" />
            )}
        </IconContainer>
    );
};

export default MutedIcon;

const IconContainer = styled.div`
    display: grid;
    place-content: center;
`;
