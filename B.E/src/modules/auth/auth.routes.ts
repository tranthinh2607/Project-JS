import { Router, Request, Response, NextFunction } from "express"
import controller from "./auth.controller"
import validateDTO from "@core/middlewares/dtoValidator"
import { RegisterDto, LoginDto, UpdateProfileDto, ChangePasswordDto } from "./dto/auth.dto"
import authMiddleware, { AuthRequest } from "@core/middlewares/auth.middleware"

const router = Router()

// Public routes
router.post("/register", validateDTO(RegisterDto), controller.register)
router.post("/login", validateDTO(LoginDto), controller.login)
router.post("/refresh-token", controller.refreshToken)

// Protected routes
router.get("/profile", authMiddleware, (req: AuthRequest, res: Response, next: NextFunction) => controller.getProfile(req, res, next))
router.put("/profile", authMiddleware, validateDTO(UpdateProfileDto), (req: AuthRequest, res: Response, next: NextFunction) => controller.updateProfile(req, res, next))
router.put("/change-password", authMiddleware, validateDTO(ChangePasswordDto), (req: AuthRequest, res: Response, next: NextFunction) => controller.changePassword(req, res, next))

export default router
