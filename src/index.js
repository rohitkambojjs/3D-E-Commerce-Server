import express from "express"
import router from "./routes/index.js"
import dotenv from "dotenv"
import connectDB from "./db/index.js"
import cookieParser from "cookie-parser"
import cors from 'cors';
dotenv.config({
  path: './.env'
})

const app = express()
const PORT = process.env.PORT || 8000

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}))
// app.use(express.json({ limit: "16kb" }))
// app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static("public"))
app.use(cookieParser())

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App listen at PORT: ${PORT}`)
    })
  })
  .catch((error) => {
    console.log(`MONGO db connection failed :: error :: ${error}`);
  })

app.get("/", (req, res) => {
  res.send("<h1>Jay Sita Ram</h1>")
})

app.use("/api/v1", router)

// http://localhost:8000/api/v1/users/register

// app.listen(PORT, () => {
//   console.log(`App listen at PORT: ${PORT}`)
// })