angular.module('mfactivearchive.config', [])
.constant('dataConfig', {
	'backend': 'http://app:Gr2appy@mattress.org/archive/admin',
	'noCache' : 0
})
.constant('buildings', {
	1 : {'name' : '500 Sampsonia Way', 'place_id' : 2, 'image' : '500Sampsonia.jpg'},
	2 : {'name' : '1414 Monterey Street', 'place_id' : 9, 'image' : '1414Monterey.jpg'},
	3 : {'name' : '516 Sampsonia Way', 'place_id' : 7, 'image' : '516Sampsonia.jpg'}
});
