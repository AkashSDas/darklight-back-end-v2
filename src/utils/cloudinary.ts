import { v2 } from "cloudinary";

/**
 * @param expressUploadTempPath The temp path provided by the `express-fileupload`
 */
export const uploadAnImage = async (
  expressUploadTempPath: string,
  dir: string
) => {
  const result = await v2.uploader.upload(expressUploadTempPath, {
    folder: `${process.env.CLOUDINARY_ROOT_DIR}/${dir}`,
    transformation: {
      width: 150,
      crop: "scale",
      fetch_format: "auto",
      effect: "cartoonify",
    },
  });

  return { id: result.public_id, URL: result.secure_url };
};

export const deleteAnImage = async (imgId: string) => {
  return await v2.uploader.destroy(imgId);
};
