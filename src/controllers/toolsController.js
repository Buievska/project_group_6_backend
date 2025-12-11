import { Tool } from '../models/tool.js';

export const createTool = async (req, res) => {
  try {
    const newTool = await Tool.create({
      ...req.body,
      owner: req.user.id // автоматично ставимо автора оголошення
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
