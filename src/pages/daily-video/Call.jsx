import React, { useCallback, useContext, useEffect, useReducer } from "react";
import {
    initialCallState,
    CLICK_ALLOW_TIMEOUT,
    PARTICIPANTS_CHANGE,
    CAM_OR_MIC_ERROR,
    FATAL_ERROR,
    callReducer,
    isLocal,
    isScreenShare,
    getMessage,
} from "./callState";
import CallObjectContext from "./context/CallObjectContext";
import Tile from "./Tile";
import { logDailyEvent } from "./utils/logUtils";
import "./Call.scss";
import CallMessage from "./CallMessage";
import InviteMessage from "./InviteMessage";

const Call = () => {
    const callObject = useContext(CallObjectContext);
    const [callState, dispatch] = useReducer(callReducer, initialCallState);

    /**
     * Start listening for participant changes, when the callObject is set.
     */
    useEffect(() => {
        if (!callObject) return;

        const events = [
            "participant-joined",
            "participant-updated",
            "participant-left",
        ];

        function handleNewParticipantsState(event) {
            event && logDailyEvent(event);
            dispatch({
                type: PARTICIPANTS_CHANGE,
                participants: callObject.participants(),
            });
        }

        // Use initial state
        handleNewParticipantsState();

        // Listen for changes in state
        for (const event of events) {
            callObject.on(event, handleNewParticipantsState);
        }

        // Stop listening for changes in state
        return function cleanup() {
            for (const event of events) {
                callObject.off(event, handleNewParticipantsState);
            }
        };
    }, [callObject]);

    /**
     * Start listening for call errors, when the callObject is set.
     */
    useEffect(() => {
        if (!callObject) return;

        function handleCameraErrorEvent(event) {
            logDailyEvent(event);
            dispatch({
                type: CAM_OR_MIC_ERROR,
                message:
                    (event && event.errorMsg && event.errorMsg.errorMsg) ||
                    "Unknown",
            });
        }

        // We're making an assumption here: there is no camera error when callObject
        // is first assigned.

        callObject.on("camera-error", handleCameraErrorEvent);

        return function cleanup() {
            callObject.off("camera-error", handleCameraErrorEvent);
        };
    }, [callObject]);

    /**
     * Start listening for fatal errors, when the callObject is set.
     */
    useEffect(() => {
        if (!callObject) return;

        function handleErrorEvent(e) {
            logDailyEvent(e);
            dispatch({
                type: FATAL_ERROR,
                message: (e && e.errorMsg) || "Unknown",
            });
        }

        // We're making an assumption here: there is no error when callObject is
        // first assigned.

        callObject.on("error", handleErrorEvent);

        return function cleanup() {
            callObject.off("error", handleErrorEvent);
        };
    }, [callObject]);

    /**
     * Start a timer to show the "click allow" message, when the component mounts.
     */
    useEffect(() => {
        const t = setTimeout(() => {
            dispatch({ type: CLICK_ALLOW_TIMEOUT });
        }, 2500);

        return function cleanup() {
            clearTimeout(t);
        };
    }, []);

    const sendHello = useCallback(
        (participantId) => {
            callObject &&
                callObject.sendAppMessage({ hello: "world" }, participantId);
        },
        [callObject]
    );

    const getTiles = () => {
        let smallTiles = [];
        Object.entries(callState.callItems).forEach(([id, callItem]) => {
            // TODO : Add screenshare
            // const isLarge = isScreenShare(id) || (!isLocal(id) && !containsScreenShare(callState.callItems));

            const tile = (
                <Tile
                    key={id}
                    videoTrackState={callItem.videoTrackState}
                    audioTrackState={callItem.audioTrackState}
                    isLocalPerson={isLocal(id)}
                    isLarge={false}
                    disableCornerMessage={isScreenShare(id)}
                    onClick={
                        isLocal(id)
                            ? null
                            : () => {
                                  sendHello(id);
                              }
                    }
                />
            );
            smallTiles.push(tile);
        });
        return smallTiles;
    };

    const smallTiles = getTiles();
    const message = getMessage(callState);

    return (
        <div className="call">
            <div className="small-tiles">{smallTiles}</div>
            <InviteMessage />
            {message && (
                <CallMessage
                    header={message.header}
                    detail={message.detail}
                    isError={message.isError}
                />
            )}
        </div>
    );
};

export default Call;
