/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('game_reviews', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('game_id').notNullable().references('id').inTable('games').onDelete('CASCADE');
    table.integer('rating').notNullable(); // 1-5
    table.text('comment').nullable();
    table.timestamps(true, true);

    table.unique(['user_id', 'game_id']);
  });

  await knex.schema.raw('CREATE INDEX idx_game_reviews_game_id ON game_reviews(game_id)');
  await knex.schema.raw('CREATE INDEX idx_game_reviews_user_id ON game_reviews(user_id)');

  // Ensure rating is within 1-5
  await knex.raw('ALTER TABLE game_reviews ADD CONSTRAINT rating_range CHECK (rating >= 1 AND rating <= 5)');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('game_reviews');
};
