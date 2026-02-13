import express from "express";
import connectDB from "./src/config/db.js";
import userRoutes from "./src/route/user.route.js";
import errorHandler from "./src/middleware/error.middleware.js";
import dotenv from "dotenv";
import cors from "cors";
import productRouter from "./src/route/product.routes.js";
import orderRouter from "./src/route/order.route.js";
dotenv.config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);


app.use(errorHandler);
const port = process.env.PORT;
app.listen(5000, () => console.log(`Server running on port ${5000}`));
