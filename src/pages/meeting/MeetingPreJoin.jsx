import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { useCallState } from "./CallProvider";
import { LISTENER, MOD } from "./constants/UserRoles";

const MeetingPreJoin = () => {
    const { joinRoom, error } = useCallState();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [roomName, setRoomName] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const submitForm = useCallback(
        (e) => {
            e.preventDefault();
            if (submitting) return;
            setSubmitting(true);

            if (!firstName || !lastName) return;

            let userName = `${firstName} ${lastName}`;

            let name = "";
            if (roomName.trim()) {
                name = roomName.trim();
                /**
                 * We track the account type but appending it to the user object.
                 * This is a quick solution for a demo; not a production-worthy solution!
                 * You'd likely make a call to your server here to set the account type.
                 */
                userName = `${userName?.trim()}_${LISTENER}`;
            } else {
                /**
                 * If they're not submitting a specific room name, we'll create a new
                 * room in joinRoom() so let's make them the moderator by default.
                 */
                userName = `${userName?.trim()}_${MOD}`;
            }
            joinRoom({ userName, name });
        },
        [firstName, joinRoom, lastName, roomName, submitting]
    );

    return (
        <Container>
            <Title>Getting started</Title>
            <Form onSubmit={submitForm}>
                <Label htmlFor="fname">First name</Label>
                <Input
                    type="text"
                    id="fname"
                    name="fname"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
                <Label htmlFor="lname">Last name</Label>
                <Input
                    type="text"
                    id="lname"
                    name="lname"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
                <Label htmlFor="room">Join code</Label>
                <Input
                    type="text"
                    id="room"
                    name="room"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                />
                <SmallText>
                    Enter code to join an existing room, or leave empty to
                    create a new room.
                </SmallText>
                <Submit
                    type="submit"
                    value={
                        submitting
                            ? "Joining..."
                            : roomName?.trim()
                            ? "Join room"
                            : "Create and join room"
                    }
                />
                {error && <ErrorText>Error: {error.toString()}</ErrorText>}
            </Form>
        </Container>
    );
};

export default MeetingPreJoin;

const Container = styled.div``;

const Title = styled.h1``;
const Form = styled.form`
    display: flex;
    flex-direction: column;
`;
const SmallText = styled.p``;
const Label = styled.label``;
const Input = styled.input``;
const Submit = styled(Input)``;
const ErrorText = styled.p``;
