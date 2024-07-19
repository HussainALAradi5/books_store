const express = require('express')
const router = express.Router()
const userCtrl = require('../controllers/users')
const receiptCtrl = require('../controllers/receipt')
const { authenticate, authorizeAdmin } = require('../middleware/auth')

// User routes
router.post('/register', userCtrl.register)
router.post('/login', userCtrl.login)
router.use(authenticate)
router.get('/profile', userCtrl.viewUserData)
router.put('/edit', userCtrl.edit)
router.delete('/:id', authorizeAdmin, userCtrl.delete)
router.get('/books', userCtrl.viewBooks)

// Route to fetch user receipts
router.get('/receipts', receiptCtrl.getUserReceipts)

module.exports = router
