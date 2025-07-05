package com.artaura.artaura.service;

import com.artaura.artaura.dao.impl.BuyerDAO;
import com.artaura.artaura.dto.BuyerSignupRequest;
import com.artaura.artaura.exception.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import com.artaura.artaura.util.PasswordEncoderUtil;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class BuyerService {

    @Autowired
    private BuyerDAO buyerDAO;

    @Autowired
    private PasswordEncoderUtil encoder;

    public void register(BuyerSignupRequest req) {
        if (buyerDAO.emailExists(req.getEmail())) {
            throw new CustomException("Email is already in use", HttpStatus.CONFLICT);
        }

        String hashedPassword = encoder.encode(req.getPassword());
        buyerDAO.save(req, hashedPassword);
    }
}
