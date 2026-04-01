const db = require('./index');

const TABLE = 'friendships';

const friendUserFields = (alias) => [
  `${alias}.id`,
  `${alias}.name`,
  `${alias}.email`,
  `${alias}.avatar_url`,
  `${alias}.bio`,
];

/**
 * Get all accepted friends for a user.
 * @param {string} userId
 */
async function listFriends(userId) {
  // Friends can be requester or receiver
  const asRequester = await db(TABLE)
    .where({ requester_id: userId, status: 'ACCEPTED' })
    .join('users as u', 'friendships.receiver_id', 'u.id')
    .select([
      'friendships.id as friendship_id',
      'friendships.created_at as friendship_created_at',
      'u.id',
      'u.name',
      'u.email',
      'u.avatar_url',
      'u.bio',
    ]);

  const asReceiver = await db(TABLE)
    .where({ receiver_id: userId, status: 'ACCEPTED' })
    .join('users as u', 'friendships.requester_id', 'u.id')
    .select([
      'friendships.id as friendship_id',
      'friendships.created_at as friendship_created_at',
      'u.id',
      'u.name',
      'u.email',
      'u.avatar_url',
      'u.bio',
    ]);

  return [...asRequester, ...asReceiver];
}

/**
 * List pending friend requests (sent or received) for a user.
 * @param {string} userId
 */
async function listPendingRequests(userId) {
  const sent = await db(TABLE)
    .where({ requester_id: userId, status: 'PENDING' })
    .join('users as u', 'friendships.receiver_id', 'u.id')
    .select([
      'friendships.*',
      'u.id as other_user_id',
      'u.name as other_user_name',
      'u.email as other_user_email',
      'u.avatar_url as other_user_avatar',
      db.raw("'sent' AS direction"),
    ]);

  const received = await db(TABLE)
    .where({ receiver_id: userId, status: 'PENDING' })
    .join('users as u', 'friendships.requester_id', 'u.id')
    .select([
      'friendships.*',
      'u.id as other_user_id',
      'u.name as other_user_name',
      'u.email as other_user_email',
      'u.avatar_url as other_user_avatar',
      db.raw("'received' AS direction"),
    ]);

  return [...sent, ...received];
}

/**
 * Find a friendship by ID.
 * @param {string} id
 */
async function findById(id) {
  return db(TABLE).where({ id }).first();
}

/**
 * Find a friendship between two users (either direction).
 * @param {string} userA
 * @param {string} userB
 */
async function findBetween(userA, userB) {
  return db(TABLE)
    .where(function () {
      this.where({ requester_id: userA, receiver_id: userB })
        .orWhere({ requester_id: userB, receiver_id: userA });
    })
    .first();
}

/**
 * Create a friend request.
 * @param {{ requester_id: string, receiver_id: string }} data
 */
async function create(data) {
  const [friendship] = await db(TABLE).insert(data).returning('*');
  return friendship;
}

/**
 * Update a friendship status.
 * @param {string} id
 * @param {'ACCEPTED'|'REJECTED'} status
 */
async function updateStatus(id, status) {
  const [friendship] = await db(TABLE)
    .where({ id })
    .update({ status, updated_at: db.fn.now() })
    .returning('*');
  return friendship;
}

/**
 * Delete a friendship (unfriend).
 * @param {string} id
 */
async function remove(id) {
  return db(TABLE).where({ id }).del();
}

/**
 * Count accepted friends for a user.
 * @param {string} userId
 */
async function countFriends(userId) {
  const [{ count }] = await db(TABLE)
    .where(function () {
      this.where({ requester_id: userId, status: 'ACCEPTED' })
        .orWhere({ receiver_id: userId, status: 'ACCEPTED' });
    })
    .count('id as count');
  return parseInt(count, 10);
}

/**
 * Check if two users are friends.
 * @param {string} userA
 * @param {string} userB
 */
async function areFriends(userA, userB) {
  const friendship = await db(TABLE)
    .where({ status: 'ACCEPTED' })
    .where(function () {
      this.where({ requester_id: userA, receiver_id: userB })
        .orWhere({ requester_id: userB, receiver_id: userA });
    })
    .first();
  return !!friendship;
}

/**
 * Get friend IDs for a user.
 * @param {string} userId
 */
async function getFriendIds(userId) {
  const friends = await db(TABLE)
    .where({ status: 'ACCEPTED' })
    .where(function () {
      this.where({ requester_id: userId }).orWhere({ receiver_id: userId });
    })
    .select(['requester_id', 'receiver_id']);

  return friends.map((f) =>
    f.requester_id === userId ? f.receiver_id : f.requester_id
  );
}

module.exports = {
  TABLE,
  listFriends,
  listPendingRequests,
  findById,
  findBetween,
  create,
  updateStatus,
  remove,
  countFriends,
  areFriends,
  getFriendIds,
};
