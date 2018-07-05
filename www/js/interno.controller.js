angular.module('interno.controllers', [])

.controller('temporadasController', function($scope, $stateParams, $ionicModal, $ionicPopup, turismoInterno,$ionicLoading) {
  $ionicLoading.show({
    template: '<ion-spinner></ion-spinner> Espere por favor...',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });

  turismoInterno.getTemporadas().then(function (data) {
      $ionicLoading.hide();
      $scope.temporadas=data.temporadas;
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

.controller('verTemporadaController', function($scope, $stateParams, $ionicLoading, turismoInterno, $ionicPopup) {
  $scope.active_content = 'hogar';
  $scope.setActiveContent = function(active_content){
    $scope.active_content = active_content;
  }

  $ionicLoading.show({
    template: '<ion-spinner></ion-spinner> Espere por favor...',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });

  turismoInterno.cargardatos($stateParams.id).then(function (data) {
      $ionicLoading.hide();
      $scope.datos=data.temporada;
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

.controller('hogarController', function($scope, $stateParams, $ionicModal,  $ionicLoading, turismoInterno, $ionicPopup, ionicToast, $filter, $ionicScrollDelegate, $location) {
  $scope.encuesta = {};
  $scope.encuesta.integrantes = [];
  $scope.integrante = {};
  $scope.forms = {};

  $ionicModal.fromTemplateUrl('templates/modalIntegrante.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalCreate = modal;
  });

  $scope.selectables = [{"option":1,"value":"Si"},{"option":0, "value":"No"}];

  $ionicLoading.show({
    template: '<ion-spinner></ion-spinner> Espere por favor...',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });

  turismoInterno.datoshogar().then(function (data) {
      $ionicLoading.hide();
      $scope.datos=data; 
  }, 
  function (error, data) {
    $ionicLoading.hide();
    var alertPopup =$ionicPopup.alert({
        title: '¡Error!',
        template: 'Ha ocurrido un error.',
        okType:'button-stable'
    });
  });

  $scope.selectBarrios=function(id) {

    if(id){
      var data={};
      data.id=id;
      $ionicLoading.show({
        template: '<ion-spinner></ion-spinner> Espere por favor...',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });

      turismoInterno.barrios(data).then(function (data) {
          $ionicLoading.hide();
          $scope.barrios=data.barrios;
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

  $scope.integranteAdd=function(indice) {
    $scope.modalCreate.show();
    if (indice == null) {
        $scope.aux = -1;
        $scope.integrante = {};
    } else {
        $scope.aux = indice;
        $scope.integrante =  $scope.encuesta.integrantes[indice];
        console.log($scope.integrante); 
    }
  }

  $scope.deleteIntegrante = function (indice) {
    $scope.encuesta.integrantes.splice(indice,1);
  }

  $scope.guardarIntegrante = function () {
   
    if ($scope.forms.IntegranteForm.$valid==true) {
      $scope.modalCreate.hide();
      if ($scope.aux == -1) {
        $scope.integrante.jefe_hogar = false;
        $scope.encuesta.integrantes.push($scope.integrante)
        $scope.forms.IntegranteForm.$setPristine();
        $scope.forms.IntegranteForm.$setUntouched();
        $scope.integrante = {}
       
      } else {
        $scope.encuesta.integrantes[$scope.aux] = $scope.integrante;
        $scope.forms.IntegranteForm.$setPristine();
        $scope.forms.IntegranteForm.$setUntouched();
      }
    }else{
      ionicToast.show('Complete el formulario', 'middle', false, 5000);
    }
  }
  
  $scope.save=function(){ 
    if($scope.encuesta.integrantes.length<1){
        ionicToast.show("Debe ingresar por lo menos un integrante",'middle', false, 5000);
        return;
    }

    if ($scope.forms.DatosForm.$valid) {
      $ionicLoading.show({
        template: '<ion-spinner></ion-spinner> Espere por favor...',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });

      $scope.encuesta.Temporada_id=$stateParams.id;
      $scope.encuesta.Fecha_aplicacion=$filter('date')($scope.encuesta.Fecha_aplicacion, 'yyyy-MM-dd HH:mm');
      
      turismoInterno.guardarhogar($scope.encuesta).then(function (data) {
          $ionicLoading.hide();
          $scope.data=data;

          if (data.success) {
            ionicToast.show("Se ha guardado el hogar exitosamente",'middle', false, 2000);
            $location.path('/app/editHogar/'+data.id);


          }else{
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

    }else {
        ionicToast.show("Formulario incompleto corrige los errores",'middle', false, 5000)
    }
  }
})

.controller('editHogarController', function($scope, $stateParams, $ionicModal,  $ionicLoading, turismoInterno, $ionicPopup, ionicToast, $filter, $ionicScrollDelegate, $state) {
  $scope.encuesta = {}
  $scope.encuesta.integrantes = []
  $scope.integrante = {}
  $scope.forms = {};
  $scope.encuesta.municipio_id={};
  $scope.id=$stateParams.id;
  $ionicModal.fromTemplateUrl('templates/modalIntegrante.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalCreate = modal;
  });

  $scope.selectables = [{"option":1,"value":"Si"},{"option":0, "value":"No"}];

  $ionicLoading.show({
    template: '<ion-spinner></ion-spinner> Espere por favor...',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });

  turismoInterno.datoseditar($stateParams).then(function (data) {
      $ionicLoading.hide();
      $scope.datos = data.datos
      $scope.barrios = data.barrios
      $scope.municipio_id = findSelect(data.encuesta.edificacione.barrio.municipio_id, data.datos.municipios);
      $scope.barrio = findSelect(data.encuesta.edificacione.barrio_id, data.barrios);
      $scope.estrato = findSelect(data.encuesta.edificacione.estrato_id, data.datos.estratos);
      $scope.encuestador = findSelect(data.encuesta.digitadores_id, data.datos.encuestadores);
      $scope.encuestadores=data.datos.encuestadores
      $scope.estados=data.datos.estados
      $scope.encuesta = data.encuesta;
      $scope.encuesta.Fecha_aplicacion = data.encuesta.fecha_realizacion
      $scope.encuesta.Barrio=String(data.encuesta.edificacione.barrio_id)
      $scope.encuesta.Estrato=String(data.encuesta.edificacione.estrato_id)
      $scope.encuesta.Direccion=data.encuesta.edificacione.direccion
      $scope.encuesta.Telefono=Number(data.encuesta.telefono)
      $scope.encuesta.Encuestador=String(data.encuesta.digitadores_id)
      $scope.encuesta.Nombre_Entrevistado=data.encuesta.edificacione.nombre_entrevistado
      $scope.encuesta.Celular_Entrevistado=Number(data.encuesta.edificacione.telefono_entrevistado)
      $scope.encuesta.Email_Entrevistado=data.encuesta.edificacione.email_entrevistado

      $scope.encuesta.integrantes= cambiar($scope.encuesta.personas)
  }, 
  function (error, data) {
    $ionicLoading.hide();
    var alertPopup =$ionicPopup.alert({
        title: '¡Error!',
        template: 'Ha ocurrido un error.',
        okType:'button-stable'
    });
  });

  function cambiar(array){
    for(var i=0;i<array.length;i++){
      array[i].Nombre=String(array[i].nombre);
      array[i].Sexo=String(array[i].sexo);
      array[i].Edad=array[i].edad;
      array[i].Celular=String(array[i].celular);
      array[i].Email=String(array[i].email);
      array[i].Viaje=(array[i].es_viajero)?"1":"0";
      array[i].Nivel_Educacion=String(array[i].nivel_educacion);
      array[i].jefe_hogar=array[i].jefe_hogar;
      array[i].Civil=String(array[i].estado_civil_id);
      array[i].Ocupacion=String(array[i].ocupacion_id);
      array[i].Vive=(array[i].es_residente)?"1":"0";
            
      if(array[i].motivo_no_viajes.length>0){
        array[i].Motivo=String(array[i].motivo_no_viajes[0].motivo_no_viaje_id);
      }
             
      if(array[i].otraocupacion != null){           
        array[i].Otra_ocupacion=String(array[i].otraocupacion.otro);
      }
                   
    }
    return array;    
  }

  $scope.cambiar = function (index) {

    for (var j = 0; j < $scope.encuesta.integrantes.length; j++) {
        if (j == index) {
            $scope.encuesta.integrantes[j].jefe_hogar = 'true';
        } else {
            $scope.encuesta.integrantes[j].jefe_hogar = 'false';
        }

    }
  }

  function findSelect(id, array_select, option) {
    if(option){
      var result=array_select.find( myObject => myObject.option === id );

    }else{
      var result=array_select.find( myObject => myObject.id === id );
    }

    return result;
  }

  $scope.selectBarrios=function(id) {
    if(id){
      var data={};
      data.id=id;
      $ionicLoading.show({
        template: '<ion-spinner></ion-spinner> Espere por favor...',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });

      turismoInterno.barrios(data).then(function (data) {
          $ionicLoading.hide();
          $scope.barrios=data.barrios;
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

  $scope.integranteAdd=function(indice) {
    $scope.modalCreate.show();
    if (indice == null) {
        $scope.aux = -1;
        $scope.integrante = {};
    } else {
        $scope.aux = indice;
        $scope.integrante =  $scope.encuesta.integrantes[indice];
        $scope.integrante.Sexo=$scope.integrante.sexo;
        if(!$scope.integrante.civil){$scope.integrante.civil=findSelect(parseInt($scope.integrante.Civil), $scope.datos.estados);}
        if(!$scope.integrante.ocupacion){$scope.integrante.ocupacion=findSelect(parseInt($scope.integrante.Ocupacion), $scope.datos.ocupaciones);}
        if(!$scope.integrante.vive){$scope.integrante.vive=findSelect(parseInt($scope.integrante.Vive), $scope.selectables, true);}
        if(!$scope.integrante.nivel_Educacion){$scope.integrante.nivel_Educacion=findSelect(parseInt($scope.integrante.Nivel_Educacion), $scope.datos.niveles);}
        if(!$scope.integrante.viaje){$scope.integrante.viaje=findSelect(parseInt($scope.integrante.Viaje), $scope.selectables, true);}
        if(!$scope.integrante.motivo){$scope.integrante.motivo=findSelect(parseInt($scope.integrante.Motivo), $scope.datos.motivos);} 
    }
  }

  $scope.guardarIntegrante = function () {
   
    if ($scope.forms.IntegranteForm.$valid==true) {
      $scope.modalCreate.hide();
      if ($scope.aux == -1) {
        $scope.integrante.jefe_hogar = 'false';
        $scope.encuesta.integrantes.push($scope.integrante)
        $scope.forms.IntegranteForm.$setPristine();
        $scope.forms.IntegranteForm.$setUntouched();
        $scope.integrante = {}
       
      } else {
        $scope.encuesta.integrantes[$scope.aux] = $scope.integrante;
        $scope.forms.IntegranteForm.$setPristine();
        $scope.forms.IntegranteForm.$setUntouched();
      }
    }else{
      ionicToast.show('Complete el formulario', 'middle', false, 5000);
    }
  }

  $scope.deleteIntegrante = function (indice) {
    $ionicPopup.confirm({
       title: '¿Desea eliminar a la persona seleccionada?',
       template: '¿Seguro que desea hacerlo?', 
       buttons: [
          {text:'No', type: 'button-stable',},
          {
            text:'Si',type: 'button-stable', 
            onTap: function(e) {
              if ($scope.encuesta.integrantes[indice].id != null) {deleted(indice);}
              else{$scope.encuesta.integrantes.splice(indice, 1)}
            }  
          }
        ]
    });
  }

  function deleted(indice){

    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner> Espere por favor...',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });
    var data = {}
    data.id=$scope.encuesta.integrantes[indice].id
    turismoInterno.eliminarpersona(data).then(function (data) {
        $ionicLoading.hide();
        $scope.data=data;

        if (data.success) {
          ionicToast.show("Persona eliminada exitosamente",'middle', false, 2000);
          $location.path('/app/editHogar/'+data.id);


        }else{
        
          ionicToast.show(data.error,'middle', false, 5000);
        
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

  $scope.save=function(){ 
    $scope.encuesta.id=$stateParams.id;
    
    if ($scope.forms.DatosForm.$valid) {
      $ionicLoading.show({
        template: '<ion-spinner></ion-spinner> Espere por favor...',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });

      
      $scope.encuesta.Fecha_aplicacion=$filter('date')($scope.encuesta.Fecha_aplicacion, 'yyyy-MM-dd hh:mm:ss');
      
      turismoInterno.guardareditarhogar($scope.encuesta).then(function (data) {
          $ionicLoading.hide();
          $scope.data=data;

          if (data.success) {
            ionicToast.show("Se ha guardado el hogar exitosamente",'middle', false, 2000);
            $state.reload();


          }else{
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

    }else {
        ionicToast.show("Formulario incompleto corrige los errores",'middle', false, 5000)
    }
  }
})

.controller('viajesRealizadoController', function($scope, $stateParams, $ionicLoading, turismoInterno, $ionicPopup, ionicToast, $ionicScrollDelegate, $state, $filter, $location) {
  $scope.encuesta = {};
  $scope.PrincipalViaje = {};
  $scope.forms= {};
  $scope.encuesta.Personas = [];
  $scope.id=$stateParams.id;
  $scope.ver = false;

  $ionicLoading.show({
    template: '<ion-spinner></ion-spinner> Espere por favor...',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });

  turismoInterno.viajes($stateParams.id).then(function (data) {
      $ionicLoading.hide();
      $scope.Datos = data.Enlaces;
      $scope.Viajes = data.Viajes;
      $scope.PrincipalViaje.id = data.Principal; 
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
    $scope.estancia ={};
     
    if ($scope.encuesta.Estancias != null) {
        $scope.encuesta.Estancias.push($scope.estancia)


    } else {
        $scope.encuesta.Estancias = []
        $scope.encuesta.Principal = -1;
        $scope.encuesta.Estancias.push($scope.estancia)
    }

    $scope.forms.EstanciaForm.$setUntouched();
    $scope.forms.EstanciaForm.$setPristine();
    $scope.forms.EstanciaForm.$submitted = false;
  };

  $scope.quitar = function (es) {
    if (es.Municipio == $scope.encuesta.Principal) {

        $scope.encuesta.Principal = 0;
    }

    $scope.encuesta.Estancias.splice($scope.encuesta.Estancias.indexOf(es), 1)
    $scope.forms.EstanciaForm.$setUntouched();
    $scope.forms.EstanciaForm.$setPristine();
    $scope.forms.EstanciaForm.$submitted=false;
  };

  $scope.cambioselectpais= function (es) {
    es.Departamento = null;
    es.Municipio = null;
    es.municipio = {};
    es.departamento = {};
  };

  $scope.cambioselectdepartamento = function (es) {
    es.Municipio = null;
    es.municipio = {};

  }

  $scope.cambioselectmunicipio = function (es) {
    for (i = 0; i < $scope.encuesta.Estancias.length; i++) {
      if ($scope.encuesta.Estancias[i] != es) {
        if ($scope.encuesta.Estancias[i].Municipio == es.Municipio) {
          es.Municipio = null;
          es.municipio = {};
        }
      }
    }
  }

  $scope.existe = function (k) {
    if ($scope.encuesta.Personas != null) {
      for (i = 0; i < $scope.encuesta.Personas.length; i++){
        if ($scope.encuesta.Personas[i] == k ) {
          return true
        }    
      }
      
      if (k == 2) {
        $scope.encuesta.Numerohogar = 0;
        $scope.TotalD = $scope.Total;
      }

      if(k == 3){  
        $scope.encuesta.NumerohogarSinGasto = 0;
        $scope.TotalG = $scope.Total;
      }

      if (k == 6) {
        $scope.encuesta.Numerotros = 0
        $scope.TotalF = $scope.Total;
      }
    }

    return false
  }

  $scope.toggleSelection = function (id , $event) {
    
    var dataValue = angular.element($event.target).attr("disabled");;
    if(dataValue!=="disabled"){
      var idx = $scope.encuesta.Personas.indexOf(id);
      if (idx > -1) {
        $scope.encuesta.Personas.splice(idx, 1);
      }

      else {
        $scope.encuesta.Personas.push(id);
      }
    }else{
      return;
    }
  };

  $scope.verificaT = function () {
    $scope.TotalF = $scope.Total - ($scope.encuesta.Numerohogar == null ? 0 : $scope.encuesta.Numerohogar ) - ($scope.encuesta.NumerohogarSinGasto == null ? 0 : $scope.encuesta.NumerohogarSinGasto );
    $scope.TotalD = $scope.Total  - ($scope.encuesta.Numerotros == null ? 0 : $scope.encuesta.Numerotros ) - ($scope.encuesta.NumerohogarSinGasto == null ? 0 : $scope.encuesta.NumerohogarSinGasto );
    $scope.TotalG = $scope.Total - ($scope.encuesta.Numerotros == null ? 0 : $scope.encuesta.Numerotros ) - ($scope.encuesta.Numerohogar == null ? 0 : $scope.encuesta.Numerohogar );
  }

  $scope.cancelar = function () {
    $scope.ver = false;
    $scope.encuesta = {};
    $scope.errores = null;
    $scope.error = null;
    $scope.forms.EstanciaForm.$setPristine();
    $scope.forms.EstanciaForm.$setUntouched();
    $scope.forms.EstanciaForm.$submitted = false;                          
  }

  $scope.guardar = function () {
    $scope.encuesta.Inicio=$filter('date')($scope.encuesta.Inicio, 'yyyy-MM-dd');
    $scope.encuesta.Fin=$filter('date')($scope.encuesta.Fin, 'yyyy-MM-dd');

   
    if (!$scope.forms.EstanciaForm.$valid) {
      ionicToast.show("Complete los campos del formulario",'middle', false, 2000);
      return
    }else{
      $ionicLoading.show({
        template: '<ion-spinner></ion-spinner> Espere por favor...',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });

      $scope.errores = null
      if ($scope.encuesta.Id == null){
        $scope.encuesta.Id = $scope.id;
        $scope.encuesta.Crear = true;
      }

      turismoInterno.createviaje($scope.encuesta).then(function (data) {
        $ionicLoading.hide();
        $scope.data=data;
        if (data.success == true) {
          $state.reload();          
        }else{
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
  }

  $scope.editar = function (es) {
    $scope.errores = null;
    $scope.forms.EstanciaForm.$setPristine();
    $scope.forms.EstanciaForm.$setUntouched();
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner> Espere por favor...',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });

    turismoInterno.viaje(es.id).then(function (data) {
      $ionicLoading.hide();
      $scope.edit = es;
      $scope.encuesta = data.encuesta;
      $scope.encuesta.Id = $scope.id;
      $scope.encuesta.Crear = false;
      $scope.encuesta.Idv = es.id;
      if(!$scope.encuesta.motivo){$scope.encuesta.motivo=findSelect(parseInt($scope.encuesta.Motivo), $scope.Datos.Motivos);}

      $scope.encuesta.Estancias.forEach(function(_this) {
        if(!_this.pais){_this.pais=findSelect(_this.Pais,$scope.Datos.Paises)}
        if(!_this.departamento){_this.departamento=findSelect(_this.Departamento,$scope.Datos.Depertamentos)}
        if(!_this.municipio){_this.municipio=findSelect(_this.Municipio,$scope.Datos.Municipios)}

      });  

      if (data.encuesta.Numero != null) {
        $scope.Total = data.encuesta.Numero - 1
      }
      if (data.encuesta.Inicio != null && data.encuesta.Fin != null) {
        fechal = data.encuesta.Inicio.split('-')
        fechas = data.encuesta.Fin.split('-')
        $scope.encuesta.Inicio = new Date(fechal[0], (parseInt(fechal[1]) - 1), fechal[2])
        $scope.encuesta.Fin = new Date(fechas[0], (parseInt(fechas[1]) - 1), fechas[2])

      }
      if (data.encuesta.Estancias == null) {
        $scope.agregar();
      }

      $scope.ver = true;
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

  $scope.eliminar = function (es) {

    $ionicPopup.confirm({
      title: '¿Desea eliminar el viaje?',
      template: '¿Seguro que desea hacerlo?', 
      buttons: [
          {text:'No', type: 'button-stable',},
          {
            text:'Si',type: 'button-stable', 
            onTap: function(e) {
              deleted(es);
            }
          }
        ]
    });
  }

  function deleted(es) {
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner> Espere por favor...',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });
    turismoInterno.eliminarviaje($scope.encuesta).then(function (data) {
      $ionicLoading.hide();
      if (data.success == true) {
        $scope.Viajes.splice($scope.Viajes.indexOf(es), 1);
        ionicToast.show("Se realizó la operación exitosamente",'middle', false, 5000);
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

  $scope.siguiente = function () {
    
    if ($scope.PrincipalViaje.id == null) {
        ionicToast.show("Debe seleccionar un viaje como principal",'middle', false, 5000);        
        return;
    }

    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner> Espere por favor...',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });
   
    if ($scope.encuesta.Id == null) {
        $scope.encuesta.Id = $scope.id;
        $scope.encuesta.Crear = true;
    }
        
    $scope.env = {};
    $scope.env.id = $scope.id; 
    $scope.env.principal = $scope.PrincipalViaje.id;


    turismoInterno.siguienteviaje($scope.env).then(function (data) {
      $ionicLoading.hide();
      if (data.success == true) {
        ionicToast.show("Se realizó la operación exitosamente",'top', false, 5000);
        $location.path("/app/viajePrincipal/"+$scope.env.id+"/"+$scope.env.principal);
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

.controller('viajePrincipalController', function($scope, $stateParams, $ionicLoading, turismoInterno, $ionicPopup, ionicToast, $ionicScrollDelegate, $state, $filter, $location) {
  $scope.forms= {};
  $ionicLoading.show({
    template: '<ion-spinner></ion-spinner> Espere por favor...',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });

  turismoInterno.viajedataprincipal($stateParams.principal).then(function (data) {
      $ionicLoading.hide();
      $scope.Datos = data.Enlaces;
      $scope.encuesta = data.encuesta;
      $scope.encuesta.Id = $stateParams.principal;
      $scope.id = $stateParams.id;
      if(!$scope.encuesta.motivo){$scope.encuesta.motivo=findSelect(parseInt($scope.encuesta.Motivo), $scope.Datos.Motivos);}
      $scope.encuesta.Estancias.forEach(function(_this) {
        if(!_this.pais){_this.pais=findSelect(_this.Pais,$scope.Datos.Paises)}
        if(!_this.departamento){_this.departamento=findSelect(_this.Departamento,$scope.Datos.Depertamentos)}
        if(!_this.municipio){_this.municipio=findSelect(_this.Municipio,$scope.Datos.Municipios)}
        if(!_this.alojamiento){_this.alojamiento=findSelect(_this.Alojamiento,$scope.Datos.Alojamientos)}


      });
      if (data.encuesta.Numero != null) {
           $scope.Total = data.encuesta.Numero - 1
       }
       if (data.encuesta.Inicio != null && data.encuesta.Fin != null) {
           fechal = data.encuesta.Inicio.split('-')
           fechas = data.encuesta.Fin.split('-')
           $scope.encuesta.Inicio = new Date(fechal[0], (parseInt(fechal[1]) - 1), fechal[2])
           $scope.encuesta.Fin = new Date(fechas[0], (parseInt(fechas[1]) - 1), fechas[2])

       }
       if (data.encuesta.Estancias == null) {
           $scope.agregar();
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

  $scope.cambioselectpais= function (es) {
    es.Departamento = null;
    es.Municipio = null;
    es.municipio = {};
    es.departamento = {};
  };

  $scope.cambioselectdepartamento = function (es) {
    es.Municipio = null;
    es.municipio = {};
  };

  $scope.cambioselectmunicipio = function (es) {
    for (i = 0; i < $scope.encuesta.Estancias.length; i++) {
      if ($scope.encuesta.Estancias[i] != es) {
          if ($scope.encuesta.Estancias[i].Municipio == es.Municipio) {
              es.Municipio = null;
              es.municipio = {};
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
      if (es.Alojamiento == 15) {
        es.Alojamiento = null;
      }
    }
  }

  function findSelect(id, array_select, option) {
    if(option){
      var result=array_select.find( myObject => myObject.option === id );
    }else{
      var result=array_select.find( myObject => myObject.id === id );
    }
    return result;
  }

  $scope.verifica = function () {
    $scope.Total = $scope.encuesta.Numero - 1
    if ($scope.encuesta.Numero > 1 && $scope.encuesta.Numero != null) {
      $scope.encuesta.Personas = []       
    } else {
      if ($scope.encuesta.Numero == 1) {
        $scope.encuesta.Personas = [1]
        $scope.encuesta.Numerohogar = null;
        $scope.encuesta.NumerohogarSinGasto = null;
        $scope.encuesta.Numerotros = null;
      } else {
        var i = $scope.encuesta.Personas.indexOf(1)
        if (i != -1) {
            $scope.encuesta.Personas.splice(i, 1)
        }
      }
    }
  }

  $scope.toggleSelection = function (id , $event) {
    
    var dataValue = angular.element($event.target).attr("disabled");;
    if(dataValue!=="disabled"){
      var idx = $scope.encuesta.Personas.indexOf(id);
      if (idx > -1) {
        $scope.encuesta.Personas.splice(idx, 1);
      }

      else {
        $scope.encuesta.Personas.push(id);
      }
    }else{
      return;
    }
  }

  $scope.existe = function (k) {
    if ($scope.encuesta.Personas != null) {
      for (i = 0; i < $scope.encuesta.Personas.length; i++){
        if ($scope.encuesta.Personas[i] == k ) {
          return true;
          console.log(true);
        }
      }
      if (k == 2) {
          $scope.encuesta.Numerohogar = 0;
          $scope.TotalD = $scope.Total
      }
      if(k == 3){ 
          $scope.encuesta.NumerohogarSinGasto = 0;
          $scope.TotalG = $scope.Total
      }

      if (k == 6) {
          $scope.encuesta.Numerotros = 0
          $scope.TotalF = $scope.Total
      }
    }
    return false;
  }

  $scope.verificaT = function () {
    $scope.TotalF = $scope.Total - ($scope.encuesta.Numerohogar == null ? 0 : $scope.encuesta.Numerohogar ) - ($scope.encuesta.NumerohogarSinGasto == null ? 0 : $scope.encuesta.NumerohogarSinGasto );
    $scope.TotalD = $scope.Total  - ($scope.encuesta.Numerotros == null ? 0 : $scope.encuesta.Numerotros ) - ($scope.encuesta.NumerohogarSinGasto == null ? 0 : $scope.encuesta.NumerohogarSinGasto ); 
    $scope.TotalG = $scope.Total - ($scope.encuesta.Numerotros == null ? 0 : $scope.encuesta.Numerotros ) - ($scope.encuesta.Numerohogar == null ? 0 : $scope.encuesta.Numerohogar );
  }

  $scope.quitar = function (es) {
    if (es.Municipio == $scope.encuesta.Principal) {

        $scope.encuesta.Principal = 0;
    }

    $scope.encuesta.Estancias.splice($scope.encuesta.Estancias.indexOf(es), 1)
    $scope.forms.EstanciaForm.$setUntouched();
    $scope.forms.EstanciaForm.$setPristine();
    $scope.forms.EstanciaForm.$submitted=false;
  };

  $scope.agregar = function () {
    $scope.estancia ={};
     
    if ($scope.encuesta.Estancias != null) {
        $scope.encuesta.Estancias.push($scope.estancia)


    } else {
        $scope.encuesta.Estancias = []
        $scope.encuesta.Principal = -1;
        $scope.encuesta.Estancias.push($scope.estancia)
    }

    $scope.forms.EstanciaForm.$setUntouched();
    $scope.forms.EstanciaForm.$setPristine();
    $scope.forms.EstanciaForm.$submitted = false;
  };

  $scope.siguiente = function () {
    $scope.encuesta.Inicio=$filter('date')($scope.encuesta.Inicio, 'yyyy-MM-dd');
    $scope.encuesta.Fin=$filter('date')($scope.encuesta.Fin, 'yyyy-MM-dd');

    if (!$scope.forms.EstanciaForm.$valid) {
       ionicToast.show("Hay errores en el formulario corrigelo",'middle', false, 5000);
       return
    }

    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner> Espere por favor...',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });

    turismoInterno.createviajeprincipal($scope.encuesta).then(function (data) {
      $ionicLoading.hide();
      if (data.success == true) {
        ionicToast.show("Se realizó la operación exitosamente",'top', false, 5000);
        if (data.Sw == 1) {
          $location.path("/app/actividades/"+$scope.encuesta.Id);
        } else {
           //window.location.href = "/turismointerno/transporte/" + $scope.encuesta.Id;
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

.controller('actividadesController', function($scope, $stateParams, $ionicLoading, turismoInterno, $ionicPopup, ionicToast, $ionicScrollDelegate, $state, $filter, $location) {
  $scope.forms= {};
  $scope.encuesta = {}
  $scope.MensajeAlojamiento = false
  $ionicLoading.show({
    template: '<ion-spinner></ion-spinner> Espere por favor...',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });
  turismoInterno.actividades($stateParams.id).then(function (data) {
      $ionicLoading.hide();
      $scope.Datos = data.Enlaces;
      $scope.encuesta = data.encuesta;
      $scope.encuesta.Id = $stateParams.id;; 
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