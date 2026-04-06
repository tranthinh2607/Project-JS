import { Router } from "express"
import controller from "./auth.controller"
import validateDTO from "@core/middlewares/dtoValidator"
import { RegisterDto, LoginDto, UpdateProfileDto, ChangePasswordDto, GoogleLoginDto } from "./dto/auth.dto"
import authMiddleware from "@core/middlewares/auth.middleware"
import { uploadAvatar } from "@core/utils/upload"

const router = Router()

// Public routes
router.post("/register", validateDTO(RegisterDto), controller.register)
router.post("/login", validateDTO(LoginDto), controller.login)
router.post("/google", validateDTO(GoogleLoginDto), controller.googleLogin)

// Protected routes
router.get("/profile", authMiddleware, controller.getProfile)
router.put("/profile", authMiddleware, validateDTO(UpdateProfileDto), controller.updateProfile)
router.put("/change-password", authMiddleware, validateDTO(ChangePasswordDto), controller.changePassword)
router.patch("/avatar", authMiddleware, uploadAvatar.single("avatar"), controller.updateAvatar)

export default router
