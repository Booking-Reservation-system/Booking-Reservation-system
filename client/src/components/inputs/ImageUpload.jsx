import { useCallback, useEffect, useRef } from "react";
import { TbPhotoPlus } from "react-icons/tb";

const ImageUpload = (props) => {
  const { value, onChange } = props;

  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: "dpantwqyf",
        uploadPreset: "ml_default",
        folder: "ImageUploads",
        cropping: true,
      },
      function (error, result) {
        // console.log(result);
      }
    );
  }, []);


  return (
    <>
      <div
        onClick={() => widgetRef.current.open()}
        className="relative cursor-pointer hover:opacity-70 transition border-dashed border-2 p-20 border-neutral-300 flex flex-col justify-center items-center gap-4 text-neutral-600"
      >
        <TbPhotoPlus size={50} />
        <div className="font-semibold text-lg">Click to Upload</div>
        {value && (
          <div
            className="absolute inset-0 w-full h-full"
            onClick={handleUpload}
          >
            <img
              alt="Upload"
              fill
              style={{ objectFit: "cover" }}
              src={value}
            ></img>
          </div>
        )}
      </div>
    </>
  );
};

export default ImageUpload;
