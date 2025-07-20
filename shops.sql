-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 20, 2025 at 06:37 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

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
  `password` varchar(255) NOT NULL,
  `shop_name` varchar(255) DEFAULT NULL,
  `tax_id` varchar(255) DEFAULT NULL,
  `status` enum('Active','Suspended') DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shops`
--

INSERT INTO `shops` (`shop_id`, `agreed_terms`, `business_license`, `business_type`, `contact_no`, `created_at`, `description`, `email`, `owner_name`, `password`, `shop_name`, `tax_id`, `status`) VALUES
(1, b'1', 'BL56848', 'Partnership', '0112514362', '2025-06-28 16:40:00.000000', 'good vibes', 'francky@gmail.com', 'oicwv', '$2a$10$2R1qw7kfT8oSHW8o1lzL/.x/6qbNOjj7rs1UF7IeZHtXh7lTI/586', 'pawani', '21-56484', 'Active'),
(2, b'1', 'huyyrretxe', 'Sole Proprietorship', '25468876', '2025-06-30 21:08:28.000000', 'kjbyuvtcry', 'pawanishop2@gmail.com', 'by', '$2a$10$OktcnX5PTmZBVewn6eKpQOcoFSyQ2CMtYrWCtrgyk4w7TFbPS/SkG', 'helo', 'bhvfcdx', 'Active'),
(7, b'1', '138477', 'Partnership', '235487', '2025-07-05 17:03:55.000000', 'jsnufegf', 'a1@gmail.com', 'bhkf', '$2a$10$D1gH4HOZ6K7rwuyKlLtWIeDKUOcvkkuXv/RARM6l6MJbixB5mZHvi', 'cfef', '3154384', 'Active');

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
  MODIFY `shop_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
