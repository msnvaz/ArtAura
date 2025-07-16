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

        Optional<LoginUserDataDTO> user; //user might have a LoginUserDataDTO object, or it might be empty

        // Check artist
        user = artistDAO.findByEmail(email);
        if (user.isPresent() && encoder.matches(password, user.get().getPassword())) {
            return new LoginResponse(jwtUtil.generateToken(user.get().getUserId(), "artist"), "artist", user.get().getUserId());
        }

        // Check buyer
        user = buyerDAO.findByEmail(email);
        if (user.isPresent() && encoder.matches(password, user.get().getPassword())) {
            return new LoginResponse(jwtUtil.generateToken(user.get().getUserId(), "buyer"), "buyer", user.get().getUserId());
        }

        // Check shop owner
        user = shopDAO.findByEmail(email);
        if (user.isPresent() && encoder.matches(password, user.get().getPassword())) {
            return new LoginResponse(jwtUtil.generateToken(user.get().getUserId(), "shop"), "shop", user.get().getUserId());
        }

        // Check moderator
        user = moderatorDAO.findByEmail(email);
        if (user.isPresent() && encoder.matches(password, user.get().getPassword())) {
            return new LoginResponse(jwtUtil.generateToken(user.get().getUserId(), "moderator"), "moderator", user.get().getUserId());
        }

        // Check admin
        user = adminDAO.findByEmail(email);
        if (user.isPresent() && encoder.matches(password, user.get().getPassword())) {
            return new LoginResponse(jwtUtil.generateToken(user.get().getUserId(), "admin"), "admin", user.get().getUserId());
        }

        throw new RuntimeException("Invalid credentials");
    }

}
