package com.artaura.artaura.service;

import com.artaura.artaura.dao.*;
import com.artaura.artaura.dto.auth.LoginRequest;
import com.artaura.artaura.dto.auth.LoginResponse;
import com.artaura.artaura.dto.auth.LoginUserDataDTO;
import com.artaura.artaura.util.JwtUtil;
import com.artaura.artaura.util.PasswordEncoderUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired private ArtistDAO artistDAO;
    @Autowired private BuyerDAO buyerDAO;
    @Autowired private ShopOwnerDAO shopDAO;
    @Autowired private ModeratorDAO moderatorDAO;
    @Autowired private AdminDAO adminDAO;
    @Autowired
    private PasswordEncoderUtil encoder;
    @Autowired
    private JwtUtil jwtUtil;

    public LoginResponse login(LoginRequest request) {
        var email = request.getEmail();
        var password = request.getPassword();
        
        System.out.println("🔍 AuthService: Processing login for email: " + email);

        Optional<LoginUserDataDTO> user; //user might have a LoginUserDataDTO object, or it might be empty

        // Check artist
        user = artistDAO.findByEmail(email);
        if (user.isPresent() && encoder.matches(password, user.get().getPassword())) {
            String status = getUserStatus("artists", "artist_id", user.get().getUserId());
            if ("Suspended".equalsIgnoreCase(status)) {
                throw new RuntimeException("Your account is suspended.");
            }
            String token = jwtUtil.generateToken(user.get().getUserId(), "artist");
            System.out.println("✅ Login successful for artist. Token generated: " + token.substring(0, 20) + "...");
            return new LoginResponse(token, "artist", user.get().getUserId());
        }

        // Check buyer
        user = buyerDAO.findByEmail(email);
        if (user.isPresent() && encoder.matches(password, user.get().getPassword())) {
            String status = getUserStatus("buyers", "buyer_id", user.get().getUserId());
            if ("Suspended".equalsIgnoreCase(status)) {
                throw new RuntimeException("Your account is suspended. Please contact support.");
            }
            String token = jwtUtil.generateToken(user.get().getUserId(), "buyer");
            System.out.println("✅ Login successful for buyer. Token generated: " + token.substring(0, 20) + "...");
            return new LoginResponse(token, "buyer", user.get().getUserId());
        }

        // Check shop owner
        user = shopDAO.findByEmail(email);
        if (user.isPresent() && encoder.matches(password, user.get().getPassword())) {
            String status = getUserStatus("shops", "shop_id", user.get().getUserId());
            if ("Suspended".equalsIgnoreCase(status)) {
                throw new RuntimeException("Your account is suspended. Please contact support.");
            }
            String token = jwtUtil.generateToken(user.get().getUserId(), "shop");
            System.out.println("✅ Login successful for shop owner. Token generated: " + token.substring(0, 20) + "...");
            return new LoginResponse(token, "shop", user.get().getUserId());
        }

        // Check moderator
        user = moderatorDAO.findByEmail(email);
        if (user.isPresent() && encoder.matches(password, user.get().getPassword())) {
            String status = getUserStatus("moderators", "moderator_id", user.get().getUserId());
            if ("Suspended".equalsIgnoreCase(status)) {
                throw new RuntimeException("Your account is suspended. Please contact support.");
            }
            String token = jwtUtil.generateToken(user.get().getUserId(), "moderator");
            System.out.println("✅ Login successful for moderator. Token generated: " + token.substring(0, 20) + "...");
            return new LoginResponse(token, "moderator", user.get().getUserId());
        }

        // Check admin (no status restriction)
        user = adminDAO.findByEmail(email);
        if (user.isPresent() && encoder.matches(password, user.get().getPassword())) {
            String token = jwtUtil.generateToken(user.get().getUserId(), "admin");
            System.out.println("✅ Login successful for admin. Token generated: " + token.substring(0, 20) + "...");
            return new LoginResponse(token, "admin", user.get().getUserId());
        }

        throw new RuntimeException("Invalid credentials");
    }

    // Helper method to get status from DB
    private String getUserStatus(String table, String idColumn, Long userId) {
        try {
            String sql = "SELECT status FROM " + table + " WHERE " + idColumn + " = ?";
            return artistDAO instanceof com.artaura.artaura.dao.Impl.ArtistDAOImpl
                ? ((com.artaura.artaura.dao.Impl.ArtistDAOImpl) artistDAO).getJdbc().queryForObject(sql, String.class, userId)
                : null;
        } catch (Exception e) {
            return null;
        }
    }
}
