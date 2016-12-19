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

  function upsertCompany(company, cb2){

      grunt.log.debug( JSON.stringify( grunt.config.get("apigee_profiles") ) );

      apigeeSdk.getCompanyList(grunt.config.get("apigee_profiles"),
        function(error, response, body){
          grunt.log.debug(response.statusCode);
          grunt.log.debug(body);
          upsertCompanyList(body, company, cb2);
        }, grunt.option('curl'));

  }

  function upsertCompanyList(body, company, cb2){ //error, response, body){
    /*jshint validthis:true */
    var companiesExisting = JSON.parse(body);
    var companyIndex =  companiesExisting.indexOf('"' + company.name + '"');

    grunt.log.debug("\n\n\n\nImport:\n");
    grunt.log.debug( JSON.stringify(company) );
    grunt.log.debug("\n\nExisting:\n");
    grunt.log.debug( JSON.stringify(companiesExisting) );
    grunt.log.debug("\n\n" + companyIndex + "\n");

    grunt.log.debug("\n\n" + companiesExisting.indexOf('"' + company.name + '"') + "\n");

    grunt.log.debug("\n\n~~~~~\n");

    if(companiesExisting.indexOf('"' + company.name + '"') !== -1){ //company to be imported when it already exists
      
      if(grunt.config.get('artifactConfig').artifact.apigeeConfig.overrideExistingCompanies) { 
        updateCompany(company, cb2);
      } else {
        cb2();
      }

    }
    else{
      createCompany(company, cb2);
    }
  }

  function updateCompany(company, cb2){ /*kvmImport,*/

        apigeeSdk.updateCompany(grunt.config.get("apigee_profiles"),/*{'test' : {url_mgmt : 'https://api.enterprise.apigee.com', org : grunt.option('org'), env : grunt.option('env'), username : grunt.option('username'), password : grunt.option('password')}, env : grunt.option('env')},*/
          company,
          function(error, response, body){
            grunt.log.debug(response.statusCode);
            grunt.log.debug(body);
            cb2(error);
          },
          grunt.option('curl'));
  }

  function createCompany(company, cb2){
      
        apigeeSdk.createCompany(grunt.config.get("apigee_profiles"),/*{'test' : {url_mgmt : 'https://api.enterprise.apigee.com', org : grunt.option('org'), env : grunt.option('env'), username : grunt.option('username'), password : grunt.option('password')}, env : grunt.option('env')},*/
          company,
          function(error, response, body){
            grunt.log.debug(response.statusCode);
            grunt.log.debug(body);
            cb2(error);
          },
          grunt.option('curl'));

  }

  grunt.registerTask('apigee_companies', 'Grunt plugin to import companies.', function() {
    // Merge task-specific and/or target-specific options with these defaults.

    var done = this.async();

    var artifactConfig = grunt.config.get('artifactConfig');
    grunt.log.debug("\n\n" + JSON.stringify(artifactConfig.artifact.companies));


    async.eachSeries(artifactConfig.artifact.companies, function iteratee(company, cb) {    
            grunt.log.debug("\n\n" + JSON.stringify(company));
            upsertCompany(company, cb);        
      },
      function(error){
        done(error);
      }
    );

  });
  
};
