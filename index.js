//jshint esversion:6

const fs = require("fs");
const csv = require('csv-parser');
const bodyParser = require("body-parser");

const express = require('express');
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');

var dataArray;
var searchTitle;
var noResult;

app.get('/', function(req, res){
	dataArray = [];
	fs.createReadStream('allData.csv')
	.pipe(csv())
	.on('data', (row) => {
		dataArray.push(row);
	})
	.on('end', () => {
		console.log('CSV file successfully processed');
		res.render("list", {companyRecords: [], searchTitle:'', noResult:''});
	});
	
});

app.post('/', function(req, res){
	var keyword = req.body.keyword;
	var keywordArr = keyword.split(',');
	var trimKeywordArr = keywordArr.map(s => s.trim());
	var lang = req.body.submit;
	var answer = [];
	var datum;

	console.log(req.body);
	console.log(dataArray.length);
	
	if (keyword !== '') {
		for (datum of dataArray){
			var companyName;
			if (lang === 'en') {
				companyName = datum.companyEn;
			} else {
				companyName = datum.companyCh;
			}
			for(let keyword of trimKeywordArr){
				if (companyName.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
					answer.push(datum);
					break;
				}
			}
		}

		searchTitle = '關鍵詞： ' + keyword + ' ';
		noResult = answer.length;

	} else {

		const maxNo = 50;

		dataArray1 = JSON.parse(JSON.stringify(dataArray));
		answer = dataArray1.sort(function (x, y) {
		    return y.subsidy - x.subsidy;
		});
		answer = answer.slice(0, maxNo);

		searchTitle = "Top ";
		noResult = maxNo;


	} 

	answer = answer.sort(function (x, y) {
	    return y.subsidy - x.subsidy;
	});

	answer = answer.map(function(record){
		record.subsidy = Intl.NumberFormat().format(record.subsidy);
		return record;
	});

	// console.log(searchTitle);

	res.render('list', {companyRecords: answer, 
						searchTitle: searchTitle,
						noResult: noResult
					});

});


app.listen(3000, function(){
	console.log("server started on port 3000");
});