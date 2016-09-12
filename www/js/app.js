	// angular.module is a global place for creating, registering and retrieving Angular modules
	// the 2nd parameter is an array of 'requires'
	// 'mfactivearchive.services' is found in services.js
	// 'mfactivearchive.controllers' is found in controllers.js
	angular.module('mfactivearchive', ['ionic', 'mfactivearchive.config', 'mfactivearchive.controllers', 'mfactivearchive.services'])

	.run(function($ionicPlatform) {
		$ionicPlatform.ready(function() {
			// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
			// for form inputs)
			if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			cordova.plugins.Keyboard.disableScroll(true);

			}
			if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleLightContent();
			}
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

    .state('tab.museum', {
		url: '/museum/:parent_id',
		views: {
			'menuContent': {
				templateUrl: 'templates/tab-museum.html',
				controller: 'MuseumCtrl'
			}
		}
	})
	.state('tab.detail-museum', {
		url: '/detail-museum/:id/:exhibition',
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
	});


	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/tab/front');
});
