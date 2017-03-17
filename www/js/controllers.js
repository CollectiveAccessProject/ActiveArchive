angular.module('mfactivearchive.controllers', ['ngCordovaBeacon'])
.config(function ($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(['self', 'http://google.com/']);
})
 
.controller('FrontCtrl', function($scope, $rootScope, $ionicPlatform, $ionicSideMenuDelegate) {
 	
})
.controller('About', function($scope, $ionicSideMenuDelegate) {
            
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
	$scope.decadeTitles = [{"title" : "1980's", "var" : "1980-1989"}, {"title" : "1990's", "var" : "1990-1999"}, {"title" : "2000's", "var" : "2000-2009"}, {"title" : "2010's", "var" : "2010-2019"}];
    if($stateParams.decade && ($scope.decades.indexOf($stateParams.decade) != -1)){
		$scope.decade = $stateParams.decade;
	}else{
		$scope.decade = $scope.decades[$scope.decades.length - 1];
	}
	$scope.decadeTitle = $scope.decade.substring(0,$scope.decade.indexOf("-")) + "'s";
	
	Exhibitions.load(0,50,$scope.decade).then(function(d) {
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

.controller('ArtistDetailCtrl', function($scope, $stateParams, $ionicSlideBoxDelegate, Artists, $log, $sce, Comments) {
    $scope.showArea = "area1";
	$scope.iframe_url = $sce.trustAsResourceUrl(decodeURIComponent("http://w.soundcloud.com"));
	Artists.get($stateParams.id).then(function(d) {
		$scope.artist = d;
		
		$scope.artist.sound = '';
		if($scope.artist.soundcloud_playlist_id){
			$scope.artist.sound = $sce.trustAsHtml(String("<iframe width='100%' height='400' scrolling='no' frameborder='no' src='http://w.soundcloud.com/player/?url=http%3A//api.soundcloud.com/playlists/" + $scope.artist.soundcloud_playlist_id + "&amp;auto_play=false&amp;hide_related=true&amp;show_comments=false&amp;show_user=false&amp;show_reposts=false&amp;buying=false&amp;liking=false&amp;download=false'></iframe>"));
		}
                                      
          if($scope.artist.soundcloud_track_id){
              $scope.artist.sound = $sce.trustAsHtml(String("<iframe width='100%' height='400' scrolling='no' frameborder='no' src='http://w.soundcloud.com/player/?url=http%3A//api.soundcloud.com/track/" + $scope.artist.soundcloud_track_id + "&amp;auto_play=false&amp;hide_related=true&amp;show_comments=false&amp;show_user=false&amp;show_reposts=false&amp;buying=false&amp;liking=false&amp;download=false'></iframe>"));
          }
                                      
        $ionicSlideBoxDelegate.slide(0);
        $ionicSlideBoxDelegate.update();
        $scope.showArea = "area1";

	}, function() {
		$log.log("Could not load artist");
	});
    
    $scope.selectShowArea = function(area) {
            $scope.showArea = area;
    };
    
    $scope.addComment = function() {
		Comments.set().then(function(d) {
			console.log("comment saved");
		});
	};
    
    
    $scope.comment = [];
    $scope.commentSubmitted = 0;
    $scope.submitComment = function(commentForm) {
        $scope.formError = 0;
        $scope.formErrorMessage = "";
        if(!$scope.comment.email || commentForm.email.$invalid){
            $scope.formError = 1;
            $scope.formErrorMessage += " Enter a valid email address.";
        }
        if(!$scope.comment.name){
            $scope.formError = 1;
            $scope.formErrorMessage += " Enter your name.";
        }
        if(!$scope.comment.comment){
            $scope.formError = 1;
            $scope.formErrorMessage += " Enter your comment.";
        }
        
        //$log.log('Form: ');
        //$log.log('Comment' + $scope.comment.comment);
        //$log.log('First name' + $scope.comment.firstname);
       
        if(!$scope.formError){
            Comments.set(20, $scope.artist.entity_id, $scope.comment.comment, $scope.comment.email, $scope.comment.name).then(function(d) {
                console.log("comment saved");
                $scope.commentSubmitted = 1;
            });
        }
    };

})

.controller('ExhibitionDetailCtrl', function($scope, $stateParams, Exhibitions, $log, $sce, Comments) {
	$scope.floorplanTags = [];
	$scope.orientation = "";
    $scope.showArea = "area1";
    $scope.floor_plan_titles = [];
    Exhibitions.get($stateParams.id).then(function(d) {
        $scope.exhibition = d;
        $scope.exhibition.sound = '';
        if($scope.exhibition.soundcloud_playlist_id){
            $scope.exhibition.sound = $sce.trustAsHtml(String("<iframe width='100%' height='400' scrolling='no' frameborder='no' src='http://w.soundcloud.com/player/?url=http%3A//api.soundcloud.com/playlists/" + $scope.exhibition.soundcloud_playlist_id + "&amp;auto_play=false&amp;hide_related=true&amp;show_comments=false&amp;show_user=false&amp;show_reposts=false&amp;buying=false&amp;liking=false&amp;download=false'></iframe>"));
        }

        if($scope.exhibition.soundcloud_track_id){
            $scope.exhibition.sound = $sce.trustAsHtml(String("<iframe width='100%' height='400' scrolling='no' frameborder='no' src='http://w.soundcloud.com/player/?url=http%3A//api.soundcloud.com/track/" + $scope.exhibition.soundcloud_track_id + "&amp;auto_play=false&amp;hide_related=true&amp;show_comments=false&amp;show_user=false&amp;show_reposts=false&amp;buying=false&amp;liking=false&amp;download=false'></iframe>"));
        }
        if($scope.exhibition.floor_plan){
            floor_plans = $scope.exhibition.floor_plan.split(";");
            $log.log("floorplans array" + floor_plans[0]);
            
        }
        if($scope.exhibition.floor_plan_title){
            $scope.floor_plan_titles = $scope.exhibition.floor_plan_title.split("; ");

        }
                                          
                 n = 0;
                 for (var occ_id in $scope.exhibition.floor_plan_coor) {
                    if ($scope.exhibition.floor_plan_coor.hasOwnProperty(occ_id)) {
                        coor_entires = $scope.exhibition.floor_plan_coor[occ_id];
                        //$log.log($scope.exhibition.floor_plan_coor[occ_id]);
                        var tag = "";
                        for (var key in coor_entires) {
                            $log.log("coors: " + coor_entires[key].type);
//                            if(coor_entires[key].type == "poly"){
//                                points = coor_entires[key].points;
//                                coor_points = "";
//                                for (var keyp in points) {
 //                                   $log.log(points[keyp]);
 //                                   coor_points += points[keyp].x + "% " + points[keyp].y + "% , ";
 //                               }
                                 
                            //tag += "<div class='floorArea coorBlock" + occ_id.trim() + "' style='-moz-clip-path: polygon(" + coor_points + "); -webkit-clip-path: polygon(" + coor_points + "); clip-path: polygon(" + coor_points + "); width:100%; height:100%; left:0px; top:0px;'><span>" + coor_entires[key].label + "</span></div>";
 //                           }else{
                                tag += "<div class='floorArea coorBlock" + occ_id.trim() + "' style='left:" + coor_entires[key].x + "%; top:" + coor_entires[key].y + "%; width:" + coor_entires[key].w + "%; height:" + coor_entires[key].h + "%;'><span>" + coor_entires[key].label + "</span></div>";
 //                           }
                        }
                        $scope.floorplanTags[n] = $sce.trustAsHtml(String(floor_plans[n])) + $sce.trustAsHtml(String(tag));
                        $log.log($sce.trustAsHtml(String(floor_plans[n])) + $sce.trustAsHtml(String(tag)));
                    }
                    n++;
                }
                $log.log("floorplanTags" + $scope.floorplanTags[0]);

		
    }, function() {
        $log.log("Could not load exhibition");
    });
    
	$scope.getOrientation = function(fpImg) {
		if(fpImg && !$scope.orientation){
			var orientation = "Horizontal";
			//var width = fpImg.match("(?=width=').*?(?=')");
			var parts = fpImg.split("'");
			if((parts[3]/parts[5]) < 1){
				orientation = "Vertical";
			}
			if((parts[3]/parts[5]) < .5){
				orientation = "SkinnyVertical";
			}
		}

		return orientation;
	};
	$scope.trustAsHtml = function(html){
		return $sce.trustAsHtml(String(html));
    };
    
    $scope.selectShowArea = function(area) {
        $scope.showArea = area;
    };
    
    $scope.comment = [];
    $scope.commentSubmitted = 0;
    $scope.submitComment = function(commentForm) {
        $scope.formError = 0;
        $scope.formErrorMessage = "";
        if(!$scope.comment.email || commentForm.email.$invalid){
            $scope.formError = 1;
            $scope.formErrorMessage += " Enter a valid email address.";
        }
        if(!$scope.comment.name){
            $scope.formError = 1;
            $scope.formErrorMessage += " Enter your name.";
        }
        if(!$scope.comment.comment){
            $scope.formError = 1;
            $scope.formErrorMessage += " Enter your comment.";
        }
        
        //$log.log('Form: ');
        //$log.log('Comment' + $scope.comment.comment);
        //$log.log('First name' + $scope.comment.firstname);
       
        if(!$scope.formError){
            Comments.set(67, $scope.exhibition.occurrence_id, $scope.comment.comment, $scope.comment.email, $scope.comment.name).then(function(d) {
                console.log("comment saved");
                $scope.commentSubmitted = 1;
            });
        }
    };
})


.controller('ArtworkDetailCtrl', function($scope, $stateParams, Artworks, $log, Comments) {
	Artworks.get($stateParams.id).then(function(d) {
		$scope.artwork = d;
	}, function() {
		$log.log("Could not load artwork");
	});
    $scope.showArea = "area1";
	$scope.selectShowArea = function(area) {
            $scope.showArea = area;
    };
    
    $scope.comment = [];
    $scope.commentSubmitted = 0;
    $scope.submitComment = function(commentForm) {
        $scope.formError = 0;
        $scope.formErrorMessage = "";
        if(!$scope.comment.email || commentForm.email.$invalid){
            $scope.formError = 1;
            $scope.formErrorMessage += " Enter a valid email address.";
        }
        if(!$scope.comment.name){
            $scope.formError = 1;
            $scope.formErrorMessage += " Enter your name.";
        }
        if(!$scope.comment.comment){
            $scope.formError = 1;
            $scope.formErrorMessage += " Enter your comment.";
        }
        
        //$log.log('Form: ');
        //$log.log('Comment' + $scope.comment.comment);
        //$log.log('First name' + $scope.comment.firstname);
       
        if(!$scope.formError){
            Comments.set(13, $scope.artwork.collection_id, $scope.comment.comment, $scope.comment.email, $scope.comment.name).then(function(d) {
                console.log("comment saved");
                $scope.commentSubmitted = 1;
            });
        }
    };
})
.controller('MuseumCtrl', function($scope, $stateParams, Museum, $log, $ionicScrollDelegate, $state, buildings, $ionicSlideBoxDelegate) {
	$scope.buildings = buildings;
	$scope.places = [];
	$scope.placeNames = [];
	
	$scope.highlightBuilding = null;
	$state.oldHighlightBuilding = null;
	
	//$log.log(buildings);
	for (var key in buildings) {
		if (buildings.hasOwnProperty(key)) {
			//$log.log("what? " + buildings[key].name + buildings[key].place_id);
			var p_id = Number(buildings[key].place_id);
			if(!$scope.highlightBuilding){
  				$scope.highlightBuilding = p_id;
  				$state.oldHighlightBuilding = p_id;
  			}
			Museum.getPlaceHeir(p_id).then(function(d) {
				$scope.placeNames[d.place_id] = d.name;
				$scope.places.push(d);
			}, function() {
				$log.log("Could not load place");
			});
		}
	}
	
	$scope.highlightTheBuilding = function(place_id){
		if(!$state.oldHighlightBuilding){
			$state.oldHighlightBuilding = $scope.highlightBuilding;
		}
		$scope.highlightBuilding = place_id;
        $log.log("highlight place id: " + $scope.highlightBuilding);
		if ($state.oldHighlightBuilding) {
			angular.element(document.querySelector('#museum_building_' + $state.oldHighlightBuilding)).removeClass('activeBuilding');
		}
		angular.element(document.querySelector('#museum_building_' + place_id)).addClass('activeBuilding');
		
	};
	
})
.controller('MuseumDetailCtrl', function($scope, $stateParams, Museum, Artworks, $location, $state, $log, buildings, $ionicScrollDelegate, $sce) {
            console.log("LOAD MUSEUM DETAIL");
            console.log($stateParams);
            
	$scope.buildings = buildings;
	var artworksLoaded = 0;
	$scope.highlightArtwork = null;
	$scope.coordinates = "";
	$scope.orientation = "";
	
	Museum.get($stateParams.id).then(function(d) {
		$scope.floor = d;
		for (var collection_id in $scope.floor.floor_plan_coor) {
			if ($scope.floor.floor_plan_coor.hasOwnProperty(collection_id)) {
				coor_entires = $scope.floor.floor_plan_coor[collection_id];
				$log.log("collection_id: " + collection_id);
                $log.log($scope.floor.floor_plan_coor[collection_id]);
				for (var key in coor_entires) {
					var tag = "<div class='floorArea coorBlock" + collection_id.trim() + "' style='left:" + coor_entires[key].x + "%; top:" + coor_entires[key].y + "%; width:" + coor_entires[key].w + "%; height:" + coor_entires[key].h + "%;'></div>";
					$scope.coordinates += tag;
				}
			}
		}
		$scope.coordinates = $sce.trustAsHtml(String($scope.coordinates));
		$scope.floor.floorplan = $sce.trustAsHtml($scope.floor.floorplan);
	}, function() {
		$log.log("Could not load place");
	});
            console.log("load floor", $stateParams.id);
            
	Artworks.loadFloor(0,32,$stateParams.id).then(function(d) {
        if(!d) return;
		$scope.artworks = d;
		artworksLoaded = d.length;
		$scope.$broadcast('scroll.infiniteScrollComplete');
		// Highlight first artwork in list
                                                  $scope.highlightArtwork = d[0] ? d[0]['collection_id'] : 0;
		// Highlight first artwork floorplans
                                                  if (d[0]) { $scope.highlightCoor(d[0]['collection_id']); }
	});
	
    $scope.getOrientation = function(fpImg) {
        if(fpImg && !$scope.orientation){
            var orientation = "Horizontal";
            //var width = fpImg.match("(?=width=').*?(?=')");
            var parts = fpImg.split("'");
            if((parts[3]/parts[5]) < 1){
                orientation = "Vertical";
            }
            if((parts[3]/parts[5]) < .5){
                orientation = "SkinnyVertical";
            }
        }

        return orientation;
    };
	
	$scope.loadNextArtworkPage = function() {
		Artworks.loadFloor(artworksLoaded, 32,$stateParams.id).then(function(d) {
                                                                    if(!d) return;
			$scope.artworks = $scope.artworks.concat(d);
			artworksLoaded = $scope.artworks.length;
			console.log("artworks loaded " + artworksLoaded);
			$scope.$broadcast('scroll.infiniteScrollComplete');

			// Highlight first artwork in list
			$scope.showArtwork = $scope.highlightArtwork = d[0]['collection_id'];
		});
	};
	
	$scope.highlightArtworkTitle= function(highlightArtwork, $event){
		angular.element(document.querySelectorAll('.floorArtworkListItem')).css('opacity', '.3');
		$scope.highlightArtwork = highlightArtwork;
		angular.element(document.querySelector('#artwork_' + highlightArtwork).previousElementSibling).css('opacity', '.7');
		if ($event) {$event.stopPropagation(); }
	};
	
	$scope.highlightCoor = function(collection_id){
		$log.log("highlight collection_id: " + collection_id);
        angular.element(document.querySelectorAll('.floorArea')).css('display', 'none');
		angular.element(document.querySelectorAll('.coorBlock' + collection_id)).css('display', 'block');
	};
	
	// Handle scrolling of artwork column
	$scope.getScrollPosition = function(){
		var t = $ionicScrollDelegate.$getByHandle('floorArtworkList').getScrollPosition().top - 200;	// distance scrolled from top - minus padding
		var l = Math.floor(t/350) + 1; // estimate # of lines in we are + # to highlight middle result
		if (isNaN(l)) { return; }
		if ((!$state.oldLine) || (l !== $state.oldLine)) {
			// set current highlight
			$scope.highlightCoor($scope.artworks[l]['collection_id']);
			$scope.highlightArtworkTitle($scope.artworks[l]['collection_id']);

			// force view to reload
			//$state.reload();
			angular.element(document.querySelector('#artwork_' + $scope.artworks[l]['collection_id'])).triggerHandler('click');

			$state.oldScrollTop = t;
			$state.oldLine = l;
		}
	};	
	
	$scope.trustAsHtml = function(html){
		return $sce.trustAsHtml(String(html));
	};

})

.controller('MuseumDetailCtrl_2', function($scope, $stateParams, Museum, Exhibitions, $location, $state, $log, buildings, $ionicScrollDelegate, $sce) {
	$scope.buildings = buildings;
	var exhibitionsLoaded = 0;
	//$scope.showExhibition = null;
	$scope.highlightExhibition = null;
	$scope.coordinates = "";
	$scope.orientation = "";
	
	Museum.get($stateParams.id).then(function(d) {
		$scope.floor = d;
		for (var occ_id in $scope.floor.floor_plan_coor) {
			if ($scope.floor.floor_plan_coor.hasOwnProperty(occ_id)) {
				coor_entires = $scope.floor.floor_plan_coor[occ_id];
				//$log.log($scope.floor.floor_plan_coor[occ_id]);
				for (var key in coor_entires) {
					var tag = "<div class='floorArea coorBlock" + occ_id.trim() + "' style='left:" + coor_entires[key].x + "%; top:" + coor_entires[key].y + "%; width:" + coor_entires[key].w + "%; height:" + coor_entires[key].h + "%;'>" + coor_entires[key].label + "</div>";
					$scope.coordinates += tag;
				}
			}
		}
		$scope.coordinates = $sce.trustAsHtml(String($scope.coordinates));
		$scope.floor.floorplan = $sce.trustAsHtml($scope.floor.floorplan);
	}, function() {
		$log.log("Could not load place");
	});
	
	Exhibitions.loadFloor(0,32,$stateParams.id).then(function(d) {
		$scope.exhibitions = d;
		exhibitionsLoaded = d.length;
		$scope.$broadcast('scroll.infiniteScrollComplete');
		// Highlight first exhibition in list
		$scope.highlightExhibition = d[0]['occurrence_id'];
		// Highlight first exhibition floorplans
		$scope.highlightCoor(d[0]['occurrence_id']);
	});
	
$scope.getOrientation = function(fpImg) {
	if(fpImg && !$scope.orientation){
		var orientation = "Horizontal";
		//var width = fpImg.match("(?=width=').*?(?=')");
		var parts = fpImg.split("'");
		if((parts[3]/parts[5]) < 1){
			orientation = "Vertical";
		}
		if((parts[3]/parts[5]) < .5){
			orientation = "SkinnyVertical";
		}
	}

	return orientation;
};
	
	$scope.loadNextExhibitionPage = function() {
		Exhibitions.loadFloor(exhibitionsLoaded, 32,$stateParams.id).then(function(d) {
			$scope.exhibitions = $scope.exhibitions.concat(d);
			exhibitionsLoaded = $scope.exhibitions.length;
			console.log("exhibitions loaded " + exhibitionsLoaded);
			$scope.$broadcast('scroll.infiniteScrollComplete');

			// Highlight first exhibition in list
			$scope.showExhibition = $scope.highlightExhibition = d[0]['occurrence_id'];
		});
	};
	
	$scope.highlightExhibitionTitle= function(highlightExhibition, $event){
		angular.element(document.querySelectorAll('.floorExhibitionListItem')).css('opacity', '.3');
		$scope.highlightExhibition = highlightExhibition;
		angular.element(document.querySelector('#exhibition_' + highlightExhibition).previousElementSibling).css('opacity', '.7');
		if ($event) {$event.stopPropagation(); }
	};
	
	$scope.highlightCoor = function(exhibition_id){
		angular.element(document.querySelectorAll('.floorArea')).css('display', 'none');
		angular.element(document.querySelectorAll('.coorBlock' + exhibition_id)).css('display', 'block');
	};
	
	// Handle scrolling of exhibition title
	$scope.getScrollPosition = function(){
		var t = $ionicScrollDelegate.$getByHandle('floorExhibitionList').getScrollPosition().top - 150;	// distance scrolled from top - minus padding
		var l = Math.floor(t/150) + 2; // estimate # of lines in we are + # to highlight middle result
		if (isNaN(l)) { return; }
		if ((!$state.oldLine) || (l !== $state.oldLine)) {
			// set current highlight
			$scope.highlightCoor($scope.exhibitions[l]['occurrence_id']);
			$scope.highlightExhibitionTitle($scope.exhibitions[l]['occurrence_id']);

			// force view to reload
			//$state.reload();
			angular.element(document.querySelector('#exhibition_' + $scope.exhibitions[l]['occurrence_id'])).triggerHandler('click');

			$state.oldScrollTop = t;
			$state.oldLine = l;
		}
	};	
	
	$scope.trustAsHtml = function(html){
		return $sce.trustAsHtml(String(html));
	};

});

