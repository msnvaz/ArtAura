package com.artaura.artaura.service.impl;

import com.artaura.artaura.dao.SponsorshipDAO;
import com.artaura.artaura.dto.sponsorship.ChallengeForSponsorshipDTO;
import com.artaura.artaura.dto.sponsorship.SponsorshipOfferDTO;
import com.artaura.artaura.service.SponsorshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class SponsorshipServiceImpl implements SponsorshipService {

    @Autowired
    private SponsorshipDAO sponsorshipDAO;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public List<ChallengeForSponsorshipDTO> getActiveChallengesRequestingSponsorship() {
        return sponsorshipDAO.getActiveChallengesRequestingSponsorship();
    }

    @Override
    public Long createSponsorshipOffer(Long shopId, Long challengeId, Integer discountPercentage) {
        // Validate inputs
        if (shopId == null || challengeId == null) {
            throw new IllegalArgumentException("Shop ID and Challenge ID are required");
        }

        if (discountPercentage == null || discountPercentage <= 0 || discountPercentage > 100) {
            throw new IllegalArgumentException("Discount percentage must be between 1 and 100");
        }

        // Check if shop already sponsored this challenge
        if (sponsorshipDAO.hasShopSponsoredChallenge(shopId, challengeId)) {
            throw new IllegalArgumentException("You have already sponsored this challenge");
        }

        // Get shop name and challenge title for discount code generation
        String shopName = jdbcTemplate.queryForObject(
                "SELECT shop_name FROM shops WHERE shop_id = ?", String.class, shopId);
        String challengeTitle = jdbcTemplate.queryForObject(
                "SELECT title FROM challenges WHERE id = ?", String.class, challengeId);

        // Generate unique discount code
        String discountCode = sponsorshipDAO.generateDiscountCode(shopName, challengeTitle);

        // Create DTO
        SponsorshipOfferDTO offer = new SponsorshipOfferDTO();
        offer.setShopId(shopId);
        offer.setChallengeId(challengeId);
        offer.setDiscountCode(discountCode);
        offer.setDiscountPercentage(discountPercentage);

        return sponsorshipDAO.createSponsorshipOffer(offer);
    }

    @Override
    public List<SponsorshipOfferDTO> getSponsorshipOffersByShop(Long shopId) {
        return sponsorshipDAO.getSponsorshipOffersByShop(shopId);
    }

    @Override
    public List<SponsorshipOfferDTO> getSponsorshipOffersByChallenge(Long challengeId) {
        return sponsorshipDAO.getSponsorshipOffersByChallenge(challengeId);
    }

    @Override
    public SponsorshipOfferDTO getSponsorshipOfferById(Long offerId) {
        return sponsorshipDAO.getSponsorshipOfferById(offerId);
    }

    @Override
    public void deleteSponsorshipOffer(Long offerId) {
        sponsorshipDAO.deleteSponsorshipOffer(offerId);
    }
}
