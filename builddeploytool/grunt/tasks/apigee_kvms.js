/*
 * Grunt Apigee KVMs task
 */

'use strict';
var request = require('request');
var async = require('async');
var curl = require('curl-cmd');
var apigeeSdk = require('../lib/apigee-sdk-mgmt-api-addtl.js');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  function upsertKVM(kvm, cb2){

      grunt.log.debug( JSON.stringify( grunt.config.get("apigee_profiles") ) );

      apigeeSdk.getKVMList(grunt.config.get("apigee_profiles"),
        "env",
        function(error, response, body){
          grunt.log.debug(response.statusCode);
          grunt.log.debug(body);

          if(response.statusCode == 200) {
              upsertKVMList(body, kvm, cb2);
          } else {
              grunt.fail.warn("ERROR: " + JSON.stringify(response));
              cb2();
          }

        }, grunt.option('curl'));

  }

  function upsertKVMList(body, kvm, cb2){//error, response, body){
    /*jshint validthis:true */
    var kvmsExisting = JSON.parse(body);
    var kvmIndex =  kvmsExisting.indexOf(kvm.name);

    grunt.log.debug("\n\n\n\nImport:\n");
    grunt.log.debug( JSON.stringify(kvm) );
    grunt.log.debug("\n\nExisting:\n");
    grunt.log.debug( JSON.stringify(kvmsExisting) );
    grunt.log.debug("\n\nName:\n");
    grunt.log.debug( JSON.stringify(kvm.name) );
    grunt.log.debug("\n\n" + kvmIndex + "\n");

    grunt.log.debug("\n\n" + kvmsExisting.indexOf(kvm.name) + "\n");

    grunt.log.debug("\n\n~~~~~\n");

    if(kvmsExisting.indexOf(kvm.name) !== -1){ //kvm to be imported when it already exists


      // so the KVM exists, but we must go through
      // all the entries.  Either update or create
      // ew kvm entry
      // need to update/create specific entries

      // 1) Get KVM entry list
      // 2) check if entry exists, if not, add it
      // 3) If entry exists, then update it

      grunt.log.debug("overrideExistingKvms: " + grunt.config.get('artifactConfig').artifact.apigeeConfig.overrideExistingKvms);

      if(grunt.config.get('artifactConfig').artifact.apigeeConfig.overrideExistingKvms) { 

        apigeeSdk.getKVMEnvironment(grunt.config.get("apigee_profiles"),
          kvm.name,
          function(error, response, body){
            grunt.log.debug(response.statusCode);
            grunt.log.debug(body);
            upsertKVMEntryList(body, kvm, cb2);
          }, grunt.option('curl'));

      } else {
        cb2();
      }

    }
    else{
      createKVM(kvm, cb2);
    }
  }


  function upsertKVMEntryList(body, kvm, cb2){//error, response, body){
    /*jshint validthis:true */
    var kvmEntriesExisting = JSON.parse(body);
    var kvmEntriesExistingStr = body;

    grunt.log.debug("\n\n\n\nEntries Import:\n");
    grunt.log.debug( JSON.stringify(kvm) );
    grunt.log.debug("\n\nExisting Entries:\n");
    grunt.log.debug( JSON.stringify(kvmEntriesExisting) );


    // for each entry, check if exists or not
    async.eachSeries(kvm.entry, function iteratee(entry, cb2) {    
            
            grunt.log.debug("\nKVM NAME:\n" + JSON.stringify(kvm.name));
            grunt.log.debug("\nENTRY:\n" + JSON.stringify(entry));
            grunt.log.debug("\nENTRY NAME:\n" + JSON.stringify(entry.name));
            //upsertKVMEntry(kvm.name, entry, cb);        

            if(kvmEntriesExistingStr.indexOf(entry.name) !== -1) {
              // update entry
              grunt.log.debug("**UPDATE ENTRY**");

                apigeeSdk.updateKVMEntryEnvironment(grunt.config.get("apigee_profiles"), /*{'test' : {url_mgmt : 'https://api.enterprise.apigee.com', org : grunt.option('org'), env : grunt.option('env'), username : grunt.option('username'), password : grunt.option('password')}, env : grunt.option('env')},*/
                  kvm.name,
                  entry,
                  function(error, response, body){
                    grunt.log.debug(response.statusCode);
                    grunt.log.debug(body);
                    cb2(error);
                  },
                  grunt.option('curl'));

            } else {
              // create entry
              grunt.log.debug("**CREATE ENTRY**");

              apigeeSdk.createKVMEntryEnvironment(grunt.config.get("apigee_profiles"), /*{'test' : {url_mgmt : 'https://api.enterprise.apigee.com', org : grunt.option('org'), env : grunt.option('env'), username : grunt.option('username'), password : grunt.option('password')}, env : grunt.option('env')},*/
                kvm.name,
                entry,
                function(error, response, body){
                  grunt.log.debug(response.statusCode);
                  grunt.log.debug(body);
                  cb2(error);
                },
                grunt.option('curl'));
            } 

      },
      function(error){
        cb2(error);
      }
   );

  }


  function updateKVM(kvm, cb2){ /*kvmImport,*/

        apigeeSdk.updateKVMsEnvironment(grunt.config.get("apigee_profiles"),/*{'test' : {url_mgmt : 'https://api.enterprise.apigee.com', org : grunt.option('org'), env : grunt.option('env'), username : grunt.option('username'), password : grunt.option('password')}, env : grunt.option('env')},*/
          kvm,
          function(error, response, body){
            grunt.log.debug(response.statusCode);
            grunt.log.debug(body);
            cb2(error);
          },
          grunt.option('curl'));
  }

  function createKVM(kvm, cb2){
      
        apigeeSdk.createKVMsEnvironment(grunt.config.get("apigee_profiles"),/*{'test' : {url_mgmt : 'https://api.enterprise.apigee.com', org : grunt.option('org'), env : grunt.option('env'), username : grunt.option('username'), password : grunt.option('password')}, env : grunt.option('env')},*/
          kvm,
          function(error, response, body){
            grunt.log.debug(response.statusCode);
            grunt.log.debug(body);
            cb2(error);
          },
          grunt.option('curl'));

  }

  grunt.registerTask('apigee_kvms', 'Grunt plugin to import KVMs.', function() {
    // Merge task-specific and/or target-specific options with these defaults.

    var done = this.async();

    var artifactConfig = grunt.config.get('artifactConfig');
    grunt.log.debug("\n\n" + JSON.stringify(artifactConfig.artifact.kvms));


    async.eachSeries(artifactConfig.artifact.kvms, function iteratee(kvm, cb) {    
            grunt.log.debug("\n\n" + JSON.stringify(kvm));
            upsertKVM(kvm, cb);        
      },
      function(error){
        done(error);
      }
    );

  });
};
