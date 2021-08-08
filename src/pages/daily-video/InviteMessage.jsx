import React from "react";

const InviteMessage = () => {
    return (
        <div>
            <h3>Invite others</h3>
            <p>
                Copy and share the url with others to invite them. Url:
                {window.location.href}
            </p>
            <button>Copy Url</button>
        </div>
    );
};

export default InviteMessage;
