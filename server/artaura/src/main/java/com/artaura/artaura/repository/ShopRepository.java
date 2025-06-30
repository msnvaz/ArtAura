package com.artaura.artaura.repository;

import com.artaura.artaura.model.Shop;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShopRepository extends JpaRepository<Shop, Long> {
    Shop findByEmail(String email);
}
