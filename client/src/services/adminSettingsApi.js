import axiosInstance from '../util/axiosInstance';

const BASE_URL = '/admin/settings';

class AdminSettingsApi {
  async getAllSettings() {
    try {
      const response = await axiosInstance.get(`${BASE_URL}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching admin settings:', error);
      // return fallback structure matching server response
      return { settings: [
        { settingId: 1, settingName: 'platform_fee', settingValue: '5' },
        { settingId: 2, settingName: 'bank_name', settingValue: 'BOC' },
        { settingId: 3, settingName: 'bank_account', settingValue: '880765' },
        { settingId: 4, settingName: 'bank_branch', settingValue: 'Colombo' },
        { settingId: 5, settingName: 'bank_account_name', settingValue: 'Artaura' }
      ] };
    }
  }

  async updateSetting(settingId, value) {
    try {
      const response = await axiosInstance.put(`${BASE_URL}/${settingId}`, { settingValue: value });
      return response.data;
    } catch (error) {
      console.error('Error updating admin setting:', error);
      throw error.response?.data || { success: false, error: 'Failed to update setting' };
    }
  }
}

export default new AdminSettingsApi();