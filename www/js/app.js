	// angular.module is a global place for creating, registering and retrieving Angular modules
	// the 2nd parameter is an array of 'requires'
	// 'mfactivearchive.services' is found in services.js
	// 'mfactivearchive.controllers' is found in controllers.js
	angular.module('mfactivearchive', ['ionic', 'mfactivearchive.config', 'mfactivearchive.controllers', 'mfactivearchive.services', 'ngCordovaBeacon'])

	.run(function($ionicPlatform, $rootScope, $cordovaBeacon, Museum, $state) {
		$ionicPlatform.ready(function() {
			// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
			// for form inputs)
			if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                             cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                             cordova.plugins.Keyboard.disableScroll(true);
			}
			if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                ionic.Platform.fullScreen();
			}
			if (document.documentElement.clientWidth < 768) { 			
				  document.querySelector("meta[name=viewport]").setAttribute(
				  'content', 
				  'width=device-width, initial-scale=.65, maximum-scale=.65, minimum-scale=.65, user-scalable=no');
			}
                             
            $rootScope.beacons = {};
            $rootScope.last_jump_to_place_id = null;
                             
            $cordovaBeacon.requestWhenInUseAuthorization();
            $rootScope.beacon ="Looking for beacons...";
                             
                             $rootScope.beacon_places = {};
            Museum.all().then(function(d) {
                              if(d) {
                                for(var index in d) {
                                    if (d[index]['beacon_uuid']) {
                                        var uuids = d[index]['beacon_uuid'].split(";");
                                        for(var x in uuids) {
                                            $rootScope.beacon_places[uuids[x]] = d[index]['place_id'];
                                        }
                                    }
                                }
                              }
                              //console.log("places",  JSON.stringify($rootScope.beacon_places));
            });
                                        
            $rootScope.$on("$cordovaBeacon:didRangeBeaconsInRegion", function(event, pluginResult) {
                var uniqueBeaconKey;
                $rootScope.beacon = '';
                rssi = -10000;
                nearestBeacon = null;
                           c = 0;
                for(var i = 0; i < pluginResult.beacons.length; i++) {
                           if
                            (
                             (pluginResult.beacons[i].proximity !== 'ProximityImmediate')
                             &&
                             (pluginResult.beacons[i].proximity !== 'ProximityNear')
                             ) { continue; }
                           
                           
                           uniqueBeaconKey = pluginResult.beacons[i].uuid + ":" + pluginResult.beacons[i].major + ":" + pluginResult.beacons[i].minor;
                           $rootScope.beacons[uniqueBeaconKey] = pluginResult.beacons[i];
                           
                           if (pluginResult.beacons[i].rssi > rssi) {
                            rssi = pluginResult.beacons[i].rssi;
                            nearestBeacon = uniqueBeaconKey;
                           }
                           c++;
                           //console.log("[BEACON] " + JSON.stringify(pluginResult.beacons[i]));
                }
                           $rootScope.beacon = "Nearest: " + nearestBeacon + "; found " + c + " near; " + pluginResult.beacons.length + " total";
                           
                        if ((jump_to_place_id = $rootScope.beacon_places[nearestBeacon]) && ($rootScope.last_jump_to_place_id != jump_to_place_id)) {
                                $rootScope.beacon += "Jump to " + jump_to_place_id;
                                $state.go("tab.detail-museum", {id: jump_to_place_id});
                                $rootScope.last_jump_to_place_id = jump_to_place_id;
                           
                           }
                           $rootScope.$apply();
                           
                                                                 
            });
                                                  
            $cordovaBeacon.startRangingBeaconsInRegion($cordovaBeacon.createBeaconRegion("estimote", "b9407f30-f5f8-466e-aff9-25556b57fe6d"));
		});
	})

.config(function($stateProvider, $urlRouterProvider) {

	// Ionic uses AngularUI Router which uses the concept of states
	// Learn more here: https://github.com/angular-ui/ui-router
	// Set up the various states which the app can be in.
	// Each state's controller can be found in controllers.js
	$stateProvider

	// setup an abstract state for the tabs directive
	.state('tab', {
		url: '/tab',
		abstract: true,
		templateUrl: 'templates/menu.html'
	})

	// Each tab has its own nav history stack:

	.state('tab.front', {
		url: '/front',
		views: {
			'menuContent': {
				templateUrl: 'templates/tab-front.html',
				controller: 'FrontCtrl'
			}
		}
	})

//		settings for showing all exhibitions on museum landing
//     .state('tab.museum', {
// 		url: '/museum/:parent_id',
// 		views: {
// 			'menuContent': {
// 				templateUrl: 'templates/tab-museum.html',
// 				controller: 'MuseumCtrl'
// 			}
// 		}
// 	})
// 	.state('tab.detail-museum', {
// 		url: '/detail-museum/:id/:exhibition',
// 		views: {
// 			'menuContent': {
// 				templateUrl: 'templates/detail-museum.html',
// 				controller: 'MuseumDetailCtrl'
// 			}
// 		}
// 	})
	
    .state('tab.museum', {
		url: '/museum',
		views: {
			'menuContent': {
				templateUrl: 'templates/tab-museum.html',
				controller: 'MuseumCtrl'
			}
		}
	})
	.state('tab.detail-museum', {
		url: '/detail-museum/:id',
		views: {
			'menuContent': {
				templateUrl: 'templates/detail-museum.html',
				controller: 'MuseumDetailCtrl'
			}
		}
	})
	
    .state('tab.neighborhood', {
		url: '/neighborhood',
		views: {
			'menuContent': {
				templateUrl: 'templates/tab-neighborhood.html',
				controller: 'NeighborhoodCtrl'
			}
		}
	})

	.state('tab.artists', {
		url: '/artists',
		views: {
			'menuContent': {
				templateUrl: 'templates/tab-artists.html',
				controller: 'ArtistsCtrl'
			}
		}
	})
	
	.state('tab.exhibitions', {
		url: '/exhibitions/:decade',
		views: {
			'menuContent': {
				templateUrl: 'templates/tab-exhibitions.html',
				controller: 'ExhibitionsCtrl'
			}
		}
	})	

    .state('tab.search', {
		url: '/search',
		views: {
			'menuContent': {
				templateUrl: 'templates/tab-search.html',
				controller: 'SearchCtrl'
			}
		}
	})

	.state('tab.detail-artist', {
		url: '/detail-artist/:id',
		views: {
			'menuContent': {
				templateUrl: 'templates/detail-artist.html',
				controller: 'ArtistDetailCtrl'
			}
		}
	})
	.state('tab.detail-exhibition', {
		url: '/detail-exhibition/:id',
		views: {
			'menuContent': {
				templateUrl: 'templates/detail-exhibition.html',
				controller: 'ExhibitionDetailCtrl'
			}
		}
	})
	.state('tab.onview', {
		url: '/onview',
		views: {
			'menuContent': {
				templateUrl: 'templates/tab-onview.html',
				controller: 'OnViewCtrl'
			}
		}
	})
	.state('tab.detail-artwork', {
		url: '/detail-artwork/:id',
		views: {
			'menuContent': {
				templateUrl: 'templates/detail-artwork.html',
				controller: 'ArtworkDetailCtrl'
			}
		}
	})
	.state('tab.about', {
		url: '/about',
		views: {
			'menuContent': {
				templateUrl: 'templates/tab-about.html',
				controller: 'About'
			}
		}
	});


	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/tab/front');
});
