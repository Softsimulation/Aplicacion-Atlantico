angular.module('general.services', [])
.service('generalServices', function ($http, $q, CONFIG) {
	this.apiLogin=function (data) {
	    let deferred = $q.defer();
	    
	    $http({
	      method: "POST",
	      header: {'content-type':'application/json'},
	      url: CONFIG.APIURL+'authapi/login',
	      data: data
	    }).success(function(result, status) {
	        deferred.resolve(result);	       		
	    }).error(function(error,status) {
	    	errors={error,status}
	        deferred.reject(errors);          
		});
		return deferred.promise;
  	};
});