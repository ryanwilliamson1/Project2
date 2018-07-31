//Notes to self: Don't forget to export everything once you're done with it
//Functions are connected to menu.js
var server=require("../server.js")
function updateCustomer(res,query, update){
	var db=server.getDb();
	db.collection("Client").update(query, update, function(err, results){
		if(err) throw err
		else{
			res.send("Client has been updated!")
		}
	})
}
module.exports.updateCustomer=updateCustomer

function deleteCustomer(res,query){
	var db=server.getDb();
	db.collection("Client").deleteOne(query, function(err, results){
		if(err) throw err
		else{
			
			res.send("Client has been deleted")
		}
	})
}
module.exports.deleteCustomer = deleteCustomer

function createCustomer(res,query, update){
	var db=server.getDb();
	db.collection("Client").insert(update, function(err, results){
		if(err) throw err
		else{
			console.log("Updated"+results.result.n)
			res.send("Client has been created")
		}
	})
}
module.exports.createCustomer = createCustomer

function createUser(res,query, update){
	var db=server.getDb();
	db.collection("admin").insert(update, function(err, results){
		if(err) throw err
		else{
			console.log("Updated"+results.result.n)
			res.send("Employee has been created")
		}
	})
}
module.exports.createUser=createUser

function updateUser(res,query, update){
	var db=server.getDb();
	db.collection("admin").update(query, update, function(err, results){
		if(err) throw err
		else{
			console.log("Updated"+results.result.n)
			res.send("Employee has been updated!")
		}
	})
}
module.exports.updateUser=updateUser