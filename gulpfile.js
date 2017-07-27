/**
 * gulp配置
 * version:1.0.1
 * created by LittleYellow/441980627@qq.com
 */

// Load plugins
var gulp = require('gulp'), // 必须先引入gulp插件
	del = require('del'), // 文件删除
	gutil = require('gulp-util'),
	sass = require('gulp-ruby-sass'), // sass 编译
	cached = require('gulp-cached'), // 缓存当前任务中的文件，只让已修改的文件通过管道
	uglify = require('gulp-uglify'), // js 压缩
	rename = require('gulp-rename'), // 重命名
	concat = require('gulp-concat'), // 合并文件
	notify = require('gulp-notify'), // 相当于 console.log()
	filter = require('gulp-filter'), // 过滤筛选指定文件
	jshint = require('gulp-jshint'), // js 语法校验
	rev = require('gulp-rev-append'), // 插入文件指纹（MD5）
	cssnano = require('gulp-cssnano'), // CSS 压缩
	imagemin = require('gulp-imagemin'), // 图片优化
	fileinclude = require('gulp-file-include'), // 可以 include html 文件
	autoprefixer = require('gulp-autoprefixer'), // 添加 CSS 浏览器前缀
	webpack = require('webpack'),
	webpackConfig = require('./webpack.config.js'),
	fs = require('fs'),
	GulpSSH = require('gulp-ssh'), //传文件至远程服务器
	config = {

		//测试环境
		host: '10.101.130.9',
		port: 22,
		username: 'jst',
		password: 'jst',
		privateKey: fs.readFileSync('id_rsa_dev'), //密钥
		filePath: "/home/jst/fizz/", //发布到哪儿去

		//开发环境
		//		host: '10.101.130.212',
		//		port: 22,
		//		username: 'jst',
		//		password: 'jst',
		//		privateKey: fs.readFileSync('id_rsa'), //密钥
		//		filePath: "/home/jst/product/app/apache-tomcat-8.0.36/webapps/app", //发布到哪儿去---开发环境

		backupPath: "/home/jst/fizz_bak/" //发布之前备份目录
	}; //远程服务器

var gulpSSH = new GulpSSH({
	ignoreErrors: false,
	sshConfig: config
});

// 需备份的文件夹信息，用于组成linux命令
var distPro = {
	cssPath: "css ", // 需备份的css文件夹名称
	imgPath: "img ", // 需备份的img文件夹名称
	jsPath: "js ", // 需备份的js文件夹名称
	pagePath: "page ", // 需备份的page文件夹名称
	bakName: "test_backup_", // 备份文件夹名称前缀
};

//将原来的版本备份
gulp.task('exec', function() {
	Date.prototype.Format = function(fmt) {
		var o = {
			"M+": this.getMonth() + 1, //月份   
			"d+": this.getDate(), //日   
			"h+": this.getHours(), //小时   
			"m+": this.getMinutes(), //分   
			"s+": this.getSeconds(), //秒   
			"q+": Math.floor((this.getMonth() + 3) / 3), //季度   
			"S": this.getMilliseconds() //毫秒   
		};
		if(/(y+)/.test(fmt))
			fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		for(var k in o)
			if(new RegExp("(" + k + ")").test(fmt))
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	};
	var todayDate = new Date().Format("yyyyMMddhms"),
		cssBackupFile = config.filePath + distPro.cssPath,
		imgBackupFile = config.filePath + distPro.imgPath,
		jsBackupFile = config.filePath + distPro.jsPath,
		pageBackupFile = config.filePath + distPro.pagePath,
		backupHome = config.backupPath + distPro.bakName + todayDate;
	return gulpSSH.exec(["mkdir " + backupHome, "mv " + cssBackupFile + imgBackupFile + jsBackupFile + pageBackupFile + backupHome], {
		filePath: 'commands.log'
	}).on('error', function(err) {
		gutil.log('exec Error!', err.message);
		this.end();
	}).pipe(gulp.dest('logs'));
});

// 发布之前先清空本地的编译文件
gulp.task('deploy', ['clean'], function() {
	gulp.start('deploy-server');
});

// 编译完成后进行发布
gulp.task('deploy-server', ['revhtml', 'revcss', 'script', 'image', 'exec'], function() {
	return gulp.src('dist/**/*')
		.pipe(gulpSSH.dest(config.filePath))
});

// 开始编译，依赖清空任务
gulp.task('start', ['clean'], function() {
	gulp.start('build');
});

// 构建app文件
//gulp.task('dev-app', function() {
//	return gulp.src('dist/**/*')
//		.pipe(cached('dev-app'))
//		.pipe(gulp.dest('../app'))
//});

// build，关连执行全部编译任务
gulp.task('build', ['revcss', 'script', 'image'], function() {
	gulp.start('revhtml');
});

// 给编译出来的html的css/js路径加入MD5标识
gulp.task('revhtml', ['html'], function() {
	return gulp.src('dist/page/**/*.html')
		.pipe(rev()) // 生成并插入 MD5
		.pipe(gulp.dest('dist/page'))
});

