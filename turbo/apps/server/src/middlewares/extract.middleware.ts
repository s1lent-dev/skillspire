import { AsyncHandler } from "../utils/handlers.util.js";
import { NextFunction, Request, Response } from "express";

interface MulterRequest extends Request {
    file?: Express.Multer.File;
    body: {
        avatar: string;
    }
}

const extractAvatar = AsyncHandler(async (req: MulterRequest, res: Response, next: NextFunction) => {
    const contentType = req.file?.mimetype;
    const fileName = req.file?.filename;
    console.log(contentType, fileName);
    req.body.avatar = `${fileName}-${contentType}`;
    next();
});

export { extractAvatar };