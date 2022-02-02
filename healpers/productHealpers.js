const  db  = require("../config/connection")
const collection = require('../config/collections');
const { ObjectId } = require("mongodb");

module.exports ={

    addProduct:(data,adminId)=>{

        return new Promise((resolve,reject)=>{
            console.log('data arrived',data);
            let productObj={
                adminId:ObjectId(adminId),
                product:data
            }
            db.get().collection(collection.PRODUCT_COLLECTION).insertOne(productObj).then((response)=>{
                console.log(response);
                resolve(response.insertedId)
            })
        })
    },

    getAllProducts:(id)=>{
        return new Promise(async(resolve,reject)=>{
            console.log(id);
            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find({adminId:id}).toArray()

            // console.log('api call :',admin);
            resolve(products)
        })
    },

    getAllProducts:()=>{
        return new Promise(async(resolve,reject)=>{
            let products= await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
    },
    getEditProduct:(productId)=>{
        return new Promise(async(resolve,reject)=>{
            let product = await db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:ObjectId(productId)})
            // console.log(product);
            resolve(product)
        })
    },
    updateProduct:(productDetials,productId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:ObjectId(productId)},
            {
                $set:{
                    'product.name':productDetials.name,
                    'product.price':productDetials.price,
                    'product.brand':productDetials.brand,
                    'product.description':productDetials.description
                }
            }).then((response)=>{
                resolve();
            })
        })
    }





}