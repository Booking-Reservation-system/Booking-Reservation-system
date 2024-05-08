const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = {
    imageUpload: async (imageSrc, uploadPreset) => {
        const uploadResponse = await cloudinary.uploader.upload(imageSrc, {
            upload_preset: uploadPreset,
            timeout: 100000,
        });
        return {
            publicId: uploadResponse.public_id,
            secureUrl: uploadResponse.secure_url,
        };
    },

    imageDelete: async (publicId) => {
        return await cloudinary.uploader.destroy(publicId, {
            resource_type: "image",
            type: "upload",
            timeout: 100000,
        });
    }
};
