import React from "react";
import styled from "styled-components";
import { HiUserGroup } from "react-icons/hi";
import { BiPlus } from "react-icons/bi";
import { MdMoreVert, MdVideocam, MdVideocamOff } from "react-icons/md";
import { IoMdMic, IoMdMicOff, IoMdGlobe } from "react-icons/io";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { HOST, LISTENER, MOD, SPEAKER } from "./constants/Roles";
import { getToken } from "./utils/apiUtils";
import Participant from "./components/Participant";
import { getMediaPermission } from "./utils/permissionUtils";
import SharedVideo from "./components/SharedVideo";
import {
	selectIsConnectedToRoom,
	selectIsLocalAudioEnabled,
	selectIsLocalVideoEnabled,
	selectLocalPeer,
	selectPeers,
	selectDevices,
	selectLocalMediaSettings,
	useHMSActions,
	useHMSStore,
} from "@100mslive/hms-video-react";

const VIEWS = {
	PREJOIN: "pre-join",
	INCALL: "in-call",
};

const Meet = () => {
	const [data, setData] = useState(null);
	const [name, setName] = useState("");
	const [role, setRole] = useState("host");
	const [view, setView] = useState(() => VIEWS.PREJOIN);
	const history = useHistory();

	const hmsActions = useHMSActions();
	const isConnected = useHMSStore(selectIsConnectedToRoom);
	const localPeer = useHMSStore(selectLocalPeer);
	const peers = useHMSStore(selectPeers);
	const isLocalAudioEnabled = useHMSStore(selectIsLocalAudioEnabled);
	const isLocalVideoEnabled = useHMSStore(selectIsLocalVideoEnabled);

	const devices = useHMSStore(selectDevices);
	console.log(`devices: `, devices);

	const selected = useHMSStore(selectLocalMediaSettings);
	console.log(`selected: `, selected);

	useEffect(() => {
		if (view === VIEWS.INCALL) {
			hmsActions.setLocalAudioEnabled(false);
			hmsActions.setLocalVideoEnabled(false);
			// hmsActions.changeRole(localPeer.id, SPEAKER, true)
		}
	}, [hmsActions, view]);

	useEffect(() => {
		const obj = new URLSearchParams(history.location.search).get("data");
		const roomId = new URLSearchParams(history.location.search).get("roomid");
		if (obj) {
			obj.roomId = roomId || "610f8fcaf30e773f47577b93";
			setData(obj);
			setView(VIEWS.INCALL);
		}
	}, [history]);

	const joinCallAsAGuest = async (e) => {
		if (name) {
			const roomId = new URLSearchParams(history.location.search).get("roomid");
			let newData = {
				userName: name,
				roomId: roomId || "610f8fcaf30e773f47577b93",
				role: role === HOST ? HOST : SPEAKER,
				displayPictureUrl: `https://randomuser.me/api/portraits/men/${
					Math.floor(Math.random() * 70) + 20
				}.jpg`,
			};

			const token = await getToken(newData);
			const joinConfig = {
				userName: name,
				authToken: token, //This token should be generated from your token service
				metaData: JSON.stringify(newData), //This is custom string that you can attach.
				settings: {
					isAudioMuted: true, // Join with audio muted?
					isVideoMuted: true, // Join with video muted?
				},
			};

			hmsActions.join(joinConfig);

			setData(newData);
			setView(VIEWS.INCALL);
		} else {
			alert("Cannot enter without name");
		}
	};

	const leaveRoom = () => {
		hmsActions.leave();
		setView(VIEWS.PREJOIN);
	};

	const toggleAudio = async () => {
		if (await getMediaPermission({ audio: true })) {
			hmsActions.setLocalAudioEnabled(!isLocalAudioEnabled);
		} else {
			alert("Audio device not found!");
		}
	};

	const toggleVideo = async () => {
		try {
			if (await getMediaPermission({ video: true })) {
				hmsActions.setLocalVideoEnabled(!isLocalVideoEnabled);
			} else {
				alert("Camera not found!");
			}
		} catch (err) {
			try {
				hmsActions.setLocalVideoEnabled(!isLocalVideoEnabled);
			} catch (err) {
				alert("Force camera enable failed");
			}
		}
	};

	const toggleCamera = async () => {
		const dID =
			"35f4ca7a24cd4857204f71f659c0ca7be1c7f60b5d35ed8555f120a22b62e11d";

		// const selectedVideoDeviceIndex = devices.videoInput.findIndex(
		// 	(x) => x.deviceId === selected.videoInputDeviceId
		// );
		// let nextDeviceIndex = 0;
		// if (selectedVideoDeviceIndex >= 0) {
		// 	if (selectedVideoDeviceIndex === devices.videoInput.length - 1) {
		// 		// Last element so go back to 1st one
		// 		nextDeviceIndex = 0;
		// 	} else {
		// 		// not last element so go the next element
		// 		nextDeviceIndex++;
		// 	}
		// }

		hmsActions.setVideoSettings({
			deviceId: dID,
			// deviceId: devices.videoInput[nextDeviceIndex].deviceId,
		});
	};

	const host = peers.find((x) => x.roleName === HOST);

	return (
		<>
			{view === VIEWS.PREJOIN && (
				<Container>
					<Header>सामूहिक चर्चा</Header>
					<Content>
						<div className="name-form" style={{ padding: "1rem" }}>
							<div className="form-group">
								<label htmlFor="name">Please enter your name:</label>
								<input
									type="text"
									id="name"
									name="name"
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="name">Please enter your role:</label>
								<input
									type="text"
									id="role"
									name="role"
									value={role}
									onChange={(e) => setRole(e.target.value)}
								/>
							</div>
							<div className="actions">
								<button onClick={joinCallAsAGuest}>Join</button>
							</div>
						</div>
					</Content>
				</Container>
			)}

			{view === VIEWS.INCALL && isConnected && data && (
				<Container>
					<Header>सामूहिक चर्चा</Header>
					<Content>
						<ContentHeader>
							<div className="row-1">
								<div className="details">
									<div className="location">
										<div className="name">बेटमा</div>
										<HiUserGroup />
									</div>
									<div className="title">साड़ी सेल, रोजाना बजे</div>
								</div>
								<div className="actions">
									<button className="btn btn-plus">
										<BiPlus />
									</button>
									<button className="btn btn-dots">
										<MdMoreVert />
									</button>
								</div>
							</div>

							<div className="row-2">
								<div className="meeting-privacy">
									<IoMdGlobe />
									<div className="meeting-type">खुली चर्चा</div>
								</div>
								<div className="meeting-users">
									<div className="user-stack">
										<img
											src={`https://randomuser.me/api/portraits/men/51.jpg`}
											className="user"
											alt={"user"}
										/>
										<img
											src={`https://randomuser.me/api/portraits/women/51.jpg`}
											className="user"
											alt={"user"}
										/>
										<img
											src={`https://randomuser.me/api/portraits/men/39.jpg`}
											className="user"
											alt={"user"}
										/>
									</div>
									<div className="rem-users">+40</div>
								</div>
							</div>
						</ContentHeader>

						<MeetingSection>
							{host ? <SharedVideo host={host} /> : null}
							<MeetingUsersContainer>
								{peers &&
									peers
										.filter((x) => !x.isLocal)
										.map((peer, idx) => (
											<Participant
												key={idx}
												peer={peer}
												localPeer={localPeer}
												isLocal={false}
											/>
										))}
								All: {JSON.stringify(devices.videoInput, null, 4)}
								<br />
								<br />
								Selected: {JSON.stringify(selected, null, 4)}
							</MeetingUsersContainer>

							<ActionTray>
								<ToggleActionsContainer>
									<ToggleActionsWrapper>
										{localPeer.roleName !== LISTENER ? (
											<ToggleMic
												active={isLocalAudioEnabled}
												onClick={toggleAudio}
											>
												{isLocalAudioEnabled ? <IoMdMic /> : <IoMdMicOff />}
											</ToggleMic>
										) : null}
										{localPeer.roleName === HOST ||
										localPeer.roleName === MOD ? (
											<>
												<ToggleVideo
													active={isLocalVideoEnabled}
													onClick={toggleVideo}
												>
													{isLocalVideoEnabled ? (
														<MdVideocam />
													) : (
														<MdVideocamOff />
													)}
												</ToggleVideo>
												{devices?.videoInput?.length > 1 ? (
													<ToggleVideo
														active={isLocalVideoEnabled}
														onClick={toggleCamera}
													>
														{isLocalVideoEnabled ? (
															<MdVideocam />
														) : (
															<MdVideocamOff />
														)}
													</ToggleVideo>
												) : null}
											</>
										) : null}
									</ToggleActionsWrapper>
								</ToggleActionsContainer>
								<button
									className="btn btn-danger btn-secondary"
									onClick={leaveRoom}
								>
									मीटिंग से बहार जाये
								</button>
								<button className="btn btn-action btn-primary">शेयर करे</button>
							</ActionTray>
						</MeetingSection>
					</Content>
				</Container>
			)}
		</>
	);
};

