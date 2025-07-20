package com.artaura.artaura.dao;

import com.artaura.artaura.dto.admin.AdminUserDTO;
import java.util.List;
import java.util.Map;

public interface AdminUserDAO {
    List<AdminUserDTO> getAllUsers();
    List<AdminUserDTO> getFilteredUsers(Map<String, Object> filters);
    AdminUserDTO getUserById(Long userId, String userType);
    boolean updateUserStatus(Long userId, String userType, String status);
    int getTotalUsersCount();
    int getTotalArtistsCount();
    int getTotalBuyersCount();
    int getTotalModeratorsCount();
    List<AdminUserDTO> getPaginatedUsers(int page, int pageSize);
    List<AdminUserDTO> getPaginatedFilteredUsers(Map<String, Object> filters, int page, int pageSize);
    int getFilteredUsersCount(Map<String, Object> filters);
}
