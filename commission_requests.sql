-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: mysql-artaura.alwaysdata.net
-- Generation Time: Oct 16, 2025 at 09:41 AM
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
  `budget` varchar(50) NOT NULL,
  `deadline` date NOT NULL,
  `additional_notes` text DEFAULT NULL,
  `shipping_address` varchar(255) DEFAULT NULL,
  `urgency` varchar(20) DEFAULT 'normal',
  `status` varchar(20) DEFAULT 'pending',
  `delivery_status` enum('pending','accepted','outForDelivery','delivered','N/A') NOT NULL DEFAULT 'N/A',
  `submitted_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `commission_requests`
--

INSERT INTO `commission_requests` (`id`, `artist_id`, `buyer_id`, `name`, `email`, `phone`, `title`, `artwork_type`, `style`, `dimensions`, `budget`, `deadline`, `additional_notes`, `shipping_address`, `urgency`, `status`, `delivery_status`, `submitted_at`) VALUES
(7, 11, 1, 'Nimal Perera', 'nimal.perera@gmail.com', '+94 77 123 4567', 'Portrait of a Family', 'painting', 'oil-painting', '16x20', 'Rs 30,000', '2025-09-15', 'Please include a background of our home.', 'No. 123, Galle Road, Colombo 06, 00600, Sri Lanka', 'normal', 'accepted', 'pending', '2025-08-16 10:00:00'),
(9, 11, 1, 'Ruwan Silva', 'ruwan.silva@gmail.com', '+94 76 555 1234', 'Pet Sculpture', 'sculpture', 'ceramics', '12x16', 'Rs 50,000', '2025-10-10', 'A ceramic sculpture of our dog.', '45/2, Kandy Road, Kaduwela, 10640, Sri Lanka\"\n', 'low', 'accepted', 'outForDelivery', '2025-08-16 12:00:00'),
(10, 11, 1, 'pawani saman', 'saman@gmail.com', '+94035225554', 'ele', 'painting', 'oil-painting', '8x10', '2000', '2025-08-23', 'ibdc', '43/2, Kadawatha Road, Ragama, 10240, Sri Lanka', 'normal', 'accepted', 'outForDelivery', '2025-08-18 10:06:29');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

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
