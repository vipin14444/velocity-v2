import React, { useEffect, useRef } from "react";
import {
    useHMSActions,
    useHMSStore,
    selectCameraStreamByPeerID,
} from "@100mslive/hms-video-react";

const VideoTile = ({ peer, isLocal }) => {
    const videoRef = useRef(null);
    const hmsActions = useHMSActions();
    const videoTrack = useHMSStore(selectCameraStreamByPeerID(peer.id));

    useEffect(() => {
        (async () => {
            console.log(videoRef.current);
            console.log(videoTrack);

            if (videoRef.current && videoTrack) {
                if (videoTrack.enabled) {
                    await hmsActions.attachVideo(
                        videoTrack.id,
                        videoRef.current
                    );
                } else {
                    await hmsActions.detachVideo(
                        videoTrack.id,
                        videoRef.current
                    );
                }
            }
        })();
    }, [hmsActions, videoTrack]);

    return (
        <div>
            <video
                ref={videoRef}
                src=""
                autoPlay={true}
                playsInline
                muted={true}
                className={isLocal ? "mirror" : ""}
            ></video>
            <span>{peer.name}</span>
        </div>
    );
};

export default VideoTile;
