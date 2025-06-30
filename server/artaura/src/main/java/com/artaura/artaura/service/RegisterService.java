package com.artaura.artaura.service;

import com.artaura.artaura.dto.ArtistRegisterRequest;
import com.artaura.artaura.dto.BuyerRegisterRequest;
import com.artaura.artaura.dto.ShopRegisterRequest;
import com.artaura.artaura.model.*;
import com.artaura.artaura.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class RegisterService {

    @Autowired private ArtistRepository artistRepository;
    @Autowired private BuyerRepository buyerRepository;
    @Autowired private ShopRepository shopRepository;
    @Autowired private AddressRepository addressRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    public void registerArtist(ArtistRegisterRequest req) {
        Artist artist = new Artist();
        artist.setFirstName(req.getFirstName());
        artist.setLastName(req.getLastName());
        artist.setEmail(req.getEmail());
        artist.setContactNo(req.getContactNo());
        artist.setNic(req.getNic());
        artist.setBio(req.getBio());
        artist.setRate(req.getRate());
        artist.setBadge(req.getBadge());
        artist.setAgreedTerms(req.isAgreedTerms());
        artist.setPassword(passwordEncoder.encode(req.getPassword()));

        Address address = new Address();
        address.setStreetAddress(req.getStreetAddress());
        address.setCity(req.getCity());
        address.setState(req.getState());
        address.setZipCode(req.getZipCode());
        address.setCountry(req.getCountry());
        address.setArtist(artist);

        artist.setAddress(address);

        artistRepository.save(artist);
    }

    public void registerBuyer(BuyerRegisterRequest req) {
        Buyer buyer = new Buyer();
        buyer.setFirstName(req.getFirstName());
        buyer.setLastName(req.getLastName());
        buyer.setEmail(req.getEmail());
        buyer.setAgreedTerms(req.isAgreedTerms());
        buyer.setPassword(passwordEncoder.encode(req.getPassword()));

        Address address = new Address();
        address.setStreetAddress(req.getStreetAddress());
        address.setCity(req.getCity());
        address.setState(req.getState());
        address.setZipCode(req.getZipCode());
        address.setCountry(req.getCountry());
        address.setBuyer(buyer);

        buyer.setAddress(address);

        buyerRepository.save(buyer);
    }

    public void registerShop(ShopRegisterRequest req) {
        Shop shop = new Shop();
        shop.setShopName(req.getShopName());
        shop.setOwnerName(req.getOwnerName());
        shop.setEmail(req.getEmail());
        shop.setContactNo(req.getContactNo());
        shop.setBusinessType(req.getBusinessType());
        shop.setDescription(req.getDescription());
        shop.setWebsite(req.getWebsite());
        shop.setBusinessLicense(req.getBusinessLicense());
        shop.setTaxId(req.getTaxId());
        shop.setAgreedTerms(req.isAgreedTerms());
        shop.setPassword(passwordEncoder.encode(req.getPassword()));

        Address address = new Address();
        address.setStreetAddress(req.getStreetAddress());
        address.setCity(req.getCity());
        address.setState(req.getState());
        address.setZipCode(req.getZipCode());
        address.setCountry(req.getCountry());
        address.setShop(shop);

        shop.setAddress(address);

        shopRepository.save(shop);
    }
}
