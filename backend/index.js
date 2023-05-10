const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Appointment = require('./model/appointments');
const Employee = require('./model/employee');
const cors = require('cors');
const jwt = require("jsonwebtoken");
const axios = require("axios");
const path = require('path')
const shortid = require('shortid')
const Razorpay = require('razorpay')
const razorpay = new Razorpay({
  key_id: "rzp_test_zXoOe6U2B8fZGJ",
  key_secret: "ucQw0ZlFWR0PBANIqnoeY9F2"
});
const uri = 'mongodb+srv://Karan02:admin@cluster0.y3byy.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.log(err));

const app = express();
const port = 3001;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());
app.options('*', cors());
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post("/generateZoomLink", async (req, res) => {
  const { topic, userId } = req.body;
  const token = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6ImJMOF9FREFJUmRtVWplRDFqYy1lYWciLCJleHAiOjE2ODQzMDEyNDgsImlhdCI6MTY4MzY5NjQ1MH0.B1o1r_QjWUPQzeUSvmtZ5sxK3Bf3wVEGO-jQ4Ha-lhk';
  axios.post(
      `https://api.zoom.us/v2/users/${req.body.userId}/meetings`,
      {
        topic: req.body.topic,
        type: 2,
        settings: {
          host_video: true,
          participant_video: true
        }
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "User-Agent": "Zoom-api-Jwt-Request",
          "content-type": "application/json"
        }
      }
    ).then(response =>{
      res.send({
        joinUrl: response.data.join_url,
        meetingId: response.data.id,
        password: response.data.password
      });
    }).catch(err =>{
      console.log(err);
    })
});


app.get('/appointments',(req,res) => {
   Appointment.find().then(appointments => {
      res.send(appointments);
   }).catch(err =>{
      console.log(err);
      res.status(500);
      res.send({message:"Error"});
   })
});

app.post('/appointment',(req,res) => {
  
  Appointment.create(req.body).then( response => {
      res.send({message:"success",status:200});
  }).catch(err =>{
    console.log(err);
    res.send({message:"failure"});
  });
});

let id = 1;
app.post('/createEmployee',async (req,res) =>{
 
  Employee.create({text:req.body.employee,id:id}).then(response =>{
    res.send({message:"success",status:200});
  }).catch(err =>{
    console.log(err);
    res.send({message:"failure"});
  });
  id = id + 1;
})

app.get('/getEmployee',async (req,res) =>{
  Employee.find().then(employees =>{
    res.send({employees:employees});
  }).catch(err =>{
    console.log(err);
    res.send({message:"failure"});
  });
})


app.post('/appointmentsChange',async (req,res) => {
  let data = req.body;
  Appointment.findByIdAndUpdate(data._id,{
    text:data.text,
    startDate:data.startDate,
    endDate:data.endDate,
    allDay:data.allDay,
    link:data.link,
    id:data.id,
    password: data.password,
    recurrenceRule:data.recurrenceRule,
    payid:data.payid,
    orderid:data.orderid,
    description:data.description,
    employees:data.employees,
    gender:data.gender,
    age:data.age,
    email:data.email,
    name:data.name
  }).then(resp => {
      res.send({message:"success",status:200});
  }).catch(err => {
    res.send({message:"failure"});
    console.log(err);
  })
});

app.delete('/appointment',async (req,res) => {
  const id = req.body._id;
  Appointment.deleteOne({_id:id})
  .then(resp =>{
    res.send({message:"success",status:200});
  }).catch(err => {
    console.log(err)
    res.send({message:"failure"});
  });
});


app.post('/razorpay', async (req, res) => {
  const payment_capture = 1
  const amount = 299
  const currency = 'INR'

  const options = {
      amount: amount * 100,
      currency: currency,
      receipt: shortid.generate(),
      payment_capture
  }

  try {
      
      const response = await razorpay.orders.create(options)
      console.log(response)
      res.json({
          id: response.id,
          currency: response.currency,
          amount: response.amount
      })
  }

  catch (error) {
      console.log(error)
  }
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});