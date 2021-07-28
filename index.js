require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())

mongoose.connect(process.env.LINK_DB, {useUnifiedTopology: true, useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false } )

const LeadSchema = new mongoose.Schema({
    name: { type: String, require: true },
    phone: { type: String, require: true },
    email: { type: String, require: true }
}, {collection: "leads"})

const model = mongoose.model("LeadSchema", LeadSchema)

app.post("/api/add", async (req,res)=>{

    const { name, phone, email } = req.body

    try{
        const response = await model.create({
            name, 
            phone, 
            email
        })
        console.log("Lead criado", response)
    }catch(err){
        console.log(err)
        if(err.code === 11000){
            return res.send("error")
        }
    }

    res.send("ok")
})

app.listen(process.env.PORT, ()=>{
    console.log("Server running")
})