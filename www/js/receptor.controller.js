angular.module('receptor.controllers', [])

.controller('encuestasController', function($scope, turismoReceptor, $ionicLoading, $ionicPopup, $ionicHistory, $rootScope, $cordovaNetwork, ionicToast, $ionicModal, $q, $http, CONFIG, $ionicActionSheet, $location) {
  $ionicHistory.clearHistory();
  $ionicHistory.clearCache();
  $scope.currentPage = 0;
  $scope.pageSize = 5;           
  $scope.encuestas=[];
  $scope.toDelete=[];
  $rootScope.receptor_off=[];
  if(localStorage.getItem("receptor_off")!=null ){
    $rootScope.receptor_off=JSON.parse(localStorage.getItem("receptor_off"));
    if($rootScope.receptor_off.length>0)
    ionicToast.show("Hay encuestas cargadas para sincronizar",'middle', false, 5000);
  }
  
  $scope.len=function (a) {
    return Object.keys(a).length - 1;
  }

  ionicToast.show("Si deseas refrescar la lista de encuestas, desliza tu dedo hacía abajo",'bottom', false, 5000);


  $ionicModal.fromTemplateUrl('templates/receptor/encuestasOff.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });


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
 
  
 
  if ($cordovaNetwork.getNetwork() == 'none' || $cordovaNetwork.getNetwork() == 'unknown') {
    ionicToast.show("No tiene conexion, no podra ver la lista de encuestas",'top', false, 5000);
  }
  else{

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
        for (let i = 0; i < $scope.encuestas.length; i++) {
            if ($scope.encuestas[i].estadoid > 0 && $scope.encuestas[i].estadoid < 7) {
                $scope.encuestas[i].Filtro = 'sincalcular';
            } else {
                $scope.encuestas[i].Filtro = 'calculadas';
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
  }
    
  $scope.numberOfPages=function(encuestas){
    return Math.ceil(encuestas.length/$scope.pageSize);                
  };
  

  $scope.sincronizar=function () {
    
    for (let i = 0; i < $rootScope.receptor_off.length; i++) { 
      if(!$rootScope.receptor_off[i].id){
        let section1 = $http.post(CONFIG.APIURL+'turismoreceptoroapi/guardardatos', $rootScope.receptor_off[i].section_1,{'content-type':'application/json',});
        $ionicLoading.show({
          template: '<ion-spinner></ion-spinner> Espere por favor...',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });
        $q.all([section1]).then(data => {
          let success=data[0].data.success;
          if(success==true){
            $rootScope.receptor_off[i].id=data[0].data.id;
            $rootScope.receptor_off[i].terminada=data[0].data.terminada;
            $rootScope.receptor_off[i].section_1.isUpload=true;
            $rootScope.receptor_off[i].lastLoad=1;
            if($rootScope.receptor_off[i].section_2){          
              $rootScope.receptor_off[i].section_2.Id=$rootScope.receptor_off[i].id;
              let section2 = $http.post(CONFIG.APIURL+'turismoreceptoroapi/crearestancia', $rootScope.receptor_off[i].section_2,{'content-type':'application/json',});
              $q.all([section2]).then(data => { 
                let success=data[0].data.success;
                if(success==true){
                  $rootScope.receptor_off[i].lastLoad=2;
                  $rootScope.receptor_off[i].section_2.isUpload=true;
                  if($rootScope.receptor_off[i].section_3){  
                    $rootScope.receptor_off[i].section_3.Id=$rootScope.receptor_off[i].id;
                    let section3 = $http.post(CONFIG.APIURL+'turismoreceptoroapi/guardarsecciontransporte', $rootScope.receptor_off[i].section_3,{'content-type':'application/json',});
                    $q.all([section3]).then(data => {
                      let success=data[0].data.success;
                      if(success==true){
                        $rootScope.receptor_off[i].lastLoad=3;
                        $rootScope.receptor_off[i].section_3.isUpload=true;
                        $rootScope.receptor_off[i].section_3.sw=0;
                        if($rootScope.receptor_off[i].section_4){  
                          $rootScope.receptor_off[i].section_4.Id=$rootScope.receptor_off[i].id;
                          let section4 = $http.post(CONFIG.APIURL+'turismoreceptoroapi/guardarseccionviajegrupo', $rootScope.receptor_off[i].section_4,{'content-type':'application/json',});
                          $q.all([section4]).then(data => {
                            let success=data[0].data.success;
                            if(success==true){
                              $rootScope.receptor_off[i].lastLoad=4;
                              $rootScope.receptor_off[i].section_4.isUpload=true;
                              $rootScope.receptor_off[i].section_4.sw=0;
                              if($rootScope.receptor_off[i].section_5){  
                                $rootScope.receptor_off[i].section_5.id=$rootScope.receptor_off[i].id;
                                let section5 = $http.post(CONFIG.APIURL+'turismoreceptoroapi/guardargastos', $rootScope.receptor_off[i].section_5,{'content-type':'application/json',});
                                $q.all([section5]).then(data => {
                                  let success=data[0].data.success;
                                  if(success==true){
                                    $rootScope.receptor_off[i].lastLoad=5;
                                    $rootScope.receptor_off[i].section_5.isUpload=true;
                                    if($rootScope.receptor_off[i].section_6){  
                                      $rootScope.receptor_off[i].section_6.Id=$rootScope.receptor_off[i].id;
                                      let section6 = $http.post(CONFIG.APIURL+'turismoreceptoroapi/guardarseccionpercepcion', $rootScope.receptor_off[i].section_6,{'content-type':'application/json',});
                                      $q.all([section6]).then(data => {
                                        let success=data[0].data.success;
                                        if(success==true){
                                          $rootScope.receptor_off[i].lastLoad=6;
                                          $rootScope.receptor_off[i].section_6.isUpload=true;
                                          $rootScope.receptor_off[i].section_6.sw=0;
                                          if($rootScope.receptor_off[i].section_7){  
                                            $rootScope.receptor_off[i].section_7.Id=$rootScope.receptor_off[i].id;
                                            let section7 = $http.post(CONFIG.APIURL+'turismoreceptoroapi/guardarseccioninformacion', $rootScope.receptor_off[i].section_7,{'content-type':'application/json',});
                                            $q.all([section7]).then(data => {
                                              let success=data[0].data.success;
                                              if(success==true){
                                                $rootScope.receptor_off[i].lastLoad=7;
                                                $rootScope.receptor_off[i].section_7.isUpload=true;
                                                $rootScope.receptor_off[i].section_7.sw=0;
                                                $rootScope.receptor_off[i].codigo=data[0].data.codigo;
                                              }else{
                                               $rootScope.receptor_off[i].section_7.errores = data[0].data.errores;
                                              }
                                              $ionicLoading.hide();
                                              localStorage.setItem("receptor_off",JSON.stringify($rootScope.receptor_off));
                                            }).catch(reason => {
                                              $ionicLoading.hide(); 
                                              ionicToast.show("Error interno del servidor",'middle', false, 5000);
                                            });
                                          }else{
                                            $ionicLoading.hide();   
                                          }
                                        }else{
                                         $rootScope.receptor_off[i].section_6.errores = data[0].data.errores;
                                         $ionicLoading.hide();
                                        }
                                        localStorage.setItem("receptor_off",JSON.stringify($rootScope.receptor_off));
                                      }).catch(reason => {
                                        $ionicLoading.hide(); 
                                        ionicToast.show("Error interno del servidor",'middle', false, 5000);
                                      });
                                    }else{
                                      $ionicLoading.hide();
                                    }
                                  }else{
                                   $rootScope.receptor_off[i].section_5.errores = data[0].data.errores;
                                   $ionicLoading.hide();
                                  }
                                  localStorage.setItem("receptor_off",JSON.stringify($rootScope.receptor_off));
                                }).catch(reason => {
                                  $ionicLoading.hide(); 
                                  ionicToast.show("Error interno del servidor",'middle', false, 5000);
                                });
                              }else{
                                $ionicLoading.hide();
                              }
                            }else{
                             $rootScope.receptor_off[i].section_4.errores = data[0].data.errores;
                             $ionicLoading.hide();
                            }
                            localStorage.setItem("receptor_off",JSON.stringify($rootScope.receptor_off));
                          }).catch(reason => {
                            $ionicLoading.hide(); 
                            ionicToast.show("Error interno del servidor",'middle', false, 5000);
                          });
                        }else{
                          $ionicLoading.hide();
                        }
                      }else{
                       $rootScope.receptor_off[i].section_3.errores = data[0].data.errores;
                      }
                      $ionicLoading.hide();
                      localStorage.setItem("receptor_off",JSON.stringify($rootScope.receptor_off));
                    }).catch(reason => {
                      $ionicLoading.hide(); 
                      ionicToast.show("Error interno del servidor",'middle', false, 5000);
                    });
                  }else{
                    $ionicLoading.hide();
                  } 
                }else{
                 $rootScope.receptor_off[i].section_2.errores = data[0].data.errores;
                 $ionicLoading.hide();
                }
                localStorage.setItem("receptor_off",JSON.stringify($rootScope.receptor_off));
              }).catch(reason => {
                $ionicLoading.hide(); 
                ionicToast.show("Error interno del servidor",'middle', false, 5000);
              });
            }else{
              $ionicLoading.hide();
            }
          }else{
           $rootScope.receptor_off[i].section_1.errores = data[0].data.errores;
           $ionicLoading.hide();
          }
          
          localStorage.setItem("receptor_off",JSON.stringify($rootScope.receptor_off));
        }).catch(reason => {
          $ionicLoading.hide(); 
          ionicToast.show("Error interno del servidor",'middle', false, 5000);
        });
      }else{
        $rootScope.receptor_off[i].section_1.Id=$rootScope.receptor_off[i].id;
        
        ionicToast.show("Las encuestas que ya tienen todas las secciones cargadas no serán tenidas en cuentas, te recomendamos que uses el botón para eliminarlas todas",'top', false, 5000);

        if($rootScope.receptor_off[i].lastLoad!=7){
          let section1 = $http.post(CONFIG.APIURL+'turismoreceptoroapi/guardareditardatos', $rootScope.receptor_off[i].section_1,{'content-type':'application/json',});
          $ionicLoading.show({
            template: '<ion-spinner></ion-spinner> Espere por favor...',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
          });
          $q.all([section1]).then(data => {
            let success=data[0].data.success;
            if(success==true){
              $rootScope.receptor_off[i].terminada=data[0].data.terminada;
              $rootScope.receptor_off[i].section_1.isUpload=true;
              $rootScope.receptor_off[i].lastLoad=1;
              if($rootScope.receptor_off[i].section_1.errores){
                delete $rootScope.receptor_off[i].section_1.errores;
              }
              if($rootScope.receptor_off[i].section_2){
                $rootScope.receptor_off[i].section_2.Id=$rootScope.receptor_off[i].id;
                let section2 = $http.post(CONFIG.APIURL+'turismoreceptoroapi/crearestancia', $rootScope.receptor_off[i].section_2,{'content-type':'application/json',});
                $q.all([section2]).then(data => { 
                  let success=data[0].data.success;
                  if(success==true){
                    $rootScope.receptor_off[i].lastLoad=2;
                    $rootScope.receptor_off[i].section_2.isUpload=true;
                    if($rootScope.receptor_off[i].section_2.errores){
                      delete $rootScope.receptor_off[i].section_2.errores;
                    }
                    if($rootScope.receptor_off[i].section_3){  
                      $rootScope.receptor_off[i].section_3.Id=$rootScope.receptor_off[i].id;
                      let section3 = $http.post(CONFIG.APIURL+'turismoreceptoroapi/guardarsecciontransporte', $rootScope.receptor_off[i].section_3,{'content-type':'application/json',});
                      $q.all([section3]).then(data => {
                        let success=data[0].data.success;
                        if(success==true){
                          $rootScope.receptor_off[i].lastLoad=3;
                          $rootScope.receptor_off[i].section_3.isUpload=true;
                          $rootScope.receptor_off[i].section_3.sw=0;
                          if($rootScope.receptor_off[i].section_3.errores){
                            delete $rootScope.receptor_off[i].section_3.errores;
                          }
                          if($rootScope.receptor_off[i].section_4){  
                            $rootScope.receptor_off[i].section_4.Id=$rootScope.receptor_off[i].id;
                            let section4 = $http.post(CONFIG.APIURL+'turismoreceptoroapi/guardarseccionviajegrupo', $rootScope.receptor_off[i].section_4,{'content-type':'application/json',});
                            $q.all([section4]).then(data => {
                              let success=data[0].data.success;
                              if(success==true){
                                $rootScope.receptor_off[i].lastLoad=4;
                                $rootScope.receptor_off[i].section_4.isUpload=true;
                                $rootScope.receptor_off[i].section_4.sw=0;
                                if($rootScope.receptor_off[i].section_4.errores){
                                  delete $rootScope.receptor_off[i].section_4.errores;
                                }
                                if($rootScope.receptor_off[i].section_5){  
                                  $rootScope.receptor_off[i].section_5.id=$rootScope.receptor_off[i].id;
                                  let section5 = $http.post(CONFIG.APIURL+'turismoreceptoroapi/guardargastos', $rootScope.receptor_off[i].section_5,{'content-type':'application/json',});
                                  $q.all([section5]).then(data => {
                                    let success=data[0].data.success;
                                    if(success==true){
                                      $rootScope.receptor_off[i].lastLoad=5;
                                      $rootScope.receptor_off[i].section_5.isUpload=true;
                                      if($rootScope.receptor_off[i].section_5.errores){
                                        delete $rootScope.receptor_off[i].section_5.errores;
                                      }
                                      if($rootScope.receptor_off[i].section_6){  
                                        $rootScope.receptor_off[i].section_6.Id=$rootScope.receptor_off[i].id;
                                        let section6 = $http.post(CONFIG.APIURL+'turismoreceptoroapi/guardarseccionpercepcion', $rootScope.receptor_off[i].section_6,{'content-type':'application/json',});
                                        $q.all([section6]).then(data => {
                                          let success=data[0].data.success;
                                          if(success==true){
                                            $rootScope.receptor_off[i].lastLoad=6;
                                            $rootScope.receptor_off[i].section_6.isUpload=true;
                                            $rootScope.receptor_off[i].section_6.sw=0;
                                            if($rootScope.receptor_off[i].section_6.errores){
                                              delete $rootScope.receptor_off[i].section_6.errores;
                                            }
                                            if($rootScope.receptor_off[i].section_7){  
                                              $rootScope.receptor_off[i].section_7.Id=$rootScope.receptor_off[i].id;
                                              let section7 = $http.post(CONFIG.APIURL+'turismoreceptoroapi/guardarseccioninformacion', $rootScope.receptor_off[i].section_7,{'content-type':'application/json',});
                                              $q.all([section7]).then(data => {
                                                let success=data[0].data.success;
                                                if(success==true){
                                                  $rootScope.receptor_off[i].lastLoad=7;
                                                  $rootScope.receptor_off[i].section_7.isUpload=true;
                                                  $rootScope.receptor_off[i].section_7.sw=0;
                                                  $rootScope.receptor_off[i].codigo=data[0].data.codigo;
                                                  if($rootScope.receptor_off[i].section_7.errores){
                                                    delete $rootScope.receptor_off[i].section_7.errores;
                                                  }
                                                  $scope.toDelete.push(i);
                                                }else{
                                                 $rootScope.receptor_off[i].section_7.errores = data[0].data.errores;
                                                }
                                                $ionicLoading.hide();
                                                localStorage.setItem("receptor_off",JSON.stringify($rootScope.receptor_off));
                                              }).catch(reason => {
                                                $ionicLoading.hide(); 
                                                ionicToast.show("Error interno del servidor",'middle', false, 5000);
                                              });
                                            }else{
                                              $ionicLoading.hide();
                                            }
                                          }else{
                                           $rootScope.receptor_off[i].section_6.errores = data[0].data.errores;
                                           $ionicLoading.hide();
                                          }
                                          localStorage.setItem("receptor_off",JSON.stringify($rootScope.receptor_off));
                                        }).catch(reason => {
                                          $ionicLoading.hide(); 
                                          ionicToast.show("Error interno del servidor",'middle', false, 5000);
                                        });
                                      }else{
                                        $ionicLoading.hide();
                                      }
                                    }else{
                                     $rootScope.receptor_off[i].section_5.errores = data[0].data.errores;
                                     $ionicLoading.hide();
                                    }
                                    localStorage.setItem("receptor_off",JSON.stringify($rootScope.receptor_off));
                                  }).catch(reason => {
                                    $ionicLoading.hide(); 
                                    ionicToast.show("Error interno del servidor",'middle', false, 5000);
                                  });
                                }else{
                                  $ionicLoading.hide();
                                }
                              }else{
                               $rootScope.receptor_off[i].section_4.errores = data[0].data.errores;
                               $ionicLoading.hide();
                              }
                              localStorage.setItem("receptor_off",JSON.stringify($rootScope.receptor_off));
                            }).catch(reason => {
                              $ionicLoading.hide(); 
                              ionicToast.show("Error interno del servidor",'middle', false, 5000);
                            });
                          }else{
                            $ionicLoading.hide();
                          }
                        }else{
                         $rootScope.receptor_off[i].section_3.errores = data[0].data.errores;
                         $ionicLoading.hide();
                        }
                        localStorage.setItem("receptor_off",JSON.stringify($rootScope.receptor_off));
                      }).catch(reason => {
                        $ionicLoading.hide(); 
                        ionicToast.show("Error interno del servidor",'middle', false, 5000);
                      });
                    }else{
                      $ionicLoading.hide();
                    }
                  }else{
                   $rootScope.receptor_off[i].section_2.errores = data[0].data.errores;
                   $ionicLoading.hide();
                  }

                  localStorage.setItem("receptor_off",JSON.stringify($rootScope.receptor_off));
                }).catch(reason => {
                  $ionicLoading.hide(); 
                  ionicToast.show("Error interno del servidor",'middle', false, 5000);
                });
              }else{
                $ionicLoading.hide();
              }
            }else{
             $rootScope.receptor_off[i].section_1.errores = data[0].data.errores;
             $ionicLoading.hide();
            }
            
            localStorage.setItem("receptor_off",JSON.stringify($rootScope.receptor_off));
          }).catch(reason => {
            $ionicLoading.hide(); 
            ionicToast.show("Error interno del servidor",'middle', false, 5000);
          });
        }
      }
    }
  }

  $scope.deleted=function (idx) {
    $ionicPopup.confirm({
       title: 'Eliminara esta encuesta, y no podrá subirla despues',
       template: '¿Seguro que desea hacerlo?', 
       buttons: [
           {text:'No', type: 'button-stable',},
           {
            text:'Si',type: 'button-stable', 
            onTap: function(e) {
              $rootScope.receptor_off.splice(idx,1);
              localStorage.setItem("receptor_off",JSON.stringify($rootScope.receptor_off));
              ionicToast.show("Se elimino la encuesta",'top', false, 5000);
            }  
          }
        ]
    });
  };

  $scope.eliminar=function () {
    ionicToast.show("Las encuestas totalmente cargadas se han eliminado",'top', false, 5000);
    for (let i = $rootScope.receptor_off.length-1; i >=0; i--) {
      if($rootScope.receptor_off[i].lastLoad==7){
        $rootScope.receptor_off.splice(i,1);
      }
    }
    localStorage.setItem("receptor_off",JSON.stringify($rootScope.receptor_off));
  };

  $scope.doRefresh=function () {
    if ($cordovaNetwork.getNetwork() == 'none' || $cordovaNetwork.getNetwork() == 'unknown') {
      ionicToast.show("No tiene conexion, no podra ver la lista de encuestas",'top', false, 5000);
      $scope.$broadcast('scroll.refreshComplete');

    }else{
      turismoReceptor.encuestas().then(function (data) {
        $scope.encuestas=data;
        $scope.$broadcast('scroll.refreshComplete');
        for (let i = 0; i < $scope.encuestas.length; i++) {
          if ($scope.encuestas[i].estadoid > 0 && $scope.encuestas[i].estadoid < 7) {
              $scope.encuestas[i].Filtro = 'sincalcular';
          } else {
              $scope.encuestas[i].Filtro = 'calculadas';
          }
        }      
      }, 
      function (error, data) {
        $scope.$broadcast('scroll.refreshComplete');
        let alertPopup =$ionicPopup.alert({
            title: '¡Error!',
            template: 'Ha ocurrido un error.',
            okType:'button-stable'
        });
      });
    }
  };

  $scope.actionSheet=function (id, last_section, is_offline) {
    let buttonsAction=[];

    for(let i=0; i<last_section; i++){
      switch(i) {
        case 0:
          buttonsAction.push( {text: '<i class="icon ion ion-information-circled positive"></i> Información General' });
        break;

        case 1:
          buttonsAction.push( {text: '<i class="icon ion ion-clock positive"></i> Estancia' });
        break;

        case 2:
          buttonsAction.push( {text: '<i class="icon ion ion-model-s positive"></i> Transporte' });
        break;

        case 3:
          buttonsAction.push( {text: '<i class="icon ion ion-ios-people positive"></i> Viaje en grupo' });
        break;

        case 4:
          buttonsAction.push( {text: '<i class="icon ion ion-cash positive"></i> Gastos de viaje' });
        break;

        case 5:
          buttonsAction.push( {text: '<i class="icon ion ion-person-add positive"></i> Percepción de viaje' });
        break;

        case 6:
          buttonsAction.push( {text: '<i class="icon ion ion-speakerphone positive"></i> Como se enteran?' });
        break;
      }
    }
    $ionicActionSheet.show({
      titleText: '<h4>¡Ir a...!</h4>',
      buttons: buttonsAction,
      cancelText: '<i class="icon ion-android-close assertive"></i> Cancelar',
      cancel: function() {},
      buttonClicked: function(index) {
        switch(index) {
          case 0:
            $location.path("/app/editGeneral/"+id+"/"+is_offline).search({'lastSection':last_section});
          break;

          case 1:
            $location.path("/app/estancia/"+id+"/"+is_offline).search({'lastSection':last_section});
          break;

          case 2:
            $location.path("/app/transporte/"+id+"/"+is_offline).search({'lastSection':last_section});
          break;

          case 3:
            $location.path("/app/grupo/"+id+"/"+is_offline).search({'lastSection':last_section});
          break;

          case 4:
            $location.path("/app/gastos/"+id+"/"+is_offline).search({'lastSection':last_section});
          break;

          case 5:
            $location.path("/app/percepcion/"+id+"/"+is_offline).search({'lastSection':last_section});
          break;

          case 6:
            $location.path("/app/enteran/"+id+"/"+is_offline).search({'lastSection':last_section});
          break;
        }
        return true;
      },
    });
  }
})

.controller('generalController', function($scope, turismoReceptor, $ionicLoading, $ionicPopup, ionicToast, $ionicScrollDelegate, $state, $filter, $location, $rootScope, $cordovaNetwork, factories) {
  
  $scope.encuesta = {};
  $scope.forms={};
  $scope.is_offline=0;
  $scope.pais_residencia2={};
  $scope.departamento2={};
  $scope.departamentod = {};
  $scope.departamentod2 = {};
  $scope.this_section=1;


  if(localStorage.getItem("loader_receptor")!=null){
    $rootScope.loader_receptor=JSON.parse(localStorage.getItem("loader_receptor"));
  }else{
    $rootScope.loader_receptor={};
  }

  if(localStorage.getItem("receptor_off")!=null){
    $rootScope.receptor_off=JSON.parse(localStorage.getItem("receptor_off"));
  }else{
    $rootScope.receptor_off=[];
  }

  $ionicLoading.show({
    template: '<ion-spinner></ion-spinner> Espere por favor...',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });

  if ($cordovaNetwork.getNetwork() == 'none'|| $cordovaNetwork.getNetwork() == 'unknown') {
    $scope.is_offline=1;
    $ionicLoading.hide();

    if(localStorage.getItem("loader_receptor")==null){
      ionicToast.show("No hay elementos precargados, no se podrá realizar la encuesta",'middle', false, 5000);
    }else{
      ionicToast.show("No tiene conexion, pero hay elementos precargados, puede continuar",'middle', false, 5000);
      if($rootScope.loader_receptor.general){
        let data= $rootScope.loader_receptor.general;
        $scope.grupos = data.grupos;
        $scope.encuestadores = data.encuestadores;
        $scope.lugares = data.lugar_nacimiento;
        $scope.paises = data.paises;
        $scope.motivos = data.motivos;
        $scope.medicos = data.medicos;
        $scope.departamentos_colombia = data.departamentos;
        $scope.lugares_aplicacion = data.lugares_aplicacion;
        $scope.all_departamentos = data.all_departamentos;
        $scope.all_municipios = data.all_municipios;
      }else{
        ionicToast.show("No hay elementos precargados, no se podrá realizar la encuesta",'middle', false, 5000);
      }
    }  
  }else{

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
        $scope.all_departamentos = data.all_departamentos;
        $scope.all_municipios = data.all_municipios;
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


  $scope.changedepartamento = function (id) {
    
    $scope.departamento = {};
    $scope.encuesta.municipio={};
    if ($cordovaNetwork.getNetwork() == 'none'|| $cordovaNetwork.getNetwork() == 'unknown') {
      $scope.departamentos=factories.findSelectMultipleId(id,  $scope.all_departamentos);
    }else{
      $ionicLoading.show({
        template: '<ion-spinner></ion-spinner> Espere por favor...',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
      
      $scope.departamentos = [];
      if (id != null) {
        turismoReceptor.departamento(id).then(function (data) {
            $ionicLoading.hide();
            $scope.departamentos = data;
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
  };

  $scope.changemunicipio = function (id) {
    $scope.encuesta.Municipio = "";
    $scope.encuesta.municipio={};
    $scope.municipios = [];
    if ($cordovaNetwork.getNetwork() == 'none'|| $cordovaNetwork.getNetwork() == 'unknown') {
      $scope.municipios = factories.findSelectMultipleDpts(id, $scope.all_municipios);
    }else{
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
          let alertPopup =$ionicPopup.alert({
              title: '¡Error!',
              template: 'Ha ocurrido un error.',
              okType:'button-stable'
          });
        });
      }
    }
  };

  $scope.changemunicipiocolombia = function (id) {
    $scope.encuesta.Destino = "";
    $scope.encuesta.destino = {};
    $scope.municipios_colombia = [];
    if ($cordovaNetwork.getNetwork() == 'none'|| $cordovaNetwork.getNetwork() == 'unknown') {
      $scope.municipios_colombia = factories.findSelectMultipleDpts(id, $scope.all_municipios);
    }else{
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
          
          $scope.municipios_colombia = data;
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

  $scope.updatedDptoRes=function (dpto) {
    $scope.departamento2=dpto;
  };

  $scope.updatedPaisRes=function (pais) {
    $scope.pais_residencia2=pais;
  };

  $scope.updatedDptoDes=function (dpto) {
    $scope.departamentod2=dpto;
  }

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

    if($filter('date')($scope.encuesta.Salida, 'yyyy-MM-dd') <  $filter('date')($scope.encuesta.Llegada, 'yyyy-MM-dd')){
      ionicToast.show("La fecha de Salida no puede ser menor a la fecha de llegada",'middle', false, 5000);
      $ionicScrollDelegate.scrollTop(true);
      return;
    }

    $scope.encuesta.fechaAplicacion=$filter('date')($scope.encuesta.fechaAplicacion, 'yyyy-MM-dd HH:mm');
    $scope.encuesta.Llegada=$filter('date')($scope.encuesta.Llegada, 'yyyy-MM-dd');
    $scope.encuesta.Salida=$filter('date')($scope.encuesta.Salida, 'yyyy-MM-dd');

    if ($cordovaNetwork.getNetwork() == 'none'|| $cordovaNetwork.getNetwork() == 'unknown') {
      $scope.encuesta.pais_residencia=$scope.pais_residencia2;
      $scope.encuesta.departamento=$scope.departamento2;
      $scope.encuesta.departamentod=$scope.departamentod2;
      $scope.encuesta.last_section=1;
      $rootScope.receptor_off.push({'section_1':$scope.encuesta});
      $rootScope.receptor_off[$rootScope.receptor_off.length-1].last_section=1;
      localStorage.setItem("receptor_off",JSON.stringify($rootScope.receptor_off));
      ionicToast.show("Se almacenó la sección para sincronización",'top', false, 5000);
      $location.path("/app/estancia/"+($rootScope.receptor_off.length-1)+"/1").search({'lastSection':1});
    }else{
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
            $location.path("/app/encuestas");
          } else {
            $location.path("/app/estancia/"+data.id+"/"+$scope.is_offline).search({'lastSection':1});
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
    }
  };
})

.controller('editGeneralController', function($scope, turismoReceptor, $ionicLoading, $ionicPopup, ionicToast, $ionicScrollDelegate, $state, $filter, $location, $stateParams, factories, $rootScope, $cordovaNetwork) {
  $scope.encuesta = {};
  $scope.forms={};
  $scope.departamentod = {};
  $scope.departamentod2 = {};
  $scope.id=$stateParams.id;
  $scope.pais_residencia2={};
  $scope.departamento2={};
  $scope.is_offline=$stateParams.isOff;
  $scope.this_section=1;
  $scope.last_section=parseInt($location.search().lastSection);

  $ionicLoading.show({
    template: '<ion-spinner></ion-spinner> Espere por favor...',
    animation: 'fade-in',
    showBackdrop: true,
    maxWidth: 200,
    showDelay: 0
  });

  if(localStorage.getItem("loader_receptor")!=null){
    $rootScope.loader_receptor=JSON.parse(localStorage.getItem("loader_receptor"));
  }else{
    $rootScope.loader_receptor={};
  }
  
  if(localStorage.getItem("receptor_off")!=null){
    $rootScope.receptor_off=JSON.parse(localStorage.getItem("receptor_off"));
  }else{
    $rootScope.receptor_off=[];
  }
  if ($cordovaNetwork.getNetwork() == 'none'|| $cordovaNetwork.getNetwork() == 'unknown' || $scope.is_offline==1) {
    $scope.is_offline=1;
    $ionicLoading.hide();

    if(localStorage.getItem("loader_receptor")==null){
      ionicToast.show("No hay elementos precargados, no se podrá realizar la encuesta",'middle', false, 5000);
    }else{

      if($rootScope.loader_receptor.general){
        ionicToast.show("No tiene conexion, pero hay elementos precargados, puede continuar",'middle', false, 5000);
        let data= $rootScope.loader_receptor.general;
        $scope.grupos = data.grupos;
        $scope.encuestadores = data.encuestadores;
        $scope.lugares = data.lugar_nacimiento;
        $scope.paises = data.paises;
        $scope.motivos = data.motivos;
        $scope.medicos = data.medicos;
        $scope.departamentos_colombia = data.departamentos;
        $scope.lugares_aplicacion = data.lugares_aplicacion;
        $scope.all_departamentos = data.all_departamentos;
        $scope.all_municipios = data.all_municipios;
        $scope.encuesta = $rootScope.receptor_off[$stateParams.id].section_1;
        $scope.pais_residencia=$scope.encuesta.pais_residencia;
        $scope.departamento=$scope.encuesta.departamento;
        $scope.departamentod=$scope.encuesta.departamentod;
        $scope.pais_residencia2=$scope.encuesta.pais_residencia;
        $scope.departamento2=$scope.encuesta.departamento;
        $scope.departamentod2=$scope.encuesta.departamentod;
        $scope.encuesta.Sexo=Boolean($scope.encuesta.Sexo); 
        $scope.encuesta.Municipio=$scope.encuesta.municipio.id;
        if($rootScope.receptor_off[$stateParams.id].section_1 && $rootScope.receptor_off[$stateParams.id].section_1.errores){
          $scope.errores = $rootScope.receptor_off[$stateParams.id].section_1.errores;
        }
      }else{
        ionicToast.show("No hay elementos precargados, no se podrá realizar la encuesta",'middle', false, 5000);
      }
    }  
  }else{
    turismoReceptor.cargareditardatos($stateParams.id).then(function (data) {
        $ionicLoading.hide();
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
          let split1 = data.visitante.fechaAplicacion.split(" ");
          let split2 = split1[1].split(":");
          split1 = split1[0].split("-");
          let fechaAp = new Date(split1[0], split1[1] - 1, split1[2],split2[0],split2[1]);
          $scope.encuesta.fechaAplicacion = fechaAp;    
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
  }
  
  $scope.changedepartamento = function (id) {
    $scope.encuesta.municipio={};
    if ($cordovaNetwork.getNetwork() == 'none'|| $cordovaNetwork.getNetwork() == 'unknown' || $scope.is_offline==1) {
      $scope.departamentos=factories.findSelectMultipleId(id,  $scope.all_departamentos);
    }else{
      $ionicLoading.show({
        template: '<ion-spinner></ion-spinner> Espere por favor...',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
      
      $scope.departamentos = [];
      if (id != null) {
        turismoReceptor.departamento(id).then(function (data) {
            $ionicLoading.hide();
            $scope.departamentos = data;
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
  };

  $scope.changemunicipio = function (id) {
    $scope.encuesta.Municipio = "";
    $scope.municipios = [];
    $scope.encuesta.municipio={};
    if ($cordovaNetwork.getNetwork() == 'none'|| $cordovaNetwork.getNetwork() == 'unknown' || $scope.is_offline==1) {
      $scope.municipios = factories.findSelectMultipleDpts(id, $scope.all_municipios);
    }else{
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
          let alertPopup =$ionicPopup.alert({
              title: '¡Error!',
              template: 'Ha ocurrido un error.',
              okType:'button-stable'
          });
        });
      }
    }
  };

  $scope.changemunicipiocolombia = function (id) {
    $scope.encuesta.Destino = "";
    $scope.encuesta.destino = {};
    $scope.municipios_colombia = [];
    if ($cordovaNetwork.getNetwork() == 'none'|| $cordovaNetwork.getNetwork() == 'unknown' || $scope.is_offline==1) {
      $scope.municipios_colombia = factories.findSelectMultipleDpts(id, $scope.all_municipios);
    }else{
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
          
          $scope.municipios_colombia = data;
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

  $scope.updatedDptoRes=function (dpto) {
    $scope.departamento2=dpto;
  };

  $scope.updatedPaisRes=function (pais) {
    $scope.pais_residencia2=pais;
  };

  $scope.updatedDptoDes=function (dpto) {
    $scope.departamentod2=dpto;
  }
  
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

    if($filter('date')($scope.encuesta.Salida, 'yyyy-MM-dd') <  $filter('date')($scope.encuesta.Llegada, 'yyyy-MM-dd')){
      ionicToast.show("La fecha de Salida no puede ser menor a la fecha de llegada",'middle', false, 5000);
      $ionicScrollDelegate.scrollTop(true);
      return;
    }

    $scope.encuesta.fechaAplicacion=$filter('date')($scope.encuesta.fechaAplicacion, 'yyyy-MM-dd HH:mm');
    $scope.encuesta.Llegada=$filter('date')($scope.encuesta.Llegada, 'yyyy-MM-dd');
    $scope.encuesta.Salida=$filter('date')($scope.encuesta.Salida, 'yyyy-MM-dd');

    if ($cordovaNetwork.getNetwork() == 'none'|| $cordovaNetwork.getNetwork() == 'unknown' || $scope.is_offline==1) {
      $scope.encuesta.pais_residencia=$scope.pais_residencia2;
      $scope.encuesta.departamento=$scope.departamento2;
      $scope.encuesta.departamentod=$scope.departamentod2;
      $rootScope.receptor_off[$stateParams.id].section_1=$scope.encuesta;
      localStorage.setItem("receptor_off",JSON.stringify($rootScope.receptor_off));
      ionicToast.show("Se almacenó la sección para sincronización",'top', false, 5000);
      $location.path("/app/estancia/"+$stateParams.id+"/1")
    }else{
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
            $location.path("/app/encuestas");
          } else {
            $location.path("/app/estancia/"+$stateParams.id+"/"+$scope.is_offline).search({'lastSection':$scope.last_section});
            
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
    }
  };  
})

.controller('estanciaController', function($scope, turismoReceptor, $ionicLoading, $ionicPopup, ionicToast, $ionicScrollDelegate, $state, $filter, $location, $stateParams, factories, $rootScope, $cordovaNetwork) {

  $scope.encuesta = {};
  $scope.encuesta.ActividadesRelizadas=[];
  $scope.encuesta.Estancias = [];
  $scope.forms={};
  $scope.id=$stateParams.id;
  $scope.is_offline=$stateParams.isOff;
  $scope.this_section=2;
  $scope.last_section=parseInt($location.search().lastSection);


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

  $scope.toggleSelection2 = function (id, Respuestas) {

    let idx = Respuestas.indexOf(id);
    
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
    let resultado = $filter('filter')($scope.encuesta.ActividadesRelizadas, {'id':18}, true);
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
    
    if($scope.encuesta.ActividadesRelizadas){
      let resultado = $filter('filter')($scope.encuesta.ActividadesRelizadas, {'id':19}, true);
      if(resultado.length > 0){
        return true;   
      }    
    }
    return false;
  }

  $scope.validarOtroActividad = function(activ){
    if(activ.otroActividad != undefined && activ.otroActividad != '' && $scope.encuesta.ActividadesRelizadas != undefined){
      let resultado = $filter('filter')($scope.encuesta.ActividadesRelizadas, {'id':19}, true);
      if(resultado.length == 0){
        let seleccion = $filter('filter')($scope.Datos.Actividadesrelizadas, {'id':19}, true);
        $scope.encuesta.ActividadesRelizadas.push(seleccion[0]);    
      }
    }
  };

  $scope.Validar = function () {
    if($scope.encuesta.ActividadesRelizadas.length == 0){
      return true;
    }
    for(let i = 0; i < $scope.encuesta.ActividadesRelizadas.length; i++){
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
    
    if($scope.is_offline==1){
      $rootScope.receptor_off[$stateParams.id].section_2=$scope.encuesta;
      if($scope.last_section<$scope.this_section){
        $scope.last_section++;
      }
      $rootScope.receptor_off[$scope.id].last_section=$scope.last_section;
      localStorage.setItem("receptor_off",JSON.stringify($rootScope.receptor_off));
      ionicToast.show("Se almacenó la sección para sincronización",'top', false, 5000);
      $location.path("/app/transporte/"+$stateParams.id+"/"+$scope.is_offline).search({'lastSection':$scope.last_section});
    }else{
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
          if($scope.last_section<$scope.this_section){
            $scope.last_section++;
          }
          $location.path("/app/transporte/"+$scope.encuesta.Id+"/"+$scope.is_offline).search({'lastSection':$scope.last_section});
          
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
 
  if(localStorage.getItem("loader_receptor")!=null){
    $rootScope.loader_receptor=JSON.parse(localStorage.getItem("loader_receptor"));
  }else{
    $rootScope.loader_receptor={};
  }
  
  if(localStorage.getItem("receptor_off")!=null){
    $rootScope.receptor_off=JSON.parse(localStorage.getItem("receptor_off"));
  }else{
    $rootScope.receptor_off=[];
  }

  if($cordovaNetwork.getNetwork() == 'none'|| $cordovaNetwork.getNetwork() == 'unknown' || $scope.is_offline==1){
    if($rootScope.loader_receptor.estancia){
      let data= $rootScope.loader_receptor.estancia;
      $scope.Datos = data;
      if($rootScope.receptor_off[$stateParams.id].section_2){
        $scope.encuesta=$rootScope.receptor_off[$stateParams.id].section_2;
        if($rootScope.receptor_off[$stateParams.id].section_2 && $rootScope.receptor_off[$stateParams.id].section_2.errores){
          $scope.errores = $rootScope.receptor_off[$stateParams.id].section_2.errores;
        }
      }
    }else{
      ionicToast.show("No hay elementos precargados, no se podrá realizar la encuesta",'middle', false, 5000)
    }

  }else{
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
          $rootScope.loader_receptor.estancia=data.Enlaces;
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
      let alertPopup =$ionicPopup.alert({
          title: '¡Error!',
          template: 'Ha ocurrido un error.',
          okType:'button-stable'
      });
    });
  }
})

.controller('transporteController', function($scope, turismoReceptor, $ionicLoading, $ionicPopup, ionicToast, $ionicScrollDelegate, $state, $filter, $location, $stateParams, $rootScope, $cordovaNetwork) {
  $scope.transporte = {};
  $scope.forms={};
  $scope.id=$stateParams.id;
  $scope.is_offline=$stateParams.isOff;
  $scope.this_section=3;
  $scope.last_section=parseInt($location.search().lastSection);


  if(localStorage.getItem("loader_receptor")!=null){
    $rootScope.loader_receptor=JSON.parse(localStorage.getItem("loader_receptor"));
  }else{
    $rootScope.loader_receptor={};
  }

  if(localStorage.getItem("receptor_off")!=null){
    $rootScope.receptor_off=JSON.parse(localStorage.getItem("receptor_off"));
  }else{
    $rootScope.receptor_off=[];
  }

  if($cordovaNetwork.getNetwork() == 'none'|| $cordovaNetwork.getNetwork() == 'unknown' || $scope.is_offline==1){
    if($rootScope.loader_receptor.transporte){
      let data= $rootScope.loader_receptor.transporte;
      $scope.transportes = data.transporte_llegar;
      $scope.lugares = data.lugares;
      if($rootScope.receptor_off[$stateParams.id].section_3){
        $scope.transporte=$rootScope.receptor_off[$stateParams.id].section_3;
        if($rootScope.receptor_off[$stateParams.id].section_3 && $rootScope.receptor_off[$stateParams.id].section_3.errores){
          $scope.errores = $rootScope.receptor_off[$stateParams.id].section_3.errores;
        }
      }   
    }else{
      ionicToast.show("No hay elementos precargados, no se podrá realizar la encuesta",'middle', false, 5000);
    }
  }else{
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
      let alertPopup =$ionicPopup.alert({
          title: '¡Error!',
          template: 'Ha ocurrido un error.',
          okType:'button-stable'
      });
    });
  }

  $scope.guardar = function () {

    if (!$scope.forms.transForm.$valid) {
      ionicToast.show("Complete los campos del formulario",'middle', false, 2000);
      return;
    }

    if($scope.is_offline==1){
      $rootScope.receptor_off[$stateParams.id].section_3=$scope.transporte;
      if($scope.last_section<$scope.this_section){
        $scope.last_section++;
      }
      $rootScope.receptor_off[$scope.id].last_section=$scope.last_section;
      localStorage.setItem("receptor_off",JSON.stringify($rootScope.receptor_off));
      ionicToast.show("Se almacenó la sección para sincronización",'top', false, 5000);
      $location.path("/app/grupo/"+$stateParams.id+"/"+$scope.is_offline).search({'lastSection':$scope.last_section});
    }else{
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
          if($scope.last_section<$scope.this_section){
            $scope.last_section++;
          }
          $location.path("/app/grupo/"+$stateParams.id+"/"+$scope.is_offline).search({'lastSection':$scope.last_section});
          
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
  };
})

.controller('grupoController', function($scope, turismoReceptor, $ionicLoading, $ionicPopup, ionicToast, $ionicScrollDelegate, $state, $filter, $location, $stateParams, $rootScope, $cordovaNetwork) {
	$scope.grupo = {};
	$scope.grupo.Personas=[];
	$scope.forms={};
  $scope.id=$stateParams.id;
  $scope.is_offline=$stateParams.isOff;
  $scope.this_section=4;
  $scope.last_section=parseInt($location.search().lastSection);

  if(localStorage.getItem("loader_receptor")!=null){
    $rootScope.loader_receptor=JSON.parse(localStorage.getItem("loader_receptor"));
  }else{
    $rootScope.loader_receptor={};
  }

  if(localStorage.getItem("receptor_off")!=null){
    $rootScope.receptor_off=JSON.parse(localStorage.getItem("receptor_off"));
  }else{
    $rootScope.receptor_off=[];
  }

  if($cordovaNetwork.getNetwork() == 'none'|| $cordovaNetwork.getNetwork() == 'unknown' || $scope.is_offline==1){
    if($rootScope.loader_receptor.grupo){
      let data = $rootScope.loader_receptor.grupo;
      $scope.viaje_grupos = data.viaje_grupos;
      if($rootScope.receptor_off[$stateParams.id].section_4){
        $scope.grupo=$rootScope.receptor_off[$stateParams.id].section_4;
        if($rootScope.receptor_off[$stateParams.id].section_4 && $rootScope.receptor_off[$stateParams.id].section_4.errores){
          $scope.errores = $rootScope.receptor_off[$stateParams.id].section_4.errores;
        }
      }
    }else{
      ionicToast.show("No hay elementos precargados, no se podrá realizar la encuesta",'middle', false, 5000);
    }
  }else{
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
      let alertPopup =$ionicPopup.alert({
          title: '¡Error!',
          template: 'Ha ocurrido un error.',
          okType:'button-stable'
      });
    });
  }

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
        let i = $scope.grupo.Personas.indexOf(1);
        if (i != -1) {
          $scope.grupo.Personas.splice(i, 1);
        }
      }
    }
  };

  $scope.verificarOtro = function () {
    let i = $scope.grupo.Personas.indexOf(12);
    if ($scope.grupo.Otro != null && $scope.grupo.Otro != '') {
      if (i == -1) {
        $scope.grupo.Personas.push(12);
      }
	  }
  };

  $scope.vchek = function (id) {
    if (id == 12) {
      let i = $scope.grupo.Personas.indexOf(12);
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
    
    let dataValue = angular.element($event.target).attr("disabled");;
    if(dataValue!=="disabled"){
      let idx = $scope.grupo.Personas.indexOf(id);
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

    if($scope.is_offline==1){
      $rootScope.receptor_off[$stateParams.id].section_4=$scope.grupo;
      if($scope.last_section<$scope.this_section){
        $scope.last_section++;
      }
      $rootScope.receptor_off[$scope.id].last_section=$scope.last_section;
      localStorage.setItem("receptor_off",JSON.stringify($rootScope.receptor_off));
      ionicToast.show("Se almacenó la sección para sincronización",'top', false, 5000);
      $location.path("/app/gastos/"+$stateParams.id+"/"+$scope.is_offline).search({'lastSection':$scope.last_section});
    }else{

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
          if($scope.last_section<$scope.this_section){
            $scope.last_section++;
          }
          $location.path("/app/gastos/"+$stateParams.id+"/"+$scope.is_offline).search({'lastSection':$scope.last_section});
          
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
  };
})

.controller('gastosController', function($scope, turismoReceptor, $ionicLoading, $ionicPopup, ionicToast, $ionicScrollDelegate, $state, $filter, $location, $stateParams, factories, $rootScope, $cordovaNetwork) {

  $scope.id=$stateParams.id;
  $scope.encuestaReceptor = {};
  $scope.abrirAlquiler = false;
  $scope.abrirTerrestre = false;
  $scope.abrirRopa = false;
  $scope.encuestaReceptor.Municipios=[];
  $scope.encuestaReceptor.ServiciosIncluidos=[];
  $scope.forms={};
  $scope.is_offline=$stateParams.isOff;
  $scope.rubros=[];
  $scope.this_section=5;
  $scope.last_section=$location.search().lastSection;
  $scope.encuestaReceptor.Financiadores=[];

  if(localStorage.getItem("loader_receptor")!=null){
    $rootScope.loader_receptor=JSON.parse(localStorage.getItem("loader_receptor"));
  }else{
    $rootScope.loader_receptor={};
  }

  if(localStorage.getItem("receptor_off")!=null){
    $rootScope.receptor_off=JSON.parse(localStorage.getItem("receptor_off"));
  }else{
    $rootScope.receptor_off=[];
  }

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
      let aux = [];
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
    for(let i=0; i<municipios.length; i++){
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
     for(let i = 0; i<$scope.rubros.length;i++){
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
    let idx = $scope.encuestaReceptor.ServiciosIncluidos.indexOf(id);
    
    if (idx > -1) {
      $scope.encuestaReceptor.ServiciosIncluidos.splice(idx, 1);
    }
    else {
      $scope.encuestaReceptor.ServiciosIncluidos.push(id);
    }
  };

  $scope.toggleSelection2 = function (id) {
    let idx = $scope.encuestaReceptor.Financiadores.indexOf(id);
    
    if (idx > -1) {
      $scope.encuestaReceptor.Financiadores.splice(idx, 1);
    }
    else {
      $scope.encuestaReceptor.Financiadores.push(id);
    }
  };

  $scope.verificarOtro = function () {
        
    let i = $scope.encuestaReceptor.Financiadores.indexOf(11)
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

  if($cordovaNetwork.getNetwork() == 'none'|| $cordovaNetwork.getNetwork() == 'unknown' || $scope.is_offline==1){
    
    if($rootScope.loader_receptor.gastos){
      let data = $rootScope.loader_receptor.gastos;
      $scope.divisas = data.divisas;
      $scope.financiadores = data.financiadores;
      $scope.municipios = data.municipios;
      $scope.opciones = data.opciones;
      $scope.servicios = data.servicios;
      $scope.tipos = data.tipos;
      $scope.rubros = data.rubros;
      if($rootScope.receptor_off[$stateParams.id].section_5){
        $scope.encuestaReceptor = $rootScope.receptor_off[$stateParams.id].section_5;
        if($rootScope.receptor_off[$stateParams.id].section_5 && $rootScope.receptor_off[$stateParams.id].section_5.errores){
          $scope.errores = $rootScope.receptor_off[$stateParams.id].section_5.errores;
        }


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


        let rubros = $rootScope.receptor_off[$stateParams.id].section_5.Rubros;
        for(let i=0; i<rubros.length;i++){
          for (let j = 0; j < $scope.rubros.length; j++) {
            if(rubros[i].id==$scope.rubros[j].id){
              $scope.rubros[j].gastos_visitantes=rubros[i].gastos_visitantes;
            } 
          }
        }

        for(let i = 0; i<$scope.rubros.length;i++){
          $scope.cambiarAlquiler($scope.rubros[i]);
          if($scope.rubros[i].gastos_visitantes[0]){
            $scope.rubros[i].gastos_visitantes[0].divisas_magdalena_obj=factories.findSelect($scope.rubros[i].gastos_visitantes[0].divisas_magdalena,data.divisas)
          }
         } 
      }
    }else{
      ionicToast.show("No hay elementos precargados, no se podrá realizar la encuesta",'middle', false, 5000);
    }
  }else{

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
     
      for(let i = 0; i<$scope.rubros.length;i++){
        $scope.cambiarAlquiler($scope.rubros[i]);
        if($scope.rubros[i].gastos_visitantes[0]){
          $scope.rubros[i].gastos_visitantes[0].divisas_magdalena_obj=factories.findSelect($scope.rubros[i].gastos_visitantes[0].divisas_magdalena,data.divisas)
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
  }

  $scope.guardar = function(){
        
    if(!$scope.forms.GastoForm.$valid){
      ionicToast.show("Complete los campos del formulario",'middle', false, 2000);
      return;
    }
    
    if($scope.encuestaReceptor.ViajoDepartamento ==1){    
      if($scope.encuestaReceptor.ServiciosIncluidos.length==0){
        ionicToast.show("Hay errores en el formulario, corrigelo",'middle', false, 2000);
        return;   
      }
    }

    if($scope.encuestaReceptor.Financiadores.length==0){
      ionicToast.show("Hay errores en el formulario, corrigelo",'middle', false, 2000);
      return;
    }
    
    $scope.encuestaReceptor.Rubros = [];
    for(let i = 0 ;i<$scope.rubros.length;i++){
      if($scope.rubros[i].gastos_visitantes.length>0){
        if($scope.rubros[i].gastos_visitantes[0] != null){
          if((($scope.rubros[i].gastos_visitantes[0].cantidad_pagada_magdalena != null && $scope.rubros[i].gastos_visitantes[0].divisas_magdalena != null) && $scope.rubros[i].gastos_visitantes[0].personas_cubiertas != null)|| $scope.rubros[i].gastos_visitantes[0].gastos_asumidos_otros != undefined  ){
            $scope.encuestaReceptor.Rubros.push($scope.rubros[i]);
          }
        }          
      }
    }

    if($scope.is_offline==1){
  
      delete $scope.encuestaReceptor.id;
      $rootScope.receptor_off[$stateParams.id].section_5=$scope.encuestaReceptor;
      if($scope.last_section<$scope.this_section){
        $scope.last_section++;
      } 
      $rootScope.receptor_off[$scope.id].last_section=$scope.last_section;
      localStorage.setItem("receptor_off",JSON.stringify($rootScope.receptor_off));
      ionicToast.show("Se almacenó la sección para sincronización",'top', false, 5000);
      $location.path("/app/percepcion/"+$stateParams.id+"/"+$scope.is_offline).search({'lastSection':$scope.last_section});
    }else{

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
          if($scope.last_section<$scope.this_section){
            $scope.last_section++;
          }     
          $location.path("/app/percepcion/"+$stateParams.id+"/"+$scope.is_offline).search({'lastSection':$scope.last_section});       
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
  }
})

.controller('percepcionController', function($scope, turismoReceptor, $ionicLoading, $ionicPopup, ionicToast, $ionicScrollDelegate, $state, $filter, $location, $stateParams, factories, $rootScope, $cordovaNetwork) {
  $scope.id=$stateParams.id;
  $scope.bandera = false;
  $scope.estadoEncuesta = null;
  $scope.calificacion = {'Elementos': [] };
  $scope.cal = {};
  $scope.calificacion.Evaluacion = [];
  $scope.forms={}
  $scope.aspectos = {'Items': [],'radios': {}};
  $scope.is_offline=$stateParams.isOff;
  $scope.this_section=6;
  $scope.last_section=parseInt($location.search().lastSection);


  if(localStorage.getItem("loader_receptor")!=null){
    $rootScope.loader_receptor=JSON.parse(localStorage.getItem("loader_receptor"));
  }else{
    $rootScope.loader_receptor={};
  }

  if(localStorage.getItem("receptor_off")!=null){
    $rootScope.receptor_off=JSON.parse(localStorage.getItem("receptor_off"));
  }else{
    $rootScope.receptor_off=[];
  }

  $scope.convertirObjeto = function(arreglo){
    if(arreglo != undefined){
      for(let i = 0; i < arreglo.length; i++){
        for(let j = 0; j < arreglo[i].items_evaluars.length; j++){
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
      for (let i = 0; i < $scope.aspectos.length; i++) {
        for (let j = 0; j < $scope.aspectos[i].items_evaluars.length; j++) {    
          if ($scope.aspectos[i].items_evaluars[j].radios!=null) {
            for (let k = inicio; k <= fin; k++) {
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
    for (let i = 0; i < $scope.aspectos.length; i++) {
      for (let j = 0; j < $scope.aspectos[i].items_evaluars.length; j++) {
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

    let dataValue = angular.element($event.target).attr("disabled");;
    if(dataValue!=="disabled"){

      let idx = $scope.calificacion.Elementos.indexOf(item);
      
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
        
    let i = $scope.calificacion.Elementos.indexOf(12)
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

  if($cordovaNetwork.getNetwork() == 'none'|| $cordovaNetwork.getNetwork() == 'unknown' || $scope.is_offline==1){
    
    if($rootScope.loader_receptor.percepcion){
      let data = $rootScope.loader_receptor.percepcion;
      $scope.aspectos = $scope.convertirObjeto(data.percepcion);
      $scope.elementos = data.elementos;
      $scope.veces = data.veces;
      $scope.actividades = data.actividades;
      if($rootScope.receptor_off[$stateParams.id].section_6){
        $scope.calificacion=$rootScope.receptor_off[$stateParams.id].section_6;
        if($rootScope.receptor_off[$stateParams.id].section_6 && $rootScope.receptor_off[$stateParams.id].section_6.errores){
          $scope.errores = $rootScope.receptor_off[$stateParams.id].section_6.errores;
        }
      }
    }else{
      ionicToast.show("No hay elementos precargados, no se podrá realizar la encuesta",'middle', false, 5000);
    }
  }else{

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
      let alertPopup =$ionicPopup.alert({
          title: '¡Error!',
          template: 'Ha ocurrido un error.',
          okType:'button-stable'
      });
    });
  }
  
  $scope.guardar = function () {

    if(!$scope.forms.PercepcionForm.$valid){
      ionicToast.show("Complete los campos del formulario",'middle', false, 2000);
      return;
    }

    $scope.calificacion.Evaluacion = [];
    for (let i = 0; i < $scope.aspectos.length; i++) {
      for (let j = 0; j < $scope.aspectos[i].items_evaluars.length; j++) {
        if ($scope.aspectos[i].items_evaluars[j].radios!=null) {
          $scope.calificacion.Evaluacion.push($scope.aspectos[i].items_evaluars[j].radios);
        }
      }
    }
    if($scope.is_offline==1){
      $rootScope.receptor_off[$stateParams.id].section_6=$scope.calificacion;
      if($scope.last_section<$scope.this_section){
        $scope.last_section++;
      }   
      $rootScope.receptor_off[$scope.id].last_section=$scope.last_section;
      localStorage.setItem("receptor_off",JSON.stringify($rootScope.receptor_off));
      ionicToast.show("Se almacenó la sección para sincronización",'top', false, 5000);
      $location.path("/app/enteran/"+$stateParams.id+"/"+$scope.is_offline).search({'lastSection':$scope.last_section});
    }else{
      
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
          if($scope.last_section<$scope.this_section){
            $scope.last_section++;
          }           
          $location.path("/app/enteran/"+$stateParams.id+"/"+$scope.is_offline).search({'lastSection':$scope.last_section});      
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
  };
})

.controller('enteranController', function($scope, turismoReceptor, $ionicLoading, $ionicPopup, ionicToast, $ionicScrollDelegate, $state, $filter, $location, $stateParams, factories, $rootScope, $cordovaNetwork) {
  $scope.enteran = {'FuentesDurante': [],'FuentesAntes': [],'Redes':[]};
  $scope.control = {};
  $scope.errores = null;
  $scope.err = null;
  $scope.forms={};
  $scope.id=$stateParams.id;
  $scope.is_offline=$stateParams.isOff;
  $scope.this_section=7;
  $scope.last_section=parseInt($location.search().lastSection);


  if(localStorage.getItem("loader_receptor")!=null){
    $rootScope.loader_receptor=JSON.parse(localStorage.getItem("loader_receptor"));
  }else{
    $rootScope.loader_receptor={};
  }

  if(localStorage.getItem("receptor_off")!=null){
    $rootScope.receptor_off=JSON.parse(localStorage.getItem("receptor_off"));
  }else{
    $rootScope.receptor_off=[];
  }

  if($cordovaNetwork.getNetwork() == 'none'|| $cordovaNetwork.getNetwork() == 'unknown' || $scope.is_offline==1){
    
    if($rootScope.loader_receptor.enteran){
      let data = $rootScope.loader_receptor.enteran
      $scope.fuentesAntes = data.fuentesAntes;
      $scope.fuentesDurante = data.fuentesDurante;
      $scope.redes = data.redes;
      $scope.enteran.Id = $scope.id;
      if($rootScope.receptor_off[$stateParams.id].section_7){
        $scope.enteran=$rootScope.receptor_off[$stateParams.id].section_7;
        if($rootScope.receptor_off[$stateParams.id].section_7 && $rootScope.receptor_off[$stateParams.id].section_7.errores){
          $scope.errores = $rootScope.receptor_off[$stateParams.id].section_7.errores;
        }
      }
    }else{
      ionicToast.show("No hay elementos precargados, no se podrá realizar la encuesta",'middle', false, 5000);
    }

  }else{
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
      let alertPopup =$ionicPopup.alert({
          title: '¡Error!',
          template: 'Ha ocurrido un error.',
          okType:'button-stable'
      });
    });
  }

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

  $scope.toggleSelection = function (item) {
    let idx = $scope.enteran.FuentesAntes.indexOf(item);
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

    if($scope.is_offline==1){
      $rootScope.receptor_off[$stateParams.id].section_7=$scope.enteran;
      if($scope.last_section<$scope.this_section){
        $scope.last_section++;
      }  
      $rootScope.receptor_off[$scope.id].last_section=$scope.last_section;
      localStorage.setItem("receptor_off",JSON.stringify($rootScope.receptor_off));
      ionicToast.show("Se almacenó la sección para sincronización",'top', false, 5000);
      $location.path("/app/encuestas").search({}); 
    }else{

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
        let alertPopup =$ionicPopup.alert({
          title: '¡Error!',
          template: 'Ha ocurrido un error. Intenta nuevamente',
          okType:'button-stable'
        });
      });   
    } 
  }; 
})