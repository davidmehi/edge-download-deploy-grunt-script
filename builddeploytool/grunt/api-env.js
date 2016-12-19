
exports.setApiProfile = function(grunt) {

	var env = grunt.option('env');

	// Maps PPM environmental names to how APIM understands Organizations and Environments
	if(env.toUpperCase() === "DEV") {
		env = "dev";
		grunt.option('env', "dev");
		grunt.option('org', "put_org_here");
		grunt.option('url_mgmt', "https:\/\/api.enterprise.apigee.com");
	} else if(env.toUpperCase() === "QA") {
		env = "qa";
		grunt.option('env', "qa");
		grunt.option('org', "put_org_here");
		grunt.option('url_mgmt', "https:\/\/api.enterprise.apigee.com");
	} else if(env.toUpperCase() === "SANDBOX") {
		env = "sandbox";
		grunt.option('env', "sandbox");
		grunt.option('org', "put_org_here");
		grunt.option('url_mgmt', "https:\/\/api.enterprise.apigee.com");
	} else if(env.toUpperCase() === "STAGING") {
		env = "test";
		grunt.option('env', "staging");
		grunt.option('org', "put_org_here");
		grunt.option('url_mgmt', "https:\/\/api.enterprise.apigee.com");
	} else if(env.toUpperCase() === "BETA") {
		env = "qa";
		grunt.option('env', "beta");
		grunt.option('org', "put_org_here");
		grunt.option('url_mgmt', "https:\/\/api.enterprise.apigee.com");
	} else if(env.toUpperCase() === "PROD") {
		env = "staging";
		grunt.option('env', "prod");
		grunt.option('org', "put_org_here");
		grunt.option('url_mgmt', "https:\/\/api.enterprise.apigee.com");
	} 

}

