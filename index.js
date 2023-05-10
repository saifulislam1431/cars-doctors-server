require("dotenv").config();
const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();


app.use(cors());
app.use(express.json());


app.get("/",(req,res)=>{
    res.send("This is cars doctors server")
});

app.listen(port, ()=>{
    console.log(`This app is listening at port: ${port}`);
});