//jshint esversion:6

// console.log(module);

module.exports.sortAnswer = function (data, column, asc=false){
	if (!asc) {
		data = data.sort(function (x, y) {
		    return y[column] - x[column];
		});
	} else {
		data = data.sort(function (x, y) {
		    return x[column] - y[column];
		});
	}
	return data;
};

module.exports.calculateSum = function (data, field){
	return data.reduce(function(sumAll,datum){ return sumAll + parseInt(datum[field]); }, 0);
};