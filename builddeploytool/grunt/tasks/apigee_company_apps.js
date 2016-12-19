/*
 * Grunt Apigee Company Apps task
 */

'use strict';
var request = require('request');
var async = require('async');
var curl = require('curl-cmd');
var apigeeSdk = require('../lib/apigee-sdk-mgmt-api-addtl.js');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  function upsertCompanyApps(companyApp, cb2){

      grunt.log.debug( JSON.stringify( grunt.config.get("apigee_profiles") ) );

      apigeeSdk.getCompanyAppList(grunt.config.get("apigee_profiles"),
        function(error, response, body){
          grunt.log.debug(response.statusCode);
          grunt.log.debug(body);
          upsertCompanyAppList(body, companyApp, cb2);
        }, grunt.option('curl'));

  }

  function upsertCompanyAppList(body, companyApp, cb2){ //error, response, body){
    /*jshint validthis:true */
    var companyAppsExisting = JSON.parse(body);
    var companyAppIndex =  companyAppsExisting.indexOf('"' + companyApp.name + '"');

    grunt.log.debug("\n\n\n\nImport:\n");
    grunt.log.debug( JSON.stringify(companyApp) );
    grunt.log.debug("\n\nExisting:\n");
    grunt.log.debug( JSON.stringify(companyAppsExisting) );
    grunt.log.debug("\n\n" + companyAppIndex + "\n");

    grunt.log.debug("\n\n" + companyAppsExisting.indexOf('"' + companyApp.name + '"') + "\n");

    grunt.log.debug("\n\n~~~~~\n");

    if(companyAppsExisting.indexOf('"' + companyApp.name + '"') !== -1){ //companyApp to be imported when it already exists
      
      if(grunt.config.get('artifactConfig').artifact.apigeeConfig.overrideExistingCompanyApps) { 
        updateCompanyApp(companyApp, cb2);
      } else {
        cb2();
      }

    }
    else{
      createCompanyApp(companyApp, cb2);
    }
  }

  function updateCompanyApp(companyApp, cb2){ 

        apigeeSdk.updateCompanyApp(grunt.config.get("apigee_profiles"),/*{'test' : {url_mgmt : 'https://api.enterprise.apigee.com', org : grunt.option('org'), env : grunt.option('env'), username : grunt.option('username'), password : grunt.option('password')}, env : grunt.option('env')},*/
          companyApp.companyName,
          companyApp,
          function(error, response, body){
            grunt.log.debug(response.statusCode);
            grunt.log.debug(body);
            cb2(error);
          },
          grunt.option('curl'));
  }

  function createCompanyApp(companyApp, cb2){
      
        apigeeSdk.createCompanyApp(grunt.config.get("apigee_profiles"),/*{'test' : {url_mgmt : 'https://api.enterprise.apigee.com', org : grunt.option('org'), env : grunt.option('env'), username : grunt.option('username'), password : grunt.option('password')}, env : grunt.option('env')},*/
          companyApp.companyName,
          companyApp,
          function(error, response, body){
            grunt.log.debug(response.statusCode);
            grunt.log.debug(body);
            cb2(error);
          },
          grunt.option('curl'));

  }

  grunt.registerTask('apigee_company_apps', 'Grunt plugin to import company apps.', function() {
    // Merge task-specific and/or target-specific options with these defaults.

    var done = this.async();

    var artifactConfig = grunt.config.get('artifactConfig');
    grunt.log.debug("\n\n" + JSON.stringify(artifactConfig.artifact.companyapps));


    async.eachSeries(artifactConfig.artifact.companyapps, function iteratee(companyApp, cb) {    
            grunt.log.debug("\n\n" + JSON.stringify(companyApp));
            upsertCompanyApp(companyApp, cb);        
      },
      function(error){
        done(error);
      }
    );

  });
  
};
