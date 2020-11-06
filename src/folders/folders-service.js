const FoldersService = {
  getAllFolders(db) {
    return db
      .select('*')
      .from('folders')
  },

  addFolder(db, newFolder) {
    return db
      .insert(newFolder)
      .into('folders')
      .returning('*')
      .then(rows => {
        rows[0]
      });
  },
};



module.exports = FoldersService