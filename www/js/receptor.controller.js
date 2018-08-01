angular.module('receptor.controllers', [])

.controller('encuestasController', function($scope, turismoReceptor, $ionicLoading, $ionicPopup, $ionicHistory, $rootScope) {
  $ionicHistory.clearHistory();
  $ionicHistory.clearCache();
  $scope.currentPage = 0;
  $scope.pageSize = 5;           
  $scope.encuestas=[];

  $scope.filter = [
                    {'option':'Todas las encuestas', 'value':''}, 
                    {'option':'Calculadas', 'value':'calculadas'},
                    {'option':'Sin Calcular', 'value': 'sincalcular'}
                  ];

  $scope.campos = [
                    {'option':'Cualquier campo', 'value':''},
                    {'option':'Fecha de aplicación', 'value':'fecha'},
                    {'option':'Fecha de llegada', 'value':'fechallegada'},
                  ];

  $scope.filtroEstadoEncuesta={'option':'Todas las encuestas', 'value':''};
  $scope.campoSelected={'option':'Cualquier campo', 'value':''};

  $ionicLoading.show({
    template: '<ion-spinner></ion-spinner> Espere por favor...',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });

  turismoReceptor.encuestas().then(function (data) {
      $ionicLoading.hide();
      $scope.encuestas=data;
      for (var i = 0; i < $scope.encuestas.length; i++) {
          if ($scope.encuestas[i].estadoid > 0 && $scope.encuestas[i].estadoid < 7) {
              $scope.encuestas[i].Filtro = 'sincalcular';
          } else {
              $scope.encuestas[i].Filtro = 'calculadas';
          }
      }
  }, 
  function (error, data) {
    $ionicLoading.hide();
    var alertPopup =$ionicPopup.alert({
        title: '¡Error!',
        template: 'Ha ocurrido un error.',
        okType:'button-stable'
    });
  });

  $scope.numberOfPages=function(encuestas){
    return Math.ceil(encuestas.length/$scope.pageSize);                
  };
})

.controller('generalController', function($scope, turismoReceptor, $ionicLoading, $ionicPopup, ionicToast, $ionicScrollDelegate, $state, $filter, $location, $rootScope) {
  
  $scope.encuesta = {};
  $scope.forms={};

  if(localStorage.getItem("loader_receptor")!=null){
    $rootScope.loader_receptor=JSON.parse(localStorage.getItem("loader_receptor"));
  }else{
    $rootScope.loader_receptor={};
  }

  $ionicLoading.show({
    template: '<ion-spinner></ion-spinner> Espere por favor...',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });

  turismoReceptor.informaciondatoscrear().then(function (data) {
      if(!$rootScope.loader_receptor.general){
        $rootScope.loader_receptor.general=data;
        localStorage.setItem("loader_receptor",JSON.stringify($rootScope.loader_receptor));
      }
      $ionicLoading.hide();
      $scope.grupos = data.grupos;
      $scope.encuestadores = data.encuestadores;
      $scope.lugares = data.lugar_nacimiento;
      $scope.paises = data.paises;
      $scope.motivos = data.motivos;
      $scope.medicos = data.medicos;
      $scope.departamentos_colombia = data.departamentos;
      $scope.lugares_aplicacion = data.lugares_aplicacion;
  }, 
  function (error, data) {
    $ionicLoading.hide();
    var alertPopup =$ionicPopup.alert({
        title: '¡Error!',
        template: 'Ha ocurrido un error.',
        okType:'button-stable'
    });
  });

  $scope.changedepartamento = function (id) {
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner> Espere por favor...',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });
    $scope.departamento = {};
    $scope.departamentos = [];
    if (id != null) {
      turismoReceptor.departamento(id).then(function (data) {
          $ionicLoading.hide();
          $scope.departamentos = data;
      }, 
      function (error, data) {
        $ionicLoading.hide();
        var alertPopup =$ionicPopup.alert({
            title: '¡Error!',
            template: 'Ha ocurrido un error.',
            okType:'button-stable'
        });
      });
    }
  };

  $scope.changemunicipio = function (id) {
    $scope.encuesta.Municipio = {};
    $scope.municipios = [];
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner> Espere por favor...',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });

    if (id != null) { 
      turismoReceptor.municipio(id).then(function (data) {
        $ionicLoading.hide();
        $scope.municipios = data;
      }, 
      function (error, data) {
        $ionicLoading.hide();
        var alertPopup =$ionicPopup.alert({
            title: '¡Error!',
            template: 'Ha ocurrido un error.',
            okType:'button-stable'
        });
      });
    }
  };

  $scope.changemunicipiocolombia = function (id) {
    $scope.encuesta.Destino = "";
    $scope.municipios_colombia = [];
    if (id != null) { 
      turismoReceptor.municipio(id).then(function (data) {
        $ionicLoading.hide();
        $scope.municipios_colombia = data;
      }, 
      function (error, data) {
        $ionicLoading.hide();
        var alertPopup =$ionicPopup.alert({
            title: '¡Error!',
            template: 'Ha ocurrido un error.',
            okType:'button-stable'
        });
      });
    }
  };

  $scope.otro = function () {
    if ($scope.encuesta.Otro == "") {
      $scope.encuesta.Motivo = null;
    } else {
      $scope.encuesta.Motivo = 18;
    }
  };

  $scope.cambiomotivo = function () {
    if ($scope.encuesta.Motivo != 18) {
      $scope.encuesta.Otro = "";  
    }
  };

  $scope.guardar=function () {
    

    if (!$scope.forms.DatosForm.$valid) {
       ionicToast.show("Hay errores en el formulario corrigelo",'middle', false, 5000);
       return;
    }
    $scope.encuesta.fechaAplicacion=$filter('date')($scope.encuesta.fechaAplicacion, 'yyyy-MM-dd HH:mm');
    $scope.encuesta.Llegada=$filter('date')($scope.encuesta.Llegada, 'yyyy-MM-dd');
    $scope.encuesta.Salida=$filter('date')($scope.encuesta.Salida, 'yyyy-MM-dd');

    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner> Espere por favor...',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });

    turismoReceptor.guardardatos($scope.encuesta).then(function (data) {
      $ionicLoading.hide();
      if (data.success == true) {
        ionicToast.show("Se realizó la operación exitosamente",'top', false, 5000);
        if (data.terminada == 1) {
          $location.path("/app/encuestas/");
        } else {
          $location.path("/app/estancia/"+data.id);
        }
      } else {
        $ionicScrollDelegate.scrollTop(true);
        ionicToast.show("Hay errores en el formulario corrigelo",'middle', false, 5000);
        $scope.errores = data.errores;
      }
    }, 
    function (error, data) {
      $ionicLoading.hide();
      var alertPopup =$ionicPopup.alert({
        title: '¡Error!',
        template: 'Ha ocurrido un error. Intenta nuevamente',
        okType:'button-stable'
      });
    });
  };
})

