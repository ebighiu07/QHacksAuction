import { Clock, Gavel } from "lucide-react";
import { useState } from "react";

export default function ProductCard({ title, imageUrl, currentBid, timeRemaining }) {
    const [previewImage, setPreviewImage] = useState(imageUrl);
    const [bid, setBid] = useState(currentBid);
    const [remainingTime, setRemainingTime] = useState(timeRemaining);

    return (
        <div className="rounded-3xl border-2 shadow-lg p-6 w-full max-w-[20rem] bg-white flex flex-col items-center relative">
            <h2 className="text-xl font-black text-zinc-800 mb-2">{title}</h2>
            <div className="relative w-full">
                <img
                    src={previewImage}
                    alt="Auction item"
                    className="w-full max-w-full h-auto object-cover rounded-2xl mb-4 aspect-square"
                />
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center bg-red-500 bg-opacity-75 text-white px-2 py-1 rounded-full">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm">{remainingTime}</span>
                </div>
            </div>
            <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-full mb-2">
                    <p className="text-4xl font-bold text-zinc-800 text-center">{`$${bid.toFixed(2)}`}</p>
                </div>
                <button
                    onClick={() => {
                        // alert('Bid placed');
                        // setBid(bid + 10); // Example, increase bid by $10
                    }}
                    className="w-full px-8 py-2 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600"
                >
                    Place Bid <Gavel className="ml-2 inline" />
                </button>
            </div>
        </div>
    );
}