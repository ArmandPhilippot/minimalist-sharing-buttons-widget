/**
 * Gulpfile
 *
 * Use Gulp to build a WordPress widget.
 *
 * Implements:
 * - BrowserSync (with watch task)
 * - Sass compilation, autoprefixer, sourcemaps and minification (style,
 * style-rtl, vendors styles)
 * - Babel transpilation, concatenation and minification (main scripts and
 * vendors scripts)
 * - Images optimizations (JPG, PNG, GIF, SVG)
 * - Pot file generation
 * - Zip folder without development files
 * - Copy `package.json` version to WP files
 * - A one-time task to init your widget
 *
 * @author Armand Philippot <contact@armandphilippot.com>
 */

/**
 * Load Gulp configuration and error handler.
 */
const config = require('./gulp/config');
const errorHandler = require('./gulp/error-handler');

/**
 * Load Gulp plugins.
 */
/* CSS */
const { src, dest, watch, series, parallel, lastRun } = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const sorting = require('postcss-sorting');
const autoprefixer = require('autoprefixer');
const cleanCSS = require('gulp-clean-css');
const rtl = require('gulp-rtlcss');

/* JS */
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

/* Images */
const imagemin = require('gulp-imagemin');

/* Translation */
const pot = require('gulp-wp-pot');

/* Live reload */
const browserSync = require('browser-sync');
const server = browserSync.create();
const reload = browserSync.reload;

/* Utilities */
const del = require('del');
const filter = require('gulp-filter');
const fs = require('fs');
const lec = require('gulp-line-ending-corrector');
const notify = require('gulp-notify');
const { pipeline } = require('stream');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const vinylPaths = require('vinyl-paths');
const zip = require('gulp-zip');

/**
 * Load package.json data.
 */
const package = JSON.parse(fs.readFileSync('./package.json'));
const packageVersion = package.version;

/**
 * Task: `serve`
 *
 * Init BrowserSync for live reloading.
 */
function serve(done) {
	browserSync.init(config.browserSync);
	done();
}

/**
 * Task: `clean`
 *
 * Delete all generated assets.
 */
function clean(done) {
	del.sync(config.clean.paths);
	done();
}

/**
 * Task: `publicStyles`
 *
 * Generate public style.css and style.min.css. SCSS to CSS compilation,
 * properties sorting, autoprefixer, minification.
 */
function publicStyles() {
	return pipeline(
		[
			src(config.styles.src.public, { sourcemaps: true }),
			sass(config.styles.sassOptions),
			postcss(
				[sorting(config.styles.postCss.sortingOptions)],
				[autoprefixer()]
			),
			lec(),
			rename('style.css'),
			dest(config.styles.dest.public),
			filter('**/*.css'),
			rename({ suffix: '.min' }),
			cleanCSS(),
			lec(),
			dest(config.styles.dest.public, { sourcemaps: '.' }),
			server.stream(),
			notify({
				title: 'publicStyles task complete',
				message:
					'style.css and style.min.css have been compiled and moved to the public folder.',
				onLast: config.notify.onLastOption,
			}),
		],
		errorHandler
	);
}

/**
 * Task: `publicRtlStyles`
 *
 * Generate public style-rtl.css and style-rtl.min.css. SCSS to CSS
 * compilation, properties sorting, autoprefixer, minification.
 */
function publicRtlStyles() {
	return pipeline(
		[
			src(config.styles.src.public, { sourcemaps: true }),
			sass(config.styles.sassOptions),
			postcss(
				[sorting(config.styles.postCss.sortingOptions)],
				[autoprefixer()]
			),
			lec(),
			rename('style-rtl.css'),
			rtl(),
			dest(config.styles.dest.public),
			filter('**/*.css'),
			rename({ suffix: '.min' }),
			cleanCSS(),
			lec(),
			dest(config.styles.dest.public, { sourcemaps: '.' }),
			server.stream(),
			notify({
				title: 'publicRtlStyles task complete',
				message:
					'style-rtl.css and style-rtl.min.css have been compiled and moved to the public folder.',
				onLast: config.notify.onLastOption,
			}),
		],
		errorHandler
	);
}

