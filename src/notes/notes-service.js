//query is a filter
const NotesService = {
  getAllNotes(db) {
    return db
      .select('*')
      .from('notes')
  },
// need to delete note with id
  deleteNote(db, id) {
    return db('notes')
      .where({id})
      .delete();
  },
  //need add note
  addNote(db, newNote) {
    return db
      .insert(newNote)
      .into('notes')
      .returning('*')
      .then(rows => {
        return rows[0];
      })
  },
};

module.exports = NotesService;

