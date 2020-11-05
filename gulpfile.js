/*
 -------------- для запуска версии production-----------------
	gulp build - обычная сборка в папку  build
	gulp prod - сжатая версия в папке prodгction
	gulp - дефолтный запуск с вотчером
---------------------end-----------------------------------
*/
// const project_folder = "C:/Open_Server/OSPanel/domains/gorelova",//home
// const project_folder = "D:/Programs/OpenServer/domains/gorelova",//work
const project_folder = "build",
	production_folder = "production",
	source_folder = "#src";
// const project_folder = require("path").basename(__dirname) // назовет конечную папку названием проекта.

const path = {
	build: {
		html: project_folder + "/",
		js: project_folder + "/script/",
		style: project_folder + "/css/",
		img: project_folder + "/images/",
		fonts: project_folder + "/fonts/"
	},
	src: {
		src: source_folder + "/",
		html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
		components: source_folder + "/components/",
		js: source_folder + "/script/",
		scss: source_folder + "/scss/style.scss",
		css: source_folder + "/css/**/*.css",
		sprite: source_folder + "/images/**/*.svg",
		img: source_folder + "/images/**/*.{jpg,png,gif,ico,webp}",
		fonts: source_folder + "/fonts/**/*.*"//"/fonts/**/*.ttf"
	},
	watch: {
		html: source_folder + "/**/*.html",
		components: source_folder + "/components",
		js: source_folder + "/script/**/*.js",
		scss: source_folder + "/scss/**/*.scss",
		css: source_folder + "/css/**/*.css",
		img: source_folder + "/images/**/*.*",
		fonts: source_folder + "/fonts/**/*.*"
	},
	clean: "./" + project_folder + "/",
	clean_prod: "./" + production_folder + "/",
	prod: {
		html: production_folder + "/",
		js: production_folder + "/script/",
		style: production_folder + "/css/",
		img: production_folder + "/images/",
		fonts: production_folder + "/fonts/"
	}
	// test: "test"
};

const { src, dest } = require('gulp'),
	gulp = require('gulp'),
	browsersync = require('browser-sync').create(),
	rigger = require('gulp-rigger'),
	posthtml_include = require('posthtml-include'),
	htmlMin = require('gulp-htmlmin'),
	del = require('del'),
	scss = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	group_media = require('gulp-group-css-media-queries'),
	rename = require('gulp-rename'),
	imagemin = require('gulp-imagemin'),
	webp = require('gulp-webp'),
	webp_html = require('gulp-webp-html'),
	webpcss = require('gulp-webpcss'),
	ttf2woff = require('gulp-ttf2woff'),
	ttf2woff2 = require('gulp-ttf2woff2'),
	fonter = require('gulp-fonter'),
	sourcemaps = require('gulp-sourcemaps'),
	plumber = require('gulp-plumber'),
	// strip = require('gulp-strip-comments'),//устанвить после создания условий для  prodaction
	cssnano = require('gulp-cssnano'),
	gulpif = require('gulp-if'),
	webpack = require("webpack-stream"),
	CopyPlugin = require('copy-webpack-plugin');


const flags = {
	prod: false
};

async function flagProd() {
	flags.prod = true;
};

const mode = () => {
	return (flags.prod) ? "production" : "development";
};

function browserSync() {
	browsersync.init({
		server: {
			baseDir: "./" + project_folder + "/"
		},
		ghostMode: {
			clicks: false,
			forms: false,
			scroll: false
		},

		port: 3000,
		notify: false
	});
};

function html() {
	return src(path.src.html)
		.pipe(sourcemaps.init())
		.pipe(plumber())
		.pipe(rigger())
		// .pipe(webp_html())
		// .pipe(gulpif(argv.prod,
		// 	htmlMin({
		// 		collapseWhitespace: true,
		// 		removeComments: true 
		// 		})
		// 	))
		.pipe(htmlMin({
			collapseWhitespace: true,
			removeComments: true
		})
		)
		// .pipe(gulpif(flags.prod,
		// 	htmlMin({
		// 		collapseWhitespace: true,
		// 		removeComments: true 
		// 		})
		// 	))
		.pipe(gulpif(!flags.prod, sourcemaps.write()))
		.pipe(gulpif(!flags.prod, dest(path.build.html)))
		.pipe(gulpif(flags.prod, dest(path.prod.html)))
		.pipe(browsersync.stream())
}

function style() {
	return src(path.src.scss)
		.pipe(sourcemaps.init())
		.pipe(
			scss({
				outputeStyle: "expanded"
			})
		)
		.pipe(group_media())
		.pipe(
			autoprefixer({
				overrideBrowserslist: ["last 3 versions"],
				cascade: true
			})
		)
		// .pipe(webpcss())
		.pipe(gulpif(!flags.prod, sourcemaps.write()))
		.pipe(gulpif(flags.prod, cssnano()))
		.pipe(
			rename({
				extname: ".min.css"
			})
		)
		.pipe(gulpif(!flags.prod, sourcemaps.write()))
		.pipe(gulpif(!flags.prod, dest(path.build.style)))
		.pipe(gulpif(flags.prod, dest(path.prod.style)))
		.pipe(browsersync.stream())
}