/**
 * Task: `adminStyles`
 *
 * Generate admin style.css and style.min.css. SCSS to CSS compilation,
 * properties sorting, autoprefixer, minification.
 */
function adminStyles() {
	return pipeline(
		[
			src(config.styles.src.admin, { sourcemaps: true }),
			sass(config.styles.sassOptions),
			postcss(
				[sorting(config.styles.postCss.sortingOptions)],
				[autoprefixer()]
			),
			lec(),
			rename('style.css'),
			dest(config.styles.dest.admin),
			filter('**/*.css'),
			rename({ suffix: '.min' }),
			cleanCSS(),
			lec(),
			dest(config.styles.dest.admin, { sourcemaps: '.' }),
			server.stream(),
			notify({
				title: 'adminStyles task complete',
				message:
					'style.css and style.min.css have been compiled and moved to the admin folder.',
				onLast: config.notify.onLastOption,
			}),
		],
		errorHandler
	);
}

/**
 * Task: `adminRtlStyles`
 *
 * Generate admin style-rtl.css and style-rtl.min.css. SCSS to CSS compilation,
 * properties sorting, autoprefixer, minification.
 */
function adminRtlStyles() {
	return pipeline(
		[
			src(config.styles.src.admin, { sourcemaps: true }),
			sass(config.styles.sassOptions),
			postcss(
				[sorting(config.styles.postCss.sortingOptions)],
				[autoprefixer()]
			),
			lec(),
			rename('style-rtl.css'),
			rtl(),
			dest(config.styles.dest.admin),
			filter('**/*.css'),
			rename({ suffix: '.min' }),
			cleanCSS(),
			lec(),
			dest(config.styles.dest.admin, { sourcemaps: '.' }),
			server.stream(),
			notify({
				title: 'adminRtlStyles task complete',
				message:
					'style-rtl.css and style-rtl.min.css have been compiled and moved to the admin folder.',
				onLast: config.notify.onLastOption,
			}),
		],
		errorHandler
	);
}

/**
 * Task: `publicScripts`
 *
 * Generate public scripts.js and scripts.min.js. JS concatenation and
 * minification.
 */
function publicScripts() {
	return pipeline(
		[
			src(config.scripts.src.public, { sourcemaps: true }),
			babel(),
			concat('scripts.js'),
			lec(),
			dest(config.scripts.dest.public),
			rename({ suffix: '.min' }),
			uglify(),
			lec(),
			dest(config.scripts.dest.public, { sourcemaps: '.' }),
			server.stream(),
			notify({
				title: 'publicScripts task complete',
				message:
					'scripts.js and scripts.min.js have been compiled and moved to the public folder.',
				onLast: config.notify.onLastOption,
			}),
		],
		errorHandler
	);
}

/**
 * Task: `adminScripts`
 *
 * Generate admin scripts.js and scripts.min.js. JS concatenation and
 * minification.
 */
function adminScripts() {
	return pipeline(
		[
			src(config.scripts.src.admin, { sourcemaps: true }),
			babel(),
			concat('scripts.js'),
			lec(),
			dest(config.scripts.dest.admin),
			rename({ suffix: '.min' }),
			uglify(),
			lec(),
			dest(config.scripts.dest.admin, { sourcemaps: '.' }),
			server.stream(),
			notify({
				title: 'adminScripts task complete',
				message:
					'scripts.js and scripts.min.js have been compiled and moved to the admin folder.',
				onLast: config.notify.onLastOption,
			}),
		],
		errorHandler
	);
}

/**
 * Task: `images`
 *
 * Compress images (png, jpg, gif, svg) and move them to the public folder.
 */
