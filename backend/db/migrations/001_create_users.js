/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // Create custom enum type for user roles
  await knex.raw(`CREATE TYPE user_role AS ENUM ('USER', 'ADMIN')`);

  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name', 100).notNullable();
    table.string('email', 255).unique().notNullable();
    table.string('password_hash', 255).notNullable();
    table.specificType('role', 'user_role').notNullable().defaultTo('USER');
    table.string('avatar_url', 500).nullable();
    table.text('bio').nullable();
    table.boolean('is_active').notNullable().defaultTo(true);
    table.string('theme_preference', 20).notNullable().defaultTo('light');
    table.timestamps(true, true);
  });

  // Index for email lookups
  await knex.schema.raw('CREATE INDEX idx_users_email ON users(email)');
  await knex.schema.raw('CREATE INDEX idx_users_role ON users(role)');
  await knex.schema.raw('CREATE INDEX idx_users_is_active ON users(is_active)');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('users');
  await knex.raw('DROP TYPE IF EXISTS user_role');
};
