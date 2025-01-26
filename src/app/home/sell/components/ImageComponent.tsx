

import { Undo2 } from "lucide-react";

export const ImagePreview = ({
  previewImage,
  uploading,
  onReset,
  onSubmit,
}: {
  previewImage: string;
  uploading: boolean;
  onReset: () => void;
  onSubmit: () => void;
}) => (
  <div className="h-full w-full relative">
    <img
      src={previewImage}
      alt="Captured"
      className={
        "w-full h-full object-cover rounded-3xl" + (uploading ? " animate-pulse" : "")
      }
    />
    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-4 z-10">
      <button
        onClick={onReset}
        className="w-16 h-16 rounded-full bg-white/80 hover:bg-white flex items-center justify-center"
      >
        <Undo2 />
      </button>
      <button
        onClick={onSubmit}
        disabled={uploading}
        className="text-xl px-6 w-auto h-16 rounded-3xl bg-white text-black font-bold flex items-center justify-center"
      >
        {uploading ? "Uploading..." : "Submit"}
      </button>
    </div>
  </div>
);