const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const fetch = require("node-fetch");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// 1. Kết nối MongoDB
mongoose
    .connect("mongodb+srv://leducdientin92018:01667132440dien@cluster0.2xo5ndu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("✅ Kết nối MongoDB thành công"))
    .catch((err) => console.error("❌ Lỗi MongoDB:", err));

// 2. Định nghĩa schema
const IPLog = mongoose.model("IPLog", {
    ip: String,
    location: {
        city: String,
        region: String,
        country: String,
        latitude: Number,
        longitude: Number,
        org: String,
    },
    time: { type: Date, default: Date.now },
});

// 3. API lưu IP + vị trí
app.post("/log-ip", async (req, res) => {
    const { ip } = req.body;
    try {
        const response = await fetch(`https://ipapi.co/${ip}/json/`);
        const location = await response.json();

        const logData = {
            ip,
            location: {
                city: location.city,
                region: location.region,
                country: location.country_name,
                latitude: location.latitude,
                longitude: location.longitude,
                org: location.org,
            },
        };

        await IPLog.create(logData);
        console.log("📩 Đã lưu IP + vị trí:", logData);
        res.json({ success: true });
    } catch (err) {
        console.error("❌ Lỗi khi lưu IP:", err.message);
        res.status(500).json({ success: false });
    }
});

// 4. API lấy IP người dùng
app.get("/get-ip", (req, res) => {
    const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
    res.json({ ip });
});

app.listen(PORT, () => {
    console.log(`🚀 Backend đang chạy tại http://localhost:${PORT}`);
});
