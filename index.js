//jshint esversion:6

const fs = require("fs");
const csv = require('csv-parser');
const bodyParser = require("body-parser");

const express = require('express');
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');

const maxNo = 50;
var dataArray = [];
var answer;
var searchTitle;
var noResult;
var keyword;
var sortCriteria = 'subsidy';
var totalSubsidy;
var totalStaff;

app.get('/', function(req, res){
	if (Array.isArray(dataArray) && dataArray.length) {
		res.render('list', {companyRecords: answer, 
						searchTitle: searchTitle,
						noResult: noResult,
						lastKeyword: keyword,
						sortCriteria: sortCriteria,
						totalSubsidy: totalSubsidy,
						totalStaff: totalStaff
					});
	} else {
		fs.createReadStream('allData.csv')
		.pipe(csv())
		.on('data', (row) => {
			dataArray.push(row);
		})
		.on('end', () => {
			console.log('CSV file successfully processed');
			res.render("list", {companyRecords: [], searchTitle:'', noResult:'', lastKeyword:'', sortCriteria: "subsidy",
				 totalSubsidy: 0, totalStaff: 0});
		});
	}
});

app.post('/', function(req, res){

	answer = [];
	sortCriteria = req.body.optradio;
	keyword = req.body.keyword;
	let keywordArr = keyword.split(',');
	let trimKeywordArr = keywordArr.map(s => s.trim());
	let lang = req.body.submit;

	console.log(req.body);
	console.log(dataArray.length);
	
	if (keyword !== '') {
		for (let datum of dataArray){
			let companyName = (lang === 'en') ? datum.companyEn : datum.companyCh;
			for(let keyword of trimKeywordArr){
				if (companyName.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
					answer.push(datum);
					break;
				}
			}
		}

		answer = sortAnswer(answer, sortCriteria);

		searchTitle = '關鍵詞： ' + keyword + ' ';
		noResult = answer.length;

	} else {

		answer = JSON.parse(JSON.stringify(dataArray));
		answer = sortAnswer(answer, sortCriteria);
		answer = answer.slice(0, maxNo);

		searchTitle = "Top ";
		noResult = maxNo;

	} 

	totalSubsidy = answer.reduce(function(sumAll,datum){ return sumAll + parseInt(datum.subsidy); }, 0);
	totalStaff = answer.reduce(function(sumAll,datum){ return sumAll + parseInt(datum.employee); }, 0);

	res.redirect("/");

});

app.listen(3000, function(){
	console.log("server started on port 3000");
});

function sortAnswer(data, column, asc=false){
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
}