.controller('editGeneralController', function($scope, turismoReceptor, $ionicLoading, $ionicPopup, ionicToast, $ionicScrollDelegate, $state, $filter, $location, $stateParams, factories, $rootScope) {
  $scope.encuesta = {};
  $scope.forms={};
  $scope.departamentod = {};

  if(localStorage.getItem("loader_receptor")!=null){
    $rootScope.loader_receptor=JSON.parse(localStorage.getItem("loader_receptor"));
  }else{
    $rootScope.loader_receptor={};
  }

  $ionicLoading.show({
    template: '<ion-spinner></ion-spinner> Espere por favor...',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });

  turismoReceptor.cargareditardatos($stateParams.id).then(function (data) {
      $ionicLoading.hide();
      //data.datos = data.datos;
      /*if(!$rootScope.loader_receptor.editGeneral){
        $rootScope.loader_receptor.editGeneral=data;
        localStorage.setItem("loader_receptor",JSON.stringify($rootScope.loader_receptor));
      }*/

      $scope.departamentos = data.departamentosr;
      $scope.municipios = data.municipiosr;
      $scope.municipios_colombia = data.municipiosd;
      $scope.grupos = data.datos.grupos;
      $scope.encuestadores = data.datos.encuestadores;
      $scope.lugares = data.datos.lugar_nacimiento;
      $scope.paises = data.datos.paises;
      $scope.motivos = data.datos.motivos;
      $scope.medicos = data.datos.medicos;
      $scope.lugares_aplicacion = data.datos.lugares_aplicacion;
      $scope.departamentos_colombia = data.datos.departamentos;
      $scope.encuesta = data.visitante;
      $scope.pais_residencia =factories.findSelect(data.visitante.Pais, data.datos.paises);
      $scope.departamento = factories.findSelect(data.visitante.Departamento, data.departamentosr);
      $scope.departamentod = factories.findSelect(data.visitante.DepartamentoDestino, data.datos.departamentos);
      fechal = data.visitante.Llegada.split('-');
      fechas = data.visitante.Salida.split('-');
      $scope.encuesta.Llegada = new Date(fechal[0], (parseInt(fechal[1]) - 1), fechal[2]);
      $scope.encuesta.Salida = new Date(fechas[0], (parseInt(fechas[1]) - 1), fechas[2]);

      $scope.encuesta.encuestador = factories.findSelect(data.visitante.Encuestador, data.datos.encuestadores);
      $scope.encuesta.Aplicacion = factories.findSelect(data.visitante.aplicacion, data.datos.lugares_aplicacion);
      $scope.encuesta.nacimiento = factories.findSelect(data.visitante.Nacimiento, data.datos.lugar_nacimiento);
      $scope.encuesta.pais_nacimiento = factories.findSelect(data.visitante.Pais_Nacimiento, data.datos.paises);
      $scope.encuesta.municipio = factories.findSelect(data.visitante.Municipio, data.municipiosr);
      if(data.visitante.Destino){
        $scope.encuesta.destino = factories.findSelect(data.visitante.Destino, data.municipiosd);
      }


      if(data.visitante.fechaAplicacion != null){
        var split1 = data.visitante.fechaAplicacion.split(" ");
        var split2 = split1[1].split(":");
        split1 = split1[0].split("-");
        var fechaAp = new Date(split1[0], split1[1] - 1, split1[2],split2[0],split2[1]);
        $scope.encuesta.fechaAplicacion = fechaAp;    
      }
  }, 
  function (error, data) {
    $ionicLoading.hide();
    var alertPopup =$ionicPopup.alert({
        title: '¡Error!',
        template: 'Ha ocurrido un error.',
        okType:'button-stable'
    });
  });

  $scope.changedepartamento = function (id) {
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner> Espere por favor...',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });
    $scope.departamento = {};
    $scope.departamentos = [];
    if (id != null) {
      turismoReceptor.departamento(id).then(function (data) {
          $ionicLoading.hide();
          $scope.departamentos = data;
      }, 
      function (error, data) {
        $ionicLoading.hide();
        var alertPopup =$ionicPopup.alert({
            title: '¡Error!',
            template: 'Ha ocurrido un error.',
            okType:'button-stable'
        });
      });
    }
  };

  $scope.changemunicipio = function (id) {
    $scope.encuesta.Municipio = {};
    $scope.municipios = [];
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner> Espere por favor...',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });

    if (id != null) { 
      turismoReceptor.municipio(id).then(function (data) {
        $ionicLoading.hide();
        $scope.municipios = data;
      }, 
      function (error, data) {
        $ionicLoading.hide();
        var alertPopup =$ionicPopup.alert({
            title: '¡Error!',
            template: 'Ha ocurrido un error.',
            okType:'button-stable'
        });
      });
    }
  };

  $scope.changemunicipiocolombia = function (id) {
    $scope.encuesta.Destino = "";
    $scope.municipios_colombia = [];
    if (id != null) { 
      turismoReceptor.municipio(id).then(function (data) {
        $ionicLoading.hide();
        $scope.municipios_colombia = data;
      }, 
      function (error, data) {
        $ionicLoading.hide();
        var alertPopup =$ionicPopup.alert({
            title: '¡Error!',
            template: 'Ha ocurrido un error.',
            okType:'button-stable'
        });
      });
    }
  };

  $scope.otro = function () {
    if ($scope.encuesta.Otro == "") {
      $scope.encuesta.Motivo = null;
    } else {
      $scope.encuesta.Motivo = 18;
    }
  };

  $scope.cambiomotivo = function () {
    if ($scope.encuesta.Motivo != 18) {
      $scope.encuesta.Otro = "";  
    }
  };

  $scope.guardar=function () {
    

    if (!$scope.forms.DatosForm.$valid) {
       ionicToast.show("Hay errores en el formulario corrigelo",'middle', false, 5000);
       return;
    }

    if($filter('date')($scope.encuesta.fechaAplicacion, 'yyyy-MM-dd') <  $filter('date')($scope.encuesta.Llegada, 'yyyy-MM-dd')){
      ionicToast.show("La fecha de aplicacion no puede ser menor a la fecha de llegada",'middle', false, 5000);
      $ionicScrollDelegate.scrollTop(true);
      return;
    }
    $scope.encuesta.fechaAplicacion=$filter('date')($scope.encuesta.fechaAplicacion, 'yyyy-MM-dd HH:mm');
    $scope.encuesta.Llegada=$filter('date')($scope.encuesta.Llegada, 'yyyy-MM-dd');
    $scope.encuesta.Salida=$filter('date')($scope.encuesta.Salida, 'yyyy-MM-dd');
    $scope.encuesta.id = $stateParams.id;
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner> Espere por favor...',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });

    turismoReceptor.guardareditardatos($scope.encuesta).then(function (data) {
      $ionicLoading.hide();
      if (data.success == true) {
        ionicToast.show("Se realizó la operación exitosamente",'top', false, 5000);
        if (data.terminada == 1) {
          $location.path("/app/encuestas/");
        } else {
          $location.path("/app/estancia/"+$stateParams.id);
        }
      } else {
        $ionicScrollDelegate.scrollTop(true);
        ionicToast.show("Hay errores en el formulario corrigelo",'middle', false, 5000);
        $scope.errores = data.errores;
      }
    }, 
    function (error, data) {
      $ionicLoading.hide();
      var alertPopup =$ionicPopup.alert({
        title: '¡Error!',
        template: 'Ha ocurrido un error. Intenta nuevamente',
        okType:'button-stable'
      });
    });
  };  
})