function images(done) {
	return pipeline(
		[
			src(config.images.src, { since: lastRun(images) }),
			imagemin([
				imagemin.gifsicle(config.images.imageminOptions.gif),
				imagemin.mozjpeg(config.images.imageminOptions.jpg),
				imagemin.optipng(config.images.imageminOptions.png),
				imagemin.svgo(config.images.imageminOptions.svg),
			]),
			dest(config.images.dest),
			notify({
				title: 'Images task complete',
				message:
					'Images have been compressed and moved to the public folder.',
				onLast: config.notify.onLastOption,
			}),
		],
		done()
	);
}

/**
 * Task: `moveFonts`
 *
 * Move fonts from src folder to public folder.
 */
function moveFonts(done) {
	return pipeline(
		[
			src(config.fonts.src),
			dest(config.fonts.dest),
			notify({
				title: 'moveFonts task complete',
				message: 'Fonts have been moved to the public folder.',
			}),
		],
		done()
	);
}

/**
 * Task: `compilePotFile`
 *
 * Generate a pot file for translation.
 */
function compilePotFile(done) {
	return pipeline(
		[
			src(config.translation.src),
			pot(config.translation.potOptions),
			dest(config.translation.dest + '/' + config.translation.filename),
			notify({
				title: 'compilePotFile task complete',
				message: 'POT file have been generated.',
			}),
		],
		done()
	);
}

/**
 * Task: `zipWidget`
 *
 * Generate a zip version of the theme without development files.
 */
function zipWidget(done) {
	return pipeline(
		[
			src(config.zip.src),
			zip(config.zip.filename),
			dest(config.zip.dest),
			notify({
				title: 'zipWidget task complete',
				message: 'Widget have been zipped.',
			}),
		],
		done()
	);
}

/**
 * Task: `bumpCSS`
 *
 * Copy package.json version in Sass variable and recompile CSS.
 */
function bumpCSS(done) {
	return pipeline(
		[
			src(config.bump.styles.src),
			replace(/widget_version: "(.{5})"/g, function () {
				return 'widget_version: "' + packageVersion + '"';
			}),
			dest(config.bump.styles.dest),
		],
		done()
	);
}

/**
 * Task: `bumpPHP`
 *
 * Copy package.json version in functions.php.
 */
function bumpPHP(done) {
	return pipeline(
		[
			src(config.bump.php.src),
			replace(/Version:           (.{5})/g, function () {
				return 'Version:           ' + packageVersion;
			}),
			replace(/_VERSION', '(.{5})'/g, function () {
				return "_VERSION', '" + packageVersion + "'";
			}),
			dest(config.bump.php.dest),
		],
		done()
	);
}

/**
 * Task: `bumpTXT`
 *
 * Copy package.json version in readme.txt.
 */
function bumpTXT(done) {
	return pipeline(
		[
			src(config.bump.txt.src),
			replace(/Stable tag: (.{5})/g, function () {
				return 'Stable tag: ' + packageVersion;
			}),
			dest(config.bump.txt.dest),
		],
		done()
	);
}

/**
 * Task: `renameMainFile`
 *
 * Init the widget folder by the main class file.
 */
function renameMainFile(done) {
	return pipeline(
		[
			src(config.init.file.main, { base: './' }),
			vinylPaths(del),
			rename({
				basename: 'class-' + config.init.packageName.toLowerCase(),
			}),
			dest(config.init.dest),
			notify({
				title: 'renameMainFile task complete',
				message: 'Main class file has been renamed.',
				onLast: config.notify.onLastOption,
			}),
		],
		done()
	);
}

/**
 * Task: `renameAdminFile`
 *
 * Init the widget folder by the admin partial file.
 */
function renameAdminFile(done) {
	return pipeline(
		[
			src(config.init.file.admin, { base: './' }),
			vinylPaths(del),
			rename({
				basename:
					config.init.packageName.toLowerCase() + '-admin-display',
			}),
			dest(config.init.dest),
			notify({
				title: 'renameAdminFile task complete',
				message: 'Admin partial file has been renamed.',
				onLast: config.notify.onLastOption,
			}),
		],
		done()
	);
}

