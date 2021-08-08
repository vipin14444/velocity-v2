import React from "react";
import styled from "styled-components";
import theme from "./theme";
import { CallProvider, INCALL, PREJOIN, useCallState } from "./CallProvider";
import { SmallText } from "./components/shared/SmallText";
import PreJoinRoom from "./components/PreJoinRoom";
import InCall from "./components/InCall";

export const MOD = "MOD";
export const SPEAKER = "SPK";
export const LISTENER = "LST";

const DailyAudioContainer = () => {
    const { view } = useCallState();

    return (
        <AppContainer>
            <Wrapper>
                <Header>
                    <HeaderTop>
                        <Title>CloseAPP</Title>
                    </HeaderTop>
                    <SmallText>An audio API demo</SmallText>
                </Header>
                {view === PREJOIN && <PreJoinRoom />}
                {view === INCALL && <InCall />}
            </Wrapper>
        </AppContainer>
    );
};

const DailyAudio = () => {
    return (
        <CallProvider>
            <DailyAudioContainer></DailyAudioContainer>
        </CallProvider>
    );
};

const AppContainer = styled.div`
    background-color: ${theme.colors.greyLightest};
    width: 100%;
    height: 100vh;
    min-height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
`;
const Wrapper = styled.div`
    max-width: 700px;
    padding: 32px 24px 0;
    min-height: 100%;
    margin: 0 auto;
`;
// const Logo = styled.img`
//     height: 24px;
// `;
const Header = styled.header`
    display: flex;
    flex-direction: column;
`;
const HeaderTop = styled.header`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;
const Title = styled.h1`
    font-size: ${theme.fontSize.xxlarge};
    color: ${theme.colors.blueDark};
    margin: 4px 0;
    font-weight: 600;
`;
// const Link = styled.a`
//     font-weight: 400;
//     font-size: ${theme.fontSize.base};
//     color: ${theme.colors.greyDark};
//     display: flex;
//     justify-content: center;
//     max-width: 400px;

//     @media only screen and (min-width: 768px) {
//         justify-content: ${(props) => (props.center ? "center" : "flex-start")};
//         max-width: ${(props) => (props.center ? "100%" : "400px")};
//     }
// `;

export default DailyAudio;