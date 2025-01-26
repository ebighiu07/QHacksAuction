
import { useRef } from "react";
import { Camera } from "react-camera-pro";

export const CameraComponent = ({ onCapture }: { onCapture: (dataURL: string, jpegBlob: Blob) => void }) => {
  const camera = useRef(null);

  const handleTakePhoto = async () => {
    if (camera.current) {
      const photoDataURL = camera.current.takePhoto();
      if (!photoDataURL) return;

      const jpegBlob = await dataURLToJpeg(photoDataURL);
      onCapture(photoDataURL, jpegBlob);
    }
  };

  async function dataURLToJpeg(dataURL: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Failed to get 2D context"));
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Failed to convert to JPEG blob"));
        }, "image/jpeg");
      };
      img.onerror = (err) => reject(err);
      img.src = dataURL;
    });
  }

  return (
    <div className="h-full w-full relative">
      <Camera ref={camera} facingMode="environment" errorMessages={{
              noCameraAccessible: undefined,
              permissionDenied: undefined,
              switchCamera: undefined,
              canvas: undefined
          }} />
      <h1 className="absolute top-2 left-1/2 -translate-x-1/2 text-sm font-bold text-white z-10">
        Take a product photo
      </h1>
      <button
        onClick={handleTakePhoto}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-white/80 hover:bg-white flex items-center justify-center z-10"
      ></button>
    </div>
  );
};