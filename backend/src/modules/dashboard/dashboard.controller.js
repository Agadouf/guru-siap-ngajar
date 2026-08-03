import * as dashboardService from "./dashboard.service.js";

export const getDashboardStats = async (req, res) => {
  try {
    const stats = await dashboardService.getDashboardStats();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};