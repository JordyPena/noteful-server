const express = require("express");
const xss = require("xss");
const FoldersService = require("./folders-service");


const foldersRouter = express.Router();
const jsonParser = express.json();

//route for all folders
//and adding a new folder

foldersRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    FoldersService.getAllFolders(knexInstance)
      .then((folders) => {
        res.json(folders);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { name } = req.body;
    const newFolder = {name}; 

    const numberOfValues = Object.values(newFolder).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain a name.`,
        },
      });

    FoldersService.addFolder(req.app.get("db"), newFolder)
      .then((folder) => {
        res.status(201).json(folder);
      })
      .catch(next);
  });

module.exports = foldersRouter;
