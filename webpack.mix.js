let mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.autoload({
    'jquery': ['$', 'window.jQuery', "jQuery", "window.$", "jquery", "window.jquery"],
    'popper.js/dist/umd/popper.js': ['Popper', 'window.Popper']
});

mix.js('resources/assets/js/app.js', 'public/js')
   .sass('resources/assets/sass/app.scss', 'public/css')

   .copyDirectory('resources/img', 'public/img')
   .js('resources/assets/js/jsfunc.js', 'public/js')
   .copyDirectory('resources/leaflet_assets/images', 'public/leaflet_assets/images')
   .js('resources/leaflet_assets/components/Map.js', 'public/leaflet_assets/components/Map.js')
   .js('resources/leaflet_assets/components/Mapapp.js', 'public/leaflet_assets/components/Mapapp.js')
   .js('resources/leaflet_assets/index.js', 'public/leaflet_assets/index.js')

   .copy('resources/leaflet_assets/index.html', 'public/leaflet_assets/index.html')
   .copy('resources/leaflet_assets/leaflet.css', 'public/leaflet_assets/leaflet.css');
   

   mix.browserSync({
    files: [
        'app/**/*',
        'public/**/*',
        'resources/views/**/*',
        'resources/lang/**/*',
        'routes/**/*'
    ],
    reloadDelay: 200,
    proxy: 'mylocalhost',
    notify: false
    
});

