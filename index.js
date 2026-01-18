const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const UAParser = require("ua-parser-js");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// 1. Kết nối MongoDB (Đã điền lại mật khẩu đúng của bạn)
// Mật khẩu là: 01667132440dien
const MONGO_URI = "mongodb+srv://leducdientin92018:01667132440dien@cluster0.2xo5ndu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
    .connect(MONGO_URI)
    .then(() => console.log("✅ Kết nối MongoDB thành công"))
    .catch((err) => console.error("❌ Lỗi MongoDB:", err));

// 2. Định nghĩa schema
const IPLog = mongoose.model("IPLog", {
    ip: String,
    time: { type: Date, default: Date.now },
    deviceInfo: Object // Lưu thông tin thiết bị
});

// 3. API log IP & Check Device
app.post("/log-ip", async (req, res) => {
    const { ip } = req.body;
    
    // Xử lý thông tin thiết bị
    const parser = new UAParser(req.headers['user-agent']);
    const result = parser.getResult();
    const deviceInfo = {
        type: result.device.type || 'desktop',
        os: result.os.name,
        browser: result.browser.name,
        fullUA: req.headers['user-agent']
    };

    try {
        await IPLog.create({ ip, deviceInfo });
        console.log(`📩 Lưu IP: ${ip} | Device: ${deviceInfo.type}`);
        res.json({ success: true, device: deviceInfo });
    } catch (err) {
        console.error("❌ Lỗi khi lưu IP:", err);
        res.status(500).json({ success: false });
    }
});

app.get("/get-ip", (req, res) => {
    const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
    res.json({ ip });
});

app.listen(PORT, () => {
    console.log(`🚀 Backend đang chạy tại http://localhost:${PORT}`);
});