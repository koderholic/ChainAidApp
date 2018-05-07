'use strict'

const Schema = use('Schema')

class AidProvisionsSchema extends Schema {
  up () {
    this.create('aid_provisions', (table) => {
      table.increments()
      table.integer('giver_id')
      table.string('aid_type') //(aid_type 'Cash', 'Kind'
      table.integer('recipient_id')
      table.string('amount')
      table.string('tranx_reference')+
      table.string('collection_code')
      table.string('agent_confirmation')
      table.integer('received_status')
      table.string('chainaid_hash')
      table.timestamps()
    })
  }

  down () {
    this.drop('aid_provisions')
  }
}

module.exports = AidProvisionsSchema
