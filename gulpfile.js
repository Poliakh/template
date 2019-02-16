let gulp			= require ('gulp'),
	sass			= require('gulp-sass'),
	sourcemaps		= require('gulp-sourcemaps'),
	autoprefixer	= require('gulp-autoprefixer'),
	gulpImport		= require('gulp-html-import'),
	htmlMin			= require('gulp-htmlmin'),
	browserSync		= require('browser-sync'),		//виртуальный браузер
	concat			= require('gulp-concat'),
	uglify			= require('gulp-uglifyjs'),		//сжатие JS
	babel			= require('gulp-babel'),		//траншпилим JS
	cssnano			= require('gulp-cssnano'),
	rename			= require('gulp-rename'),
	del				= require('del'),				//удаляет папку проекта
	plumber			= require('gulp-plumber'),		// обработчик ошибок
	notify			= require('gulp-notify'),
	cleanCSS		= require('gulp-clean-css'),
	gulpif			= require('gulp-if'),
	argv 			= require('yargs').argv,

	imagemin		= require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
    pngquant		= require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
	cache			= require('gulp-cache'), // Подключаем библиотеку кеширования
	util			= require('gulp-util');
	
	let path = {
		build: { //Тут мы укажем куда складывать готовые после сборки файлы
			html:	'build/',
			js:		'build/script/',
			style:	'build/css/',
			img:	'build/img/',
			fonts:	'build/fonts/'
		},
		src: { //Пути откуда брать исходники
			block:'src/blocks/',
			html:	'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
			js:		'src/script/**/*.js',//В стилях и скриптах нам понадобятся только main файлы
			scss:	'src/scss/style.scss',
			css:	'src/css/**/*.css',
			img:	'src/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
			fonts:	'src/fonts/**/*.*'
		},
		watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
			html:	'src/**/*.html',
			js:		'src/script/**/*.js',
			scss:	'src/scss/**/*.scss',
			css:	'src/css/**/*.css',
			img:	'src/img/**/*.*',
			fonts:	'src/fonts/**/*.*'
		},
		dir: 'build',
		produc:'production/',
		test : 'test'
	};


gulp.task('my', ()=>{
	// console.log('hello world!!!');
	gulp.src(path.src.scss)
	.pipe(gulp.dest(path.produc))

});

gulp.task('create', ()=>{
	// gulp.src('*.*', {read: false})
	gulp.start('build');
	gulp.start('my');
	gulp.src(path.dir)
		.pipe(gulp.dest(path.produc))
});

// watch
gulp.task('default',['build','server'], ()=>{
	gulp.watch(path.watch.html, ['htmlmin']);
	gulp.watch(path.watch.scss, ['sass']);
	gulp.watch(path.watch.js, ['script']);
	gulp.watch(path.watch.img, ['img']);
});
// для запуска версии prodaction
//	gulp build --prod  - создает версию с компрессией
//	gulp prod - переносит в папку  prodaction
gulp.task('ex',['build','prod'], ()=>{
	// gulp.start('prod')
	// gulp.src(path.dir)
	// .pipe(gulp.dest(path.produc));
	// .pipe(gulpif(argv.prod, gulp.dest(path.produc)));
})
gulp.task('prod',['cleanProd'],()=>{
	gulp.src(path.dir+'/**/*.*')
		.pipe(gulp.dest(path.produc));
});
//Сборка проекта
gulp.task('build',['clean','htmlmin','sass','script','img'], ()=>{
	gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.build.fonts));
});


//posthtml-include, posthtml-minifier или htmlnano.
gulp.task('htmlmin', ()=>{
	gulp.src(path.src.html)
		.pipe(sourcemaps.init())
		.pipe(plumber())
		.pipe(gulpImport(path.src.block))
		.pipe(gulpif(argv.prod,
			htmlMin({collapseWhitespace: true,removeComments: true})))
		.pipe(gulpif(!argv.prod, sourcemaps.write()))
		.pipe(gulp.dest(path.build.html))
		.pipe(browserSync.reload({stream:true}));
});

//style
gulp.task('sass', ()=>{
	gulp.src(path.src.scss)
	.pipe(sourcemaps.init())
	.pipe( sass()
			.on( 'error', notify.onError(
				{
					message: "<%= error.message %>",
					title  : "Sass Error!",
				} )
			))
	.pipe(autoprefixer(
		['last 3 version', '> 1%', 'ie 8', 'ie 7'],
		{cascade: true}))
		// .pipe(cssnano())
		.pipe(gulpif(argv.prod, cleanCSS({debug: true}, (details) => {
			console.log(`${details.name}: ${details.stats.originalSize}`);
			console.log(`${details.name}: ${details.stats.minifiedSize}`);
		})))
		.pipe(gulpif(!argv.prod, sourcemaps.write('.')))
		.pipe(gulp.dest(path.build.style))
		.pipe(browserSync.reload({stream:true}))
	});


//css - работает
// gulp.task('style',['sass'], ()=>{
// 	gulp.src(path.src.css)
// 		.pipe(concat('style.css'))
// 		//.pipe(cssnano())
// 		//.pipe(rename({suffix:'.min'}))
// 		.pipe(gulp.dest(path.build.style))
// 		.pipe(browserSync.reload({stream:true}));
// });


//script
gulp.task('script', ()=>{
	gulp.src(path.src.js)
		.pipe(sourcemaps.init())
		.pipe(plumber())
		.pipe(concat('script.js'))
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(gulpif(argv.prod, uglify()))//минимазция js
		.pipe(gulpif(!argv.prod, sourcemaps.write()))
		.pipe(gulp.dest(path.build.js))
		// .pipe(browserSync.reload({stream:true})); //незачем
});

gulp.task('server',()=>{
	browserSync({
		server:{
			baseDir:'build'
		},
		notify:true //отключение уведомлений false
	})
});

gulp.task('img', ()=>{
	gulp.src(path.src.img) // Берем все изображения из src
		.pipe(cache(imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest(path.build.img)) // Выгружаем на продакшен
		.pipe(browserSync.reload({stream:true}));
});

//удаление папки дистрибутива
gulp.task('clean', ()=>{
	del.sync(path.dir);
});
gulp.task('cleanProd', ()=>{
	del.sync(path.produc);
});

//чистка кеша в случае проблемс картинками например.
gulp.task('clear',  ()=>{ 
	cache.clearAll();
})
