import { getTools as getToolsService } from '../services/toolsService.js';
import { Tool } from '../models/tool.js';

export const getAllToolsController = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const category = req.query.category || null;
    const search = req.query.search || null;

    const data = await getToolsService({ page, limit, category, search });

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

export const getToolById = async (req, res, next) => {
  try {
    const { toolId } = req.params;
    const tool = await Tool.findById(toolId);

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
      .populate('owner');

    res.json(tools);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateTool = async (req, res, next) => {
  try {
    const { toolId } = req.params;

    const tool = await Tool.findById(toolId);
    if (!tool) {
      return res.status(404).json({ message: 'Tool not found' });
    }

    if (tool.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: not the owner' });
    }

    const {
      name,
      pricePerDay,
      categoryId,
      description,
      rentalTerms,
      specifications,
    } = req.body;

    const imageUrl = req.file
      ? `uploads/${req.file.originalname}`
      : tool.images;

    tool.name = name ?? tool.name;
    tool.pricePerDay = pricePerDay ?? tool.pricePerDay;
    tool.category = categoryId ?? tool.category;
    tool.description = description ?? tool.description;
    tool.rentalTerms = rentalTerms ?? tool.rentalTerms;
    tool.specifications = specifications ?? tool.specifications;
    tool.images = imageUrl;

    const updatedTool = await tool.save();

    res.status(200).json(updatedTool);
  } catch (error) {
    next(error);
  }
};
