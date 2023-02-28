import express from "express";
import { connectDB } from "./db/moongose.js";
import cors from "cors";
import { userRouter } from "./routes/userRouter.js";
import { blogRouter } from "./routes/blogRouter.js";
import { portfolioRouter } from "./routes/portfolioRouter.js";
const app = express();

app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use(userRouter);
app.use(blogRouter);
app.use(portfolioRouter);

const port = process.env.PORT;

connectDB().then(
  app.listen(port, () => console.log(`Example app listening on port ${port}!`))
);
