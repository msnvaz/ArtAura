package com.artaura.artaura.service;

import com.artaura.artaura.dto.LoginDTO;
import com.artaura.artaura.model.*;
import com.artaura.artaura.repository.*;
import com.artaura.artaura.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {

    private final AdminRepository adminRepo;
    private final ModeratorRepository moderatorRepo;
    private final ArtistRepository artistRepo;
    private final ShopRepository shopRepo;
    private final BuyerRepository buyerRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtTokenProvider;

    @Autowired
    public AuthService(AdminRepository adminRepo,
                       ModeratorRepository moderatorRepo,
                       ArtistRepository artistRepo,
                       ShopRepository shopRepo,
                       BuyerRepository buyerRepo,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtTokenProvider) {
        this.adminRepo = adminRepo;
        this.moderatorRepo = moderatorRepo;
        this.artistRepo = artistRepo;
        this.shopRepo = shopRepo;
        this.buyerRepo = buyerRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public LoginDTO.LoginResponse authenticateUser(LoginDTO.LoginRequest loginRequest) {
        String email = loginRequest.getEmail();
        Object user = findUserInAllTables(email)
                .orElseThrow(() -> new BadCredentialsException("User Not Found"));
        return validateAndCreateResponse(user, loginRequest.getPassword());
    }

    private Optional<Object> findUserInAllTables(String email) {
        Admin admin = adminRepo.findByEmail(email);
        if (admin != null) return Optional.of(admin);
        Moderator moderator = moderatorRepo.findByEmail(email);
        if (moderator != null) return Optional.of(moderator);
        Artist artist = artistRepo.findByEmail(email);
        if (artist != null) return Optional.of(artist);
        Shop shop = shopRepo.findByEmail(email);
        if (shop != null) return Optional.of(shop);
        Buyer buyer = buyerRepo.findByEmail(email);
        if (buyer != null) return Optional.of(buyer);
        return Optional.empty();
    }

    private LoginDTO.LoginResponse validateAndCreateResponse(Object user, String rawPassword) {
        String storedPassword = "";
        String role = "";
        Long userId = null;
        String email = "";

        if (user instanceof Admin admin) {
            storedPassword = admin.getPassword();
            role = "ADMIN";
            userId = admin.getId();
            email = admin.getEmail();
        } else if (user instanceof Moderator mod) {
            storedPassword = mod.getPassword();
            role = "MODERATOR";
            userId = mod.getId();
            email = mod.getEmail();
        } else if (user instanceof Artist artist) {
            storedPassword = artist.getPassword();
            role = "ARTIST";
            userId = artist.getId();
            email = artist.getEmail();
        } else if (user instanceof Shop shop) {
            storedPassword = shop.getPassword();
            role = "SHOP";
            userId = shop.getId();
            email = shop.getEmail();
        } else if (user instanceof Buyer buyer) {
            storedPassword = buyer.getPassword();
            role = "BUYER";
            userId = buyer.getId();
            email = buyer.getEmail();
        }

        if (!passwordEncoder.matches(rawPassword, storedPassword)) {
            throw new BadCredentialsException("Invalid credentials");
        }

        String token = jwtTokenProvider.generateToken(userId, role);
        return new LoginDTO.LoginResponse(token, new LoginDTO.UserInfo(userId, email, role));
    }
}
