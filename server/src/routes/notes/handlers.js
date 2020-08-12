const db = require('../../lib/db');

const handleReadNotes = (req, res) => {
    db.readNotes(req.user.userID)
        .then(data => res.status(200).json(data))
        .catch(() => res.status(500).end());
}

const handleWriteAllNotes = (req, res) => {
    db.writeAllNotes(req.user.userID, req.body)
        .then(() => res.status(200).end())
        .catch(() => res.status(500).end())
}

const handleWriteOneNote = (req, res) => {
    db.writeOneNote(req.user.userID, req.params.id, req.body)
        .then(() => res.status(200).end())
        .catch(() => res.status(500).end())
}

module.exports = {
    handleReadNotes,
    handleWriteAllNotes,
    handleWriteOneNote,
}