const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const router = require("./router");
const app = express();

dotenv.config();
const PORT = 7001;
mongoose.set("strictQuery", true);

try {
  mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
  });
  console.log("Connected to DB !!");
} catch (e) {
  console.log(e);
  throw e;
}
// app.use(cors());
// app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(router);

app.listen(PORT, async () => {
  console.log(`server up on port ${PORT}`);
});
