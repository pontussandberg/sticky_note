const { getCol } = require('./index.js')


const writeAllNotes = (userID, data) => getCol('notes')
    .then(col => col.replaceOne({ userID }, { notes: data, userID }))

const readNotes = userID => getCol('notes')
    .then(col => col.findOne({ userID }))
    .catch(err => console.log(err))

const initNotes = userID => getCol('notes')
    .then(col => col.insertOne({ userID, notes: [] }))

module.exports = {
    writeAllNotes,
    readNotes,
    initNotes,
}