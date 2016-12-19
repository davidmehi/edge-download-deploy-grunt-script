/*
 * Grunt Apigee TargetServers task
 */

'use strict';
var request = require('request');
var async = require('async');
var curl = require('curl-cmd');
var apigeeSdk = require('../lib/apigee-sdk-mgmt-api-addtl.js');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  function upsertTargetServer(targetServer, cb2){

      grunt.log.debug( JSON.stringify( grunt.config.get("apigee_profiles") ) );

      apigeeSdk.getTargetServerList(grunt.config.get("apigee_profiles"),
        "env",
        function(error, response, body){
          grunt.log.debug(response.statusCode);
          grunt.log.debug(body);
          upsertTargetServerList(body, targetServer, cb2);
        }, grunt.option('curl'));

  }

  function upsertTargetServerList(body, targetServer, cb2){//error, response, body){
    /*jshint validthis:true */
    var targetServerExisting = JSON.parse(body);
    var targetServerIndex =  targetServerExisting.indexOf(targetServer.name);

    grunt.log.debug("\n\n\n\nImport:\n");
    grunt.log.debug( JSON.stringify(targetServer) );
    grunt.log.debug("\n\nExisting:\n");
    grunt.log.debug( JSON.stringify(targetServerExisting) );
    grunt.log.debug("\n\n" + targetServerIndex + "\n");

    grunt.log.debug("\n\n" + targetServerExisting.indexOf(targetServer.name) + "\n");

    grunt.log.debug("\n\n~~~~~\n");

    if(targetServerExisting.indexOf(targetServer.name) !== -1){ //TS to be imported when it already exists

      if(grunt.config.get('artifactConfig').artifact.apigeeConfig.overrideExistingTargetServers) { 
        updateTargetServer(targetServer, cb2);
      } else {
        cb2();
      }
    }
    else{
      createTargetServer(targetServer, cb2);
    }
  }

  function updateTargetServer(targetServer, cb2){ /*kvmImport,*/

        apigeeSdk.updateTargetServer(grunt.config.get("apigee_profiles"),/*{'test' : {url_mgmt : 'https://api.enterprise.apigee.com', org : grunt.option('org'), env : grunt.option('env'), username : grunt.option('username'), password : grunt.option('password')}, env : grunt.option('env')},*/
          targetServer,
          function(error, response, body){
            grunt.log.debug(response.statusCode);
            grunt.log.debug(body);
            cb2(error);
          },
          grunt.option('curl'));
  }

  function createTargetServer(targetServer, cb2){
      
        apigeeSdk.createTargetServer(grunt.config.get("apigee_profiles"),/*{'test' : {url_mgmt : 'https://api.enterprise.apigee.com', org : grunt.option('org'), env : grunt.option('env'), username : grunt.option('username'), password : grunt.option('password')}, env : grunt.option('env')},*/
          targetServer,
          function(error, response, body){
            grunt.log.debug(response.statusCode);
            grunt.log.debug(body);
            cb2(error);
          },
          grunt.option('curl'));

  }

  grunt.registerTask('apigee_targetservers', 'Grunt plugin to import target servers.', function() {
    // Merge task-specific and/or target-specific options with these defaults.

    var done = this.async();

    var artifactConfig = grunt.config.get('artifactConfig');
    grunt.log.debug("\n\n" + JSON.stringify(artifactConfig.artifact.targetservers));


    async.eachSeries(artifactConfig.artifact.targetservers, function iteratee(targetServer, cb) {    
            grunt.log.debug("\n\n" + JSON.stringify(targetServer));
            upsertTargetServer(targetServer, cb);        
      },
      function(error){
        done(error);
      }
    );

  });
};
