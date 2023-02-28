import multer from "multer";

export const multerUpload = multer({
  limits: {
    fileSize: 2000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png)$/)) {
      return cb(new Error("please upload png"));
    }

    cb(undefined, true);
  },
});