export default Meet;

const Container = styled.div`
	background: #f4f4f4;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	padding-top: 60px;
`;

const Header = styled.header`
	height: 60px;
	background-color: white;
	box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.230196);
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 1rem;
	color: #4f4f4f;
	position: fixed;
	width: 100%;
	top: 0;
	font-weight: 600;
	z-index: 100;
`;

const Content = styled.div`
	margin-top: 1rem;
	background: #ffffff;
	border-radius: 15px 15px 0px 0px;
	flex: 1;
	max-width: 1024px;
	margin: 1rem auto 0rem;
	width: 100%;
`;

const ContentHeader = styled.div`
	padding: 1rem;

	.btn {
		width: 40px;
		height: 40px;
		background: #eeeeee;
		border: none;
		border-radius: 50%;
		font-size: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.row-1 {
		display: flex;
		justify-content: space-between;
		align-items: center;

		.details {
			.location {
				font-size: 14px;
				display: flex;
				align-items: center;
				gap: 0.5rem;
				color: #4d2bd6;
			}

			.title {
				font-size: 19px;
				font-weight: 600;
			}
		}

		.actions {
			display: flex;
			margin-left: 1rem;
			gap: 0.5rem;

			.btn-dots {
				background: none;
			}
		}
	}

	.row-2 {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 1rem;

		.meeting-privacy {
			display: flex;
			align-items: center;
			gap: 0.5rem;
			color: #828282;

			.btn {
				width: 20px;
				height: 20px;
			}
		}

		.meeting-users {
			display: flex;
			align-items: center;

			.user-stack {
				display: flex;
				.user {
					width: 40px;
					height: 40px;
					background: #eeeeee;
					border-radius: 50%;
					border: 1px solid #d5d5d5;
				}

				.user + .user {
					margin-left: -0.5rem;
				}
			}

			.rem-users {
				color: #888888;
				font-weight: 800;
				margin-left: 0.5rem;
				font-size: 0.9rem;
			}
		}
	}
`;

