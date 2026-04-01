/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.raw(`CREATE TYPE session_status AS ENUM ('IN_PROGRESS', 'SAVED', 'FINISHED', 'ABANDONED')`);

  await knex.schema.createTable('game_sessions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('game_id').notNullable().references('id').inTable('games').onDelete('CASCADE');
    table.string('mode', 50).notNullable().defaultTo('solo'); // 'vs_computer', 'solo'
    table.specificType('status', 'session_status').notNullable().defaultTo('IN_PROGRESS');
    table.integer('score').notNullable().defaultTo(0);
    table.string('result', 10).nullable(); // 'WIN', 'LOSE', 'DRAW'
    table.integer('timer_setting').nullable(); // seconds, null = unlimited
    table.integer('elapsed_seconds').notNullable().defaultTo(0);
    table.integer('board_rows').nullable();
    table.integer('board_cols').nullable();
    table.jsonb('current_state_json').nullable();
    table.timestamp('started_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('saved_at').nullable();
    table.timestamp('completed_at').nullable();
    table.timestamps(true, true);
  });

  await knex.schema.raw('CREATE INDEX idx_game_sessions_user_id ON game_sessions(user_id)');
  await knex.schema.raw('CREATE INDEX idx_game_sessions_game_id ON game_sessions(game_id)');
  await knex.schema.raw('CREATE INDEX idx_game_sessions_status ON game_sessions(status)');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('game_sessions');
  await knex.raw('DROP TYPE IF EXISTS session_status');
};
