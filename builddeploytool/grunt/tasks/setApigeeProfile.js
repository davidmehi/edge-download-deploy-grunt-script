/*jslint node: true */

var helper = require('../lib/helper-functions.js');
var envHelper = require('../api-env.js');


module.exports = function(grunt) {
	'use strict';
	grunt.registerTask('setApigeeProfile', 'Populates Apigee Profile object from property file', function() {


		var artifactConfig = grunt.file.readJSON("target/deploy/" + grunt.option('env') + "/artifact/config/" + grunt.option('env') + "-" + 'config.json');
		grunt.log.debug(JSON.stringify(artifactConfig));
		//grunt.log.debug(folderPath);
		// this function converts to apigee_conf.profiles
		var apigee_conf = helper.getApigeeConf(grunt, artifactConfig);
		grunt.log.debug(JSON.stringify(apigee_conf));

		grunt.config.set('apigee_profiles', apigee_conf);

		grunt.config.set('artifactConfig', artifactConfig);


	});

	grunt.registerTask('setApigeeProfileFromCmdArg', 'Populates Apigee Profile object from command arguments', function() {


		// this function converts to apigee_conf.profiles
		var apigee_conf = helper.getApigeeConfFromCmdArg(grunt);
		grunt.log.debug(JSON.stringify(apigee_conf));

		grunt.config.set('apigee_profiles', apigee_conf);

	});

	grunt.registerTask('setApigeeProfileToProd', 'Populates Apigee Profile object from prod settings', function() {

		// set env to prod
		grunt.option('env', grunt.option('prodenv'));
		grunt.option('username', grunt.option('produsername'));
		grunt.option('password', grunt.option('prodpassword'));

		envHelper.setApimProfile(grunt);

		// this function converts to apigee_conf.profiles
		var apigeeConfig = helper.getApigeeConfFromCmdArg(grunt);
		grunt.log.debug(JSON.stringify(apigeeConfig));

		grunt.config.set('apigee_profiles', apigeeConfig);

		grunt.log.debug(JSON.stringify(grunt.config.get("artifactConfig")));


	});

	grunt.registerTask('setArtifactConfig', 'Populates artifact config', function() {

		var artifactConfig = grunt.file.readJSON(grunt.option('folderPath') + "/source/config/" + grunt.option('env') + "-" + 'config.json');
		grunt.log.debug(JSON.stringify(artifactConfig));

		//grunt.log.debug(folderPath);
		// this function converts to apigee_conf.profiles
		var apigee_conf = helper.getApigeeConf(grunt, artifactConfig);
		grunt.log.debug(JSON.stringify(apigee_conf));

		grunt.config.set('apigee_profiles', apigee_conf);

		grunt.config.set('artifactConfig', artifactConfig);


	});
};
