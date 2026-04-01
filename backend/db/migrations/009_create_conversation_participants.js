/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('conversation_participants', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('conversation_id').notNullable().references('id').inTable('conversations').onDelete('CASCADE');
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.timestamp('joined_at').notNullable().defaultTo(knex.fn.now());

    table.unique(['conversation_id', 'user_id']);
  });

  await knex.schema.raw('CREATE INDEX idx_conv_participants_conv_id ON conversation_participants(conversation_id)');
  await knex.schema.raw('CREATE INDEX idx_conv_participants_user_id ON conversation_participants(user_id)');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('conversation_participants');
};
