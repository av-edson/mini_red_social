const webServerConfig = require("./config/webConfig.js");

var express = require("express");
var bodyParser = require("body-parser");
const cors = require("cors");
var app = express();
let corsOptions = { origin: true, optionsSuccessStatus: 200 };

const port = webServerConfig.port;

/* Middlewares */
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(express.json());
app.use(express.static("public"));

const controllers = require("./controllers/practica2.controller.js");
app.use("/", controllers);

app.listen(port, function () {
  console.log("Corriendo en el puerto " + webServerConfig.port + "\n");
  console.log("Usando DB " + webServerConfig.database + "\n");
});

module.exports = app;
