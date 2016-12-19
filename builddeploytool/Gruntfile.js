/*jslint node: true */

/************************************************************************
The MIT License (MIT)

Copyright (c) 2014

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
**************************************************************************/

module.exports = function(grunt) {
	"use strict";
	//var xml_conf = require('./grunt/xml-config.js');	
	var searchNReplace = require('./grunt/search-and-replace-files.js');
	var helper = require('./grunt/lib/helper-functions.js');
	var envHelper = require('./grunt/api-env.js');
	
	envHelper.setApiProfile(grunt);

	var taskName = grunt.cli.tasks[0];
	var artifactConfig = null;
	var apigee_conf = null;
	var env = grunt.option('env');
	var folderPath = grunt.option('folderPath');
	var artifactFile = null;
	var targetPath = grunt.option('targetPath');

	grunt.log.debug("taskName: " + taskName);

	if(taskName == "buildArtifact" || taskName == "buildConfigArtifact" || taskName == "buildConfigArtifactProdKey") {

		artifactConfig = grunt.file.readJSON(folderPath + "/source/config/" + env + "-" + 'config.json');
		grunt.log.debug(JSON.stringify(artifactConfig));
		grunt.log.debug(folderPath);
		// this function converts to apigee_conf.profiles
		apigee_conf = helper.getApigeeConf(grunt, artifactConfig);
		grunt.log.debug(JSON.stringify(apigee_conf));

		grunt.config.set("apigee_profiles", apigee_conf);

	} else if(taskName == "deployArtifact" || taskName == "deployApiProductConfig" || taskName == "deployConfigAndArtifact" || taskName == "deployAppConfig") {

		// populate config later after unzipping artifact
		artifactFile = grunt.option("artifact");
		if(artifactFile.indexOf("/") >= 0) {
			artifactFile = artifactFile.substring( artifactFile.lastIndexOf("/"), artifactFile.length );
		} else if(artifactFile.indexOf("\\") >= 0) {
			artifactFile = artifactFile.substring( artifactFile.lastIndexOf("\\"), artifactFile.length );
		}

		grunt.log.debug( "artifactFile: " + artifactFile );

		apigee_conf = helper.getApigeeConfFromCmdArg(grunt);
		grunt.config.set("apigee_profiles", apigee_conf);
		
	} else {
		apigee_conf = helper.getApigeeConfFromCmdArg(grunt);
		grunt.config.set("apigee_profiles", apigee_conf);
	}

	require('time-grunt')(grunt);
	// Project configuration.
	grunt.initConfig({
			pkg: grunt.file.readJSON('package.json'),
			apigee_profiles : apigee_conf,
		    availabletasks: {
		        tasks: {}
		    },
			clean: { 
				buildArtifact: "target/<%= apigee_profiles[grunt.option('env')].apiproxy %>",
				deployArtifact: "target/deploy",
				downloadProxy: "target/download/<%= grunt.option('proxyName') %>"
			},
			mkdir: {
				apiproxy: {
					options: {
						create: ["target/<%= apigee_profiles[grunt.option('env')].apiproxy %>"]
						//create: ['target', 'target/apiproxy/resources/java/', 'target/java/bin']
					},
				},
				artifact: {
					options: {
						create: [
							"target/<%= apigee_profiles[grunt.option('env')].apiproxy %>/artifact", 
							"target/<%= apigee_profiles[grunt.option('env')].apiproxy %>/artifact/proxy",
							"target/<%= apigee_profiles[grunt.option('env')].apiproxy %>/artifact/config",
							"target/<%= apigee_profiles[grunt.option('env')].apiproxy %>/artifact/tests"
						]
						//create: ['target', 'target/apiproxy/resources/java/', 'target/java/bin']
					},
				},
				deploy_artifact: {
					options: {
						create: [
							"target/deploy", 
							"target/deploy/<% grunt.option('env') %>"						
							]
					},
				},
				dl_apiproxy: {
					options: {
						create: ["target/download/<%= grunt.option('proxyName') %>", 
								 "target/download/<%= grunt.option('proxyName') %>/config"]
					},
				},

			},
			copy: {
				//"java-jar" : {
				//		src: ['java/lib/*.jar', '!java/lib/expressions-1.0.0.jar', '!java/lib/message-flow-1.0.0.jar'],
				//		dest: 'target/apiproxy/resources/java/', filter: 'isFile', flatten: true, expand : true,
				//},
				apiproxy: {
					expand: true,
					cwd: folderPath + '/source/apiproxy',
					src: "**",
					dest: "target/<%= apigee_profiles[grunt.option('env')].apiproxy %>/apiproxy/"  // needs the post-trailing /
				},
				artifact_proxy: {
					flatten: true,
					expand: true,
					cwd: "target/<%= apigee_profiles[grunt.option('env')].apiproxy %>/",
					src: "<%= apigee_profiles[grunt.option('env')].apiproxy %>.zip",
					dest: "target/<%= apigee_profiles[grunt.option('env')].apiproxy %>/artifact/proxy/"  // needs the post-trailing /
				},
				artifact_config: {
					expand: true,
					cwd: folderPath + '/source/config',
					src: "**",
					dest: "target/<%= apigee_profiles[grunt.option('env')].apiproxy %>/artifact/config/"  // needs the post-trailing /
				},
				artifact_tests: {
					expand: true,
					cwd: folderPath + '/source/tests/deploy',
					src: "**",
					dest: "target/<%= apigee_profiles[grunt.option('env')].apiproxy %>/artifact/tests/"  // needs the post-trailing /
				},
				// copies artifact back to proxy folder
				artifact: {
					flatten: true,
					expand: true,
					cwd: "target/<%= apigee_profiles[grunt.option('env')].apiproxy %>/",
					src: "<%= apigee_profiles[grunt.option('env')].apiproxy %>-artifact.zip",
					dest: folderPath + "/artifact/"  // needs the post-trailing /
				},

				artifact_targetPath: {
					flatten: true,
					expand: true,
					cwd: "target/<%= apigee_profiles[grunt.option('env')].apiproxy %>/",
					src: "<%= apigee_profiles[grunt.option('env')].apiproxy %>-artifact.zip",
					dest: targetPath + "/"  // needs the post-trailing /
				},

				artifact_config_targetPath: {
					flatten: true,
					expand: true,
					cwd: "target/" + grunt.config.get('apigee_profiles')[grunt.option('env')].apiproxy + "/",
					src: grunt.config.get('apigee_profiles')[grunt.option('env')].apiproxy + "-artifact.zip",
					dest: targetPath + "/"  // needs the post-trailing /
				},

				// copies artificat to /target/deploy/{env} folder
				deploy_copy_artifact: {
					flatten: true,
					expand: true,
					src: "<%= grunt.option('artifact') %>",
					dest: "target/deploy/<%= grunt.option('env') %>/"  // needs the post-trailing /
				},

				// copies apiproxy zip to target folder so it can be picked up by the import task
				deploy_copy_proxy_zip: {
					flatten: true,
					expand: true,
					src: "target/deploy/<%= grunt.option('env') %>/artifact/proxy/<%= apigee_profiles[grunt.option('env')].apiproxy %>.zip",
					dest: "target/"  // needs the post-trailing /
				},


				//"node-target": { // copy node folder to target for search and replace
				//			src: './node/**',
				//			dest: './target/'
				//},
				//"node-js-root": { //copy app.js and package.json
				//				expand : true,
				//				src: './target/node/*',
				//				dest: './target/apiproxy/resources/node/', filter: 'isFile', flatten: true
				//	},
			},
			// make a zipfile
			compress: {
				//"node-modules": helper.setNodeResources('./target/node/node_modules/' ,{
				//						mode : 'zip',
				//						archive: './target/apiproxy/resources/node/node_modules.zip'
				//					}, [
				//					{expand: true, cwd: './target/node/node_modules/', src: ['**'], dest: 'node_modules/' } // makes all src relative to cwd
				//					]),

				//"node-public": helper.setNodeResources('./target/node/public/', {
				//					mode : 'zip',
				//					archive: './target/apiproxy/resources/node/public.zip'
				//				},[
				//					{expand: true, cwd: './target/node/public/', src: ['**'], dest: 'public/' }, // makes all src relative to cwd
				//				]),

				//"node-resources": helper.setNodeResources('./target/node/resources/', {
				//					mode : 'zip',
				//					archive: './target/apiproxy/resources/node/resources.zip'
				//				},[
				//					{expand: true, cwd: './target/node/resources/', src: ['**'], dest: 'resources/' }, // makes all src relative to cwd
				//				]),
				main: {
					options: {
						mode : 'zip',
						archive: "target/<%= apigee_profiles[grunt.option('env')].apiproxy %>/<%= apigee_profiles[grunt.option('env')].apiproxy %>.zip"
					},
					files: [
						{expand: true, cwd: "target/<%= apigee_profiles[grunt.option('env')].apiproxy %>/apiproxy/", src: ['**'], dest: 'apiproxy/' }, // makes all src relative to cwd
					]
				},
				main_artifact: {
					options: {
						mode : 'zip',
						archive: "target/<%= apigee_profiles[grunt.option('env')].apiproxy %>/<%= apigee_profiles[grunt.option('env')].apiproxy %>-artifact.zip"
					},
					files: [
						{expand: true, cwd: "target/<%= apigee_profiles[grunt.option('env')].apiproxy %>/artifact/", src: ['**'], dest: 'artifact/' }, // makes all src relative to cwd
					]
				},
				main_config_artifact: {
					options: {
						mode : 'zip',
						archive: "target/" + grunt.config.get('apigee_profiles')[grunt.option('env')].apiproxy + "/" + grunt.config.get('apigee_profiles')[grunt.option('env')].apiproxy + "-artifact.zip"
					},
					files: [
						{expand: true, cwd: "target/" + grunt.config.get('apigee_profiles')[grunt.option('env')].apiproxy + "/artifact/", src: ['**'], dest: 'artifact/' }, // makes all src relative to cwd
					]
				}
			},

			unzip: {

				unzip_artifactFile: {
					src: "target/deploy/" + grunt.option('env') + "/" + artifactFile, 
					dest: "target/deploy/" + grunt.option('env') + "/"
				},

				unzip_dl_apiproxy: { 
					src: "target/download/" + grunt.option("proxyName") + "/" + grunt.option("proxyName") + ".zip", 
					dest: "target/download/" + grunt.option("proxyName")
				}
		      
		    },

		    search: {

		    	kvm_config: {

		    		files: {
		    			src: ["target/download/" + grunt.option("proxyName") + "/apiproxy/policies/*.xml"]
		    		},
		    		options: {
		    			searchString: /<KeyValueMapOperations/g,
		                logFormat: "console",
		                failOnMatch: false,
		    			onComplete: function(matches) {
		                    // called when all files have been parsed for the target. The 
		                    // matches parameter is an object of the format: 
		                    // `{ numMatches: N, matches: {} }`. The matches /property is 
		                    // an object of filename => array of matches 
		                    helper.parseKVMResults(matches, grunt, function() { grunt.log.debug( JSON.stringify(grunt.config.get("kvmResults")) ) } );
		                }
		    		}

		    	},

		    	cache_config: {

		    		files: {
		    			src: ["target/download/" + grunt.option("proxyName") + "/apiproxy/policies/*.xml"]
		    		},
		    		options: {
		    			searchString: /<ResponseCache|<PopulateCache|<LookupCache|<InvalidateCache/g,
		                logFormat: "console",
		                failOnMatch: false,
		    			onComplete: function(matches) {
		                    // called when all files have been parsed for the target. The 
		                    // matches parameter is an object of the format: 
		                    // `{ numMatches: N, matches: {} }`. The matches /property is 
		                    // an object of filename => array of matches 

		                    grunt.log.debug("\n\nCACHE: " + JSON.stringify(matches));

		                    helper.parseCacheResults(matches, grunt, function() { grunt.log.debug( JSON.stringify(grunt.config.get("cacheResults")) ) } );
		                }
		    		}

		    	},

		    	targetserver_config: {

		    		files: {
		    			src: ["target/download/" + grunt.option("proxyName") + "/apiproxy/targets/*.xml",
		    				  "target/download/" + grunt.option("proxyName") + "/apiproxy/policies/*.xml"]
		    		},
		    		options: {
		    			searchString: /<Server/g,
		                logFormat: "console",
		                failOnMatch: false,
		    			onComplete: function(matches) {
		                    // called when all files have been parsed for the target. The 
		                    // matches parameter is an object of the format: 
		                    // `{ numMatches: N, matches: {} }`. The matches /property is 
		                    // an object of filename => array of matches 

		                    grunt.log.debug("\n\TargetServer: " + JSON.stringify(matches));

		                    helper.parseTargetServerResults(matches, grunt, function() { grunt.log.debug( JSON.stringify(grunt.config.get("targetserverResults")) ) } );
		                }
		    		}

		    	},

		    	ldapresource_config: {

		    		files: {
		    			src: ["target/download/" + grunt.option("proxyName") + "/apiproxy/policies/*.xml"]
		    		},
		    		options: {
		    			searchString: /<Ldap/g,
		                logFormat: "console",
		                failOnMatch: false,
		    			onComplete: function(matches) {
		                    // called when all files have been parsed for the target. The 
		                    // matches parameter is an object of the format: 
		                    // `{ numMatches: N, matches: {} }`. The matches /property is 
		                    // an object of filename => array of matches 

		                    grunt.log.debug("\n\TargetServer: " + JSON.stringify(matches));

		                    helper.parseLdapResourceResults(matches, grunt, function() { grunt.log.debug( JSON.stringify(grunt.config.get("ldapResourceResults")) ) } );
		                }
		    		}

		    	}

		    	



		    }, 

			// task for configuration management: search and replace elements within XML files
			//xmlpoke: xml_conf.xmlconfig(grunt.option('env'), grunt),
		    // Configure a mochaTest task
		    //mochaTest: {
		    //	test: {
		    //		options: {
		    //			reporter: 'spec', //supported reporters: tap
		    //			timeout : 5000,
		    //			quiet: false // Optionally suppress output to standard out (defaults to false)
		    //		},
		    //		src: ["tests/<%= apigee_profiles[grunt.option('env')].apiproxy %>**.js"]
		    //	}
		    //},
		    //jshint: {
			//    options: { //see options reference http://www.jshint.com/docs/options/
			//    	curly: true,
			//    	eqeqeq: true,
			//    	eqnull: true,
			//    	browser: true,
			//    	asi : true,
			//    	debug : true,
			//    	undef : true,
			//    	unused : true,
			//    	maxcomplexity : 5,
			//    	reporter: require('jshint-stylish')
			//    },
			//    all: ['Gruntfile.js', 'apiproxy/**/*.js', 'tests/**/*.js', 'tasks/*.js']
			//},
		    //eslint: {                               // task
		    //	options: {
		    //        config: 'grunt/conf/eslint.json',     // custom config
		    //        rulesdir: ['grunt/conf/rules']        // custom rules
		    //    },
		    //    target: ['Gruntfile.js', 'target/apiproxy/**/*.js', 'tests/**/*.js', 'tasks/*.js']                 // array of files
		    //},
			'string-replace': {
				dist : searchNReplace.searchAndReplaceFiles("target/<%= apigee_profiles[grunt.option('env')].apiproxy %>/apiproxy", grunt)
			},
			shell: {                              // Task
	            callMaven: {                      // Target
	                command: 'mvn install -Penv -Dusername=$ae_username -Dpassword=$ae_password -DproxySrcDir=$ae_proxySrcDir -DcommonProxySrcDir=$ae_commonProxySrcDir'
	            }
	        },
		    //shell: {
		    //    options: {
		    //        stderr: false,
		    //        failOnError : true
		    //    },
		        // Remove comments to enable JavaCallout Policy
		        // javaCompile: {
		        //     command: 'javac -sourcepath ./java/src/**/*.java -d ./target/java/bin -cp java/lib/expressions-1.0.0.jar:java/lib/message-flow-1.0.0.jar:jar:java/lib/message-flow-1.0.1.jar java/src/com/example/SimpleJavaCallout.java',
		        // },
		        // javaJar : {
		        //     command: 'jar cvf target/apiproxy/resources/java/javaCallouts.jar -C target/java/bin .',
		        // },

		        //run jmeter tests from Grunt
		        //"run_jmeter_tests" : {
		        //     command: 'mvn install -P <%= grunt.option("env") %>',
		        //},
	        //  apigee_npm_node_modules : {
	        //       command: "npm install --prefix './node'",
	        //  },
		    //},
		    notify: {
		    	task_name: {
		    		options: {
		        	// Task-specific options go here.
		        	}
			    },
			    ApiDeployed: {
			    	options: {
			    		message: 'Deployment is ready!'
			    	}
			    },
			    buildArtifact: {
			    	options: {
			    		message: 'Artifact has been built!'
			    	}
			    }
	  		}
	        //complexity: {
	        //    generic: {
	        //        src: ['target/apiproxy/**/*.js', 'tests/**/*.js', 'tasks/*.js'],
	        //        exclude: ['doNotTest.js'],
	        //        options: {
	        //            breakOnErrors: true,
	        //            jsLintXML: 'report.xml',         // create XML JSLint-like report
	        //            checkstyleXML: 'checkstyle.xml', // create checkstyle report
	        //            errorsOnly: false,               // show only maintainability errors
	        //            cyclomatic: [3, 7, 12],          // or optionally a single value, like 3
	        //            halstead: [8, 13, 20],           // or optionally a single value, like 8
	        //            maintainability: 100,
	        //            hideComplexFunctions: false,      // only display maintainability
	        //            broadcast: false                 // broadcast data over event-bus
	        //        }
	        //    },
	        //},
			//prompt: helper.prompts(grunt),
			
	});

require('load-grunt-tasks')(grunt);

// #1 - Build Artifact
grunt.registerTask('buildArtifact', 'Build Artifact without importing it to Edge', ['apigeeGruntPluginBanner', 'clean:buildArtifact', 'mkdir:apiproxy', 'mkdir:artifact', 'copy:apiproxy', 'string-replace', 'compress:main','copy:artifact_proxy', 'copy:artifact_config', 'copy:artifact_tests', 'compress:main_artifact', "copy:artifact_targetPath", 'notify:buildArtifact']);

// #2 - Deploy Artifact
grunt.registerTask('deployArtifact', 'Deploy Artifact to Edge', ['apigeeGruntPluginBanner', 'clean:deployArtifact', "mkdir:deploy_artifact", 'copy:deploy_copy_artifact', "unzip:unzip_artifactFile", "setApigeeProfile", "copy:deploy_copy_proxy_zip", "getDeployedApiRevisions", "apigee_import_api_bundle", "deployApiRevisionAlias", "notify:ApiDeployed" ]);


// Import KVM data
grunt.registerTask('importKVMs', [ "setApigeeProfile", 'apigee_kvms' ]);

// Import Cache data
grunt.registerTask('importCaches', [ "setApigeeProfile", "apigee_caches" ]);

// Import Target Servers data
grunt.registerTask('importTargetServers', [ "setApigeeProfile", "apigee_targetservers" ]);


// #3 - Deploy Config and Artifact
grunt.registerTask('deployConfigAndArtifact', 'Deploy Config and Artifact to Edge', ['apigeeGruntPluginBanner', 'clean:deployArtifact', "mkdir:deploy_artifact", 'copy:deploy_copy_artifact', "unzip:unzip_artifactFile", "setApigeeProfile", "apigee_kvms", "apigee_caches", "apigee_targetservers", "apigee_ldapresources", "copy:deploy_copy_proxy_zip", "getDeployedApiRevisions", "apigee_import_api_bundle", "deployApiRevisionAlias", "notify:ApiDeployed" ]);


// Import Target Servers data
grunt.registerTask('importAPIProducts', [ "setApigeeProfile", "apigee_apiproducts" ]);


// Run maven dependency plugin
grunt.registerTask('runDependencyCheck', [ "setApigeeProfile", "shell:callMaven" ]);



// Run download script

grunt.registerTask('downloadProxy', [ "clean:downloadProxy", "mkdir:dl_apiproxy", "setApigeeProfileFromCmdArg", "exportProxyBundle", "unzip:unzip_dl_apiproxy", "apigee_create_config", "apigee_save_config" ]);

grunt.registerTask('downloadProxyAndConfig', [ "clean:downloadProxy", "mkdir:dl_apiproxy", "setApigeeProfileFromCmdArg", "exportProxyBundle", "unzip:unzip_dl_apiproxy", "search:kvm_config", "search:cache_config", "search:targetserver_config", "search:ldapresource_config", "apigee_create_config", "apigee_get_kvm", "apigee_get_cache", "apigee_get_targetserver", "apigee_get_ldapresource", "apigee_save_config" ]);



grunt.registerTask('downloadApiProductConfig', [ "clean:downloadProxy", "mkdir:dl_apiproxy", "setApigeeProfileFromCmdArg", "apigee_create_config", "apigee_get_apiproducts", "apigee_save_config" ]);


grunt.registerTask('downloadAppConfig', [ "clean:downloadProxy", "mkdir:dl_apiproxy", "setApigeeProfileFromCmdArg", "apigee_create_config", "apigee_get_companies", "apigee_get_company_apps", "apigee_get_company_developers", "apigee_get_developers", "apigee_get_developer_apps", "apigee_save_config" ]);


// Build Config Artifact
grunt.registerTask('buildConfigArtifact', 'Build Artifact without importing it to Edge', ['apigeeGruntPluginBanner', 'clean:buildArtifact', 'mkdir:apiproxy', 'mkdir:artifact', 'compress:main', 'copy:artifact_config', 'copy:artifact_tests', "setArtifactConfig", 'compress:main_config_artifact', "copy:artifact_config_targetPath", 'notify:buildArtifact']);


// Build Config Artifact
grunt.registerTask('buildConfigArtifactProdKey', 'Build Artifact without importing it to Edge, but includes generating Prod Key', ['apigeeGruntPluginBanner', 'clean:buildArtifact', 'mkdir:apiproxy', 'mkdir:artifact', 'compress:main', 'copy:artifact_config', 'copy:artifact_tests', "setArtifactConfig", "setApigeeProfileToProd", "apigee_developers", "apigee_developer_apps", 'compress:main_config_artifact', "copy:artifact_config_targetPath", 'notify:buildArtifact']);



grunt.registerTask('deployApiProductConfig', 'Deploy API Product Config to Edge', ['apigeeGruntPluginBanner', 'clean:deployArtifact', "mkdir:deploy_artifact", 'copy:deploy_copy_artifact', "unzip:unzip_artifactFile", "setApigeeProfile", "apigee_apiproducts", "notify:ApiDeployed" ]);


// Deploy Config and Artifact
grunt.registerTask('deployCompanyConfig', 'Deploy Company Config to Edge', ['apigeeGruntPluginBanner', 'clean:deployArtifact', "mkdir:deploy_artifact", 'copy:deploy_copy_artifact', "unzip:unzip_artifactFile", "setApigeeProfile", "apigee_developers", "apigee_companies", "notify:ApiDeployed" ]);


// Deploy Config and Artifact
grunt.registerTask('deployAppConfig', 'Deploy App Config to Edge', ['apigeeGruntPluginBanner', 'clean:deployArtifact', "mkdir:deploy_artifact", 'copy:deploy_copy_artifact', "unzip:unzip_artifactFile", "setApigeeProfile", "apigee_developers", "apigee_developer_apps", "notify:ApiDeployed" ]);



// importKVM at Organization and Environment level. See apigee_kvm task above
//grunt.registerTask('importKVMs', ['apigee_kvm:' + grunt.config.get("apigee_profiles")[grunt.option('env')].org + '-' + grunt.option("env"), 'apigee_kvm:' + grunt.config.get("apigee_profiles")[grunt.option('env')].org]);

//grunt.registerTask('buildApiBundle', 'Build zip without importing it to Edge', ['apigeeGruntPluginBanner', 'prompt', 'clean', 'saveGitRevision', 'shell:apigee_npm_node_modules', 'mkdir','copy', 'xmlpoke', 'string-replace', 'jshint', 'eslint', 'complexity', /*'shell'*/ 'compressAlias']);
  //1. import revision bumping revision id
  //grunt.registerTask('IMPORT_DEPLOY_BUMP_REVISION', [ 'buildApiBundle', 'getDeployedApiRevisions', 'undeployApiRevision',
  //  'apigee_import_api_bundle', 'installNpmRevisionAlias', 'deployApiRevisionAlias', 'executeTests', /*'shell:run_jmeter_tests',*/ 'notify:ApiDeployed']);

  //2. update revision keeping same id
  //grunt.registerTask('UPDATE_CURRENT_REVISION', [ 'buildApiBundle', 'getDeployedApiRevisions', 'undeployApiRevision',
  //  'updateApiRevision', 'installNpmRevisionAlias', 'deployApiRevisionAlias', 'executeTests', 'notify:ApiDeployed']);

  //3. import revision and run seamless deployment
  //grunt.registerTask('DEPLOY_IMPORT_BUMP_SEAMLESS_REVISION', [ 'buildApiBundle', 'getDeployedApiRevisions', 'apigee_import_api_bundle',
 // 	'installNpmRevisionAlias', 'deployApiRevisionAlias', 'executeTests', /*'shell:run_jmeter_tests',*/ 'notify:ApiDeployed']);

  //set to DEPLOY_IMPORT_BUMP_SEAMLESS_REVISION by default. This is critical for production for seamless deploymen and not lose traffic
  //grunt.registerTask('default', [ /*'importKVMs',*/'DEPLOY_IMPORT_BUMP_SEAMLESS_REVISION' ]);

	grunt.loadTasks('grunt/tasks');

	grunt.loadNpmTasks('grunt-search');

	if(grunt.option.flags().indexOf('--help') === -1 && !grunt.option('env')) {
		grunt.fail.fatal('Invalid environment --env={env}.')
	}
};
