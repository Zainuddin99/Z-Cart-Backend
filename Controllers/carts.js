const allUsers = require("../Database/Models/all-users")
const { asyncWrapper } = require("../Error handlers/asyncWrapper")
const { createCustomErrorInstance } = require("../Error handlers/customErrorHandler")

const addToCartItems = asyncWrapper(async(req, res) =>{
    const {id} = req.userId
    const {id: productId, cart} = req.body
    const product = await allUsers.findOne({_id: id})
    const sameItem = product.carts.find((item)=>item.productId === productId+'')
    if(sameItem){
        await allUsers.findOneAndUpdate({_id:id, "carts.productId": productId+''},
        {
            $inc: {
                "carts.$.cart": cart
            }
        })
    }else{
        const {name, title, image, price} = req.body
        await allUsers.findOneAndUpdate({_id:id},
        {
            $push: {
                carts: {
                    productId,
                    name: name || title, 
                    image,
                    price,
                    cart
                }
            }
        })
    }
})

const getCartItems = asyncWrapper(async(req, res)=>{
    const {id} = req.userId
    const cartItems = await allUsers.findOne({_id: id}).select('carts')
    if(cartItems){
        return res.status(200).json({message: 'Successfull', result: cartItems})
    }
    createCustomErrorInstance('No user found', 404)
})

const deletCartItem = asyncWrapper(async(req, res) => {
    const {id} = req.userId
    const {productId} = req.params
    await allUsers.updateOne({_id: id},{
        $pull:{
            carts: {productId}
        }
    })
})

module.exports = {addToCartItems, getCartItems, deletCartItem}