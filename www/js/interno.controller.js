angular.module('interno.controllers', [])

.controller('temporadasController', function($scope, $stateParams, $ionicModal, $ionicPopup, turismoInterno,$ionicLoading, $ionicHistory) {
  
  $ionicHistory.clearHistory();
  $ionicHistory.clearCache();
  $scope.currentPage = 0;
  $scope.pageSize = 5;  
  $scope.encuestas = []; 
  $scope.temporadas = [];
  $ionicLoading.show({
    template: '<ion-spinner></ion-spinner> Espere por favor...',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });

  turismoInterno.getTemporadas().then(function (data) {
      $ionicLoading.hide();
      $scope.temporadas = data.temporadas;
  }, 
  function (error, data) {
    $ionicLoading.hide();
    let alertPopup =$ionicPopup.alert({
        title: '¡Error!',
        template: 'Ha ocurrido un error.',
        okType:'button-stable'
    });
  });

  $scope.len=function (a) {
    return Object.keys(a).length - 1;
  };

  $scope.numberOfPages=function(encuestas){
    return Math.ceil(encuestas.length/$scope.pageSize);                
  };
})

.controller('verTemporadaController', function($scope, $stateParams, $ionicLoading, turismoInterno, $ionicPopup) {
  $scope.active_content = 'hogar';
  $scope.currentPage = 0;
  $scope.pageSize = 5; 
  $scope.datos = [];
  $scope.datos.Hogares = [];
  $scope.encuestas = []; 


  $scope.setActiveContent = function(active_content){
    $scope.active_content = active_content;
  };

  $scope.len=function (a) {
    return Object.keys(a).length - 1;
  };

  $scope.numberOfPages=function(encuestas){
    return Math.ceil(encuestas.length/$scope.pageSize);                
  };

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
      $scope.encuestas = data.encuestas;

  }, 
  function (error, data) {
    $ionicLoading.hide();
    let alertPopup =$ionicPopup.alert({
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
    let alertPopup =$ionicPopup.alert({
        title: '¡Error!',
        template: 'Ha ocurrido un error.',
        okType:'button-stable'
    });
  });

  $scope.selectBarrios=function(id) {

    if(id){
      let data={};
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
        let alertPopup =$ionicPopup.alert({
            title: '¡Error!',
            template: 'Ha ocurrido un error.',
            okType:'button-stable'
        });
      });
    }
  };

  $scope.integranteAdd=function(indice) {
    $scope.modalCreate.show();
    if (indice == null) {
        $scope.aux = -1;
        $scope.integrante = {};
    } else {
        $scope.aux = indice;
        $scope.integrante =  $scope.encuesta.integrantes[indice];
    }
  };

  $scope.deleteIntegrante = function (indice) {
    $scope.encuesta.integrantes.splice(indice,1);
  };

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
  };
  
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
        let alertPopup =$ionicPopup.alert({
            title: '¡Error!',
            template: 'Ha ocurrido un error. Intenta nuevamente',
            okType:'button-stable'
        });
      });

    }else {
        ionicToast.show("Formulario incompleto corrige los errores",'middle', false, 5000)
    }
  };
})

