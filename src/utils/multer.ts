import multer, { FileFilterCallback, StorageEngine } from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

type MulterFile = Express.Multer.File;

export const multerStorage = (
  destination: string,
  maxSize: number,
  allowedTypes: string[] = []
) => {
  try {
    const fullPath = path.resolve(destination);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }

    const storage: StorageEngine = multer.diskStorage({
      destination: function (
        req: Request,
        file: MulterFile,
        cb: (error: Error | null, destination: string) => void
      ) {
        cb(null, destination);
      },

      filename: function (
        req: Request,
        file: MulterFile,
        cb: (error: Error | null, filename: string) => void
      ) {
        const ext = path.extname(file.originalname).toLowerCase();
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${ext}`);
      },
    });

    const fileFilter = (
      req: Request,
      file: MulterFile,
      cb: FileFilterCallback
    ) => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (allowedTypes.length > 0 && allowedTypes.includes(ext)) {
        cb(null, true);
      } else {
        cb(
          new Error(
            "فرمت فایل نامعتبر است. فرمت‌های مجاز: تصاویر (.jpg, .jpeg)، ویدیو (.mp4, .mov, .avi)، اسناد (.pdf, .docx, .txt)"
          )
        );
      }
    };

    const upload = multer({
      storage: storage,
      limits: { fileSize: maxSize * 1024 * 1024 },
      fileFilter: fileFilter,
    });

    return upload;
  } catch (error) {
    throw error;
  }
};
