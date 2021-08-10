import React from "react";
import { HMSRoomProvider } from "@100mslive/hms-video-react";
import Meet from "./Meet";

const MeetContainer = () => {
    return (
        <HMSRoomProvider>
            <Meet />
        </HMSRoomProvider>
    );
};

export default MeetContainer;
