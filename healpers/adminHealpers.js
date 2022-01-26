const db = require('../config/connection')
var collection =require('../config/collections')
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');

module.exports={


    createAdmin:(adminData)=>{
        return new Promise(async(resolve,reject)=>{
            adminData.password = await bcrypt.hash(adminData.password,10)
            // console.log("api call user data in db",userData);
             db.get().collection(collection.ADMIN_COLLECTION).insertOne(adminData).then((data)=>{
            //    console.log(data.insertedId);
            resolve(data.insertedId)
           })
        })
    },

    doLogin:(data)=>{
        return new Promise(async(resolve,reject)=>{
            var response={}
            var admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({email:data.email})
            if(admin){
                console.log(data,'api admin');
                bcrypt.compare(data.password,admin.password).then((status)=>{
                    if(status){
                        response.admin = admin;
                        response.status = true;
                        resolve(response)
                    }else{
                        resolve({status:false})
                    }
                })
            }else{
                resolve({status:false})
            }
        })
    },

    getAllUserDetails:()=>{
        return new Promise(async(resolve,reject)=>{
            let user = await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(user)
        })
    },
    blockUser:(userId)=>{
        return new Promise(async(resolve,rejcet)=>{
            db.get().collection(collection.USER_COLLECTION).updateOne({_id:ObjectId(userId)},{
                $set:{block:true}
            }).then((status)=>{
                // console.log("block status",status);
                resolve({blockStatus:true})
            })
        })
    },
    UnBlockUser:(userId)=>{
        return new Promise(async(resolve,rejcet)=>{
            db.get().collection(collection.USER_COLLECTION).updateOne({_id:ObjectId(userId)},{
                $set:{block:false}
            }).then((status)=>{
                // console.log("block status",status);
                resolve({blockStatus:true})
            })
        })
    }





}