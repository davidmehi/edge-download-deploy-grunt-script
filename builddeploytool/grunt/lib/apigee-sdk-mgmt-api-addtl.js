var request = require('request');
var helper = require('./helper-functions.js');

exports.npmInstallRevision = function (apigee_profiles, revision, callback, includeCurl) {
	var apigeel = apigee_profiles[apigee_profiles.env];

	var options = {
		method: 'POST',
		uri: apigeel.url_mgmt + '/v1/o/' + apigeel.org + '/apis/' + apigeel.apiproxy + '/revisions/' + revision + '/npm',
		auth: {
			user: apigeel.username,
			password: apigeel.password
		},
		headers : {
			'Content-Type' : 'application/x-www-form-urlencoded',
		},
		body:'command=install'
	};
	if(includeCurl)
		helper.generatecURL(options);

	request(options, callback);
};

exports.getDeployedApiRevisions = function (apigee_profiles, callback, includeCurl) {
	var apigeel = apigee_profiles[apigee_profiles.env];
	//echo curl -H "Authorization:Basic $credentials" "$url/v1/organizations/$org/apis/$application/revisions/$RevToUndeploy/deployments" -X GET
	var options = {
		method: 'GET',
		uri: apigeel.url_mgmt + '/v1/o/' + apigeel.org + '/environments/' + apigeel.env + '/apis/' + apigeel.apiproxy + '/deployments',
		auth: {
			user: apigeel.username,
			password: apigeel.password
		}
	};
	if(includeCurl)
		helper.generatecURL(options);
	request(options, callback);
};

exports.undeployApiRevision = function(apigee_profiles, revision, callback, includeCurl){
	//echo curl -H "Authorization:Basic $credentials" "$url/v1/organizations/$org/apis/$application/revisions/$RevToUndeploy/deployments?action=undeploy&env=$environment" -X POST -H "Content-Type: application/octet-stream"
	var apigeel = apigee_profiles[apigee_profiles.env];
	var options = {
		method: 'POST',
		uri: apigeel.url_mgmt + '/v1/o/' + apigeel.org + '/apis/' + apigeel.apiproxy + '/revisions/' + revision + "/deployments?action=undeploy&env=" + apigeel.env,
		auth: {
			user: apigeel.username,
			password: apigeel.password
		},
		headers : {
			'Content-Type' : 'application/octet-stream',
		},
	};
	if(includeCurl)
		helper.generatecURL(options);
	request(options, callback);
}

