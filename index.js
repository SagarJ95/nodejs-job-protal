const express = require("express");
const app = express();
const testroute = require("./routes/testroute");
const registerUser = require("./routes/autRoute");
const updateUser = require("./routes/userRoute");
const jobData = require("./routes/jobRoute");
const ConnectDB = require("./config/db");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const xssclean = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
//env varirable access into file so it must be used dotenv package
require("dotenv").config();

//used middleware
const errorMiddleware = require("./middleware/errormiddleware");

//express async error package for handle errors (don't write try and catch block they can handle error)
require("express-async-errors");

//Database Connect
ConnectDB();

//middleware
app.use(cors());
app.use(helmet()); // secure header section
app.use(xssclean()); // secure post,get menthod
app.use(mongoSanitize()); //secure database from sql-injection (insert script)
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/v1", testroute);
app.use("/api/v2", registerUser);
app.use("/api/v3", updateUser);
app.use("/api/v4/job", jobData);

//validation
app.use(errorMiddleware);

app.listen(8001);