.controller('estanciaController', function($scope, turismoReceptor, $ionicLoading, $ionicPopup, ionicToast, $ionicScrollDelegate, $state, $filter, $location, $stateParams, factories, $rootScope) {

  $scope.encuesta = {};
  $scope.encuesta.ActividadesRelizadas=[];
  $scope.encuesta.Estancias = [];
  $scope.forms={};
  $scope.id=$stateParams.id;

  if(localStorage.getItem("loader_receptor")!=null){
    $rootScope.loader_receptor=JSON.parse(localStorage.getItem("loader_receptor"));
  }else{
    $rootScope.loader_receptor={};
  }

  $ionicLoading.show({
    template: '<ion-spinner></ion-spinner> Espere por favor...',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });

  turismoReceptor.cargardatosseccionestancia($stateParams.id).then(function (data) {
    $ionicLoading.hide();
    if(!$rootScope.loader_receptor.estancia){
        $rootScope.loader_receptor.estancia=data;
        localStorage.setItem("loader_receptor",JSON.stringify($rootScope.loader_receptor));
    }
    
    $scope.Datos = data.Enlaces;
    if(data.encuesta != undefined){
      $scope.encuesta = data.encuesta; 
      $scope.encuesta.Estancias.forEach(function(_this) {
        
        if(!_this.municipio){_this.municipio=factories.findSelect(_this.Municipio,$scope.Datos.Municipios)}
        if(!_this.alojamiento){_this.alojamiento=factories.findSelect(_this.Alojamiento,$scope.Datos.Alojamientos)}


      });
      if (data.encuesta.Estancias == null) {
        $scope.agregar();
      }
    }
    $scope.encuesta.Id = $scope.id;
  }, 
  function (error, data) {
    $ionicLoading.hide();
    var alertPopup =$ionicPopup.alert({
        title: '¡Error!',
        template: 'Ha ocurrido un error.',
        okType:'button-stable'
    });
  });

  $scope.agregar = function () {
    $scope.estancia = new Object();
        $scope.ide = $scope.ide + 1;
        $scope.estancia.ide = $scope.ide;
        $scope.estancia.Municipio = null;
        $scope.estancia.Noches = null;
        $scope.estancia.Alojamiento = null;
        if ($scope.encuesta.Estancias != null) {
            $scope.encuesta.Estancias.push($scope.estancia);

        } else {
            $scope.encuesta.Estancias = [];
            $scope.encuesta.Principal = -1;
            $scope.encuesta.Estancias.push($scope.estancia);

        }   
  };

  $scope.quitar = function (es) {
    if (es.Municipio == $scope.encuesta.Principal) {
      $scope.encuesta.Principal = null;
    }
    $scope.encuesta.Estancias.splice($scope.encuesta.Estancias.indexOf(es), 1);
  };

  $scope.toggleSelection = function (item, $event) {
    var dataValue = angular.element($event.target).attr("disabled");;
    if(dataValue!=="disabled"){

	    var idx = factories.index_of(item.id, $scope.encuesta.ActividadesRelizadas);
	    
	    if (idx > -1) {
	      $scope.encuesta.ActividadesRelizadas.splice(idx, 1);
	    }else {
	      $scope.encuesta.ActividadesRelizadas.push(item);
	    }	   
	  }else{
	   	return;
	  } 
  };

  $scope.toggleSelection2 = function (id, Respuestas) {

    var idx = Respuestas.indexOf(id);
    
    if (idx > -1) {
      Respuestas.splice(idx, 1);
    }
    else {
      Respuestas.push(id);
    }
  };

  $scope.cambioActividadesRealizadas = function (actividad) {
    actividad.Respuestas = [];
    actividad.otro = undefined;
    var resultado = $filter('filter')($scope.encuesta.ActividadesRelizadas, {'id':18}, true);
    if(resultado.length > 0){
        $scope.encuesta.ActividadesRelizadas = [resultado[0]];    
    }   
  };

  $scope.validarContenido = function(id,opcion){
    if(opcion.Respuestas != undefined){
      if(opcion.Respuestas.indexOf(id) != -1){
        return true;
      }    
    }
    return false;
  };

  $scope.validarOtro = function(id,opcion){    
    if(opcion.otro != undefined && opcion.otro != ''){
      if(opcion.Respuestas.indexOf(id) == -1){
        opcion.Respuestas.push(id);
      }
    } 
  };

  $scope.validarRequeridoOtroActividad = function(){
    if($scope.encuesta.ActividadesRelizadas != undefined){
      var resultado = $filter('filter')($scope.encuesta.ActividadesRelizadas, {'id':19}, true);
      if(resultado.length > 0){
        return true;   
      }    
    }
    return false;
  }

  $scope.validarOtroActividad = function(activ){
    if(activ.otroActividad != undefined && activ.otroActividad != '' && $scope.encuesta.ActividadesRelizadas != undefined){
      var resultado = $filter('filter')($scope.encuesta.ActividadesRelizadas, {'id':19}, true);
      if(resultado.length == 0){
        var seleccion = $filter('filter')($scope.Datos.Actividadesrelizadas, {'id':19}, true);
        $scope.encuesta.ActividadesRelizadas.push(seleccion[0]);    
      }
    }
  };

  $scope.Validar = function () {
    if($scope.encuesta.ActividadesRelizadas.length == 0){
      return true;
    }
    for(var i = 0; i < $scope.encuesta.ActividadesRelizadas.length; i++){
      if($scope.encuesta.ActividadesRelizadas[i].opciones.length > 0 && ($scope.encuesta.ActividadesRelizadas[i].Respuestas.length == 0||$scope.encuesta.ActividadesRelizadas[i].Respuestas==undefined) ){
        return true;
      }
    }    
    return false;
  };

  $scope.cambioselectmunicipio = function (es) {
    for (i = 0; i < $scope.encuesta.Estancias.length; i++) {
      if ($scope.encuesta.Estancias[i] != es) {
        if ($scope.encuesta.Estancias[i].Municipio == es.Municipio) {
          es.Municipio = null;
        }
      }
    }
  };

  $scope.cambionoches = function (es) {
    if (es.Noches == 0) {
      es.Alojamiento = 15;
    }
  };

  $scope.cambioselectalojamiento = function (es) {
    if (es.Noches == 0) {
      es.Alojamiento = 15;
    } else {
      if(es.Alojamiento == 15){
        es.Alojamiento = null;
      }
    }
  };

  $scope.guardar = function () {
    if (!$scope.forms.EstanciaForm.$valid || $scope.Validar()) {
      ionicToast.show("Complete los campos del formulario",'middle', false, 2000);
      return
    }
      
    $scope.errores = null
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner> Espere por favor...',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });

    turismoReceptor.crearestancia($scope.encuesta).then(function (data) {
      $ionicLoading.hide();
      if (data.success == true) {
        ionicToast.show("Se realizó la operación exitosamente",'top', false, 5000);
        $location.path("/app/transporte/"+$scope.encuesta.Id);
        
      } else {
        $ionicScrollDelegate.scrollTop(true);
        ionicToast.show("Hay errores en el formulario corrigelo",'middle', false, 5000);
        $scope.errores = data.errores;
      }
    }, 
    function (error, data) {
      $ionicLoading.hide();
      var alertPopup =$ionicPopup.alert({
        title: '¡Error!',
        template: 'Ha ocurrido un error. Intenta nuevamente',
        okType:'button-stable'
      });
    });  
  };

  $scope.checked=function(id, objeto) {
    let i=0;
    for(i=0; i<objeto.length; i++){
      if(id==objeto[i]){
        return true;
      }
    }
    return false;
  };

  $scope.checked_object_id=function(id, objeto) {
    let i=0;
    for(i=0; i<objeto.length; i++){
      if(id==objeto[i].id){
        return true;
      }
    }
    return false;
  };
})

