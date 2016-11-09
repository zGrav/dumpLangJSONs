'use strict';

const FindFolder = require('node-find-folder');

const findFolderResult = new FindFolder('locales', { nottraversal: ['compiled'] });

const glob = require('glob');

const globResult = glob.sync(findFolderResult[0] + '/*/');

const obj = {
	languages: [],
};

for (let i = 0; i < globResult.length; i++) {
	const getFiles = glob.sync(globResult[i] + '/*');
	let getLang = '';

	for (let j = 0; j < getFiles.length; j++) {
		getFiles[j] = getFiles[j].replace('locales/', '');
		getFiles[j] = getFiles[j].replace('libs/gosu-tools/localization/', ''); // in case we are running from Makefile
		getLang = getFiles[j].substr(0, getFiles[j].indexOf('/'));
		getFiles[j] = getFiles[j].substr(getFiles[j].indexOf('/') + 1);
	}

	obj.languages.push({ lang: getLang, files: getFiles });
}

const jsonfile = require('jsonfile');

const path = require('path');

jsonfile.writeFileSync(path.join(globResult[0], '../found.json'), obj, { spaces: 2 }, function(err) {
	if (err) {
		console.log(err);
		return;
	}
});

console.log('All Language JSON dumped into ' + path.join(globResult[0], '../found.json') + ', this file will be used in the app.');
