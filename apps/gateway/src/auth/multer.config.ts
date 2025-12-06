import { diskStorage } from 'multer';
import { extname } from 'path';

export const profileImageStorage = diskStorage({
  destination: './uploads/profile-images',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtName = extname(file.originalname); // .png, .jpg, etc.
    cb(null, `${uniqueSuffix}${fileExtName}`);
  },
});