.controller('transporteController', function($scope, turismoReceptor, $ionicLoading, $ionicPopup, ionicToast, $ionicScrollDelegate, $state, $filter, $location, $stateParams, $rootScope) {
  $scope.transporte = {};
  $scope.forms={};
  $scope.id=$stateParams.id;

  if(localStorage.getItem("loader_receptor")!=null){
    $rootScope.loader_receptor=JSON.parse(localStorage.getItem("loader_receptor"));
  }else{
    $rootScope.loader_receptor={};
  }

  $ionicLoading.show({
    template: '<ion-spinner></ion-spinner> Espere por favor...',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });

  turismoReceptor.cargardatostransporte($stateParams.id).then(function (data) {
    $ionicLoading.hide();
    if(!$rootScope.loader_receptor.transporte){
        $rootScope.loader_receptor.transporte=data;
        localStorage.setItem("loader_receptor",JSON.stringify($rootScope.loader_receptor));
    }
    
    $scope.transportes = data.transporte_llegar;
    $scope.lugares = data.lugares;
    $scope.transporte.Id = $scope.id;
      
    if (data.mover != null && data.llegar != null) {
      $scope.transporte.Llegar = data.llegar;
      $scope.transporte.Mover = data.mover;
      $scope.transporte.otroLlegar = data.otroLlegar;
      $scope.transporte.otroMover = data.otroMover;
      $scope.transporte.Alquiler = data.opcion_lugar;
      $scope.transporte.Empresa = data.empresa;
      $scope.transporte.Calificacion = data.calificacion;
    }   
  }, 
  function (error, data) {
    $ionicLoading.hide();
    var alertPopup =$ionicPopup.alert({
        title: '¡Error!',
        template: 'Ha ocurrido un error.',
        okType:'button-stable'
    });
  });

  $scope.guardar = function () {

    if (!$scope.forms.transForm.$valid) {
      ionicToast.show("Complete los campos del formulario",'middle', false, 2000);
      return;
    }

    $scope.errores = null

    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner> Espere por favor...',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });

    turismoReceptor.guardarsecciontransporte($scope.transporte).then(function (data) {
      $ionicLoading.hide();

      if (data.success == true) {
        ionicToast.show("Se realizó la operación exitosamente",'top', false, 5000);
        $location.path("/app/grupo/"+$scope.id);
        
      } else {
        $ionicScrollDelegate.scrollTop(true);
        ionicToast.show("Hay errores en el formulario corrigelo",'middle', false, 5000);
        $scope.errores = data.errores;
      }
    }, 
    function (error, data) {
      $ionicLoading.hide();
      var alertPopup =$ionicPopup.alert({
        title: '¡Error!',
        template: 'Ha ocurrido un error. Intenta nuevamente',
        okType:'button-stable'
      });
    });
  };
})

