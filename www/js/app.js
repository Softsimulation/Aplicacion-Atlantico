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
                           'turismo.receptor.services',
                           'general.services',
                           'checklist-model',
                           'starter.directives',
                           'factories',
                           'ngCordova'

                           ])

.constant('CONFIG', {
  APIURL: "http://situr-andoedo94.c9users.io/",
  //APIURL: "http://demo.situratlantico.info/",
  
})

.run(function($ionicPlatform, $ionicPopup, $rootScope, $ionicPickerI18n) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    

    $ionicPickerI18n.weekdays = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];
    $ionicPickerI18n.months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    $ionicPickerI18n.ok = "Ok";
    $ionicPickerI18n.cancel = "Cancelar";
    $ionicPickerI18n.okClass = "button-stable ripple";
    $ionicPickerI18n.cancelClass = "button-stable ripple";

    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.overlaysWebView(false);
      //StatusBar.styleDefault();
    }

    if (window.Connection) {
      
      if (navigator.connection.type == Connection.NONE || navigator.connection.type == Connection.UNKNOWN) {
        $ionicPopup.alert({
          title: "No hay conexión a internet",
          content: "Todas las tareas que realice sin conexión serán sincronizadas cuando tenga internet, recuerde no cerrar sesión para no perder el trabajo realizado"
        }) 
      }
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
  $stateProvider
  
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginController',
    cache: false
  })

  .state('logout', {
    url: '/logout',
    templateUrl: 'templates/login.html',
    controller: 'logoutController',
    cache: false
  })

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
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

  
  /***********Turismo receptor Routes**********/
  
  .state('app.encuestas', {
    url: '/encuestas',
    cache:false,
    views: {
      'menuContent': {
        templateUrl: 'templates/receptor/encuestas.html',
        controller: 'encuestasController'
      }
    }
  })

  .state('app.general', {
    url: '/general',
    cache:false,
    views: {
      'menuContent': {
        templateUrl: 'templates/receptor/general.html',
        controller: 'generalController'
      }
    }
  })

  .state('app.editGeneral', {
    url: '/editGeneral/:id/:isOff',
    cache:false,
    views: {
      'menuContent': {
        templateUrl: 'templates/receptor/editGeneral.html',
        controller: 'editGeneralController'
      }
    }
  })

  .state('app.estancia', {
    url: '/estancia/:id/:isOff',
    cache:false,
    views: {
      'menuContent': {
        templateUrl: 'templates/receptor/estancia.html',
        controller: 'estanciaController'
      }
    }
  })

  .state('app.transporte', {
    url: '/transporte/:id/:isOff',
    cache:false,
    views: {
      'menuContent': {
        templateUrl: 'templates/receptor/transporte.html',
        controller: 'transporteController'
      }
    }
  })

  .state('app.grupo', {
    url: '/grupo/:id/:isOff',
    cache:false,
    views: {
      'menuContent': {
        templateUrl: 'templates/receptor/grupo.html',
        controller: 'grupoController'
      }
    }
  })

  .state('app.gastos', {
    url: '/gastos/:id/:isOff',
    cache:false,
    views: {
      'menuContent': {
        templateUrl: 'templates/receptor/gastos.html',
        controller: 'gastosController'
      }
    }
  })

  .state('app.percepcion', {
    url: '/percepcion/:id/:isOff',
    cache:false,
    views: {
      'menuContent': {
        templateUrl: 'templates/receptor/percepcion.html',
        controller: 'percepcionController'
      }
    }
  })

  .state('app.enteran', {
    url: '/enteran/:id/:isOff',
    cache:false,
    views: {
      'menuContent': {
        templateUrl: 'templates/receptor/enteran.html',
        controller: 'enteranController'
      }
    }
  })

  /*******************************************/


  /**********Turismo Interno Routes**********/
  .state('app.temporadas', {
    url: '/temporadas',
    cache:false,
    views: {
      'menuContent': {
        templateUrl: 'templates/interno/temporada.html',
        controller: 'temporadasController'
      }
    }
  })

  .state('app.verTemporada', {
    url: '/verTemporada/:id/:isOff',
    views: {
      'menuContent': {
        templateUrl: 'templates/interno/verTemporada.html',
        controller: 'verTemporadaController'
      }
    }
  })

  .state('app.hogar', {
    url: '/hogar/:id',
    cache:false,
    views: {
      'menuContent': {
        templateUrl: 'templates/interno/hogar.html',
        controller: 'hogarController'
      }
    }
  })

  .state('app.editHogar', {
    url: '/editHogar/:id/:isOff',
    cache:false,
    views: {
      'menuContent': {
        templateUrl: 'templates/interno/hogarEdit.html',
        controller: 'editHogarController'
      }
    }
  })

  .state('app.viajeRealizado', {
    url: '/viajeRealizado/:id/:isOff',
    cache:false,
    views: {
      'menuContent': {
        templateUrl: 'templates/interno/viajeRealizado.html',
        controller: 'viajesRealizadoController'
      }
    }
  })

  .state('app.viajePrincipal', {
    url: '/viajePrincipal/:id/:isOff',
    cache:false,
    views: {
      'menuContent': {
        templateUrl: 'templates/interno/viajePrincipal.html',
        controller: 'viajePrincipalController'
      }
    }
  })

  .state('app.actividades', {
    url: '/actividades/:id/:isOff',
    cache:false,
    views: {
      'menuContent': {
        templateUrl: 'templates/interno/actividadesRealizadas.html',
        controller: 'actividadesController'
      }
    }
  })

  .state('app.transporteInterno', {
    url: '/transporteInterno/:id/:isOff',
    cache:false,
    views: {
      'menuContent': {
        templateUrl: 'templates/interno/transporteInterno.html',
        controller: 'transporteInternoController'
      }
    }
  })

  .state('app.gastosInterno', {
    url: '/gastosInterno/:id/:isOff',
    cache:false,
    views: {
      'menuContent': {
        templateUrl: 'templates/interno/gastosInterno.html',
        controller: 'gastosInternoController'
      }
    }
  })

  .state('app.fuentesInformacion', {
    url: '/fuentesInformacion/:id/:isOff',
    cache:false,
    views: {
      'menuContent': {
        templateUrl: 'templates/interno/fuentesInformacion.html',
        controller: 'fuentesInformacionController'
      }
    }
  })

  /*****************************************/
  

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
