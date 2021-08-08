import React from "react";
import { HMSRoomProvider, HMSThemeProvider } from "@100mslive/hms-video-react";
import MainMeeting from "./MainMeeting";

const Meet100ms = () => {
    return (
        <HMSRoomProvider>
            <HMSThemeProvider appBuilder={{ theme: "dark" }}>
                <MainMeeting />
            </HMSThemeProvider>
        </HMSRoomProvider>
    );
};

export default Meet100ms;
