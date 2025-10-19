-- Insert some sample notifications for testing
-- Replace the artist_id with the actual artist ID you want to test with

INSERT INTO artist_notifications (artist_id, notification_body, is_read, created_at, updated_at) VALUES
(11, 'Welcome to ArtAura! Your artist profile has been successfully created.', false, NOW(), NOW()),
(11, 'You have received a new commission request for a digital portrait.', false, NOW() - INTERVAL 1 HOUR, NOW() - INTERVAL 1 HOUR),
(11, 'Your artwork "Sunset Dreams" has received 10 new likes today.', true, NOW() - INTERVAL 2 HOUR, NOW() - INTERVAL 2 HOUR),
(11, 'Commission payment of $150 has been processed successfully.', false, NOW() - INTERVAL 1 DAY, NOW() - INTERVAL 1 DAY),
(11, 'Your portfolio has been viewed 50 times this week!', true, NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 2 DAY);

-- You can modify the artist_id (11) to match your test artist account
