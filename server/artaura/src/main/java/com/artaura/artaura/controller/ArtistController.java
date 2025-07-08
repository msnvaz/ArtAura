package com.artaura.artaura.controller;

import com.artaura.artaura.dto.signup.ArtistSignupRequest;
import com.artaura.artaura.service.ArtistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/artist")
public class ArtistController {

    @Autowired
    private ArtistService artistService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody ArtistSignupRequest req) { //Spring automatically maps the JSON request body to the ArtistSignupRequest DTO.
        artistService.register(req);
        return ResponseEntity.ok("Artist registered successfully");
    }
}
