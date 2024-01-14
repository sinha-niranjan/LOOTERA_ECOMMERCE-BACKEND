import multer from "multer";
import { v4 } from "uuid";

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "uploads");
  },
  filename(req, file, callback) {
    const id = v4();
    const extName = file.originalname.split(".").pop();
    const fileName = `${id}.${extName}`;
    callback(null, fileName);
  },
});

export const singleUpload = multer({ storage }).single("photo");
