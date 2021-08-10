const tokenEndpoint = `https://prod-in.100ms.live/hmsapi/webhisoka.app.100ms.live`;

export const getToken = async (data) => {
    const respone = await fetch(`${tokenEndpoint}/api/token`, {
        method: "POST",
        body: JSON.stringify({
            user_id: data.userName,
            role: data.role,
            type: "app",
            room_id: data.roomId,
        }),
    });

    const { token } = await respone.json();
    return token;
};
