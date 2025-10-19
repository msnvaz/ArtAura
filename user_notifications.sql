-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: mysql-artaura.alwaysdata.net
-- Generation Time: Oct 19, 2025 at 09:33 AM
-- Server version: 10.11.14-MariaDB
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `artaura_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `user_notifications`
--

CREATE TABLE `user_notifications` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `user_type` enum('BUYER','ARTIST','SHOP') NOT NULL,
  `type` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `commission_request_id` int(11) DEFAULT NULL,
  `artist_deadline` date DEFAULT NULL,
  `rejection_reason` text DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_notifications`
--

INSERT INTO `user_notifications` (`id`, `user_id`, `user_type`, `type`, `title`, `message`, `commission_request_id`, `artist_deadline`, `rejection_reason`, `is_read`, `created_at`, `updated_at`) VALUES
(1, 1, 'BUYER', 'commission_accepted', 'Commission Accepted!', 'Your commission request \"Portrait of a Family\" has been accepted by the artist.', 7, NULL, NULL, 0, '2025-10-17 08:27:22', '2025-10-17 08:27:22'),
(3, 1, 'BUYER', 'commission_accepted', 'Commission Request Accepted!', 'Your commission request \"nima\" has been accepted! The artist will complete it by 2025-10-18.', 15, '2025-10-18', NULL, 0, '2025-10-17 08:41:12', '2025-10-17 08:41:12'),
(4, 1, 'BUYER', 'delivery_requested', 'Artwork Ready for Delivery!', 'Great news! Your commissioned artwork \"nima\" is completed and ready for delivery. The artist has requested delivery arrangements.', 15, NULL, NULL, 0, '2025-10-17 09:40:02', '2025-10-17 09:40:02'),
(5, 1, 'BUYER', 'delivery_requested', 'Artwork Ready for Delivery!', 'Great news! Your commissioned artwork \"nima\" is completed and ready for delivery. The artist has requested delivery arrangements.', 15, NULL, NULL, 0, '2025-10-17 09:40:25', '2025-10-17 09:40:25'),
(6, 1, 'BUYER', 'delivery_requested', 'Artwork Ready for Delivery!', 'Great news! Your commissioned artwork \"nimanthammmm\" is completed and ready for delivery. The artist has requested delivery arrangements.', 13, NULL, NULL, 0, '2025-10-17 09:40:47', '2025-10-17 09:40:47'),
(7, 1, 'BUYER', 'delivery_requested', 'Artwork Ready for Delivery!', 'Great news! Your commissioned artwork \"nima\" is completed and ready for delivery. The artist has requested delivery arrangements.', 11, NULL, NULL, 0, '2025-10-17 09:47:44', '2025-10-17 09:47:44'),
(8, 1, 'BUYER', 'delivery_requested', 'Artwork Ready for Delivery!', 'Great news! Your commissioned artwork \"nima\" is completed and ready for delivery. The artist has requested delivery arrangements.', 11, NULL, NULL, 0, '2025-10-17 09:47:54', '2025-10-17 09:47:54'),
(9, 1, 'BUYER', 'delivery_requested', 'Artwork Ready for Delivery!', 'Great news! Your commissioned artwork \"nimanthammmm\" is completed and ready for delivery. The artist has requested delivery arrangements.', 13, NULL, NULL, 0, '2025-10-17 09:48:18', '2025-10-17 09:48:18'),
(10, 1, 'BUYER', 'delivery_requested', 'Artwork Ready for Delivery!', 'Great news! Your commissioned artwork \"nimanthammmm\" is completed and ready for delivery. The artist has requested delivery arrangements.', 13, NULL, NULL, 0, '2025-10-17 09:49:15', '2025-10-17 09:49:15'),
(11, 1, 'BUYER', 'delivery_requested', 'Artwork Ready for Delivery!', 'Great news! Your commissioned artwork \"nimanthammmm\" is completed and ready for delivery. The artist has requested delivery arrangements.', 13, NULL, NULL, 0, '2025-10-17 09:50:01', '2025-10-17 09:50:01'),
(12, 1, 'BUYER', 'delivery_requested', 'Artwork Ready for Delivery!', 'Great news! Your commissioned artwork \"nima\" is completed and ready for delivery. The artist has requested delivery arrangements.', 11, NULL, NULL, 0, '2025-10-17 09:50:55', '2025-10-17 09:50:55'),
(13, 1, 'BUYER', 'delivery_requested', 'Artwork Ready for Delivery!', 'Great news! Your commissioned artwork \"nima\" is completed and ready for delivery. The artist has requested delivery arrangements.', 15, NULL, NULL, 0, '2025-10-17 09:52:43', '2025-10-17 09:52:43'),
(14, 1, 'BUYER', 'delivery_requested', 'Artwork Ready for Delivery!', 'Great news! Your commissioned artwork \"nimanthammmm\" is completed and ready for delivery. The artist has requested delivery arrangements.', 13, NULL, NULL, 0, '2025-10-17 09:52:49', '2025-10-17 09:52:49'),
(15, 1, 'BUYER', 'delivery_requested', 'Artwork Ready for Delivery!', 'Great news! Your commissioned artwork \"nima\" is completed and ready for delivery. The artist has requested delivery arrangements.', 11, NULL, NULL, 0, '2025-10-17 10:46:23', '2025-10-17 10:46:23'),
(16, 1, 'BUYER', 'delivery_requested', 'Artwork Ready for Delivery!', 'Great news! Your commissioned artwork \"nima\" is completed and ready for delivery. The artist has requested delivery arrangements.', 15, NULL, NULL, 0, '2025-10-17 19:40:20', '2025-10-17 19:40:20'),
(17, 1, 'BUYER', 'delivery_requested', 'Artwork Ready for Delivery!', 'Great news! Your commissioned artwork \"nima\" is completed and ready for delivery. The artist has requested delivery arrangements.', 15, NULL, NULL, 0, '2025-10-17 20:48:44', '2025-10-17 20:48:44'),
(18, 1, 'BUYER', 'delivery_requested', 'Artwork Ready for Delivery!', 'Great news! Your commissioned artwork \"nima\" is completed and ready for delivery. The artist has requested delivery arrangements.', 15, NULL, NULL, 0, '2025-10-17 23:08:54', '2025-10-17 23:08:54'),
(19, 1, 'BUYER', 'delivery_requested', 'Artwork Ready for Delivery!', 'Great news! Your commissioned artwork \"nima\" is completed and ready for delivery. The artist has requested delivery arrangements.', 15, NULL, NULL, 0, '2025-10-17 23:23:18', '2025-10-17 23:23:18'),
(20, 1, 'BUYER', 'delivery_requested', 'Artwork Ready for Delivery!', 'Great news! Your commissioned artwork \"nima\" is completed and ready for delivery. The artist has requested delivery arrangements.', 15, NULL, NULL, 0, '2025-10-17 23:23:29', '2025-10-17 23:23:29'),
(21, 1, 'BUYER', 'delivery_requested', 'Artwork Ready for Delivery!', 'Great news! Your commissioned artwork \"nima\" is completed and ready for delivery. The artist has requested delivery arrangements.', 15, NULL, NULL, 0, '2025-10-17 23:28:05', '2025-10-17 23:28:05'),
(22, 1, 'BUYER', 'delivery_requested', 'Artwork Ready for Delivery!', 'Great news! Your commissioned artwork \"nima\" is completed and ready for delivery. The artist has requested delivery arrangements.', 15, NULL, NULL, 0, '2025-10-17 23:30:40', '2025-10-17 23:30:40'),
(23, 1, 'BUYER', 'delivery_requested', 'Artwork Ready for Delivery!', 'Great news! Your commissioned artwork \"nima\" is completed and ready for delivery. The artist has requested delivery arrangements.', 15, NULL, NULL, 0, '2025-10-17 23:30:49', '2025-10-17 23:30:49'),
(24, 1, 'BUYER', 'delivery_requested', 'Artwork Ready for Delivery!', 'Great news! Your commissioned artwork \"nima\" is completed and ready for delivery. The artist has requested delivery arrangements.', 15, NULL, NULL, 0, '2025-10-17 23:35:02', '2025-10-17 23:35:02'),
(25, 1, 'BUYER', 'delivery_requested', 'Artwork Ready for Delivery!', 'Great news! Your commissioned artwork \"nima\" is completed and ready for delivery. The artist has requested delivery arrangements.', 15, NULL, NULL, 0, '2025-10-17 23:35:14', '2025-10-17 23:35:14'),
(26, 1, 'BUYER', 'delivery_requested', 'Artwork Ready for Delivery!', 'Great news! Your commissioned artwork \"nima\" is completed and ready for delivery. The artist has requested delivery arrangements.', 15, NULL, NULL, 0, '2025-10-17 23:41:22', '2025-10-17 23:41:22'),
(27, 1, 'BUYER', 'delivery_requested', 'Artwork Ready for Delivery!', 'Great news! Your commissioned artwork \"nima\" is completed and ready for delivery. The artist has requested delivery arrangements.', 15, NULL, NULL, 0, '2025-10-17 23:42:00', '2025-10-17 23:42:00'),
(28, 1, 'BUYER', 'delivery_requested', 'Artwork Ready for Delivery!', 'Great news! Your commissioned artwork \"nimanthammmm\" is completed and ready for delivery. The artist has requested delivery arrangements.', 13, NULL, NULL, 0, '2025-10-17 23:42:07', '2025-10-17 23:42:07'),
(29, 1, 'BUYER', 'delivery_requested', 'Artwork Ready for Delivery!', 'Great news! Your commissioned artwork \"nima\" is completed and ready for delivery. The artist has requested delivery arrangements.', 15, NULL, NULL, 0, '2025-10-17 23:49:00', '2025-10-17 23:49:00'),
(30, 1, 'BUYER', 'delivery_requested', 'Artwork Ready for Delivery!', 'Great news! Your commissioned artwork \"nimanthammmm\" is completed and ready for delivery. The artist has requested delivery arrangements.', 13, NULL, NULL, 0, '2025-10-18 05:20:19', '2025-10-18 05:20:19'),
(31, 1, 'BUYER', 'delivery_requested', 'Artwork Ready for Delivery!', 'Great news! Your commissioned artwork \"Ucsc\" is completed and ready for delivery. The artist has requested delivery arrangements.', 15, NULL, NULL, 0, '2025-10-18 13:24:58', '2025-10-18 13:24:58'),
(32, 1, 'BUYER', 'delivery_requested', 'Artwork Ready for Delivery!', 'Great news! Your commissioned artwork \"Ucsc\" is completed and ready for delivery. The artist has requested delivery arrangements.', 15, NULL, NULL, 0, '2025-10-18 21:37:58', '2025-10-18 21:37:58'),
(33, 1, 'BUYER', 'delivery_requested', 'Artwork Ready for Delivery!', 'Great news! Your commissioned artwork \"Ucsc\" is completed and ready for delivery. The artist has requested delivery arrangements.', 15, NULL, NULL, 0, '2025-10-19 06:42:46', '2025-10-19 06:42:46');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `user_notifications`
--
ALTER TABLE `user_notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_notifications_user_id` (`user_id`),
  ADD KEY `idx_user_notifications_user_type` (`user_type`),
  ADD KEY `idx_user_notifications_is_read` (`is_read`),
  ADD KEY `idx_user_notifications_created_at` (`created_at`),
  ADD KEY `idx_user_notifications_composite` (`user_id`,`user_type`,`is_read`),
  ADD KEY `commission_request_id` (`commission_request_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `user_notifications`
--
ALTER TABLE `user_notifications`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `user_notifications`
--
ALTER TABLE `user_notifications`
  ADD CONSTRAINT `user_notifications_ibfk_1` FOREIGN KEY (`commission_request_id`) REFERENCES `commission_requests` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