exports.deployApiRevision = function(apigee_profiles, revision, callback, includeCurl){
	//echo curl -H "Authorization:Basic $credentials" "$url/v1/organizations/$org/apis/$application/revisions/$RevToDeploy/deployments?action=deploy&env=$environment" -X POST -H "Content-Type: application/octet-stream"
	//curl -X POST -H 'Content-type:application/x-www-form-urlencoded' https://api.enterprise.apigee.com/v1/o/testmyapi/environments/test/apis/forecastweather-grunt-plugin-api/revisions/86/deployments\?override\=true\&delay\=10
	var apigeel = apigee_profiles[apigee_profiles.env];
	var options = {
		method: 'POST',
		uri: apigeel.url_mgmt + '/v1/o/' + apigeel.org + '/e/' + apigeel.env + '/apis/' + apigeel.apiproxy + '/revisions/' + revision + '/deployments' + (apigeel.override ? '?override=true' : '') + ((apigeel.override && apigeel.delay != 0) ? '&delay=' + apigeel.delay : ''),
		auth: {
			user: apigeel.username,
			password: apigeel.password
		},
		headers : {
			'Content-Type' : 'application/x-www-form-urlencoded',
		},
	};
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

exports.getAllApiRevisions = function(apigee_profiles, callback, includeCurl){
	//echo curl -H "Authorization:Basic $credentials" "$url/v1/organizations/$org/apis/$application/revisions" -X GET
	var apigeel = apigee_profiles[apigee_profiles.env];
	var options = {
		method: 'GET',
		uri: apigeel.url_mgmt + '/v1/o/' + apigeel.org + '/apis/' + apigeel.apiproxy + '/revisions',
		auth: {
			user: apigeel.username,
			password: apigeel.password
		},
		headers : {
			'Content-Type' : 'application/octet-stream',
		},
	};
	if(includeCurl)
		helper.generatecURL(options);
	request(options, callback);
}

exports.deleteApiRevision = function(apigee_profiles, revision, callback, includeCurl){
	//echo -H "Authorization:Basic $credentials" -X DELETE "$url/v1/organizations/$org/apis/$application/revisions/$RevToUndeploy"
	var apigeel = apigee_profiles[apigee_profiles.env];
	var options = {
		method: 'DELETE',
		uri: apigeel.url_mgmt + '/v1/o/' + apigeel.org + '/apis/' + apigeel.apiproxy + '/revisions/' + revision,
		auth: {
			user: apigeel.username,
			password: apigeel.password
		},
		headers : {
			'Content-Type' : 'application/octet-stream',
		},
	};
	if(includeCurl)
		helper.generatecURL(options);
	request(options, callback);
}

exports.updateApiRevision = function(apigee_profiles, revision, callback, includeCurl){
	//echo -H "Authorization:Basic $credentials" -X DELETE "$url/v1/organizations/$org/apis/$application/revisions/$RevToUndeploy"
	var apigeel = apigee_profiles[apigee_profiles.env];
	var fs = require('fs');
	var rs = fs.createReadStream('target/' + apigeel.apiproxy + '.zip');
	var options = {
		method: 'POST',
		uri: apigeel.url_mgmt + '/v1/o/' + apigeel.org + '/apis/' + apigeel.apiproxy + '/revisions/' + revision + '?validate=true',
		auth: {
			user: apigeel.username,
			password: apigeel.password
		},
		headers : {
			'Content-Type' : 'application/octet-stream',
			'Accept-Encoding' : 'gzip,deflate'
		},
		strictSSL: false
	};
	if(includeCurl)
		helper.generatecURL(options);
	rs.pipe(request(options, callback));
}


exports.importApiBundle = function(apigee_profiles, callback, includeCurl){
		var apigeel = apigee_profiles[apigee_profiles.env];
		var fs = require('fs');
		var rs = fs.createReadStream('target/' + apigeel.apiproxy + '.zip');
		var options = {
			method: 'POST',
			uri: apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + '/apis?action=import&name=' + apigeel.apiproxy,
		 	//uri: apigeel.url_mgmt + '/v1/o/' + apigeel.org + '/apis/' + apigeel.apiproxy + '/revisions',
			auth: {
				user: apigeel.username,
				password: apigeel.password
			},
			headers : {
				'Content-Type' : 'application/octet-stream',
			},
			strictSSL: false
		};
		if(includeCurl)
			helper.generatecURL(options);
		rs.pipe(request(options, callback));
}

exports.getKVMsEnvironment = function(apigee_profile, callback, includeCurl){
	var apigeel = apigee_profile[apigee_profile.env];

	grunt.log.debug(JSON.stringify(apigeel));

	var options = {
      uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/environments/" + apigeel.env + "/keyvaluemaps",
      method : 'GET',
      auth : {user : apigeel.username, password: apigeel.password}
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

//TODO fix all to use single profile
exports.getKVMsOrganization = function(apigee_profiles, callback, includeCurl){
	var apigeel = apigee_profiles[apigee_profiles.env];
	var options = {
      uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/keyvaluemaps",
      method : 'GET',
      auth : {user : apigeel.username, password: apigeel.password}
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

exports.updateKVMsEnvironment = function(apigee_profiles, kvm, callback, includeCurl){
	var apigeel = apigee_profiles[apigee_profiles.env];
	var options = {
		uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/environments/" + apigeel.env + "/keyvaluemaps/" + kvm.name,
		method : 'PUT',
		auth : {user : apigeel.username, password: apigeel.password},
		headers : {'Content-Type': 'application/json'},
		body: JSON.stringify(kvm)
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

exports.updateKVMEntryEnvironment = function(apigee_profiles, kvmName, kvmEntry, callback, includeCurl){
	var apigeel = apigee_profiles[apigee_profiles.env];
	var options = {
		uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/environments/" + apigeel.env + "/keyvaluemaps/" + kvmName + "/entries/" + kvmEntry.name,
		method : 'PUT',
		auth : {user : apigeel.username, password: apigeel.password},
		headers : {'Content-Type': 'application/json'},
		body: JSON.stringify(kvmEntry)
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

exports.updateKVMsOrganization = function(apigee_profiles, kvm, callback, includeCurl){
	var apigeel = apigee_profiles[apigee_profiles.env];
	var options = {
		uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/keyvaluemaps/" + kvm.name,
		method : 'PUT',
		auth : {user : apigeel.username, password: apigeel.password},
		headers : {'Content-Type': 'application/json'},
		body: JSON.stringify(kvm)
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

exports.createKVMsEnvironment = function(apigee_profiles, kvm, callback, includeCurl){
	var apigeel = apigee_profiles[apigee_profiles.env];
	var options = {
		uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/environments/" + apigeel.env + "/keyvaluemaps",
		method : 'POST',
		auth : {user : apigeel.username, password: apigeel.password},
		headers : {'Content-Type': 'application/json'},
		body: JSON.stringify(kvm)
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

exports.createKVMsOrganization = function(apigee_profiles, kvm, callback, includeCurl){
	var apigeel = apigee_profiles[apigee_profiles.env];
	var options = {
		uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/keyvaluemaps",
		method : 'POST',
		auth : {user : apigeel.username, password: apigeel.password},
		headers : {'Content-Type': 'application/json'},
		body: JSON.stringify(kvm)
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

// adds one KVM entry
exports.createKVMEntryEnvironment = function(apigee_profiles, kvmName, kvmEntry, callback, includeCurl){
	var apigeel = apigee_profiles[apigee_profiles.env];
	var options = {
		uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/environments/" + apigeel.env + "/keyvaluemaps/" + kvmName + "/entries",
		method : 'POST',
		auth : {user : apigeel.username, password: apigeel.password},
		headers : {'Content-Type': 'application/json'},
		body: JSON.stringify(kvmEntry)
    };
	if(includeCurl)
		helper.generatecURL(options);
	request.debug = true;
    request(options, callback);
}

//TODO fix all to use single profile
exports.getKVMEnvironment = function(apigee_profile, kvmName, callback, includeCurl){
	var apigeel = apigee_profile[apigee_profile.env];
	var options = {
      uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/environments/" + apigeel.env + "/keyvaluemaps/" + kvmName,
      method : 'GET',
      auth : {user : apigeel.username, password: apigeel.password}
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

exports.getKVMEntryEnvironment = function(apigee_profile, kvmName, entry, callback, includeCurl){
	var apigeel = apigee_profile[apigee_profile.env];
	var options = {
      uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/environments/" + apigeel.env + "/keyvaluemaps/" + kvmName + "/entries/" + entry,
      method : 'GET',
      auth : {user : apigeel.username, password: apigeel.password}
    };
	if(includeCurl)
		helper.generatecURL(options);
	request.debug=true;
    request(options, callback);
}

//TODO fix all to use single profile
exports.getKVMOrganization = function(apigee_profile, kvmName, callback, includeCurl){
	var apigeel = apigee_profile[apigee_profile.env];
	var options = {
      uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/keyvaluemaps/" + kvmName,
      method : 'GET',
      auth : {user : apigeel.username, password: apigeel.password}
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

exports.getKVM = function(apigee_profile, kvmName, type, callback, includeCurl){
	var apigeel = apigee_profile[apigee_profile.env];
	var options = {
      uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + ( type === 'env' ? "/environments/" + apigeel.env : "" )+ "/keyvaluemaps/" + kvmName,
      method : 'GET',
      auth : {user : apigeel.username, password: apigeel.password}
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

exports.getKVMList = function(apigee_profile, type, callback, includeCurl){
	var apigeel = apigee_profile[apigee_profile.env];
	var options = {
      uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + ( type === 'env' ? "/environments/" + apigeel.env : "" ) + "/keyvaluemaps",
      method : 'GET',
      auth : {user : apigeel.username, password: apigeel.password}
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

// Cache Calls

exports.getCache = function(apigee_profile, cacheName, type, callback, includeCurl){
	var apigeel = apigee_profile[apigee_profile.env];
	var options = {
      uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + ( type === 'env' ? "/environments/" + apigeel.env : "" )+ "/caches/" + cacheName,
      method : 'GET',
      auth : {user : apigeel.username, password: apigeel.password}
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

exports.getCacheList = function(apigee_profile, type, callback, includeCurl){
	var apigeel = apigee_profile[apigee_profile.env];
	var options = {
      uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + ( type === 'env' ? "/environments/" + apigeel.env : "" ) + "/caches",
      method : 'GET',
      auth : {user : apigeel.username, password: apigeel.password}
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}


exports.updateCache = function(apigee_profiles, cache, callback, includeCurl){
	var apigeel = apigee_profiles[apigee_profiles.env];
	var options = {
		uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/environments/" + apigeel.env + "/caches/" + cache.name,
		method : 'PUT',
		auth : {user : apigeel.username, password: apigeel.password},
		headers : {'Content-Type': 'application/json'},
		body: JSON.stringify(cache)
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

exports.createCache = function(apigee_profiles, cache, callback, includeCurl){
	var apigeel = apigee_profiles[apigee_profiles.env];
	var options = {
		uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/environments/" + apigeel.env + "/caches",
		method : 'POST',
		auth : {user : apigeel.username, password: apigeel.password},
		headers : {'Content-Type': 'application/json'},
		body: JSON.stringify(cache)
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

// Target Servers

exports.getTargetServer = function(apigee_profile, tsName, type, callback, includeCurl){
	var apigeel = apigee_profile[apigee_profile.env];
	var options = {
      uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + ( type === 'env' ? "/environments/" + apigeel.env : "" )+ "/targetservers/" + tsName,
      method : 'GET',
      auth : {user : apigeel.username, password: apigeel.password}
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

exports.getTargetServerList = function(apigee_profile, type, callback, includeCurl){
	var apigeel = apigee_profile[apigee_profile.env];
	var options = {
      uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + ( type === 'env' ? "/environments/" + apigeel.env : "" ) + "/targetservers",
      method : 'GET',
      auth : {user : apigeel.username, password: apigeel.password}
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

exports.updateTargetServer = function(apigee_profiles, targetServer, callback, includeCurl){
	var apigeel = apigee_profiles[apigee_profiles.env];
	var options = {
		uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/environments/" + apigeel.env + "/targetservers/" + targetServer.name,
		method : 'PUT',
		auth : {user : apigeel.username, password: apigeel.password},
		headers : {'Content-Type': 'application/json'},
		body: JSON.stringify(targetServer)
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

exports.createTargetServer = function(apigee_profiles, targetServer, callback, includeCurl){
	var apigeel = apigee_profiles[apigee_profiles.env];
	var options = {
		uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/environments/" + apigeel.env + "/targetservers",
		method : 'POST',
		auth : {user : apigeel.username, password: apigeel.password},
		headers : {'Content-Type': 'application/json'},
		body: JSON.stringify(targetServer)
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}


//// API Products

exports.getProduct = function(apigee_profile, productName, callback, includeCurl){
	var apigeel = apigee_profile[apigee_profile.env];
	var options = {
      uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/apiproducts/" + productName,
      method : 'GET',
      auth : {user : apigeel.username, password: apigeel.password}
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

exports.getProductList = function(apigee_profile, callback, includeCurl){
	var apigeel = apigee_profile[apigee_profile.env];
	var options = {
      uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/apiproducts",
      method : 'GET',
      auth : {user : apigeel.username, password: apigeel.password}
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

exports.updateProduct = function(apigee_profiles, product, callback, includeCurl){
	var apigeel = apigee_profiles[apigee_profiles.env];
	var options = {
		uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/apiproducts/" + product.name,
		method : 'PUT',
		auth : {user : apigeel.username, password: apigeel.password},
		headers : {'Content-Type': 'application/json'},
		body: JSON.stringify(product)
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

exports.createProduct = function(apigee_profiles, product, callback, includeCurl){
	var apigeel = apigee_profiles[apigee_profiles.env];
	var options = {
		uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/apiproducts",
		method : 'POST',
		auth : {user : apigeel.username, password: apigeel.password},
		headers : {'Content-Type': 'application/json'},
		body: JSON.stringify(product)
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}


exports.exportProxyRevisionFile = function(apigee_profile, proxyName, revision, callback, includeCurl){
	var apigeel = apigee_profile[apigee_profile.env];
	var options = {
      uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/apis/" + proxyName + "/revisions/" + revision + "?format=bundle",
      method : 'GET',
      auth : {user : apigeel.username, password: apigeel.password}
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}


//// LDAP Resources

exports.getLdapResource = function(apigee_profile, lrName, type, callback, includeCurl){
	var apigeel = apigee_profile[apigee_profile.env];
	var options = {
      uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/environments/" + apigeel.env + "/ldapresources/" + lrName,
      method : 'GET',
      auth : {user : apigeel.username, password: apigeel.password}
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

exports.getLdapResourceList = function(apigee_profile, callback, includeCurl){
	var apigeel = apigee_profile[apigee_profile.env];
	var options = {
      uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/environments/" + apigeel.env + "/ldapresources",
      method : 'GET',
      auth : {user : apigeel.username, password: apigeel.password}
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

exports.updateLdapResource = function(apigee_profiles, ldapresource, callback, includeCurl){
	var apigeel = apigee_profiles[apigee_profiles.env];
	var options = {
		uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/environments/" + apigeel.env + "/ldapresources/" + ldapresource.name,
		method : 'PUT',
		auth : {user : apigeel.username, password: apigeel.password},
		headers : {'Content-Type': 'application/json'},
		body: JSON.stringify(ldapresource)
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

exports.createLdapResource = function(apigee_profiles, ldapresource, callback, includeCurl){
	var apigeel = apigee_profiles[apigee_profiles.env];
	var options = {
		uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/environments/" + apigeel.env + "/ldapresources",
		method : 'POST',
		auth : {user : apigeel.username, password: apigeel.password},
		headers : {'Content-Type': 'application/json'},
		body: JSON.stringify(ldapresource)
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}


//// Companies

exports.getCompany = function(apigee_profile, companyName, callback, includeCurl){
	var apigeel = apigee_profile[apigee_profile.env];
	var options = {
      uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/companies/" + companyName,
      method : 'GET',
      auth : {user : apigeel.username, password: apigeel.password}
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

exports.getCompanyList = function(apigee_profile, callback, includeCurl){
	var apigeel = apigee_profile[apigee_profile.env];
	var options = {
      uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/companies",
      method : 'GET',
      auth : {user : apigeel.username, password: apigeel.password}
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

exports.updateCompany = function(apigee_profiles, company, callback, includeCurl){
	var apigeel = apigee_profiles[apigee_profiles.env];
	var options = {
		uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/companies/" + company.name,
		method : 'PUT',
		auth : {user : apigeel.username, password: apigeel.password},
		headers : {'Content-Type': 'application/json'},
		body: JSON.stringify(company)
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

exports.createCompany = function(apigee_profiles, company, callback, includeCurl){
	var apigeel = apigee_profiles[apigee_profiles.env];
	var options = {
		uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/companies",
		method : 'POST',
		auth : {user : apigeel.username, password: apigeel.password},
		headers : {'Content-Type': 'application/json'},
		body: JSON.stringify(company)
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}


// Company Apps

exports.getCompanyApp = function(apigee_profile, companyName, appName, callback, includeCurl){
	var apigeel = apigee_profile[apigee_profile.env];
	var options = {
      uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/companies/" + companyName + "/apps/" + appName,
      method : 'GET',
      auth : {user : apigeel.username, password: apigeel.password}
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

exports.getCompanyAppList = function(apigee_profile, companyName, callback, includeCurl){
	var apigeel = apigee_profile[apigee_profile.env];
	var options = {
      uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/companies/" + companyName + "/apps",
      method : 'GET',
      auth : {user : apigeel.username, password: apigeel.password}
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

exports.updateCompanyApp = function(apigee_profiles, companyName, companyApp, callback, includeCurl){
	var apigeel = apigee_profiles[apigee_profiles.env];
	var options = {
		uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/companies/" + companyName + "/apps/" + companyApp.name,
		method : 'PUT',
		auth : {user : apigeel.username, password: apigeel.password},
		headers : {'Content-Type': 'application/json'},
		body: JSON.stringify(companyApp)
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

exports.createCompanyApp = function(apigee_profiles, companyName, companyApp, callback, includeCurl){
	var apigeel = apigee_profiles[apigee_profiles.env];
	var options = {
		uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/companies/" + companyName + "/apps",
		method : 'POST',
		auth : {user : apigeel.username, password: apigeel.password},
		headers : {'Content-Type': 'application/json'},
		body: JSON.stringify(companyApp)
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}


// Company Developers

exports.getCompanyDeveloper = function(apigee_profile, companyName, developerName, callback, includeCurl){
	var apigeel = apigee_profile[apigee_profile.env];
	var options = {
      uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/companies/" + companyName + "/developers/" + developerName,
      method : 'GET',
      auth : {user : apigeel.username, password: apigeel.password}
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

exports.getCompanyDeveloperList = function(apigee_profile, companyName, callback, includeCurl){
	var apigeel = apigee_profile[apigee_profile.env];
	var options = {
      uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/companies/" + companyName + "/developers",
      method : 'GET',
      auth : {user : apigeel.username, password: apigeel.password}
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

exports.updateCompanyDeveloper = function(apigee_profiles, companyName, developer, callback, includeCurl){
	var apigeel = apigee_profiles[apigee_profiles.env];
	var options = {
		uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/companies/" + companyName + "/developers/" + developer.name,
		method : 'PUT',
		auth : {user : apigeel.username, password: apigeel.password},
		headers : {'Content-Type': 'application/json'},
		body: JSON.stringify(developer)
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

exports.createCompanyDeveloper = function(apigee_profiles, companyName, developer, callback, includeCurl){
	var apigeel = apigee_profiles[apigee_profiles.env];
	var options = {
		uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/companies/" + companyName + "/developers",
		method : 'POST',
		auth : {user : apigeel.username, password: apigeel.password},
		headers : {'Content-Type': 'application/json'},
		body: JSON.stringify(developer)
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}


// Developers

exports.getDeveloper = function(apigee_profile, developerName, callback, includeCurl){
	var apigeel = apigee_profile[apigee_profile.env];
	var options = {
      uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/developers/" + developerName,
      method : 'GET',
      auth : {user : apigeel.username, password: apigeel.password}
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

exports.getDeveloperList = function(apigee_profile, callback, includeCurl){
	var apigeel = apigee_profile[apigee_profile.env];
	var options = {
      uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/developers",
      method : 'GET',
      auth : {user : apigeel.username, password: apigeel.password}
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

exports.updateDeveloper = function(apigee_profiles, developer, callback, includeCurl){
	var apigeel = apigee_profiles[apigee_profiles.env];
	var options = {
		uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/developers/" + developer.email,
		method : 'PUT',
		auth : {user : apigeel.username, password: apigeel.password},
		headers : {'Content-Type': 'application/json'},
		body: JSON.stringify(developer)
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

exports.createDeveloper = function(apigee_profiles, developer, callback, includeCurl){
	var apigeel = apigee_profiles[apigee_profiles.env];
	var options = {
		uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/developers",
		method : 'POST',
		auth : {user : apigeel.username, password: apigeel.password},
		headers : {'Content-Type': 'application/json'},
		body: JSON.stringify(developer)
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}


// Developer Apps

exports.getDeveloperApp = function(apigee_profile, developer, appName, callback, includeCurl){
	var apigeel = apigee_profile[apigee_profile.env];
	var options = {
      uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/developers/" + developer + "/apps/" + appName,
      method : 'GET',
      auth : {user : apigeel.username, password: apigeel.password}
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

exports.getDeveloperAppList = function(apigee_profile, developer, callback, includeCurl){
	var apigeel = apigee_profile[apigee_profile.env];
	var options = {
      uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/developers/" + developer + "/apps?expand=true",
      method : 'GET',
      auth : {user : apigeel.username, password: apigeel.password}
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

exports.updateDeveloperApp = function(apigee_profiles, developer, developerApp, callback, includeCurl){
	var apigeel = apigee_profiles[apigee_profiles.env];
	var options = {
		uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/developers/" + developer + "/apps/" + developerApp.name,
		method : 'PUT',
		auth : {user : apigeel.username, password: apigeel.password},
		headers : {'Content-Type': 'application/json'},
		body: JSON.stringify(developerApp)
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}

exports.createDeveloperApp = function(apigee_profiles, developer, developerApp, callback, includeCurl){
	var apigeel = apigee_profiles[apigee_profiles.env];
	var options = {
		uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/developers/" + developer + "/apps",
		method : 'POST',
		auth : {user : apigeel.username, password: apigeel.password},
		headers : {'Content-Type': 'application/json'},
		body: JSON.stringify(developerApp)
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}


exports.deleteDeveloperAppKey = function(apigee_profiles, developer, appName, appKey, callback, includeCurl){
	var apigeel = apigee_profiles[apigee_profiles.env];
	var options = {
		uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/developers/" + developer + "/apps/" + appName + "/keys/" + appKey,
		method : 'DELETE',
		auth : {user : apigeel.username, password: apigeel.password}
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}


exports.addDeveloperAppKey = function(apigee_profiles, developer, appName, appKeyPayload, callback, includeCurl){
	var apigeel = apigee_profiles[apigee_profiles.env];
	var options = {
		uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/developers/" + developer + "/apps/" + appName + "/keys/create",
		method : 'POST',
		auth : {user : apigeel.username, password: apigeel.password},
		headers : {'Content-Type': 'application/json'},
		body: JSON.stringify(appKeyPayload)
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}


exports.addDeveloperAppProducts = function(apigee_profiles, developer, appName, appKey, productsPayload, callback, includeCurl){
	var apigeel = apigee_profiles[apigee_profiles.env];
	var options = {
		uri : apigeel.url_mgmt + '/v1/organizations/' + apigeel.org + "/developers/" + developer + "/apps/" + appName + "/keys/" + appKey,
		method : 'POST',
		auth : {user : apigeel.username, password: apigeel.password},
		headers : {'Content-Type': 'application/json'},
		body: JSON.stringify(productsPayload)
    };
	if(includeCurl)
		helper.generatecURL(options);
    request(options, callback);
}


