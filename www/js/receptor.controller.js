angular.module('receptor.controllers', [])

.controller('encuestasController', function($scope, turismoReceptor, $ionicLoading, $ionicPopup) {
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

.controller('generalController', function($scope, turismoReceptor, $ionicLoading, $ionicPopup, ionicToast, $ionicScrollDelegate, $state, $filter, $location) {
  
  $scope.encuesta = {};
  $scope.forms={};


  $ionicLoading.show({
    template: '<ion-spinner></ion-spinner> Espere por favor...',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });

  turismoReceptor.informaciondatoscrear().then(function (data) {
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

.controller('editGeneralController', function($scope, turismoReceptor, $ionicLoading, $ionicPopup, ionicToast, $ionicScrollDelegate, $state, $filter, $location, $stateParams, factories) {
  $scope.encuesta = {};
  $scope.forms={};
  $scope.departamentod = {};

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
      $scope.encuesta.destino = factories.findSelect(data.visitante.Destino, data.municipiosd);


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
       return
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

.controller('estanciaController', function($scope, turismoReceptor, $ionicLoading, $ionicPopup, ionicToast, $ionicScrollDelegate, $state, $filter, $location, $stateParams, factories) {

  $scope.encuesta = {};
  $scope.encuesta.ActividadesRelizadas=[];
  $scope.encuesta.Estancias = [];
  $scope.forms={};
  $scope.id=$stateParams.id;

  $ionicLoading.show({
    template: '<ion-spinner></ion-spinner> Espere por favor...',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });

  turismoReceptor.cargardatosseccionestancia($stateParams.id).then(function (data) {
    $ionicLoading.hide();
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

.controller('transporteController', function($scope, turismoReceptor, $ionicLoading, $ionicPopup, ionicToast, $ionicScrollDelegate, $state, $filter, $location, $stateParams) {
  $scope.transporte = {};
  $scope.forms={};
  $scope.id=$stateParams.id;

  $ionicLoading.show({
    template: '<ion-spinner></ion-spinner> Espere por favor...',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });

  turismoReceptor.cargardatostransporte($stateParams.id).then(function (data) {
    $ionicLoading.hide();
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

.controller('grupoController', function($scope, turismoReceptor, $ionicLoading, $ionicPopup, ionicToast, $ionicScrollDelegate, $state, $filter, $location, $stateParams) {
	$scope.grupo = {};
	$scope.grupo.Personas=[];
	$scope.forms={};
  $scope.id=$stateParams.id;

  $ionicLoading.show({
    template: '<ion-spinner></ion-spinner> Espere por favor...',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });
	turismoReceptor.cargardatosseccionviaje($stateParams.id).then(function (data) {
    $ionicLoading.hide();
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

.controller('gastosController', function($scope, turismoReceptor, $ionicLoading, $ionicPopup, ionicToast, $ionicScrollDelegate, $state, $filter, $location, $stateParams) {

  $scope.id=$stateParams.id;
  $scope.encuestaReceptor = {};
  $scope.abrirAlquiler = false;
  $scope.abrirTerrestre = false;
  $scope.abrirRopa = false;
  $scope.encuestaReceptor.Municipios=[];
  $scope.encuestaReceptor.ServiciosIncluidos=[];

  $ionicLoading.show({
    template: '<ion-spinner></ion-spinner> Espere por favor...',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });

  turismoReceptor.infogasto($stateParams.id).then(function (data) {
    $ionicLoading.hide();
    $scope.divisas = data.divisas;
    $scope.financiadores = data.financiadores;
    $scope.municipios = data.municipios;
    $scope.opciones = data.opciones;
    $scope.servicios = data.servicios;
    $scope.tipos = data.tipos;
    $scope.rubros = data.rubros;
    $scope.encuestaReceptor = data.encuesta;
    if(!$scope.encuestaReceptor.ServiciosIncluidos){
      $scope.encuestaReceptor.ServiciosIncluidos=[];
    }
    if(!$scope.encuestaReceptor.Municipios){
      $scope.encuestaReceptor.Municipios=[];
    }
    if(!$scope.encuestaReceptor.Financiadores){
      $scope.encuestaReceptor.Financiadores=[];
    }
    for(var i = 0; i<$scope.rubros.length;i++){
        $scope.cambiarAlquiler($scope.rubros[i]);
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
    console.log($scope.encuestaReceptor.Financiadores);
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

})