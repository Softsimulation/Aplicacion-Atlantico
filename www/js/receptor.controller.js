angular.module('receptor.controllers', [])

.controller('encuestasController', function($scope, turismoReceptor, $ionicLoading, $ionicPopup) {
  
  $scope.filter = [
                    {'option':'Todas las encuestas', 'value':''}, 
                    {'option':'Calculadas', 'value':'calculadas'},
                    {'option':'Sin Calcular', 'value': 'sincalcular'}
                  ];

  $scope.campos = [
                    {'option':'Cualquier campo', 'value':''},
                    {'option':'Fecha de aplicación', 'value':'fecha'},
                    {'option':'Fecha de llegada', 'value':'fechallegada'},

                  ]

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
  }, 
  function (error, data) {
    $ionicLoading.hide();
    var alertPopup =$ionicPopup.alert({
        title: '¡Error!',
        template: 'Ha ocurrido un error.',
        okType:'button-stable'
    });
  });
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
  }

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
  }

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
  } 

  $scope.otro = function () {
    if ($scope.encuesta.Otro == "") {
      $scope.encuesta.Motivo = null;
    } else {
      $scope.encuesta.Motivo = 18;
    }
  }

  $scope.cambiomotivo = function () {
    if ($scope.encuesta.Motivo != 18) {
      $scope.encuesta.Otro = "";  
    }
  }

  $scope.guardar=function () {
    

    if (!$scope.forms.DatosForm.$valid) {
       ionicToast.show("Hay errores en el formulario corrigelo",'middle', false, 5000);
       return
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
  } 
})

.controller('editGeneralController', function($scope, turismoReceptor, $ionicLoading, $ionicPopup, ionicToast, $ionicScrollDelegate, $state, $filter, $location, $stateParams) {
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
      $scope.pais_residencia =findSelect(data.visitante.Pais, data.datos.paises);
      $scope.departamento = findSelect(data.visitante.Departamento, data.departamentosr);
      $scope.departamentod = findSelect(data.visitante.DepartamentoDestino, data.datos.departamentos);
      fechal = data.visitante.Llegada.split('-');
      fechas = data.visitante.Salida.split('-');
      $scope.encuesta.Llegada = new Date(fechal[0], (parseInt(fechal[1]) - 1), fechal[2]);
      $scope.encuesta.Salida = new Date(fechas[0], (parseInt(fechas[1]) - 1), fechas[2]);
      
      $scope.encuesta.encuestador = findSelect(data.visitante.Encuestador, data.datos.encuestadores);
      $scope.encuesta.Aplicacion = findSelect(data.visitante.aplicacion, data.datos.lugares_aplicacion);
      $scope.encuesta.nacimiento = findSelect(data.visitante.Nacimiento, data.datos.lugar_nacimiento);
      $scope.encuesta.pais_nacimiento = findSelect(data.visitante.Pais_Nacimiento, data.datos.paises);
      $scope.encuesta.municipio = findSelect(data.visitante.Municipio, data.municipiosr);
      $scope.encuesta.destino = findSelect(data.visitante.Destino, data.municipiosd);


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
  }

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
  }

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
  } 

  $scope.otro = function () {
    if ($scope.encuesta.Otro == "") {
      $scope.encuesta.Motivo = null;
    } else {
      $scope.encuesta.Motivo = 18;
    }
  }

  $scope.cambiomotivo = function () {
    if ($scope.encuesta.Motivo != 18) {
      $scope.encuesta.Otro = "";  
    }
  }

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
  } 

  function findSelect(id, array_select, option) {
    if(option){
      var result=array_select.find( myObject => myObject.option === id );
    }else{
      var result=array_select.find( myObject => myObject.id === id );
    }
    return result;
  }
})

.controller('estanciaController', function($scope, turismoReceptor, $ionicLoading, $ionicPopup, ionicToast, $ionicScrollDelegate, $state, $filter, $location, $stateParams) {

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
        
        if(!_this.municipio){_this.municipio=findSelect(_this.Municipio,$scope.Datos.Municipios)}
        if(!_this.alojamiento){_this.alojamiento=findSelect(_this.Alojamiento,$scope.Datos.Alojamientos)}


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

  $scope.toggleSelection = function (item) {
    
    var idx = $scope.encuesta.ActividadesRelizadas.indexOf(item);
    if (idx > -1) {
      $scope.encuesta.ActividadesRelizadas.splice(idx, 1);
    }

    else {
      $scope.encuesta.ActividadesRelizadas.push(item);
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

  $scope.checked_object_id=function(obj, objeto) {
    let i=0;
    for(i=0; i<objeto.length; i++){
      if(obj.id==objeto[i].id){
        return true;
      }
    }
    return false;
  };

  function findSelect(id, array_select, option) {
    if(option){
      var result=array_select.find( myObject => myObject.option === id );
    }else{
      var result=array_select.find( myObject => myObject.id === id );
    }
    return result;
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
