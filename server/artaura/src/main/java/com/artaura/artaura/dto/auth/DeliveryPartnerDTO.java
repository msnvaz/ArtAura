package com.artaura.artaura.dto.auth;

public class DeliveryPartnerDTO extends LoginUserDataDTO {
    private String partnerName;

    public DeliveryPartnerDTO() {}

    public DeliveryPartnerDTO(Long partnerId, String email, String password, String partnerName) {
        super(partnerId, email, password);
        this.partnerName = partnerName;
    }

    // Getters and Setters
    public String getPartnerName() { return partnerName; }
    public void setPartnerName(String partnerName) { this.partnerName = partnerName; }
}