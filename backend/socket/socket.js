import { Server } from "socket.io";

export const initializeSocket = (server) => {
  const io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinAuction", (auctionId) => {
      socket.join(auctionId);
    });

    socket.on("newBid", ({ auctionId, bid }) => {
      io.to(auctionId).emit("bidUpdated", bid);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};
