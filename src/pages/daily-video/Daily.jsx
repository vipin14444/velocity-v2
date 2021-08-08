import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import DailyIframe from "@daily-co/daily-js";
import { logDailyEvent } from "./utils/logUtils";
import CallObjectContext from "./context/CallObjectContext";
import { createRoom } from "./api/api";
import Call from "./Call";
import Tray from "./Tray";
import { pageUrlFromRoomUrl, roomUrlFromPageUrl } from "./utils/urlUtils";

const STATE_IDLE = "STATE_IDLE";
const STATE_CREATING = "STATE_CREATING";
const STATE_JOINING = "STATE_JOINING";
const STATE_JOINED = "STATE_JOINED";
const STATE_LEAVING = "STATE_LEAVING";
const STATE_ERROR = "STATE_ERROR";

const DailyVideo = () => {
    const [appState, setAppState] = useState(STATE_IDLE);
    const [roomUrl, setRoomUrl] = useState(null);
    const [callObject, setCallObject] = useState(null);

    /**
     * Creates a new call room.
     */
    const createCall = useCallback(() => {
        setAppState(STATE_CREATING);
        return createRoom()
            .then((room) => room.url)
            .catch((error) => {
                console.log("Error creating room", error);
                setRoomUrl(null);
                setAppState(STATE_IDLE);
            });
    }, []);

    /**
     * Starts joining an existing call.
     */
    const startJoiningCall = useCallback((url) => {
        const newCallObject = DailyIframe.createCallObject();
        setRoomUrl(url);
        setCallObject(newCallObject);
        setAppState(STATE_JOINING);
        newCallObject.join({ url });
    }, []);

    /**
     * Starts leaving the current call.
     */
    const startLeavingCall = useCallback(() => {
        if (!callObject) return;
        // If we're in the error state, we've already "left", so just clean up
        if (appState === STATE_ERROR) {
            callObject.destroy().then(() => {
                setRoomUrl(null);
                setCallObject(null);
                setAppState(STATE_IDLE);
            });
        } else {
            setAppState(STATE_LEAVING);
            callObject.leave();
        }
    }, [callObject, appState]);

    /**
     * If a room's already specified in the page's URL when the component mounts,
     * join the room.
     */
    useEffect(() => {
        const url = roomUrlFromPageUrl();
        url && startJoiningCall(url);
    }, [startJoiningCall]);

    /**
     * Update the page's URL to reflect the active call when roomUrl changes.
     */
    useEffect(() => {
        const pageUrl = pageUrlFromRoomUrl(roomUrl);
        if (pageUrl === window.location.href) return;
        window.history.replaceState(null, null, pageUrl);
    }, [roomUrl]);

    const showCall = [STATE_JOINING, STATE_JOINED, STATE_ERROR].includes(
        appState
    );

    const enableCallButtons = [STATE_JOINED, STATE_ERROR].includes(appState);

    /**
     * Update app state based on reported meeting state changes.
     */
    useEffect(() => {
        if (!callObject) return;

        const events = ["joined-meeting", "left-meeting", "error"];

        const handleNewMeetingState = (event) => {
            event && logDailyEvent(event);
            switch (callObject.meetingState()) {
                case "joined-meeting":
                    setAppState(STATE_JOINED);
                    break;
                case "left-meeting":
                    callObject.destroy().then(() => {
                        setRoomUrl(null);
                        setCallObject(null);
                        setAppState(STATE_IDLE);
                    });
                    break;
                case "error":
                    setAppState(STATE_ERROR);
                    break;
                default:
                    break;
            }
        };

        // Use initial state
        handleNewMeetingState();

        // Listen for changes in state
        for (const event of events) {
            callObject.on(event, handleNewMeetingState);
        }

        // Stop listening for changes in state
        return () => {
            for (const event of events) {
                callObject.off(event, handleNewMeetingState);
            }
        };
    }, [callObject]);

    /**
     * Listen for app messages from other call participants.
     */
    useEffect(() => {
        if (!callObject) {
            return;
        }

        const handleAppMessage = (event) => {
            if (event) {
                logDailyEvent(event);
                console.log(
                    `received app message from ${event.fromId}: `,
                    event.data
                );
            }
        };

        callObject.on("app-message", handleAppMessage);

        return () => {
            callObject.off("app-message", handleAppMessage);
        };
    }, [callObject]);

    return (
        <Container>
            <div>Daily Video Demo</div>
            <div>{appState}</div>
            {showCall ? (
                <CallObjectContext.Provider value={callObject}>
                    <Call roomUrl={roomUrl} />
                    <Tray
                        disabled={!enableCallButtons}
                        onClickLeaveCall={startLeavingCall}
                    />
                </CallObjectContext.Provider>
            ) : (
                <div>
                    <button
                        onClick={() => {
                            createCall().then((url) => startJoiningCall(url));
                        }}
                    >
                        Start
                    </button>
                </div>
            )}
        </Container>
    );
};

export default DailyVideo;

const Container = styled.main``;
