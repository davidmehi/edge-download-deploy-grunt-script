/*
 * Grunt Apigee API Product task
 */

'use strict';
var request = require('request');
var async = require('async');
var curl = require('curl-cmd');
var apigeeSdk = require('../lib/apigee-sdk-mgmt-api-addtl.js');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  function upsertDeveloper(developer, cb2){

      grunt.log.debug( JSON.stringify( grunt.config.get("apigee_profiles") ) );

      apigeeSdk.getDeveloperList(grunt.config.get("apigee_profiles"),
        function(error, response, body){
          grunt.log.debug(response.statusCode);
          grunt.log.debug(body);
          upsertDeveloperList(body, developer, cb2);
        }, grunt.option('curl'));

  }

  function upsertDeveloperList(body, developer, cb2){ //error, response, body){
    /*jshint validthis:true */
    var developersExisting = JSON.parse(body);
    var developerIndex =  developersExisting.indexOf(developer.email);

    grunt.log.debug("\n\n\n\nImport:\n");
    grunt.log.debug( JSON.stringify(developer) );
    grunt.log.debug("\n\nExisting:\n");
    grunt.log.debug( JSON.stringify(developersExisting) );
    grunt.log.debug("\n\n" + developerIndex + "\n");

    grunt.log.debug("\n\n" + developersExisting.indexOf(developer.email) + "\n");

    grunt.log.debug("\n\n~~~~~\n");

    if(developersExisting.indexOf(developer.email) !== -1){ //product to be imported when it already exists
      
      if(grunt.config.get('artifactConfig').artifact.apigeeConfig.overrideExistingDevelopers) { 
        updateDeveloper(developer, cb2);
      } else {
        cb2();
      }

    }
    else{
      createDeveloper(developer, cb2);
    }
  }

  function updateDeveloper(developer, cb2){ /*kvmImport,*/

        apigeeSdk.updateDeveloper(grunt.config.get("apigee_profiles"),/*{'test' : {url_mgmt : 'https://api.enterprise.apigee.com', org : grunt.option('org'), env : grunt.option('env'), username : grunt.option('username'), password : grunt.option('password')}, env : grunt.option('env')},*/
          developer,
          function(error, response, body){
            grunt.log.debug(response.statusCode);
            grunt.log.debug(body);
            cb2(error);
          },
          grunt.option('curl'));
  }

  function createDeveloper(developer, cb2){
      
        apigeeSdk.createDeveloper(grunt.config.get("apigee_profiles"),/*{'test' : {url_mgmt : 'https://api.enterprise.apigee.com', org : grunt.option('org'), env : grunt.option('env'), username : grunt.option('username'), password : grunt.option('password')}, env : grunt.option('env')},*/
          developer,
          function(error, response, body){
            grunt.log.debug(response.statusCode);
            grunt.log.debug(body);
            cb2(error);
          },
          grunt.option('curl'));

  }

  grunt.registerTask('apigee_developers', 'Grunt plugin to import developers.', function() {
    // Merge task-specific and/or target-specific options with these defaults.

    var done = this.async();

    grunt.log.debug("\n\n" + JSON.stringify(grunt.config));

    var artifactConfig = grunt.config.get('artifactConfig');
    grunt.log.debug("\n\n" + JSON.stringify(artifactConfig));
    grunt.log.debug("\n\n" + JSON.stringify(artifactConfig.artifact.developers));


    async.eachSeries(artifactConfig.artifact.developers, function iteratee(developer, cb) {    
            grunt.log.debug("\n\n" + JSON.stringify(developer));
            upsertDeveloper(developer, cb);        
      },
      function(error){
        done(error);
      }
    );

  });
  
};