.controller('grupoController', function($scope, turismoReceptor, $ionicLoading, $ionicPopup, ionicToast, $ionicScrollDelegate, $state, $filter, $location, $stateParams, $rootScope) {
	$scope.grupo = {};
	$scope.grupo.Personas=[];
	$scope.forms={};
  $scope.id=$stateParams.id;

  if(localStorage.getItem("loader_receptor")!=null){
    $rootScope.loader_receptor=JSON.parse(localStorage.getItem("loader_receptor"));
  }else{
    $rootScope.loader_receptor={};
  }

  $ionicLoading.show({
    template: '<ion-spinner></ion-spinner> Espere por favor...',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });
	turismoReceptor.cargardatosseccionviaje($stateParams.id).then(function (data) {
    $ionicLoading.hide();
    if(!$rootScope.loader_receptor.grupo){
      $rootScope.loader_receptor.grupo=data;
      localStorage.setItem("loader_receptor",JSON.stringify($rootScope.loader_receptor));
    }
    $scope.viaje_grupos = data.viaje_grupos;
    $scope.grupo.Id = $scope.id;  
    if (data.tam_grupo != null && data.personas != null) {
	    $scope.grupo.Numero = data.tam_grupo;
	    $scope.grupo.Personas = data.personas;
	    $scope.grupo.Otro = data.otro;
	    $scope.grupo.Numero_otros = data.acompaniantes;
    }    
  }, 
  function (error, data) {
    $ionicLoading.hide();
    var alertPopup =$ionicPopup.alert({
        title: '¡Error!',
        template: 'Ha ocurrido un error.',
        okType:'button-stable'
    });
  });

  $scope.buscar = function (list, data) {
    if (list.indexOf(data) !== -1) {
      return true;
    } else {
      return false;
    }
	};

	$scope.verifica = function () {
    if($scope.grupo.Numero < 1 && $scope.grupo.Numero != null){
      $scope.grupo.Personas = [];
      $scope.grupo.Otro = null;
    } else {
      if ($scope.grupo.Numero == 1) {
        $scope.grupo.Personas = [1];
        $scope.grupo.Otro = null;
	    } else {
        var i = $scope.grupo.Personas.indexOf(1);
        if (i != -1) {
          $scope.grupo.Personas.splice(i, 1);
        }
      }
    }
  };

  $scope.verificarOtro = function () {
    var i = $scope.grupo.Personas.indexOf(12);
    if ($scope.grupo.Otro != null && $scope.grupo.Otro != '') {
      if (i == -1) {
        $scope.grupo.Personas.push(12);
      }
	  }
  };

  $scope.vchek = function (id) {
    if (id == 12) {
      var i = $scope.grupo.Personas.indexOf(12);
      if (i !== -1) {
        $scope.grupo.Otro = null;
      }
    }
  };

  $scope.checked=function(id, objeto) {
    let i=0;
    for(i=0; i<objeto.length; i++){
      if(id==objeto[i]){
        return true;
      }
    }
    return false;
  };

  $scope.toggleSelection = function (id , $event) {
    
    var dataValue = angular.element($event.target).attr("disabled");;
    if(dataValue!=="disabled"){
      var idx = $scope.grupo.Personas.indexOf(id);
      if (idx > -1) {
        $scope.grupo.Personas.splice(idx, 1);
      }

      else {
        $scope.grupo.Personas.push(id);
      }
    }else{
      return;
    }
  };

  $scope.guardar = function () {

    if (!$scope.forms.grupoForm.$valid || $scope.grupo.Personas.length == 0) {
  		  ionicToast.show("Complete los campos del formulario",'middle', false, 2000);
        return;
    }

    $ionicLoading.show({
	    template: '<ion-spinner></ion-spinner> Espere por favor...',
	    animation: 'fade-in',
	    showBackdrop: true,
	    maxWidth: 200,
	    showDelay: 0
	  });
    turismoReceptor.guardarseccionviajegrupo($scope.grupo).then(function (data) {
      $ionicLoading.hide();
      if (data.success == true) {
        ionicToast.show("Se realizó la operación exitosamente",'top', false, 5000);
        $location.path("/app/gastos/"+$scope.id);
        
      } else {
        $ionicScrollDelegate.scrollTop(true);
        ionicToast.show("Hay errores en el formulario corrigelo",'middle', false, 5000);
        $scope.errores = data.errores;
      }
    }, 
    function (error, data) {
      $ionicLoading.hide();
      var alertPopup =$ionicPopup.alert({
        title: '¡Error!',
        template: 'Ha ocurrido un error. Intenta nuevamente',
        okType:'button-stable'
      });
    });  
  };
})

