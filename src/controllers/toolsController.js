import { Tool } from '../models/tool.js';

export const getToolById = async (req, res, next) => {
  try {
    const { toolId } = req.params;
    const tool = await Tool.findById(toolId);
    // .populate('owner', 'name email avatar')
    // .populate('category', 'name');
    if (!tool) {
      return res.status(404).json({ message: 'Tool not found' });
    }
    res.status(200).json(tool);
  } catch (error) {
    next(error);
  }
};
