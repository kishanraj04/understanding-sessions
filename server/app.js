import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import courseRoutes from "./routes/courses.js";
import cartRoutes from "./routes/cart.js";
import authRoutes from "./routes/auth.js";
import otp from "./routes/otp.js";
import { seedDatabase } from "./seed.js";
import cookieParser from "cookie-parser";

await connectDB();
await seedDatabase();

const app = express();
const PORT = 4000;


app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true, // allow cookies (important!)
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use(cookieParser("kishu"))
app.use("/courses", courseRoutes);
app.use("/cart", cartRoutes);
app.use("/auth", authRoutes);
app.use("/otp",otp)
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
