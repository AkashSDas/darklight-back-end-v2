import { v2 } from "cloudinary";

/**
 * @param expressUploadTempPath The temp path provided by the `express-fileupload`
 * @param dir Where to upload the image
 */
export const uploadAnImage = async (
  expressUploadTempPath: string,
  dir: string
) => {
  const result = await v2.uploader.upload(expressUploadTempPath, {
    folder: `${process.env.CLOUDINARY_ROOT_DIR}/${dir}`,
    transformation: {
      fetch_format: "auto",
    },
  });

  return { id: result.public_id, URL: result.secure_url };
};

/**
 * Delete an image in the cloudinary
 * @param imgId The couldinary image id
 */
export const deleteAnImage = async (imgId: string) => {
  return await v2.uploader.destroy(imgId);
};
