import express from "express"
import { Register, Login } from "../controller/user.js";
const router = express.Router()

// handle login register

router.post("/", Register)
router.post("/login-user", Login)



export default router