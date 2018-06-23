angular.module('turismo.interno.services', [])

.service('turismoInterno', function ($http, $q, CONFIG) {

	this.getTemporadas=function () {
    	var deferred = $q.defer();
    	$http({
      		method: "get",
      		headers:{'content-type':'application/json',
            //Authorization:'Bearer{'+user.token+'}'
      	},
	      	url: CONFIG.APIURL+'turismointernoapi/gettemporadas',
	    }).success(function(result, status) {
	        deferred.resolve(result);  
	    }).error(function(status, error, data) {
	        deferred.reject(error);
	    }); 
    	return deferred.promise;  
  	}; 

  	this.cargardatos=function (id) {
    	var deferred = $q.defer();
    	$http({
      		method: "get",
      		headers:{'content-type':'application/json',
            //Authorization:'Bearer{'+user.token+'}'
      	},
      	url: CONFIG.APIURL+'turismointernoapi/cargardatos/'+id,
	    }).success(function(result, status) {
	        deferred.resolve(result);  
	    }).error(function(status, error, data) {
	        deferred.reject(error);
	    }); 
	    return deferred.promise;  
  	}; 

  	this.datoshogar=function () {
    	var deferred = $q.defer();
    	$http({
      		method: "get",
      		headers:{'content-type':'application/json',
            //Authorization:'Bearer{'+user.token+'}'
      	},
	    url: CONFIG.APIURL+'turismointernoapi/datoshogar',
	    }).success(function(result, status) {
	        deferred.resolve(result);  
	    }).error(function(status, error, data) {
	        deferred.reject(error);
	    }); 
    	return deferred.promise;  
  	};

  	this.barrios=function (data) {
	    var deferred = $q.defer();
	    
	    $http({
	      method: "POST",
	      header: {'content-type':'application/json'},
	      url: CONFIG.APIURL+'turismointernoapi/barrios',
	      data: data
	    }).success(function(result, status) {
	        deferred.resolve(result);	       		
	    }).error(function(error) {
	        deferred.reject(error);          
		});
		return deferred.promise;
  	};

  	this.guardarhogar=function (data) {
	    var deferred = $q.defer();
	    
	    $http({
	      method: "POST",
	      header: {'content-type':'application/json'},
	      url: CONFIG.APIURL+'turismointernoapi/guardarhogar',
	      data: data
	    }).success(function(result, status) {
	        deferred.resolve(result);	       		
	    }).error(function(error) {
	        deferred.reject(error);          
		});

		return deferred.promise;
  	};

  	this.datoseditar=function (data) {
	    var deferred = $q.defer();
	    
	    $http({
	      method: "POST",
	      header: {'content-type':'application/json'},
	      url: CONFIG.APIURL+'turismointernoapi/datoseditar',
	      data: data
	    }).success(function(result, status) {
	        deferred.resolve(result);	       		
	    }).error(function(error) {
	        deferred.reject(error);          
		});
		return deferred.promise;
  	};

  	this.eliminarpersona=function (data) {
	    var deferred = $q.defer();
	    
	    $http({
	      method: "POST",
	      header: {'content-type':'application/json'},
	      url: CONFIG.APIURL+'turismointernoapi/eliminarpersona',
	      data: data
	    }).success(function(result, status) {
	        deferred.resolve(result);	       		
	    }).error(function(error) {
	        deferred.reject(error);          
		});
		return deferred.promise;
  	};

  	this.guardareditarhogar=function (data) {
	    var deferred = $q.defer();
	    
	    $http({
	      method: "POST",
	      header: {'content-type':'application/json'},
	      url: CONFIG.APIURL+'turismointernoapi/guardareditarhogar',
	      data: data
	    }).success(function(result, status) {
	        deferred.resolve(result);	       		
	    }).error(function(error) {
	        deferred.reject(error);          
		});
		return deferred.promise;
  	};

  	this.viajes=function (id) {
    	var deferred = $q.defer();
    	$http({
      		method: "get",
      		headers:{'content-type':'application/json',
            //Authorization:'Bearer{'+user.token+'}'
      	},
	      	url: CONFIG.APIURL+'turismointernoapi/viajes/'+id,
	    }).success(function(result, status) {
	        deferred.resolve(result);  
	    }).error(function(status, error, data) {
	        deferred.reject(error);
	    }); 
    	return deferred.promise;  
  	};

  	this.createviaje=function (data) {
	    var deferred = $q.defer();
	    
	    $http({
	      method: "POST",
	      header: {'content-type':'application/json'},
	      url: CONFIG.APIURL+'turismointernoapi/createviaje',
	      data: data
	    }).success(function(result, status) {
	        deferred.resolve(result);	       		
	    }).error(function(error) {
	        deferred.reject(error);          
		});
		return deferred.promise;
  	};

  	this.viaje=function (id) {
    	var deferred = $q.defer();
    	$http({
      		method: "get",
      		headers:{'content-type':'application/json',
            //Authorization:'Bearer{'+user.token+'}'
      	},
	      	url: CONFIG.APIURL+'turismointernoapi/viaje/'+id,
	    }).success(function(result, status) {
	        deferred.resolve(result);  
	    }).error(function(status, error, data) {
	        deferred.reject(error);
	    }); 
    	return deferred.promise;  
  	};

  	this.eliminarviaje=function (data) {
	    var deferred = $q.defer();
	    
	    $http({
	      method: "POST",
	      header: {'content-type':'application/json'},
	      url: CONFIG.APIURL+'turismointernoapi/eliminarviaje',
	      data: data
	    }).success(function(result, status) {
	        deferred.resolve(result);	       		
	    }).error(function(error) {
	        deferred.reject(error);          
		});
		return deferred.promise;
  	};
  	
  	this.siguienteviaje=function (data) {
	    var deferred = $q.defer();
	    
	    $http({
	      method: "POST",
	      header: {'content-type':'application/json'},
	      url: CONFIG.APIURL+'turismointernoapi/siguienteviaje',
	      data: data
	    }).success(function(result, status) {
	        deferred.resolve(result);	       		
	    }).error(function(error) {
	        deferred.reject(error);          
		});
		return deferred.promise;
  	};

  	this.viajedataprincipal=function (id) {
    	var deferred = $q.defer();
    	$http({
      		method: "get",
      		headers:{'content-type':'application/json',
            //Authorization:'Bearer{'+user.token+'}'
      	},
	      	url: CONFIG.APIURL+'turismointernoapi/viajedataprincipal/'+id,
	    }).success(function(result, status) {
	        deferred.resolve(result);  
	    }).error(function(status, error, data) {
	        deferred.reject(error);
	    }); 
    	return deferred.promise;  
  	};	

  	this.createviajeprincipal=function (data) {
	    var deferred = $q.defer();
	    
	    $http({
	      method: "POST",
	      header: {'content-type':'application/json'},
	      url: CONFIG.APIURL+'turismointernoapi/createviajeprincipal',
	      data: data
	    }).success(function(result, status) {
	        deferred.resolve(result);	       		
	    }).error(function(error) {
	        deferred.reject(error);          
		});
		return deferred.promise;
  	};

  	this.actividades=function (id) {
    	var deferred = $q.defer();
    	$http({
      		method: "get",
      		headers:{'content-type':'application/json',
            //Authorization:'Bearer{'+user.token+'}'
      	},
	      	url: CONFIG.APIURL+'turismointernoapi/actividades/'+id,
	    }).success(function(result, status) {
	        deferred.resolve(result);  
	    }).error(function(status, error, data) {
	        deferred.reject(error);
	    }); 
    	return deferred.promise;  
  	};
});