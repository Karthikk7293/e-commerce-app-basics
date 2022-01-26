const { response } = require('express');
var express = require('express');
const productHealpers = require('../healpers/productHealpers');
var router = express.Router();
var userHealpers = require('../healpers/userHealpers')

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.userLoggined){
    var name=req.session.name;
    console.log("this is name",name);
    res.render('index', {user:true,name});
  }else{
    res.render('login')
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
      let name = req.session.name;
      // console.log("this is name",name);
      productHealpers.getAllProducts().then((products)=>{
        // console.log('api call for user products',products);
      res.render('index',{user:true,name,products})

      })
    }else{
      res.redirect('/login')
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
   var name=req.session.name
   productHealpers.getAllProducts().then((products)=>{
    // console.log('api call for user products',products);
  res.render('index',{user:true,name,products})

  })
  })
})

module.exports = router;
