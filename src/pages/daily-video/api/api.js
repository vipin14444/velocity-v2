const NEW_ROOM_ENDPOINT = `https://api.daily.co/v1/rooms`;
const API_KEY = `18211b76ab73ac1505ce92ad5cdcd6e7298c0f44382e4f3430b8ebda90013edd`;

export const createRoom = async () => {
    const exp = Math.round(Date.now() / 1000) + 60 * 30;
    const options = {
        properties: {
            exp: exp,
        },
    };
    let response = await fetch(NEW_ROOM_ENDPOINT, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${API_KEY}`,
            },
            body: JSON.stringify(options),
            mode: "cors",
        }),
        room = await response.json();
    return room;
};
