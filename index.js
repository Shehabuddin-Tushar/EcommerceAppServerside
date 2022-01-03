const express = require('express')
const app = express()
const SSLCommerzPayment = require('sslcommerz') 
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
var cors = require('cors')
require('dotenv').config()
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
       

        app.get("/products", async (req, res) => {
               const result=await products.find({}).toArray();
               res.send(result)
        })

       

        //payment initialization api
        app.get('/init', (req, res) => {
            const data = {
                
                total_amount: 100,
                currency: 'BDT',
                tran_id: 'REF123',
                success_url: `${port}/success`,
                fail_url: `${port}/fail`,
                cancel_url: `${port}/cancel`,
                ipn_url: `${port}/ipn`,
                shipping_method: 'Courier',
                product_name: 'Computer.',
                product_category: 'Electronic',
                product_profile: 'general',
                cus_name: 'Customer Name',
                cus_email: 'cust@yahoo.com',
                cus_add1: 'Dhaka',
                cus_add2: 'Dhaka',
                cus_city: 'Dhaka',
                cus_state: 'Dhaka',
                cus_postcode: '1000',
                cus_country: 'Bangladesh',
                cus_phone: '01711111111',
                cus_fax: '01711111111',
                ship_name: 'Customer Name',
                ship_add1: 'Dhaka',
                ship_add2: 'Dhaka',
                ship_city: 'Dhaka',
                ship_state: 'Dhaka',
                ship_postcode: 1000,
                ship_country: 'Bangladesh',
                multi_card_name: 'mastercard',
                value_a: 'ref001_A',
                value_b: 'ref002_B',
                value_c: 'ref003_C',
                value_d: 'ref004_D'
            };
            const sslcommer = new SSLCommerzPayment(process.env.STORE_ID,process.env.STORE_PASSWORD,false) //true for live default false for sandbox
            sslcommer.init(data).then(data => {
               
                //process the response that got from sslcommerz
                //https://developer.sslcommerz.com/doc/v4/#returned-parameters
                res.redirect(data.GatewayPageURL);
            });
        })

        app.post("/success", async (req, res) => {
            console.log(req.body)
            res.status(200).json({data:req.body})
        })

        app.post("/fail", async (req, res) => {
            console.log(req.body)
            res.status(400).json({ data: req.body })
        })

        app.post("/cancel", async (req, res) => {
            console.log(req.body)
            res.status(200).json({ data: req.body })
        })

        app.post("/ipn", async (req, res) => {
            console.log(req.body)
            res.status(200).json({ data: req.body })
        })


        
    } finally {
        // Ensures that the client will close when you finish/error
        
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World! two')
})

app.listen(port, () => {
    console.log(`server running listening at http://localhost:${port}`)
})