const bundle = () => {
	return src(path.src.js + 'script.js')
		.pipe(webpack({
			mode: mode(),
			output: {
				filename: 'main.min.js'
			},
			watch: false,
			devtool: "source-map",
			module: {
				rules: [
					{
						test: /\.js$/,
						exclude: /(node_modules|bower_components)/,
						use: {
							loader: 'babel-loader',
							options: {
								presets: [
									['@babel/preset-env',
										{
											debug: false,
											corejs: 3,
											useBuiltIns: "usage",
											targets: [
												'last 2 versions', 'not dead', '> 0.2%'
											]
										}
									]
								],
								plugins: [
									'@babel/plugin-proposal-class-properties'
								],
								cacheDirectory: true
							}
						}
					}, {
						test: /\.s[ac]ss$/i,
						use: [
						  // Creates `style` nodes from JS strings
						  'style-loader',
						  // Translates CSS into CommonJS
						  'css-loader',
						  // Compiles Sass to CSS
						  'sass-loader',
						],
					  },
				]
			}
			// ,plugins: [
			// 	new CopyPlugin({
			// 		patterns: [
			// 			// { from: './'+source_folder+'/manifest.json', to:'../manifest.json' },
			// 			// { from: './'+source_folder+'/sw-toolbox.js', to:'../sw-toolbox.js' },
			// 			// { from: './'+source_folder+'/sw.js', to:'../sw.js' },
			// 		],
			// 	}),
			// ]
		}))
		// .pipe(dest(path.build.js))
		.pipe(gulpif(!flags.prod, dest(path.build.js)))
		.pipe(gulpif(flags.prod, dest(path.prod.js)))
		.pipe(browsersync.stream())

	// .on("end", browsersync.reload);
};


function images() {
	src(path.src.img)
		// .pipe(
		// 	webp({
		// 		quality: 70
		// 	})
		// )
		// .pipe(dest(path.build.img))
		// .pipe(src(path.src.img))
		.pipe(
			imagemin({
				progressive: true,
				interlaced: true,
				// svgoPlugins: [{ removeViewBox: true }],
				optimizationLevel: 5 //от 0 до 7
			})
		)
		.pipe(gulpif(!flags.prod, dest(path.build.img)))
		.pipe(gulpif(flags.prod, dest(path.prod.img)))

	return src(path.src.sprite)
		.pipe(gulpif(!flags.prod, dest(path.build.img)))
		.pipe(gulpif(flags.prod, dest(path.prod.img)))
		.pipe(browsersync.stream())
}

function fonts() {
	src(path.src.fonts)
		.pipe(ttf2woff())
		.pipe(gulpif(!flags.prod, dest(path.build.fonts)))
		.pipe(gulpif(flags.prod, dest(path.prod.fonts)))
	return src(path.src.fonts)
		.pipe(ttf2woff2())
		.pipe(gulpif(!flags.prod, dest(path.build.fonts)))
		.pipe(gulpif(flags.prod, dest(path.prod.fonts)))
}

gulp.task('otf2ttf', function () {
	return src([source_folder + '/fonts/*.otf'])
		.pipe(fonter({
			formats: ['ttf']
		}))
		.pipe(dest(source_folder + '/Fonts/'))
})

gulp.task('svgSprite', function () {
	return gulp.src([source_folder + '/images/*.svg'])
		.pipe(svgSprite({
			mode: {
				stack: {
					sprite: "../icons/icons.svg", //sprite fiLe name
					example: true //creatr html with exemple
				}
			},
		}
		))
		.pipe(dest(path.build.img))
})

function watchFile() {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.scss], style);
	gulp.watch([path.watch.js], bundle);
	gulp.watch([path.watch.img], images);
};

function clean() {
	return del(path.clean);
};
function clean_prod() {
	return del(path.clean_prod);
};
function otherProd() {
	// return src(path.build.fonts + "/**/*.*")
	// 	.pipe(dest(path.prod.fonts))
}

const build = gulp.series(clean, gulp.parallel(bundle, style, html, images, fonts));

const build_prod = gulp.series(flagProd, clean_prod, gulp.parallel(bundle, style, html, images, fonts), otherProd);

const watch = gulp.series(build, gulp.parallel(watchFile, browserSync));

exports.fonts = fonts;
exports.images = images;
exports.bundle = bundle;
exports.scss = style;
exports.html = html;
exports.build = build;
exports.prod = build_prod;
exports.watch = watch;
exports.default = watch;