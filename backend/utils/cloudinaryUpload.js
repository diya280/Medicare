
const cloudinary = require("../config/cloudinary");

async function uploadBase64Image(base64Image, folder) {
    if (typeof base64Image !== "string" || !base64Image.trim()) {
        throw new Error("Invalid image data");
    }

    // Support both Data URI and raw Base64
    const imageData = base64Image.startsWith("data:image/")
        ? base64Image : `data:image/png;base64,${base64Image}`;

    const result = await cloudinary.uploader.upload(imageData, {
        folder, resource_type: "image"
    });

    return {
        filename: result.public_id,
        url: result.secure_url,
        publicId: result.public_id
    };
}

module.exports = uploadBase64Image;
