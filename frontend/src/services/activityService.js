import api from './api';

export const activityService = {
  getRecentActivity: () => {
    return api.get('/activity/recent');
  },

  getAllActivity: (page = 0, size = 50) => {
    return api.get(`/activity/all?page=${page}&size=${size}`);
  }
};