const MeetingSection = styled.div``;

const MeetingUsersContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 1rem;
	row-gap: 2rem;
	padding: 1rem;
	margin-top: 1rem;
	padding-bottom: 12rem;
`;

const ActionTray = styled.div`
	position: fixed;
	bottom: 0;
	width: 100%;
	background-color: white;
	box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.230196);
	padding: 1rem;
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 1rem;
	max-width: 1024px;
	width: 100%;

	.btn {
		flex: 1;
		border: none;
		background: none;
		font-size: 1rem;
		border-radius: 14px;
		padding: 0.75rem 1rem;
		font-weight: 600;
	}

	.btn-danger {
		color: white;
		background: #f82a2a;
	}

	.btn-action {
		color: white;
		background: #5037e9;
	}
`;

const ToggleActionsContainer = styled.div`
	position: absolute;
	top: -1rem;
	left: 0;
	background: coral;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const ToggleButton = styled.button`
	width: 65px;
	height: 65px;
	border: none;
	background: none;
	font-size: 1rem;
	background: #4d2ad4;
	border-radius: 50%;
	display: grid;
	place-content: center;
	box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
	color: white;
	font-size: 2.25rem;
`;

const ToggleActionsWrapper = styled.div`
	position: absolute;
	bottom: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 1rem;
`;

const ToggleMic = styled(ToggleButton)`
	background: ${(props) => (!props.active ? "#f82a2a" : "#4d2ad4")};
`;

const ToggleVideo = styled(ToggleButton)`
	background: ${(props) => (!props.active ? "#f82a2a" : "#4d2ad4")};
`;
