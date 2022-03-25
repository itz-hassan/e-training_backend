const express = require("express");
const logger = require("./startup/logging");
const app = express();

require("./startup/routes")(app);
require("./startup/db")();

const port = process.env.PORT || 5000;

app.listen(port, () => logger.info(`Server running on Port ${port}`));
