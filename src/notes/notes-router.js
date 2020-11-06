const path = require("path");
const express = require("express");
const xxs = require("xss");
const NotesService = require("./notes-service");

const notesRouter = express.Router();
const jsonParser = express.json();

notesRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    NotesService.getAllNotes(knexInstance)
      .then((notes) => {
        res.json(notes);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const numberOfValues = Object.values(req.body).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'name' or 'content'`,
        },
      });
    NotesService.addNote(req.app.get("db"), req.body)
      .then((note) => {
        res.status(201).json(note);
      })
      .catch(next);
  });

notesRouter
  .route("/:note_id")

  .all((req, res, next) => {
    const { note_id } = req.params;
    NotesService.getById(req.app.get("db"), note_id)
      .then((note) => {
        if (!note) {
          logger.error(`Bookmark with id ${note_id} not found.`);
          return res.status(404).json({
            error: { message: `Note Not Found` },
          });
        }

        res.note = note;
        next();
      })
      .catch(next);
  })

  .get((req, res) => {
    res.json(res.note);
  })

  .delete((req, res, next) => {
    const { note_id } = req.params;
    NotesService.deleteNote(req.app.get("db"), note_id)
      .then((numberOfAffectedRows) => {
        logger.info(`Bookmark with id ${note_id} deleted.`);
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = notesRouter;
