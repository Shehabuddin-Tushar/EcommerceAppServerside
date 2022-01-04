const express = require('express')
const app = express()
 const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
var cors = require('cors')
require('dotenv').config()
const stripe = require("stripe")(process.env.PAYMENT_STRIPE_SECRETE_KEY)
const port = process.env.PORT || 5000
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lp6z6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('Ecommerce');
        const products = database.collection('products');
        const addtocart = database.collection('addtocart');

        app.get("/products", async (req, res) => {
               const result=await products.find({}).toArray();
               res.send(result)
        })


        

        app.post("/addtocart", async (req, res) => {
            const result = await addtocart.insertOne(req.body);
            res.send(result);
        });

        app.get("/cartproductshow", async (req, res) => {
            const query = { email: req.body.email }
            const result = await addtocart.find(query).toArray();
            res.send(result)
        });

       
      
       

        
    } finally {
        // Ensures that the client will close when you finish/error
        
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!two')
})

app.listen(port, () => {
    console.log(`server running listening at http://localhost:${port}`)
})