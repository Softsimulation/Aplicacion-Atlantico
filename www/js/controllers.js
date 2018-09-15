angular.module('starter.controllers', [
                                      'receptor.controllers',
                                      'interno.controllers'
                                      ])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicPopover, $rootScope, $location, ionicToast, $ionicHistory, $state, $ionicNavBarDelegate) {
  
  $ionicHistory.clearHistory();
  $ionicHistory.clearCache();

  $rootScope.togglePopupMenu = function() {
    return $scope.menu_is_open = !$scope.menu_is_open;
  };

  $rootScope.navigateReceptor=function (to_section, last_section, id, is_offline) {
    if(to_section<=last_section){
      switch(to_section){
        case 1:
          $location.path("/app/editGeneral/"+id+"/"+is_offline).search({'lastSection':last_section});                
        break;

        case 2:
          $location.path("/app/estancia/"+id+"/"+is_offline).search({'lastSection':last_section});
        break;

        case 3:
          $location.path("/app/transporte/"+id+"/"+is_offline).search({'lastSection':last_section});
        break;
          
        case 4:
          $location.path("/app/grupo/"+id+"/"+is_offline).search({'lastSection':last_section});
        break;

        case 5:
          $location.path("/app/gastos/"+id+"/"+is_offline).search({'lastSection':last_section});
        break;

        case 6:
          $location.path("/app/percepcion/"+id+"/"+is_offline).search({'lastSection':last_section});
        break;

        case 7:
          $location.path("/app/enteran/"+id+"/"+is_offline).search({'lastSection':last_section});
        break;
      }
    }else{
      ionicToast.show("Aún no tienes permisos para acceder a esa sección",'middle', false, 5000); 
    }
  }
  
  $scope.$on('$ionicView.enter', function(e) {
      $ionicNavBarDelegate.showBar(true);
  });

  if(localStorage.getItem("token") == null){
    $ionicHistory.clearHistory();
    $ionicHistory.clearCache();
    localStorage.removeItem("token");
    localStorage.removeItem("loader_receptor");
    localStorage.removeItem("receptor_off");
    $state.go('login');
  }
})

.controller('loginController', function($scope, $ionicLoading, $ionicPopup, $state, CONFIG, $location,ionicToast, $ionicHistory, generalServices) {
  $scope.type=false;
  $ionicHistory.clearHistory();
  $ionicHistory.clearCache();
  if(localStorage.getItem("token") != null){$state.go('app.home');}
    
  $scope.login=function (user) {
    
    if(!user.username || user.username=='' || !user.password || user.password==''){
      ionicToast.show("Complete todos los campos",'middle', false, 5000);
      return;
    }
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner> Espere por favor...',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });

    generalServices.apiLogin(user).then(function (data) {
      $ionicLoading.hide();
      localStorage.setItem("token",JSON.stringify(data.token));
      $state.go('app.home');
    }, 
    function (error) {
      user.password="";
      $ionicLoading.hide();
      if(error.status==401){
        ionicToast.show(error.error.mensaje,'middle', false, 5000);
      }else{
        ionicToast.show("Error interno del servidor",'middle', false, 5000);
      }
    });
  }
})


.controller('logoutController', function($scope, $state, $ionicHistory) {
    localStorage.removeItem("token");
    localStorage.removeItem("loader_receptor");
    localStorage.removeItem("receptor_off");
    $ionicHistory.clearHistory();
    $ionicHistory.clearCache();
    $state.go('login');
})

.controller('listarGrupoController', function($scope, $stateParams) {
})

.controller('nuevoGrupoController', function($scope, $stateParams) {
})

.controller('verGrupoController', function($scope, $stateParams) {
})

.controller('listarOyEController', function($scope, $stateParams) {
})

.controller('encuestaSitioController', function($scope, $stateParams) {
})

.controller('actividadComercialAdminController', function($scope, $stateParams) {
  $scope.selectables = [1,2,3,4,5];
})

.controller('encuestaAdminController', function($scope, $stateParams) {
})

.controller('caracterizacionAlojamientosController', function($scope, $stateParams) {
})

.controller('ofertaAlojamientoController', function($scope, $stateParams) {
})

.controller('empleoMensualController', function($scope, $stateParams) {
})

.controller('numeroEmpleadosController', function($scope, $stateParams) {
})

.controller('empleadosCaracterizacionController', function($scope, $stateParams) {
})

.controller('encuestasAdministradorController', function($scope, $stateParams) {
})

