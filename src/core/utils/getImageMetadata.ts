import { FileSystemStoredFile } from "nestjs-form-data";
import getFileName from "./getFileName";

export function getImageMetadata(image: FileSystemStoredFile) {
    return {
        memeType: image.mimetype,
        size: image.size,
        url: getFileName(image)
    }
}