import React from "react";
import styled from "styled-components";
import { CallProvider, useCallState } from "./CallProvider";
import { INCALL, PREJOIN } from "./constants/CallStatus";
import MeetingAfterJoin from "./MeetingAfterJoin";
import MeetingPreJoin from "./MeetingPreJoin";

const MeetingContainer = () => {
    const { view } = useCallState();
    return (
        <Container>
            <Wrapper>
                <div className="header" style={{ height: "60px" }}>
                    Header Here
                </div>
                {view === PREJOIN && <MeetingPreJoin />}
                {view === INCALL && <MeetingAfterJoin />}
            </Wrapper>
        </Container>
    );
};

const Meeting = () => {
    return (
        <CallProvider>
            <MeetingContainer />
        </CallProvider>
    );
};

export default Meeting;

const Container = styled.div`
    height: 100vh;
`;
const Wrapper = styled.div`
    width: 100%;
    max-width: 1024px;
    margin: 0 auto;
    padding: 1rem;
`;
