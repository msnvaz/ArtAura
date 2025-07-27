-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: mysql-artaura.alwaysdata.net
-- Generation Time: Jul 27, 2025 at 07:18 AM
-- Server version: 10.11.13-MariaDB
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
-- Table structure for table `shops`
--

CREATE TABLE `shops` (
  `shop_id` bigint(20) NOT NULL,
  `agreed_terms` bit(1) NOT NULL,
  `business_license` varchar(255) DEFAULT NULL,
  `business_type` varchar(255) DEFAULT NULL,
  `contact_no` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT current_timestamp(6),
  `description` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `owner_name` varchar(255) DEFAULT NULL,
  `nic` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `shop_name` varchar(255) DEFAULT NULL,
  `tax_id` varchar(255) DEFAULT NULL,
  `status` enum('Active','Suspended') DEFAULT 'Active',
  `nic_image_url` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shops`
--

INSERT INTO `shops` (`shop_id`, `agreed_terms`, `business_license`, `business_type`, `contact_no`, `created_at`, `description`, `email`, `owner_name`, `nic`, `password`, `shop_name`, `tax_id`, `status`, `nic_image_url`) VALUES
(1, b'1', 'BL56848', 'Partnership', '0112514362', '2025-06-28 16:40:00.000000', 'good vibes', 'clane23@gmail.com', 'Lane', NULL, '$2a$10$2R1qw7kfT8oSHW8o1lzL/.x/6qbNOjj7rs1UF7IeZHtXh7lTI/586', 'Colours', '21-56484', 'Suspended', NULL),
(2, b'1', 'huyyrretxe', 'Sole Proprietorship', '25468876', '2025-06-30 21:08:28.000000', 'kjbyuvtcry', 'art2@gmail.com', 'Wall', NULL, '$2a$10$OktcnX5PTmZBVewn6eKpQOcoFSyQ2CMtYrWCtrgyk4w7TFbPS/SkG', 'Art', 'bhvfcdx', 'Active', NULL),
(7, b'1', '138477', 'Partnership', '235487', '2025-07-05 17:03:55.000000', 'jsnufegf', 'jcpaint56@gmail.com', 'LK', NULL, '$2a$10$D1gH4HOZ6K7rwuyKlLtWIeDKUOcvkkuXv/RARM6l6MJbixB5mZHvi', 'Paint', '3154384', 'Active', NULL),
(8, b'1', 'B4557889', 'Sole Proprietorship', '0741748684', '2025-07-21 20:08:03.000000', 'Best in the town', 'rasanjani9jayasingha@gmail.com', 'Wamee', NULL, '$2a$10$hAjbZ2TW6np6UyeydiXB/.Nfpeys69XRPn2FMpNOxtM74Nr9BFSfq', 'Paper Coner', '12-3456', 'Active', NULL),
(9, b'1', '', 'Sole Proprietorship', '0767777777', '2025-07-21 20:11:31.000000', 'CMB Modern Art', 'cmbmdrn@gmail.com', 'Athula', NULL, '$2a$10$kT87S32Auva2jh5Nh/swf.6cgBuhmsCzPZyar6l3RURT289E2bpay', 'Colombo Modern', '', 'Active', NULL),
(10, b'1', 'BL123456789', 'Art Supply Store', '+1234567890', '2025-07-24 09:01:00.000000', 'A beautiful art supply store specializing in high-quality materials for artists.', 'test@example.com', 'John Doe', NULL, '', 'Art & Craft Studio', 'TX987654321', 'Active', NULL),
(11, b'1', 'BL123451234', 'Sole Proprietorship', '072875050500', '2025-07-25 10:42:28.000000', 'Best shop in area ', 'CNA@gmail.com', 'Kaninda', NULL, '$2a$10$FvBd7HrsLtgLi8wgCq39LeIlU38nrxjQ0KLS34fGTaGodpT2wJdQG', 'CNA', '12345678', 'Active', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `shops`
--
ALTER TABLE `shops`
  ADD PRIMARY KEY (`shop_id`),
  ADD UNIQUE KEY `unique_email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `shops`
--
ALTER TABLE `shops`
  MODIFY `shop_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
