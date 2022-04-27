
import mongoose from "mongoose";
import userModel from "./models/user.model.js";
import "./connect.js"
import express from "express"
import cors from "cors"
import booksRouter from "./routes/books.js"
import usersRouter from "./routes/user.js"
//import cookieSession from "cookie-session"

mongoose.connect("mongodb://localhost:27017/bookCircles", { useNewUrlParser: true }, (err) => {
    if(err) {
        console.error("Kunde inte koppla upp databasen!")
    }
    console.log("Databasen är kopplad!")
})


/* app.use(
  cookieSession({
    name: "session",
    keys: "aVeryS3cr3tk3y",
    maxAge: 1000 * 3600, //60min
    sameSite: "strict",
    httpOnly: true,
    secure: false,
  })
);  */

const app = express();
app.use(express.json());
app.use("/", express.static("public"));


app.use(cors({ credentials: true, origin: ["http://localhost:3000"] }));
app.use(express.static("public"));


app.get('/', (req, res) => {
    res.json({ message: 'Hello World' });
  });

// Routes for users
app.use("/users", usersRouter);

// Route for books
app.use("/books", booksRouter);

// Server running
app.listen(3001, () => console.log("Listening at 3001"));

