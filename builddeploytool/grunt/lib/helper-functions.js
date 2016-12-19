

exports.generatecURL = function(options){
	//echo curl -H "Authorization:Basic $credentials" "$url/v1/organizations/$org/apis/$application/revisions" -X GET
	var optionsl = JSON.parse(JSON.stringify(options));
	var curl = require('curl-cmd');
	optionsl.auth = optionsl.auth.user + ":" + optionsl.auth.password
	optionsl.hostname = options.uri.replace('https://', '')
	optionsl.path = optionsl.hostname.substring(optionsl.hostname.indexOf('/'));
	optionsl.hostname = optionsl.hostname.replace(optionsl.path, '')
	console.log(curl.cmd(optionsl, {ssl: true, verbose: true}));
}

exports.setNodeResources = function(dir, options, files){
	var fs = require('fs');
	var task = {};
	if (fs.existsSync('./node')) {
		task.options = options;
		task.files = files
	}
	return task;
}

exports.prompts = function(grunt) {
	return {
		target: {
		  options: {
		    questions: [
		      {
		        config: 'username',
		        type: 'input',
		        message: 'Apigee Edge EMail',
		        when: function(){
		        	return !grunt.option('username');
		        }
		      },
		      {
		        config: 'password', // arbitrary name or config for any other grunt task
		        type: 'password', // list, checkbox, confirm, input, password
		        message: 'Apigee Edge Password', // Question to ask the user, function needs to return a string,
		        when: function(){
		        	return !grunt.option('password');
		        }
		      }
		    ],
	        then : function(results, done){
	        	if(results.username) {grunt.config("apigee_profiles." + grunt.option('env') + ".username", results.username);}
	        	if(results.password) {grunt.config("apigee_profiles." + grunt.option('env') + ".password", results.password);}
	        	done();
	        	return true;
	        }
		  }
		}
	}
}


// converts to apigee_conf.profiles since that's what the other libraries expect
exports.getApigeeConf = function(grunt, artifactConfig) {

	// do a comparison between what is passed in as artifactConfig vs command line.
	// Default is artifactConfig, override with command line values



	var username = artifactConfig.artifact.apigeeConfig.username;
	if(grunt.option('username') != null && grunt.option('username') != "") {
		username = grunt.option('username');
	}
	var password = artifactConfig.artifact.apigeeConfig.password;
	if(grunt.option('password') != null && grunt.option('password') != "") {
		password = grunt.option('password');
	}

	var org = artifactConfig.artifact.apigeeConfig.org;
	if(grunt.option('org') != null && grunt.option('org') != "") {
		org = grunt.option('org');
	}
	var env = artifactConfig.artifact.apigeeConfig.env;
	if(grunt.option('env') != null && grunt.option('env') != "") {
		env = grunt.option('env');
	}
	var url_mgmt = artifactConfig.artifact.apigeeConfig.url_mgmt;
	if(grunt.option('url_mgmt') != null && grunt.option('url_mgmt') != "") {
		url_mgmt = grunt.option('url_mgmt');
	}

	var apigeeConfig = {
		env : grunt.option('env'),     // replace with environment
		"environment" : {
			apiproxy : artifactConfig.artifact.proxyConfig.name,
			org : org, // replace with organization
			env : env,     // replace with environment
			url_mgmt : url_mgmt,  // for cloud environments, leave as is
			username : username, //|| process.env.ae_username, // pass credentials as arguments as grunt task --username=$ae_username --password=$ae_password
			password : password, //|| process.env.ae_password, // use ae_username and ae_password are defined as environment variables and no arguments are passed
			revision : artifactConfig.artifact.apigeeConfig.revision, // provide revision to be undeployed by passing argument as --revision=X
            override : artifactConfig.artifact.apigeeConfig.override,
            delay : artifactConfig.artifact.apigeeConfig.delay,
            prodenv: grunt.option('prodenv'),
            produsername: grunt.option('produsername'),
            prodpassword: grunt.option('prodpassword')
		}
	}

	// easiest way to rename a JSON key since the name will be dynamic
	var apigeeConfigStr = JSON.stringify(apigeeConfig);
	apigeeConfigStr = apigeeConfigStr.replace("environment", grunt.option('env'));
	apigeeConfig = JSON.parse(apigeeConfigStr);

	return apigeeConfig;

}