.controller('gastosController', function($scope, turismoReceptor, $ionicLoading, $ionicPopup, ionicToast, $ionicScrollDelegate, $state, $filter, $location, $stateParams, factories, $rootScope) {

  $scope.id=$stateParams.id;
  $scope.encuestaReceptor = {};
  $scope.abrirAlquiler = false;
  $scope.abrirTerrestre = false;
  $scope.abrirRopa = false;
  $scope.encuestaReceptor.Municipios=[];
  $scope.encuestaReceptor.ServiciosIncluidos=[];
  $scope.forms={};

  if(localStorage.getItem("loader_receptor")!=null){
    $rootScope.loader_receptor=JSON.parse(localStorage.getItem("loader_receptor"));
  }else{
    $rootScope.loader_receptor={};
  }

  $ionicLoading.show({
    template: '<ion-spinner></ion-spinner> Espere por favor...',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });

  turismoReceptor.infogasto($stateParams.id).then(function (data) {
    $ionicLoading.hide();
    if(!$rootScope.loader_receptor.gastos){
      $rootScope.loader_receptor.gastos=data;
      localStorage.setItem("loader_receptor",JSON.stringify($rootScope.loader_receptor));
    }
    $scope.divisas = data.divisas;
    $scope.financiadores = data.financiadores;
    $scope.municipios = data.municipios;
    $scope.opciones = data.opciones;
    $scope.servicios = data.servicios;
    $scope.tipos = data.tipos;
    $scope.rubros = data.rubros;
    $scope.encuestaReceptor = data.encuesta;

    $scope.encuestaReceptor.divisapaquete=factories.findSelect($scope.encuestaReceptor.DivisaPaquete,data.divisas);
    if(!$scope.encuestaReceptor.ServiciosIncluidos){
      $scope.encuestaReceptor.ServiciosIncluidos=[];
    }

    if(!$scope.encuestaReceptor.Municipios){
      $scope.encuestaReceptor.Municipios=[];
    }else{
      $scope.encuestaReceptor.municipios=factories.findSelectMultiple($scope.encuestaReceptor.Municipios, data.municipios);
    }

    if(!$scope.encuestaReceptor.Financiadores){
      $scope.encuestaReceptor.Financiadores=[];
    }
   
    for(var i = 0; i<$scope.rubros.length;i++){
      $scope.cambiarAlquiler($scope.rubros[i]);

      if($scope.rubros[i].gastos_visitantes[0]){
        $scope.rubros[i].gastos_visitantes[0].divisas_magdalena_obj=factories.findSelect($scope.rubros[i].gastos_visitantes[0].divisas_magdalena,data.divisas)
      }
    }   
  }, 
  function (error, data) {
    $ionicLoading.hide();
    var alertPopup =$ionicPopup.alert({
        title: '¡Error!',
        template: 'Ha ocurrido un error.',
        okType:'button-stable'
    });
  });

  $scope.cambiarAlquiler = function(rub){
        
    if(rub.gastos_visitantes.length==0){
        return;
    }
        
    if( rub.gastos_visitantes[0].personas_cubiertas != null && rub.gastos_visitantes[0].divisas_magdalena!= null && rub.gastos_visitantes[0].cantidad_pagada_magdalena != null){
      switch (rub.id) {
        case 3:
          $scope.abrirTerrestre = true;
          break;
        case 5:
          $scope.abrirAlquiler = true;
          break;
        case 12:
          $scope.abrirRopa = true;
          break;
        default:
        break;
      }
    }
        
    if($scope.abrirTerrestre){
      if( rub.id ==3 && rub.gastos_visitantes[0].personas_cubiertas == null && rub.gastos_visitantes[0].divisas_magdalena == null && rub.gastos_visitantes[0].cantidad_pagada_magdalena==null){
        $scope.abrirTerrestre = false;
      }
    }
    if($scope.abrirAlquiler){
      if( rub.id == 5 && rub.gastos_visitantes[0].personas_cubiertas == null && rub.gastos_visitantes[0].divisas_magdalena == null && rub.gastos_visitantes[0].cantidad_pagada_magdalena==null){
        $scope.abrirAlquiler = false;
      }
    }
    if($scope.abrirRopa){
      if( rub.id == 12 && rub.gastos_visitantes[0].personas_cubiertas == null && rub.gastos_visitantes[0].divisas_magdalena == null && rub.gastos_visitantes[0].cantidad_pagada_magdalena==null){
        $scope.abrirRopa = false;
      }
    }      
  };

  $scope.limpiarPaquete = function(){
    if($scope.encuestaReceptor.ViajoDepartamento == 0){
      var aux = [];
      aux = $scope.encuestaReceptor.Financiadores;
      $scope.encuestaReceptor = {}
      $scope.encuestaReceptor.Financiadores = aux;
      $scope.encuestaReceptor.RealizoGasto = 1;
      $scope.encuestaReceptor.ViajoDepartamento = 0
    }
  };

  $scope.limpiarMunicipios = function(){
    if($scope.encuestaReceptor.IncluyoOtros == 0 ){
      $scope.encuestaReceptor.Municipios = [];
      $scope.encuestaReceptor.municipios = [];
    }
  };

  $scope.municipios_id=function (municipios) {
    $scope.encuestaReceptor.Municipios=[];
    for(var i=0; i<municipios.length; i++){
      $scope.encuestaReceptor.Municipios.push(municipios[i].id);
    }
  };

  $scope.limpiarLocalizacion = function(){
    if($scope.encuestaReceptor.Proveedor != 1 && $scope.encuestaReceptor.LugarAgencia != undefined ){
      $scope.encuestaReceptor.LugarAgencia = undefined;
    }
  };

  $scope.limpiarMatriz = function(){
    if($scope.encuestaReceptor.poderLLenar){
     for(var i = 0; i<$scope.rubros.length;i++){
        if($scope.rubros[i].gastos_visitantes[0] != null){
          $scope.rubros[i].gastos_visitantes[0] = null;
        }
      }
      $scope.abrirTerrestre = false;
      $scope.abrirAlquiler = false;
      $scope.abrirRopa = false; 
    }
  };
    
  $scope.toggleSelection = function (id) {
    var idx = $scope.encuestaReceptor.ServiciosIncluidos.indexOf(id);
    
    if (idx > -1) {
      $scope.encuestaReceptor.ServiciosIncluidos.splice(idx, 1);
    }
    else {
      $scope.encuestaReceptor.ServiciosIncluidos.push(id);
    }
  };

  $scope.toggleSelection2 = function (id) {
    var idx = $scope.encuestaReceptor.Financiadores.indexOf(id);
    
    if (idx > -1) {
      $scope.encuestaReceptor.Financiadores.splice(idx, 1);
    }
    else {
      $scope.encuestaReceptor.Financiadores.push(id);
    }
  };

  $scope.verificarOtro = function () {
        
    var i = $scope.encuestaReceptor.Financiadores.indexOf(11)
    if ($scope.encuestaReceptor.Otro != null && $scope.encuestaReceptor.Otro != '') {
      if (i == -1) {
        $scope.encuestaReceptor.Financiadores.push(11);
        $scope.bandera = true;
      }
    } else {
      if (i != -1) {
        $scope.encuestaReceptor.Financiadores.splice(i, 1);
        $scope.bandera = false;
      }
    }
  };

  $scope.checked=function(id, objeto) {
    let i=0;
    for(i=0; i<objeto.length; i++){
      if(id==objeto[i]){
        return true;
      }
    }
    return false;
  };

  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };

  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };

  $scope.guardar = function(){
        
    if(!$scope.forms.GastoForm.$valid){
      ionicToast.show("Complete los campos del formulario",'middle', false, 2000);
      return;
    }
    
    if($scope.encuestaReceptor.ViajoDepartamento ==1){    
      if($scope.encuestaReceptor.ServiciosIncluidos.length==0){
        return;   
      }
    }
    
    $scope.encuestaReceptor.Rubros = [];
    for(var i = 0 ;i<$scope.rubros.length;i++){
      if($scope.rubros[i].gastos_visitantes.length>0){
        if($scope.rubros[i].gastos_visitantes[0] != null){
          if((($scope.rubros[i].gastos_visitantes[0].cantidad_pagada_magdalena != null && $scope.rubros[i].gastos_visitantes[0].divisas_magdalena != null) && $scope.rubros[i].gastos_visitantes[0].personas_cubiertas != null)|| $scope.rubros[i].gastos_visitantes[0].gastos_asumidos_otros != undefined  ){
            $scope.encuestaReceptor.Rubros.push($scope.rubros[i]);
          }
        }          
      }
    }

    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner> Espere por favor...',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });
    $scope.encuestaReceptor.id = $scope.id
    turismoReceptor.guardargastos($scope.encuestaReceptor).then(function (data) {
      $ionicLoading.hide();
      if (data.success == true) {
        ionicToast.show("Se realizó la operación exitosamente",'top', false, 5000);
        $location.path("/app/percepcion/"+$scope.id);        
      } else {
        $ionicScrollDelegate.scrollTop(true);
        ionicToast.show("Hay errores en el formulario corrigelo",'middle', false, 5000);
        $scope.errores = data.errores;
      }
    }, 
    function (error, data) {
      $ionicLoading.hide();
      var alertPopup =$ionicPopup.alert({
        title: '¡Error!',
        template: 'Ha ocurrido un error. Intenta nuevamente',
        okType:'button-stable'
      });
    });      
  }
})

