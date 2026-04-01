/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('user_achievements', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('achievement_id').notNullable().references('id').inTable('achievements').onDelete('CASCADE');
    table.timestamp('earned_at').notNullable().defaultTo(knex.fn.now());

    table.unique(['user_id', 'achievement_id']);
  });

  await knex.schema.raw('CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id)');
  await knex.schema.raw('CREATE INDEX idx_user_achievements_achievement_id ON user_achievements(achievement_id)');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('user_achievements');
};