.controller('editHogarController', function($scope, $stateParams, $ionicModal,  $ionicLoading, turismoInterno, $ionicPopup, ionicToast, $filter, $ionicScrollDelegate, $state, factories) {
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
      $scope.municipio_id = factories.findSelect(data.encuesta.edificacione.barrio.municipio_id, data.datos.municipios);
      $scope.barrio = factories.findSelect(data.encuesta.edificacione.barrio_id, data.barrios);
      $scope.estrato = factories.findSelect(data.encuesta.edificacione.estrato_id, data.datos.estratos);
      $scope.encuestador = factories.findSelect(data.encuesta.digitadores_id, data.datos.encuestadores);
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
    let alertPopup =$ionicPopup.alert({
        title: '¡Error!',
        template: 'Ha ocurrido un error.',
        okType:'button-stable'
    });
  });

  function cambiar(array){
    for(let i=0;i<array.length;i++){
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

    for (let j = 0; j < $scope.encuesta.integrantes.length; j++) {
        if (j == index) {
            $scope.encuesta.integrantes[j].jefe_hogar = 'true';
        } else {
            $scope.encuesta.integrantes[j].jefe_hogar = 'false';
        }

    }
  }

  $scope.selectBarrios=function(id) {
    if(id){
      let data={};
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
        let alertPopup =$ionicPopup.alert({
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
        if(!$scope.integrante.civil){$scope.integrante.civil=factories.findSelect(parseInt($scope.integrante.Civil), $scope.datos.estados);}
        if(!$scope.integrante.ocupacion){$scope.integrante.ocupacion=factories.findSelect(parseInt($scope.integrante.Ocupacion), $scope.datos.ocupaciones);}
        if(!$scope.integrante.vive){$scope.integrante.vive=factories.findSelect(parseInt($scope.integrante.Vive), $scope.selectables, true);}
        if(!$scope.integrante.nivel_Educacion){$scope.integrante.nivel_Educacion=factories.findSelect(parseInt($scope.integrante.Nivel_Educacion), $scope.datos.niveles);}
        if(!$scope.integrante.viaje){$scope.integrante.viaje=factories.findSelect(parseInt($scope.integrante.Viaje), $scope.selectables, true);}
        if(!$scope.integrante.motivo){$scope.integrante.motivo=factories.findSelect(parseInt($scope.integrante.Motivo), $scope.datos.motivos);} 
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
    let data = {}
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
      let alertPopup =$ionicPopup.alert({
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
        let alertPopup =$ionicPopup.alert({
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

.controller('viajesRealizadoController', function($scope, $stateParams, $ionicLoading, turismoInterno, $ionicPopup, ionicToast, $ionicScrollDelegate, $state, $filter, $location, factories) {
  $scope.encuesta = {};
  $scope.PrincipalViaje = {};
  $scope.forms= {};
  $scope.encuesta.Personas = [];
  $scope.id=$stateParams.id;
  $scope.ver = false;
  $scope.env = {};
  $scope.env.id = $scope.id; 
  $scope.hogar = $stateParams.hogar;
  $scope.env.principal = $scope.PrincipalViaje.id;

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
      $scope.hogar = data.hogar.id;

  }, 
  function (error, data) {
    $ionicLoading.hide();
    let alertPopup =$ionicPopup.alert({
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
  };

  $scope.toggleSelection = function (id , $event) {
    
    let dataValue = angular.element($event.target).attr("disabled");;
    if(dataValue!=="disabled"){
      let idx = $scope.encuesta.Personas.indexOf(id);
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
  };

  $scope.cancelar = function () {
    $scope.ver = false;
    $scope.encuesta = {};
    $scope.errores = null;
    $scope.error = null;
    $scope.forms.EstanciaForm.$setPristine();
    $scope.forms.EstanciaForm.$setUntouched();
    $scope.forms.EstanciaForm.$submitted = false;                          
  };

  $scope.guardar = function () {
    $scope.encuesta.Inicio=$filter('date')($scope.encuesta.Inicio, 'yyyy-MM-dd');
    $scope.encuesta.Fin=$filter('date')($scope.encuesta.Fin, 'yyyy-MM-dd');

    if (!$scope.forms.EstanciaForm.$valid) {
      ionicToast.show("Complete los campos del formulario",'middle', false, 2000);
      return
    }

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
      let alertPopup =$ionicPopup.alert({
        title: '¡Error!',
        template: 'Ha ocurrido un error. Intenta nuevamente',
        okType:'button-stable'
      });
    });
    
  };

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
      if(!$scope.encuesta.motivo){$scope.encuesta.motivo=factories.findSelect(parseInt($scope.encuesta.Motivo), $scope.Datos.Motivos);}

      $scope.encuesta.Estancias.forEach(function(_this) {
        if(!_this.pais){_this.pais=factories.findSelect(_this.Pais,$scope.Datos.Paises)}
        if(!_this.departamento){_this.departamento=factories.findSelect(_this.Departamento,$scope.Datos.Depertamentos)}
        if(!_this.municipio){_this.municipio=factories.findSelect(_this.Municipio,$scope.Datos.Municipios)}

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
      let alertPopup =$ionicPopup.alert({
        title: '¡Error!',
        template: 'Ha ocurrido un error. Intenta nuevamente',
        okType:'button-stable'
      });
    });  
  };

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
  };

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
      let alertPopup =$ionicPopup.alert({
        title: '¡Error!',
        template: 'Ha ocurrido un error. Intenta nuevamente',
        okType:'button-stable'
      });
    });
  };

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
        $location.path("/app/viajePrincipal/"+$scope.env.principal);
      } else {
        $ionicScrollDelegate.scrollTop(true);
        ionicToast.show("Hay errores en el formulario corrigelo",'middle', false, 5000);
        $scope.errores = data.errores;
      }
    }, 
    function (error, data) {
      $ionicLoading.hide();
      let alertPopup =$ionicPopup.alert({
        title: '¡Error!',
        template: 'Ha ocurrido un error. Intenta nuevamente',
        okType:'button-stable'
      });
    });
  };
})

