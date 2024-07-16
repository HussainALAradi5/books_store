const express = require("express");
const cors = require("cors");
const connectDb = require("./connection");
const userRoutes = require("./routes/user");
const middleware = require("./middleware");
const app = express();
app.use(express.json());
app.use(cors());
app.use(middleware);
connectDb();
app.use("/user", userRoutes);
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
