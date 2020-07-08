//jshint esversion:6

const fs = require("fs");
const csv = require('csv-parser');
const bodyParser = require("body-parser");

const express = require('express');
const app = express();
app.use(bodyParser.urlencoded({extended:true}));

var dataArray;

app.get('/', function(req, res){
	dataArray = [];
	fs.createReadStream('allData.csv')
	.pipe(csv())
	.on('data', (row) => {
		dataArray.push(row);
	})
	.on('end', () => {
		console.log('CSV file successfully processed');
		res.sendFile(__dirname+"/index.html");
	});
	
});

app.post('/', function(req, res){
	var keyword = req.body.keyword;
	var lang = req.body.submit;
	var answer = [];
	var datum;
	console.log(req.body);
	console.log(dataArray.length);
	for (datum of dataArray){
		var companyName;
		if (lang === 'en') {
			companyName = datum.companyEn;
		} else {
			companyName = datum.companyCh;
		}
		if (companyName.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
			answer.push(datum.companyEn+" "+datum.companyCh);
		}
	}
	res.send(answer);

});




app.listen(3000, function(){
	console.log("server started on port 3000");
});