import React, { useContext, useEffect, useState } from "react";
import DailyIframe from "@daily-co/daily-js";
import TrayButton from "./TrayButton";
import {
    TYPE_LEAVE,
    TYPE_MUTE_CAMERA,
    TYPE_MUTE_MIC,
    TYPE_SCREEN,
} from "./Icon";
import CallObjectContext from "./context/CallObjectContext";
import { logDailyEvent } from "./utils/logUtils";

/**
 * Gets [isCameraMuted, isMicMuted, isSharingScreen].
 * This function is declared outside Tray() so it's not recreated every render
 * (which would require us to declare it as a useEffect dependency).
 */
const getStreamStates = (callObject) => {
    let isCameraMuted,
        isMicMuted,
        isSharingScreen = false;
    if (
        callObject &&
        callObject.participants() &&
        callObject.participants().local
    ) {
        const localParticipant = callObject.participants().local;
        isCameraMuted = !localParticipant.video;
        isMicMuted = !localParticipant.audio;
        isSharingScreen = localParticipant.screen;
    }
    return [isCameraMuted, isMicMuted, isSharingScreen];
};

const Tray = (props) => {
    const callObject = useContext(CallObjectContext);
    const [isCameraMuted, setCameraMuted] = useState(false);
    const [isMicMuted, setMicMuted] = useState(false);
    const [isSharingScreen, setSharingScreen] = useState(false);

    const toggleCamera = () => {
        callObject.setLocalVideo(isCameraMuted);
    };
    const toggleMic = () => {
        callObject.setLocalAudio(isMicMuted);
    };

    const toggleSharingScreen = () => {
        isSharingScreen
            ? callObject.stopScreenShare()
            : callObject.startScreenShare();
    };

    const leaveCall = () => {
        props.onClickLeaveCall && props.onClickLeaveCall();
    };

    /**
     * Start listening for participant changes when callObject is set (i.e. when the component mounts).
     * This event will capture any changes to your audio/video mute state.
     */
    useEffect(() => {
        if (!callObject) return;

        const handleNewParticipantsState = (event) => {
            event && logDailyEvent(event);
            const [isCameraMuted, isMicMuted, isSharingScreen] =
                getStreamStates(callObject);
            setCameraMuted(isCameraMuted);
            setMicMuted(isMicMuted);
            setSharingScreen(isSharingScreen);
        };

        // Use initial state
        handleNewParticipantsState();

        // Listen for changes in state
        callObject.on("participant-updated", handleNewParticipantsState);

        // Stop listening for changes in state
        return () => {
            callObject.off("participant-updated", handleNewParticipantsState);
        };
    }, [callObject]);

    return (
        <div className="tray">
            <TrayButton
                type={TYPE_MUTE_CAMERA}
                disabled={props.disabled}
                highlighted={isCameraMuted}
                onClick={toggleCamera}
            />
            <TrayButton
                type={TYPE_MUTE_MIC}
                disabled={props.disabled}
                highlighted={isMicMuted}
                onClick={toggleMic}
            />
            {DailyIframe.supportedBrowser().supportsScreenShare && (
                <TrayButton
                    type={TYPE_SCREEN}
                    disabled={props.disabled}
                    highlighted={isSharingScreen}
                    onClick={toggleSharingScreen}
                />
            )}
            <TrayButton
                type={TYPE_LEAVE}
                disabled={props.disabled}
                newButtonGroup={true}
                highlighted={true}
                onClick={leaveCall}
            />
        </div>
    );
};

export default Tray;
