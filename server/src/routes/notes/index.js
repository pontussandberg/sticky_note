const router = require('express').Router();
const { handleReadNotes, handleWriteAllNotes, handleWriteOneNote } = require('./handlers');

const authCheck = (req, res, next) => {
    req.user
        ? next()
        : res.status(401).end();
}

router.get('/', authCheck, handleReadNotes);
router.put('/:id', authCheck, handleWriteOneNote);
router.put('/', authCheck, handleWriteAllNotes);

module.exports = router;
