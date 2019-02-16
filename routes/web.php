<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/index', 'PagesController@index');
Route::get('/ingresardatos', 'PagesController@ingresardatos');
Route::get('/login', 'PagesController@login');
Route::get('/logout', 'PagesController@logout');
Route::get('/register', 'PagesController@register');
Route::get('/ingresarexcel', 'PagesController@ingresarexcel');
Route::get('/descargar', 'PagesController@descargar');
Route::get('/mostrarmapas', 'PagesController@mostrarmapas');
Route::get('/admin', 'PagesController@admin');
Route::get('/', 'PagesController@map');
Route::get('/map', 'PagesController@map');

Route::get('/thanks', 'PagesController@thanks');
Route::get('/reset_1', 'PagesController@reset_1');
Route::get('/reset_2', 'PagesController@reset_2');
Route::get('/cargarshapes', 'PagesController@cargarshapes');
Route::get('/cargarshapesadmin', 'PagesController@cargarshapesadmin');
Route::get('/udpmapa', 'PagesController@udpmapa');




Route::post('/', 'PagesController@login');
Route::post('/admin', 'PagesController@admin');
Route::post('/descargar', 'PagesController@descargar');
Route::post('/login', 'PagesController@login');
Route::post('/register', 'PagesController@register');
Route::post('/ingresardatos', 'PagesController@ingresardatos');
Route::post('/reset_1', 'PagesController@reset_1');
Route::post('/reset_2', 'PagesController@reset_2');
Route::post('/cargarshapes', 'PagesController@cargarshapes');
Route::post('/cargarshapesadmin', 'PagesController@cargarshapesadmin');
Route::post('/udpmapa', 'PagesController@udpmapa');

