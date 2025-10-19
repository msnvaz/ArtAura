package com.artaura.artaura.dao;

import com.artaura.artaura.dto.sponsorship.ChallengeForSponsorshipDTO;
import com.artaura.artaura.dto.sponsorship.SponsorshipOfferDTO;

import java.util.List;

public interface SponsorshipDAO {

    // Get all active challenges that request sponsorships (request_sponsorship = 1)
    List<ChallengeForSponsorshipDTO> getActiveChallengesRequestingSponsorship();

    // Create a new sponsorship offer with generated discount code
    Long createSponsorshipOffer(SponsorshipOfferDTO offer);

    // Get all sponsorship offers by shop
    List<SponsorshipOfferDTO> getSponsorshipOffersByShop(Long shopId);

    // Get all sponsorship offers for a challenge
    List<SponsorshipOfferDTO> getSponsorshipOffersByChallenge(Long challengeId);

    // Get a specific sponsorship offer by ID
    SponsorshipOfferDTO getSponsorshipOfferById(Long offerId);

    // Check if shop already sponsored a challenge
    boolean hasShopSponsoredChallenge(Long shopId, Long challengeId);

    // Update challenge request_sponsorship status (1 -> 2 when sponsored)
    void updateChallengeToSponsored(Long challengeId);

    // Delete sponsorship offer
    void deleteSponsorshipOffer(Long offerId);

    // Generate unique discount code
    String generateDiscountCode(String shopName, String challengeTitle);
}
