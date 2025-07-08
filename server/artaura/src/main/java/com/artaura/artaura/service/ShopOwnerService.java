package com.artaura.artaura.service;

import com.artaura.artaura.dao.ShopOwnerDAO;
import com.artaura.artaura.dto.signup.ShopOwnerSignupRequest;
import com.artaura.artaura.exception.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import com.artaura.artaura.util.PasswordEncoderUtil;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class ShopOwnerService {

    @Autowired
    private ShopOwnerDAO shopOwnerDAO;

    @Autowired
    private PasswordEncoderUtil encoder;

    public void register(ShopOwnerSignupRequest req) {
        if (shopOwnerDAO.emailExists(req.getEmail())) {
            throw new CustomException("Email is already in use", HttpStatus.CONFLICT);
        }

        String hashedPassword = encoder.encode(req.getPassword());
        shopOwnerDAO.save(req, hashedPassword);
    }
}
