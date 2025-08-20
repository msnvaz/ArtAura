package com.artaura.artaura.controller.buyer;

import com.artaura.artaura.service.buyer.BArtistService;
import com.artaura.artaura.dto.buyer.ArtistListDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/buyer/artists")
public class BuyerArtistController {
    @Autowired
    private BArtistService artistService;

    @GetMapping("/list")
    public ResponseEntity<List<ArtistListDTO>> getAllArtistsForList() {
        List<ArtistListDTO> artists = artistService.getAllArtistsForList();
        return ResponseEntity.ok(artists);
    }
}
