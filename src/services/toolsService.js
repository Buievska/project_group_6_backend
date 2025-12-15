import { Tool } from '../models/tool.js';

export const getTools = async ({ page, limit, category, search }) => {
  const skip = (page - 1) * limit;

  const filter = {};

  // Фільтрація за категоріями (масив ID)
  if (category) {
    const categoriesArr = category.split(',');
    filter.category = { $in: categoriesArr };
  }

  // Пошук за назвою (некейс-сенситив)
  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }

  const total = await Tool.countDocuments(filter);

  const tools = await Tool.find(filter).skip(skip).limit(limit);

  return {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
    tools,
  };
};
