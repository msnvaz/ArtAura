package com.artaura.artaura.controller;

import com.artaura.artaura.dto.admin.AdminUserDTO;
import com.artaura.artaura.dto.ResponseDTO;
import com.artaura.artaura.service.AdminUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminUserController {

    @Autowired
    private AdminUserService adminUserService;

    /**
     * Get all users with pagination and filtering
     * GET /api/admin/users?page=0&size=10&status=Active&userType=artist&search=abc
     */
    @GetMapping
    public ResponseEntity<ResponseDTO<AdminUserDTO>> getAllUsers(
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            @RequestParam(value = "size", defaultValue = "10") Integer size,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "userType", required = false) String userType,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "specialization", required = false) String specialization
    ) {
        try {
            Map<String, Object> filters = new HashMap<>();
            if (status != null && !status.isEmpty()) filters.put("status", status);
            if (userType != null && !userType.isEmpty()) filters.put("userType", userType);
            if (search != null && !search.isEmpty()) filters.put("search", search);
            if (specialization != null && !specialization.isEmpty()) filters.put("specialization", specialization);

            List<AdminUserDTO> users = adminUserService.getAllUsers();
            int totalElements = adminUserService.getTotalUsersCount();
            int totalPages = (int) Math.ceil((double) totalElements / size);

            ResponseDTO<AdminUserDTO> response = new ResponseDTO<>();
            response.setContent(users);
            response.setCurrentPage(page);
            response.setTotalPages(totalPages);
            response.setTotalElements((long) totalElements);
            response.setPageSize(size);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Update user status
     * PUT /api/admin/users/{id}/status
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateUserStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request
    ) {
        try {
            String userType = (String) request.get("userType");
            String status = (String) request.get("status");
            if (userType == null || status == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "userType and status are required");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            boolean updated = adminUserService.updateUserStatus(id, userType, status);
            Map<String, Object> response = new HashMap<>();
            response.put("success", updated);
            response.put("message", updated ? "Status updated successfully" : "Failed to update status");
            return updated ? ResponseEntity.ok(response) : ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Internal server error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // ...other endpoints as needed...
}
