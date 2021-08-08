import React from "react";
import {
    useHMSActions,
    useHMSStore,
    selectIsConnectedToRoom,
} from "@100mslive/hms-video-react";
import PreviewScreen from "./components/PreviewScreen";
import Room from "./components/Room";

const tokenEndpoint = `https://prod-in.100ms.live/hmsapi/webhisoka.app.100ms.live`;

const getToken = async (user_id) => {
    const respone = await fetch(`${tokenEndpoint}/api/token`, {
        method: "POST",
        body: JSON.stringify({
            user_id,
            role: "host",
            type: "app",
            room_id: "610f8fcaf30e773f47577b93",
        }),
    });

    const { token } = await respone.json();
    return token;
};

const MainMeeting = () => {
    const hmsActions = useHMSActions();
    const isConnected = useHMSStore(selectIsConnectedToRoom);
    const handleSubmit = async (userName) => {
        const token = await getToken(userName);
        const joinConfig = {
            userName: userName,
            authToken: token, //This token should be generated from your token service
            metaData: "Host joining", //This is custom string that you can attach.
            settings: {
                isAudioMuted: false, // Join with audio muted?
                isVideoMuted: false, // Join with video muted?
            },
        };

        hmsActions.join(joinConfig);
    };

    return (
        <>
            {isConnected ? (
                <Room />
            ) : (
                <PreviewScreen handleSubmit={handleSubmit} />
            )}
        </>
    );
};

export default MainMeeting;
