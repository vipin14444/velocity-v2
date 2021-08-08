import React from "react";
import {
    useHMSActions,
    useHMSStore,
    selectIsLocalAudioEnabled,
    selectIsLocalVideoEnabled,
} from "@100mslive/hms-video-react";
const ControlBar = () => {
    const hmsActions = useHMSActions();
    const isLocalAudioEnabled = useHMSStore(selectIsLocalAudioEnabled);
    const isLocalVideoEnabled = useHMSStore(selectIsLocalVideoEnabled);

    const toggleAudio = () => {
        hmsActions.setLocalAudioEnabled(!isLocalAudioEnabled);
    };
    const toggleVideo = () => {
        hmsActions.setLocalVideoEnabled(!isLocalVideoEnabled);
    };

    return (
        <div>
            <button onClick={toggleAudio}>
                {isLocalAudioEnabled ? "Mute" : "Unmute"}
            </button>
            <br />
            <button onClick={toggleVideo}>
                {isLocalVideoEnabled ? "Turn Video Off" : "Turn Video On"}
            </button>
        </div>
    );
};

export default ControlBar;
