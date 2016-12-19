/*
 * Grunt Apigee Company Developer task
 */

'use strict';
var request = require('request');
var async = require('async');
var curl = require('curl-cmd');
var apigeeSdk = require('../lib/apigee-sdk-mgmt-api-addtl.js');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  function upsertCompanyDeveloper(companyDeveloper, cb2){

      grunt.log.debug( JSON.stringify( grunt.config.get("apigee_profiles") ) );

      apigeeSdk.getCompanyDeveloperList(grunt.config.get("apigee_profiles"),
        function(error, response, body){
          grunt.log.debug(response.statusCode);
          grunt.log.debug(body);
          upsertCompanyDeveloperList(body, companyDeveloper, cb2);
        }, grunt.option('curl'));

  }

  function upsertCompanyDeveloperList(body, companyDeveloper, cb2){ //error, response, body){
    /*jshint validthis:true */
    var companyDevsExisting = JSON.parse(body);
    var companyDevIndex =  companyDevsExisting.indexOf('"' + companyDeveloper.companyName + '"');

    grunt.log.debug("\n\n\n\nImport:\n");
    grunt.log.debug( JSON.stringify(companyDeveloper) );
    grunt.log.debug("\n\nExisting:\n");
    grunt.log.debug( JSON.stringify(companyDevsExisting) );
    grunt.log.debug("\n\n" + companyDevIndex + "\n");

    grunt.log.debug("\n\n" + companyDevsExisting.indexOf('"' + companyDeveloper.companyName + '"') + "\n");

    grunt.log.debug("\n\n~~~~~\n");

    if(companyDevsExisting.indexOf('"' + companyDeveloper.companyName + '"') !== -1){ //companyDeveloper to be imported when it already exists
      
      if(grunt.config.get('artifactConfig').artifact.apigeeConfig.overrideExistingCompanyDevelopers) { 
        updateCompanyDeveloper(companyDeveloper, cb2);
      } else {
        cb2();
      }

    }
    else{
      createCompanyDeveloper(companyDeveloper, cb2);
    }
  }

  function updateCompanyDeveloper(companyDeveloper, cb2){ 

        apigeeSdk.updateCompanyDeveloper(grunt.config.get("apigee_profiles"),/*{'test' : {url_mgmt : 'https://api.enterprise.apigee.com', org : grunt.option('org'), env : grunt.option('env'), username : grunt.option('username'), password : grunt.option('password')}, env : grunt.option('env')},*/
          companyDeveloper.companyName,
          companyDeveloper,
          function(error, response, body){
            grunt.log.debug(response.statusCode);
            grunt.log.debug(body);
            cb2(error);
          },
          grunt.option('curl'));
  }

  function createCompanyDeveloper(companyDeveloper, cb2){
      
        apigeeSdk.createCompanyDeveloper(grunt.config.get("apigee_profiles"),/*{'test' : {url_mgmt : 'https://api.enterprise.apigee.com', org : grunt.option('org'), env : grunt.option('env'), username : grunt.option('username'), password : grunt.option('password')}, env : grunt.option('env')},*/
          companyDeveloper.companyName,
          companyDeveloper,
          function(error, response, body){
            grunt.log.debug(response.statusCode);
            grunt.log.debug(body);
            cb2(error);
          },
          grunt.option('curl'));

  }

  grunt.registerTask('apigee_company_developers', 'Grunt plugin to import company developers.', function() {
    // Merge task-specific and/or target-specific options with these defaults.

    var done = this.async();

    var artifactConfig = grunt.config.get('artifactConfig');
    grunt.log.debug("\n\n" + JSON.stringify(artifactConfig.artifact.companydevelopers));


    async.eachSeries(artifactConfig.artifact.companydevelopers, function iteratee(companyDeveloper, cb) {    
            grunt.log.debug("\n\n" + JSON.stringify(companyDeveloper));
            upsertCompanyDeveloper(companyDeveloper, cb);        
      },
      function(error){
        done(error);
      }
    );

  });
  
};
