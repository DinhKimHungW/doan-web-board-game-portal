/**
 * Tiện ích phân trang
 * Tính toán offset và limit từ page number
 */

const getPaginationParams = (page = 1, limit = 10) => {
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 10));
  const offset = (pageNum - 1) * limitNum;
  return { offset, limit: limitNum, page: pageNum };
};

const getPaginationMeta = (total, limit, page) => {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

module.exports = {
  getPaginationParams,
  getPaginationMeta,
};
