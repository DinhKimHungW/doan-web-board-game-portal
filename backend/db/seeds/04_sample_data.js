/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // ── Friendships ──────────────────────────────────────────────────────────────
  await knex('friendships').insert([
    {
      id: '30000000-0000-4000-8000-000000000001',
      requester_id: '00000000-0000-4000-8000-000000000002', // Alice
      receiver_id: '00000000-0000-4000-8000-000000000003',  // Bob
      status: 'ACCEPTED',
    },
    {
      id: '30000000-0000-4000-8000-000000000002',
      requester_id: '00000000-0000-4000-8000-000000000002', // Alice
      receiver_id: '00000000-0000-4000-8000-000000000004',  // Carol
      status: 'ACCEPTED',
    },
    {
      id: '30000000-0000-4000-8000-000000000003',
      requester_id: '00000000-0000-4000-8000-000000000003', // Bob
      receiver_id: '00000000-0000-4000-8000-000000000005',  // David
      status: 'PENDING',
    },
    {
      id: '30000000-0000-4000-8000-000000000004',
      requester_id: '00000000-0000-4000-8000-000000000004', // Carol
      receiver_id: '00000000-0000-4000-8000-000000000005',  // David
      status: 'REJECTED',
    },
  ]);

  // ── Game Sessions ─────────────────────────────────────────────────────────
  await knex('game_sessions').insert([
    {
      id: '40000000-0000-4000-8000-000000000001',
      user_id: '00000000-0000-4000-8000-000000000002',
      game_id: '10000000-0000-4000-8000-000000000001',
      mode: 'vs_computer',
      status: 'FINISHED',
      score: 100,
      result: 'WIN',
      timer_setting: 300,
      elapsed_seconds: 45,
      board_rows: 3,
      board_cols: 3,
      current_state_json: { board: ['X','O','X','O','X','O','X',null,null], turn: 'X' },
      started_at: new Date('2024-01-15T10:00:00Z'),
      completed_at: new Date('2024-01-15T10:00:45Z'),
    },
    {
      id: '40000000-0000-4000-8000-000000000002',
      user_id: '00000000-0000-4000-8000-000000000002',
      game_id: '10000000-0000-4000-8000-000000000004',
      mode: 'solo',
      status: 'FINISHED',
      score: 250,
      result: 'WIN',
      timer_setting: null,
      elapsed_seconds: 120,
      board_rows: 20,
      board_cols: 20,
      current_state_json: { snake: [[10,10],[10,9],[10,8]], food: [15,15], direction: 'RIGHT' },
      started_at: new Date('2024-01-16T14:00:00Z'),
      completed_at: new Date('2024-01-16T14:02:00Z'),
    },
    {
      id: '40000000-0000-4000-8000-000000000003',
      user_id: '00000000-0000-4000-8000-000000000003',
      game_id: '10000000-0000-4000-8000-000000000001',
      mode: 'vs_computer',
      status: 'FINISHED',
      score: 0,
      result: 'LOSE',
      timer_setting: 300,
      elapsed_seconds: 90,
      board_rows: 3,
      board_cols: 3,
      current_state_json: { board: ['O','X','O','X','O','X','X','O','X'], turn: 'O' },
      started_at: new Date('2024-01-17T09:00:00Z'),
      completed_at: new Date('2024-01-17T09:01:30Z'),
    },
    {
      id: '40000000-0000-4000-8000-000000000004',
      user_id: '00000000-0000-4000-8000-000000000004',
      game_id: '10000000-0000-4000-8000-000000000004',
      mode: 'solo',
      status: 'FINISHED',
      score: 580,
      result: 'WIN',
      timer_setting: null,
      elapsed_seconds: 300,
      board_rows: 20,
      board_cols: 20,
      current_state_json: {},
      started_at: new Date('2024-01-18T11:00:00Z'),
      completed_at: new Date('2024-01-18T11:05:00Z'),
    },
    {
      id: '40000000-0000-4000-8000-000000000005',
      user_id: '00000000-0000-4000-8000-000000000005',
      game_id: '10000000-0000-4000-8000-000000000005',
      mode: 'solo',
      status: 'FINISHED',
      score: 1200,
      result: 'WIN',
      timer_setting: 180,
      elapsed_seconds: 165,
      board_rows: 8,
      board_cols: 8,
      current_state_json: {},
      started_at: new Date('2024-01-19T15:00:00Z'),
      completed_at: new Date('2024-01-19T15:02:45Z'),
    },
  ]);

  // ── User Game Stats ──────────────────────────────────────────────────────────
  await knex('user_game_stats').insert([
    {
      id: '50000000-0000-4000-8000-000000000001',
      user_id: '00000000-0000-4000-8000-000000000002',
      game_id: '10000000-0000-4000-8000-000000000001',
      total_plays: 5, wins: 4, losses: 1, draws: 0,
      best_score: 100, total_score: 450,
      best_time: 45,
      last_played_at: new Date('2024-01-15T10:00:45Z'),
    },
    {
      id: '50000000-0000-4000-8000-000000000002',
      user_id: '00000000-0000-4000-8000-000000000002',
      game_id: '10000000-0000-4000-8000-000000000004',
      total_plays: 3, wins: 2, losses: 1, draws: 0,
      best_score: 250, total_score: 600,
      best_time: null,
      last_played_at: new Date('2024-01-16T14:02:00Z'),
    },
    {
      id: '50000000-0000-4000-8000-000000000003',
      user_id: '00000000-0000-4000-8000-000000000003',
      game_id: '10000000-0000-4000-8000-000000000001',
      total_plays: 3, wins: 1, losses: 2, draws: 0,
      best_score: 100, total_score: 100,
      best_time: 90,
      last_played_at: new Date('2024-01-17T09:01:30Z'),
    },
    {
      id: '50000000-0000-4000-8000-000000000004',
      user_id: '00000000-0000-4000-8000-000000000004',
      game_id: '10000000-0000-4000-8000-000000000004',
      total_plays: 8, wins: 6, losses: 2, draws: 0,
      best_score: 580, total_score: 3200,
      best_time: null,
      last_played_at: new Date('2024-01-18T11:05:00Z'),
    },
    {
      id: '50000000-0000-4000-8000-000000000005',
      user_id: '00000000-0000-4000-8000-000000000005',
      game_id: '10000000-0000-4000-8000-000000000005',
      total_plays: 12, wins: 10, losses: 2, draws: 0,
      best_score: 1200, total_score: 9800,
      best_time: 165,
      last_played_at: new Date('2024-01-19T15:02:45Z'),
    },
  ]);

  // ── Game Reviews ─────────────────────────────────────────────────────────────
  await knex('game_reviews').insert([
    {
      id: '60000000-0000-4000-8000-000000000001',
      user_id: '00000000-0000-4000-8000-000000000002',
      game_id: '10000000-0000-4000-8000-000000000001',
      rating: 5,
      comment: 'Classic! Always fun to play. Great implementation.',
    },
    {
      id: '60000000-0000-4000-8000-000000000002',
      user_id: '00000000-0000-4000-8000-000000000003',
      game_id: '10000000-0000-4000-8000-000000000001',
      rating: 4,
      comment: 'Good game, AI is a bit too easy though.',
    },
    {
      id: '60000000-0000-4000-8000-000000000003',
      user_id: '00000000-0000-4000-8000-000000000004',
      game_id: '10000000-0000-4000-8000-000000000004',
      rating: 5,
      comment: 'Best snake game I\'ve played online! Very smooth.',
    },
    {
      id: '60000000-0000-4000-8000-000000000004',
      user_id: '00000000-0000-4000-8000-000000000005',
      game_id: '10000000-0000-4000-8000-000000000005',
      rating: 4,
      comment: 'Fun match 3! Could use more power-ups.',
    },
    {
      id: '60000000-0000-4000-8000-000000000005',
      user_id: '00000000-0000-4000-8000-000000000002',
      game_id: '10000000-0000-4000-8000-000000000004',
      rating: 5,
      comment: 'Addictive! Love the speed increase mechanic.',
    },
  ]);

  // ── Conversations ────────────────────────────────────────────────────────────
  await knex('conversations').insert([
    { id: '70000000-0000-4000-8000-000000000001', created_at: new Date('2024-01-20T10:00:00Z') },
    { id: '70000000-0000-4000-8000-000000000002', created_at: new Date('2024-01-21T12:00:00Z') },
  ]);

  await knex('conversation_participants').insert([
    {
      id: '71000000-0000-4000-8000-000000000001',
      conversation_id: '70000000-0000-4000-8000-000000000001',
      user_id: '00000000-0000-4000-8000-000000000002',
      joined_at: new Date('2024-01-20T10:00:00Z'),
    },
    {
      id: '71000000-0000-4000-8000-000000000002',
      conversation_id: '70000000-0000-4000-8000-000000000001',
      user_id: '00000000-0000-4000-8000-000000000003',
      joined_at: new Date('2024-01-20T10:00:00Z'),
    },
    {
      id: '71000000-0000-4000-8000-000000000003',
      conversation_id: '70000000-0000-4000-8000-000000000002',
      user_id: '00000000-0000-4000-8000-000000000002',
      joined_at: new Date('2024-01-21T12:00:00Z'),
    },
    {
      id: '71000000-0000-4000-8000-000000000004',
      conversation_id: '70000000-0000-4000-8000-000000000002',
      user_id: '00000000-0000-4000-8000-000000000004',
      joined_at: new Date('2024-01-21T12:00:00Z'),
    },
  ]);

  await knex('messages').insert([
    {
      id: '80000000-0000-4000-8000-000000000001',
      conversation_id: '70000000-0000-4000-8000-000000000001',
      sender_id: '00000000-0000-4000-8000-000000000002',
      content: 'Hey Bob! Want to play some Tic Tac Toe?',
      is_read: true,
      created_at: new Date('2024-01-20T10:05:00Z'),
    },
    {
      id: '80000000-0000-4000-8000-000000000002',
      conversation_id: '70000000-0000-4000-8000-000000000001',
      sender_id: '00000000-0000-4000-8000-000000000003',
      content: 'Sure Alice! Let me finish this snake game first.',
      is_read: true,
      created_at: new Date('2024-01-20T10:10:00Z'),
    },
    {
      id: '80000000-0000-4000-8000-000000000003',
      conversation_id: '70000000-0000-4000-8000-000000000001',
      sender_id: '00000000-0000-4000-8000-000000000002',
      content: 'No rush! I\'ll be here.',
      is_read: false,
      created_at: new Date('2024-01-20T10:11:00Z'),
    },
    {
      id: '80000000-0000-4000-8000-000000000004',
      conversation_id: '70000000-0000-4000-8000-000000000002',
      sender_id: '00000000-0000-4000-8000-000000000004',
      content: 'Hi Alice! Great score on Snake today!',
      is_read: false,
      created_at: new Date('2024-01-21T12:05:00Z'),
    },
  ]);

  // ── User Achievements ─────────────────────────────────────────────────────────
  await knex('user_achievements').insert([
    {
      id: 'a0000000-0000-4000-8000-000000000001',
      user_id: '00000000-0000-4000-8000-000000000002',
      achievement_id: '20000000-0000-4000-8000-000000000001',
      earned_at: new Date('2024-01-15T10:00:45Z'),
    },
    {
      id: 'a0000000-0000-4000-8000-000000000002',
      user_id: '00000000-0000-4000-8000-000000000002',
      achievement_id: '20000000-0000-4000-8000-000000000004',
      earned_at: new Date('2024-01-15T10:00:45Z'),
    },
    {
      id: 'a0000000-0000-4000-8000-000000000003',
      user_id: '00000000-0000-4000-8000-000000000002',
      achievement_id: '20000000-0000-4000-8000-000000000007',
      earned_at: new Date('2024-01-15T10:00:45Z'),
    },
    {
      id: 'a0000000-0000-4000-8000-000000000004',
      user_id: '00000000-0000-4000-8000-000000000004',
      achievement_id: '20000000-0000-4000-8000-000000000001',
      earned_at: new Date('2024-01-18T11:05:00Z'),
    },
    {
      id: 'a0000000-0000-4000-8000-000000000005',
      user_id: '00000000-0000-4000-8000-000000000004',
      achievement_id: '20000000-0000-4000-8000-000000000009',
      earned_at: new Date('2024-01-18T11:05:00Z'),
    },
    {
      id: 'a0000000-0000-4000-8000-000000000006',
      user_id: '00000000-0000-4000-8000-000000000005',
      achievement_id: '20000000-0000-4000-8000-000000000001',
      earned_at: new Date('2024-01-19T15:02:45Z'),
    },
    {
      id: 'a0000000-0000-4000-8000-000000000007',
      user_id: '00000000-0000-4000-8000-000000000005',
      achievement_id: '20000000-0000-4000-8000-000000000012',
      earned_at: new Date('2024-01-19T15:02:45Z'),
    },
  ]);

  console.log('✅ Sample data seeded');
};
