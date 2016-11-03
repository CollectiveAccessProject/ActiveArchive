angular.module('mfactivearchive.services', ['mfactivearchive.config'])

.factory('Comments', function($http, dataConfig, $log) {
  return {
    set: function(table_num, row_id, comment, email, name) {
		var promise = $http({
			method : 'PUT',
			url : dataConfig.backend + '/service.php/item/ca_item_comments',
            data : {"intrinsic_fields" : {"table_num": table_num, "row_id": row_id, "user_id": "null", "comment": comment, "email": email, "name": name, "access": "0"}}
		}).then(function(response) {
			$log.log('response sent');
			return response;
		}, function() { 
			$log.log("Error saving comment");
		});
		
		return promise;
	}	
  };
})
.factory('Artists', function($http, dataConfig, $log) {
   	  
  return {
    load: function(letter) {
    	
		var promise = $http({
		method : 'POST',
		url : dataConfig.backend + '/service.php/simple/artists?q=ca_entities.artist_browse:Yes AND ca_entities.preferred_labels.surname:' + letter + '*&noCache=' + dataConfig.noCache
		}).then(function(response) {
			$log.log('Load complete for ' + letter);
			return response.data['data'];
		}, function() { 
			$log.log("Error loading artists"); 
		});
		
		return promise;
    },
    
    get: function(id) {
		var promise = $http({
			method : 'POST',
			url : dataConfig.backend + '/service.php/simple/artist?id=' + id + '&noCache=' + dataConfig.noCache
		}).then(function(response) {
			$log.log('Load complete');
			return response.data;
		}, function() { 
			$log.log("Error loading artist"); 
		});
		
		return promise;
	}	
  };
})
.factory('Exhibitions', function($http, dataConfig, $log) {

  return {
    load: function(s, l, decade) {
    	$log.log('decade ' + decade);
    	if (!decade) { decade = "2010-2019"; }
    	if (s < 1) { s = 0; }
    	if (l < 1) { l = 20; }
    	
		var promise = $http({
		method : 'POST',
		url : dataConfig.backend + '/service.php/simple/exhibitions?q=ca_occurrences.event_dates:"' + decade + '"&limit=' + l + '&start=' + s + '&noCache=' + dataConfig.noCache
		}).then(function(response) {
			$log.log('Load complete');
			return response.data['data'];
		}, function() { 
			$log.log("Error loading exhibitions"); 
		});
		
		return promise;
    },

    get: function(id) {
		var promise = $http({
			method : 'POST',
			url : dataConfig.backend + '/service.php/simple/exhibition?id=' + id + '&noCache=' + dataConfig.noCache
		}).then(function(response) {
			$log.log('Load complete');
			return response.data;
		}, function() { 
			$log.log("Error loading exhibition"); 
		});
		
		return promise;
	},
	loadOnView: function() {
    	$log.log('loading on view');
    	var promise = $http({
		method : 'POST',
		url : dataConfig.backend + '/service.php/simple/exhibitions?q=ca_occurrences.event_dates:today&noCache=' + dataConfig.noCache
		}).then(function(response) {
			$log.log('Load complete');
			return response.data['data'];
		}, function() { 
			$log.log("Error loading exhibitions"); 
		});
		
		return promise;
    },
	loadBuilding: function(id, s, l) {
    	if (s < 1) { s = 0; }
    	if (l < 1) { l = 40; }
    	
    	$log.log('loading building exhibitions');
    	var promise = $http({
		method : 'POST',
		url : dataConfig.backend + '/service.php/simple/exhibitionsFloorList?q=ca_places.place_id:' + id  + '&limit=' + l + '&start=' + s + '&noCache=' + dataConfig.noCache
		}).then(function(response) {
			$log.log('Load complete');
			return [id, response.data['data']];
		}, function() { 
			$log.log("Error loading building exhibitions"); 
		});
		
		return promise;
    },
	loadFloor: function(s, l, id) {
    	if (s < 1) { s = 0; }
    	if (l < 1) { l = 20; }
    	
    	$log.log('loading floor exhibitions');
    	var promise = $http({
		method : 'POST',
		url : dataConfig.backend + '/service.php/simple/exhibitions?q=ca_places.place_id:' + id  + '&limit=' + l + '&start=' + s + '&noCache=' + dataConfig.noCache
		}).then(function(response) {
			$log.log('Load complete');
			return response.data['data'];
		}, function() { 
			$log.log("Error loading floor exhibitions"); 
		});
		
		return promise;
    }
  };
})
.factory('Artworks', function($http, dataConfig, $log) {

  return {
    get: function(id) {
		var promise = $http({
			method : 'POST',
			url : dataConfig.backend + '/service.php/simple/artwork?id=' + id + '&noCache=' + dataConfig.noCache
		}).then(function(response) {
			$log.log('Load complete');
			return response.data;
		}, function() { 
			$log.log("Error loading artwork"); 
		});
		
		return promise;
	},
	loadFloor: function(s, l, id) {
    	if (s < 1) { s = 0; }
    	if (l < 1) { l = 20; }
    	
    	$log.log('loading floor exhibitions');
    	var promise = $http({
		method : 'POST',
		url : dataConfig.backend + '/service.php/simple/artworks?q=ca_places.place_id:' + id  + '&limit=' + l + '&start=' + s + '&noCache=' + dataConfig.noCache
		}).then(function(response) {
			$log.log('Load complete');
			return response.data['data'];
		}, function() { 
			$log.log("Error loading floor artworks");
		});
		
		return promise;
    }
    	
  };
})
.factory('Museum', function($http, dataConfig, $log) {
  return {
    load: function(parent) {
    	$log.log('parent ' + parent);
    	
    	var promise = $http({
		method : 'POST',
		url : dataConfig.backend + '/service.php/simple/places?q=ca_places.parent_id:' + parent + '&noCache=' + dataConfig.noCache
		}).then(function(response) {
			$log.log('Load complete');
			return response.data['data'];
		}, function() { 
			$log.log("Error loading places"); 
		});
		
		return promise;
    },
    get: function(id) {
		var promise = $http({
			method : 'POST',
			url : dataConfig.backend + '/service.php/simple/place?id=' + id + '&noCache=' + dataConfig.noCache
		}).then(function(response) {
			$log.log('Load complete');
			return response.data;
		}, function() { 
			$log.log("Error loading place"); 
		});
		
		return promise;
	},
    getPlaceHeir: function(id) {
		var promise = $http({
			method : 'POST',
			url : dataConfig.backend + '/service.php/simple/placeHier?id=' + id + '&noCache=' + dataConfig.noCache
		}).then(function(response) {
			$log.log('Load complete');
			return response.data;
		}, function() { 
			$log.log("Error loading place"); 
		});
		
		return promise;
	}	
  };
})
.factory('Search', function($http, dataConfig, $log) {

    return {
        load: function(s, l, search_term) {
    	    if (s < 1) { s = 0; }
    	    if (l < 1) { l = 20; }
    	

		    var promise = $http({
		    method : 'POST',
		    url : dataConfig.backend + '/service.php/simple/artworks?q=' + search_term + '&limit=' + l + '&start=' + s + '&noCache=' + dataConfig.noCache
		    }).then(function(response) {
			    $log.log('Load complete');

                if('' === search_term) {
                    return [];
                } else {
			        return response.data['data'];
                }

		    }, function() { 
			    $log.log("Error loading search results"); 
		    });
		
		    return promise;
        },
     
        get: function(term) {

            $log.log('Getting Term: ' + term);

            var promise = $http({
                method: 'POST',
                url: dataConfig.backend + '/service.php/simple/artworks?q=' + term + '&limit=32&start=0' + '&noCache=' + dataConfig.noCache
            }).then(function(response) {
                $log.log('Load complete');
                return response.data['data'];
            }, function() {
                $log.log("Error loading search results");
            });

            return promise;
        }
    };
});
