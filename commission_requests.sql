-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: mysql-artaura.alwaysdata.net
-- Generation Time: Oct 18, 2025 at 05:57 AM
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
-- Table structure for table `commission_requests`
--

CREATE TABLE `commission_requests` (
  `id` int(11) NOT NULL,
  `artist_id` bigint(20) NOT NULL,
  `buyer_id` bigint(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `title` varchar(150) NOT NULL,
  `artwork_type` varchar(50) NOT NULL,
  `style` varchar(50) DEFAULT NULL,
  `dimensions` varchar(50) DEFAULT NULL,
  `budget` decimal(50,0) DEFAULT NULL,
  `deadline` date NOT NULL,
  `additional_notes` text DEFAULT NULL,
  `shipping_address` varchar(255) DEFAULT NULL,
  `urgency` varchar(20) DEFAULT 'normal',
  `status` varchar(20) DEFAULT 'pending',
  `payment_status` varchar(255) NOT NULL,
  `delivery_status` enum('pending','accepted','outForDelivery','delivered','N/A') NOT NULL DEFAULT 'N/A',
  `shipping_fee` int(11) DEFAULT NULL,
  `submitted_at` datetime NOT NULL,
  `artist_deadline` date DEFAULT NULL COMMENT 'Artist proposed deadline for the commission',
  `rejection_reason` text DEFAULT NULL COMMENT 'Reason provided by artist for rejecting the commission',
  `response_date` datetime DEFAULT NULL COMMENT 'Date when artist responded to the commission request'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `commission_requests`
--

INSERT INTO `commission_requests` (`id`, `artist_id`, `buyer_id`, `name`, `email`, `phone`, `title`, `artwork_type`, `style`, `dimensions`, `budget`, `deadline`, `additional_notes`, `shipping_address`, `urgency`, `status`, `payment_status`, `delivery_status`, `shipping_fee`, `submitted_at`, `artist_deadline`, `rejection_reason`, `response_date`) VALUES
(7, 11, 1, 'Nimal Perera', 'nimal.perera@gmail.com', '+94 77 123 4567', 'Portrait of a Family', 'painting', 'oil-painting', '16x20', 5000, '2025-09-15', 'Please include a background of our home.', 'No. 123, Galle Road, Colombo 06, 00600, Sri Lanka', 'normal', 'accepted', 'escrow', 'accepted', 1500, '2025-08-16 10:00:00', NULL, NULL, NULL),
(9, 11, 1, 'Ruwan Silva', 'ruwan.silva@gmail.com', '+94 76 555 1234', 'Pet Sculpture', 'sculpture', 'ceramics', '12x16', 2750, '2025-10-10', 'A ceramic sculpture of our dog.', '45/2, Kandy Road, Kaduwela, 10640, Sri Lanka\"\n', 'low', 'accepted', 'escrow', 'pending', NULL, '2025-08-16 12:00:00', NULL, NULL, NULL),
(10, 11, 1, 'pawani saman', 'saman@gmail.com', '+94035225554', 'ele', 'painting', 'oil-painting', '8x10', 2751, '2025-08-23', 'ibdc', '43/2, Kadawatha Road, Ragama, 10240, Sri Lanka', 'normal', 'accepted', 'escrow', 'accepted', 1245, '2025-08-18 10:06:29', NULL, NULL, NULL),
(11, 11, 1, 'Pawani Kumari ', 'pawani@gmail.com', '0772089738', 'nima', 'photography', 'markers', '24x30', 2000, '2025-10-17', '', NULL, 'normal', 'ACCEPTED', 'paid', 'delivered', 1500, '2025-10-16 17:24:59', NULL, NULL, NULL),
(12, 11, 1, 'Pawani Kumari ', 'pawani@gmail.com', '0772089738', 'nimanthaaaa', 'painting', 'acrylic-painting', '24x30', 20000, '2025-10-24', '', NULL, 'high', 'REJECTED', 'PENDING', 'N/A', NULL, '2025-10-17 11:07:47', NULL, NULL, NULL),
(13, 11, 1, 'Pawani Kumari ', 'pawani@gmail.com', '0772089738', 'nimanthammmm', 'drawing', 'acrylic-painting', '24x36', 60000, '2025-10-24', '', NULL, 'normal', 'ACCEPTED', 'paid', 'pending', NULL, '2025-10-17 11:31:43', '2025-10-23', NULL, '2025-10-17 08:02:18'),
(14, 11, 1, 'Pawani Kumari ', 'pawani@gmail.com', '0772089738', 'nima', 'drawing', 'colored-pencils', '24x30', 2000, '2025-10-25', '', NULL, 'normal', 'REJECTED', 'PENDING', 'N/A', NULL, '2025-10-17 11:34:48', NULL, 'Too busy with current projects', '2025-10-17 08:05:20'),
(15, 11, 1, 'Pawani Kumari ', 'pawani@gmail.com', '0772089738', 'nima', 'painting', 'markers', '9x12', 2000, '2025-10-25', '', NULL, 'normal', 'ACCEPTED', 'PENDING', 'pending', 1111, '2025-10-17 12:10:41', '2025-10-18', NULL, '2025-10-17 08:41:12');

--
-- Triggers `commission_requests`
--
DELIMITER $$
CREATE TRIGGER `update_commission_status_on_deadline` AFTER UPDATE ON `commission_requests` FOR EACH ROW BEGIN
    IF NEW.status = 'pending' AND NEW.deadline < NOW() THEN
        UPDATE commission_requests
        SET status = 'cancelled'
        WHERE id = NEW.id;
    END IF;
END
$$
DELIMITER ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `commission_requests`
--
ALTER TABLE `commission_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `artist_id` (`artist_id`),
  ADD KEY `buyer_id` (`buyer_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `commission_requests`
--
ALTER TABLE `commission_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `commission_requests`
--
ALTER TABLE `commission_requests`
  ADD CONSTRAINT `commission_requests_ibfk_1` FOREIGN KEY (`artist_id`) REFERENCES `artists` (`artist_id`),
  ADD CONSTRAINT `commission_requests_ibfk_2` FOREIGN KEY (`buyer_id`) REFERENCES `buyers` (`buyer_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
