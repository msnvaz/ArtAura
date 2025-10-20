package com.artaura.artaura.controller.buyer;

import com.artaura.artaura.service.buyer.BArtistService;
import com.artaura.artaura.dto.buyer.ArtistListDTO;
import com.artaura.artaura.dto.artist.ArtistProfileResponseDTO;
import com.artaura.artaura.service.ArtistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/buyer/artists")
public class BuyerArtistController {

    @Autowired
    private BArtistService artistService;

    @Autowired
    private ArtistService artistProfileService;

    @GetMapping("/list")
    public ResponseEntity<List<ArtistListDTO>> getAllArtistsForList() {
        List<ArtistListDTO> artists = artistService.getAllArtistsForList();
        return ResponseEntity.ok(artists);
    }

    @PostMapping("/{id}/follow")
    public ResponseEntity<?> followArtist(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        artistService.followArtist(id, token);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{artistId}/profile")
    public ResponseEntity<ArtistProfileResponseDTO> getPublicArtistProfile(@PathVariable Long artistId) {
        try {
            Optional<ArtistProfileResponseDTO> profileOpt = artistProfileService.getProfile(artistId);
            if (profileOpt.isPresent()) {
                return ResponseEntity.ok(profileOpt.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
