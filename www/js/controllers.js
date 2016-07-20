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

.controller('ExhibitionsCtrl', function($scope, $stateParams, Exhibitions, $location, $state, $ionicViewSwitcher, $ionicScrollDelegate) {
	// With the new view caching in Ionic, Controllers are only called
	// when they are recreated or on app start, instead of every page change.
	// To listen for when this page is active (for example, to refresh data),
	// listen for the $ionicView.enter event:
	//
	//$scope.$on('$ionicView.enter', function(e) {
	//});

	var exhibitionsLoaded = 0;
	$scope.decades = ["1980-1989", "1990-1999", "2000-2009", "2010-2019"];
	
	if($stateParams.decade && ($scope.decades.indexOf($stateParams.decade) != -1)){
		$scope.decade = $stateParams.decade;
	}else{
		$scope.decade = $scope.decades[$scope.decades.length - 1];
	}
	$scope.decadeTitle = $scope.decade.substring(0,$scope.decade.indexOf("-")) + "'s";
	
	Exhibitions.load(0,32,$scope.decade).then(function(d) {
		$scope.exhibitions = d;
		exhibitionsLoaded = d.length;

		// Highlight first exhibition in list
		$scope.showExhibition = $scope.highlightExhibition = d[0]['occurrence_id'];
	});
	
	$scope.loadNextExhibitionPage = function() {
		Exhibitions.load(exhibitionsLoaded, 32,$stateParams.decade).then(function(d) {
			$scope.exhibitions = $scope.exhibitions.concat(d);
			exhibitionsLoaded = $scope.exhibitions.length;
			console.log("exhibitions loaded " + exhibitionsLoaded);
			$scope.$broadcast('scroll.infiniteScrollComplete');

			// Highlight first exhibition in list
			$scope.showExhibition = $scope.highlightExhibition = d[0]['occurrence_id'];
		});
	};
	
	$scope.showExhibitionInfo= function(showExhibition, $event){
		$scope.showExhibition = showExhibition;
		if ($event) { $event.stopPropagation(); }
	};
	$scope.highlightExhibitionTitle= function(highlightExhibition, $event){
		angular.element(document.querySelectorAll('.exhibitionListItem')).css('opacity', '.3');
		$scope.highlightExhibition = highlightExhibition;
		angular.element(document.querySelector('#exhibition_' + highlightExhibition).previousElementSibling).css('opacity', '.7');
		if ($event) {$event.stopPropagation(); }
	};
	
	$scope.nextDecade = $scope.decades[$scope.decades.indexOf($scope.decade) + 1];
	$scope.previousDecade = $scope.decades[$scope.decades.indexOf($scope.decade) - 1];
	
	$scope.loadNextDecade = function(){
		if($scope.nextDecade){
			$ionicViewSwitcher.nextDirection('forward');
			$state.go("tab.exhibitions", { "decade": $scope.nextDecade });
		}
	};
	$scope.loadPreviousDecade = function(){
		if($scope.previousDecade){
			$ionicViewSwitcher.nextDirection('back');
			$state.go("tab.exhibitions", { "decade": $scope.previousDecade });
		}
	};

	// Handle scrolling of exhibition title
	$scope.getScrollPosition = function(){
		var t = $ionicScrollDelegate.$getByHandle('exhibitionList').getScrollPosition().top;	// distance scrolled from top
		var l = Math.floor(t/36); // estimate # of lines in we are
		if (isNaN(l)) { return; }
		if ((!$state.oldLine) || (l !== $state.oldLine)) {
			// set current highlight
			$scope.showExhibitionInfo($scope.exhibitions[l]['occurrence_id']);
			$scope.highlightExhibitionTitle($scope.exhibitions[l]['occurrence_id']);

			// force view to reload
			//$state.reload();
			angular.element(document.querySelector('#exhibition_' + $scope.exhibitions[l]['occurrence_id'])).triggerHandler('click');
			//angular.element(document.querySelector('.exhibitionListItem')).css('opacity', '.3');
			//angular.element(document.querySelector('#exhibition_' + $scope.exhibitions[l]['occurrence_id'])).css('opacity', '1');
			//angular.element(document.querySelector('#exhibition_' + $scope.exhibitions[l + 1]['occurrence_id'])).css('opacity', '.7');
			//angular.element(document.querySelector('#exhibition_' + $scope.exhibitions[l + 2]['occurrence_id'])).css('opacity', '.5');
			//angular.element(document.querySelector('#exhibition_' + $scope.exhibitions[l - 1]['occurrence_id'])).css('opacity', '.7');
			//angular.element(document.querySelector('#exhibition_' + $scope.exhibitions[l - 2]['occurrence_id'])).css('opacity', '.5');

			$state.oldScrollTop = t;
			$state.oldLine = l;
		}
	};
		
})
	
.controller('ExhibitionsCtrlOld', function($scope, $stateParams, Exhibitions, $ionicScrollDelegate) {	
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

    var searchLoaded = 0;

    if($scope.search_term === null) {
        term = '';
    } else {
        term = $scope.search_term;
    }

    $scope.search = function(form) {

        $log.log('Form: ');
        $log.log(form);

        if(form.$valid) {
            $scope.search_term = form.searchterm.$modelValue;

            Search.get($scope.search_term).then(function(d) {

                $log.log('d: ');
                $log.log(d);

                $log.log( $scope.results );

                $scope.results = d;
                searchLoaded = $scope.results.length;
                console.log("search results gotten");
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        }
    };
    	
	$scope.loadNextSearchPage = function() {
		Search.load(searchLoaded, 32, $scope.search_term).then(function(d) {
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
})

.controller('ExhibitionDetailCtrl', function($scope, $stateParams, Exhibitions, $log) {
	Exhibitions.get($stateParams.id).then(function(d) {
		$scope.exhibition = d;
	}, function() {
		$log.log("Could not load exhibition");
	});
})

.controller('ArtworkDetailCtrl', function($scope, $stateParams, Artworks, $log) {
	Artworks.get($stateParams.id).then(function(d) {
		$scope.artwork = d;
	}, function() {
		$log.log("Could not load artwork");
	});
});

