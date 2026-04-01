/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('user_game_stats', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('game_id').notNullable().references('id').inTable('games').onDelete('CASCADE');
    table.integer('total_plays').notNullable().defaultTo(0);
    table.integer('wins').notNullable().defaultTo(0);
    table.integer('losses').notNullable().defaultTo(0);
    table.integer('draws').notNullable().defaultTo(0);
    table.integer('best_score').notNullable().defaultTo(0);
    table.integer('total_score').notNullable().defaultTo(0);
    table.integer('best_time').nullable(); // seconds, null = never completed
    table.timestamp('last_played_at').nullable();
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

    table.unique(['user_id', 'game_id']);
  });

  await knex.schema.raw('CREATE INDEX idx_user_game_stats_user_id ON user_game_stats(user_id)');
  await knex.schema.raw('CREATE INDEX idx_user_game_stats_game_id ON user_game_stats(game_id)');
  await knex.schema.raw('CREATE INDEX idx_user_game_stats_best_score ON user_game_stats(best_score DESC)');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('user_game_stats');
};
