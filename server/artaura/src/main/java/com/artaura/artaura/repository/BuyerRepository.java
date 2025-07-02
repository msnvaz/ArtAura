package com.artaura.artaura.repository;

import com.artaura.artaura.model.Buyer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BuyerRepository extends JpaRepository<Buyer, Long> {
    Buyer findByEmail(String email);
}
