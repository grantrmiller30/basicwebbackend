const express = require('express')
const router = express.Router()
const itemsController = require('../controllers/itemsController')
const verifyJWT = require('../middleware/verifyJWT')

// router.use(verifyJWT)

router.route('/')
    .post(verifyJWT, itemsController.createNewItem)
    .get(itemsController.getAllItems)
    .patch(verifyJWT, itemsController.updateItem)
    .delete(verifyJWT, itemsController.deleteItem)

module.exports = router