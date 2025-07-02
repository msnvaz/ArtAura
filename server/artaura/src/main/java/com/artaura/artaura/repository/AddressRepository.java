package com.artaura.artaura.repository;

import com.artaura.artaura.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, Long> {
    // Add custom queries if needed
}
