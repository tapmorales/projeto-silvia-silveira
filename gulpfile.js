var gulp    = require('gulp')
    , sass  = require('gulp-sass')
    , include = require('gulp-file-include')
    , clean = require('gulp-clean')
    , autoprefixer = require('gulp-autoprefixer')
    , uncss = require('gulp-uncss')
    , imagemin = require('gulp-imagemin')
    , cssnano = require('gulp-cssnano')
    , uglify = require('gulp-uglify')
    , concat = require('gulp-concat')
    , rename = require('gulp-rename')
    , browserSync = require('browser-sync');

/* novo comentario */
gulp.task('clean', function(){
    return gulp.src('dist')
        .pipe(clean());
})

gulp.task('copy', ['clean'], function(){
    return gulp.src([
        'src/components/bootstrap/dist/**/*', 
        'src/components/bootstrap/fonts/**/*', 
        'src/components/bootstrap/js/**/*', 
        'src/components/font-awesome/css/**/*', 
        'src/components/font-awesome/fonts/**/*'], {"base": "src"})
        .pipe(gulp.dest('dist'))
})

gulp.task('sass', function(){
    return gulp.src('./src/sass/**/*.scss')
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(gulp.dest('./dist/css/'));
})

gulp.task('html', function(){
    return gulp.src([
            './src/**/*.html',
            '!src/inc/**'
        ])
        .pipe(include())
        .pipe(gulp.dest('./dist/'))
})

gulp.task('uncss', ['html'], function(){
    return gulp.src('./dist/components/**/*.css')
        .pipe(uncss({
            html: ['./dist/*.html']
        }))
        .pipe(gulp.dest('./dist/components/'))
})

gulp.task('imagemin', function(){
    return gulp.src('./src/imagens/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/imagens/'))
})

gulp.task('build-js', function(){
    return gulp.src('src/javascript/**/*')
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/javascript/'))
})

gulp.task('svgmin', function(){
    
    return gulp.src(['src/inc/icons/*.svg', '!src/inc/icons/*.min.svg'])
        .pipe(imagemin())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('src/inc/icons/'))
})

gulp.task('default', ['copy'], function(){
    gulp.start('uncss', 'imagemin', 'sass', 'build-js')
})

gulp.task('server', function(){
    
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    })
    
    gulp.watch('./dist/**/*').on('change', browserSync.reload)
    
    gulp.watch('./src/sass/**/*.scss', ['sass'])
    gulp.watch('./src/**/*.html', ['html'])
    gulp.watch('./src/javascript/**/*', ['build-js'])    
    gulp.watch([
        './src/inc/icons/*.svg',
        '!./src/inc/icons/*.min.svg'
        ], ['svgmin'])
})

