import React, { useState } from "react";
import styled from "styled-components";

const PreviewScreen = ({ handleSubmit }) => {
    const [firstName, setFirstName] = useState("");

    const submitForm = (e) => {
        e.preventDefault();
        handleSubmit(firstName);
    };

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
                <Submit type="submit" value={"Join room"} />
            </Form>
        </Container>
    );
};

export default PreviewScreen;

const Container = styled.div``;

const Title = styled.h1``;
const Form = styled.form`
    display: flex;
    flex-direction: column;
`;
const Label = styled.label``;
const Input = styled.input``;
const Submit = styled(Input)``;
