angular.module('mfactivearchive.services', ['mfactivearchive.config'])

.factory('Artists', function($http, dataConfig, $log) {
  // Might use a resource here that returns a JSON array

 	  
  return {
    load: function(s, l) {
    	if (s < 1) { s = 0; }
    	if (l < 1) { l = 20; }
    	
		var promise = $http({
		method : 'POST',
		url : dataConfig.backend + '/service.php/simple/artists?q=*&limit=' + l + '&start=' + s + '&noCache=' + dataConfig.noCache
		}).then(function(response) {
			$log.log('Load complete');
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
		url : dataConfig.backend + '/service.php/simple/exhibitions?q=ca_occurrences.event_dates:' + decade + '&limit=' + l + '&start=' + s + '&noCache=' + dataConfig.noCache
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
		    url : dataConfig.backend + '/service.php/simple/artists?q=' + search_term + '&limit=' + l + '&start=' + s + '&noCache=' + dataConfig.noCache
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
                url: dataConfig.backend + '/service.php/simple/artists?q=' + term + '&limit=20&start=0' + '&noCache=' + dataConfig.noCache
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
