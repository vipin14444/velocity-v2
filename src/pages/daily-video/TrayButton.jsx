import React from "react";
import Icon from "./Icon";

const TrayButton = (props) => {
    return (
        <button
            disabled={props.disabled}
            onClick={props.onClick}
            className={
                "tray-button" + (props.newButtonGroup ? " new-group" : "")
            }
        >
            <Icon type={props.type} highlighted={props.highlighted} />
        </button>
    );
};

export default TrayButton;
