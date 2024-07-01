import express from "express";
import { config } from "dotenv";

import connectDb from "./utils/connect_db.js";
import router from "./utils/router.js";

config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', router);

// MONGODB
connectDb();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