.controller('percepcionController', function($scope, turismoReceptor, $ionicLoading, $ionicPopup, ionicToast, $ionicScrollDelegate, $state, $filter, $location, $stateParams, factories, $rootScope) {
  $scope.id=$stateParams.id;
  $scope.bandera = false;
  $scope.estadoEncuesta = null;
  $scope.calificacion = {'Elementos': [] };
  $scope.cal = {};
  $scope.calificacion.Evaluacion = [];
  $scope.forms={}
  $scope.aspectos = {'Items': [],'radios': {}};
  if(localStorage.getItem("loader_receptor")!=null){
    $rootScope.loader_receptor=JSON.parse(localStorage.getItem("loader_receptor"));
  }else{
    $rootScope.loader_receptor={};
  }
  $ionicLoading.show({
    template: '<ion-spinner></ion-spinner> Espere por favor...',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });

  turismoReceptor.cargardatospercepcion($stateParams.id).then(function (data) {
    $ionicLoading.hide();
    if(!$rootScope.loader_receptor.percepcion){
      $rootScope.loader_receptor.percepcion=data;
      localStorage.setItem("loader_receptor",JSON.stringify($rootScope.loader_receptor));
    }
    $scope.aspectos = $scope.convertirObjeto(data.percepcion);
    $scope.elementos = data.elementos;
    $scope.veces = data.veces;
    $scope.actividades = data.actividades;
          
    if (data.respuestaElementos != undefined && data.valoracion == null) {
      if(data.respuestaElementos.length == 0){
        $scope.estadoEncuesta = 0;    
      }
    } else {
      $scope.calificacion.Alojamiento = data.alojamiento;
        
      if($scope.calificacion.Infra == 1){
        document.getElementById("infraestructuraSi").getElementsByTagName( 'input' )[0].checked = true;
      }else{
        document.getElementById("infraestructuraNo").getElementsByTagName( 'input' )[0].checked= true;
      }
      $scope.calificacion.Restaurante = data.restaurante;
      $scope.calificacion.Elementos = data.respuestaElementos;
      $scope.calificacion.Recomendaciones = data.valoracion.Recomendacion;
      $scope.calificacion.Calificacion = data.valoracion.Calificacion;
      $scope.calificacion.Volveria = data.valoracion.Volveria;
      $scope.calificacion.Recomienda = data.valoracion.Recomienda;
      $scope.calificacion.VecesVisitadas = data.valoracion.Veces;
      $scope.calificacion.OtroElementos = data.otroElemento;
      $scope.calificacion.Flora = data.flora;
      $scope.calificacion.Sostenibilidad = data.sost;
      $scope.estadoEncuesta = 1;
      if (data.restaurante == -1) {
        $scope.calificacion.Restaurante = 0;
      }
      if (data.alojamiento == -1) {
        $scope.calificacion.Alojamiento = 0;
      }
      if (data.OtroElemento != null) {
        $scope.calificacion.OtroElementos = data.OtroElemento;
      }
    }
  }, 
  function (error, data) {
    $ionicLoading.hide();
    var alertPopup =$ionicPopup.alert({
        title: '¡Error!',
        template: 'Ha ocurrido un error.',
        okType:'button-stable'
    });
  });

  $scope.convertirObjeto = function(arreglo){
    if(arreglo != undefined){
      for(var i = 0; i < arreglo.length; i++){
        for(var j = 0; j < arreglo[i].items_evaluars.length; j++){
          if(arreglo[i].items_evaluars[j].calificacions.length > 0){
            arreglo[i].items_evaluars[j].radios = {
              Id : arreglo[i].items_evaluars[j].calificacions[0].item_evaluar_id,
              Valor : arreglo[i].items_evaluars[j].calificacions[0].calificacion
            };    
          }
        }
      }    
    }
    return arreglo;
  };

  $scope.limpiar = function (control,inicio,fin) {
    if (control == 0) {
      for (var i = 0; i < $scope.aspectos.length; i++) {
        for (var j = 0; j < $scope.aspectos[i].items_evaluars.length; j++) {    
          if ($scope.aspectos[i].items_evaluars[j].radios!=null) {
            for (var k = inicio; k <= fin; k++) {
              if ($scope.aspectos[i].items_evaluars[j].radios.Id == k) {
                $scope.aspectos[i].items_evaluars[j].radios = null;
                break;
              }
            }
          }
        }
      }
    }
  };

  $scope.checkedRadio = function (id, obj, selected) {

    if ($scope.estadoEncuesta == 1) {
      if (obj == selected) {
        if(document.getElementById(id)){
          document.getElementById(id).getElementsByTagName( 'input' )[0].checked=true;
        }
      }
    }
  };

  $scope.limpiarFila = function(it, selected){
    for (var i = 0; i < $scope.aspectos.length; i++) {
      for (var j = 0; j < $scope.aspectos[i].items_evaluars.length; j++) {
        if ($scope.aspectos[i].items_evaluars[j].radios != null) {
          if ($scope.aspectos[i].items_evaluars[j].radios.Id == it) {
            $scope.aspectos[i].items_evaluars[j].radios = null;

            if(document.getElementById(selected)){
              document.getElementById(selected).getElementsByTagName( 'input' )[0].checked=true;
            }
            break;
          } 
        }
      }
    }
  };

  $scope.toggleSelection = function (item, $event) {

    var dataValue = angular.element($event.target).attr("disabled");;
    if(dataValue!=="disabled"){

      var idx = $scope.calificacion.Elementos.indexOf(item);
      
      if (idx > -1) {
        $scope.calificacion.Elementos.splice(idx, 1);
      }else {
        $scope.calificacion.Elementos.push(item);
      } 

    }else{
      return;
    } 
  };

  $scope.verificarOtro = function () {
        
    var i = $scope.calificacion.Elementos.indexOf(12)
    if ($scope.calificacion.OtroElementos != null && $scope.calificacion.OtroElementos != '') {
      if (i == -1) {
        $scope.calificacion.Elementos.push(12);
        $scope.bandera = true;
      }
    } else {
      if (i !== -1) {
        $scope.calificacion.Elementos.splice(i, 1);
        $scope.bandera = false;
      }
    }
  };

  $scope.checked=function(id, objeto) {
    let i=0;
    for(i=0; i<objeto.length; i++){
      if(id==objeto[i]){
        return true;
      }
    }
    return false;
  };

  $scope.guardar = function () {

    if(!$scope.forms.PercepcionForm.$valid){
      ionicToast.show("Complete los campos del formulario",'middle', false, 2000);
      return;
    }

    $scope.calificacion.Evaluacion = [];
    for (var i = 0; i < $scope.aspectos.length; i++) {
      for (var j = 0; j < $scope.aspectos[i].items_evaluars.length; j++) {
        if ($scope.aspectos[i].items_evaluars[j].radios!=null) {
          $scope.calificacion.Evaluacion.push($scope.aspectos[i].items_evaluars[j].radios);
        }
      }
    }
    
    $scope.calificacion.Id = $scope.id;

    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner> Espere por favor...',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });
    

    turismoReceptor.guardarseccionpercepcion($scope.calificacion).then(function (data) {
      $ionicLoading.hide();
      if (data.success == true) {
        ionicToast.show("Se realizó la operación exitosamente",'top', false, 5000);
        $location.path("/app/enteran/"+$scope.id);        
      } else {
        $ionicScrollDelegate.scrollTop(true);
        ionicToast.show("Hay errores en el formulario corrigelo",'middle', false, 5000);
        $scope.errores = data.errores;
      }
    }, 
    function (error, data) {
      $ionicLoading.hide();
      var alertPopup =$ionicPopup.alert({
        title: '¡Error!',
        template: 'Ha ocurrido un error. Intenta nuevamente',
        okType:'button-stable'
      });
    });
  };
})