.controller('proveedoresActivosController', function($scope, $stateParams, $ionicModal, $ionicPopup) {
  $ionicModal.fromTemplateUrl('templates/modalEditPro.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;

  });

  $ionicModal.fromTemplateUrl('templates/modalCreatePro.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal2 = modal;

  });

  $scope.desactivar=function () {
    $ionicPopup.confirm({
       title: 'Desactivar proveedor',
       template: '¿Seguro que desea hacerlo?', 
       buttons: [
           {text:'No', type: 'button-stable',},
           {text:'Si',type: 'button-stable', }
        ]
    });
  }
})

.controller('datosRegistroNacionalTurismoController', function($scope, $stateParams, $ionicModal, $ionicPopup) {

  $ionicModal.fromTemplateUrl('templates/modalEditRNT.html', {
    scope: $scope,
  }).then(function(modal) {
    $scope.modal = modal;

  });

  $ionicModal.fromTemplateUrl('templates/modalCreateRNT.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal2 = modal;

  });

  $scope.desactivar=function () {
    $ionicPopup.confirm({
       title: '¿Estas seguro que desea eliminar el registro?',
       template: 'No será capaz de recuperar esta información', 
       buttons: [
           {text:'No', type: 'button-stable',},
           {text:'Si',type: 'button-stable', }
        ]
    });
  }
  $scope.selectables = [1,2,3,4,5];
})

.controller('daneController', function($scope, $stateParams, $ionicPopup, $ionicModal) {
  $ionicModal.fromTemplateUrl('templates/modalCreateDane.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;

  });

  $scope.desactivar=function () {
    $ionicPopup.confirm({
       title: '¿Estas seguro que desea eliminar el registro?',
       template: '¿Está seguro?', 
       buttons: [
           {text:'No', type: 'button-stable',},
           {text:'Si',type: 'button-stable', }
        ]
    });
  }
  $scope.selectables = [1,2,3,4,5];
})


.controller('SideMenuCtrl', function($scope) {
  $scope.theme = 'ionic-sidemenu-stable';

  $scope.tree =
    [{
      id:0,
      level:0,
      name:'Inicio',
      icon:'ion-home',
      state:'app.home',
      items:null
    },
    {
      id: 1,
      level: 0,
      name: 'Encuestas Receptor',
      icon: "ion-person",
      items: [{
        
          id: 10,
          name: 'Listar Encuestas',
          level: 1,
          icon: "ion-document-text",
          state: 'app.encuestas',
          items: null
        }, {
          id: 11,
          level: 1,
          name: 'Grupos de Viaje',
          icon: "ion-ios-people",
          state: 'app.listarGrupo',
          items: null
        
        }]
    },
    {
      id: 2,
      level: 0,
      name: 'Encuesta oferta y empleo',
      icon: "ion-clipboard",
      items: [{
        
          id: 20,
          name: 'Listar Encuestas',
          level: 2,
          icon: "ion-document-text",
          state: 'app.listarOyE',
          items: null
        }, {
          id: 21,
          level: 2,
          name: 'Listar proveedores',
          icon: "ion-ios-people",
          state: 'app.proveedoresActivos',
          items: null
        
        }, {
          id: 22,
          level: 2,
          name: 'RNT',
          icon: "ion-plus",
          state: 'app.datosRegistroNacionalTurismo',
          items: null
        
        }]
    },
    {
      id: 3,
      level: 0,
      name: 'Encuesta interno y emisor',
      icon: "ion-speakerphone",
      items: [{
        
          id: 30,
          name: 'Listar temporadas',
          level: 2,
          icon: "ion-document-text",
          state: 'app.temporadas',
          items: null
        }, {
          id: 31,
          level: 2,
          name: 'Población DANE',
          icon: "ion-ios-people",
          state: 'app.dane',
          items: null
        
        }]
    },
    {
      id:4,
      level:0,
      name:'Logout',
      icon:'ion-log-out',
      state:'logout',
      items:null
    }];
})

.controller('homeController', function($scope, $stateParams, $ionicPopup, $ionicHistory) {
  $ionicHistory.clearHistory();
  $ionicHistory.clearCache();

  $scope.show=function () {
    $ionicPopup.alert({
          title: '¡Información!',
          template: 'Esta aplicación contiene módulos para la carga de encuestas realizadas vía offline. <br><br>Te recomendamos realizar una encuesta online para que queden pre-cargadas las opciones en el télefono, y puedas realizar tus encuestas sin conexión',
          okType:'button-stable'
      });
  };
});