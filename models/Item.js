const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const itemSchema = new mongoose.Schema({
    userId: {
        type: Number,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
})

itemSchema.plugin(AutoIncrement, {
    inc_field: 'id',
    id: 'itemid',
    start_seq: 1
})

module.exports = mongoose.model('Item', itemSchema)