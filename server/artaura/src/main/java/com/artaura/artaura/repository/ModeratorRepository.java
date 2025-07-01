package com.artaura.artaura.repository;

import com.artaura.artaura.model.Moderator;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ModeratorRepository extends JpaRepository<Moderator, Long> {
    Moderator findByEmail(String email);
}
