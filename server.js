const express = require("express");
const logger = require("./startup/logging");
const app = express();

require("./startup/routes")(app);
require("./startup/db")();
require("./startup/validation");
require("./startup/config")();

const port = process.env.PORT || 5000;

app.listen(port, () => logger.info(`Server running on Port ${port}`));
