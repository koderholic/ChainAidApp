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

Route.on('/login').render('login').as('login_page')

Route.get('/logout', 'Auth/AuthController.logout').as('logout') 

Route.post('/login', 'Auth/AuthController.login').as('login') 

Route.on('/register').render('register').as('signup')

Route.post('/register', 'UserController.create').as('create_user') //store to db

Route.get('/dashboard', 'UserController.dashboard').middleware('auth').as('user_dasboard')


