// index.js
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());

app.get("/get-ip", (req, res) => {
    const ip =
        req.headers["x-forwarded-for"]?.split(",")[0] ||
        req.socket.remoteAddress ||
        req.connection.remoteAddress;

    console.log("📩 IP truy cập:", ip);
    res.json({ ip });
});

app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
