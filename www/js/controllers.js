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

	Artists.load(0,32).then(function(d) { $scope.artists = d; artistsLoaded = d.length; });
	
	$scope.loadNextArtistPage = function() {
		Artists.load(artistsLoaded, 32).then(function(d) {
			$scope.artists = $scope.artists.concat(d);
			artistsLoaded = $scope.artists.length;
			console.log("artists loaded " + artistsLoaded);
			$scope.$broadcast('scroll.infiniteScrollComplete');
		});
	};
})

.controller('ExhibitionsCtrl', function($scope, Exhibitions, $ionicScrollDelegate) {
	// With the new view caching in Ionic, Controllers are only called
	// when they are recreated or on app start, instead of every page change.
	// To listen for when this page is active (for example, to refresh data),
	// listen for the $ionicView.enter event:
	//
	//$scope.$on('$ionicView.enter', function(e) {
	//});

	var exhibitionsLoaded = 0;

    $scope.value = 0;

	Exhibitions.load(0,32).then(function(d) { $scope.exhibitions = d; exhibitionsLoaded = d.length; });
	
	$scope.loadNextExhibitionPage = function() {
		Exhibitions.load(exhibitionsLoaded, 32).then(function(d) {
			$scope.exhibitions = $scope.exhibitions.concat(d);
			exhibitionsLoaded = $scope.exhibitions.length;
			console.log("exhibitions loaded " + exhibitionsLoaded);
			$scope.$broadcast('scroll.infiniteScrollComplete');
		});
	};

    $scope.listScroll = function() {
    
        if($ionicScrollDelegate.getScrollPosition()) {
            topscroll = $ionicScrollDelegate.getScrollPosition().top;

            // Looking for better solution ... this voodoo dynamically sets the active list item for scrolling
            value = Math.floor( (topscroll / 125) );
            $scope.value = value;
        }
    }
})

.controller('ExhibitionDetailCtrl', function($scope, $stateParams, Exhibitions, $log) {
    Exhibitions.get($stateParams.id).then(function(d) {
        $scope.exhibition = d;
    }, function() {
        $log.log("Could not load exhibition");
    });
})

.controller('SearchCtrl', function($scope, $stateParams, Search, $log) {

    $scope.search = function(form) {

        $log.log('Form: ');
        $log.log(form);

        if(form.$valid) {
            var search_term = form.searchterm.$modelValue;

            Search.get(search_term).then(function(d) {
                $scope.results = $scope.results.concat(d);
                console.log("search results gotten");
            });
        }
    };

    var searchLoaded = 0;

    $scope.value = 0;

	Search.load(0,32).then(function(d) { $scope.results = d; searchLoaded = d.length; });
	
	$scope.loadNextSearchPage = function() {
		Search.load(searchLoaded, 32).then(function(d) {
			$scope.results = $scope.results.concat(d);
			searchLoaded = $scope.results.length;
			console.log("search results loaded " + searchLoaded);
			$scope.$broadcast('scroll.infiniteScrollComplete');
		});
	};
})

.controller('ArtistDetailCtrl', function($scope, $stateParams, $ionicSlideBoxDelegate, Artists, $log) {

	Artists.get($stateParams.id).then(function(d) {
		$scope.artist = d;
       
        console.log($scope.artist);
        $ionicSlideBoxDelegate.slide(0);
        $ionicSlideBoxDelegate.update();

	}, function() {
		$log.log("Could not load artist");
	});
});
