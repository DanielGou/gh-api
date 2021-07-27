require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const app = express()

app.use(express.json())

mongoose.connect(process.env.LINK_DB, {useUnifiedTopology: true, useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false } )



app.listen(process.env.PORT, ()=>{
    console.log("Server running")
})