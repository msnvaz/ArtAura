package com.artaura.artaura.service;

import com.artaura.artaura.dao.ArtistDAO;
import com.artaura.artaura.dto.signup.ArtistSignupRequest;
import com.artaura.artaura.exception.CustomException;
import com.artaura.artaura.util.PasswordEncoderUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class ArtistService {

    @Autowired
    private ArtistDAO artistDAO;

    @Autowired
    private PasswordEncoderUtil encoder;

    public void register(ArtistSignupRequest req) {
        if (artistDAO.emailExists(req.getEmail())) {
            throw new CustomException("Email is already in use", HttpStatus.CONFLICT);
        }

        String hashedPassword = encoder.encode(req.getPassword());
        artistDAO.save(req, hashedPassword);
    }
}
