const { response } = require('express');
var express = require('express');
const productHealpers = require('../healpers/productHealpers');
var router = express.Router();
var userHealpers = require('../healpers/userHealpers')

var varifyLogin=(req,res,next)=>{
  if(req.session.userLoggined){
    next()
  }else{
    res.redirect('/login')
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.userLoggined){
    var name=req.session.name;
    console.log("this is name",name);
    productHealpers.getAllProducts().then((products)=>{
      // console.log('api call for user products',products);
    res.render('index',{user:true,name,products})

    })
  }else{
    res.redirect('/login')
  }
  
});

router.get('/login',(req,res)=>{
  if(req.session.userLoggined){
    res.redirect('/')
  }else{
    res.render('login')
  }
})

router.post('/login',(req,res)=>{
  userHealpers.doLogin(req.body).then((response)=>{
    if(response.status){
      // console.log('api call user ',response);
      req.session.name = response.user.name;
      req.session.id = response;
      req.session.userLoggined = true;
     res.redirect('/')
    }else{
      let error= 'enter a valid username or password'
      res.render('login',{error})
    }
  }).catch((response)=>{
    let error= 'admin blocked you'
    res.render('login',{error})
  })
})

router.get('/signUp',(req,res)=>{
  res.render('sign_up')
})

router.post('/signUp',(req,res)=>{
  // console.log('api call',req.body);
  userHealpers.createUser(req.body).then((response)=>{
    // console.log("api call for user response",response);
   req.session.name = req.body.name;
   req.session.id = response;
   req.session.userLoggined = true;
  res.redirect('/')
  })
})

router.get('/logout',(req,res)=>{
  req.session.userLoggined=false
  res.redirect('/login');
})

router.post('/varify-mail',(req,res,next)=>{
  userHealpers.varifyMail(req.body.mail).then((response)=>{
    // console.log(" response",response);
    res.json(response)
  })
})

router.get('/cart',varifyLogin,(req,res,next)=>{
  let name = req.session.name;
  let cart=1
  if(cart==null){
    res.render('user/empty_cart',{user:true,name})
  }else{
    res.render('user/cart',{user:true,name})
  }
})
module.exports = router;
