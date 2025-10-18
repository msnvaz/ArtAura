package com.artaura.artaura.dao.Impl;

import com.artaura.artaura.dao.AdminSettingsDAO;
import com.artaura.artaura.dto.admin.AdminSettingsDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class AdminSettingsDAOImpl implements AdminSettingsDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static final RowMapper<AdminSettingsDTO> SETTINGS_ROW_MAPPER = new RowMapper<AdminSettingsDTO>() {
        @Override
        public AdminSettingsDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new AdminSettingsDTO(
                rs.getInt("setting_id"),
                rs.getString("setting_name"),
                rs.getString("setting_value")
            );
        }
    };

    @Override
    public List<AdminSettingsDTO> getAllSettings() {
        try {
            String sql = "SELECT setting_id, setting_name, setting_value FROM admin_settings ORDER BY setting_id";
            System.out.println("Executing SQL: " + sql);
            
            List<AdminSettingsDTO> settings = jdbcTemplate.query(sql, SETTINGS_ROW_MAPPER);
            System.out.println("Found " + settings.size() + " admin settings");
            
            return settings;
        } catch (Exception e) {
            System.err.println("Error fetching admin settings: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public AdminSettingsDTO getSettingById(Integer settingId) {
        try {
            String sql = "SELECT setting_id, setting_name, setting_value FROM admin_settings WHERE setting_id = ?";
            System.out.println("Executing SQL: " + sql + " with settingId: " + settingId);
            
            return jdbcTemplate.queryForObject(sql, SETTINGS_ROW_MAPPER, settingId);
        } catch (EmptyResultDataAccessException e) {
            System.out.println("No admin setting found with ID: " + settingId);
            return null;
        } catch (Exception e) {
            System.err.println("Error fetching admin setting by ID: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public boolean updateSetting(Integer settingId, String settingValue) {
        try {
            String sql = "UPDATE admin_settings SET setting_value = ? WHERE setting_id = ?";
            System.out.println("Executing SQL: " + sql + " with settingId: " + settingId + ", settingValue: " + settingValue);
            
            int rowsAffected = jdbcTemplate.update(sql, settingValue, settingId);
            System.out.println("Updated " + rowsAffected + " row(s)");
            
            return rowsAffected > 0;
        } catch (Exception e) {
            System.err.println("Error updating admin setting: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
}