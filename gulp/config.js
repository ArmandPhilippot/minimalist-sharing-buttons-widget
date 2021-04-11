/**
 * Gulp configuration
 */

const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const fs = require('fs');

// Load environment variables
const myDotenv = dotenv.config();
dotenvExpand(myDotenv);

/**
 * Load package.json data.
 */
const package = JSON.parse(fs.readFileSync('./package.json'));
const packageVersion = package.version;

if (myDotenv.error) {
	throw myDotenv.error;
}

module.exports = {
	browserSync: {
		hostname: process.env.WP_BS_HOSTNAME,
		host: 'www.' + process.env.WP_BS_HOSTNAME,
		proxy: 'https://www.' + process.env.WP_BS_HOSTNAME,
		port: process.env.WP_BS_PORT,
		https: {
			key: process.env.WP_BS_HTTPS_KEY,
			cert: process.env.WP_BS_HTTPS_CERT,
		},
		ghostMode: {
			scroll: true,
			links: true,
			forms: true,
		},
		logLevel: process.env.WP_BS_LOG,
		snippetOptions: {
			// Provide a custom Regex for inserting the snippet.
			rule: {
				match: /<\/body>/i,
				fn: function (snippet, match) {
					return snippet + match;
				},
			},
		},
		open: process.env.WP_BS_OPEN,
		browser: process.env.WP_BS_BROWSER.split(','),
		notify: process.env.WP_BS_NOTIFY,
	},
	bump: {
		styles: {
			src: './src/scss/helpers/_variables.scss',
			dest: './src/scss/helpers/',
		},
		php: {
			src:
				'class-' +
				process.env.WP_WIDGET_PACKAGE_CAPITALIZE.toLowerCase() +
				'.php',
			dest: './',
		},
		txt: {
			src: 'readme.txt',
			dest: './',
		},
	},
	clean: {
		paths: [
			'public/css/**/*',
			'public/js/**/*',
			'public/fonts/**/*',
			'public/images/**/*',
			'admin/css/**/*',
			'admin/js/**/*',
		],
	},
	files: {
		watch: ['./**/*.php', '!vendor/**/*.php'],
	},
	fonts: {
		src: 'src/fonts/**/*',
		dest: 'public/fonts/',
		watch: 'src/fonts/**/*',
	},
	images: {
		src: 'src/images/**/*',
		dest: 'public/images/',
		watch: 'src/images/**/*',
		imageminOptions: {
			gif: {
				interlaced: true,
			},
			jpg: {
				progressive: true,
				quality: 75,
			},
			png: {
				optimizationLevel: 5,
			},
			svg: {
				plugins: [
					{ removeTitle: true },
					{ removeViewBox: false },
					{ removeXMLNS: false },
				],
			},
		},
	},
	init: {
		src: [
			'composer.json',
			'package.json',
			'phpcs.xml',
			'readme.txt',
			'src/scss/helpers/_variables.scss',
			'./**/*.php',
			'!vendor/**/*.php',
		],
		dest: './',
		authorName: process.env.WP_WIDGET_AUTHOR_NAME,
		authorEmail: process.env.WP_WIDGET_AUTHOR_EMAIL,
		authorUrl: process.env.WP_WIDGET_AUTHOR_URL,
		contributors: process.env.WP_WIDGET_CONTRIBUTORS,
		copyright: process.env.WP_WIDGET_COPYRIGHT,
		description: process.env.WP_WIDGET_DESCRIPTION,
		file: {
			main: 'class-your-package-name.php',
			admin: 'admin/partials/your-package-name-admin-display.php',
			public: 'public/partials/your-package-name-public-display.php',
		},
		name: process.env.WP_WIDGET_NAME,
		packageName: process.env.WP_WIDGET_PACKAGE_CAPITALIZE,
		prefix: process.env.WP_WIDGET_PREFIX_PASCALCASE,
		repo: process.env.WP_WIDGET_REPO,
		textDomain: process.env.WP_WIDGET_TEXT_DOMAIN,
		vendorName: process.env.WP_WIDGET_VENDOR_NAME,
	},
	notify: {
		onLastOption: true,
	},
	scripts: {
		src: {
			public: 'src/js/public/**/*.js',
			admin: 'src/js/admin/**/*.js',
		},
		dest: {
			public: 'public/js/',
			admin: 'admin/js/',
		},
		watch: {
			public: 'src/js/public/**/*.js',
			admin: 'src/js/admin/**/*.js',
		},
	},
	styles: {
		src: {
			public: 'src/scss/public-styles.scss',
			admin: 'src/scss/admin-styles.scss',
		},
		dest: {
			public: 'public/css/',
			admin: 'admin/css/',
		},
		watch: {
			public: ['src/scss/**/*.scss', '!src/scss/admin-styles.scss'],
			admin: ['src/scss/**/*.scss', '!src/scss/public-styles.scss'],
		},
		postCss: {
			sortingOptions: {
				'properties-order': 'alphabetical',
			},
		},
		sassOptions: {
			outputStyle: 'expanded',
			indentType: 'tab',
			indentWidth: '1',
			includePaths: ['node_modules'],
		},
	},
	translation: {
		src: ['./**/*.php'],
		dest: './languages/',
		filename: process.env.WP_WIDGET_TEXT_DOMAIN + '.pot',
		potOptions: {
			domain: process.env.WP_WIDGET_TEXT_DOMAIN,
			package: process.env.WP_WIDGET_PACKAGE_CAPITALIZE,
			bugReport: process.env.WP_WIDGET_REPO + '/issues',
			lastTranslator: process.env.WP_POT_LAST_TRANSLATOR,
			team: process.env.WP_POT_TEAM,
		},
	},
	zip: {
		filename:
			process.env.WP_WIDGET_PACKAGE_CAPITALIZE +
			'-' +
			packageVersion +
			'.zip',
		src: [
			'./**/*',
			'!{certs,certs/**/*}',
			'!{gulp,gulp/**/*}',
			'!{node_modules,node_modules/**/*}',
			'!{src,src/**/*}',
			'!{vendor,vendor/**/*}',
			'!./**/*.map',
			'!.commitlintrc.json',
			'!.editorconfig',
			'!.env',
			'!.eslintrc.js',
			'!.eslintignore',
			'!.prettierrc',
			'!.stylelintrc.json',
			'!.versionrc',
			'!babel.config.json',
			'!composer.json',
			'!composer.lock',
			'!gulpfile.js',
			'!package.json',
			'!package-lock.json',
			'!phpcs.xml',
		],
		dest: './',
	},
};
