var express = require('express');
var router = express.Router();
var adminHealpers = require('../healpers/adminHealpers')
var productHealpers = require('../healpers/productHealpers')


/* GET users listing. */
router.get('/', function(req, res, next) {
  if(req.session.adminLogged){
    productHealpers.getAllProducts(req.session.admin._id).then((products)=>{
      // console.log('api call for products',products);
      let name = req.session.name;
      res.render('admin/admin_dashboard',{admin:true,name,products})
    })
    // res.render('admin/admin_dashboard',{admin:true})
  }else{
    res.render('admin/login')
  }
});

router.get('/login',(req,res)=>{
  if(req.session.adminLogged){
    res.redirect('/admin')
  }else{
    res.render('admin/login')

  }
  
})

router.post('/login',(req,res)=>{
  
  adminHealpers.doLogin(req.body).then((response)=>{
    if(response.status){
      // console.log('api call user ',response);
      req.session.name = response.admin.name;
      req.session.admin = response.admin;
      req.session.adminLogged = true;
      let name = req.session.name;
      // console.log("this is name",name);
      productHealpers.getAllProducts(req.session.admin._id).then((products)=>{
        // console.log('api call for products',products);
        res.render('admin/admin_dashboard',{admin:true,name,products})
      })
      
    }else{
      res.redirect('/admin/login')
    }
  })

})
router.get('/signUp',(req,res)=>{
  res.render('admin/sign_up')
})

router.post('/signUp',(req,res)=>{
  // console.log('api call',req.body);
  
  adminHealpers.createAdmin(req.body).then((response)=>{
    // console.log("api call for user response",response);
   req.session.admin = response.admin;
   req.session.userLoggined = true;
   var name=req.session.admin
   res.render('admin/admin_dashboard',{name,admin:true})
  })
})

router.post('/add-product',(req,res)=>{
  console.log('api call',req.session.admin);
  var image=req.files.image
  adminId=req.session.admin._id
  productHealpers.addProduct(req.body,adminId).then((response)=>{
    image.mv('./public/images/products/'+response+'.jpg',(err,done)=>{
      if (!err) {
        res.redirect('/admin')
    } else {
        console.log(err);
    }
    })
    // res.redirect('/admin')
  })
})

router.get('/users',async(req,res)=>{
   adminHealpers.getAllUserDetails().then((users)=>{
    //  console.log('api user response',users);
     let name = req.session.name;
     res.render('admin/user_details',{name,admin:true,users})
   })
 
})

router.get('/blockUser/:id',(req,res)=>{
  // console.log('uaser id call',req.params.id);
  adminHealpers.blockUser(req.params.id).then((response)=>{
    console.log('user blocked',response);
    res.redirect('/admin/users')
  })
})

router.get('/UnblockUser/:id',(req,res)=>{
  // console.log('uaser id call',req.params.id);
  adminHealpers.UnBlockUser(req.params.id).then((response)=>{
    console.log('user blocked',response);
    res.redirect('/admin/users')
  })
})

module.exports = router;
