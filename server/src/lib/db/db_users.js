const { getCol } = require('./index.js')


const getUserByID = userID => getCol('users')
    .then(col => col.findOne({ userID }))
    .catch(err => console.log(err))


const getUserByGoogleID = googleID => getCol('users')
    .then(col => col.findOne({ googleID }))
    .catch(err => console.log(err))


const insertUser = user => getCol('users')
    .then(col => col.insertOne(user))
    .catch(err => console.log(err))



module.exports = {
    getUserByID,
    getUserByGoogleID,
    insertUser,
}