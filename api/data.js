// api/data.js
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

module.exports = async (req, res) => {
  try {
    await client.connect();
    const db = client.db('tution');
    const tasks = await db.collection('tasks').find().toArray();
    const english = await db.collection('english').find().toArray();
    res.status(200).json(tasks);
    res.status(200).json(english);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  } finally {
    await client.close();
  }
};
