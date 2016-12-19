# edge-download-deploy-grunt-script
This grunt script will download proxy and config from Edge to the file system.  It can also be used to build and deploy artifacts

Grunt Download, Build, Deploy Tool
=========
This script will download, build and deploy

### Script Installation

Follow these steps to install the build/deploy script on a Windows machine
Install NodeJS 
Download NodeJS installer: https://nodejs.org/en/download/
Download and run the 64-bit installer
Install Grunt
Open the NodeJS command prompt (run as administrator)
Start Button → applications → Node.js → Node.js command prompt (right click to run as administrator)
run the command:
npm install -g grunt-cli 
Refer to instructions for more detail: http://gruntjs.com/getting-started
Copy the "builddeploytool" folder from TFS to a working directory
Install libraries
cd builddeploytool
npm install
Install Java 
Download installer: http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html
File: jdk-8u91-windows-x64.exe
Run installer to install Java
Install Maven
Download Maven: https://maven.apache.org/download.cgi
File: apache-maven-3.3.9-bin.zip
Unzip to a folder that is referenceable 
Add the following environment variable:
JAVA_HOME: <path to java jdk installation>
Add the following to the PATH environment variable
<maven directory>/bin
Install Maven JARS
JAR files are attached to this page.  Click the small attachment icon at the top of the page to see the attachments
Download the jar files
Naviage to the folder where the jars files were downloaded and run both of these commands:
mvn install:install-file -Dfile=./expressions-1.0.0.jar -DgroupId=com.apigee.edge -DartifactId=expressions -Dversion=1.0.0 -Dpackaging=jar
mvn install:install-file -Dfile=./message-flow-1.0.0.jar -DgroupId=com.apigee.edge -DartifactId=message-flow -Dversion=1.0.0 -Dpackaging=jar
 
This should complete the installation.  Refer to the Build or Deploy instructions to run the scripts
 

### Commands

--debug --curl options will display more debug information to the command window.  These options are not required
Download Commands
Download Proxy 
grunt --env=dev --proxyName={proxy-name} --targetFolder=./target/download --revision=17 --username={username} --password={password} downloadProxy --debug --curl
Download Proxy and Proxy Config
grunt --env=dev --proxyName={proxy-name} --targetFolder=./target/download --revision=17 --username={username} --password={password} downloadProxyAndConfig --debug --curl
Download API Products Config

grunt --env=dev --proxyName=apiproduct-config --targetFolder=./target/download --username={username} --password={password} downloadApiProductConfig --debug --curl
Download Developer App Config
grunt --env=dev --proxyName=company-config --targetFolder=./target/download --username={username} --password={password} downloadAppConfig --debug --curl
 
Build Commands
Build Proxy Artifact (includes proxy and proxy config)
grunt --env=dev --folderPath=../proxies/{proxy-name} --targetPath=../ buildArtifact --debug --curl
Build Config Artifact (just config)
grunt --env=dev --folderPath=../configs/apiproduct-config --targetPath=../ buildConfigArtifact --debug --curl
grunt --env=dev --folderPath=../configs/company-config --targetPath=../ buildConfigArtifact --debug --curl
grunt --env=dev --folderPath=../configs/app-config --targetPath=../ buildConfigArtifact --debug --curl
Build Config Artifact and get Production App Key
grunt --env=dev --folderPath=../configs/app-config --targetPath=../ --prodenv=prod --produsername={username} --prodpassword={password} buildConfigArtifactProdKey --debug --curl
Deploy Commands
Deploy Artifact (Just Proxy, No Config)
grunt --env=dev --artifact=./target/proxyartifact --env=development --folderPath=../proxies/{proxy-name} {proxy-name}/{proxy-name}-artifact.zip --username={username} --password={password} deployArtifact --debug --curl
Deploy Artifact and Config (Both Proxy and Config)
grunt --env=dev --artifact=./target/{proxy-name}/{proxy-name}-artifact.zip --username={username} --password={password} deployConfigAndArtifact --debug --curl
Deploy API Product Config Artifact (Deploys Just API Product Config)
grunt --env=dev --artifact=./target/apiproduct-config/apiproduct-config-artifact.zip --username={username} --password={password} deployApiProductConfig --debug --curl
Deploy Company Config Artifact (Deploys Just Company and Company App Config)
grunt --env=dev --artifact=./target/apiproduct-config/apiproduct-config-artifact.zip --username={username} --password={password} deployCompanyConfig --debug --curl
Deploy Developer App Artifact (Deploys Just Developer and Developer App Config)
grunt --env=dev --artifact=./target/app-config/app-config-artifact.zip --username={username} --password={password} deployAppConfig --debug --curl
 


Based on: [Apigee Deploy Grunt Plugin Git Repo](https://github.com/apigeecs/apigee-deploy-grunt-plugin).


