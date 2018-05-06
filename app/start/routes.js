'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

const Route = use('Route')

// Home Routes

Route.on('/').render('login')
Route.on('/dashboard').render('backend.dashboard').as('dashboard')
Route.on('/search-results').render('backend.results', ).as('search-results')


Route.on('/login').render('login')

Route.post('/login', 'UserController.login').as('login') //store to db

Route.on('/register').render('register').as('signup')

Route.post('/register', 'UserController.create').as('create_user') //store to db
