/*
 * Grunt Apigee Caches task
 */

'use strict';
var request = require('request');
var async = require('async');
var curl = require('curl-cmd');
var apigeeSdk = require('../lib/apigee-sdk-mgmt-api-addtl.js');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  function upsertCache(cache, cb2){

      grunt.log.debug( JSON.stringify( grunt.config.get("apigee_profiles") ) );

      apigeeSdk.getCacheList(grunt.config.get("apigee_profiles"),
        "env",
        function(error, response, body){
          grunt.log.debug(response.statusCode);
          grunt.log.debug(body);
          upsertCacheList(body, cache, cb2);
        }, grunt.option('curl'));

  }

  function upsertCacheList(body, cache, cb2){//error, response, body){
    /*jshint validthis:true */
    var cachesExisting = JSON.parse(body);
    var cacheIndex =  cachesExisting.indexOf(cache.name);

    grunt.log.debug("\n\n\n\nImport:\n");
    grunt.log.debug( JSON.stringify(cache) );
    grunt.log.debug("\n\nExisting:\n");
    grunt.log.debug( JSON.stringify(cachesExisting) );
    grunt.log.debug("\n\n" + cacheIndex + "\n");

    grunt.log.debug("\n\n" + cachesExisting.indexOf(cache.name) + "\n");

    grunt.log.debug("\n\n~~~~~\n");

    if(cachesExisting.indexOf(cache.name) !== -1){ //cache to be imported when it already exists
      
      if(grunt.config.get('artifactConfig').artifact.apigeeConfig.overrideExistingCaches) { 
        updateCache(cache, cb2);
      } else {
        cb2();
      }

    }
    else{
      createCache(cache, cb2);
    }
  }

  function updateCache(cache, cb2){ /*kvmImport,*/

        apigeeSdk.updateCache(grunt.config.get("apigee_profiles"),/*{'test' : {url_mgmt : 'https://api.enterprise.apigee.com', org : grunt.option('org'), env : grunt.option('env'), username : grunt.option('username'), password : grunt.option('password')}, env : grunt.option('env')},*/
          cache,
          function(error, response, body){
            grunt.log.debug(response.statusCode);
            grunt.log.debug(body);
            cb2(error);
          },
          grunt.option('curl'));
  }

  function createCache(cache, cb2){
      
        apigeeSdk.createCache(grunt.config.get("apigee_profiles"),/*{'test' : {url_mgmt : 'https://api.enterprise.apigee.com', org : grunt.option('org'), env : grunt.option('env'), username : grunt.option('username'), password : grunt.option('password')}, env : grunt.option('env')},*/
          cache,
          function(error, response, body){
            grunt.log.debug(response.statusCode);
            grunt.log.debug(body);
            cb2(error);
          },
          grunt.option('curl'));

  }

  grunt.registerTask('apigee_caches', 'Grunt plugin to import Caches.', function() {
    // Merge task-specific and/or target-specific options with these defaults.

    var done = this.async();

    var artifactConfig = grunt.config.get('artifactConfig');
    grunt.log.debug("\n\n" + JSON.stringify(artifactConfig.artifact.caches));


    async.eachSeries(artifactConfig.artifact.caches, function iteratee(cache, cb) {    
            grunt.log.debug("\n\n" + JSON.stringify(cache));
            upsertCache(cache, cb);        
      },
      function(error){
        done(error);
      }
    );

  });
};
