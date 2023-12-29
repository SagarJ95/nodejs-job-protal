const express = require("express");
const connecDB = require("./config/db");

const app = express();
app.use(express.json());

app.get("/connection", (req, res) => {
  connecDB();
});

app.listen(7000);
