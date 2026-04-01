/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('games', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('slug', 100).unique().notNullable();
    table.string('name', 200).notNullable();
    table.text('description').nullable();
    table.string('type', 50).notNullable(); // 'strategy', 'puzzle', 'arcade', 'creative'
    table.integer('default_rows').nullable();
    table.integer('default_cols').nullable();
    table.integer('default_time_limit').nullable(); // seconds, null = unlimited
    table.boolean('is_enabled').notNullable().defaultTo(true);
    table.jsonb('config_json').nullable();
    table.timestamps(true, true);
  });

  await knex.schema.raw('CREATE INDEX idx_games_slug ON games(slug)');
  await knex.schema.raw('CREATE INDEX idx_games_is_enabled ON games(is_enabled)');
  await knex.schema.raw('CREATE INDEX idx_games_type ON games(type)');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('games');
};
