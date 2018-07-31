//for admin to update customer web page
var total=0
var app=angular.module("menuApp",[]);
function sortByCustomerName(a,b) {
  if (a.customerName.toLowerCase() < b.customerName.toLowerCase())
    return -1;
  if (a.customerName.toLowerCase() > b.customerName.toLowerCase())
    return 1;
  return 0;
}

app.controller('menuCtrl', function($scope,$http){ 

    $http({
      method: 'GET',
      url: '/menu'
    }).then(function successCallback(response) {
    $scope.menu=response.data;
  }, function errorCallback(response) {
    $scope.menu=[]
  });
$scope.msg="Customers"
$scope.sortCustomers=function() {
	console.log($scope.menu)
	$scope.menu=$scope.menu.sort(sortByCustomerName)
	console.log($scope.menu)
}
//second: update customers
$scope.updateCustomer=function(item){
    $http({
      method: 'POST',
      url: '/updateCustomer',
      data:item
    }).then(function successCallback(response) {
    $scope.msg="Updated!";
  }, function errorCallback(response) {
    $scope.msg="Server Problem, try again later"
  });
}
//Delete customers
$scope.deleteCustomer=function(item){
    $http({
      method: 'POST',
      url: '/deleteCustomer',
      data:item
    }).then(function successCallback(response) {
    $scope.msg="Deleted!";
	$scope.menu.splice($scope.menu.indexOf(item),1)
  }, function errorCallback(response) {
    $scope.msg="Server Problem, try again later"
  });
}
 })