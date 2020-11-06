require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const errorHandler = require("./error-handler");
const validateBearerToken = require("./validate-bearer-token");
const notesRouter = require("./notes/notes-router");
const foldersRouter = require("./folders/folders-router");

const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganSetting));
app.use(helmet());
app.use(cors());
app.use(validateBearerToken)
//call router for folders and notes
app.use('/api/notes', notesRouter)
app.use('/api/folders', foldersRouter)

app.use((error, req, res, next) => {
  let response
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' }}
  } else {
    response = { error }
  }
  res.status(500).json(response)
})

const PORT = process.env.PORT || 8000


app.get("/", (req, res) => {
  res.send("Hello, world!");
});


app.use(errorHandler)

module.exports = app;
