const User = require('../models/User')
const Item = require('../models/Item')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get All Users
// @route GET /users
// @access Private
const getAllUsers =  asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found'})
    }
    res.json(users)
})

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
    const { username, password, firstname, lastname } = req.body
    if(!username || !password || !firstname || !lastname) {
        return res.status(400).json({ message: 'All fields are required'})
    }

    const duplicate = await User.findOne({ username }).collation({locale: 'en', strength: 2 }).lean().exec()

    if(duplicate) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    const hashedPwd = await bcrypt.hash(password, 10)
    const userObject = {username, "password":hashedPwd, firstname, lastname}

    const user = await User.create(userObject)

    if (user) {
        res.status(201).json({ message: `New user ${username} created`})
    } else {
        res.status(400).json({ message: 'Invalid user data received'})
    }
})

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req,  res) => {
  const {id, username, firstname, lastname, password} = req.body
  if(!id) { //Checks that there is an ID 
    return res.status(400).json({ message: 'ID is required' })
  } 
  if(!(username || firstname || lastname || password)) { //Checks something is being changed
    return res.status(204).json({ message: 'No fields changed' })
  }
  const user = await User.findById(id).exec()
  if(!user) {
    return res.status(400).json({ message: 'User not found'})
  }

  if(username) {
    const duplicate = await User.findOne({ username }).collation({ locale:  'en', strength: 2 }).lean().exec()
    if(duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username'})
    }
    user.username = username
  }
  if(firstname) {
    user.firstname = firstname
  }
  if(lastname) {
    user.lastname = lastname
  }
  if(password) {
    user.password = await bcrypt.hash(password, 10)
  }
  const updatedUser = await user.save()
  res.json({ message: `${updatedUser.username} updated`})

})

// @desc Delete user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body
    if(!id) {
        return res.status(400).json({ message: 'User ID required'})
    }

    const item =  await Item.findOne({ userId: id }).lean().exec()
    if (item)  {
        return res.status(400).json({ message: 'User has assigned items' })
    }

    const user = await User.findById(id).exec()
    if(!user) {
        return res.status(400).json({ message: 'User not found'})
    }

    const result = await user.deleteOne()
    res.json(`Username ${result.username} with ID ${id} deleted`)
})

module.exports = { createNewUser, getAllUsers, updateUser, deleteUser }