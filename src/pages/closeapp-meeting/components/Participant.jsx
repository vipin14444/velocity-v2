import React, { useCallback } from "react";
import styled from "styled-components";
import { IoMdMic, IoMdMicOff } from "react-icons/io";
import { useHMSStore, selectTracksMap } from "@100mslive/hms-video-react";

const Participant = ({ peer, isLocal }) => {
    // const isPeerAudioEnabled = useHMSStore((store) =>
    //     selectIsPeerAudioEnabled(peer.id, store)
    // ); //Is a remote peer muted?

    const getDisplayPicture = useCallback(() => {
        let customerDescription = peer.customerDescription;
        if (customerDescription) {
            customerDescription = JSON.parse(customerDescription);
            return customerDescription.displayPictureUrl;
        }
    }, [peer.customerDescription]);

    const tracksMap = useHMSStore(selectTracksMap);
    const isAudioEnabled = peer.audioTrack
        ? tracksMap[peer.audioTrack]?.enabled
        : false;

    const displayPictureUrl = getDisplayPicture();

    return (
        <ParticipantContainer>
            <AvatarContainer>
                <Avatar src={displayPictureUrl} />
                {isAudioEnabled ? (
                    <UnmutedIcon>
                        <IoMdMic />
                    </UnmutedIcon>
                ) : (
                    <MutedIcon>
                        <IoMdMicOff />
                    </MutedIcon>
                )}
            </AvatarContainer>
            <Name>{peer.name}</Name>
        </ParticipantContainer>
    );
};

export default Participant;

const ParticipantContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const AvatarContainer = styled.div`
    position: relative;
    width: 80px;
    height: 80px;
`;

const Avatar = styled.img`
    width: 100%;
    height: 100%;
    border-radius: 50%;
`;

const MutedIcon = styled.div`
    width: 30px;
    height: 30px;
    background-color: white;
    border-radius: 50%;
    position: absolute;
    bottom: 0;
    right: 0;
    border: 1px solid #f2f2f2;
    display: grid;
    place-content: center;
    color: #fd635e;
    font-size: 1.25rem;
`;

const UnmutedIcon = styled.div`
    width: 30px;
    height: 30px;
    background-color: white;
    border-radius: 50%;
    position: absolute;
    bottom: 0;
    right: 0;
    border: 1px solid #f2f2f2;
    display: grid;
    place-content: center;
    color: #4d2ad4;
    font-size: 1.25rem;
`;

const Name = styled.div`
    text-align: center;
    margin-top: 0.35rem;
`;
