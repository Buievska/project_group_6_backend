import { Tool } from "../models/tool.js";
import { User } from "../models/user.js";
import createHttpError from "http-errors";

export const getUserTools = async (req, res) => {
  try{
   const { userId } = req.params;
   const { page = 1, perPage = 10 } = req.query;
   const skip = (Number(page) -1) * Number(perPage);

   const user = await User.findById(userId);
   if (!user) {
    throw createHttpError(404, "User not found");
   }

   const toolsQuery = Tool.find({ owner: userId });

   const [totalItems, tools] = await Promise.all([
    toolsQuery.clone().countDocuments(),
    toolsQuery
    .skip(skip)
    .limit(Number(perPage))
    .populate('category', 'name')
    .populate('feedbacks')
    .sort({ createdAt: -1 })
   ]);

   const totalPages = Math.ceil(totalItems / Number(perPage));

   res.status(200).json({
    page: Number(page),
    perPage: Number(perPage),
    totalItems,
    totalPages,
    tools
   });
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.message || "Internal server error"
    });
  }
};
