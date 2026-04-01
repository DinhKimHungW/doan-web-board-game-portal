const bcrypt = require('bcryptjs');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Clean up in reverse FK order
  await knex('user_achievements').del();
  await knex('user_game_stats').del();
  await knex('game_saves').del();
  await knex('game_sessions').del();
  await knex('game_reviews').del();
  await knex('messages').del();
  await knex('conversation_participants').del();
  await knex('conversations').del();
  await knex('friendships').del();
  await knex('refresh_tokens').del();
  await knex('users').del();

  const rounds = parseInt(process.env.BCRYPT_ROUNDS || '12', 10);
  const adminHash = await bcrypt.hash('Admin@123456', rounds);
  const userHash = await bcrypt.hash('User@123456', rounds);

  await knex('users').insert([
    {
      id: '00000000-0000-4000-8000-000000000001',
      name: 'Administrator',
      email: 'admin@example.com',
      password_hash: adminHash,
      role: 'ADMIN',
      avatar_url: null,
      bio: 'Board Game Portal Administrator',
      is_active: true,
      theme_preference: 'dark',
    },
    {
      id: '00000000-0000-4000-8000-000000000002',
      name: 'Alice Johnson',
      email: 'user1@example.com',
      password_hash: userHash,
      role: 'USER',
      avatar_url: null,
      bio: 'Love strategy games!',
      is_active: true,
      theme_preference: 'light',
    },
    {
      id: '00000000-0000-4000-8000-000000000003',
      name: 'Bob Smith',
      email: 'user2@example.com',
      password_hash: userHash,
      role: 'USER',
      avatar_url: null,
      bio: 'Puzzle enthusiast',
      is_active: true,
      theme_preference: 'light',
    },
    {
      id: '00000000-0000-4000-8000-000000000004',
      name: 'Carol White',
      email: 'user3@example.com',
      password_hash: userHash,
      role: 'USER',
      avatar_url: null,
      bio: 'Casual gamer',
      is_active: true,
      theme_preference: 'dark',
    },
    {
      id: '00000000-0000-4000-8000-000000000005',
      name: 'David Brown',
      email: 'user4@example.com',
      password_hash: userHash,
      role: 'USER',
      avatar_url: null,
      bio: null,
      is_active: true,
      theme_preference: 'light',
    },
    {
      id: '00000000-0000-4000-8000-000000000006',
      name: 'Eva Martinez',
      email: 'user5@example.com',
      password_hash: userHash,
      role: 'USER',
      avatar_url: null,
      bio: 'Competitive player',
      is_active: false, // inactive for testing
      theme_preference: 'light',
    },
  ]);

  console.log('✅ Users seeded');
};
