const { MongoClient } = require('mongodb');
require('dotenv').config();

const mongoUri = process.env.MONGO_URI;
const mongoOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const connect = (client, collection) => client.connect()
    .then(client => client.db('sticky_notes').collection(collection));

const initNotes = userID => {
    const client = new MongoClient(mongoUri, mongoOpts);
    return connect(client, 'notes')
        .then(col => col.insertOne({ userID, notes: [] }))
        .finally(() => client.close());
}

const writeAllNotes = (userID, data) => {
    const client = new MongoClient(mongoUri, mongoOpts);
    return connect(client, 'notes')
        .then(col => col.replaceOne({ userID }, { notes: data, userID }))
        .finally(() => client.close());
}

const writeOneNote = (userID, quillID, data) => {
    const client = new MongoClient(mongoUri, mongoOpts);
    return connect(client, 'notes')
        .then(col => col.updateOne({ userID }, { $set: { [`notes.${quillID}`]: data } }))
        .finally(() => client.close());
};

const readNotes = userID => {
    const client = new MongoClient(mongoUri, mongoOpts);
    return connect(client, 'notes')
        .then(col => col.findOne({ userID }))
        .catch(err => console.log(err))
        .finally(() => client.close());
}

const getUserByID = userID => {
    const client = new MongoClient(mongoUri, mongoOpts);
    return connect(client, 'users')
        .then(col => col.findOne({ userID }))
        .catch(err => console.log(err))
        .finally(() => client.close());
}

const getUserByGoogleID = googleID => {
    const client = new MongoClient(mongoUri, mongoOpts);
    return connect(client, 'users')
        .then(col => col.findOne({ googleID }))
        .catch(err => console.log(err))
        .finally(() => client.close());
}

const insertUser = user => {
    const client = new MongoClient(mongoUri, mongoOpts);
    return connect(client, 'users')
        .then(col => col.insertOne(user))
        .catch(err => console.log(err))
        .finally(() => client.close());
}

module.exports = {
    writeAllNotes,
    writeOneNote,
    readNotes,
    getUserByID,
    insertUser,
    initNotes,
    getUserByGoogleID
};