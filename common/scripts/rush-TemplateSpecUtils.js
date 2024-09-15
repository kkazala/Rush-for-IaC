const fs = require('fs');
const path = require('path');

class Util {

    getVersionPolicy() {
        const idx = process.argv.indexOf('--version-policy');
        if (idx >= 0) {
            return process.argv[idx + 1]
        }
        else {
            return null
        }
    }
    readJSONFile(jsonPath) {
        const commentEval = new RegExp(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm);
        const data = fs.readFileSync(jsonPath, 'utf8');
        const json = data.replace(commentEval, '');
        return json;
    }
    writeJSONFile(jsonPath, json) {
        fs.writeFileSync(jsonPath, json, 'utf8');
    }
    toCamelCase(text) {
        return text.replace(/(?:^\w|[A-Z]|\b\w)/g, (leftTrim, index) =>
            leftTrim.toUpperCase()
        ).replace(/\s+/g, "").replace(/-/g, '');
    }
    getBump(lastPublishedVer, currentVersion, bump) {
        const [majorPub, minorPub, patchPub] = String(lastPublishedVer).split('.').map(v => Number.parseInt(v));
        const [majorCurr, minorCurr, patchCurr] = String(currentVersion).split('.').map(v => Number.parseInt(v));
        if (majorCurr > majorPub) {
            bump.major++
        }
        else if (minorCurr > minorPub) {
            bump.minor++
        }
        else if (patchCurr > patchPub) {
            bump.patch++
        }
        return bump;
    }
    shouldBump(bump) {
        return bump.major > 0 || bump.minor > 0 || bump.patch > 0
    }
    bumpVersion(currentVersion, bump) {
        let [majorCurr, minorCurr, patchCurr] = String(currentVersion).split('.').map(v => Number.parseInt(v));

        if (bump.major > 0) {
            return [majorCurr + 1, 0, 0].join('.')
        }
        else if (bump.minor > 0) {
            return [majorCurr, minorCurr + 1, 0].join('.')
        }
        else if (bump.patch > 0) {
            return [majorCurr, minorCurr, patchCurr + 1].join('.')
        }
    }
    findRushRoot(currentDir) {
        let dir = currentDir;

        // Traverse up the directory structure to find the rush.json file
        while (!fs.existsSync(path.join(dir, 'rush.json'))) {
            const parentDir = path.dirname(dir);

            // If we have reached the root directory and haven't found rush.json, exit
            if (parentDir === dir) {
                throw new Error('rush.json not found');
            }

            dir = parentDir;
        }

        return dir;
}
}

class RushUtil {
    getRushProjects(versionPolicy) {
        var utils = new Util();

        // Get the Rush configuration, which includes the root folder path

        const rushPath = utils.findRushRoot(process.cwd());

        const rushJsonPath = path.join(rushPath, 'rush.json');

        const rushJson = JSON.parse(
            utils.readJSONFile(rushJsonPath)
        );
        if (Array.isArray(rushJson.projects) && rushJson.projects.length > 0) {
            if (versionPolicy) {
                return rushJson.projects.filter(proj => proj.versionPolicyName == versionPolicy);
            }
            else {
                return rushJson.projects
            }
        }
        else {
            return null
        }
    }
    getRushProjectsByTemplSpec(versionPolicy) {
        const rushProjects = this.getRushProjects(versionPolicy);
        return rushProjects.reduce((before, value) => {
            let parentFolder = path.dirname(value.projectFolder);
            let projInfo = path.basename(value.projectFolder);
            before[parentFolder] ? before[parentFolder].push(projInfo) : before[parentFolder] = [projInfo], before;
            return before;
        }, {});
    }
}

exports.utils = new Util();
exports.rushUtils = new RushUtil();
