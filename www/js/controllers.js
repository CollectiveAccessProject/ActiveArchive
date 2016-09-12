angular.module('mfactivearchive.controllers', [])

.controller('FrontCtrl', function($scope, $ionicSideMenuDelegate) {
 	
})

.controller('ArtistsCtrl', function($scope, $stateParams, Artists, $ionicScrollDelegate, $state) {
	// With the new view caching in Ionic, Controllers are only called
	// when they are recreated or on app start, instead of every page change.
	// To listen for when this page is active (for example, to refresh data),
	// listen for the $ionicView.enter event:
	//
	//$scope.$on('$ionicView.enter', function(e) {
	//});

	var artistLetter = "a";
	$scope.letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
	var nextArtistLetter = $scope.letters[$scope.letters.indexOf(artistLetter) + 1];
	$scope.artistsList = [];
	$scope.highlightLetter = artistLetter;
	$state.oldHighlightLetter = artistLetter;
	
	Artists.load(artistLetter).then(function(d) {
		d["letter"] = artistLetter;
		$scope.artistsList.push(d);
	});
	
	$scope.loadNextArtistPage = function() {
		if(nextArtistLetter){
			Artists.load(nextArtistLetter).then(function(d) {
				d["letter"] = nextArtistLetter;
				$scope.artistsList.push(d);
				nextArtistLetter = $scope.letters[$scope.letters.indexOf(nextArtistLetter) + 1];
				console.log("artists letter loaded " + nextArtistLetter);
				$scope.$broadcast('scroll.infiniteScrollComplete');
			});
		}
	};
	// Handle scrolling of exhibition title
	var artistScrollDelegate = $ionicScrollDelegate.$getByHandle('artistListRow');
	$scope.getScrollPosition = function(){
		if(!$state.oldHighlightLetter){
			$state.oldHighlightLetter = "a";
		}
		var t = parseInt(artistScrollDelegate.getScrollPosition().top);	// distance scrolled from top

		if (isNaN(t)) { return; }
		if (t < 0) { t = 0; }
		var l = Math.floor(t/170); // estimate # of lines in we are
		if (isNaN(l)) { return; }
		if ((!$state.oldLine) || (l !== parseInt($state.oldLine))) {
			// set current highlight
			if (!$scope.letters[l]) { return; }
			//$scope.highlightLetter = $scope.letters[l];
			// force view to reload
			//$state.reload();
			if ($state.oldHighlightLetter) {
				angular.element(document.querySelector('#artist_letter_' + $state.oldHighlightLetter)).removeClass('activeLetter');
			}
			angular.element(document.querySelector('#artist_letter_' + $scope.letters[l])).addClass('activeLetter');
			$state.oldLine = l;
			$state.oldHighlightLetter =  $scope.letters[l]
		}
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
		var t = $ionicScrollDelegate.$getByHandle('exhibitionList').getScrollPosition().top - 275;	// distance scrolled from top - minus padding
		var l = Math.floor(t/55) + 5; // estimate # of lines in we are + 5 to highlight middle result
		if (isNaN(l)) { return; }
		if ((!$state.oldLine) || (l !== $state.oldLine)) {
			// set current highlight
			$scope.showExhibitionInfo($scope.exhibitions[l]['occurrence_id']);
			$scope.highlightExhibitionTitle($scope.exhibitions[l]['occurrence_id']);

			// force view to reload
			//$state.reload();
			angular.element(document.querySelector('#exhibition_' + $scope.exhibitions[l]['occurrence_id'])).triggerHandler('click');

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

.controller('OnViewCtrl', function($scope, $stateParams, Exhibitions, $log, $ionicSlideBoxDelegate) {
    Exhibitions.loadOnView().then(function(d) {
		$scope.exhibitions = d;
		exhibitionsLoaded = d.length;
		$ionicSlideBoxDelegate.update();
	}, function() {
        $log.log("Could not load current exhibitions");
    });
})

.controller('SearchCtrl', function($scope, $stateParams, Search, $log, $location, $state, $ionicScrollDelegate) {
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

                $scope.results = d;
                searchLoaded = $scope.results.length;
                console.log("search results gotten");
                $scope.$broadcast('scroll.infiniteScrollComplete');
                // Highlight first result in list
				$scope.showResult = $scope.highlightResult = d[0]['collection_id'];
            });
        }
    };
    	
	$scope.loadNextSearchPage = function() {
		Search.load(searchLoaded, 40, $scope.search_term).then(function(d) {
			$scope.results = $scope.results.concat(d);
			searchLoaded = $scope.results.length;
			console.log("search results loaded " + searchLoaded);
			$scope.$broadcast('scroll.infiniteScrollComplete');
		});
	};
	
	$scope.showResultInfo= function(showResult, $event){
		$scope.showResult = showResult;
		if ($event) { $event.stopPropagation(); }
	};
	$scope.highlightResultTitle= function(highlightResult, $event){
		angular.element(document.querySelectorAll('.resultListItem')).css('opacity', '.3');
		$scope.highlightResult = highlightResult;
		angular.element(document.querySelector('#result_' + highlightResult).previousElementSibling).css('opacity', '.7');
		if ($event) {$event.stopPropagation(); }
	};

	// Handle scrolling of Result title
	$scope.getScrollPosition = function(){
		var t = $ionicScrollDelegate.$getByHandle('resultList').getScrollPosition().top - 275;	// distance scrolled from top - minus padding
		var l = Math.floor(t/55) + 5; // estimate # of lines in we are/ +5 to highlight middle result
		if (isNaN(l)) { return; }
		if ((!$state.oldLine) || (l !== $state.oldLine)) {
			// set current highlight
			if($scope.results[l]){
				$scope.showResultInfo($scope.results[l]['collection_id']);
				$scope.highlightResultTitle($scope.results[l]['collection_id']);
				// force view to reload
				//$state.reload();
				angular.element(document.querySelector('#result_' + $scope.results[l]['collection_id'])).triggerHandler('click');

				$state.oldScrollTop = t;
				$state.oldLine = l;
			}
		}
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
})
.controller('MuseumCtrl', function($scope, $stateParams, Museum, Exhibitions, $log, $ionicScrollDelegate, $state, buildings) {
	$scope.buildings = buildings;
	$scope.parent_ids = [];
	$scope.exhibitions = [];
	//$log.log(buildings);
	for (var key in buildings) {
	  if (buildings.hasOwnProperty(key)) {
		  //$log.log("what? " + buildings[key].name + buildings[key].place_id);
		  $scope.parent_ids.push(Number(buildings[key].place_id));
	  }
	}
	var exhibitionsLoaded = 0;
	
	if($stateParams.parent_id && ($scope.parent_ids.indexOf(Number($stateParams.parent_id)) != -1)){
		$scope.parent_id = $stateParams.parent_id;
	}else{
		$scope.parent_id = $scope.parent_ids[0];
	}
	Museum.load($scope.parent_id).then(function(d) {
		$scope.place = d;
		$scope.highlightFloor = d[0]['place_id'];
		$scope.oldHighlightFloor = d[0]['place_id'];
		for (var key in $scope.place) {
		  if ($scope.place.hasOwnProperty(key)) {
			console.log("initial loading exhibitions for : " + $scope.place[key].place_id);
			p = $scope.place[key].place_id;
			Exhibitions.loadBuilding(p, 0, 40).then(function(e) {
				//returns array[floor_id, results]
				$scope.exhibitions[e[0]] = e[1];
				console.log("completed initial loading exhibitions for : " + e[0]);
				console.log($scope.exhibitions[e[0]]);
			});
		  }
		}

	}, function() {
		$log.log("Could not load place");
	});
	
	$scope.loadMoreExhibitionsForFloor = function(floor_id) {	
			
		if($scope.exhibitions[floor_id]){
			console.log("loading more exhibitions for : " + floor_id);
			//Exhibitions.loadBuilding(floor_id, $scope.exhibitions[floor_id].length, 40).then(function(e) {
				//returns array[floor_id, results]
			//	$scope.exhibitions[e[0]].concat = e[1];
			//	$scope.$broadcast('scroll.infiniteScrollComplete');
			//});
		}
	};
	
	
	// Handle scrolling of floors
	var museumScrollDelegate = $ionicScrollDelegate.$getByHandle('museumListRow');
	$scope.getScrollPosition = function(){
		if(!$state.oldHighlightFloor){
			$state.oldHighlightFloor = $scope.highlightFloor;
		}
		var t = parseInt(museumScrollDelegate.getScrollPosition().top);	// distance scrolled from top

		if (isNaN(t)) { return; }
		if (t < 0) { t = 0; }
		var l = Math.floor(t/200); // estimate # of lines in we are
		if (isNaN(l)) { return; }
		if ((!$state.oldLine) || (l !== parseInt($state.oldLine))) {
			// set current highlight
			if (!$scope.place[l]) { return; }
			if ($state.oldHighlightFloor) {
				angular.element(document.querySelector('#museum_floor_' + $state.oldHighlightFloor)).removeClass('activeFloor');
			}
			angular.element(document.querySelector('#museum_floor_' + $scope.place[l]['place_id'])).addClass('activeFloor');
			$state.oldLine = l;
			$state.oldHighlightLetter =  $scope.place[l]['place_id'];
		}
	};
	
	
	
})
.controller('MuseumDetailCtrl', function($scope, $stateParams, Museum, Exhibitions, $location, $state, $log, buildings) {
	$scope.buildings = buildings;
	var exhibitionsLoaded = 0;
	$scope.showExhibition = null;
	
	Museum.get($stateParams.id).then(function(d) {
		$scope.floor = d;


	}, function() {
		$log.log("Could not load place");
	});
	if($stateParams.exhibition){
		$scope.showExhibition = $stateParams.exhibition;
	}

	Exhibitions.loadFloor(0,40,$stateParams.id).then(function(e) {
		$scope.exhibitions = e;
		exhibitionsLoaded = e.length;
		if(!$scope.showExhibition){
			$scope.showExhibition = $scope.exhibitions[0].occurrence_id;
			console.log("highlighting exhibiton");
		}
	});
	$scope.loadMoreExhibitions = function() {
		Exhibitions.loadFloor(exhibitionsLoaded, 40,$stateParams.id).then(function(d) {
			$scope.exhibitions = $scope.exhibitions.concat(d);
			exhibitionsLoaded = $scope.exhibitions.length;
			console.log("exhibitions loaded " + exhibitionsLoaded);
			$scope.$broadcast('scroll.infiniteScrollComplete');
		});
	};
	
	$scope.showExhibitionInfo= function(showExhibition, $event){
		$scope.showExhibition = showExhibition;
		if ($event) { $event.stopPropagation(); }
	};
//	$scope.highlightExhibitionTitle= function(highlightExhibition, $event){
//		angular.element(document.querySelectorAll('.exhibitionListItem')).css('opacity', '.3');
//		$scope.highlightExhibition = highlightExhibition;
//		angular.element(document.querySelector('#exhibition_' + highlightExhibition).previousElementSibling).css('opacity', '.7');
//		if ($event) {$event.stopPropagation(); }
//	};
});

