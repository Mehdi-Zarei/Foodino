"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerStorage = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const multerStorage = (destination, maxSize, allowedTypes = []) => {
    try {
        const fullPath = path_1.default.resolve(destination);
        if (!fs_1.default.existsSync(fullPath)) {
            fs_1.default.mkdirSync(fullPath, { recursive: true });
        }
        const storage = multer_1.default.diskStorage({
            destination: function (req, file, cb) {
                cb(null, destination);
            },
            filename: function (req, file, cb) {
                const ext = path_1.default.extname(file.originalname).toLowerCase();
                const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
                cb(null, `${uniqueSuffix}${ext}`);
            },
        });
        const fileFilter = (req, file, cb) => {
            const ext = path_1.default.extname(file.originalname).toLowerCase();
            if (allowedTypes.length > 0 && allowedTypes.includes(ext)) {
                cb(null, true);
            }
            else {
                cb(new Error("فرمت فایل نامعتبر است. فرمت‌های مجاز: تصاویر (.jpg, .jpeg)، ویدیو (.mp4, .mov, .avi)، اسناد (.pdf, .docx, .txt)"));
            }
        };
        const upload = (0, multer_1.default)({
            storage: storage,
            limits: { fileSize: maxSize * 1024 * 1024 },
            fileFilter: fileFilter,
        });
        return upload;
    }
    catch (error) {
        throw error;
    }
};
exports.multerStorage = multerStorage;
