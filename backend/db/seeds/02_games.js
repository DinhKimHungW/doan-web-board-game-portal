/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex('achievements').del();
  await knex('games').del();

  await knex('games').insert([
    {
      id: '10000000-0000-4000-8000-000000000001',
      slug: 'tic-tac-toe',
      name: 'Tic Tac Toe',
      description: 'Classic 3x3 grid game. Get three in a row to win! Simple but endlessly fun.',
      type: 'strategy',
      default_rows: 3,
      default_cols: 3,
      default_time_limit: 300,
      is_enabled: true,
      config_json: {
        win_length: 3,
        players: 2,
        ai_difficulty_levels: ['easy', 'medium', 'hard'],
      },
    },
    {
      id: '10000000-0000-4000-8000-000000000002',
      slug: 'caro4',
      name: 'Caro 4 (Connect 4)',
      description: 'Connect 4 in a row on an 8x8 board. A step up from Tic Tac Toe!',
      type: 'strategy',
      default_rows: 8,
      default_cols: 8,
      default_time_limit: 600,
      is_enabled: true,
      config_json: {
        win_length: 4,
        players: 2,
        ai_difficulty_levels: ['easy', 'medium', 'hard'],
      },
    },
    {
      id: '10000000-0000-4000-8000-000000000003',
      slug: 'caro5',
      name: 'Caro 5 (Gomoku)',
      description: 'Get 5 in a row on a 12x12 board. The ultimate strategy challenge!',
      type: 'strategy',
      default_rows: 12,
      default_cols: 12,
      default_time_limit: 900,
      is_enabled: true,
      config_json: {
        win_length: 5,
        players: 2,
        ai_difficulty_levels: ['easy', 'medium', 'hard'],
      },
    },
    {
      id: '10000000-0000-4000-8000-000000000004',
      slug: 'snake',
      name: 'Snake',
      description: 'Classic snake game. Eat food, grow longer, avoid walls and yourself!',
      type: 'arcade',
      default_rows: 20,
      default_cols: 20,
      default_time_limit: null,
      is_enabled: true,
      config_json: {
        initial_speed: 150,
        speed_increase_per_food: 5,
        speed_min: 60,
      },
    },
    {
      id: '10000000-0000-4000-8000-000000000005',
      slug: 'match3',
      name: 'Match 3',
      description: 'Match 3 or more gems of the same color to score points. Beat the clock!',
      type: 'puzzle',
      default_rows: 8,
      default_cols: 8,
      default_time_limit: 180,
      is_enabled: true,
      config_json: {
        gem_types: 6,
        combo_multiplier: 1.5,
        min_match: 3,
      },
    },
    {
      id: '10000000-0000-4000-8000-000000000006',
      slug: 'memory',
      name: 'Memory Match',
      description: 'Flip cards and find matching pairs. Train your memory!',
      type: 'puzzle',
      default_rows: 6,
      default_cols: 6,
      default_time_limit: 120,
      is_enabled: true,
      config_json: {
        card_back: 'default',
        themes: ['animals', 'fruits', 'numbers', 'symbols'],
      },
    },
    {
      id: '10000000-0000-4000-8000-000000000007',
      slug: 'draw',
      name: 'Draw & Guess',
      description: 'Draw anything you want on the canvas. Express your creativity!',
      type: 'creative',
      default_rows: 20,
      default_cols: 20,
      default_time_limit: null,
      is_enabled: true,
      config_json: {
        canvas_width: 800,
        canvas_height: 600,
        tools: ['pen', 'eraser', 'fill', 'shapes'],
        colors: 32,
      },
    },
  ]);

  console.log('✅ Games seeded');
};
