angular.module('mfactivearchive.controllers', [])

.controller('FrontCtrl', function($scope, $ionicSideMenuDelegate) {
 	
})

.controller('ArtistsCtrl', function($scope, Artists) {
	// With the new view caching in Ionic, Controllers are only called
	// when they are recreated or on app start, instead of every page change.
	// To listen for when this page is active (for example, to refresh data),
	// listen for the $ionicView.enter event:
	//
	//$scope.$on('$ionicView.enter', function(e) {
	//});

	var artistsLoaded = 0;

	Artists.load(0,30).then(function(d) { $scope.artists = d; artistsLoaded = d.length; });
	
	$scope.loadNextArtistPage = function() {
		Artists.load(artistsLoaded, 30).then(function(d) {
			$scope.artists = $scope.artists.concat(d);
			artistsLoaded = $scope.artists.length;
			console.log("artists loaded " + artistsLoaded);
			$scope.$broadcast('scroll.infiniteScrollComplete');
		});
	};
})

.controller('ArtistDetailCtrl', function($scope, $stateParams, Artists, $log) {
	Artists.get($stateParams.id).then(function(d) {
		$scope.artist = d;
	}, function() {
		$log.log("Could not load artist");
	});
});