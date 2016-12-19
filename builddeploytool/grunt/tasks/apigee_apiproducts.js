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

  function upsertProduct(product, cb2){

      grunt.log.debug( JSON.stringify( grunt.config.get("apigee_profiles") ) );

      apigeeSdk.getProductList(grunt.config.get("apigee_profiles"),
        function(error, response, body){
          grunt.log.debug(response.statusCode);
          grunt.log.debug(body);
          upsertProductList(body, product, cb2);
        }, grunt.option('curl'));

  }

  function upsertProductList(body, product, cb2){ //error, response, body){
    /*jshint validthis:true */
    var productsExisting = JSON.parse(body);
    var productIndex =  productsExisting.indexOf(product.name);

    grunt.log.debug("\n\n\n\nImport:\n");
    grunt.log.debug( JSON.stringify(product) );
    grunt.log.debug("\n\nExisting:\n");
    grunt.log.debug( JSON.stringify(productsExisting) );
    grunt.log.debug("\n\n" + productIndex + "\n");

    grunt.log.debug("\n\n" + productsExisting.indexOf(product.name) + "\n");

    grunt.log.debug("\n\n~~~~~\n");

    if(productsExisting.indexOf(product.name) !== -1){ //product to be imported when it already exists
      
      if(grunt.config.get('artifactConfig').artifact.apigeeConfig.overrideExistingAPIProducts) { 
        updateProduct(product, cb2);
      } else {
        cb2();
      }

    }
    else{
      createProduct(product, cb2);
    }
  }

  function updateProduct(product, cb2){ /*kvmImport,*/

        apigeeSdk.updateProduct(grunt.config.get("apigee_profiles"),/*{'test' : {url_mgmt : 'https://api.enterprise.apigee.com', org : grunt.option('org'), env : grunt.option('env'), username : grunt.option('username'), password : grunt.option('password')}, env : grunt.option('env')},*/
          product,
          function(error, response, body){
            grunt.log.debug(response.statusCode);
            grunt.log.debug(body);
            cb2(error);
          },
          grunt.option('curl'));
  }

  function createProduct(product, cb2){
      
        apigeeSdk.createProduct(grunt.config.get("apigee_profiles"),/*{'test' : {url_mgmt : 'https://api.enterprise.apigee.com', org : grunt.option('org'), env : grunt.option('env'), username : grunt.option('username'), password : grunt.option('password')}, env : grunt.option('env')},*/
          product,
          function(error, response, body){
            grunt.log.debug(response.statusCode);
            grunt.log.debug(body);
            cb2(error);
          },
          grunt.option('curl'));

  }

  grunt.registerTask('apigee_apiproducts', 'Grunt plugin to import API Products.', function() {
    // Merge task-specific and/or target-specific options with these defaults.

    var done = this.async();

    var artifactConfig = grunt.config.get('artifactConfig');
    grunt.log.debug("\n\n" + JSON.stringify(artifactConfig.artifact.apiproducts));


    async.eachSeries(artifactConfig.artifact.apiproducts, function iteratee(product, cb) {    
            grunt.log.debug("\n\n" + JSON.stringify(product));
            upsertProduct(product, cb);        
      },
      function(error){
        done(error);
      }
    );

  });
  
};
