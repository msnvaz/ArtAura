package com.artaura.artaura.controller;

import com.artaura.artaura.dto.signup.ShopOwnerSignupRequest;
import com.artaura.artaura.service.ShopOwnerService;
import com.artaura.artaura.service.ImageUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/shop")
public class ShopOwnerController {

    @Autowired
    private ShopOwnerService shopOwnerService;

    @Autowired
    private ImageUploadService imageUploadService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(
            @RequestParam("shopName") String shopName,
            @RequestParam("ownerName") String ownerName,
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("businessType") String businessType,
            @RequestParam("description") String description,
            @RequestParam("contactNo") String contactNo,
            @RequestParam("streetAddress") String streetAddress,
            @RequestParam("city") String city,
            @RequestParam("state") String state,
            @RequestParam("zipCode") String zipCode,
            @RequestParam("country") String country,
            @RequestParam("categories") String categories,
            @RequestParam(value = "businessLicense", required = false) String businessLicense,
            @RequestParam(value = "taxId", required = false) String taxId,
            @RequestParam("nicNumber") String nicNumber,
            @RequestParam("nicImage") MultipartFile nicImage
    ) throws IOException {
        // Save NIC image using saveImage
        String nicImageUrl = imageUploadService.saveImage(nicImage, "nic", null);

        ShopOwnerSignupRequest req = new ShopOwnerSignupRequest();
        req.setShopName(shopName);
        req.setOwnerName(ownerName);
        req.setEmail(email);
        req.setPassword(password);
        req.setBusinessType(businessType);
        req.setDescription(description);
        req.setContactNo(contactNo);
        req.setStreetAddress(streetAddress);
        req.setCity(city);
        req.setState(state);
        req.setZipCode(zipCode);
        req.setCountry(country);
        req.setCategories(categories);
        req.setBusinessLicense(businessLicense);
        req.setTaxId(taxId);
        req.setNicNumber(nicNumber);
        req.setNicImageUrl(nicImageUrl);

        shopOwnerService.register(req);
        return ResponseEntity.ok("Shop owner registered successfully");
    }
}
