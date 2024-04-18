const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = imageUpload = async (imageSrc, uploadPreset) => {
    const uploadResponse = await cloudinary.uploader.upload(imageSrc, {
        upload_preset: uploadPreset,
    });
    return uploadResponse.secure_url;
}
