const express = require("express");
const { errorHandler } = require("./middleware/errorMiddleware");
require("dotenv").config();
const PORT = process.env.PORT || 3002;

const app = express();

app.use(express.json());
app.use(errorHandler);

app.use("/api/arguments/", require("./routes/argumentRoutes.js"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
