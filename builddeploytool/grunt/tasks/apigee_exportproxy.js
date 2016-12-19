/*
 * Grunt Apigee export proxy bundle task
 */

var fs = require('fs');
var apigeeSdk = require('../lib/apigee-sdk-mgmt-api-addtl.js');
var helper = require('../lib/helper-functions.js');
var request = require('request');


module.exports = function(grunt) {
    'use strict';
	grunt.registerTask('exportProxyBundle', 'Exports proxy bundle to a local zip file', function() {

        var done = this.async();
        var revision = grunt.option('revision');
        var proxyName = grunt.option('proxyName');

        var apigee_profile = grunt.config.get('apigee_profiles');
        var apigeel = apigee_profile[apigee_profile.env];
        var includeCurl = grunt.option.flags().indexOf('--curl') !== -1;

        var options = {
          uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/apis/" + proxyName + "/revisions/" + revision + "?format=bundle",
          method : 'GET',
          auth : {user : apigeel.username, password: apigeel.password}
        };
        if(includeCurl)
            helper.generatecURL(options);

        // RegExp to extract the filename from Content-Disposition
        var regexp = /filename=\"(.*)\"/gi;

        // initiate the download
        var req = request(options)
             .on( 'response', function( res ){

                grunt.log.debug(res.statusCode);
                grunt.log.debug(JSON.stringify(res.headers));            
                grunt.log.debug(JSON.stringify(res.error));

                if(res.statusCode == 200) {

                    // extract filename
                    var filename = regexp.exec( res.headers['content-disposition'] )[1];
                    grunt.log.debug("filename: " + filename);

                    // create file write stream
                    var fws = fs.createWriteStream( "target/download/" + proxyName + "/" + proxyName + ".zip" );

                    // setup piping
                    res.pipe( fws );

                    res.on( 'end', function(){
                      // go on with processing
                      grunt.log.debug("file downloaded ");
                      sleep(1500);
                      done();
                    });

                    res.on( 'error', function(){
                      // go on with processing
                      grunt.fail.warn("ERROR: " + JSON.stringify(res));
                      done(error);
                    });

                } else {

                  grunt.fail.warn("ERROR: " + JSON.stringify(res));
                  done();

                }

             });


	});
};

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

