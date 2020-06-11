const project_folder = "build";
// const project_folder = require("path").basename(__dirname) // назовет конечную папку названием проекта.
const source_folder = "#src";

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
		js: source_folder + "/script/script.js",//В стилях и скриптах нам понадобятся только main файлы
		scss: source_folder + "/scss/style.scss",
		css: source_folder + "/css/**/*.css",
		img: source_folder + "/images/**/*.{jpg,png,svg,gif,ico,webp}", //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
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
	// dir: "build",
	// // produc:"../poliakh.github.io/myportfolio",
	// produc: "dist",
	// test: "test"
};

const { src, dest } = require('gulp'),
	gulp = require('gulp'),
	browsersync = require('browser-sync').create(),
	rigger = require('gulp-rigger'),
	posthtml_include = require('posthtml-include'),
	del = require('del'),
	scss = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	group_media = require('gulp-group-css-media-queries'),
	clean_css = require('gulp-clean-css'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify-es').default,
	babel = require('gulp-babel'),
	imagemin = require('gulp-imagemin'),
	webp = require('gulp-webp'),
	webp_html = require('gulp-webp-html'),
	webpcss = require('gulp-webpcss'),
	ttf2woff = require('gulp-ttf2woff'),
	ttf2woff2 = require('gulp-ttf2woff2'),
	fonter = require('gulp-fonter'),
	sourcemaps = require('gulp-sourcemaps'),
	plumber = require('gulp-plumber');





function browserSync(params) {
	browsersync.init({
		server: {
			baseDir: "./" + project_folder + "/"
		},
		port: 3000,
		notify: false
	});
};

function html() {
	return src(path.src.html)
		.pipe(plumber())
		.pipe(rigger())
		.pipe(webp_html())
		.pipe(dest(path.build.html))
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
				overrideBrowserslist: ["last 5 versions"],
				cascade: true
			})
		)
		.pipe(webpcss())
		.pipe(sourcemaps.write())
		.pipe(dest(path.build.style))
		.pipe(webpcss())
		.pipe(clean_css())
		.pipe(
			rename({
				extname: ".min.css"
			})
		)
		.pipe(dest(path.build.style))
		.pipe(browsersync.stream())

}

function js() {
	return src(path.src.js)
	.pipe(sourcemaps.init())
		.pipe(plumber())
		.pipe(rigger())
		.pipe(babel({
			presets: [[
				"@babel/env",
				{
					"debug": true,//отобразит поддерживаемы браузеры в терминале и список примененных плагинов для адаптации
					"targets": [
						"last 3 chrome versions",
						"last 3 firefox versions",
						"last 3 edge versions",
						"last 3 ios versions"
					]
				}]],
			plugins: [
				"@babel/plugin-proposal-class-properties"
			]
		}))
		.pipe(sourcemaps.write())
		.pipe(dest(path.build.js))
		.pipe(uglify())
		.pipe(
			rename({
				extname: ".min.js"
			})
		)
		.pipe(dest(path.build.js))
		.pipe(browsersync.stream())
}

function images() {
	return src(path.src.img)
		.pipe(
			webp({
				quality: 70
			})
		)
		.pipe(dest(path.build.img))
		.pipe(src(path.src.img))
		.pipe(
			imagemin({
				progressive: true,
				interlaced: true,
				svgoPlugins: [{ removeViewBox: true }],
				optimizationLevel: 5 //от 0 до 7
			})
		)
		.pipe(dest(path.build.img))
		.pipe(browsersync.stream())
}

function fonts() {
	src(path.src.fonts)
		.pipe(ttf2woff())
		.pipe(dest(path.build.fonts))
	return src(path.src.fonts)
		.pipe(ttf2woff2())
		.pipe(dest(path.build.fonts))
}

gulp.task('otf2ttf', function () {
	return src([source_folder + '/fonts/*.otf'])
		.pipe(fonter({
			formats: ['ttf']
		}))
		.pipe(dest(source_folder + '/■Fonts/'))
})

gulp.task('svgSprite', function () {
	return gulp.src([source_folder + '/iconsprite/*.svg'])
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
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.img], images);
};

function clean() {
	return del(path.clean);
};

const build = gulp.series(clean, gulp.parallel(js, style, html, images, fonts));

const watch = gulp.parallel(build, watchFile, browserSync);

exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.scss = style;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;