.controller('viajePrincipalController', function($scope, $stateParams, $ionicLoading, turismoInterno, $ionicPopup, ionicToast, $ionicScrollDelegate, $state, $filter, $location, factories) {
  $scope.forms= {};
  $ionicLoading.show({
    template: '<ion-spinner></ion-spinner> Espere por favor...',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });

  turismoInterno.viajedataprincipal($stateParams.id).then(function (data) {
      $ionicLoading.hide();
      $scope.Datos = data.Enlaces;
      $scope.encuesta = data.encuesta;
      $scope.encuesta.Id = $stateParams.id;
      

      //$scope.id = $stateParams.id;
      if(!$scope.encuesta.motivo){$scope.encuesta.motivo=factories.findSelect(parseInt($scope.encuesta.Motivo), $scope.Datos.Motivos);}
      $scope.encuesta.Estancias.forEach(function(_this) {
        if(!_this.pais){_this.pais=factories.findSelect(_this.Pais,$scope.Datos.Paises)}
        if(!_this.departamento){_this.departamento=factories.findSelect(_this.Departamento,$scope.Datos.Depertamentos)}
        if(!_this.municipio){_this.municipio=factories.findSelect(_this.Municipio,$scope.Datos.Municipios)}
        if(!_this.alojamiento){_this.alojamiento=factories.findSelect(_this.Alojamiento,$scope.Datos.Alojamientos)}


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
    let alertPopup =$ionicPopup.alert({
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
  };
  
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
        let i = $scope.encuesta.Personas.indexOf(1)
        if (i != -1) {
            $scope.encuesta.Personas.splice(i, 1)
        }
      }
    }
  };

  $scope.toggleSelection = function (id , $event) {
    
    let dataValue = angular.element($event.target).attr("disabled");;
    if(dataValue!=="disabled"){
      let idx = $scope.encuesta.Personas.indexOf(id);
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

  $scope.existe = function (k) {
    if ($scope.encuesta.Personas != null) {
      for (i = 0; i < $scope.encuesta.Personas.length; i++){
        if ($scope.encuesta.Personas[i] == k ) {
          return true;
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
  };

  $scope.verificaT = function () {
    $scope.TotalF = $scope.Total - ($scope.encuesta.Numerohogar == null ? 0 : $scope.encuesta.Numerohogar ) - ($scope.encuesta.NumerohogarSinGasto == null ? 0 : $scope.encuesta.NumerohogarSinGasto );
    $scope.TotalD = $scope.Total  - ($scope.encuesta.Numerotros == null ? 0 : $scope.encuesta.Numerotros ) - ($scope.encuesta.NumerohogarSinGasto == null ? 0 : $scope.encuesta.NumerohogarSinGasto ); 
    $scope.TotalG = $scope.Total - ($scope.encuesta.Numerotros == null ? 0 : $scope.encuesta.Numerotros ) - ($scope.encuesta.Numerohogar == null ? 0 : $scope.encuesta.Numerohogar );
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
           $location.path("/app/transporteInterno/"+$scope.encuesta.Id);
        }
      } else {
        $ionicScrollDelegate.scrollTop(true);
        ionicToast.show("Hay errores en el formulario corrigelo",'middle', false, 5000);
        $scope.errores = data.errores;
      }
    }, 
    function (error, data) {
      $ionicLoading.hide();
      let alertPopup =$ionicPopup.alert({
        title: '¡Error!',
        template: 'Ha ocurrido un error. Intenta nuevamente',
        okType:'button-stable'
      });
    });   
  };
})

.controller('actividadesController', function($scope, $stateParams, $ionicLoading, turismoInterno, $ionicPopup, ionicToast, $ionicScrollDelegate, $state, $filter, $location, factories) {
  $scope.forms= {};
  $scope.encuesta = {}
  $scope.MensajeAlojamiento = false
  $scope.activ=[];
  $scope.encuesta.ActividadesRelizadas=[];
  $scope.encuesta.OpcionesActividades=[];
  $scope.id=$stateParams.id;
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
      $scope.encuesta.Id = $stateParams.id;
  }, 
  function (error, data) {
    $ionicLoading.hide();
    let alertPopup =$ionicPopup.alert({
        title: '¡Error!',
        template: 'Ha ocurrido un error.',
        okType:'button-stable'
    });
  });

  $scope.existeActividad= function(obj){   

    for (let i = 0; i < $scope.encuesta.ActividadesRelizadas.length; i++) {
      if($scope.encuesta.ActividadesRelizadas[i].id == obj){            
        return true;
      }
    }
    return false;
  };

  $scope.toggleSelection = function (item , $event) {
    
    let dataValue = angular.element($event.target).attr("disabled");;
    if(dataValue!=="disabled"){

      let idx = factories.index_of(item.id, $scope.encuesta.ActividadesRelizadas);
      
      if (idx > -1) {
        $scope.encuesta.ActividadesRelizadas.splice(idx, 1);
      }else {
        $scope.encuesta.ActividadesRelizadas.push(item);
      }    
    }else{
      return;
    } 
  };

  $scope.cambioActividadesRealizadas = function (obj) {
    
    for (let i = 0; i < $scope.encuesta.ActividadesRelizadas.length; i++) {
      if($scope.encuesta.ActividadesRelizadas[i].id == 18){
        obj = $scope.encuesta.ActividadesRelizadas[i];
        $scope.encuesta.ActividadesRelizadas = [];
        $scope.encuesta.ActividadesRelizadas.push(obj);
        $scope.encuesta.OpcionesActividades = [];
        $scope.encuesta.SubOpcionesActividades = [];
      }        
    };
      
    for (let i = 0; i < obj.opciones_actividades_realizadas_internos.length; i++) {
      $scope.LimpiarOpcion(obj.opciones_actividades_realizadas_internos[i].id)
    }
  }

  $scope.LimpiarOpcion = function(obj){
   for (let i = 0; i < $scope.encuesta.OpcionesActividades.length; i++) {
      if($scope.encuesta.OpcionesActividades[i].id == obj){
        $scope.encuesta.OpcionesActividades.splice(i,1)
      }
    }
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

  $scope.Actividad = function(obj){     
   for (let i = 0; i < $scope.encuesta.ActividadesRelizadas.length; i++) {
      if($scope.encuesta.ActividadesRelizadas[i].id == obj){  
        return $scope.encuesta.ActividadesRelizadas[i];
      }
    }
    return;
  };

  $scope.toggleSelection2 = function (item) {

    let idx = factories.index_of(item.id, $scope.encuesta.OpcionesActividades);
    if (idx > -1) {
      $scope.encuesta.OpcionesActividades.splice(idx, 1);
    }else {
      $scope.encuesta.OpcionesActividades.push(item);
    }    
  };

  $scope.existeOpcion = function(obj){
    for (let i = 0; i < $scope.encuesta.OpcionesActividades.length; i++) {
      if($scope.encuesta.OpcionesActividades[i].id == obj){
          return true;
      }
    }
    return false;
  };

  $scope.Opcion = function(obj){
    for (let i = 0; i < $scope.encuesta.OpcionesActividades.length; i++) {
      if($scope.encuesta.OpcionesActividades[i].id == obj){
        return $scope.encuesta.OpcionesActividades[i];
      }
    }
    return;
  };

  $scope.requeridoOpciones = function(obj){
    for (let i = 0; i < obj.length; i++) {
      if($scope.existeOpcion(obj[i].id)){
              
        return false;
      }
    }
    return true;
  };

  $scope.Validar = function(){
    if($scope.encuesta.ActividadesRelizadas.length == 0){
      return true
    }
    for (let i = 0; i < $scope.encuesta.ActividadesRelizadas.length; i++) {
      let obj = $scope.encuesta.ActividadesRelizadas[i];
      if(obj.opciones_actividades_realizadas_internos.length > 0){
        if($scope.requeridoOpciones(obj.opciones_actividades_realizadas_internos )){
          return true
        }
        for (let k = 0; k < obj.opciones_actividades_realizadas_internos.length; k++) {
          let obj2 = obj.opciones_actividades_realizadas_internos[k];
            if(obj2.sub_opciones_actividades_realizadas_internos.length > 0){        
              if($scope.requeridoSubOpciones(obj2.sub_opciones_actividades_realizadas_internos)){
                return true
              }
            }
        }
                
      }
    }
    return false;
  };

  $scope.guardar = function () {


    $scope.sw2 = $scope.Validar();
    if (!$scope.forms.EstanciaForm.$valid || $scope.sw2) {
        ionicToast.show("Corrija los errores",'top', false, 5000);
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

    turismoInterno.crearestancia($scope.encuesta).then(function (data) {
      $ionicLoading.hide();
      if (data.success == true) {
        ionicToast.show("Se realizó la operación exitosamente",'top', false, 5000);
        $location.path("/app/transporteInterno/"+$scope.id);
      } else {
        $ionicScrollDelegate.scrollTop(true);
        ionicToast.show("Hay errores en el formulario corrigelo",'middle', false, 5000);
        $scope.errores = data.errores;
      }
    }, 
    function (error, data) {
      $ionicLoading.hide();
      let alertPopup =$ionicPopup.alert({
        title: '¡Error!',
        template: 'Ha ocurrido un error. Intenta nuevamente',
        okType:'button-stable'
      });
    });
  }
})

.controller('transporteInternoController', function($scope, $stateParams, $ionicLoading, turismoInterno, $ionicPopup, ionicToast, $ionicScrollDelegate, $state, $filter, $location, factories) {
  $scope.forms = {}
  $scope.id=$stateParams.id;
  $scope.forms= {};
  $scope.transporte={};


  $ionicLoading.show({
    template: '<ion-spinner></ion-spinner> Espere por favor...',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });

  turismoInterno.cargartransporte($stateParams.id).then(function (data) {
      $ionicLoading.hide();
      $scope.transportes = data.transportes;
      $scope.medios=data.medios;
      $scope.transporte.id = $stateParams.id;
      $scope.transporte.Mover = data.tipo_transporte;
      $scope.transporte.Medio = data.medio_transporte;
      $scope.transporte.Tipo_otro=data.otrotipo;
      $scope.transporte.Medio_otro=data.otromedio;
  }, 
  function (error, data) {
    $ionicLoading.hide();
    let alertPopup =$ionicPopup.alert({
        title: '¡Error!',
        template: 'Ha ocurrido un error.',
        okType:'button-stable'
    });
  });

  $scope.cambio=function(){ 
    if($scope.transporte.Mover!=10){          
      $scope.transporte.Tipo_otro="";   
    }      
  };
    
  $scope.cambio2=function(){
   if($scope.transporte.Medio!=8){
      $scope.transporte.Medio_otro="";
    }
  };

  $scope.guardar = function () {
    if (!$scope.forms.transForm.$valid) {
      ionicToast.show("Corrija los errores",'middle', false, 5000);
      return
    }

    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner> Espere por favor...',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });

    turismoInterno.guardartransporte($scope.transporte).then(function (data) {
      $ionicLoading.hide();
      if (data.success == true) {
        ionicToast.show("Se realizó la operación exitosamente",'top', false, 5000);
        $location.path("/app/gastosInterno/"+$scope.id);
      } else {
        $ionicScrollDelegate.scrollTop(true);
        ionicToast.show("Hay errores en el formulario corrigelo",'middle', false, 5000);
        $scope.errores = data.errores;
      }
    }, 
    function (error, data) {
      $ionicLoading.hide();
      let alertPopup =$ionicPopup.alert({
        title: '¡Error!',
        template: 'Ha ocurrido un error. Intenta nuevamente',
        okType:'button-stable'
      });
    });    
  };
})

.controller('gastosInternoController', function($scope, $stateParams, $ionicLoading, turismoInterno, $ionicPopup, ionicToast, $ionicScrollDelegate, $state, $filter, $location, factories) {
  $scope.porcentajeGastoRubros = [];
  $scope.id=$stateParams.id;
  $scope.forms={};
  $scope.encuesta={};
  $scope.encuesta.serviciosPaquetes=[];
  $scope.encuesta.financiadores=[];

  $ionicLoading.show({
    template: '<ion-spinner></ion-spinner> Espere por favor...',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });

  turismoInterno.datagastos($stateParams.id).then(function (data) {
    $ionicLoading.hide();
    $scope.encuesta = data.encuesta;
    $scope.divisas = data.divisas;
    $scope.financiadores = data.financiadores;
    $scope.opcionesLugares = data.opcionesLugares;
    $scope.serviciosPaquetes = data.serviciosPaquetes;
    $scope.TipoProveedorPaquete = data.TipoProveedorPaquete;
    $scope.verNombreEmpresa  =  data.encuesta.empresaTransporte ? true : false;
    if($scope.encuesta.viajeExcursion && $scope.encuesta.viajeExcursion.divisas_id){
      $scope.encuesta.viajeExcursion.Divisas = factories.findSelect($scope.encuesta.viajeExcursion.divisas_id, $scope.divisas);
    }            
    for(let i=0; i< $scope.encuesta.rubros.length ;i++){
      if($scope.encuesta.rubros[i] && $scope.encuesta.rubros[i].viajes_gastos_internos[0]){
        $scope.encuesta.rubros[i].viajes_gastos_internos[0].divisa_obj=factories.findSelect($scope.encuesta.rubros[i].viajes_gastos_internos[0].divisa_id,data.divisas)
      }
      if($scope.encuesta.rubros[i].id==8){
        $scope.rubroAlquilerVehiculo = $scope.encuesta.rubros[i];
        $scope.changeRubros($scope.encuesta.rubros[i]); break;
      }
    }
            
    for(let i=0; i< $scope.encuesta.gastosServicosPaquetes.length ;i++){               
      for (let j = 0; j < $scope.serviciosPaquetes.length; j++){
        if ($scope.encuesta.gastosServicosPaquetes[i].servicio_paquete_id == $scope.serviciosPaquetes[j].id) { 
          $scope.encuesta.gastosServicosPaquetes[i].nombre = $scope.serviciosPaquetes[j].nombre;
          break;
        }
      }              
    }
            
    for(let i=0; i< $scope.encuesta.porcentajeGastoRubros.length ;i++){            
      for (let j = 0; j < $scope.encuesta.rubros.length; j++){
        if ($scope.encuesta.porcentajeGastoRubros[i].rubro_interno_id == $scope.encuesta.rubros[j].id) { 
          $scope.encuesta.porcentajeGastoRubros[i].nombre = $scope.encuesta.rubros[j].nombre;
          break;
        }
      }

    }
  }, 
  function (error, data) {
    $ionicLoading.hide();
    let alertPopup =$ionicPopup.alert({
        title: '¡Error!',
        template: 'Ha ocurrido un error.',
        okType:'button-stable'
    });
  });

  $scope.changeServiciosPaquetes = function(s){
    if(s.id==9 || s.id==10 || s.id==11 ){
      if( $scope.encuesta.serviciosPaquetes.indexOf(s.id)!=-1 ){
       $scope.encuesta.gastosServicosPaquetes.push( { servicio_paquete_id:s.id, nombre: s.nombre} );
      }
      else{ 
        for(let i=0; i<$scope.encuesta.gastosServicosPaquetes.length;i++){
          if( $scope.encuesta.gastosServicosPaquetes[i].servicio_paquete_id==s.id ){ 
            $scope.encuesta.gastosServicosPaquetes.splice(i,1); break; 
          }
        }
      }
    }
  };

  $scope.changeRubros = function(rb){           
    if( rb.id==8 && rb.viajes_gastos_internos.length>0 ){
      $scope.verAlquilerVehiculo = ((rb.viajes_gastos_internos[0].valor || rb.viajes_gastos_internos[0].divisa_id) && rb.viajes_gastos_internos[0].personas_cubrio);
    }
      
    else if( rb.id==6 && rb.viajes_gastos_internos.length>0 ){
      $scope.verNombreEmpresa = ((rb.viajes_gastos_internos[0].valor || rb.viajes_gastos_internos[0].divisa_id) && rb.viajes_gastos_internos[0].personas_cubrio);
    }
    
    else if( (rb.id==12 || rb.id==13 || rb.id==14 || rb.id==15 || rb.id==16 || rb.id==17 || rb.id==18) && rb.viajes_gastos_internos.length>0 ){
      let sw = null;
      for(let i=0; i<$scope.encuesta.porcentajeGastoRubros.length;i++){
        if($scope.encuesta.porcentajeGastoRubros[i].rubro_interno_id==rb.id){ sw = i; break; }
      }
          
      if( ((rb.viajes_gastos_internos[0].valor || rb.viajes_gastos_internos[0].divisa_id) && rb.viajes_gastos_internos[0].personas_cubrio) ){
        if(sw==null){  
          $scope.encuesta.porcentajeGastoRubros.push( { rubro_interno_id : rb.id, nombre : rb.nombre } ); 
        }
      }
      else{
        if(sw!=null){  $scope.encuesta.porcentajeGastoRubros.splice(sw,1); }
      }
    } 
    return;
  };

  $scope.getNombreServicio =  function(id ){
    for (let i = 0; i < $scope.serviciosPaquetes.length; i++){
      if ($scope.serviciosPaquetes[i].servicio_paquete_id == id) { return $scope.serviciosPaquetes[i].nombre; }
    }
    return ;
  };

  $scope.changeNorealiceGastos = function(){
    if($scope.encuesta.noRealiceGastos==1){
      for(let i=0; i<$scope.encuesta.rubros.length; i++){
        $scope.encuesta.rubros[i].viajes_gastos_internos[0] = {};
      }
      $scope.encuesta.gastosServicosPaquetes = [];
      $scope.encuesta.porcentajeGastoRubros = [];
      $scope.verNombreEmpresa = false;
      $scope.empresaTransporte = null;
    }
  };

  $scope.clearDataViaje = function(){
    $scope.encuesta.gastosServicosPaquetes = [];
  }

  $scope.toggleSelection = function (id) {
    let idx = $scope.encuesta.serviciosPaquetes.indexOf(id);
    if (idx > -1) {
      $scope.encuesta.serviciosPaquetes.splice(idx, 1);
    }

    else {
      $scope.encuesta.serviciosPaquetes.push(id);
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

  $scope.guardar = function () {
        
    if (!$scope.forms.GastoForm.$valid || $scope.encuesta.financiadores.length==0) {
      ionicToast.show("Formulario incompleto corrige los errores",'top', false, 5000);
      return;
    }
        
    let data = angular.copy($scope.encuesta);
    data.id = $scope.id;
    data.rubros = [];
   
    for (let i = 0; i < $scope.encuesta.rubros.length; i++) {
      if($scope.encuesta.rubros[i].viajes_gastos_internos.length>0){  
        let rubro = $scope.encuesta.rubros[i];
          
        if($scope.encuesta.noRealiceGastos==1){
          if( rubro.viajes_gastos_internos[0].gastos_realizados_otros ){
            data.rubros.push({
              rubros_id : rubro.id,
              gastos_realizados_otros : rubro.viajes_gastos_internos[0].gastos_realizados_otros
            });  
          }
        }else{
          if( (rubro.viajes_gastos_internos[0].valor || rubro.viajes_gastos_internos[0].divisa_id) && rubro.viajes_gastos_internos[0].personas_cubrio ){
            data.rubros.push({
              rubros_id : rubro.id,
              valor : rubro.viajes_gastos_internos[0].valor,
              divisa_id : rubro.viajes_gastos_internos[0].divisa_id,
              personas_cubrio : rubro.viajes_gastos_internos[0].personas_cubrio,
              gastos_realizados_otros : rubro.viajes_gastos_internos[0].gastos_realizados_otros,
              otro : rubro.viajes_gastos_internos[0].otro,
              alquila_vehiculo_id : rubro.id==8 ? rubro.viajes_gastos_internos[0].alquila_vehiculo_id : null,
            });  
          }else if(rubro.viajes_gastos_internos[0].gastos_realizados_otros){
            data.rubros.push({
              rubros_id : rubro.id,
              gastos_realizados_otros : rubro.viajes_gastos_internos[0].gastos_realizados_otros
            });  
          }
        }  
      }
    } 
        
    if(data.rubros.length==0 && !data.noRealiceGastos){
      ionicToast.show("Debe llenar por lo menos un gasto, de lo contrario marque no realice ningun gasto.",'top', false, 5000);
      return;
    }
        
    for (let i = 0; i < $scope.encuesta.porcentajeGastoRubros.length; i++){
      if( ($scope.encuesta.porcentajeGastoRubros[i].dentro+$scope.encuesta.porcentajeGastoRubros[i].fuera) != 100 ){
        ionicToast.show("La suma de los porcentajes gastados debe ser igual a 100%.",'top', false, 5000);   
        return;
      }
    }

    for (let i = 0; i < $scope.encuesta.gastosServicosPaquetes.length; i++){
      if( ($scope.encuesta.gastosServicosPaquetes[i].dentro+$scope.encuesta.gastosServicosPaquetes[i].fuera) != 100 ){
        ionicToast.show("La suma de los porcentajes gastados debe ser igual a 100%.",'top', false, 5000);   
        return;
      }
    }

    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner> Espere por favor...',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });

    turismoInterno.guardargastos(data).then(function (data) {
      $ionicLoading.hide();
      if (data.success == true) {
        ionicToast.show("Se realizó la operación exitosamente",'top', false, 5000);
        $location.path("/app/fuentesInformacion/"+$scope.id);
      } else {
        $ionicScrollDelegate.scrollTop(true);
        ionicToast.show("Hay errores en el formulario corrigelo",'middle', false, 5000);
        $scope.errores = data.errores;
      }
    }, 
    function (error, data) {
      $ionicLoading.hide();
      let alertPopup =$ionicPopup.alert({
        title: '¡Error!',
        template: 'Ha ocurrido un error. Intenta nuevamente',
        okType:'button-stable'
      });
    });
  };

  $scope.toggleSelection2 = function (id) {
    let idx = $scope.encuesta.financiadores.indexOf(id);
    if (idx > -1) {
      $scope.encuesta.financiadores.splice(idx, 1);
    }

    else {
      $scope.encuesta.financiadores.push(id);
    }
  };
})

.controller('fuentesInformacionController', function($scope, $stateParams, $ionicLoading, turismoInterno, $ionicPopup, ionicToast, $ionicScrollDelegate, $state, $filter, $location, factories) {
  $scope.enteran = {'FuentesDurante': [],'FuentesAntes': [],'Redes':[]};
  $scope.id=$stateParams.id;
  $scope.forms={};

  $ionicLoading.show({
    template: '<ion-spinner></ion-spinner> Espere por favor...',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });

  turismoInterno.cargardatosfuentes($stateParams.id).then(function (data) {
      $ionicLoading.hide();
      $scope.fuentesAntes = data.fuentesAntes
      $scope.fuentesDurante = data.fuentesDurante
      $scope.redes = data.redes
      $scope.enteran.id = $scope.id
      $scope.experiencias = data.experiencias
      $scope.calificaciones = data.calificaciones

      if (data.invitacion_correo != null) {
        $scope.enteran.FuentesAntes = data.fuentes_antes
        $scope.enteran.FuentesDurante = data.fuentes_durante
        $scope.enteran.Redes = data.compar_redes
        $scope.enteran.OtroFuenteAntes = data.OtroFuenteAntes
        $scope.enteran.OtroFuenteDurante = data.OtroFuenteDurante
        $scope.enteran.Correo = data.invitacion_correo
        $scope.enteran.Invitacion = data.invitacion
        $scope.enteran.NombreFacebook = data.facebook
        $scope.enteran.NombreTwitter = data.twitter
        $scope.enteran.Autorizo=data.autorizo
        $scope.enteran.Acepta_tratamiento=data.acepta
        $scope.enteran.otra_red=data.Otrared
      }
  }, 
  function (error, data) {
    $ionicLoading.hide();
    let alertPopup =$ionicPopup.alert({
        title: '¡Error!',
        template: 'Ha ocurrido un error.',
        okType:'button-stable'
    });
  });

  $scope.toggleSelection = function (item) {
    let idx = $scope.enteran.FuentesAntes.indexOf(item);
    if (idx > -1) {
      $scope.enteran.FuentesAntes.splice(idx, 1);
    }else {
      $scope.enteran.FuentesAntes.push(item);
    } 
  };

  $scope.validar = function (sw, id) {
    if (sw == 0) {
      if (id == 13) {
        let i = $scope.enteran.FuentesDurante.indexOf(13);
        if (i == -1) {
          $scope.enteran.OtroFuenteDurante = null;
        }
      } else {
        if (id == 14) {
          let i = $scope.enteran.FuentesDurante.indexOf(14);
          if (i != -1) {
            $scope.enteran.OtroFuenteDurante = null;
          }
        }
      }
    } else if (sw == 1) {
      if (id == 1) {
        let i = $scope.enteran.Redes.indexOf(1);
        if (i == -1) {
          $scope.enteran.otroRed = null;
        }
      }
    } else {
      if (id == 14) {
        let i = $scope.enteran.FuentesAntes.indexOf(14);
        if (i != -1) {
          $scope.enteran.OtroFuenteAntes = null;
        }
      }
    }
  };

  $scope.validarOtro = function (sw) {
    if (sw == 0) {
      let i = $scope.enteran.FuentesAntes.indexOf(14);
      if ($scope.enteran.OtroFuenteAntes != null && $scope.enteran.OtroFuenteAntes != '') {
        if (i == -1) {
          $scope.enteran.FuentesAntes.push(14);
        }
      } 
    } else if(sw == 1) {
      let i = $scope.enteran.FuentesDurante.indexOf(14);
      if ($scope.enteran.OtroFuenteDurante != null && $scope.enteran.OtroFuenteDurante != '') {
        if (i == -1) {
          $scope.enteran.FuentesDurante.push(14);
        }
      } 
    } else if(sw == 2) {
      let i = $scope.enteran.Redes.indexOf(12);
      if ($scope.enteran.otroRed != null && $scope.enteran.otroRed != '') {
        if (i == -1) {
          $scope.enteran.Redes.push(12);
        }
      } 
    }
  };

  $scope.toggleSelection2 = function (item,$event) {
    
    let dataValue = angular.element($event.target).attr("disabled");;
    if(dataValue!=="disabled"){
      let idx = $scope.enteran.FuentesDurante.indexOf(item);

      if (idx > -1) {
        console.log($scope.enteran.FuentesDurante, idx)
        $scope.enteran.FuentesDurante.splice(idx, 1)

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

    let dataValue = angular.element($event.target).attr("disabled");;
    if(dataValue!=="disabled"){
      let idx = $scope.enteran.Redes.indexOf(item);

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

  $scope.checked=function(id, objeto) {
    let i=0;
    for(i=0; i<objeto.length; i++){
      if(id==objeto[i]){
        return true;
      }
    }
    return false;
  };

  $scope.guardar=function () {

    if (!$scope.forms.inForm.$valid || $scope.enteran.FuentesAntes.length == 0 || $scope.enteran.FuentesDurante.length == 0 || $scope.enteran.Redes.length == 0) {
      ionicToast.show("Formulario incompleto corrige los errores",'middle', false, 5000);
      return
    }

    if ($scope.enteran.FuentesAntes.indexOf(14) == -1) {$scope.enteran.OtroFuenteAntes = null}

    if ($scope.enteran.FuentesDurante.indexOf(14) == -1) {$scope.enteran.OtroFuenteDurante = null}

    $scope.enteran.Experiencias = $scope.experiencias
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner> Espere por favor...',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });

    turismoInterno.guardarfuentesinformacion($scope.enteran).then(function (data) {
      $ionicLoading.hide();
      if (data.success == true) {
        ionicToast.show("Se realizó la operación exitosamente",'top', false, 5000);
        $location.path("/app/temporadas");
      } else {
        $ionicScrollDelegate.scrollTop(true);
        ionicToast.show("Hay errores en el formulario corrigelo",'middle', false, 5000);
        $scope.errores = data.errores;
      }
    }, 
    function (error, data) {
      $ionicLoading.hide();
      let alertPopup =$ionicPopup.alert({
        title: '¡Error!',
        template: 'Ha ocurrido un error. Intenta nuevamente',
        okType:'button-stable'
      });
    });
  }
})

