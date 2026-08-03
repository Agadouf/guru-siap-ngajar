import * as moduleService from "./module.service.js";

export const getAllModules = async (req, res) => {
  try {
    const modules = await moduleService.getAllModules();

    res.status(200).json({
      success: true,
      message: "Modules retrieved successfully.",
      data: modules,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getModuleById = async (req, res) => {
  try {
    const module = await moduleService.getModuleById(req.params.id);

    res.status(200).json({
      success: true,
      message: "Module retrieved successfully.",
      data: module,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const createModule = async (req, res) => {
  try {
    const module = await moduleService.createModule(req.body);

    res.status(201).json({
      success: true,
      message: "Module created successfully.",
      data: module,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateModule = async (req, res) => {
  try {
    const module = await moduleService.updateModule(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Module updated successfully.",
      data: module,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteModule = async (req, res) => {
  try {
    await moduleService.deleteModule(req.params.id);

    res.status(200).json({
      success: true,
      message: "Module deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};