// converts command line arguments to apigee_conf.profiles since that's what the other libraries expect
exports.getApigeeConfFromCmdArg = function(grunt) {


	var apigeeConfig = {
		env : grunt.option('env'),     // replace with environment
		"environment" : {
			apiproxy : grunt.option('proxyName'),
			org : grunt.option('org'), // replace with organization
			env : grunt.option('env'),     // replace with environment
			url_mgmt : grunt.option('url_mgmt'),  // for cloud environments, leave as is
			username : grunt.option('username'), //|| process.env.ae_username, // pass credentials as arguments as grunt task --username=$ae_username --password=$ae_password
			password : grunt.option('password'), //|| process.env.ae_password, // use ae_username and ae_password are defined as environment variables and no arguments are passed
			revision : grunt.option('revision'), // provide revision to be undeployed by passing argument as --revision=X
            override : true,
            delay : 10
		}
	}

	// easiest way to rename a JSON key since the name will be dynamic
	var apigeeConfigStr = JSON.stringify(apigeeConfig);
	apigeeConfigStr = apigeeConfigStr.replace("environment", grunt.option('env'));
	apigeeConfig = JSON.parse(apigeeConfigStr);

	return apigeeConfig;

}


exports.parseKVMResults = function(matches, grunt, cb) {

	grunt.log.debug(JSON.stringify(matches));

	var fs = require('fs');
    var xml2js = require('xml2js');
    var apigeeSdk = require('./apigee-sdk-mgmt-api-addtl.js');
    var async = require('async');
    var request = require('request');
 
	var parser = new xml2js.Parser();

	var kvmResults = {};
	kvmResults.kvms = [];
	
	// parse through the files that match the search criteria
	if(matches != null && matches.matches != null) { 

		// for each file result
		for (var key in matches.matches) {

			
		    if (matches.matches.hasOwnProperty(key)) {
		        grunt.log.debug("filename:" + key);

		        // read each file
				var fileData = fs.readFileSync(key);
				grunt.log.debug(fileData);

				// convert XML file contents to JSON
				parser.parseString(fileData, function (err, result) {
			        grunt.log.debug(result);
			        grunt.log.debug('Done');

			        // gets KVM name
			        var kvmName = result.KeyValueMapOperations.$.mapIdentifier;
			        grunt.log.debug("kvm:" + kvmName);

			        // goes through each entry for the KVM
			       	var kvmObj = {};
			       	kvmObj.name = kvmName;
			       	kvmObj.entries = [];

			       	for(var i=0;i<result.KeyValueMapOperations.Get.length;i++) { 

			            grunt.log.debug("\n\n" + JSON.stringify(result.KeyValueMapOperations.Get[i]));

			            var entry = JSON.stringify(result.KeyValueMapOperations.Get[i].Key[0].Parameter[0]);
			        	entry = entry.substring(1,entry.length-1);
			        	grunt.log.debug("entry:" + entry);

			        	kvmObj.entries.push(entry);
			        }

			        kvmResults.kvms.push(kvmObj);



			    });

		    } 
		}

		grunt.log.debug("kvmResults: " + JSON.stringify(kvmResults) );

		grunt.config.set("kvmResults", kvmResults);

		cb();

	}

}


exports.parseCacheResults = function(matches, grunt, cb) {

	grunt.log.debug(JSON.stringify(matches));

	var fs = require('fs');
    var xml2js = require('xml2js');
    var apigeeSdk = require('./apigee-sdk-mgmt-api-addtl.js');
    var async = require('async');
    var request = require('request');
 
	var parser = new xml2js.Parser();

	var cacheResults = {};
	cacheResults.caches = [];
	
	// parse through the files that match the search criteria
	if(matches != null && matches.matches != null) { 

		// for each file result
		for (var key in matches.matches) {

			
		    if (matches.matches.hasOwnProperty(key)) {
		        grunt.log.debug("filename:" + key);

		        // read each file
				var fileData = fs.readFileSync(key);
				grunt.log.debug(fileData);

				// convert XML file contents to JSON
				parser.parseString(fileData, function (err, result) {
			        grunt.log.debug(JSON.stringify(result));
			        grunt.log.debug('Done');

			        var cacheName = null;

			        if(result.ResponseCache != null) {
			        	cacheName = result.ResponseCache.CacheResource[0];
			        } else if(result.PopulateCache != null) {
			        	cacheName = result.PopulateCache.CacheResource[0];
			        } else if(result.LookupCache != null) {
			        	cacheName = result.LookupCache.CacheResource[0];
			        } else if(result.InvalidateCache != null) {
			        	cacheName = result.InvalidateCache.CacheResource[0];
			        } 

			        if(cacheName != null) {

			        	// if name isn't already on the list, then add
			        	var nameExists = false;
			        	for(i=0;i<cacheResults.caches.length;i++) {
			        		var cName = cacheResults.caches[i];
			        		if(cacheName === cName) {
			        			nameExists = true;
			        			break;
			        		}
			        	}
			        	if(!nameExists) {
			        		cacheResults.caches.push(cacheName);
			        	}
			        }

			    });

		    } 
		}

		grunt.log.debug("cacheResults: " + JSON.stringify(cacheResults) );

		grunt.config.set("cacheResults", cacheResults);

		cb();

	}

}


