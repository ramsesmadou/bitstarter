#!/usr/bin/env node

var fs= require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var restler = require('restler');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";

var assertFileExists = function(infile){
    var instr = infile.toString();
    if(!fs.existsSync(instr)){
	console.log("%s does not exist. Exiting.", instr);
	process.exit(1);
	}
    return instr;
};

var cheerioHtmlFile = function(htmlfile){
    return cheerio.load(htmlfile);
};

var loadChecks = function(checksfile){
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile){
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks){
	var present = $(checks[ii]).length>0;
	out[checks[ii]] = present;
	}
    return out;
};

var clone = function(fn) {
    //work around fo commander.js issue
    //http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
	.option('-c, --checks <check_file>', 'path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
	.option('-f, --file <html_file>', 'path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
	.option('-u, --url <url>', 'URL address')

	.parse(process.argv);
    console.log(program.url);
    var inputhtmlfile;
    if(program.url)  {
	console.log("program.url= %2",program.url);
	restler.get(program.url).on('complete', function(result){
	    inputhtmlfile=result;
	    var checkJson = checkHtmlFile(inputhtmlfile, program.checks);
	    var outJson = JSON.stringify(checkJson,null,4);
	    console.log(outJson)
	});
	
    }else{
	inputhtmlfile = fs.readFileSync(program.file);
    
	console.log("i got here");
	var checkJson = checkHtmlFile(inputhtmlfile, program.checks);
	var outJson = JSON.stringify(checkJson,null,4);
	fs.writeFile("./graderOutput.json",outJson,function(err){
	    if(err){
		console.log(err);
		}
	    else {
		console.log("the json file has been written!");
		}
	    });
	console.log(outJson);
	}
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
