/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex('achievements').del();

  await knex('achievements').insert([
    // Global achievements
    {
      id: '20000000-0000-4000-8000-000000000001',
      code: 'FIRST_GAME',
      name: 'First Steps',
      description: 'Play your first game on the portal.',
      game_id: null,
      condition_json: { type: 'total_plays', value: 1 },
      icon: '🎮',
    },
    {
      id: '20000000-0000-4000-8000-000000000002',
      code: 'PLAY_10',
      name: 'Getting Warmed Up',
      description: 'Play 10 games total.',
      game_id: null,
      condition_json: { type: 'total_plays', value: 10 },
      icon: '🔥',
    },
    {
      id: '20000000-0000-4000-8000-000000000003',
      code: 'PLAY_50',
      name: 'Dedicated Player',
      description: 'Play 50 games total.',
      game_id: null,
      condition_json: { type: 'total_plays', value: 50 },
      icon: '⭐',
    },
    {
      id: '20000000-0000-4000-8000-000000000004',
      code: 'FIRST_WIN',
      name: 'First Victory',
      description: 'Win your first game.',
      game_id: null,
      condition_json: { type: 'total_wins', value: 1 },
      icon: '🏆',
    },
    {
      id: '20000000-0000-4000-8000-000000000005',
      code: 'WIN_10',
      name: 'Rising Champion',
      description: 'Win 10 games total.',
      game_id: null,
      condition_json: { type: 'total_wins', value: 10 },
      icon: '🥇',
    },
    {
      id: '20000000-0000-4000-8000-000000000006',
      code: 'WIN_50',
      name: 'Champion',
      description: 'Win 50 games total.',
      game_id: null,
      condition_json: { type: 'total_wins', value: 50 },
      icon: '👑',
    },
    // Tic-Tac-Toe achievements
    {
      id: '20000000-0000-4000-8000-000000000007',
      code: 'TTT_FIRST_WIN',
      name: 'Tic Tac Toe Champion',
      description: 'Win your first Tic Tac Toe game.',
      game_id: '10000000-0000-4000-8000-000000000001',
      condition_json: { type: 'game_wins', value: 1 },
      icon: '⭕',
    },
    {
      id: '20000000-0000-4000-8000-000000000008',
      code: 'TTT_WIN_10',
      name: 'Tic Tac Toe Master',
      description: 'Win 10 Tic Tac Toe games.',
      game_id: '10000000-0000-4000-8000-000000000001',
      condition_json: { type: 'game_wins', value: 10 },
      icon: '❌',
    },
    // Snake achievements
    {
      id: '20000000-0000-4000-8000-000000000009',
      code: 'SNAKE_SCORE_100',
      name: 'Snake Charmer',
      description: 'Score 100 points in Snake.',
      game_id: '10000000-0000-4000-8000-000000000004',
      condition_json: { type: 'best_score', value: 100 },
      icon: '🐍',
    },
    {
      id: '20000000-0000-4000-8000-000000000010',
      code: 'SNAKE_SCORE_500',
      name: 'Snake Legend',
      description: 'Score 500 points in Snake.',
      game_id: '10000000-0000-4000-8000-000000000004',
      condition_json: { type: 'best_score', value: 500 },
      icon: '🐉',
    },
    // Memory achievements
    {
      id: '20000000-0000-4000-8000-000000000011',
      code: 'MEMORY_PERFECT',
      name: 'Perfect Memory',
      description: 'Complete Memory Match without any mistakes.',
      game_id: '10000000-0000-4000-8000-000000000006',
      condition_json: { type: 'perfect_game', value: 1 },
      icon: '🧠',
    },
    // Match3 achievements
    {
      id: '20000000-0000-4000-8000-000000000012',
      code: 'MATCH3_SCORE_1000',
      name: 'Gem Collector',
      description: 'Score 1000 points in Match 3.',
      game_id: '10000000-0000-4000-8000-000000000005',
      condition_json: { type: 'best_score', value: 1000 },
      icon: '💎',
    },
    // Social achievements
    {
      id: '20000000-0000-4000-8000-000000000013',
      code: 'SOCIAL_BUTTERFLY',
      name: 'Social Butterfly',
      description: 'Make your first friend on the portal.',
      game_id: null,
      condition_json: { type: 'friend_count', value: 1 },
      icon: '🦋',
    },
  ]);

  console.log('✅ Achievements seeded');
};