/**
 * Task: `renamePublicFile`
 *
 * Init the widget folder by the public partial file.
 */
function renamePublicFile(done) {
	return pipeline(
		[
			src(config.init.file.public, { base: './' }),
			vinylPaths(del),
			rename({
				basename:
					config.init.packageName.toLowerCase() + '-public-display',
			}),
			dest(config.init.dest),
			notify({
				title: 'renamePublicFile task complete',
				message: 'Public partial file has been renamed.',
				onLast: config.notify.onLastOption,
			}),
		],
		done()
	);
}

/**
 * Task: `replaceWidgetInfo`
 *
 * Init the widget folder by replacing some placeholders.
 */
function replaceWidgetInfo(done) {
	return pipeline(
		[
			src(config.init.src, { base: './' }),
			replace('Firstname Lastname', function () {
				return config.init.authorName;
			}),
			replace('your@email.com', function () {
				return config.init.authorEmail;
			}),
			replace('https://www.yourWebsite.com/', function () {
				return config.init.authorUrl;
			}),
			replace('(WordPress.org usernames)', function () {
				return config.init.contributors;
			}),
			replace('2020 Company Name', function () {
				return config.init.copyright;
			}),
			replace('Your widget name', function () {
				return config.init.name;
			}),
			replace('Your widget description.', function () {
				return config.init.description;
			}),
			replace('Your-Package-Name', function () {
				return config.init.packageName;
			}),
			replace('Your_Package_Name', function () {
				return config.init.packageName.replace(/-/g, '_');
			}),
			replace('your-package-name', function () {
				return config.init.packageName.toLowerCase();
			}),
			replace('your_package_name', function () {
				return config.init.packageName.toLowerCase().replace(/-/g, '_');
			}),
			replace('YourPrefix', function () {
				return config.init.prefix;
			}),
			replace('yourprefix', function () {
				return config.init.prefix.toLowerCase();
			}),
			replace('YOURPREFIX', function () {
				return config.init.prefix.toUpperCase();
			}),
			replace('https://github.com/your/repo', function () {
				return config.init.repo;
			}),
			replace('yourTextDomain', function () {
				return config.init.textDomain;
			}),
			replace('your-vendor-name', function () {
				return config.init.vendorName;
			}),
			dest(config.init.dest),
			notify({
				title: 'replaceWidgetInfo task complete',
				message:
					'The placeholders have been replaced by your dotenv data.',
				onLast: config.notify.onLastOption,
			}),
		],
		done()
	);
}

/**
 * Task: `watchFiles`
 *
 * Reload tasks when files change.
 */
function watchFiles(done) {
	watch(config.styles.watch.public).on(
		'change',
		series(parallel(publicStyles, publicRtlStyles), reload)
	);
	watch(config.styles.watch.admin).on(
		'change',
		series(parallel(adminStyles, adminRtlStyles), reload)
	);
	watch(config.scripts.watch.public).on(
		'change',
		series(publicScripts, reload)
	);
	watch(config.scripts.watch.admin).on(
		'change',
		series(adminScripts, reload)
	);
	watch(config.images.watch).on('change', series(images, reload));
	watch(config.fonts.watch).on('change', series(moveFonts, reload));
	watch(config.files.watch).on('change', series(compilePotFile, reload));
	done();
}

/**
 * Public tasks
 */
const build = parallel(
	publicStyles,
	publicRtlStyles,
	adminStyles,
	adminRtlStyles,
	publicScripts,
	adminScripts,
	images,
	moveFonts,
	compilePotFile
);
exports.build = build;
exports.bump = parallel(bumpCSS, bumpPHP, bumpTXT);
exports.default = series(clean, build);
exports.initWidget = replaceWidgetInfo;
exports.renameFiles = parallel(
	renameMainFile,
	renameAdminFile,
	renamePublicFile
);
exports.recompileCSS = parallel(publicStyles, publicRtlStyles);
exports.translate = compilePotFile;
exports.watch = parallel(serve, watchFiles);
exports.zipWidget = series(zipWidget);
