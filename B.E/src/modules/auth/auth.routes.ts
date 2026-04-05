import { Router } from "express"
import controller from "./auth.controller"
import validateDTO from "@core/middlewares/dtoValidator"
import { RegisterDto, LoginDto, UpdateProfileDto, ChangePasswordDto } from "./dto/auth.dto"
import authMiddleware from "@core/middlewares/auth.middleware"

const router = Router()

// Public routes
router.post("/register", validateDTO(RegisterDto), controller.register)
router.post("/login", validateDTO(LoginDto), controller.login)
router.post("/refresh-token", controller.refreshToken)

// Protected routes
router.get("/profile", authMiddleware, controller.getProfile)
router.put("/profile", authMiddleware, validateDTO(UpdateProfileDto), controller.updateProfile)
router.put("/change-password", authMiddleware, validateDTO(ChangePasswordDto), controller.changePassword)

export default router
