"use client"

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock, Gavel, Heart, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import NumberFlow from '@number-flow/react'

const cards = [
  { title: "Foosball table of very important value you should buy", imageUrl: "/product_1.jpg", initialBid:100, currentBid: 100, endTime: "2025-01-27T18:30:00" },
  { title: "laptop", imageUrl: "/product_2.jpg", initialBid:150, currentBid: 150, endTime: "2025-01-27T12:20:00" },
  { title: "Even Cooler Foosball table", imageUrl: "/product_1.jpg", initialBid:1000, currentBid: 1000, endTime: "2025-01-27T20:30:00" },
];

export default function Home() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);



  // Handle swipe gestures
  const handleSwipe = (direction: string) => {
    if (direction === "left" || direction === "right") {
      setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length); // cycle through cards
    }
    if (direction === "right") {
      toast('❤️ Product liked', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        // pauseOnHover: true,
        // draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      
    }
  };

  return (
    <div className="h-screen overflow-hidden">
      <div className="flex flex-col items-center h-full">
        {cards.length > 0 && (
          <SwipeableCard
            card={cards[currentCardIndex]}
            onSwipe={handleSwipe}
            currentCardIndex={currentCardIndex}
          />
        )}
      </div>
    </div>
  );
}
const SwipeableCard = ({ card, onSwipe, currentCardIndex }: { card: {
  initialBid: ReactNode; title: string; imageUrl: string; currentBid: number; timeRemaining: string 
}; onSwipe: (direction: string) => void, currentCardIndex: number }) => {
  const [remainingTime, setRemainingTime] = useState("");
  const [offerClicked, setOfferClicked] = useState(false);

  const handleOfferClick = () => {
    setOfferClicked(true);
  };


  useEffect(() => {
    const interval = setInterval(() => {
      const endTime = new Date(cards[currentCardIndex].endTime).getTime();
      const now = new Date().getTime();
      const timeDiff = endTime - now;

      if (timeDiff > 0) {
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        setRemainingTime(`${ (hours < 10 ? "0" : "") + hours }h ${ (minutes < 10 ? "0" : "") + minutes }m ${ (seconds < 10 ? "0" : "") + seconds }s`);
      } else {
        setRemainingTime("Expired");
      }
    }, 100);

    return () => clearInterval(interval);
  }, [currentCardIndex]);
  
  const [x, setX] = useState(0); // Track x position for swipe gesture

  const handlePan = (event: any, info: any) => {
    setX(info.offset.x); // Update x position based on pan movement
  };

  const handlePanEnd = () => {
    if (x > 100) {
      onSwipe("right"); // Swipe right to accept
    } else if (x < -100) {
      onSwipe("left"); // Swipe left to reject
    }
    setX(0); // Reset position
    setOfferClicked(false);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center px-4">
      <ToastContainer />
      <div className="flex justify-between w-full max-w-md px-2 mb-4 mt-4 sm:mb-6 sm:mt-8">
        <div>
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500 inline" />
          <Trash className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-500 inline" />
        </div>
  
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex flex-grow justify-center">
          Swipe to bid
        </h1>
  
        <div>
          <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 inline" />
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500 inline" />
        </div>
      </div>
      <motion.div
        className="relative w-[80vw] max-h-[30rem] md:max-h-[25rem] md:w-[20rem] bg-white shadow-lg rounded-2xl overflow-hidden"
        style={{ x }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDrag={handlePan}
        onDragEnd={handlePanEnd}
        animate={{ opacity: x === 0 ? 1 : 0.5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="relative w-full h-2/3">
  
          <img src={card.imageUrl} alt={card.title} className="w-full max-h-full object-cover select-none pointer-events-none" />

          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center bg-red-500 bg-opacity-75 text-white px-2 py-1 rounded-full">
            <Clock className="w-4 h-4 mr-1" />
            <span className="text-sm">{remainingTime}</span>
          </div>
        </div>
        {/* <img src={card.imageUrl} alt={card.title} className="w-full h-2/3 object-cover select-none pointer-events-none" /> */}
        <h3 className="font-semibold text-lg px-4 pt-2">{card.title}</h3>

        <div className="p-4 flex justify-between ">
          <div>
            {/* <p className="text-4xl font-bold">${card.currentBid}</p> */}
            <NumberFlow
	value={card.currentBid}
  className="text-4xl font-bold"
	format={{ style: 'currency', currency: 'USD', trailingZeroDisplay: 'stripIfInteger' }}
/>
          </div>
          {offerClicked ? (
            <button className="px-6 py-2 text-white font-bold rounded-full bg-green-500 hover:bg-green-400 mb-2"
            onClick={()=> {toast(`Bid $${(card.initialBid / 20).toFixed(2)}`, {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              // pauseOnHover: true,
              // draggable: true,
              type: "success",
              progress: undefined,
              theme: "light",
              transition: Bounce,
            });
            card.currentBid += card.initialBid / 20;
            }}>
              Bid ${card.initialBid / 20}
            </button>
          ) : (
            <button
              onClick={handleOfferClick}
              className={"px-6 py-2 text-white font-bold rounded-full mb-2" + (remainingTime === "Expired" ? " bg-gray-400" : "bg-blue-500 hover:bg-blue-400")}
              disabled={remainingTime === "Expired"}
            >
              <Gavel className="mr-1 inline" /> Offer
            </button>
          )}
        </div>
      </motion.div>
      
    </div>

  );
};
