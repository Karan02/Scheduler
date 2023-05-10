const mongoose = require('mongoose');


const appointmentSchema = new mongoose.Schema({
    text: String,
    startDate: Date,
    endDate: Date,
    allDay: Boolean,
    link:String,
    id:Number,
    password:String,
    description:String,
    recurrenceRule:String,
    payid:String,
    orderId:String,
    employees:Array,
    name: String,
    age: Number,
    gender: String,
    email: String
});

const Appointment = mongoose.model('Appointment',appointmentSchema);

module.exports = Appointment;