import express from "express";
import cors from "cors";
import UserRoute from "./routes/UserRoute.js"
import { connectDB } from "./config/db.js"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";


// dotenv.config();


if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({
    path: "config/.env",
  });
}

const corsOptions = {
  credential:true,
  optionSuccessStatus:200
}

const app = express();
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(express.json())

app.get("/", (req, res) => {
    res.send("API is running")
})

connectDB()

const PORT = process.env.PORT || 5000
// const server = http.createServer(app)

app.use("/api/users", UserRoute)


app.listen(PORT, () => {
    console.log(`Server running  in http://localhost:${PORT}`);
  });

