
exports.xmlconfig = function(env, grunt){
	config = { "test" : [
		{//sets description within API proxy for tracking purposes with this format 'git commit: 8974b5a by dzuluaga on Diegos-MacBook-Pro-2.local'
		 //see grunt/tasks/saveGitRevision.js for further customization
			"options": {
				"xpath": "//APIProxy/Description",
				"value": "<%= grunt.option('gitRevision') %>"
			},
			"files": {
				"target/apiproxy/<%= apigee_profiles[grunt.option('env')].apiproxy %>.xml": "apiproxy/*.xml"
			}
		},
		{
			"options": {
				"xpath": "//TargetEndpoint/HTTPTargetConnection/URL",
				"value": "https://weather.yahooapis.com/forecastrss"
			},
			"files": {
				"target/apiproxy/targets/default.xml": "apiproxy/targets/default.xml"
			}
		},
		{
			"options": {
				"xpath": "//ProxyEndpoint/HTTPProxyConnection/BasePath",
				"value": "/v1/api/endpoint"
			},
			"files": {
				"target/apiproxy/proxies/default.xml": "apiproxy/proxies/default.xml"
			}
		}
		],
	 "prod" : [
		{//sets description within API proxy for tracking purposes with this format 'git commit: 8974b5a by dzuluaga on Diegos-MacBook-Pro-2.local'
		 //see grunt/tasks/saveGitRevision.js for further customization
			"options": {
				"xpath": "//APIProxy/Description",
				"value": "<%= grunt.option('gitRevision') %>"
			},
			"files": {
				"target/apiproxy/<%= apigee_profiles[grunt.option('env')].apiproxy %>.xml": "apiproxy/*.xml"
			}
		},
		{
			"options": {
				"xpath": "//TargetEndpoint/HTTPTargetConnection/URL",
				"value": "https://weather.yahooapis.com/forecastrss"
			},
			"files": {
				"target/apiproxy/targets/default.xml": "apiproxy/targets/default.xml"
			}
		},
		{
			"options": {
				"xpath": "//ProxyEndpoint/HTTPProxyConnection/BasePath",
				"value": "/v1/api/endpoint"
			},
			"files": {
				"target/apiproxy/proxies/default.xml": "apiproxy/proxies/default.xml"
			}
		}
		]}
		if(!config[env])grunt.fail.fatal('Environment '+ env +' does not exist under grunt/apigee-config.js')
		return config[env];
}
