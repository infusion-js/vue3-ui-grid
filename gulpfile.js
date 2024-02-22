var gulp            = require('gulp'),
    del             = require('del'),
    cleanCss        = require('gulp-clean-css'),
    concat          = require('gulp-concat'),
    htmlreplace     = require('gulp-html-replace'),
    babel           = require('gulp-babel'),
    uglify          = require('gulp-uglify'),
	//Package.JSON
	package         = require('../package.json'),
	//Transpile Options
	babelOptions    = { presets: ["@babel/env"] },
	uglifyOptions   = {'mangle': true};

const versionSuffix = '-v1.0.min';


function clean( dest ) {
  return del( dest );
};

function minifyJs ( name, src, dest ) {
  return gulp.src(src)
  .pipe(concat(name + versionSuffix + '.js'))
  .pipe(babel(babelOptions))
  .pipe(uglify(uglifyOptions))
  .pipe(gulp.dest(dest));
}

function minifyCss ( name, src, dest ) {
  return gulp.src( src )
    .pipe( concat ( name + versionSuffix + '.css') )
    .pipe( cleanCss( { keepSpecialComments :'*' } ) )
    .pipe( gulp.dest( dest ) );
}

function replaceHtmlBlock( target, src, dest ) {
  return gulp.src( target )
    .pipe( htmlreplace( src, { 'keepBlockTags' :true } ) )
    .pipe( gulp.dest(dest) );
}


gulp.task("ug-clean-scripts", function() {
  clean( "docs/lib/vue-ui-grid"+versionSuffix+".js" );
  clean( "dist/vue-ui-grid"+versionSuffix+".js" );
} );

gulp.task( 'ug-min-scripts', [ 'ug-clean-scripts' ], function() {
  minifyJs( 'vue-ui-grid',
    [
      "src/vue-ui-grid.js"
    ],
    "docs/lib/" 
  );
  minifyJs( 'vue-ui-grid',
    [
      "src/vue-ui-grid.js"
    ],
    "dist/" 
  );
} );


gulp.task("ug-clean-styles", function() {
  clean( "docs/css/vue-ui-grid"+versionSuffix+".css" );
  clean( "docs/css/fonts/**//*" );
  clean( "dist/vue-ui-grid"+versionSuffix+".css" );
  clean( "dist/fonts/**//*" );
} );

gulp.task("ug-min-styles", [ 'ug-clean-styles' ], function() {
  gulp.src(["src/css/fonts/**/*"]).pipe( gulp.dest("docs/css/fonts") );
  minifyCss( 'vue-ui-grid',
    [
      "src/css/vue-ui-grid.css"
    ],
    "docs/css/" 
  );
  gulp.src(["src/css/fonts/**/*"]).pipe( gulp.dest("dist/fonts") );
  minifyCss( 'vue-ui-grid',
    [
      "src/css/vue-ui-grid.css"
    ],
    "dist/" 
  );
} );


gulp.task( 'default', [ 'ug-min-styles', 'ug-min-scripts' ],
  function() {
    replaceHtmlBlock( "docs/index.html", {
        "cs00010": './css/vue-ui-grid' + versionSuffix + ".css",
        "js00010": './lib/vue-ui-grid' + versionSuffix + ".js"
     }, "docs"
    );
  }
);




