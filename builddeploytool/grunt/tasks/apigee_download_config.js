/*
 * Grunt Apigee Download config task
 */

'use strict';
var fs = require('fs');
var request = require('request');
var async = require('async');
var curl = require('curl-cmd');
var apigeeSdk = require('../lib/apigee-sdk-mgmt-api-addtl.js');

module.exports = function(grunt) {



  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  /*

  function upsertKVM(kvm, cb2){

      grunt.log.debug( JSON.stringify( grunt.config.get("apigee_profiles") ) );

      apigeeSdk.getKVMList(grunt.config.get("apigee_profiles"),
        "env",
        function(error, response, body){
          grunt.log.debug(response.statusCode);
          grunt.log.debug(body);
          upsertKVMList(body, kvm, cb2);
        }, grunt.option('curl'));

  }

  function upsertKVMList(body, kvm, cb2){//error, response, body){

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

                apigeeSdk.updateKVMEntryEnvironment(grunt.config.get("apigee_profiles"), 
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

              apigeeSdk.createKVMEntryEnvironment(grunt.config.get("apigee_profiles"), 
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


  function updateKVM(kvm, cb2){ 

        apigeeSdk.updateKVMsEnvironment(grunt.config.get("apigee_profiles"),
          kvm,
          function(error, response, body){
            grunt.log.debug(response.statusCode);
            grunt.log.debug(body);
            cb2(error);
          },
          grunt.option('curl'));
  }

  function createKVM(kvm, cb2){
      
        apigeeSdk.createKVMsEnvironment(grunt.config.get("apigee_profiles"), 
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

  */

/*
function iterateKVMs(kvm, cb){//error, response, body){

    grunt.log.debug("\n\n\n\nEntries Import:\n");
    grunt.log.debug( JSON.stringify(kvm) );


    // for each entry, check if exists or not
    async.eachSeries(kvm.entries, function iteratee(entry, cb) {    
            
            grunt.log.debug("\nKVM NAME:\n" + JSON.stringify(kvm.name));
            grunt.log.debug("\nENTRY:\n" + JSON.stringify(entry));
            //upsertKVMEntry(kvm.name, entry, cb);        


            apigeeSdk.getKVMEntryEnvironment(grunt.config.get("apigee_profiles"), 
              kvm.name,
              entry,
              function(error, response, body){
                grunt.log.debug("getting response");
                grunt.log.debug(response.statusCode);
                grunt.log.debug(body);


                cb();
              },
              grunt.option('curl'));

            //cb();
      },
      function(error){
        cb(error);
      }
   );

  }
*/


   function getDeveloperAppDetail(developerList, cb) {

      grunt.log.debug("getDeveloperAppDetail");

      async.eachSeries(developerList, function iteratee(developer, cb2) {    
              grunt.log.debug("\n\n" + JSON.stringify(developer));

              // Get Ldap Resource settings
              apigeeSdk.getDeveloperAppList(grunt.config.get("apigee_profiles"), 
                developer.email,
                function(error, response, body){
                  grunt.log.debug("getting developer apps");
                  grunt.log.debug(response.statusCode);
                  grunt.log.debug(body);
                  var developerappConfig = JSON.parse(body);

                  // iterate through list, get matching entries and add
                  if(developerappConfig != null && response.statusCode == 200 
                    && developerappConfig.app != null && developerappConfig.app.length > 0) 
                  { 
                     // lets add this to the main config and save
                    var proxyConfig = grunt.config.get("proxyConfig");
                    for(var i=0;i<developerappConfig.app.length;i++) {
                      var devAppConfig = developerappConfig.app[i];
                      devAppConfig.developerEmail = developer.email;

                      if(grunt.option("appName") != null) {

                          if(grunt.option("appName") == devAppConfig.name) {
                              proxyConfig.artifact.developerapps.push(devAppConfig);
                          }

                      } else {
                          proxyConfig.artifact.developerapps.push(devAppConfig);
                      }

                    }
                    grunt.config.set("proxyConfig", proxyConfig);

                    grunt.log.debug("\n\n**PROXY CONFIG: " + JSON.stringify(proxyConfig) );

                    cb2();

                  } else {

                    grunt.fail.warn("ERROR: " + JSON.stringify(response));
                    cb2();
                  }
                  
                },
                grunt.option('curl'));

              //cb();

        },
        function(error){
          cb(error);
        }
      );

    }  



    grunt.registerTask('apigee_get_developer_apps', 'Grunt plugin to fill in config details for developer apps', function() {
      // Merge task-specific and/or target-specific options with these defaults.

      var done = this.async();


      var proxyConfig = grunt.config.get("proxyConfig");
      var developerList = proxyConfig.artifact.developers;

      //async.eachSeries(developerList, function iteratee(developer, cb) {  

        getDeveloperAppDetail(developerList, function() { grunt.log.debug("got developer apps"); done(); });

      //},
      //  function(error){
      //    done(error);
      //  }
      //);
      
    });



   function getDevelopers(developerList, cb) {

      async.eachSeries(developerList, function iteratee(developerName, cb) {    
              grunt.log.debug("\n\n" + JSON.stringify(developerName));

              // Get Ldap Resource settings
              apigeeSdk.getDeveloper(grunt.config.get("apigee_profiles"), 
                developerName,
                function(error, response, body){
                  grunt.log.debug("getting developers");
                  grunt.log.debug(response.statusCode);
                  grunt.log.debug(body);
                  var developerConfig = JSON.parse(body);

                  // iterate through list, get matching entries and add
                  if(developerConfig != null && response.statusCode == 200) { 
                     // lets add this to the main config and save
                    var proxyConfig = grunt.config.get("proxyConfig");
                    proxyConfig.artifact.developers.push(developerConfig);
                    grunt.config.set("proxyConfig", proxyConfig);

                    grunt.log.debug("\n\n**PROXY CONFIG: " + JSON.stringify(proxyConfig) );

                    cb();

                  } else {
                    grunt.fail.warn("ERROR: " + JSON.stringify(response));         
                    cb();           
                  }
                  
                },
                grunt.option('curl'));

        },
        function(error){
          cb(error);
        }
      );


    }


    grunt.registerTask('apigee_get_developers', 'Grunt plugin to fill in config details for developers', function() {
      // Merge task-specific and/or target-specific options with these defaults.

      var done = this.async();

      // Get API Product List
      apigeeSdk.getDeveloperList(grunt.config.get("apigee_profiles"), 
        function(error, response, body){
          grunt.log.debug("getting developers");
          grunt.log.debug(response.statusCode);
          grunt.log.debug(body);

          var developerList = JSON.parse(body);

          if(grunt.option("developerEmail") != null) {

              // filter out list by specified developerEmail
              var newDeveloperList = [];
              newDeveloperList.push(grunt.option("developerEmail"));
              developerList = newDeveloperList;

          }


          // iterate through list, getting details of each product
          if(developerList != null && response.statusCode == 200) { 
          
            getDevelopers(developerList, function() {

              done();

            });

          } else {

            grunt.fail.warn("ERROR: " + JSON.stringify(response));
            done();
          }

        },
        grunt.option('curl'));
      
    });


    function getCompanyDevelopers(companyName, cb2) {

      grunt.log.debug("getCompanyDevelopers");

     // async.eachSeries(companyAppList, function iteratee(companyAppName, cb2) {    
              grunt.log.debug("\n\n" + JSON.stringify(companyName));

              // Get company developer list
              apigeeSdk.getCompanyDeveloperList(grunt.config.get("apigee_profiles"), 
                companyName,
                function(error, response, body){
                  grunt.log.debug("getting company developers");
                  grunt.log.debug(response.statusCode);
                  grunt.log.debug(body);
                  var companydevConfig = JSON.parse(body);

                  // iterate through list, get matching entries and add
                  if(companydevConfig != null && response.statusCode == 200) { 

                    companydevConfig.companyName = companyName;
                     // lets add this to the main config and save
                    var proxyConfig = grunt.config.get("proxyConfig");
                    proxyConfig.artifact.companydevelopers.push(companydevConfig);
                    grunt.config.set("proxyConfig", proxyConfig);

                    grunt.log.debug("\n\n**PROXY CONFIG: " + JSON.stringify(proxyConfig) );

                    cb2();

                  } else {
                    grunt.fail.warn("ERROR: " + JSON.stringify(response));
                    cb2();
                  }

                },
                grunt.option('curl'));

              //cb();

      //  },
      //  function(error){
      //    cb2(error);
      //  }
      //);

    }  


    grunt.registerTask('apigee_get_company_developers', 'Grunt plugin to fill in config details for company developers', function() {
      // Merge task-specific and/or target-specific options with these defaults.

      var done = this.async();


      var proxyConfig = grunt.config.get("proxyConfig");
      var companyList = proxyConfig.artifact.companies;

      async.eachSeries(companyList, function iteratee(company, cb) {  

        getCompanyDevelopers(company.name, function() { grunt.log.debug("got company developer"); cb(); });

      },
        function(error){
          done(error);
        }
      );
      
    });


/*
    grunt.registerTask('apigee_get_company_developers', 'Grunt plugin to fill in config details for company developers', function() {
      // Merge task-specific and/or target-specific options with these defaults.

      var done = this.async();

      // Get API Product List
      apigeeSdk.getCompanyList(grunt.config.get("apigee_profiles"), 
        function(error, response, body){
          grunt.log.debug("getting companies");
          grunt.log.debug(response.statusCode);
          grunt.log.debug(body);

          var companyList = JSON.parse(body);

          // iterate through list, getting details of each product
          if(companyList != null && response.statusCode == 200) { 
          
            getCompanyDevelopers(companyList, function() {

              done();

            });

          } else {

            done();
          }

        },
        grunt.option('curl'));
      
    });

*/

   function getCompanyAppDetail(companyName, companyAppList, cb2) {

      grunt.log.debug("getCompanyAppDetail");

      async.eachSeries(companyAppList, function iteratee(companyAppName, cb2) {    
              grunt.log.debug("\n\n" + JSON.stringify(companyAppName));

              // Get Ldap Resource settings
              apigeeSdk.getCompanyApp(grunt.config.get("apigee_profiles"), 
                companyName,
                companyAppName,
                function(error, response, body){
                  grunt.log.debug("getting company apps");
                  grunt.log.debug(response.statusCode);
                  grunt.log.debug(body);
                  var companyappConfig = JSON.parse(body);

                  // iterate through list, get matching entries and add
                  if(companyappConfig != null && response.statusCode == 200) { 
                     // lets add this to the main config and save
                    var proxyConfig = grunt.config.get("proxyConfig");
                    proxyConfig.artifact.companyapps.push(companyappConfig);
                    grunt.config.set("proxyConfig", proxyConfig);

                    grunt.log.debug("\n\n**PROXY CONFIG: " + JSON.stringify(proxyConfig) );

                    cb2();

                  } else {
                    grunt.fail.warn("ERROR: " + JSON.stringify(response));
                    cb2();
                  }

                },
                grunt.option('curl'));

              //cb();

        },
        function(error){
          cb2(error);
        }
      );

    }  



    grunt.registerTask('apigee_get_company_apps', 'Grunt plugin to fill in config details for company apps', function() {
      // Merge task-specific and/or target-specific options with these defaults.

      var done = this.async();


      var proxyConfig = grunt.config.get("proxyConfig");
      var companyList = proxyConfig.artifact.companies;

      async.eachSeries(companyList, function iteratee(company, cb) {  

        getCompanyAppDetail(company.name, company.apps, function() { grunt.log.debug("got company app"); cb(); });

      },
        function(error){
          done(error);
        }
      );
      
    });


   function getCompanyDetails(companyList, cb) {

      async.eachSeries(companyList, function iteratee(companyName, cb) {    
              grunt.log.debug("\n\n" + JSON.stringify(companyName));

              // Get Ldap Resource settings
              apigeeSdk.getCompany(grunt.config.get("apigee_profiles"), 
                companyName,
                function(error, response, body){
                  grunt.log.debug("getting company details");
                  grunt.log.debug(response.statusCode);
                  grunt.log.debug(body);
                  var companyConfig = JSON.parse(body);

                  // iterate through list, get matching entries and add
                  if(companyConfig != null && response.statusCode == 200) { 
                     // lets add this to the main config and save
                    var proxyConfig = grunt.config.get("proxyConfig");
                    proxyConfig.artifact.companies.push(companyConfig);
                    grunt.config.set("proxyConfig", proxyConfig);

                    grunt.log.debug("\n\n**PROXY CONFIG: " + JSON.stringify(proxyConfig) );

                    cb();

                  } else {
                    grunt.fail.warn("ERROR: " + JSON.stringify(response));
                    cb();
                  }

                },
                grunt.option('curl'));

        },
        function(error){
          cb(error);
        }
      );


    }


    grunt.registerTask('apigee_get_companies', 'Grunt plugin to fill in config details for companies', function() {
      // Merge task-specific and/or target-specific options with these defaults.

      var done = this.async();

      // Get API Product List
      apigeeSdk.getCompanyList(grunt.config.get("apigee_profiles"), 
        function(error, response, body){
          grunt.log.debug("getting companies");
          grunt.log.debug(response.statusCode);
          grunt.log.debug(body);

          var companyList = JSON.parse(body);

          // iterate through list, getting details of each product
          if(companyList != null && response.statusCode == 200) { 
          
            getCompanyDetails(companyList, function() {

              done();

            });

          } else {

            done();
          }

        },
        grunt.option('curl'));
      

    });


    function getProductDetails(productList, cb) {

      async.eachSeries(productList, function iteratee(productName, cb) {    
              grunt.log.debug("\n\n" + JSON.stringify(productName));

              // Get Ldap Resource settings
              apigeeSdk.getProduct(grunt.config.get("apigee_profiles"), 
                productName,
                function(error, response, body){
                  grunt.log.debug("getting product detailss");
                  grunt.log.debug(response.statusCode);
                  grunt.log.debug(body);
                  var productConfig = JSON.parse(body);

                  // iterate through list, get matching entries and add
                  if(productConfig != null && response.statusCode == 200) { 
                     // lets add this to the main config and save
                    var proxyConfig = grunt.config.get("proxyConfig");
                    proxyConfig.artifact.apiproducts.push(productConfig);
                    grunt.config.set("proxyConfig", proxyConfig);

                    grunt.log.debug("\n\n**PROXY CONFIG: " + JSON.stringify(proxyConfig) );

                    cb();

                  } else {
                    grunt.fail.warn("ERROR: " + JSON.stringify(response));
                    cb()
                  }

                },
                grunt.option('curl'));

        },
        function(error){
          cb(error);
        }
      );


    }


    grunt.registerTask('apigee_get_apiproducts', 'Grunt plugin to fill in config details for api products', function() {
      // Merge task-specific and/or target-specific options with these defaults.

      var done = this.async();

      var apiproduct = null;
      if(grunt.option('apiproduct') != null && grunt.option('apiproduct') != "") {
        apiproduct = grunt.option('apiproduct');
      }

      // if api product specified, then just get that one.  Otherwise, get all
      if(apiproduct != null) {

        var productList = [];
        productList.push(apiproduct);
        
        getProductDetails(productList, function() {

          done();

        });


      } else {

        // Get API Product List
        apigeeSdk.getProductList(grunt.config.get("apigee_profiles"), 
          function(error, response, body){
            grunt.log.debug("getting API Products");
            grunt.log.debug(response.statusCode);
            grunt.log.debug(body);

            var productList = JSON.parse(body);

            // iterate through list, getting details of each product
            if(productList != null && response.statusCode == 200) { 
            
              getProductDetails(productList, function() {

                done();

              });

            } else {

              grunt.fail.warn("ERROR: " + JSON.stringify(response));
              done();
            }

          },
          grunt.option('curl'));

      }      

    });


    grunt.registerTask('apigee_get_ldapresource', 'Grunt plugin to fill in config details for ldap resources', function() {
      // Merge task-specific and/or target-specific options with these defaults.

      var done = this.async();

      var ldapresourceResults = grunt.config.get("ldapresourceResults");
      grunt.log.debug(JSON.stringify(ldapresourceResults));

      // for each ldap resource identified
      async.eachSeries(ldapresourceResults.ldapresources, function iteratee(lrName, cb) {    
              grunt.log.debug("\n\n" + JSON.stringify(lrName));

              // Get Ldap Resource settings
              apigeeSdk.getLdapResource(grunt.config.get("apigee_profiles"), 
                lrName,
                "env",
                function(error, response, body){
                  grunt.log.debug("getting TargetServer resp");
                  grunt.log.debug(response.statusCode);
                  grunt.log.debug(body);
                  var lrConfig = JSON.parse(body);

                  // iterate through list, get matching entries and add
                  if(lrConfig != null && response.statusCode == 200) { 
                     // lets add this to the main config and save
                    var proxyConfig = grunt.config.get("proxyConfig");
                    proxyConfig.artifact.ldapresources.push(lrConfig);
                    grunt.config.set("proxyConfig", proxyConfig);

                    grunt.log.debug("\n\n**PROXY CONFIG: " + JSON.stringify(proxyConfig) );

                    cb();

                  } else {
                    grunt.fail.warn("ERROR: " + JSON.stringify(response));
                    cb();
                  }

                  
                },
                grunt.option('curl'));

        },
        function(error){
          done(error);
        }
      );

    });


    grunt.registerTask('apigee_get_targetserver', 'Grunt plugin to fill in config details for targetservers', function() {
      // Merge task-specific and/or target-specific options with these defaults.

      var done = this.async();

      var targetserverResults = grunt.config.get("targetserverResults");
      grunt.log.debug(JSON.stringify(targetserverResults));

      // for each cache identified
      async.eachSeries(targetserverResults.targetservers, function iteratee(tsName, cb) {    
              grunt.log.debug("\n\n" + JSON.stringify(tsName));

              // Get Cache settings
              apigeeSdk.getTargetServer(grunt.config.get("apigee_profiles"), 
                tsName,
                "env",
                function(error, response, body){
                  grunt.log.debug("getting TargetServer resp");
                  grunt.log.debug(response.statusCode);
                  grunt.log.debug(body);
                  var tsConfig = JSON.parse(body);

                  // iterate through list, get matching entries and add
                  if(tsConfig != null && response.statusCode == 200) { 
                     // lets add this to the main config and save
                    var proxyConfig = grunt.config.get("proxyConfig");
                    proxyConfig.artifact.targetservers.push(tsConfig);
                    grunt.config.set("proxyConfig", proxyConfig);

                    grunt.log.debug("\n\n**PROXY CONFIG: " + JSON.stringify(proxyConfig) );

                    cb();

                  } else {
                    grunt.fail.warn("ERROR: " + JSON.stringify(response));
                    cb();
                  }

                },
                grunt.option('curl'));

        },
        function(error){
          done(error);
        }
      );

    });


    grunt.registerTask('apigee_get_cache', 'Grunt plugin to fill in config details for caches', function() {
      // Merge task-specific and/or target-specific options with these defaults.

      var done = this.async();

      var cacheResults = grunt.config.get("cacheResults");
      grunt.log.debug(JSON.stringify(cacheResults));

      // for each cache identified
      async.eachSeries(cacheResults.caches, function iteratee(cacheName, cb) {    
              grunt.log.debug("\n\n" + JSON.stringify(cacheName));

              // Get Cache settings
              apigeeSdk.getCache(grunt.config.get("apigee_profiles"), 
                cacheName,
                "env",
                function(error, response, body){
                  grunt.log.debug("getting Cache resp");
                  grunt.log.debug(response.statusCode);
                  grunt.log.debug(body);
                  var cacheConfig = JSON.parse(body);

                  // iterate through list, get matching entries and add
                  if(cacheConfig != null && response.statusCode == 200) { 
                     // lets add this to the main config and save
                    var proxyConfig = grunt.config.get("proxyConfig");
                    proxyConfig.artifact.caches.push(cacheConfig);
                    grunt.config.set("proxyConfig", proxyConfig);

                    grunt.log.debug("\n\n**PROXY CONFIG: " + JSON.stringify(proxyConfig) );

                    cb();
                  } else {
                    grunt.fail.warn("ERROR: " + JSON.stringify(response));
                  }

                },
                grunt.option('curl'));

        },
        function(error){
          done(error);
        }
      );

    });


    grunt.registerTask('apigee_get_kvm', 'Grunt plugin to fill in config details for KVMs', function() {
      // Merge task-specific and/or target-specific options with these defaults.

      var done = this.async();

      var kvmResults = grunt.config.get("kvmResults");
      grunt.log.debug(JSON.stringify(kvmResults));

      async.eachSeries(kvmResults.kvms, function iteratee(kvm, cb) {    
              grunt.log.debug("\n\n" + JSON.stringify(kvm));

              // get KVM details
              apigeeSdk.getKVMEnvironment(grunt.config.get("apigee_profiles"), 
                kvm.name,
                function(error, response, body){
                  grunt.log.debug("getting KVM resp");
                  grunt.log.debug(response.statusCode);
                  grunt.log.debug(body);
                  var responseBody = JSON.parse(body);

                  // iterate through list, get matching entries and add
                  var kvmConfig = {};
                  kvmConfig.name = kvm.name;
                  var kvmEntries = [];

                  grunt.log.debug("responseBody.entry != null: " + (responseBody.entry != null));
                  if(responseBody.entry != null && response.statusCode == 200) { 
                    grunt.log.debug("kvm.entries.length: " + kvm.entries.length);
                    for(var i=0;i<kvm.entries.length;i++) {
                      var entryName = kvm.entries[i];
                      grunt.log.debug("entryName:" + entryName);
                      var entryObj = {};
                      entryObj.name = entryName;
                      entryObj.value = getEntryValue(entryName, responseBody.entry);

                      kvmEntries.push(entryObj);
                    }

                    kvmConfig.entry = kvmEntries;

                  } else {
                    grunt.fail.warn("ERROR: " + JSON.stringify(response));
                  }

                  // lets add this to the main config and save
                  var proxyConfig = grunt.config.get("proxyConfig");
                  proxyConfig.artifact.kvms.push(kvmConfig);
                  grunt.config.set("proxyConfig", proxyConfig);

                  grunt.log.debug("\n\n**PROXY CONFIG: " + JSON.stringify(proxyConfig) );

                  cb();
                },
                grunt.option('curl'));

              //cb();
        },
        function(error){
          done(error);
        }
      );

    });


    function getEntryValue(entryName, kvmEntries) {

      grunt.log.debug(JSON.stringify(kvmEntries));
      var matchingEntryValue = "";

      for(var i=0;i<kvmEntries.length;i++) {

        var kvmEntry = kvmEntries[i];
        if(kvmEntry.name == entryName) {
          matchingEntryValue = kvmEntry.value;
        }

      }

      return matchingEntryValue;

    }


    grunt.registerTask('apigee_create_config', 'Grunt plugin to create proxy config', function() {
      // Merge task-specific and/or target-specific options with these defaults.

      var done = this.async();

      var proxyConfig = {};
      proxyConfig.artifact = {};
      proxyConfig.artifact.proxyConfig = {};
      proxyConfig.artifact.proxyConfig.name = grunt.option('proxyName');
      proxyConfig.artifact.proxyConfig.description = grunt.option('proxyName') + " proxy";

      proxyConfig.artifact.apigeeConfig = {
        org: grunt.option('org'), 
        env: grunt.option('env'),     
        url_mgmt : grunt.option('url_mgmt'),  
        username : "", 
        password : "", 
        revision : grunt.option('revision'), 
        override : true,
        delay : 10,
        overrideExistingCaches: true,
        overrideExistingKvms: true,
        overrideExistingTargetServers: true,
        overrideExistingAPIProducts: true,
        overrideExistingLdapResources: true,
        overrideExistingDevelopers: true,
        overrideExistingDeveloperApps: true,
        overrideExistingCompanies: true,
        overrideExistingCompanyDevelopers: true,
        overrideExistingCompanyApps: true
      };

      proxyConfig.artifact.caches = [];

      proxyConfig.artifact.kvms = [];

      proxyConfig.artifact.targetservers = [];

      proxyConfig.artifact.ldapresources = [];

      proxyConfig.artifact.apiproducts = [];

      proxyConfig.artifact.companies = [];

      proxyConfig.artifact.companydevelopers = [];

      proxyConfig.artifact.companyapps = [];

      proxyConfig.artifact.developers = [];

      proxyConfig.artifact.developerapps = [];

      grunt.config.set("proxyConfig", proxyConfig);

      done();

    });


    grunt.registerTask('apigee_save_config', 'Grunt plugin to save proxy config to a file', function() {
      // Merge task-specific and/or target-specific options with these defaults.

      var done = this.async();

      var proxyConfig = grunt.config.get("proxyConfig");

      grunt.log.debug("apigee_save_config");
      grunt.log.debug(JSON.stringify(proxyConfig));

      async.series([
          function(callback){
              
              var targetFile = grunt.option("targetFolder") + "/" + grunt.option("proxyName") + "/config/" + grunt.option("env") + "-config.json";
              fs.writeFile(targetFile, JSON.stringify(proxyConfig, null, 4), function(err) {
                  if(err) {
                      grunt.log.debug(err);
                      grunt.fail.warn("ERROR: " + JSON.stringify(err));
                      done(err);
                  }

                  grunt.log.debug("The file was saved");

                  callback();
              }); 

          },
          function(callback){

              var targetFile = grunt.option("targetFolder") + "/" + grunt.option("proxyName") + "/config/dev-config.json";
              fs.writeFile(targetFile, JSON.stringify(proxyConfig, null, 4), function(err) {
                  if(err) {
                      grunt.log.debug(err);
                      grunt.fail.warn("ERROR: " + JSON.stringify(err));
                      done(err);
                  }

                  grunt.log.debug("The file was saved");

                  callback();
              }); 
          },
          function(callback){

              var targetFile = grunt.option("targetFolder") + "/" + grunt.option("proxyName") + "/config/qa-config.json";
              fs.writeFile(targetFile, JSON.stringify(proxyConfig, null, 4), function(err) {
                  if(err) {
                      grunt.log.debug(err);
                      grunt.fail.warn("ERROR: " + JSON.stringify(err));
                      done(err);
                  }

                  grunt.log.debug("The file was saved");

                  callback();
              }); 
          },
          function(callback){

              var targetFile = grunt.option("targetFolder") + "/" + grunt.option("proxyName") + "/config/staging-config.json";
              fs.writeFile(targetFile, JSON.stringify(proxyConfig, null, 4), function(err) {
                  if(err) {
                      grunt.log.debug(err);
                      grunt.fail.warn("ERROR: " + JSON.stringify(err));
                      done(err);
                  }

                  grunt.log.debug("The file was saved");

                  callback();
              }); 
          },
          function(callback){

              var targetFile = grunt.option("targetFolder") + "/" + grunt.option("proxyName") + "/config/sandbox-config.json";
              fs.writeFile(targetFile, JSON.stringify(proxyConfig, null, 4), function(err) {
                  if(err) {
                      grunt.log.debug(err);
                      grunt.fail.warn("ERROR: " + JSON.stringify(err));
                      done(err);
                  }

                  grunt.log.debug("The file was saved");

                  callback();
              }); 
          },
          function(callback){

              var targetFile = grunt.option("targetFolder") + "/" + grunt.option("proxyName") + "/config/prod-config.json";
              fs.writeFile(targetFile, JSON.stringify(proxyConfig, null, 4), function(err) {
                  if(err) {
                      grunt.log.debug(err);
                      grunt.fail.warn("ERROR: " + JSON.stringify(err));
                      done(err);
                  }

                  grunt.log.debug("The file was saved");

                  callback();
              }); 
          },
          function(callback){

              var targetFile = grunt.option("targetFolder") + "/" + grunt.option("proxyName") + "/config/prod-config.json";
              fs.writeFile(targetFile, JSON.stringify(proxyConfig, null, 4), function(err) {
                  if(err) {
                      grunt.log.debug(err);
                      grunt.fail.warn("ERROR: " + JSON.stringify(err));
                      done(err);
                  }

                  grunt.log.debug("The file was saved");

                  callback();
              }); 
          },
          function(callback){

              var targetFile = grunt.option("targetFolder") + "/" + grunt.option("proxyName") + "/config/beta-config.json";
              fs.writeFile(targetFile, JSON.stringify(proxyConfig, null, 4), function(err) {
                  if(err) {
                      grunt.log.debug(err);
                      grunt.fail.warn("ERROR: " + JSON.stringify(err));
                      done(err);
                  }

                  grunt.log.debug("The file was saved");

                  callback();
              }); 
          }
      ],
      // optional callback
      function(err, results){
          done();
      });



            

    });

};
