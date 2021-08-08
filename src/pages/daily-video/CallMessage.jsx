import React from "react";
import "./CallMessage.scss";

const CallMessage = (props) => {
    console.log("CallMessage", props);

    return (
        <div className={"call-message" + (props.isError ? " error" : "")}>
            <p className="call-message-header">{props.header}</p>
            <p>{props.detail}</p>
        </div>
    );
};

export default CallMessage;
