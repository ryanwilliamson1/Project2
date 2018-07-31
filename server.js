var express = require('express');
var app = express();
var path=require('path')
var router = express.Router();
const {ObjectId}=require('mongodb');

var userAuth=require("./user_controller/userverify.js")

var menuFs=require("./db_controller/dbMenu.js")

var publicPath=path.resolve(__dirname, "static" );
app.use(express.static(publicPath))

var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Using this part from the pizza lab
var session=require('express-session')
var sess = {
  secret: 'keyboard cat',
  cookie: {}
}
app.use(session(sess))

var MongoClient = require('mongodb').MongoClient;
var db,menu;
var dbURL="mongodb://admin:password@localhost:27017/Dodge"

var args = process.argv.slice(2)
if(args=="dev"){
MongoClient.connect(dbURL, 
          function(err, database) {
  if(err) throw err;
  db=database.db("Dodge")
 

  app.listen(59129);
});
}
else{
  const PORT=process.env.PORT||8000
  var dbURL="mongodb://admin:password@localhost:27017/Dodge"
  MongoClient.connect(dbURL, function(err,database){
    if(err) throw err;
    db=database.db("Dodge")
    app.listen(PORT)
   
  });
}
app.get('/', function(req, res){
  res.sendFile(`${publicPath}/index.html`);
});

app.get('/newCustomer',function(req,res){
  res.sendFile(`${publicPath}/newCustomer.html`)
})

app.get('/adminLogin',function (req,res) {
  res.sendFile(`${publicPath}/adminLogin.html`)
})
app.get('/createUser',function (req,res) {
  res.sendFile(`${publicPath}/createUser.html`)
})

app.get('/menu',function (req, res) {
     var query={}
      findMenuItems(res,query)
})

app.use("/adminLogin", userAuth)
//for any path starting with /adminLogin, use userAuth




//Logs out of session
app.get('/logout',function(req,res){
    req.session.destroy(function(){
    console.log('destroy the session')
    res.redirect('/adminlogin')
})
})
//Updates entries in the database
app.post("/updateCustomer", function(req,res){
  console.log(req.body)
  var data = req.body
  var query = {_id: ObjectId(data._id)}
  var update={$set:{customerName:data.customerName,
                    Budget: data.Budget,
                    Salesman: data.Salesman,
                    phoneNumber: data.phoneNumber}}
  menuFs.updateCustomer(res,query,update)
})

app.post("/deleteCustomer", function(req,res){
  console.log(req.body)
  var data = req.body
  var query = {_id: ObjectId(data._id)}

  menuFs.deleteCustomer(res,query)
})

//Creates a new entry in the customer database
app.post("/createCustomer", function(req,res){
var data= req.body
  var query = {_id: ObjectId(data._id)}
  var update={customerName:data.customerName,
                    Budget: data.Budget,
                    Salesman: data.Salesman,
                    phoneNumber: data.phoneNumber}
  console.log(update)
  menuFs.createCustomer(res,query,update)
})

//new entry in the user database

app.post("/createUser", function(req,res){
var data= req.body
  var query = {_id: ObjectId(data._id)}
  var update={user:data.user,
                    pwd: data.pwd
                  }
  menuFs.createUser(res,query,update)
})



app.get("/menus",function(req,res){
  if(req.session.user)
      res.sendFile(`${publicPath}/adminMenus.html`)
    else
      res.sendFile(`${publicPath}/adminLogin.html`)
})

function findMenuItems(res,query)
{
  console.log(query)
  db.collection("Client").find(query).toArray(function (err,results) {
 
    
    
    res.json(results)
  })

}


function findOrderItems(res,query)
{
  db.collection("Client").find(query).toArray(function (err,results) {
 
    res.writeHead(200);
    res.end(JSON.stringify(results))
  })
}


//two functions to export db and publicPath for userVerify
var getDb = function(){
  return db
};

var getPublicPath=function(){
  return publicPath
};
//module.exports.dbFunc =getDb;
module.exports.getDb=getDb
module.exports.getPublicPath=getPublicPath