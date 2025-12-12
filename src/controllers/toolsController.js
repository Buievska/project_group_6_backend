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

export const createTool = async (req, res, next) => {
  try {
    const {
      name,
      pricePerDay,
      categoryId,
      description,
      rentalTerms,
      specifications,
    } = req.body;

    const imageUrl = req.file ? `uploads/${req.file.originalname}` : null;

    const newTool = await Tool.create({
      owner: req.user._id,
      category: categoryId,
      name,
      pricePerDay,
      description,
      rentalTerms,
      specifications,
      images: imageUrl,
    });

    res.status(201).json(newTool);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getTools = async (req, res) => {
  try {
    const tools = await Tool.find()
      .populate('category')
      .populate('feedbacks')
      .populate('owner'); // тут можна populate owner, бо ми хочемо бачити автора

    res.json(tools);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
