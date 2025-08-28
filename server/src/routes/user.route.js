import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { registerCandidate, registerRecruiter, loginCandidate, loginRecruiter, refreshToken, getAllUsers } from "../controller/user.controller.js";
import { authRateLimiterMiddleware } from "../middlewares/rateLimiter.js";
import { verifyToken } from "../../utils/jwtUtils.js";
import { User } from "../model/user.model.js";

const router = express.Router();

router.post("/register/candidate", authRateLimiterMiddleware, registerCandidate); // { name, email, password }
router.post("/register/recruiter", authRateLimiterMiddleware, registerRecruiter); // { company, email, password }
router.post("/login/candidate", authRateLimiterMiddleware, loginCandidate); // { email, password }
router.post("/login/recruiter", authRateLimiterMiddleware, loginRecruiter); // { email, password }
router.post("/refresh", refreshToken); // { refreshToken }
router.get("/", getAllUsers); // Get all users

// Ensure uploads directory exists
const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user.id}-${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// Get current user profile
router.get("/me", verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// Update current user profile
router.put("/me", verifyToken, async (req, res) => {
  try {
    const allowed = ["name","title","location","rate","currency","about","avatarUrl","coverUrl"];
    const updates = {};
    for (const key of allowed) if (key in req.body) updates[key] = req.body[key];
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select("-password");
    res.json(user);
  } catch (e) {
    res.status(500).json({ message: "Failed to update profile" });
  }
});

// Upload avatar
router.post("/me/avatar", verifyToken, upload.single("avatar"), async (req, res) => {
  const url = `/uploads/${req.file.filename}`;
  await User.findByIdAndUpdate(req.user.id, { avatarUrl: url });
  res.json({ avatarUrl: url });
});

// Upload cover
router.post("/me/cover", verifyToken, upload.single("cover"), async (req, res) => {
  const url = `/uploads/${req.file.filename}`;
  await User.findByIdAndUpdate(req.user.id, { coverUrl: url });
  res.json({ coverUrl: url });
});

// Generic helper to create simple array CRUD routes
function arrayRoutes(key) {
  router.get(`/me/${key}`, verifyToken, async (req, res) => {
    const user = await User.findById(req.user.id).select(key);
    res.json(user?.[key] || []);
  });

  router.post(`/me/${key}`, verifyToken, async (req, res) => {
    const update = { $push: { [key]: req.body } };
    const user = await User.findByIdAndUpdate(req.user.id, update, { new: true }).select(key);
    res.status(201).json(user[key][user[key].length - 1]);
  });

  router.put(`/me/${key}/:itemId`, verifyToken, async (req, res) => {
    const { itemId } = req.params;
    const user = await User.findOneAndUpdate(
      { _id: req.user.id, [`${key}._id`]: itemId },
      { $set: Object.fromEntries(Object.entries(req.body).map(([k,v]) => ([`${key}.$.${k}`, v]))) },
      { new: true }
    ).select(key);
    if (!user) return res.status(404).json({ message: 'Item not found' });
    const updated = user[key].find(p => String(p._id) === itemId);
    res.json(updated);
  });

  router.delete(`/me/${key}/:itemId`, verifyToken, async (req, res) => {
    const { itemId } = req.params;
    await User.findByIdAndUpdate(req.user.id, { $pull: { [key]: { _id: itemId } } }, { new: true }).select(key);
    res.json({ ok: true });
  });
}

// Portfolio CRUD
arrayRoutes('portfolio');
// Experience, Education, Qualifications, Certifications
arrayRoutes('experiences');
arrayRoutes('education');
arrayRoutes('qualifications');
arrayRoutes('certifications');

// Upload portfolio image
router.post('/me/portfolio/upload', verifyToken, upload.single('image'), async (req, res) => {
  const url = `/uploads/${req.file.filename}`;
  res.json({ imageUrl: url });
});

export default router;
