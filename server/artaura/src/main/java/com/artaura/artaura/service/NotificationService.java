package com.artaura.artaura.service;

import com.artaura.artaura.dao.ArtistNotificationDAO;
import com.artaura.artaura.dao.UserNotificationDAO;
import com.artaura.artaura.dto.notification.ArtistNotificationDTO;
import com.artaura.artaura.dto.notification.UserNotificationDTO;
import com.artaura.artaura.entity.UserNotification.UserType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private UserNotificationDAO userNotificationDAO;

    @Autowired
    private ArtistNotificationDAO artistNotificationDAO;

    /**
     * Create a notification for buyer when delivery is accepted
     * @param buyerId The buyer ID
     * @param artworkTitle The title of the artwork
     * @param deliveryFee The delivery fee
     * @param requestType Type of request (artwork_order or commission_request)
     * @param requestId The request ID
     * @return true if notification was created successfully
     */
    public boolean notifyBuyerDeliveryAccepted(Long buyerId, String artworkTitle, String deliveryFee, String requestType, Long requestId) {
        try {
            String title = "Delivery Accepted!";
            String message = String.format(
                "Good news! A delivery partner has accepted your delivery request for \"%s\". " +
                "Delivery fee: Rs. %s. The artwork will be picked up soon and delivered to your address.",
                artworkTitle, deliveryFee
            );

            UserNotificationDTO notification = new UserNotificationDTO();
            notification.setUserId(buyerId);
            notification.setUserType(UserType.BUYER);
            notification.setType("delivery_accepted");
            notification.setTitle(title);
            notification.setMessage(message);
            
            if ("commission_request".equals(requestType)) {
                notification.setCommissionRequestId(requestId.intValue());
            }

            boolean created = userNotificationDAO.createNotification(notification);
            if (created) {
                System.out.println("✅ NotificationService: Sent delivery accepted notification to buyer " + buyerId);
            }
            return created;
        } catch (Exception e) {
            System.out.println("❌ NotificationService: Failed to notify buyer: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Create a notification for artist when delivery is accepted
     * @param artistId The artist ID
     * @param artworkTitle The title of the artwork
     * @param buyerName The buyer's name
     * @return true if notification was created successfully
     */
    public boolean notifyArtistDeliveryAccepted(Long artistId, String artworkTitle, String buyerName) {
        try {
            String message = String.format(
                "A delivery partner has accepted the delivery request for your artwork \"%s\" ordered by %s. " +
                "Please ensure the artwork is ready for pickup. The delivery partner will contact you soon.",
                artworkTitle, buyerName
            );

            ArtistNotificationDTO notification = new ArtistNotificationDTO();
            notification.setArtistId(artistId);
            notification.setNotificationBody(message);

            boolean created = artistNotificationDAO.createNotification(notification);
            if (created) {
                System.out.println("✅ NotificationService: Sent delivery accepted notification to artist " + artistId);
            }
            return created;
        } catch (Exception e) {
            System.out.println("❌ NotificationService: Failed to notify artist: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Create a notification for buyer when artwork is out for delivery
     * @param buyerId The buyer ID
     * @param artworkTitle The title of the artwork
     * @param requestType Type of request (artwork_order or commission_request)
     * @param requestId The request ID
     * @return true if notification was created successfully
     */
    public boolean notifyBuyerOutForDelivery(Long buyerId, String artworkTitle, String requestType, Long requestId) {
        try {
            String title = "Artwork Out for Delivery!";
            String message = String.format(
                "Your artwork \"%s\" is now out for delivery! It should arrive at your address soon.",
                artworkTitle
            );

            UserNotificationDTO notification = new UserNotificationDTO();
            notification.setUserId(buyerId);
            notification.setUserType(UserType.BUYER);
            notification.setType("out_for_delivery");
            notification.setTitle(title);
            notification.setMessage(message);
            
            if ("commission_request".equals(requestType)) {
                notification.setCommissionRequestId(requestId.intValue());
            }

            return userNotificationDAO.createNotification(notification);
        } catch (Exception e) {
            System.out.println("❌ NotificationService: Failed to notify buyer out for delivery: " + e.getMessage());
            return false;
        }
    }

    /**
     * Create a notification for buyer when artwork is delivered
     * @param buyerId The buyer ID
     * @param artworkTitle The title of the artwork
     * @param requestType Type of request (artwork_order or commission_request)
     * @param requestId The request ID
     * @return true if notification was created successfully
     */
    public boolean notifyBuyerDelivered(Long buyerId, String artworkTitle, String requestType, Long requestId) {
        try {
            String title = "Artwork Delivered!";
            String message = String.format(
                "Your artwork \"%s\" has been successfully delivered! We hope you enjoy your purchase.",
                artworkTitle
            );

            UserNotificationDTO notification = new UserNotificationDTO();
            notification.setUserId(buyerId);
            notification.setUserType(UserType.BUYER);
            notification.setType("delivered");
            notification.setTitle(title);
            notification.setMessage(message);
            
            if ("commission_request".equals(requestType)) {
                notification.setCommissionRequestId(requestId.intValue());
            }

            return userNotificationDAO.createNotification(notification);
        } catch (Exception e) {
            System.out.println("❌ NotificationService: Failed to notify buyer delivered: " + e.getMessage());
            return false;
        }
    }

    /**
     * Create a notification for artist when artwork is delivered
     * @param artistId The artist ID
     * @param artworkTitle The title of the artwork
     * @param buyerName The buyer's name
     * @return true if notification was created successfully
     */
    public boolean notifyArtistDelivered(Long artistId, String artworkTitle, String buyerName) {
        try {
            String message = String.format(
                "Great news! Your artwork \"%s\" has been successfully delivered to %s.",
                artworkTitle, buyerName
            );

            ArtistNotificationDTO notification = new ArtistNotificationDTO();
            notification.setArtistId(artistId);
            notification.setNotificationBody(message);

            return artistNotificationDAO.createNotification(notification);
        } catch (Exception e) {
            System.out.println("❌ NotificationService: Failed to notify artist delivered: " + e.getMessage());
            return false;
        }
    }

    /**
     * Create a general user notification
     * @param notification The notification DTO
     * @return true if notification was created successfully
     */
    public boolean createUserNotification(UserNotificationDTO notification) {
        return userNotificationDAO.createNotification(notification);
    }

    /**
     * Create a general artist notification
     * @param notification The notification DTO
     * @return true if notification was created successfully
     */
    public boolean createArtistNotification(ArtistNotificationDTO notification) {
        return artistNotificationDAO.createNotification(notification);
    }
}
