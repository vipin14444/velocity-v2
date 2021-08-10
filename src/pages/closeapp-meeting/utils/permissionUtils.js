export const isPermissionGranted = async (type) => {
    if (!type) {
        return false;
    }

    let permissionName = null;
    switch (type.toUpperCase()) {
        case "AUDIO":
            permissionName = "microphone";
            break;
        case "VIDEO":
            permissionName = "camera";
            break;
        default:
            break;
    }
    try {
        const permissionObj = await navigator.permissions.query({
            name: permissionName,
        });
        console.log(permissionName, permissionObj);

        if (permissionObj.state === "granted") return true;

        return false;
    } catch (err) {
        console.log(`Error`, err);
        return false;
    }
};

export const getMediaPermission = async (constraints) => {
    if (!navigator?.mediaDevices) {
        console.warn(
            `[INFO]: Unable to get media devices, confirm that the website is working on https.`
        );
        return false;
    }

    try {
        const res = await navigator.mediaDevices.getUserMedia(constraints);
        if (res) {
            return true;
        } else {
            console.warn(
                `[INFO]: Unable to get permission for ${JSON.stringify(
                    constraints
                )}`
            );
            return false;
        }
    } catch (err) {
        console.warn(
            `[INFO]: Unable to get permission for ${JSON.stringify(
                constraints
            )},`
        );
        console.error(err);
        return false;
    }
};
