const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    text:String,
    id:Number
});

const Employee = mongoose.model('Employee',employeeSchema);

module.exports = Employee;