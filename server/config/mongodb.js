import mongoose from "mongoose";

const uri = `${process.env.MONGODB_URI}/imagify`;

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return; // already connected
    }

    await mongoose.connect(uri);

    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected");
    });

  } catch (err) {
    console.error("MongoDB connection error:", err.message);
  }
};

export default connectDB;


// ✅ KEEP ALIVE (no reconnect, no disconnect)
export async function keepAlive() {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log("DB not connected, reconnecting...");
      await connectDB();
    }

    await mongoose.connection.db.admin().ping();
    console.log("MongoDB ping success");

  } catch (err) {
    console.error("KeepAlive Error:", err.message);
  }
}