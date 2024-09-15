const fs = require('fs');
const path = require('path');
const { utils, rushUtils } = require('./rush-TemplateSpecUtils');

const verPolicy = utils.getVersionPolicy();
const projectsByTemplateSpec = rushUtils.getRushProjectsByTemplSpec(verPolicy)
//foreach TemplateSpec
Object.keys(projectsByTemplateSpec).forEach(templSpec => {
    let bump = {
        major: 0,
        minor: 0,
        patch: 0
    }
    const templSpecParamsPath = path.join(templSpec, 'deploy.parameters.json')

    //if 'deploy.parameters.json' exists
    if (fs.existsSync(templSpecParamsPath)) {
        //get the 'deploy.parameters.json' for the TemplateSpec
        const templateSpecsParams = JSON.parse(
            utils.readJSONFile(templSpecParamsPath)
        );
        //foreach Project in the TemplateSpec
        projectsByTemplateSpec[templSpec].forEach(projectFolder => {
            //read project's package.json
            const packagePath = path.join(templSpec, projectFolder, 'package.json')
            if (fs.existsSync(templSpecParamsPath)) {
                const packageJson = JSON.parse(
                    utils.readJSONFile(packagePath)
                );
                const pckgName = 'version_' + utils.toCamelCase(packageJson.name);
                if (templateSpecsParams.parameters.hasOwnProperty(pckgName)) {
                    const prevVersion = templateSpecsParams.parameters[pckgName].value;
                    const currVersion = packageJson.version;
                    if (prevVersion !== currVersion) {
                        templateSpecsParams.parameters[pckgName].value = currVersion
                        bump = utils.getBump(prevVersion, currVersion, bump)
                    }
                    // console.log(`${projectFolder} : ${lastPublishedVer} ? ${currVersion}`)
                }
            }
        })
        if (utils.shouldBump(bump)) {
            console.log(bump)
            const prevVersion = templateSpecsParams.parameters['version_TemplateSpec'].value
            const newVersion = utils.bumpVersion(prevVersion, bump)
            templateSpecsParams.parameters['version_TemplateSpec'].value = newVersion
            console.log(`   templSpec: ${prevVersion} -> ${newVersion}`)
        }
        utils.writeJSONFile(templSpecParamsPath, JSON.stringify(templateSpecsParams, null, 2))

    }




})


