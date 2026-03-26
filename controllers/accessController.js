const fs = require("fs");
const path = require("path");

const accessData = JSON.parse(
    fs.readFileSync(path.join(__dirname,"../state/access.json"))
);

const profilesData = JSON.parse(
    fs.readFileSync(path.join(__dirname,"../data/profiles.json"))
);

exports.resolveAccess = (req, res) => {
    const key = req.params.key;

    const accessEntry = accessData[key];
    console.log("Access data loaded:", accessData);
    console.log("Requested key:", key);

    if (!accessEntry) {
        return res.status(403).json({error:"Invalid access key"});
    }

    const { room, profile } = accessEntry;

    const allowedControls = profilesData[room]?.[profile];

    console.log("Room: ", room),
    console.log("Profile: ", profile),
    console.log("Profiles data: ", profilesData),
    console.log("Allowed controls: ", profilesData[room]?.[profile]);
    
    if (!allowedControls) {
        return res.status(500).json({ error: "Profile configuration error"});
    }

    res.json({
        location: "Daniel HQ",
        room,
        profile,
        allowedControls
    });
};