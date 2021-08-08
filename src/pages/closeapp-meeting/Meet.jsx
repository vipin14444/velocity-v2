import React from "react";
import styled from "styled-components";
import { HiUserGroup } from "react-icons/hi";
import { BiPlus } from "react-icons/bi";
import { MdMoreVert } from "react-icons/md";
import { IoMdMic, IoMdMicOff, IoMdGlobe } from "react-icons/io";

const Meet = () => {
    return (
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
                    <SharedVideoContainer>
                        <VideoPlayer></VideoPlayer>
                        <VideoSharingParticipant />
                    </SharedVideoContainer>
                    <MeetingUsersContainer>
                        <Participant>
                            <AvatarContainer>
                                <Avatar
                                    src={`https://randomuser.me/api/portraits/women/26.jpg`}
                                />
                                <MutedIcon>
                                    <IoMdMicOff />
                                </MutedIcon>
                            </AvatarContainer>
                            <Name>सपना</Name>
                        </Participant>
                        <Participant>
                            <AvatarContainer>
                                <Avatar
                                    src={`https://randomuser.me/api/portraits/men/50.jpg`}
                                />
                                <UnmutedIcon>
                                    <IoMdMic />
                                </UnmutedIcon>
                            </AvatarContainer>
                            <Name>राजू</Name>
                        </Participant>
                        <Participant>
                            <AvatarContainer>
                                <Avatar
                                    src={`https://randomuser.me/api/portraits/men/77.jpg`}
                                />
                                <MutedIcon>
                                    <IoMdMicOff />
                                </MutedIcon>
                            </AvatarContainer>
                            <Name>दिनेश</Name>
                        </Participant>
                        <Participant>
                            <AvatarContainer>
                                <Avatar
                                    src={`https://randomuser.me/api/portraits/women/30.jpg`}
                                />
                                <UnmutedIcon>
                                    <IoMdMic />
                                </UnmutedIcon>
                            </AvatarContainer>
                            <Name>सरोज</Name>
                        </Participant>
                        <Participant>
                            <AvatarContainer>
                                <Avatar
                                    src={`https://randomuser.me/api/portraits/men/26.jpg`}
                                />
                                <MutedIcon>
                                    <IoMdMicOff />
                                </MutedIcon>
                            </AvatarContainer>
                            <Name>अंकुश</Name>
                        </Participant>
                        <Participant>
                            <AvatarContainer>
                                <Avatar
                                    src={`https://randomuser.me/api/portraits/men/33.jpg`}
                                />
                                <MutedIcon>
                                    <IoMdMicOff />
                                </MutedIcon>
                            </AvatarContainer>
                            <Name>अमित</Name>
                        </Participant>
                    </MeetingUsersContainer>

                    <ActionTray>
                        <ToggleMicContainer>
                            <ToggleMic>
                                <IoMdMic />
                            </ToggleMic>
                        </ToggleMicContainer>
                        <button className="btn btn-danger btn-secondary">
                            मीटिंग से बहार जाये
                        </button>
                        <button className="btn btn-action btn-primary">
                            शेयर करे
                        </button>
                    </ActionTray>
                </MeetingSection>
            </Content>
        </Container>
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
const SharedVideoContainer = styled.div`
    position: relative;
`;
const VideoPlayer = styled.div`
    margin-top: 1rem;
    aspect-ratio: 16/9;
    background-image: url("https://i.natgeofe.com/n/b3eec229-e359-4367-9502-29b444e244d7/20-rajasthan1469.jpg?w=636&h=424");
    background-size: cover;
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

const MeetingUsersContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    row-gap: 2rem;
    padding: 1rem;
    margin-top: 1rem;
    padding-bottom: 12rem;
`;

const Participant = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const AvatarContainer = styled.div`
    position: relative;
    width: 80px;
    height: 80px;
`;

const Avatar = styled.img`
    width: 100%;
    height: 100%;
    border-radius: 50%;
`;

const MutedIcon = styled.div`
    width: 30px;
    height: 30px;
    background-color: white;
    border-radius: 50%;
    position: absolute;
    bottom: 0;
    right: 0;
    border: 1px solid #f2f2f2;
    display: grid;
    place-content: center;
    color: #fd635e;
    font-size: 1.25rem;
`;

const UnmutedIcon = styled.div`
    width: 30px;
    height: 30px;
    background-color: white;
    border-radius: 50%;
    position: absolute;
    bottom: 0;
    right: 0;
    border: 1px solid #f2f2f2;
    display: grid;
    place-content: center;
    color: #4d2ad4;
    font-size: 1.25rem;
`;

const Name = styled.div`
    text-align: center;
    margin-top: 0.35rem;
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

const ToggleMicContainer = styled.div`
    position: absolute;
    top: -1rem;
    left: 0;
    background: coral;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ToggleMic = styled.button`
    position: absolute;
    bottom: 0;
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
