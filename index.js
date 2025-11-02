const express = require('express')
const cors = require('cors') 
const app = express()
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello simple curd')
})


// there should be a uri, i deleted this here for secret. this uri i saved in my word developer notes 

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
   tls: true,
  tlsAllowInvalidCertificates: true  // Only for development!
});

app.listen(port, () => {
  console.log(`Crud Example app listening on port ${port}`)
}) 
 
async function run() {
  try {
    await client.connect();
    // Send a ping to confirm a successful connection

    const usersDB = client.db('usersDB');
    const usersCollections = usersDB.collection('users')

    
    app.get('/users', async (req, res) => {
      const cursor = usersCollections.find();
      const result = await cursor.toArray();
      res.send (result);
    })


    app.get('/users/:id', async (req, res) => {
const id = req.params.id;
  console.log('need user with iddddddddddddddd', id)
  const query = { _id: new ObjectId(id)}
  const result = await usersCollections.findOne(query)
  res.send(result)
})
    
    // add database related api here 

    app.post('/users', async (req, res) => {
      const newUser =req.body;
      const result = await usersCollections.insertOne(newUser);
      res.send(result);
      
});

app.patch('/users/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            console.log('to update', id, updatedUser)
            const query = { _id: new ObjectId(id) }
            const update = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email
                }
            }
            const options = {}
            const result = await usersCollections.updateOne(query, update, options);
            res.send(result);
        })

app.delete ('/users/:id',async (req, res) =>{
const id = req.params.id;
  const query = { _id: new ObjectId (id)}
  const result = await usersCollections.deleteOne(query);
  res.send(result)
  // console.log('delete a user from database')
})

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




