import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import { useCallState } from "./CallProvider";
import CopyLinkBox from "./components/CopyLinkBox";
import MicIcon from "./components/MicIcon";
import MutedIcon from "./components/MutedIcon";
import Participant from "./components/Participant";
import { INCALL } from "./constants/CallStatus";
import { LISTENER, MOD, SPEAKER } from "./constants/UserRoles";

const MeetingAfterJoin = () => {
    const {
        participants,
        room,
        view,
        getAccountType,
        leaveCall,
        handleMute,
        handleUnmute,
        raiseHand,
        lowerHand,
        endCall,
    } = useCallState();

    console.log(participants);

    const local = useMemo(
        () => participants?.filter((p) => p?.local)[0],
        [participants]
    );

    const moderators = useMemo(
        () =>
            participants?.filter(
                (p) => p?.owner && getAccountType(p?.user_name) === MOD
            ),
        [getAccountType, participants]
    );

    const speakers = useMemo(
        () =>
            participants?.filter(
                (p) => getAccountType(p?.user_name) === SPEAKER
            ),
        [participants, getAccountType]
    );

    const listeners = useMemo(
        () =>
            participants
                ?.filter((p) => getAccountType(p?.user_name) === LISTENER)
                .sort((a, _) => {
                    // Move raised hands to front of list
                    if (a?.user_name.includes("✋")) return -1;
                    return 0;
                }),
        [getAccountType, participants]
    );

    const handleAudioChange = useCallback(
        () => (local?.audio ? handleMute(local) : handleUnmute(local)),
        [handleMute, handleUnmute, local]
    );

    const handleHandRaising = useCallback(
        () =>
            local?.user_name.includes("✋")
                ? lowerHand(local)
                : raiseHand(local),
        [lowerHand, raiseHand, local]
    );

    const moderatorTiles = useMemo(() => {
        const users = [...moderators];
        return (
            <ModsContainer>
                {users.map((p, i) => (
                    <Participant
                        participant={p}
                        key={`speaking-${p.user_id}`}
                        local={local}
                        modCount={users?.length}
                    />
                ))}
            </ModsContainer>
        );
    }, [local, moderators]);

    const speakerTiles = useMemo(() => {
        const users = [...speakers];
        return (
            <SpeakersContainer>
                {users.map((p, i) => (
                    <Participant
                        participant={p}
                        key={`speaking-${p.user_id}`}
                        local={local}
                        modCount={users?.length}
                    />
                ))}
            </SpeakersContainer>
        );
    }, [local, speakers]);

    const listenerTiles = useMemo(() => {
        const users = [...listeners];
        return (
            <ListenersContainer>
                {users.map((p, i) => (
                    <Participant
                        participant={p}
                        key={`speaking-${p.user_id}`}
                        local={local}
                        modCount={users?.length}
                    />
                ))}
            </ListenersContainer>
        );
    }, [local, listeners]);

    return (
        <Container hidden={view !== INCALL}>
            Dashboard
            <Section>
                <Title>Moderators</Title>
                {moderatorTiles}
            </Section>
            <Section>
                <Title>Speakers</Title>
                {speakerTiles}
            </Section>
            <Section>
                <Title>Listeners</Title>
                {listenerTiles}
            </Section>
            <Section>
                <CopyLinkBox room={room} />
            </Section>
            <Tray>
                <TrayContent>
                    {[MOD, SPEAKER].includes(
                        getAccountType(local?.user_name)
                    ) ? (
                        <AudioButton onClick={handleAudioChange}>
                            {local?.audio ? (
                                <MicIcon type="simple" />
                            ) : (
                                <MutedIcon type="simple" />
                            )}
                            <ButtonText>
                                {local?.audio ? "Mute" : "Unmute"}
                            </ButtonText>
                        </AudioButton>
                    ) : (
                        <HandButton onClick={handleHandRaising}>
                            <ButtonText>
                                {local?.user_name.includes("✋")
                                    ? "Lower hand"
                                    : "Raise hand ✋"}
                            </ButtonText>
                        </HandButton>
                    )}
                </TrayContent>
            </Tray>
        </Container>
    );
};

export default MeetingAfterJoin;

const Container = styled.div``;
const Section = styled.section``;
const Title = styled.h3``;
const ModsContainer = styled.div``;
const SpeakersContainer = styled.div``;
const ListenersContainer = styled.div``;
const Tray = styled.div``;
const TrayContent = styled.div``;
const Button = styled.button``;
const AudioButton = styled(Button)`
    margin-right: auto;
    display: flex;
    align-items: center;
`;
const ButtonText = styled.span`
    margin-left: 4px;
`;
const HandButton = styled(Button)`
    margin-right: auto;
`;
