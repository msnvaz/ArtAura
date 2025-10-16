-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: mysql-artaura.alwaysdata.net
-- Generation Time: Oct 16, 2025 at 11:12 AM
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
-- Table structure for table `artists`
--

CREATE TABLE `artists` (
  `artist_id` bigint(20) NOT NULL,
  `agreed_terms` bit(1) NOT NULL,
  `badge` varchar(255) DEFAULT NULL,
  `bio` varchar(255) DEFAULT NULL,
  `contactNo` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT current_timestamp(6),
  `email` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `nic` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `rate` float DEFAULT NULL,
  `specialization` varchar(250) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `twitter` varchar(255) DEFAULT NULL,
  `avatar_url` varchar(500) DEFAULT NULL,
  `cover_image_url` varchar(500) DEFAULT NULL,
  `join_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `total_views` int(11) DEFAULT 0,
  `total_followers` int(11) DEFAULT 0,
  `total_sales` int(11) DEFAULT 0,
  `status` varchar(255) DEFAULT NULL,
  `contact_no` varchar(255) DEFAULT NULL,
  `nic_image_url` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `artists`
--

INSERT INTO `artists` (`artist_id`, `agreed_terms`, `badge`, `bio`, `contactNo`, `created_at`, `email`, `first_name`, `last_name`, `nic`, `password`, `rate`, `specialization`, `location`, `website`, `instagram`, `twitter`, `avatar_url`, `cover_image_url`, `join_date`, `total_views`, `total_followers`, `total_sales`, `status`, `contact_no`, `nic_image_url`) VALUES
(1, b'1', NULL, 'Contemporary artist specializing in abstract expressionism and digital art. My work explores the intersection of emotion and color, creating pieces that speak to the human experience.', '0772089738', '2025-06-28 00:17:38.000000', 'pawani@gmail.com', 'Pawani', 'Kumari ', '200284202372', '$2a$10$gCe2HDzIIQs.i8M2Vn.mr.B7H6Uc1WpIZ2vRK5SbAcVmOQQOZ9Rk2', 3, '0', 'New York, NY', 'www.sarahmartinez.art', '@sarahmartinez_art', '@sarah_art', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg', 'https://images.pexels.com/photos/1070981/pexels-photo-1070981.jpeg', '2025-07-13 11:03:32', 12847, 342, 18, 'Active', NULL, NULL),
(3, b'1', NULL, NULL, '0772089738', '2025-06-30 21:03:48.000000', 'kasun.j@gmail.com', 'Kasun', 'Jayawardene', '200284202372', '$2a$10$BCgZmSVCNxFMUFvWDWZCN.YSKQpBiYGJC0j6UYYVdKrkeQ2Jvu2IW', 4.5, '0', NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-13 11:03:32', 0, 100, 2, 'Active', NULL, NULL),
(4, b'1', NULL, NULL, '0772089738', '2025-07-02 23:30:54.000000', 'thilinakp165@gmail.com', 'Thilina', 'Perera', '023135486487', '$2a$10$CzYd.AkscLM4JgAu2nZRBef33zRIDiUI.RK3izXjoRg6DSBocWqGC', 2, '0', NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-13 11:03:32', 0, 200, 4, 'Suspended', NULL, NULL),
(5, b'1', NULL, NULL, '57864651351', '2025-07-05 10:33:56.206736', 'tharindugh12@gmail.com', 'Tharindu', 'Gamage', '200284202372', '$2a$10$j2/JR5ZXrdP8ECUzMCkj7OgRb/lwP89bw4iZKwgIUpZzYZUUxcKSe', 3, 'mixed', NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-13 11:03:32', 0, 342, 19, 'Suspended', NULL, NULL),
(6, b'1', NULL, NULL, '57864651351', '2025-07-05 12:13:46.213355', 'gayanjk2@gmail.com', 'Gayan', 'Kumara', '200284202372', '$2a$10$/uok5xiIcpRh/6/pvMfWL..NEhQdLRVqDZegsfzzyqJhEP0I6DIce', 3, 'drawing', NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-13 11:03:32', 0, 780, 8, 'Active', NULL, NULL),
(7, b'1', NULL, NULL, '1368487', '2025-07-05 17:02:23.821319', 'pawanr13@gmail.com', 'Pawan', 'Rathnayake', '153487', '$2a$10$Gx8zy9djc7kP6T5kxUGoWO6Af2UwhHoFgX1OE2wYvt7xTnETpACxu', 3.5, 'mixed', NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-13 11:03:32', 0, 1001, 7, 'Suspended', NULL, '/nic/bg3.jpg'),
(11, b'1', NULL, 'I\'m a visual artist passionate about turning emotion and imagination into vibrant artworks. I work with watercolor, acrylic, oil painting drawing, inspiration from everyday life, nature, and inner experiences. Always exploring, always creating.', '0771415855', '2025-07-14 14:32:02.279442', 'nimantham.lk@gmail.com', 'Nimantha', 'Madushan', 'nimantham.lk@gmail.com', '$2a$10$xX2ThSoWBMGUE6PUiHYRvO9gvtZakvvAXRW1nsqYUjluNa96kevzi', 5, 'painting', 'Colombo', '', '_nimantha.m', '', '/uploads/profiles/11_avatar_1755769381087.jpg', '/uploads/profiles/11_cover_1755846723860.PNG', '2025-07-14 09:02:02', 0, 1201, 18, 'Active', NULL, NULL),
(16, b'1', NULL, NULL, '0767777777', '2025-07-21 17:00:16.222649', 'sandeepvz1@gmail.com', 'Sandeep', 'Vaz', '200207303077', '$2a$10$IbZAMAqFPOp9Cgq6/Msnc.ID2oG5KFRR/gu1rsuoow8ZQTjqfFKsC', 3.5, 'digital', NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-21 15:00:16', 0, 520, 1, 'Pending', NULL, NULL),
(17, b'1', NULL, NULL, '+94741748684', '2025-08-20 09:03:37.411034', 'wameesharasanjani28@gmail.com', 'Wameesha', 'Rasanjani', '200277200485', '$2a$10$uClu3YDZYdftWmvUgxkfKes..Z9DvBTA3iFZfSUbPpTLzIK82kcKe', 2, 'photography', NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-20 07:03:37', 0, 300, 5, 'Pending', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `artists`
--
ALTER TABLE `artists`
  ADD PRIMARY KEY (`artist_id`),
  ADD UNIQUE KEY `unique_email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `artists`
--
ALTER TABLE `artists`
  MODIFY `artist_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
