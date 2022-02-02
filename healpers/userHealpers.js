const db = require('../config/connection')
var collection =require('../config/collections')
const bcrypt = require('bcrypt');

module.exports={


    createUser:(userData)=>{

        return new Promise(async(resolve,reject)=>{
            userData.password = await bcrypt.hash(userData.password,10)
            // console.log("api call user data in db",userData);
            userData.block = false;
             db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
            //    console.log(data.insertedId);
            resolve(data.insertedId)

           })
        })
    },
    doLogin:(data)=>{
        return new Promise(async(resolve,reject)=>{
            var response={}
            var user = await db.get().collection(collection.USER_COLLECTION).findOne({email:data.email})
            if(user){
                console.log(data,'api user');
                bcrypt.compare(data.password,user.password).then((status)=>{
                    if(user.block==false){
                        if(status){
                            response.user = user;
                            response.status = true;
                            resolve(response)
                        }else{
                            resolve({status:false})
                        }
                    }else{
                        reject({block:true})
                    }
                   
                })
            }else {
                resolve({status:false})
            }
        })
    },
    varifyMail:(email)=>{
        return new Promise(async(resolve,reject)=>{
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({email:email})
            if(user){
                resolve({status:false})
            }else{
                resolve({status:true})
            }
        })
    }




}