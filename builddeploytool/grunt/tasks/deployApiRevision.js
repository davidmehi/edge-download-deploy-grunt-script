/*jslint node: true */

var grunt_common = require('apigee-sdk-mgmt-api');

module.exports = function(grunt) {
	'use strict';
	grunt.registerTask('deployApiRevision', 'Deploy an API revision. deployApiRevision:{revision_id}', function(revision) {
		var deployedRevision = function(error, response, body) {
			/*eslint no-empty:0 */
			
			console.log(response.statusCode)
			console.log(body);

			if (!error && response.statusCode === 200) {
				//var undeployResult = JSON.parse(body);
			}
			else{
				done(false)
			}

			done(error);
		}

		console.log("revision: " + revision);
		if(revision == undefined || revision == null || revision == "") {
			revision = "1";
		}


		console.log("Getting ready to deploy proxy");
		//core logic
		if(!revision) {
			grunt.fail.fatal('invalid revision id. provide either argument as deployApiRevision:{revision_id}');
		}else{
			var done = this.async();
			grunt_common.deployApiRevision(grunt.config.get('apigee_profiles'), revision, deployedRevision, grunt.option.flags().indexOf('--curl') !== -1)
		}
	});
};
