angular.module('starter.directives', [])
.filter('range', function() {
	  return function(input, total) {
	    total = parseInt(total);
	    for (var i=0; i<total; i++)
	      input.push(i);
	    return input;
  }})

.filter('firstPage', function() {
  return function(input, start) {
    start = +start;
    return input.slice(start);
  }
})
;