/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.raw(`CREATE TYPE friendship_status AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED')`);

  await knex.schema.createTable('friendships', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('requester_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('receiver_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.specificType('status', 'friendship_status').notNullable().defaultTo('PENDING');
    table.timestamps(true, true);

    // Prevent duplicate requests
    table.unique(['requester_id', 'receiver_id']);
  });

  await knex.schema.raw('CREATE INDEX idx_friendships_requester_id ON friendships(requester_id)');
  await knex.schema.raw('CREATE INDEX idx_friendships_receiver_id ON friendships(receiver_id)');
  await knex.schema.raw('CREATE INDEX idx_friendships_status ON friendships(status)');

  // Prevent self-friending
  await knex.raw('ALTER TABLE friendships ADD CONSTRAINT no_self_friend CHECK (requester_id != receiver_id)');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('friendships');
  await knex.raw('DROP TYPE IF EXISTS friendship_status');
};
