'use strict';

const FindFolder = require('node-find-folder');

const findFolderResult = new FindFolder('locales', { nottraversal: ['compiled'] });

const glob = require('glob');

const globResult = glob.sync(findFolderResult[0] + '/*/', { realpath: true });

let getJSONFiles = [];

for (let i = 0; i < globResult.length; i++) {
	getJSONFiles = getJSONFiles.concat(glob.sync(globResult[i] + '/*', { realpath: true }));
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

	obj.languages.push({ lang: getLang, file: getJSONFiles[j] });
}

const path = require('path');

jsonfile.writeFileSync(path.join(globResult[0], '../found.json'), obj, { spaces: 2 }, function(err) {
	if (err) {
		console.log(err);
		return;
	}
});

console.log('All Language JSON dumped into found.json, this file will be used in the app.');
