'use strict';

const FindFolder = require('node-find-folder');

const findFolderResult = new FindFolder('locales', { nottraversal: ['compiled'] });

const glob = require('glob');

const globResult = glob.sync(findFolderResult[0] + '/*/');

let getJSONFiles = [];

for (let i = 0; i < globResult.length; i++) {
	getJSONFiles = getJSONFiles.concat(glob.sync(globResult[i] + '/*'));
}

const jsonfile = require('jsonfile');

const obj = {
	languages: [],
};

for (let j = 0; j < getJSONFiles.length; j++) {
	const pattern = 'locales';
	const truncate = getJSONFiles[j].substr(getJSONFiles[j].indexOf(pattern), getJSONFiles[j].length - pattern.length);

	let getLang = truncate.substr(0, truncate.lastIndexOf('/'));
	getLang = getLang.substr(getLang.indexOf('/') + 1);

	const getFile = truncate.substr(truncate.lastIndexOf('/') + 1);

	obj.languages.push({ lang: getLang, file: getFile });
}

const path = require('path');

jsonfile.writeFileSync(path.join(globResult[0], '../found.json'), obj, { spaces: 2 }, function(err) {
	if (err) {
		console.log(err);
		return;
	}
});

console.log('All Language JSON dumped into ' + path.join(globResult[0], '../found.json') + ', this file will be used in the app.');
