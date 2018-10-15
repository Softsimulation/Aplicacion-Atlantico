angular.module('turismo.interno.services', [])

.service('turismoInterno', function ($http, $q, CONFIG) {
	let token="Bearer "+JSON.parse(localStorage.getItem("token"));
	$http.defaults.headers.common['Authorization']=token;

	this.getTemporadas=function () {
    	let deferred = $q.defer();
    	$http({
      		method: "get",
      		headers:{'content-type':'application/json',
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
    	let deferred = $q.defer();
    	$http({
      		method: "get",
      		headers:{'content-type':'application/json',
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
    	let deferred = $q.defer();
    	$http({
      		method: "get",
      		headers:{'content-type':'application/json',
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
	    let deferred = $q.defer();
	    
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
	    let deferred = $q.defer();
	    
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
	    let deferred = $q.defer();
	    
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
	    let deferred = $q.defer();
	    
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
	    let deferred = $q.defer();
	    
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
    	let deferred = $q.defer();
    	$http({
      		method: "get",
      		headers:{'content-type':'application/json',
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
	    let deferred = $q.defer();
	    
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
    	let deferred = $q.defer();
    	$http({
      		method: "get",
      		headers:{'content-type':'application/json',
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
	    let deferred = $q.defer();
	    
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
	    let deferred = $q.defer();
	    
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
    	let deferred = $q.defer();
    	$http({
      		method: "get",
      		headers:{'content-type':'application/json',
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
	    let deferred = $q.defer();
	    
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
    	let deferred = $q.defer();
    	$http({
      		method: "get",
      		headers:{'content-type':'application/json',
      	},
	      	url: CONFIG.APIURL+'turismointernoapi/actividades/'+id,
	    }).success(function(result, status) {
	        deferred.resolve(result);  
	    }).error(function(status, error, data) {
	        deferred.reject(error);
	    }); 
    	return deferred.promise;  
  	};
  	
  	this.crearestancia=function (data) {
	    let deferred = $q.defer();
	    
	    $http({
	      method: "POST",
	      header: {'content-type':'application/json'},
	      url: CONFIG.APIURL+'turismointernoapi/crearestancia',
	      data: data
	    }).success(function(result, status) {
	        deferred.resolve(result);	       		
	    }).error(function(error) {
	        deferred.reject(error);          
		});
		return deferred.promise;
  	};
 
  	this.cargartransporte=function (id) {
    	let deferred = $q.defer();
    	$http({
      		method: "get",
      		headers:{'content-type':'application/json',
      	},
	      	url: CONFIG.APIURL+'turismointernoapi/cargartransporte/'+id,
	    }).success(function(result, status) {
	        deferred.resolve(result);  
	    }).error(function(status, error, data) {
	        deferred.reject(error);
	    }); 
    	return deferred.promise;  
  	};

  	this.guardartransporte=function (data) {
	    let deferred = $q.defer();
	    
	    $http({
	      method: "POST",
	      header: {'content-type':'application/json'},
	      url: CONFIG.APIURL+'turismointernoapi/guardartransporte',
	      data: data
	    }).success(function(result, status) {
	        deferred.resolve(result);	       		
	    }).error(function(error) {
	        deferred.reject(error);          
		});
		return deferred.promise;
  	};

  	this.datagastos=function (id) {
	    let deferred = $q.defer();
	    
	    $http({
	      method: "POST",
	      header: {'content-type':'application/json'},
	      url: CONFIG.APIURL+'turismointernoapi/datagastos',
	      data: {id:id}
	    }).success(function(result, status) {
	        deferred.resolve(result);	       		
	    }).error(function(error) {
	        deferred.reject(error);          
		});
		return deferred.promise;
  	};

  	this.guardargastos=function (data) {
	    let deferred = $q.defer();
	    
	    $http({
	      method: "POST",
	      header: {'content-type':'application/json'},
	      url: CONFIG.APIURL+'turismointernoapi/guardargastos',
	      data: data
	    }).success(function(result, status) {
	        deferred.resolve(result);	       		
	    }).error(function(error) {
	        deferred.reject(error);          
		});
		return deferred.promise;
  	};

  	this.cargardatosfuentes=function (id) {
    	let deferred = $q.defer();
    	$http({
      		method: "get",
      		headers:{'content-type':'application/json',
      	},
	      	url: CONFIG.APIURL+'turismointernoapi/cargardatosfuentes/'+id,
	    }).success(function(result, status) {
	        deferred.resolve(result);  
	    }).error(function(status, error, data) {
	        deferred.reject(error);
	    }); 
    	return deferred.promise;  
  	};

  	
});