// 编译 html文件
gulp.task('html', function() {
	return gulp.src('src/page/**/*.html')
		.pipe(fileinclude()) // include html
		//.pipe(rev()) // 生成并插入 MD5
		.pipe(gulp.dest('dist/page'))
});

// 对编译出来css加前缀、压缩
gulp.task('revcss', ['sass', 'css'], function() {
	return gulp.src('dist/css/**/*.css')
		.pipe(autoprefixer('last 6 version')) // 添加 CSS 浏览器前缀，兼容最新的5个版本
		.pipe(filter(['**/*', '!**/*.min.css'])) // 筛选出管道中的非 *.min.css 文件
		.pipe(cssnano()) // 压缩 CSS
		.pipe(gulp.dest('dist/css'))
});

// sass
gulp.task('sass', function() {
	return sass('src/sass/**/*.scss', {
			style: 'expanded' // nested-嵌套缩进的css代码，它是默认值 | expanded-没有缩进的、扩展的css代码 | compact-简洁格式的css代码 | compressed-压缩后的css代码
		}) // 传入 sass 目录及子目录下的所有 .scss 文件 生成文件流通过管道并设置输出格式
		.pipe(cached('sass')) // 缓存传入文件，只让已修改的文件通过管道（第一次执行是全部通过，因为还没有记录缓存），参数'sass'为任务名
		//	.pipe(filter(['**/*', '!**/*.min.css'])) // 筛选出管道中的非 *.min.css 文件
		//	.pipe(rename({
		//		suffix: '.min'
		//	})) // 对管道里的文件流添加 .min 的重命名
		.pipe(gulp.dest('dist/css')) // 输出到 dist/css 目录下（不影响此时管道里的文件流）
});

// css
gulp.task('css', function() {
	return gulp.src('src/sass/**/*.css')
		.pipe(cached('css'))
		.pipe(gulp.dest('dist/css')) // 把管道里的所有文件输出到 dist/css 目录
});

// styleReload （结合 watch 任务，无刷新CSS注入）
gulp.task('styleReload', ['revcss'], function() {
	return gulp.src(['dist/css/**/*.css'])
		.pipe(cached('styleReload'));
});

//引用webpack对js进行操作
gulp.task("build-js-dev", function(callback) {
	webpack(webpackConfig, function(err, stats) {
		if(err) throw new gutil.PluginError("webpack:build-js", err);
		gutil.log("[webpack:build-js]", stats.toString({
			colors: true
		}));
		callback();
	});
});

// 拷贝vendors下的js文件到dist
gulp.task('move-vendors-js', function() {
	return gulp.src('src/js/vendors/**/*.js')
		.pipe(cached('move-vendors-js'))
		.pipe(gulp.dest('dist/js/vendors'))
});

// script （拷贝 *.min.js，常规 js 则输出压缩与未压缩两个版本）
gulp.task('script', ['build-js-dev', 'move-vendors-js'], function() {
	return gulp.src(['dist/js/**/*.js'])
		.pipe(cached('script'))
		//.pipe(gulp.dest('dist/js'))
		//.pipe(filter(['**/*', '!**/*.min.js'])) // 筛选出管道中的非 *.min.js 文件
		// .pipe(jshint('.jshintrc')) // js的校验与合并，根据需要开启
		// .pipe(jshint.reporter('default'))
		// .pipe(concat('main.js'))
		// .pipe(gulp.dest('dist/js'))
		//		.pipe(rename({
		//			suffix: '.min'
		//		}))
		.pipe(uglify()) // 压缩js
		.pipe(gulp.dest('dist/js'))
});

// image
gulp.task('image', function() {
	return gulp.src('src/img/**/*.{jpg,jpeg,png,gif}') // 或'src/img/**/*.+(jpg|jpeg|ico|png|gif|svg)'
		.pipe(cached('image'))
		.pipe(imagemin({
			optimizationLevel: 3,
			progressive: true,
			interlaced: true,
			multipass: true
		}))
		// 取值范围：0-7（优化等级）,是否无损压缩jpg图片，是否隔行扫描gif进行渲染，是否多次优化svg直到完全优化
		.pipe(gulp.dest('dist/img'))
});

// clean 清空 dist 目录
gulp.task('clean', function() {
	return del('dist/**/*');
});

// 监听项目
gulp.task('default', ['start'], function() {

	// 监控 SASS 文件，有变动则执行CSS注入
	gulp.watch('src/sass/**/*.scss', ['styleReload']);
	// 监控 CSS 文件，有变动则执行CSS注入
	gulp.watch('src/sass/**/*.css', ['styleReload']);
	// 监控 js 文件，有变动则执行 script 任务
	gulp.watch('src/js/**/*.js', ['script']);
	// 监控图片文件，有变动则执行 image 任务
	gulp.watch('src/img/**/*', ['image']);
	// 监控 html 文件，有变动则执行 revhtml 任务
	gulp.watch('src/page/**/*.html', ['revhtml']);

});