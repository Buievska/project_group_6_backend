import { getTools } from '../services/toolsService.js';

export const getAllToolsController = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const category = req.query.category || null;
    const search = req.query.search || null;

    const data = await getTools({ page, limit, category, search });

    res.json({
      status: 'success',
      code: 200,
      message: 'Tools fetched successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};
