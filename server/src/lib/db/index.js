const { MongoClient } = require('mongodb')

const mongoUri = process.env.MONGO_URI;
const mongoOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

const client = new MongoClient(mongoUri, mongoOpts)
let _db;

const connectDB = () => new Promise((resolve, reject) => {
    client.connect()
        .then(client => {
            _db = client.db('sticky_notes')
            resolve()
        })
        .catch(err => reject(err))
})

const disconnectDB = cb => {
    client.close(cb)
}

const getCol = (collectionName) => new Promise((resolve, reject) => {
    if (_db) {
        resolve(_db.collection(collectionName))
    } else {
        connectDB()
            .then(() => resolve(_db.collection(collectionName)))
            .catch(err => reject(err))
    }
})

module.exports = {
    connectDB,
    disconnectDB,
    getCol,
}