.controller('enteranController', function($scope, turismoReceptor, $ionicLoading, $ionicPopup, ionicToast, $ionicScrollDelegate, $state, $filter, $location, $stateParams, factories, $rootScope) {
  $scope.enteran = {'FuentesDurante': [],'FuentesAntes': [],'Redes':[]};
  $scope.control = {};
  $scope.errores = null;
  $scope.err = null;
  $scope.forms={};
  $scope.id=$stateParams.id;
  if(localStorage.getItem("loader_receptor")!=null){
    $rootScope.loader_receptor=JSON.parse(localStorage.getItem("loader_receptor"));
  }else{
    $rootScope.loader_receptor={};
  }
  $ionicLoading.show({
    template: '<ion-spinner></ion-spinner> Espere por favor...',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });
  turismoReceptor.cargardatosseccioninformacion($stateParams.id).then(function (data) {
    $ionicLoading.hide();
    $scope.fuentesAntes = data.fuentesAntes;
    $scope.fuentesDurante = data.fuentesDurante;
    $scope.redes = data.redes;
    $scope.enteran.Id = $scope.id;
    if(!$rootScope.loader_receptor.enteran){
      $rootScope.loader_receptor.enteran=data;
      localStorage.setItem("loader_receptor",JSON.stringify($rootScope.loader_receptor));
    }
    if (data.invitacion_correo != null) {
      $scope.enteran.FuentesAntes = data.fuentes_antes;
      $scope.enteran.FuentesDurante = data.fuentes_durante;
      $scope.enteran.Redes = data.compar_redes;
      $scope.enteran.OtroFuenteAntes = data.OtroFuenteAntes;
      $scope.enteran.OtroFuenteDurante = data.OtroFuenteDurante;
      $scope.enteran.Correo = data.invitacion_correo;
      $scope.enteran.Invitacion = data.invitacion;
      $scope.enteran.NombreFacebook = data.facebook;
      $scope.enteran.NombreTwitter = data.twitter;
      $scope.enteran.facilidad = data.facilidad;
      $scope.enteran.conoce_marca = data.conoce_marca;
      $scope.enteran.acepta_autorizacion = data.acepta_autorizacion;
      $scope.enteran.acepta_tratamiento = data.acepta_tratamiento;
      $scope.enteran.otroRed = data.otroRed;
    }  
  }, 
  function (error, data) {
    $ionicLoading.hide();
    var alertPopup =$ionicPopup.alert({
        title: '¡Error!',
        template: 'Ha ocurrido un error.',
        okType:'button-stable'
    });
  });

  $scope.validar = function (sw, id) {
    if (sw == 0) {
      if (id == 13) {
        var i = $scope.enteran.FuentesDurante.indexOf(13);
        if (i == -1) {
          $scope.enteran.OtroFuenteDurante = null;
        }
      } else {
        if (id == 14) {
          var i = $scope.enteran.FuentesDurante.indexOf(14);
          if (i != -1) {
            $scope.enteran.OtroFuenteDurante = null;
          }
        }
      }
    } else if (sw == 1) {
      if (id == 1) {
        var i = $scope.enteran.Redes.indexOf(1);
        if (i == -1) {
          $scope.enteran.otroRed = null;
        }
      }
    } else {
      if (id == 14) {
        var i = $scope.enteran.FuentesAntes.indexOf(14);
        if (i != -1) {
          $scope.enteran.OtroFuenteAntes = null;
        }
      }
    }
  };

  $scope.toggleSelection = function (item) {
    var idx = $scope.enteran.FuentesAntes.indexOf(item);
    if (idx > -1) {
      $scope.enteran.FuentesAntes.splice(idx, 1);
    }else {
      $scope.enteran.FuentesAntes.push(item);
    } 
  };

  $scope.checked=function(id, objeto) {
    let i=0;
    for(i=0; i<objeto.length; i++){
      if(id==objeto[i]){
        return true;
      }
    }
    return false;
  };

  $scope.validarOtro = function (sw) {
    if (sw == 0) {
      var i = $scope.enteran.FuentesAntes.indexOf(14);
      if ($scope.enteran.OtroFuenteAntes != null && $scope.enteran.OtroFuenteAntes != '') {
        if (i == -1) {
          $scope.enteran.FuentesAntes.push(14);
        }
      } 
    } else if(sw == 1) {
      var i = $scope.enteran.FuentesDurante.indexOf(14);
      if ($scope.enteran.OtroFuenteDurante != null && $scope.enteran.OtroFuenteDurante != '') {
        if (i == -1) {
          $scope.enteran.FuentesDurante.push(14);
        }
      } 
    } else if(sw == 2) {
      var i = $scope.enteran.Redes.indexOf(12);
      if ($scope.enteran.otroRed != null && $scope.enteran.otroRed != '') {
        if (i == -1) {
          $scope.enteran.Redes.push(12);
        }
      } 
    }
  };
  
  $scope.toggleSelection2 = function (item,$event) {
    var dataValue = angular.element($event.target).attr("disabled");;
    if(dataValue!=="disabled"){
      var idx = $scope.enteran.FuentesDurante.indexOf(item);

      if (idx > -1) {
        $scope.enteran.FuentesDurante.splice(idx, 1);
      }else {
        if(item==13){
          $scope.enteran.FuentesDurante=[];
        }
        $scope.enteran.FuentesDurante.push(item);
      }
    }else{
      return;
    }
  };

  $scope.toggleSelection3 = function (item,$event) {
    var dataValue = angular.element($event.target).attr("disabled");;
    if(dataValue!=="disabled"){
      var idx = $scope.enteran.Redes.indexOf(item);

      if (idx > -1) {
        $scope.enteran.Redes.splice(idx, 1);
      }else {
        if(item==1){
          $scope.enteran.Redes=[];
        }
        $scope.enteran.Redes.push(item);
      }
    }else{
      return;
    }
  };

  $scope.guardar = function () {

    if (!$scope.forms.inForm.$valid) {       
      ionicToast.show("Complete los campos del formulario",'middle', false, 2000);
      return;
    }

    if ($scope.enteran.FuentesAntes.length == 0 || $scope.enteran.FuentesDurante.length == 0 || $scope.enteran.Redes.length == 0 || $scope.enteran.Correo == null) {
      ionicToast.show("Complete los campos del formulario",'middle', false, 2000);
      return;
    }

    if ($scope.enteran.FuentesAntes.indexOf(14) == -1) {
        $scope.enteran.OtroFuenteAntes = null;
    }

    if ($scope.enteran.FuentesDurante.indexOf(14) == -1) {
        $scope.enteran.OtroFuenteDurante = null;
    }

    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner> Espere por favor...',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });
    $scope.enteran.Id=$scope.id;
   
    turismoReceptor.guardarseccioninformacion($scope.enteran).then(function (data) {
      $ionicLoading.hide();
      if (data.success == true) {
        ionicToast.show("Se realizó la totalidad de la encuesta "+ data.codigo +" exitosamente",'top', false, 5000);
        $location.path("/app/encuestas");        
      } else {
        $ionicScrollDelegate.scrollTop(true);
        ionicToast.show("Hay errores en el formulario corrigelo",'middle', false, 5000);
        $scope.errores = data.errores;
      }
    }, 
    function (error, data) {
      $ionicLoading.hide();
      var alertPopup =$ionicPopup.alert({
        title: '¡Error!',
        template: 'Ha ocurrido un error. Intenta nuevamente',
        okType:'button-stable'
      });
    });    
  }; 
})