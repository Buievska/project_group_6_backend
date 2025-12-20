import { getTools as getToolsService } from '../services/toolsService.js';
import { Tool } from '../models/tool.js';

import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';
import createHttpError from 'http-errors';

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
    const tool = await Tool.findById(toolId).populate('category owner');

    if (!tool) {
      throw createHttpError(404, 'Tool not found');
    }

    res.status(200).json(tool);
  } catch (error) {
    next(error);
  }
};

export const createTool = async (req, res, next) => {
  try {
    if (!req.file) {
      throw createHttpError(400, "Фото інструменту є обов'язковим");
    }

    const imageUrl = await uploadToCloudinary(req.file.buffer);

    const newTool = await Tool.create({
      ...req.body,
      category: req.body.categoryId,
      images: imageUrl,
      owner: req.user._id,
    });

    res.status(201).json(newTool);
  } catch (err) {
    next(err);
  }
};

export const getTools = async (req, res, next) => {
  try {
    const tools = await Tool.find()
      .populate('category')
      .populate('feedbacks')
      .populate('owner');

    res.json(tools);
  } catch (err) {
    next(err);
  }
};

export const updateTool = async (req, res, next) => {
  try {
    const { toolId } = req.params;

    const tool = await Tool.findById(toolId);
    if (!tool) {
      throw createHttpError(404, 'Tool not found');
    }

    if (tool.owner.toString() !== req.user._id.toString()) {
      throw createHttpError(403, 'Forbidden: not the owner');
    }

    let imageUrl = tool.images;

    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const updatedTool = await Tool.findByIdAndUpdate(
      toolId,
      {
        ...req.body,
        category: req.body.categoryId || tool.category,
        images: imageUrl,
      },
      { new: true, runValidators: true },
    );

    res.status(200).json(updatedTool);
  } catch (error) {
    next(error);
  }
};

export const deleteTool = async (req, res, next) => {
  try {
    const { toolId } = req.params;

    const toolCheck = await Tool.findById(toolId);
    if (!toolCheck) throw createHttpError(404, 'Tool not found');

    if (toolCheck.owner.toString() !== req.user._id.toString()) {
      throw createHttpError(403, 'You can only delete your own tools');
    }

    await Tool.findByIdAndDelete(toolId);

    res.status(200).json({ message: 'Tool deleted successfully' });
  } catch (error) {
    next(error);
  }
};
