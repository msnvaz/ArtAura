package com.artaura.artaura.repository;

import com.artaura.artaura.model.Artist;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArtistRepository extends JpaRepository<Artist, Long> {
    Artist findByEmail(String email);
}
