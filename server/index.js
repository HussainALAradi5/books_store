const express = require("express");
const cors = require("cors");
const connectDb = require("./connection/db");
const userRoutes = require("./routes/user");
const bookRoutes = require("./routes/book");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

connectDb();

app.use("/books", bookRoutes);

app.use("/user", userRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
