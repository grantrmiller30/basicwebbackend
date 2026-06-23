const express = require('express')
const router = express.Router()
const itemsController = require('../controllers/itemsController')
// const verifyJWT = require('../middleware/verifyJWT')

// router.use(verifyJWT)

router.route('/')
    .post(itemsController.createNewItem)
    .get(itemsController.getAllItems)
    .patch(itemsController.updateItem)
    .delete(itemsController.deleteItem)

module.exports = router