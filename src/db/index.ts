import * as mongoose from "mongoose";
import {MONGO_URL} from '../constants'

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("connected to DB Successfully"))
  .catch(() => console.log("DB connection Error"));
