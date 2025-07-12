const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

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
    time: { type: Date, default: Date.now },
});

// 3. API log IP
app.post("/log-ip", async (req, res) => {
    const { ip } = req.body;
    try {
        await IPLog.create({ ip });
        console.log("📩 Lưu IP:", ip);
        res.json({ success: true });
    } catch (err) {
        console.error("❌ Lỗi khi lưu IP:", err);
        res.status(500).json({ success: false });
    }
});

// 4. API test lấy IP
app.get("/get-ip", (req, res) => {
    const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
    console.log("sadsad",ip);
    res.json({ ip });
});

app.listen(PORT, () => {
    console.log(`🚀 Backend đang chạy tại http://localhost:${PORT}`);
});
