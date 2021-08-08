import React, { useMemo, useRef } from "react";
import styled from "styled-components";
import { useCallState } from "../CallProvider";
import { LISTENER, MOD, SPEAKER } from "../constants/UserRoles";
import MicIcon from "./MicIcon";
import MutedIcon from "./MutedIcon";
import MoreIcon from "./MoreIcon";
import Menu from "./Menu";
import useClickAway from "../useClickAway";
import theme from "../theme";

const AVATAR_DIMENSION = 100;
const ADMIN_BADGE = "⭐";

const initials = (name) =>
    name
        ? name
              .split(" ")
              .map((n) => n.charAt(0))
              .join("")
        : "";

const Participant = ({ participant, local, modCount }) => {
    const {
        getAccountType,
        activeSpeakerId,
        changeAccountType,
        displayName,
        handleMute,
        handleUnmute,
        removeFromCall,
        lowerHand,
        raiseHand,
        leaveCall,
        endCall,
    } = useCallState();
    const { ref, isVisible, setIsVisible } = useClickAway(false);
    const audioRef = useRef(null);

    const showMoreMenu = useMemo(
        () => getAccountType(local?.user_name) === MOD || participant?.local,
        [getAccountType, local, participant]
    );

    const menuOptions = useMemo(() => {
        const mutedText = participant?.audio ? "Mute" : "Unmute";

        const audioAction = participant?.audio
            ? (id) => handleMute(id)
            : (id) => handleUnmute(id);

        /**
         * Determine what the menu options are based on the account type.
         * Listeners can't unmute but can raise their hand to speaker.
         * Moderators can change the status of others but can't have their
         * own status change to speaker or listener.
         * Moderators cannot unmute but can mute.
         */
        let options = [];

        /**
         * If it's the local particpant's menu:
         *  - Mods can unmute themselves and speakers.
         *  - Speakers can unmute themselves.
         *  - Listeners listen. :)
         */
        if (
            participant?.local &&
            [MOD, SPEAKER].includes(getAccountType(participant?.user_name))
        ) {
            options.push({
                text: mutedText,
                action: () => audioAction(participant),
            });
        }

        /**
         * If it's a remote participant:
         * Mods can only MUTE someone. We don't want
         * people getting unmuted without knowing because
         * it can be a bit invasive 😬
         */
        if (
            !participant?.local &&
            participant?.audio &&
            getAccountType(local?.user_name) === MOD &&
            [MOD, SPEAKER].includes(getAccountType(participant?.user_name))
        ) {
            options.push({
                text: "Mute",
                action: () => handleMute(participant),
            });
        }

        switch (getAccountType(participant?.user_name)) {
            case SPEAKER:
                if (!participant?.local) {
                    const o = [
                        {
                            text: "Make moderator",
                            action: () => changeAccountType(participant, MOD),
                        },
                        {
                            text: "Make listener",
                            action: () =>
                                changeAccountType(participant, LISTENER),
                        },
                        {
                            text: "Remove from call",
                            action: () => removeFromCall(participant),
                            warning: true,
                        },
                    ];
                    options = [...options, ...o];
                }
                break;
            case LISTENER:
                if (participant?.local) {
                    options.push({
                        text: participant?.user_name.includes("✋")
                            ? "Lower hand"
                            : "Raise hand ✋",
                        action: participant?.user_name.includes("✋")
                            ? () => lowerHand(participant)
                            : () => raiseHand(participant),
                    });
                } else {
                    const o = [
                        {
                            text: "Make moderator",
                            action: () => changeAccountType(participant, MOD),
                        },
                        {
                            text: "Make speaker",
                            action: () =>
                                changeAccountType(participant, SPEAKER),
                        },
                        {
                            text: "Remove from call",
                            action: () => removeFromCall(participant),
                            warning: true,
                        },
                    ];
                    options = [...options, ...o];
                }
                break;
            default:
                break;
        }

        /**
         * Let the local participant leave. (There's also
         * a button in the tray.) "Leave" or "Remove" should
         * be the last items
         */
        if (participant?.local) {
            const lastMod =
                modCount < 2 && getAccountType(participant?.user_name) === MOD;
            options.push({
                text: lastMod ? "End call" : "Leave call",
                action: () => (lastMod ? endCall() : leaveCall(participant)),
                warning: true,
            });
        }

        return options;
    }, [
        participant,
        local,
        getAccountType,
        changeAccountType,
        handleMute,
        handleUnmute,
        removeFromCall,
        endCall,
        lowerHand,
        leaveCall,
        modCount,
        raiseHand,
    ]);

    const name = displayName(participant?.user_name);

    return (
        <Container>
            <AvatarContainer>
                <Avatar
                    muted={!participant?.audio}
                    isActive={activeSpeakerId === participant?.user_id}
                >
                    <AvatarText>{initials(participant?.user_name)}</AvatarText>
                </Avatar>

                {getAccountType(participant?.user_name) !== LISTENER && (
                    <AudioIcon>
                        {participant?.audio ? <MicIcon /> : <MutedIcon />}
                    </AudioIcon>
                )}

                {showMoreMenu && menuOptions.length > 0 && (
                    <MenuButtonContainer>
                        <MenuButton onClick={() => setIsVisible(!isVisible)}>
                            <MoreIcon />

                            {isVisible && (
                                <MenuContainer ref={ref}>
                                    <Menu
                                        options={menuOptions}
                                        setIsVisible={setIsVisible}
                                    />
                                </MenuContainer>
                            )}
                        </MenuButton>
                    </MenuButtonContainer>
                )}
            </AvatarContainer>

            <Name>{name}</Name>
            <UserType>
                {participant?.owner ? `${ADMIN_BADGE} Admin` : ""}
            </UserType>

            {participant?.audioTrack && (
                <audio
                    autoPlay
                    playsInline
                    id={`audio-${participant.user_id}`}
                    ref={audioRef}
                />
            )}
        </Container>
    );
};

export default Participant;

const Container = styled.div`
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    max-width: ${AVATAR_DIMENSION + 20}px;
    padding: 10px;
`;

const AvatarContainer = styled.div`
    position: relative;
`;

const Avatar = styled.div`
    width: ${AVATAR_DIMENSION}px;
    height: ${AVATAR_DIMENSION}px;
    border-radius: 50%;
    background-color: ${(props) =>
        props.muted ? theme.colors.grey : theme.colors.turquoise};
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid
        ${(props) => (props.isActive ? theme.colors.teal : "violet")};
`;

const AvatarText = styled.p`
    font-size: ${theme.fontSize.large};
    color: ${theme.colors.blueLight};
    font-weight: 600;
    line-height: 32px;
`;
const Name = styled.p`
    color: ${theme.colors.blueDark};
    margin: 8px 0;
    font-weight: 400;
    font-size: ${theme.fontSize.base};
    padding-left: 4px;
    max-width: 80px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 20px;
`;

const UserType = styled.div`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const AudioIcon = styled.div`
    position: absolute;
    bottom: 2%;
    right: 2%;
`;

const MenuButtonContainer = styled.div`
    position: absolute;
    bottom: 2%;
    left: 2%;
`;

const MenuButton = styled.button`
    border: none;
    background-color: transparent;
    position: relative;
    padding: 0;
    cursor: pointer;
    display: grid;
    place-content: center;
`;

const MenuContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    width: fit-content;
    white-space: nowrap;
`;
