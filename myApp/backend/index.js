const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb')

const app = express()

app.use(cors())
app.use(express.json()) // Add JSON body parsing

// MongoDB connection setup
const mongoUrl = process.env.MONGO_URL || 'mongodb://mongo:27017/myAppDB'
const dbName = 'test' // Change to your database name if needed
let db

MongoClient.connect(mongoUrl, { useUnifiedTopology: true })
  .then(client => {
    db = client.db(dbName)
    console.log('Connected to MongoDB')
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err)
  })

app.get('/', (req, res) => {
  if (!db) {
    return res.status(500).json({ error: 'Database not connected' })
  }
  // Example: fetch documents from a collection named 'items'
  db.collection('items').find({}).toArray()
    .then(items => res.json(items))
    .catch(err => res.status(500).json({ error: err.message }))
})

// Signup endpoint
app.post('/signup', async (req, res) => {
  if (!db) {
    console.error('Signup error: Database not connected')
    return res.status(500).json({ error: 'Database not connected' })
  }
  const { fullname, userid, birthday, password } = req.body
  if (!fullname || !userid || !birthday || !password) {
    console.error('Signup error: Missing fields', req.body)
    return res.status(400).json({ error: 'All fields are required' })
  }
  try {
    // Check if user ID already exists
    const existing = await db.collection('users').findOne({ userid })
    if (existing) {
      console.error('Signup error: User ID already exists', userid)
      return res.status(409).json({ error: 'User ID already exists' })
    }
    // Insert new user
    await db.collection('users').insertOne({ fullname, userid, birthday, password })
    res.json({ success: true })
  } catch (err) {
    console.error('Signup error:', err)
    res.status(500).json({ error: err.message })
  }
})

// Login endpoint
app.post('/login', async (req, res) => {
  if (!db) {
    return res.status(500).json({ error: 'Database not connected' })
  }
  const { userid, password } = req.body
  if (!userid || !password) {
    return res.status(400).json({ error: 'User ID and password required' })
  }
  try {
    const user = await db.collection('users').findOne({ userid, password })
    if (!user) {
      return res.status(401).json({ error: 'Invalid User ID or password' })
    }
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(4000, () => {
  console.log('listening for requests on port 4000')
})