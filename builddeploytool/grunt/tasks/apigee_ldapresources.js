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

  function upsertLdapResource(ldapresource, cb2){

      grunt.log.debug( JSON.stringify( grunt.config.get("apigee_profiles") ) );

      apigeeSdk.getLdapResourceList(grunt.config.get("apigee_profiles"),
        function(error, response, body){
          grunt.log.debug(response.statusCode);
          grunt.log.debug(body);
          upsertLdapResourceList(body, ldapresource, cb2);
        }, grunt.option('curl'));

  }

  function upsertLdapResourceList(body, ldapresource, cb2){//error, response, body){
    /*jshint validthis:true */
    var lrExisting = JSON.parse(body);
    var lrIndex =  lrExisting.indexOf(ldapresource.name);

    grunt.log.debug("\n\n\n\nImport:\n");
    grunt.log.debug( JSON.stringify(ldapresource) );
    grunt.log.debug("\n\nExisting:\n");
    grunt.log.debug( JSON.stringify(lrExisting) );
    grunt.log.debug("\n\n" + lrIndex + "\n");

    grunt.log.debug("\n\n" + lrExisting.indexOf(ldapresource.name) + "\n");

    grunt.log.debug("\n\n~~~~~\n");

    if(lrExisting.indexOf(ldapresource.name) !== -1){ //ldapresource to be imported when it already exists
      
      if(grunt.config.get('artifactConfig').artifact.apigeeConfig.overrideExistingLdapResources) { 
        updateLdapResource(ldapresource, cb2);
      } else {
        cb2();
      }

    }
    else{
      createLdapResource(ldapresource, cb2);
    }
  }

  function updateLdapResource(ldapresource, cb2){ /*kvmImport,*/

        apigeeSdk.updateLdapResource(grunt.config.get("apigee_profiles"),/*{'test' : {url_mgmt : 'https://api.enterprise.apigee.com', org : grunt.option('org'), env : grunt.option('env'), username : grunt.option('username'), password : grunt.option('password')}, env : grunt.option('env')},*/
          ldapresource,
          function(error, response, body){
            grunt.log.debug(response.statusCode);
            grunt.log.debug(body);
            cb2(error);
          },
          grunt.option('curl'));
  }

  function createLdapResource(ldapresource, cb2){
      
        apigeeSdk.createLdapResource(grunt.config.get("apigee_profiles"),/*{'test' : {url_mgmt : 'https://api.enterprise.apigee.com', org : grunt.option('org'), env : grunt.option('env'), username : grunt.option('username'), password : grunt.option('password')}, env : grunt.option('env')},*/
          ldapresource,
          function(error, response, body){
            grunt.log.debug(response.statusCode);
            grunt.log.debug(body);
            cb2(error);
          },
          grunt.option('curl'));

  }

  grunt.registerTask('apigee_ldapresources', 'Grunt plugin to import LDAP Resources.', function() {
    // Merge task-specific and/or target-specific options with these defaults.

    var done = this.async();

    var artifactConfig = grunt.config.get('artifactConfig');
    grunt.log.debug("\n\n" + JSON.stringify(artifactConfig.artifact.ldapresources));


    async.eachSeries(artifactConfig.artifact.ldapresources, function iteratee(ldapresource, cb) {    
            grunt.log.debug("\n\n" + JSON.stringify(ldapresource));
            upsertLdapResource(ldapresource, cb);        
      },
      function(error){
        done(error);
      }
    );

  });
};
