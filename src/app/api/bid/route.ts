// /pages/api/bid.js
let auctionState = [
  {
    id: 0,
    title: "Foosball table of very important value you should buy",
    imageUrl: "/product_1.jpg",
    initialBid: 100,
    currentBid: 100,
    endTime: "2025-01-27T18:30:00",
    lastBidder: null,
  },
  {
    id: 1,
    title: "Laptop",
    imageUrl: "/product_2.jpg",
    initialBid: 150,
    currentBid: 150,
    endTime: "2025-01-27T12:20:00",
    lastBidder: null,
  },
  {
    id: 2,
    title: "Even Cooler Foosball table",
    imageUrl: "/product_1.jpg",
    initialBid: 1000,
    currentBid: 1000,
    endTime: "2025-01-27T20:30:00",
    lastBidder: null,
  },
];

export default function handler(req, res) {
  const { method } = req;

  if (method === "GET") {
    // Return current auction state
    res.status(200).json(auctionState);
  } else if (method === "POST") {
    const { type, payload } = req.body;

    if (type === "bid") {
      const { id, bid, bidder } = payload;

      if (
        auctionState[id] &&
        bid > auctionState[id].currentBid &&
        auctionState[id].lastBidder !== bidder
      ) {
        auctionState[id].currentBid = bid;
        auctionState[id].lastBidder = bidder;
        res.status(200).json({ success: true, newBid: bid });
      } else {
        res
          .status(400)
          .json({ success: false, message: "Invalid bid or bidder." });
      }
    } else if (type === "add_product") {
      const { title, imageUrl, initialBid, endTime } = payload;

      const newProduct = {
        id: auctionState.length,
        title,
        imageUrl,
        initialBid,
        currentBid: initialBid,
        endTime,
        lastBidder: null,
      };

      auctionState.push(newProduct);
      res.status(201).json({ success: true, product: newProduct });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Invalid request type." });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
