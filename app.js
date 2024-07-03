import express from "express";
import { config } from "dotenv";
import "express-async-errors";

import connectDb from "./utils/connect_db.js";
import router from "./utils/router.js";
import jwtErrorHandler from "./middlewares/jwt_error_handler.js";

config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(jwtErrorHandler);

app.use("/api/v1", router);

// MONGODB
connectDb();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use((err, req, res, next) => {
  console.error(err.message);

  if (err.statusCode) {
    return res.status(err.statusCode).json({ msg: err.message });
  }

  if (err.message.includes("email_1 dup key"))
    return res.status(400).json({ msg: "Email already exists" });

  res.status(500).send("Something broke!");
});
