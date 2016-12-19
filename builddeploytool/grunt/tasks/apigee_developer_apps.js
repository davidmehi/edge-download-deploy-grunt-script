/*
 * Grunt Apigee Developer Apps task
 */

'use strict';
var request = require('request');
var async = require('async');
var curl = require('curl-cmd');
var apigeeSdk = require('../lib/apigee-sdk-mgmt-api-addtl.js');
var fs = require('fs');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  function upsertDeveloperApp(developerApp, cb2){

      grunt.log.debug( JSON.stringify( grunt.config.get("apigee_profiles") ) );

      apigeeSdk.getDeveloperAppList(grunt.config.get("apigee_profiles"),
        developerApp.developerEmail,
        function(error, response, body){
          grunt.log.debug(response.statusCode);
          grunt.log.debug(body);
          upsertDeveloperAppList(body, developerApp, cb2);
        }, grunt.option('curl'));

  }

  function upsertDeveloperAppList(body, developerApp, cb2){ //error, response, body){
    /*jshint validthis:true */
    var developerAppsExisting = JSON.parse(body);
    var developerAppIndex =  body.indexOf('"' + developerApp.name + '"');

    grunt.log.debug("\n\n\n\nImport:\n");
    grunt.log.debug( JSON.stringify(developerApp) );
    grunt.log.debug("\n\nExisting:\n");
    grunt.log.debug( JSON.stringify(developerAppsExisting) );
    grunt.log.debug("\n\n" + developerAppIndex + "\n");

    grunt.log.debug("\n\n" + body.indexOf('"' + developerApp.name + '"') + "\n");

    grunt.log.debug("\n\n~~~~~\n");

    if(body.indexOf('"' + developerApp.name + '"') !== -1){ //developerApp to be imported when it already exists
      
      if(grunt.config.get('artifactConfig').artifact.apigeeConfig.overrideExistingDeveloperApps) { 
        updateDeveloperApp(developerApp, cb2);
      } else {
        cb2();
      }

    }
    else{
      createDeveloperApp(developerApp, cb2);
    }
  }

  function getProductsForDeveloperApp(developerApp) {

    var products = [];

    if(developerApp.credentials.length > 0 && developerApp.credentials[0].apiProducts.length > 0 ) {

        for(var i=0;i<developerApp.credentials[0].apiProducts.length;i++) {
            var apiProduct = developerApp.credentials[0].apiProducts[i];
            products.push(apiProduct.apiproduct);
        } 
    }

    return products;
  }

  function updateDeveloperApp(developerApp, cb2){ 

        developerApp.apiProducts = getProductsForDeveloperApp(developerApp);

        apigeeSdk.updateDeveloperApp(grunt.config.get("apigee_profiles"),/*{'test' : {url_mgmt : 'https://api.enterprise.apigee.com', org : grunt.option('org'), env : grunt.option('env'), username : grunt.option('username'), password : grunt.option('password')}, env : grunt.option('env')},*/
          developerApp.developerEmail,
          developerApp,
          function(error, response, body){
            grunt.log.debug(response.statusCode);
            grunt.log.debug(body);
            cb2(error);
          },
          grunt.option('curl'));
  }

  // for create, we need to do the following:
  //  - preserve the consumerKey that comes back from the response
  //       - and the products
  //  - delete the key
  //  - upload the new key
  //  - upload the list of products
  function createDeveloperApp(developerApp, cb2){
      
        developerApp.apiProducts = getProductsForDeveloperApp(developerApp);

        grunt.log.debug("grunt.option('produsername'): " + grunt.option('produsername'));
        grunt.log.debug("\n" + JSON.stringify(developerApp) );

        // override if going to prod  - clear out any keys
        if(grunt.option('produsername') != null && grunt.option('produsername') != "") {

            developerApp.apiProducts = [];
            developerApp.credentials = [];

        }


        apigeeSdk.createDeveloperApp(grunt.config.get("apigee_profiles"),
          developerApp.developerEmail,
          developerApp,
          function(error, response, body){
            grunt.log.debug(response.statusCode);
            grunt.log.debug(body);

            if(response.statusCode == 200 || response.statusCode == 201) {


                if(grunt.option('produsername') != null && grunt.option('produsername') != "") {

                    grunt.log.debug("GOT response: \n" + body);

                    // parse out creds, read write to prod file, then exit
                    saveKeyToProdFile(body, cb2);

                } else { 

                    // otherwise, delete key and create new key from file
                    deleteKeyOfDevApp(developerApp, body, cb2);
                }

                
            } else {
                grunt.log.debug("ERROR: " + JSON.stringify(error));
                grunt.fail.warn("ERROR: " + JSON.stringify(response));
                cb2(error);
            }
            
          },
          grunt.option('curl'));

  }

  // called during build task
  function saveKeyToProdFile(body, cb2) {

    var respBody = JSON.parse(body);
    if(respBody.credentials != null && respBody.credentials.length > 0) {

      var appName = respBody.name;
      var consumerKey = respBody.credentials[0].consumerKey;
      var consumerSecret = respBody.credentials[0].consumerSecret;

      // get the prod config file - this is done in the build task, so need to get the 
      // prod file from the folder where the build is being constructed
      var artifactConfig = grunt.config.get('artifactConfig');
      //var apigee_conf = grunt.config.get('apigee_profiles');

      var prodFile = "target/" + artifactConfig.artifact.proxyConfig.name + "/artifact/config/" + grunt.option("prodenv") + "-config.json";
      grunt.log.debug("Reading Prod File: " + prodFile);
      var prodFileObj = grunt.file.readJSON(prodFile);

      // find app name, set consumer key and secret
      var appFound = false;
      for(var i=0;i<prodFileObj.artifact.developerapps.length;i++) {
        var app = prodFileObj.artifact.developerapps[i];
        if(app.name == appName) {
          app.credentials[0].consumerKey = consumerKey;
          app.credentials[0].consumerSecret = consumerSecret;
          appFound = true;
        }
      }

      if(appFound) {

        // save file
        fs.writeFile(prodFile, JSON.stringify(prodFileObj, null, 4), function(err) {
                  if(err) {
                      grunt.log.debug(err);
                      grunt.fail.warn("ERROR: " + JSON.stringify(err));
                      cb2(err);
                  }

                  grunt.log.debug("The file was saved");

                  cb2();
              }); 


      } else {

        grunt.log.debug("No App Found in config file!");
        grunt.log.debug("consumerKey: " + consumerKey);
        grunt.log.debug("consumerSecret: " + consumerSecret);

      }



    } else {
      cb2("No credentials found for app");
    }

  }

  function uploadNewKeyOfDevApp(developerApp, createResponse, cb2) {

      grunt.log.debug("uploadNewKeyOfDevApp");

      var keyPayload = {};
      keyPayload.consumerKey = developerApp.credentials[0].consumerKey;
      keyPayload.consumerSecret = developerApp.credentials[0].consumerSecret;

      grunt.log.debug(JSON.stringify(keyPayload));

      apigeeSdk.addDeveloperAppKey(grunt.config.get("apigee_profiles"),
          developerApp.developerEmail,
          developerApp.name,
          keyPayload,
          function(error, response, body){
            grunt.log.debug(response.statusCode);
            grunt.log.debug(body);

            if(response.statusCode == 200 || response.statusCode == 201) {
                addProductListToDevAppKey(developerApp, keyPayload, createResponse, cb2);
            } else {
                grunt.fail.warn("ERROR: " + JSON.stringify(response));
                cb2(error);
            }

          },
          grunt.option('curl'));

  }

  function addProductListToDevAppKey(developerApp, keyPayload, createResponse, cb2) {

      grunt.log.debug("addProductListToDevAppKey");
      grunt.log.debug(JSON.stringify(developerApp.apiProducts));

      var apiProducts = {};
      apiProducts.apiProducts = developerApp.apiProducts;

      apigeeSdk.addDeveloperAppProducts(grunt.config.get("apigee_profiles"),
          developerApp.developerEmail,
          developerApp.name,
          keyPayload.consumerKey,
          apiProducts,
          function(error, response, body){
            grunt.log.debug(response.statusCode);
            grunt.log.debug(body);

            cb2(error);

          },
          grunt.option('curl'));

  }


  function deleteKeyOfDevApp(developerApp, createResponse, cb2) {

      grunt.log.debug("deleteKeyOfDevApp");
      //grunt.log.debug(JSON.stringify(createResponse));
      var cr = JSON.parse(createResponse);
      var appKey = cr.credentials[0].consumerKey;
      grunt.log.debug(appKey);

      apigeeSdk.deleteDeveloperAppKey(grunt.config.get("apigee_profiles"),
          developerApp.developerEmail,
          developerApp.name,
          appKey,
          function(error, response, body){
            grunt.log.debug(response.statusCode);
            grunt.log.debug(body);
            
            if(response.statusCode == 200 || response.statusCode == 201) {
                uploadNewKeyOfDevApp(developerApp, createResponse, cb2);
            } else {                
                grunt.fail.warn("ERROR: " + JSON.stringify(response));
                cb2(error);
            }

            //cb2(error);
          },
          grunt.option('curl'));

  }


  grunt.registerTask('apigee_developer_apps', 'Grunt plugin to import developer apps.', function() {
    // Merge task-specific and/or target-specific options with these defaults.

    var done = this.async();

    var artifactConfig = grunt.config.get('artifactConfig');
    grunt.log.debug("\n\n" + JSON.stringify(artifactConfig.artifact.developerapps));


    async.eachSeries(artifactConfig.artifact.developerapps, function iteratee(developerApp, cb) {    
            grunt.log.debug("\n\n" + JSON.stringify(developerApp));
            upsertDeveloperApp(developerApp, cb);        
      },
      function(error){
        done(error);
      }
    );

  });
  
};
