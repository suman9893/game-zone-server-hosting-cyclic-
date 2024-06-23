import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import userRouter from "./routes/user.js";
import tourRouter from "./routes/tour.js";
import dotenv from "dotenv";

const app = express();
dotenv.config();

app.use(morgan("dev"));

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

const allowedOrigin = process.env.CLIENT;

const corsOptions = {
  origin: allowedOrigin,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions)); 

const checkOrigin = (req, res, next) => {
  const origin = req.get('origin');
  if (origin !== allowedOrigin) {
    return res.status(403).send('Access forbidden: Invalid origin');
  }
  next();
};

app.use("/users", checkOrigin, userRouter);
app.use("/tour", checkOrigin, tourRouter);
app.get("/", checkOrigin, (req, res) => {
  res.send("Welcome to Game Zone");
});

const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => console.log(`${error} did not connect`));
