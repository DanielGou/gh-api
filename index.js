require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const emailValidator = require('email-validator')
const nodemailer = require('nodemailer');

const app = express()

app.use(express.json())
app.use(cors())

// Conexãop com o MongoDB
mongoose.connect(process.env.LINK_DB, {useUnifiedTopology: true, useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false } )

//Configuração do nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });

//Schema para criar um novo lead no DB
const LeadSchema = new mongoose.Schema({
    name: { type: String, require: true },
    phone: { type: String, require: true },
    email: { type: String, require: true }
}, {collection: "leads"})

const model = mongoose.model("LeadSchema", LeadSchema)

//Rota Principal onde recebe as informações do formulário
app.post("/api/add", async (req,res)=>{

    const { name, phone, email } = req.body

    // Validação pelo lado da API
    if(!emailValidator.validate(email)){
        return res.json({ status: 'error', error: 'Email inválido.' })
    }

    if( !name && name === "" && name.length <= 2 && typeof username !== 'string'){
        return res.json({ status: 'error', error: 'Nome inválido.' })
    }
    
    if( !phone && phone === "" && phone.length < 8 && typeof username !== 'string'){
        return res.json({ status: 'error', error: 'Telefone inválido.' })
    }

    // Criação de um novo lead no DB
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

    //Criação da email
    const mailOptions = {
        from: 'sendfiletokindle@gmail.com',
        to: 'danielpraiadorosa@gmail.com',
        subject: 'Novo contato!',
        text: `Temos um novo contato! O Nome é ${name}, seu telefone é ${phone} e seu email é ${email}`
      };
      
    //Envio do email
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    // Envia a resposta de que deu tudo certo
    res.send({status: "ok"})
})

// Escuta a porta configurada
app.listen(process.env.PORT, ()=>{
    console.log("Server running")
})