// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 
                           'starter.controllers',
                           'ion-datetime-picker',
                           'angular-svg-round-progressbar',
                           'starter.directives',
                           'ionic-toast',
                           'ionic-sidemenu',
                           'whimsicalRipple', 
                           'ionic-modal-select',
                           'turismo.interno.services',
                           'checklist-model'

                           ])

.constant('CONFIG', {
  APIURL: "https://situr-jeferbustamante.c9users.io/situr/public/",
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)

    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.overlaysWebView(false);
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  //$ionicConfigProvider.views.transition('none');
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.grupo', {
    url: '/grupo',
    views: {
      'menuContent': {
        templateUrl: 'templates/grupo.html',
        controller: 'grupoController'
      }
    }
  })

  .state('app.estancia', {
    url: '/estancia',
    views: {
      'menuContent': {
        templateUrl: 'templates/estancia.html',
        controller: 'estanciaController'
      }
    }
  })

  .state('app.gastos', {
    url: '/gastos',
    views: {
      'menuContent': {
        templateUrl: 'templates/gastos.html',
        controller: 'gastosController'
      }
    }
  })

  .state('app.general', {
    url: '/general',
    views: {
      'menuContent': {
        templateUrl: 'templates/general.html',
        controller: 'generalController'
      }
    }
  })

  .state('app.percepcion', {
    url: '/percepcion',
    views: {
      'menuContent': {
        templateUrl: 'templates/percepcion.html',
        controller: 'percepcionController'
      }
    }
  })

  .state('app.enteran', {
    url: '/enteran',
    views: {
      'menuContent': {
        templateUrl: 'templates/enteran.html',
        controller: 'enteranController'
      }
    }
  })

  .state('app.encuestas', {
    url: '/encuestas',
    views: {
      'menuContent': {
        templateUrl: 'templates/encuestas.html',
        controller: 'encuestasController'
      }
    }
  })

  .state('app.listarGrupo', {
    url: '/listarGrupo',
    views: {
      'menuContent': {
        templateUrl: 'templates/listarGrupo.html',
        controller: 'listarGrupoController'
      }
    }
  })

  .state('app.nuevoGrupo', {
    url: '/nuevoGrupo',
    views: {
      'menuContent': {
        templateUrl: 'templates/nuevoGrupo.html',
        controller: 'nuevoGrupoController'
      }
    }
  })

  .state('app.verGrupo', {
    url: '/verGrupo',
    views: {
      'menuContent': {
        templateUrl: 'templates/verGrupo.html',
        controller: 'verGrupoController'
      }
    }
  })

  .state('app.listarOyE', {
    url: '/listarOyE',
    views: {
      'menuContent': {
        templateUrl: 'templates/listarOyE.html',
        controller: 'listarOyEController'
      }
    }
  })

  .state('app.encuestaSitio', {
    url: '/encuestaSitio',
    views: {
      'menuContent': {
        templateUrl: 'templates/encuestaSitio.html',
        controller: 'encuestaSitioController'
      }
    }
  })

  .state('app.encuestaAdmin', {
    url: '/encuestaAdmin',
    views: {
      'menuContent': {
        templateUrl: 'templates/encuestaAdmin.html',
        controller: 'encuestaAdminController'
      }
    }
  })

  .state('app.actividadComercialAdmin', {
    url: '/actividadComercialAdmin',
    views: {
      'menuContent': {
        templateUrl: 'templates/actividadComercialAdmin.html',
        controller: 'actividadComercialAdminController'
      }
    }
  })

  .state('app.caracterizacionAlojamientos', {
    url: '/caracterizacionAlojamientos',
    views: {
      'menuContent': {
        templateUrl: 'templates/caracterizacionAlojamientos.html',
        controller: 'caracterizacionAlojamientosController'
      }
    }
  })

  .state('app.ofertaAlojamiento', {
    url: '/ofertaAlojamiento',
    views: {
      'menuContent': {
        templateUrl: 'templates/ofertaAlojamiento.html',
        controller: 'ofertaAlojamientoController'
      }
    }
  })

  .state('app.empleoMensual', {
    url: '/empleoMensual',
    views: {
      'menuContent': {
        templateUrl: 'templates/empleoMensual.html',
        controller: 'empleoMensualController'
      }
    }
  })

  .state('app.numeroEmpleados', {
    url: '/numeroEmpleados',
    views: {
      'menuContent': {
        templateUrl: 'templates/numeroEmpleados.html',
        controller: 'numeroEmpleadosController'
      }
    }
  })

  .state('app.empleadosCaracterizacion', {
    url: '/empleadosCaracterizacion',
    views: {
      'menuContent': {
        templateUrl: 'templates/empleadosCaracterizacion.html',
        controller: 'empleadosCaracterizacionController'
      }
    }
  })

  .state('app.encuestasAdministrador', {
    url: '/encuestasAdministrador',
    views: {
      'menuContent': {
        templateUrl: 'templates/encuestasAdministrador.html',
        controller: 'encuestasAdministradorController'
      }
    }
  })

  .state('app.proveedoresActivos', {
    url: '/proveedoresActivos',
    views: {
      'menuContent': {
        templateUrl: 'templates/proveedoresActivos.html',
        controller: 'proveedoresActivosController'
      }
    }
  })

  .state('app.datosRegistroNacionalTurismo', {
    url: '/datosRegistroNacionalTurismo',
    views: {
      'menuContent': {
        templateUrl: 'templates/datosRegistroNacionalTurismo.html',
        controller: 'datosRegistroNacionalTurismoController'
      }
    }
  })

  .state('app.temporadas', {
    url: '/temporadas',
    cache:false,
    views: {
      'menuContent': {
        templateUrl: 'templates/temporada.html',
        controller: 'temporadasController'
      }
    }
  })

  .state('app.verTemporada', {
    url: '/verTemporada/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/verTemporada.html',
        controller: 'verTemporadaController'
      }
    }
  })

  .state('app.dane', {
    url: '/dane',
    views: {
      'menuContent': {
        templateUrl: 'templates/poblacionDANE.html',
        controller: 'daneController'
      }
    }
  })

  .state('app.hogar', {
    url: '/hogar/:id',
    cache:false,
    views: {
      'menuContent': {
        templateUrl: 'templates/hogar.html',
        controller: 'hogarController'
      }
    }
  })

  .state('app.editHogar', {
    url: '/editHogar/:id',
    cache:false,
    views: {
      'menuContent': {
        templateUrl: 'templates/hogarEdit.html',
        controller: 'editHogarController'
      }
    }
  })

  .state('app.viajeRealizado', {
    url: '/viajeRealizado/:id',
    cache:false,
    views: {
      'menuContent': {
        templateUrl: 'templates/viajeRealizado.html',
        controller: 'viajesRealizadoController'
      }
    }
  })

  .state('app.viajePrincipal', {
    url: '/viajePrincipal/:id/:principal',
    cache:false,
    views: {
      'menuContent': {
        templateUrl: 'templates/viajePrincipal.html',
        controller: 'viajePrincipalController'
      }
    }
  })

  .state('app.actividades', {
    url: '/actividades/:id',
    cache:false,
    views: {
      'menuContent': {
        templateUrl: 'templates/actividadesRealizadas.html',
        controller: 'actividadesController'
      }
    }
  })

  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
        controller: 'homeController'
      }
    }
  })


  .state('app.transporte', {
    url: '/transporte',
    views: {
      'menuContent': {
        templateUrl: 'templates/transporte.html',
        controller: 'transporteController'
      }
    }
  });


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
