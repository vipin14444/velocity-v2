import React, { useEffect, useRef } from "react";
import {
	useHMSActions,
	useHMSStore,
	selectCameraStreamByPeerID,
} from "@100mslive/hms-video-react";
import styled from "styled-components";

const SharedVideo = ({ host }) => {
	const videoRef = useRef(null);
	const hmsActions = useHMSActions();
	const videoTrack = useHMSStore(selectCameraStreamByPeerID(host.id || ""));

	useEffect(() => {
		(async () => {
			if (videoRef.current && videoTrack) {
				if (videoTrack.enabled) {
					await hmsActions.attachVideo(videoTrack.id, videoRef.current);
				} else {
					await hmsActions.detachVideo(videoTrack.id, videoRef.current);
				}
			}
		})();
	}, [hmsActions, videoTrack]);

	return (
		<SharedVideoContainer>
			{videoTrack?.enabled ? (
				<>
					<VideoPlayer>
						<video
							ref={videoRef}
							src=""
							autoPlay={true}
							playsInline
							muted={true}
						></video>
					</VideoPlayer>
					<VideoSharingParticipant />
				</>
			) : null}
		</SharedVideoContainer>
	);
};

export default SharedVideo;

const SharedVideoContainer = styled.div`
	position: relative;
`;
const VideoPlayer = styled.div`
	margin-top: 1rem;
	aspect-ratio: 16/9;
	background: black;
	background-size: cover;
	display: flex;
	align-items: center;
	justify-content: center;

	video {
		width: 100%;
		height: 100%;
		border-radius: 6px;
		transform: rotateY(180deg);
		-webkit-transform: rotateY(180deg); /* Safari and Chrome */
		-moz-transform: rotateY(180deg); /* Firefox */
	}
`;

const VideoSharingParticipant = styled.div`
	width: 60px;
	height: 60px;
	background-image: url("https://randomuser.me/api/portraits/men/56.jpg");
	background-size: cover;
	border-radius: 50%;
	box-shadow: 0px 0px 0px 3px #ffffff, 0px 0px 0px 6px #4d2bd6;
	position: absolute;
	top: calc(1rem + 6px);
	left: calc(1rem + 6px);
`;
