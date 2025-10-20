package com.artaura.artaura.service;

import java.util.List;

import com.artaura.artaura.dto.sponsorship.ChallengeForSponsorshipDTO;
import com.artaura.artaura.dto.sponsorship.SponsorshipOfferDTO;

public interface SponsorshipService {

    List<ChallengeForSponsorshipDTO> getActiveChallengesRequestingSponsorship();

    Long createSponsorshipOffer(Long shopId, Long challengeId, Integer discountPercentage);

    List<SponsorshipOfferDTO> getSponsorshipOffersByShop(Long shopId);

    List<SponsorshipOfferDTO> getSponsorshipOffersByChallenge(Long challengeId);

    SponsorshipOfferDTO getSponsorshipOfferById(Long offerId);

    void deleteSponsorshipOffer(Long offerId);

    void updateSponsorshipStatus(Long offerId, String status);
}
