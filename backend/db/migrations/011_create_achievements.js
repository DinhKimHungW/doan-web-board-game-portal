/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('achievements', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('code', 100).unique().notNullable();
    table.string('name', 200).notNullable();
    table.text('description').notNullable();
    table.uuid('game_id').nullable().references('id').inTable('games').onDelete('SET NULL');
    table.jsonb('condition_json').notNullable(); // e.g. { "type": "wins", "value": 10 }
    table.string('icon', 500).nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.raw('CREATE INDEX idx_achievements_code ON achievements(code)');
  await knex.schema.raw('CREATE INDEX idx_achievements_game_id ON achievements(game_id)');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('achievements');
};
