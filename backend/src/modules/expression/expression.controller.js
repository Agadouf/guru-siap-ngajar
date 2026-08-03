import * as expressionService from "./expression.service.js";

export const getAllExpressions = async (req, res) => {
  try {
    const expressions = await expressionService.getAllExpressions();

    res.json({
      success: true,
      message: "Expressions retrieved successfully.",
      data: expressions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getExpressionById = async (req, res) => {
  try {
    const expression = await expressionService.getExpressionById(req.params.id);

    res.json({
      success: true,
      message: "Expression retrieved successfully.",
      data: expression,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const createExpression = async (req, res) => {
  try {
    const expression = await expressionService.createExpression(req.body);

    res.status(201).json({
      success: true,
      message: "Expression created successfully.",
      data: expression,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateExpression = async (req, res) => {
  try {
    const expression = await expressionService.updateExpression(
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      message: "Expression updated successfully.",
      data: expression,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteExpression = async (req, res) => {
  try {
    await expressionService.deleteExpression(req.params.id);

    res.json({
      success: true,
      message: "Expression deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};