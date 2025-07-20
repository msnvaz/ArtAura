package com.artaura.artaura.service;

import com.artaura.artaura.dao.AdminUserDAO;
import com.artaura.artaura.dto.admin.AdminUserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class AdminUserService {

    @Autowired
    private AdminUserDAO adminUserDAO;

    public List<AdminUserDTO> getAllUsers() {
        return adminUserDAO.getAllUsers();
    }

    public List<AdminUserDTO> getFilteredUsers(Map<String, Object> filters) {
        return adminUserDAO.getFilteredUsers(filters);
    }

    public AdminUserDTO getUserById(Long userId, String userType) {
        return adminUserDAO.getUserById(userId, userType);
    }

    public boolean updateUserStatus(Long userId, String userType, String status) {
        return adminUserDAO.updateUserStatus(userId, userType, status);
    }

    public int getTotalUsersCount() {
        return adminUserDAO.getTotalUsersCount();
    }

    public int getTotalArtistsCount() {
        return adminUserDAO.getTotalArtistsCount();
    }

    public int getTotalBuyersCount() {
        return adminUserDAO.getTotalBuyersCount();
    }

    public int getTotalModeratorsCount() {
        return adminUserDAO.getTotalModeratorsCount();
    }

    public List<AdminUserDTO> getPaginatedUsers(int page, int pageSize) {
        return adminUserDAO.getPaginatedUsers(page, pageSize);
    }

    public List<AdminUserDTO> getPaginatedFilteredUsers(Map<String, Object> filters, int page, int pageSize) {
        return adminUserDAO.getPaginatedFilteredUsers(filters, page, pageSize);
    }

    public int getFilteredUsersCount(Map<String, Object> filters) {
        return adminUserDAO.getFilteredUsersCount(filters);
    }
}
