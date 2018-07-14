angular.module('turismo.receptor.services', [])

.service('turismoReceptor', function ($http, $q, CONFIG) {

	this.encuestas=function () {
    	var deferred = $q.defer();
    	$http({
      		method: "get",
      		headers:{'content-type':'application/json',
            //Authorization:'Bearer{'+user.token+'}'
      	},
	      	url: CONFIG.APIURL+'turismoreceptoroapi/encuestas',
	    }).success(function(result, status) {
	        deferred.resolve(result);  
	    }).error(function(status, error, data) {
	        deferred.reject(error);
	    }); 
    	return deferred.promise;  
  	}; 

  	this.informaciondatoscrear=function () {
    	var deferred = $q.defer();
    	$http({
      		method: "get",
      		headers:{'content-type':'application/json',
            //Authorization:'Bearer{'+user.token+'}'
      	},
	      	url: CONFIG.APIURL+'turismoreceptoroapi/informaciondatoscrear',
	    }).success(function(result, status) {
	        deferred.resolve(result);  
	    }).error(function(status, error, data) {
	        deferred.reject(error);
	    }); 
    	return deferred.promise;  
  	}; 

  	this.departamento=function (id) {
    	var deferred = $q.defer();
    	$http({
      		method: "get",
      		headers:{'content-type':'application/json',
            //Authorization:'Bearer{'+user.token+'}'
      	},
	      	url: CONFIG.APIURL+'turismoreceptoroapi/departamento/'+id,
	    }).success(function(result, status) {
	        deferred.resolve(result);  
	    }).error(function(status, error, data) {
	        deferred.reject(error);
	    }); 
    	return deferred.promise;  
  	};

  	this.municipio=function (id) {
    	var deferred = $q.defer();
    	$http({
      		method: "get",
      		headers:{'content-type':'application/json',
            //Authorization:'Bearer{'+user.token+'}'
      	},
	      	url: CONFIG.APIURL+'turismoreceptoroapi/municipio/'+id,
	    }).success(function(result, status) {
	        deferred.resolve(result);  
	    }).error(function(status, error, data) {
	        deferred.reject(error);
	    }); 
    	return deferred.promise;  
  	};

  	this.guardardatos=function (data) {
	    var deferred = $q.defer();
	    
	    $http({
	      method: "POST",
	      header: {'content-type':'application/json'},
	      url: CONFIG.APIURL+'turismoreceptoroapi/guardardatos',
	      data: data
	    }).success(function(result, status) {
	        deferred.resolve(result);	       		
	    }).error(function(error) {
	        deferred.reject(error);          
		});

		return deferred.promise;
  	};

  	this.cargareditardatos=function (id) {
    	var deferred = $q.defer();
    	$http({
      		method: "get",
      		headers:{'content-type':'application/json',
            //Authorization:'Bearer{'+user.token+'}'
      	},
	      	url: CONFIG.APIURL+'turismoreceptoroapi/cargareditardatos/'+id,
	    }).success(function(result, status) {
	        deferred.resolve(result);  
	    }).error(function(status, error, data) {
	        deferred.reject(error);
	    }); 
    	return deferred.promise;  
  	};

  	this.guardareditardatos=function (data) {
	    var deferred = $q.defer();
	    
	    $http({
	      method: "POST",
	      header: {'content-type':'application/json'},
	      url: CONFIG.APIURL+'turismoreceptoroapi/guardareditardatos',
	      data: data
	    }).success(function(result, status) {
	        deferred.resolve(result);	       		
	    }).error(function(error) {
	        deferred.reject(error);          
		});

		return deferred.promise;
  	};

  	this.cargardatosseccionestancia=function (id) {
    	var deferred = $q.defer();
    	$http({
      		method: "get",
      		headers:{'content-type':'application/json',
            //Authorization:'Bearer{'+user.token+'}'
      	},
	      	url: CONFIG.APIURL+'turismoreceptoroapi/cargardatosseccionestancia/'+id,
	    }).success(function(result, status) {
	        deferred.resolve(result);  
	    }).error(function(status, error, data) {
	        deferred.reject(error);
	    }); 
    	return deferred.promise;  
  	};

  	this.crearestancia=function (data) {
	    var deferred = $q.defer();
	    
	    $http({
	      method: "POST",
	      header: {'content-type':'application/json'},
	      url: CONFIG.APIURL+'turismoreceptoroapi/crearestancia',
	      data: data
	    }).success(function(result, status) {
	        deferred.resolve(result);	       		
	    }).error(function(error) {
	        deferred.reject(error);          
		});

		return deferred.promise;
  	};

   	this.cargardatostransporte=function (id) {
    	var deferred = $q.defer();
    	$http({
      		method: "get",
      		headers:{'content-type':'application/json',
            //Authorization:'Bearer{'+user.token+'}'
      	},
	      	url: CONFIG.APIURL+'turismoreceptoroapi/cargardatostransporte/'+id,
	    }).success(function(result, status) {
	        deferred.resolve(result);  
	    }).error(function(status, error, data) {
	        deferred.reject(error);
	    }); 
    	return deferred.promise;  
  	};

  	this.guardarsecciontransporte=function (data) {
	    var deferred = $q.defer();
	    
	    $http({
	      method: "POST",
	      header: {'content-type':'application/json'},
	      url: CONFIG.APIURL+'turismoreceptoroapi/guardarsecciontransporte',
	      data: data
	    }).success(function(result, status) {
	        deferred.resolve(result);	       		
	    }).error(function(error) {
	        deferred.reject(error);          
		});

		return deferred.promise;
  	};

  	this.cargardatosseccionviaje=function (id) {
    	var deferred = $q.defer();
    	$http({
      		method: "get",
      		headers:{'content-type':'application/json',
            //Authorization:'Bearer{'+user.token+'}'
      	},
	      	url: CONFIG.APIURL+'turismoreceptoroapi/cargardatosseccionviaje/'+id,
	    }).success(function(result, status) {
	        deferred.resolve(result);  
	    }).error(function(status, error, data) {
	        deferred.reject(error);
	    }); 
    	return deferred.promise;  
  	};

  	this.guardarseccionviajegrupo=function (data) {
	    var deferred = $q.defer();
	    
	    $http({
	      method: "POST",
	      header: {'content-type':'application/json'},
	      url: CONFIG.APIURL+'turismoreceptoroapi/guardarseccionviajegrupo',
	      data: data
	    }).success(function(result, status) {
	        deferred.resolve(result);	       		
	    }).error(function(error) {
	        deferred.reject(error);          
		});

		return deferred.promise;
  	};

  	this.infogasto=function (id) {
    	var deferred = $q.defer();
    	$http({
      		method: "get",
      		headers:{'content-type':'application/json',
            //Authorization:'Bearer{'+user.token+'}'
      	},
	      	url: CONFIG.APIURL+'turismoreceptoroapi/infogasto/'+id,
	    }).success(function(result, status) {
	        deferred.resolve(result);  
	    }).error(function(status, error, data) {
	        deferred.reject(error);
	    }); 
    	return deferred.promise;  
  	};

  	this.guardargastos=function (data) {
	    var deferred = $q.defer();
	    
	    $http({
	      method: "POST",
	      header: {'content-type':'application/json'},
	      url: CONFIG.APIURL+'turismoreceptoroapi/guardargastos',
	      data: data
	    }).success(function(result, status) {
	        deferred.resolve(result);	       		
	    }).error(function(error) {
	        deferred.reject(error);          
		});

		return deferred.promise;
  	};


  	this.cargardatospercepcion=function (id) {
    	var deferred = $q.defer();
    	$http({
      		method: "get",
      		headers:{'content-type':'application/json',
            //Authorization:'Bearer{'+user.token+'}'
      	},
	      	url: CONFIG.APIURL+'turismoreceptoroapi/cargardatospercepcion/'+id,
	    }).success(function(result, status) {
	        deferred.resolve(result);  
	    }).error(function(status, error, data) {
	        deferred.reject(error);
	    }); 
    	return deferred.promise;  
  	};

  	this.guardarseccionpercepcion=function (data) {
	    var deferred = $q.defer();
	    
	    $http({
	      method: "POST",
	      header: {'content-type':'application/json'},
	      url: CONFIG.APIURL+'turismoreceptoroapi/guardarseccionpercepcion',
	      data: data
	    }).success(function(result, status) {
	        deferred.resolve(result);	       		
	    }).error(function(error) {
	        deferred.reject(error);          
		});

		return deferred.promise;
  	};

  	this.cargardatosseccioninformacion=function (id) {
    	var deferred = $q.defer();
    	$http({
      		method: "get",
      		headers:{'content-type':'application/json',
            //Authorization:'Bearer{'+user.token+'}'
      	},
	      	url: CONFIG.APIURL+'turismoreceptoroapi/cargardatosseccioninformacion/'+id,
	    }).success(function(result, status) {
	        deferred.resolve(result);  
	    }).error(function(status, error, data) {
	        deferred.reject(error);
	    }); 
    	return deferred.promise;  
  	};

  	this.guardarseccioninformacion=function (data) {
	    var deferred = $q.defer();
	    
	    $http({
	      method: "POST",
	      header: {'content-type':'application/json'},
	      url: CONFIG.APIURL+'turismoreceptoroapi/guardarseccioninformacion',
	      data: data
	    }).success(function(result, status) {
	        deferred.resolve(result);	       		
	    }).error(function(error) {
	        deferred.reject(error);          
		});

		return deferred.promise;
  	};

});