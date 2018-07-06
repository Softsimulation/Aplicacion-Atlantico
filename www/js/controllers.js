angular.module('starter.controllers', [
                                      'receptor.controllers',
                                      'interno.controllers'
                                      ])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicPopover) {

  $ionicPopover.fromTemplateUrl('templates/lang-popover.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(popover) {
    $scope.popover = popover;
  });

  $scope.togglePopupMenu = function() {
    return $scope.menu_is_open = !$scope.menu_is_open;
  };
})


.controller('gastosController', function($scope, $stateParams,ionicToast,$ionicModal) {

  $scope.selectables = [1,2,3,4,5];
  $scope.planChange=function (plan) {
    $scope.planes=plan;
  }

  $scope.municipioChange=function (municipio) {
    $scope.municipios=municipio;
  }

  $scope.compradoChange=function (comprado) {
    $scope.comprado=comprado;
  }

  $scope.infoChange=function (info) {
    $scope.info=info;

    if(info==2){
      ionicToast.show('Si indico que realizo gastos, debe ingresar algun gasto hecho (si viajo como paquete turístico o al menos un gasto adicional).', 'middle', false, 10000);
    }
  }


  $ionicModal.fromTemplateUrl('templates/modalDatos.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;

  });
})

.controller('percepcionController', function($scope, $stateParams) {
})

.controller('enteranController', function($scope, $stateParams) {
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
  ;
  $scope.tree =
    [{
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
    }];
})

.controller('homeController', function($scope, $stateParams) {
 
});