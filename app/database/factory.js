'use strict'

const Hash = use('Hash')

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

const Factory = use('Factory')

/**
  Factory.blueprint('App/Models/User', (faker) => {
    return {
      username: faker.username()
    }
  })
*/


// Fake Users
Factory.blueprint('App/Models/User', async (faker) => {
  return {
    first_name: faker.name(),
    last_name: faker.name(),
    age_range : '0 to 16',
    email: faker.email(),
    gender : faker.random(['Female', 'Male']),
    marital_status: 'Single',
    no_of_children: faker.random.number,
    telephone: faker.phone.phoneNumber,
    user_type: 'aid_giver',
    password: await Hash.make('password'),
    chainaid_hash:  await Hash.make('chainaid_hash')
  }
})
