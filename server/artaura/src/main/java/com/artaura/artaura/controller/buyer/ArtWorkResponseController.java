package com.artaura.artaura.controller.buyer;

import com.artaura.artaura.dto.buyer.ArtworksResponse;
import com.artaura.artaura.service.buyer.Artworkservice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/artworks")
public class ArtWorkResponseController {
    @Autowired
    private Artworkservice artworkService;

    @GetMapping("/available")
    @PreAuthorize("hasAuthority('ROLE_USER')") // or your JWT security annotation
    public ResponseEntity<List<ArtworksResponse>> getAvailableArtworks() {
        List<ArtworksResponse> artworks = artworkService.getAvailableArtworks();
        return ResponseEntity.ok(artworks);
    }
}
