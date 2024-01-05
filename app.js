const express = require("express");
const app = express();
const cors = require("cors");
const moongoose = require("mongoose");
const UserRouter = require("./Router/UserRouter");
const AdminRouter = require("./Router/AdminRouter");
const db_link =
  "mongodb+srv://admin:LSLEF9h3ENCLxn7@cluster0.mmuhd.mongodb.net/?retryWrites=true&w=majority";
moongoose
  .connect(db_link)
  .then((db) => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log(err);
  });
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use("/", UserRouter);
app.use("/admin", AdminRouter);
const PORT = process.env.PORT;
app.listen(PORT || 8080);