exports.parseTargetServerResults = function(matches, grunt, cb) {

	grunt.log.debug(JSON.stringify(matches));

	var fs = require('fs');
    var xml2js = require('xml2js');
    var apigeeSdk = require('./apigee-sdk-mgmt-api-addtl.js');
    var async = require('async');
    var request = require('request');
 
	var parser = new xml2js.Parser();

	var tsResults = {};
	tsResults.targetservers = [];
	
	// parse through the files that match the search criteria
	if(matches != null && matches.matches != null) { 

		// for each file result
		for (var key in matches.matches) {

			
		    if (matches.matches.hasOwnProperty(key)) {
		        grunt.log.debug("filename:" + key);

		        // read each file
				var fileData = fs.readFileSync(key);
				grunt.log.debug(fileData);

				// convert XML file contents to JSON
				parser.parseString(fileData, function (err, result) {
			        grunt.log.debug(JSON.stringify(result));
			        grunt.log.debug('Done');

			        var tsName = null;

			        if(result.TargetEndpoint != null) {
			        	tsName = result.TargetEndpoint.HTTPTargetConnection[0].LoadBalancer[0].Server[0].$.name;
			        } else if(result.ServiceCallout != null) {
			        	tsName = result.ServiceCallout.HTTPTargetConnection[0].LoadBalancer[0].Server[0].$.name;
			        } 

			        if(tsName != null) {

			        	// if name isn't already on the list, then add
			        	var nameExists = false;
			        	for(i=0;i<tsResults.targetservers.length;i++) {
			        		var targetserverName = tsResults.targetservers[i];
			        		if(tsName === targetserverName) {
			        			nameExists = true;
			        			break;
			        		}
			        	}
			        	if(!nameExists) {
			        		tsResults.targetservers.push(tsName);
			        	}
			        }

			    });

		    } 
		}

		grunt.log.debug("targetserverResults: " + JSON.stringify(tsResults) );

		grunt.config.set("targetserverResults", tsResults);

		cb();

	}

}


exports.parseLdapResourceResults = function(matches, grunt, cb) {

	grunt.log.debug(JSON.stringify(matches));

	var fs = require('fs');
    var xml2js = require('xml2js');
    var apigeeSdk = require('./apigee-sdk-mgmt-api-addtl.js');
    var async = require('async');
    var request = require('request');
 
	var parser = new xml2js.Parser();

	var lrResults = {};
	lrResults.ldapresources = [];
	
	// parse through the files that match the search criteria
	if(matches != null && matches.matches != null) { 

		// for each file result
		for (var key in matches.matches) {

			
		    if (matches.matches.hasOwnProperty(key)) {
		        grunt.log.debug("filename:" + key);

		        // read each file
				var fileData = fs.readFileSync(key);
				grunt.log.debug(fileData);

				// convert XML file contents to JSON
				parser.parseString(fileData, function (err, result) {
			        grunt.log.debug(JSON.stringify(result));
			        grunt.log.debug('Done');

			        var lrName = null;

			        if(result.Ldap != null) {
			        	lrName = result.Ldap.LdapResource[0];
			        } 

			        if(lrName != null) {

			        	// if name isn't already on the list, then add
			        	var nameExists = false;
			        	for(i=0;i<lrResults.ldapresources.length;i++) {
			        		var ldapResourceName = lrResults.ldapresources[i];
			        		if(lrName === ldapResourceName) {
			        			nameExists = true;
			        			break;
			        		}
			        	}
			        	if(!nameExists) {
			        		lrResults.ldapresources.push(lrName);
			        	}
			        }

			    });

		    } 
		}

		grunt.log.debug("ldapresourceResults: " + JSON.stringify(lrResults) );

		grunt.config.set("ldapresourceResults", lrResults);

		cb();

	}

}
