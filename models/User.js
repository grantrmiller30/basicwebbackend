const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const userSchema = new mongoose.Schema({
    password: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    }
})

userSchema.plugin(AutoIncrement, {
    inc_field: 'id',
    id: 'userid',
    start_seq: 1
})

module.exports = mongoose.model('User', userSchema)