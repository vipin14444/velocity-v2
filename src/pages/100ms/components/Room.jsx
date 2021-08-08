import React from "react";
import {
    useHMSActions,
    useHMSStore,
    selectLocalPeer,
    selectPeers,
} from "@100mslive/hms-video-react";
import VideoTile from "./VideoTile";
import ControlBar from "./ControlBar";

const Room = () => {
    const localPeer = useHMSStore(selectLocalPeer);
    const peers = useHMSStore(selectPeers);
    return (
        <div>
            Joined
            {JSON.stringify(localPeer)}
            <div style={{ marginTop: "5rem" }}>
                {localPeer && <VideoTile peer={localPeer} isLocal={true} />}
                {peers &&
                    peers
                        .filter((x) => !x.isLocal)
                        .map((peer, idx) => (
                            <VideoTile key={idx} peer={peer} isLocal={false} />
                        ))}
            </div>
            <ControlBar />
        </div>
    );
};

export default Room;
