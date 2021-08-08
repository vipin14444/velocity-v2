export const roomUrlFromPageUrl = () => {
    const match = window.location.search.match(/roomUrl=([^&]+)/i);
    return match && match[1] ? decodeURIComponent(match[1]) : null;
};

export const pageUrlFromRoomUrl = (roomUrl) => {
    return (
        window.location.href.split("?")[0] +
        (roomUrl ? `?roomUrl=${encodeURIComponent(roomUrl)}` : "")
    );
};
