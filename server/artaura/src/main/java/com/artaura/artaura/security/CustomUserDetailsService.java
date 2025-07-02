package com.artaura.artaura.security;

import com.artaura.artaura.model.*;
import com.artaura.artaura.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired private AdminRepository adminRepository;
    @Autowired private ModeratorRepository moderatorRepository;
    @Autowired private ArtistRepository artistRepository;
    @Autowired private ShopRepository shopRepository;
    @Autowired private BuyerRepository buyerRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        throw new UsernameNotFoundException("Not implemented");
    }

    public UserDetails loadUserByEmail(String email) throws UsernameNotFoundException {
        Admin admin = adminRepository.findByEmail(email);
        if (admin != null) {
            return org.springframework.security.core.userdetails.User
                    .withUsername(admin.getEmail())
                    .password(admin.getPassword())
                    .roles("ADMIN")
                    .build();
        }
        Moderator moderator = moderatorRepository.findByEmail(email);
        if (moderator != null) {
            return org.springframework.security.core.userdetails.User
                    .withUsername(moderator.getEmail())
                    .password(moderator.getPassword())
                    .roles("MODERATOR")
                    .build();
        }
        Artist artist = artistRepository.findByEmail(email);
        if (artist != null) {
            return org.springframework.security.core.userdetails.User
                    .withUsername(artist.getEmail())
                    .password(artist.getPassword())
                    .roles("ARTIST")
                    .build();
        }
        Shop shop = shopRepository.findByEmail(email);
        if (shop != null) {
            return org.springframework.security.core.userdetails.User
                    .withUsername(shop.getEmail())
                    .password(shop.getPassword())
                    .roles("SHOP")
                    .build();
        }
        Buyer buyer = buyerRepository.findByEmail(email);
        if (buyer != null) {
            return org.springframework.security.core.userdetails.User
                    .withUsername(buyer.getEmail())
                    .password(buyer.getPassword())
                    .roles("BUYER")
                    .build();
        }
        throw new UsernameNotFoundException("User not found with email: " + email);
    }
}
