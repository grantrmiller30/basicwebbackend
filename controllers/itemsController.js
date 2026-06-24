const User = require('../models/User')
const Item = require('../models/Item')
const asyncHandler = require('express-async-handler')

// @desc Get all items 
// @route GET /items
// @access Private
const getAllItems = asyncHandler(async (req, res) => {
    const items = await Item.find().lean()
    if(!items?.length) {
        return res.status(400).json({ message: "No Items found"})
    }
    res.json(items)
})

// @desc Create new item
// @route GET /items
// @access Private
const createNewItem = asyncHandler(async (req, res) => {
    const {name, description, quantity, userId} = req.body

    if(!name || !userId ||  !description) {
        return res.status(400).json({ message: 'Name, userId, and description are required'})
    }
    if(!quantity) {
        quantity = 0
    }
     if(quantity < 0) {
        return res.status(400).json({ message: 'Quantity must not be negative'})
    }
    const userFound = await User.findOne({ id: userId }).lean().exec()
    if(!userFound) {
        return res.status(400).json({ message: 'User not found'})
    }

    const itemObject = { userId, name, description, quantity}
    const item = await Item.create(itemObject)
    if(item) {
        res.status(201).json({message: `Item ${item.name} created`})
    } else {
        res.status(400).json({message: 'Invalid item data received'})
    }
})

// @desc Update an item
// @route UPDATE /items
// @access Private
const updateItem = asyncHandler(async (req, res) => {
    const {id, name, description, quantity, userId} = req.body
    if(!id) {
        return res.status(400).json({ message: 'ID is required'})
    }
    const item = await Item.findById(id).exec()
    if(userId) {
        const userFound = await User.findbyId(userId).lean().exec()
        if(!userfound) {
            return res.status(400).json({ message: 'User not found'})
        }
        item.userId = userId
    }
    if(quantity) {
        if(quantity < 0) {
            return res.status(400).json({ message: 'Quantity must not be negative'})
        }
        item.quantity = quantity
    }
    if(name) {
        item.name = name
    }
    if(description) {
        item.description = description
    }
    const updatedItem = await item.save()
    res.json({ message: `${updatedItem.name} updated`})
})

// @desc Delete an item
// @route DELETE /items
// @access Private
const deleteItem = asyncHandler(async (req, res) => {
    const { id } = req.body
    if(!id) {
        return res.status(400).json({ message: 'ID is required'})
    }
    const item = await Item.findById(id).exec()
    if(!item) {
        return res.status(400).json({ message: 'Item not found'})
    }
    const result = await item.deleteOne()
    res.json({ message: `Item ${id} deleted`})
})

module.exports = { createNewItem, getAllItems, updateItem, deleteItem }