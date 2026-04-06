import multer from "multer"
import path from "path"
import fs from "fs"
import ApiError from "./apiError"

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = "uploads/avatars"
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true })
        }
        cb(null, uploadPath)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname))
    },
})

const fileFilter = (req: any, file: any, cb: any) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new ApiError(400, "Chỉ chấp nhận các định dạng ảnh (jpg, jpeg, png, webp)"), false)
    }
}

export const uploadAvatar = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
    },
})

const documentStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = "uploads/documents"
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true })
        }
        cb(null, uploadPath)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
        cb(null, uniqueSuffix + "-" + file.originalname)
    },
})

const documentFileFilter = (req: any, file: any, cb: any) => {
    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "text/plain",
        "text/csv",
        "application/rtf",
        "image/jpeg",
        "image/png",
        "image/webp"
    ]
    
    const allowedExtensions = [
        ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt", ".csv", ".rtf",
        ".jpg", ".jpeg", ".png", ".webp"
    ]

    const extension = path.extname(file.originalname).toLowerCase()
    
    if (allowedTypes.includes(file.mimetype) && allowedExtensions.includes(extension)) {
        cb(null, true)
    } else {
        cb(new ApiError(400, "Định dạng file không hỗ trợ. Vui lòng tải các file tài liệu (pdf, doc, docx, xls, xlsx, txt, csv) hoặc ảnh."), false)
    }
}

export const uploadDocument = multer({
    storage: documentStorage,
    fileFilter: documentFileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    },
})
