const express = require('express');
const cors = require("cors");
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();

const port = process.env.PORT || 5000;



// middeware 


app.use(express.json());
app.use(cors());

// 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.evqqa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });

    const DonationCollection = client.db("Donationdb").collection("addCampaign");
    const addDonationCollection = client.db("Donationdb").collection("donation");


    // Add Marathon
    app.post("/api/campaigns", async (req, res) => {
      
      const addCampaign = req.body;
      addCampaign.createdAt = new Date();
      addCampaign.totalRegistrations = 0;
      const result = await DonationCollection.insertOne(addCampaign);
      res.send(result);
    
  });


  // Fetch first 6 Donation
  app.get("/api/campaigns", async (req, res) => {
      
    const campaigns = await DonationCollection.find().limit(6).toArray();
    res.status(200).json(campaigns);
});


app.get("/api/campaigns/:id", async (req, res) => {
  const id =req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await DonationCollection.findOne(query);
  res.send(result);  
  
});


  // Fetch all Donation
  app.get("/all/campaigns", async (req, res) => {
      
    const campaigns = await DonationCollection.find().toArray();
    res.status(200).json(campaigns);
});


app.get("/all/campaigns/:id", async (req, res) => {
  const id =req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await DonationCollection.findOne(query);
  res.send(result);  
  
}); 



// Update a rmarathons
app.patch('/all/campaigns/:id', async (req, res) => {
  const { id } = req.params; 
  const updatedData = req.body; 

  
    const result = await DonationCollection.updateOne(
      { _id: new ObjectId(id) }, 
      { $set: updatedData } 
    );

    if (result.modifiedCount > 0) {
      res.json({ message: 'Marathon updated successfully' });
    } else {
      res.status(404).json({ message: 'Marathon not found or no changes made' });
    }
  
});

// Delete a registration
app.delete('/all/campaigns/:id', async (req, res) => {
const { id } = req.params;
const result = await DonationCollection.deleteOne({ _id: new ObjectId(id) }); 

if (result.deletedCount > 0) {
res.json({ message: 'Marathon deleted successfully' });
} else {
res.status(404).json({ message: 'Marathon not found' });
}

})

// Donation added 

app.post('/donation', async (req, res) => {
  const donation = req.body;
  const result = await addDonationCollection.insertOne(donation);
  res.send(result);
})

        // jobs related APIs
        app.get('/donations', async (req, res) => {
          const email = req.query.email;
          let query = {};
          if (email) {
              query = { hr_email: email }
          }
          const cursor = addDonationCollection.find(query);
          const result = await cursor.toArray();
          res.send(result);
      });




    
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// 


app.get('/', (req, res)=>{
    res.send('hello');
});


app.listen(port, ()=>{
    console.log('server running .....');
});