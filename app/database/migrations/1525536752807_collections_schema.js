'use strict'

const Schema = use('Schema')

class CollectionsSchema extends Schema {
  up () {
    this.create('collections', (table) => {
      table.increments()
      table.integer('recipient_id')
      table.string('collection_code')
      table.string('agent_confirmation')
      table.integer('received_status')
      table.string('chainaid_hash')
      table.timestamps()
    })
  }

  down () {
    this.drop('collections')
  }
}

module.exports = CollectionsSchema
