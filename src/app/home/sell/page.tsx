"use client";

import { useState } from "react";
import { generateMetadata, generateUploadURL } from "./actions";
import { CameraComponent } from "./components/CameraComponent";
import { ImagePreview } from "./components/ImageComponent";
import { Gavel, X } from "lucide-react";
import { Bounce, ToastContainer, toast } from 'react-toastify';



export default function SellerPage() {
  const [image, setImage] = useState<Blob | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [metadata, setMetadata] = useState<string | null>(null);
  const [price, setPrice] = useState<number>(350); // Default price value
  const [duration, setDuration] = useState<string>("6hr");

  const handleCapture = (dataURL: string, jpegBlob: Blob) => {
    setPreviewImage(dataURL);
    setImage(jpegBlob);
  };



  const handleSubmit = async () => {
    if (!image) return;

    setUploading(true);

    try {
      const signedUrl = await generateUploadURL();
      await fetch(signedUrl, {
        method: "PUT",
        body: image,
        headers: {
          "Content-Type": "image/jpeg",
        },
      });
      const imageUrl = signedUrl.split("?")[0];
      console.log("Image URL: ", imageUrl);

      const meta = await generateMetadata(imageUrl);
      setMetadata(meta); // Save the metadata and trigger UI update
      setPrice(meta.price);
    } catch (error) {
      console.error(error);
      alert("Error submitting image");
    } finally {
      setUploading(false);
    }
  };

  const notify = () => toast.success('🎉 Product added to auction', {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
  });




  if (metadata) {
    return (
      <div className="flex flex-col items-center h-full w-full">

        <ToastContainer />

        <div className="rounded-3xl border-2 shado!w-lg p-6 w-full max-w-[20rem] bg-white flex flex-col items-center">
          <button
            onClick={() => { setMetadata(null); setImage(null); }}
            className="absolute top-6 right-10 text-zinc-500"
          >
            <X />
          </button>

          <h2 className="text-xl font-black text-zinc-800 mb-2">{metadata.title.replaceAll("\"", "")}</h2>

          <img
            src={previewImage!}
            alt="Captured"
            className="w-full max-w-full h-auto object-cover rounded-2xl mb-4 aspect-square"
          />
          {/* Price Adjustment Interface */}
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-4">
              <button
                onClick={() => setPrice((prev) => Math.max(prev - 10, 0))}
                className="min-w-10 h-10 rounded-full bg-zinc-200 hover:bg-zinc-300 text-zinc-800 text-2xl flex items-center justify-center"
              >
                -
              </button>
              <p className="text-4xl font-bold px-4">${price}</p>
              <button
                onClick={() => setPrice((prev) => prev + 10)}
                className="min-w-10 h-10 rounded-full bg-zinc-200 hover:bg-zinc-300 text-zinc-800 text-2xl flex items-center justify-center"
              >
                +
              </button>
            </div>

            <div className="flex space-x-4 mb-4">
              {["6hr", "12hr", "24hr"].map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`px-4 py-2 rounded-full ${duration === d ? "bg-blue-500 text-white" : "bg-zinc-200 text-zinc-800"}`}
                >
                  {d}
                </button>
              ))}
            </div>

            <button onClick={() => {
              notify();
              setMetadata(null);
              setImage(null);
            }} className="w-full px-4 py-2 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600">
              Auction <Gavel className="ml-2 inline" />
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full pb-20">

      <ToastContainer />


      <h1 className="text-2xl md:text-4xl text-zinc-700 font-semibold mt-4 justify-self-start text-center my-4">
        Scan a product to sell
      </h1>
      <div className="h-[30em] w-full max-w-[30rem] mx-auto relative rounded-3xl overflow-hidden">
        {!image ? (
          <CameraComponent onCapture={handleCapture} />
        ) : (
          <ImagePreview
            previewImage={previewImage!}
            uploading={uploading}
            onReset={() => setImage(null)}
            onSubmit={handleSubmit}
          />
        )}
      </div>

    </div>
  );
}
