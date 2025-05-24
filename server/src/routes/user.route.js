import express from "express";
import { registerCandidate, registerRecruiter, loginCandidate, loginRecruiter } from "../controller/user.controller.js";

const router = express.Router();

router.post("/register/candidate", registerCandidate); // { name, email, password }
router.post("/register/recruiter", registerRecruiter); // { company, email, password }
router.post("/login/candidate", loginCandidate); // { email, password }
router.post("/login/recruiter", loginRecruiter); // { email, password }

export default router;
