const { addToCartItems, getCartItems, deletCartItem } = require('../Controllers/carts')
const { tokenVerifier } = require('../Middlewares/tokenVerifier')

const router = require('express').Router()

router.post('/add',tokenVerifier, addToCartItems)
router.get('/', tokenVerifier, getCartItems)
router.patch('/:productId', tokenVerifier, deletCartItem)

module.exports = router