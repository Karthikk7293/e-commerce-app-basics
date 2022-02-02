const { response } = require('express');
var express = require('express');
var router = express.Router();
var adminHealpers = require('../healpers/adminHealpers')
var productHealpers = require('../healpers/productHealpers')

var varifyLogin=(req,res,next)=>{
  if(req.session.adminLogged){
    next()
  }else{
    res.redirect('/admin/login')
  }
}
/* GET users listing. */
router.get('/', function(req, res, next) {
  if(req.session.adminLogged){
    productHealpers.getAllProducts(req.session.admin._id).then((products)=>{
      let name = req.session.admin.name;
      res.render('admin/admin_dashboard',{admin:true,name,products})
    })
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
      req.session.admin = response.admin;
      req.session.adminLogged = true;
     
      res.redirect('/admin')
    }else{
      res.redirect('/admin/login')
    }
  })

})
router.get('/signUp',(req,res)=>{
  res.render('admin/sign_up')
})

router.post('/signUp',(req,res)=>{
  
  adminHealpers.createAdmin(req.body).then((response)=>{
   req.session.admin = response.admin;
   req.session.adminLogged = true;
   res.redirect('/admin')
  })
})

router.post('/add-product',varifyLogin,(req,res,next)=>{
  var image=req.files.image
  adminId=req.session.admin._id
  productHealpers.addProduct(req.body,adminId).then((id)=>{
    image.mv('./public/images/products/'+id+'.jpg',(err,done)=>{
      if (!err) {
        res.redirect('/admin')
    } else {
        console.log(err);
    }
    })
  })
})

router.get('/logout',(req,res)=>{
  req.session.adminLogged=false
  res.redirect('/admin/login')
})

router.get('/users',varifyLogin, async(req,res,next)=>{
   adminHealpers.getAllUserDetails().then((users)=>{
     let name = req.session.admin.name;
     res.render('admin/user_details',{name,admin:true,users})
   })
 
})

router.get('/block-user/:id',varifyLogin,(req,res,next)=>{
  adminHealpers.blockUser(req.params.id).then((response)=>{
    res.redirect('/admin/users')
  })
})

router.get('/unblock-user/:id',varifyLogin,(req,res,next)=>{
  adminHealpers.UnBlockUser(req.params.id).then((response)=>{
    res.redirect('/admin/users')
  })
})

router.get('/delete-product/:id',varifyLogin,(req,res,next)=>{
  adminHealpers.deletePoduct(req.params.id).then((response)=>{
  res.redirect('/admin')
  })
})

router.get('/edit-product/:id',varifyLogin,(req,res,next)=>{
  console.log(req.params.id);
  productHealpers.getEditProduct(req.params.id).then((product)=>{
  let name = req.session.admin.name
  res.render('admin/edit_product',{admin:true,name,product})
  })
})

router.post('/edit-product/:id',varifyLogin,(req,res)=>{
  // console.log('api call ',req.body,req.params.id);
  productHealpers.updateProduct(req.body,req.params.id).then(()=>{
    res.redirect('/admin')
    // console.log("api image file",req.files);
  if(req.files){
    let image = req.files.image
    image.mv('./public/images/products/'+req.params.id+'.jpg')
  } 
  })
})

router.post('/varify-mail',(req,res,next)=>{
  console.log('api call');
  adminHealpers.varifyMail(req.body.mail).then((response)=>{
    console.log(" response",response);
    res.json(response)
  })
})

module.exports = router;
