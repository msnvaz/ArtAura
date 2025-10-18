package com.artaura.artaura.service.artist.Impl;

import com.artaura.artaura.dao.artist.ArtistArtworkOrderDAO;
import com.artaura.artaura.dto.artist.ArtistArtworkOrderDTO;
import com.artaura.artaura.service.artist.ArtistArtworkOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Implementation of ArtistArtworkOrderService Handles business logic for artist
 * artwork orders
 */
@Service
public class ArtistArtworkOrderServiceImpl implements ArtistArtworkOrderService {

    @Autowired
    private ArtistArtworkOrderDAO artistArtworkOrderDAO;

    @Override
    public List<ArtistArtworkOrderDTO> getArtworkOrdersByArtistId(Long artistId) {
        try {
            return artistArtworkOrderDAO.getArtworkOrdersByArtistId(artistId);
        } catch (Exception e) {
            System.err.println("Service error fetching artwork orders for artist " + artistId + ": " + e.getMessage());
            throw new RuntimeException("Failed to fetch artwork orders", e);
        }
    }

    @Override
    public int getArtworkOrdersCountByArtistId(Long artistId) {
        try {
            return artistArtworkOrderDAO.getArtworkOrdersCountByArtistId(artistId);
        } catch (Exception e) {
            System.err.println("Service error getting artwork orders count for artist " + artistId + ": " + e.getMessage());
            throw new RuntimeException("Failed to get artwork orders count", e);
        }
    }

    @Override
    public int getPendingDeliveryOrdersCountByArtistId(Long artistId) {
        try {
            return artistArtworkOrderDAO.getPendingDeliveryOrdersCountByArtistId(artistId);
        } catch (Exception e) {
            System.err.println("Service error getting pending delivery orders count for artist " + artistId + ": " + e.getMessage());
            throw new RuntimeException("Failed to get pending delivery orders count", e);
        }
    }

    @Override
    public boolean requestDelivery(Long orderId, Long artistId) {
        try {
            // First verify the order belongs to this artist by fetching their orders
            List<ArtistArtworkOrderDTO> artistOrders = artistArtworkOrderDAO.getArtworkOrdersByArtistId(artistId);
            boolean orderBelongsToArtist = artistOrders.stream()
                    .anyMatch(order -> order.getOrderId().equals(orderId));

            if (!orderBelongsToArtist) {
                System.err.println("Order " + orderId + " does not belong to artist " + artistId);
                return false;
            }

            // Update delivery status to 'pending' to request delivery
            boolean updated = artistArtworkOrderDAO.updateOrderDeliveryStatus(orderId, "pending");

            if (updated) {
                System.out.println("Successfully requested delivery for order " + orderId + " by artist " + artistId);
            } else {
                System.err.println("Failed to update delivery status for order " + orderId);
            }

            return updated;
        } catch (Exception e) {
            System.err.println("Service error requesting delivery for order " + orderId + " by artist " + artistId + ": " + e.getMessage());
            throw new RuntimeException("Failed to request delivery", e);
        }
    }
}
