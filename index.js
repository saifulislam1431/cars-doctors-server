require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8cnv71c.mongodb.net/?retryWrites=true&w=majority`;



app.use(cors());
app.use(express.json());





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
    await client.connect();

    const servicesCollection = client.db("carDoctors").collection("servicesData");
    const productsCollection = client.db("carDoctors").collection("productData");
    const bookingCollection = client.db("carDoctors").collection("bookingData")

    app.get("/services", async(req,res)=>{
        const cursor = servicesCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get("/services/:id", async(req,res)=>{
        const id = req.params.id;
        const query = {_id : new ObjectId(id)};
        const result = await servicesCollection.findOne(query);
        res.send(result)
    })

    app.get("/products", async(req,res)=>{
      const cursor = productsCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get("/bookings",async(req,res)=>{
        let query = {};
        if(req.query?.email){
          query = {email : req.query.email}
        };
        const result = await bookingCollection.find(query).toArray();
        res.send(result)
    })
    app.get("/bookings/:id", async(req,res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const result = await bookingCollection.findOne(query);
      res.send(result)
    })


    // Create data

    app.post("/bookings",async(req,res)=>{
        const order = req.body;
        const result = await bookingCollection.insertOne(order);
        res.send(result)
    })

    // Delete data
    app.delete("/bookings/:id",async(req,res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await bookingCollection.deleteOne(query);
      res.send(result)
    })

    // Update data

    app.patch("/bookings/:id",async(req,res)=>{
      const id = req.params.id;
      const filter = {_id : new ObjectId(id)};
      const updateOrder = req.body;
      const updateDoc = {
        $set:{
          status : updateOrder.status
        }
      };
      const result = await bookingCollection.updateOne(filter,updateDoc)
      res.send(result);
    })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get("/",(req,res)=>{
    res.send("This is cars doctors server")
});

app.listen(port, ()=>{
    console.log(`This app is listening at port: ${port}`);
});