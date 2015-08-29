angular.module('mfactivearchive.services', ['mfactivearchive.config'])

.factory('Artists', function($http, dataConfig, $log) {
  // Might use a resource here that returns a JSON array

 	  
  return {
    load: function(s, l) {
    	if (s < 1) { s = 0; }
    	if (l < 1) { l = 20; }
    	
		var promise = $http({
		method : 'POST',
		url : dataConfig.backend + '/service.php/simple/artists?q=*&limit=' + l + '&start=' + s
		}).then(function(response) {
			$log.log('Load complete');
			return response.data;
		}, function() { 
			$log.log("Error loading artists"); 
		});
		
		return promise;
    },
    
    get: function(id) {
		var promise = $http({
			method : 'POST',
			url : dataConfig.backend + '/service.php/simple/artist?id=' + id
		}).then(function(response) {
			$log.log('Load complete');
			return response.data;
		}, function() { 
			$log.log("Error loading artist"); 
		});
		
		return promise;
	}
  };
});
