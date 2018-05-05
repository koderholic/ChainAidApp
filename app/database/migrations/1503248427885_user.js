'use strict'

const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', table => {
      table.increments()
      table.string('first_name').notNullable()
      table.string('last_name').notNullable()
      table.string('age_range')
      table.string('email').notNullable().unique()
      table.string('gender') //(gender -> Male, Female)
      table.string('marital_status')
      table.integer('no_of_children')
      table.string('telephone').unique()
      table.string('user_type')  //(user_type: 'recipient', 'agent', 'aid_giver', 'admin')
      table.string('password').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
