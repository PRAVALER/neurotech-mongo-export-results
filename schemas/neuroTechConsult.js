const mongoose = require('mongoose');
const { Schema } = mongoose;

const Outputs = {
    Key: String,
    Value: String,
    Type: String
}

const neuroTechConsultSchema = new Schema({
    _id: String
},{strict: false,collection:'neurotech-consult'})

module.exports = neuroTechConsultSchema;