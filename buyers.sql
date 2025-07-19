-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 18, 2025 at 05:21 PM
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
-- Table structure for table `buyers`
--

CREATE TABLE `buyers` (
  `buyer_id` bigint(20) NOT NULL,
  `agreed_terms` bit(1) NOT NULL,
  `created_at` datetime(6) DEFAULT current_timestamp(6),
  `email` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `contactNo` varchar(11) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `status` enum('Active','Suspended') DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `buyers`
--

INSERT INTO `buyers` (`buyer_id`, `agreed_terms`, `created_at`, `email`, `first_name`, `last_name`, `contactNo`, `password`, `status`) VALUES
(1, b'1', '2025-06-28 00:22:27.000000', 'pawanibuyer@gmail.com', 'pawani', 'Kumari ', NULL, '$2a$10$GD8VWDBuK6BJnsNx9fugwOlrraS0gVOjHlJA9wwFjJ0yJnmKFI.ee', 'Active'),
(2, b'1', '2025-06-30 21:05:57.000000', 'pawanibuyer2@gmail.com', 'buy', 'me', NULL, '$2a$10$AvGXptKnhVd8GXRFsqAf7uCOAj3roeeochAx1iiZDcPHP2BDZ3UVa', 'Active'),
(3, b'0', '2025-07-05 10:07:48.178872', 'husddu@gmail.com', 'pawani', 'kumari', '02559492', '$2a$10$HoJG6a2wiW64dRGe8IZRtOpO6b/4QAOVo8MQMc2Z55Ek.P4CBJCU6', 'Active'),
(5, b'1', '2025-07-05 10:15:20.954181', 'pawahop2@gmail.com', 'pawani', 'Kumari ', NULL, '$2a$10$pgjSrQXn7t5Q7a7U7phVE.BMz.MXiMkzgn5GQN.xEraX7rXL.eTaW', 'Active'),
(7, b'1', '2025-07-05 17:03:00.200505', 'buy@gmail.com', 'akbyvf', 'dfd', '537', '$2a$10$6Gdyh4d2iWQD5whX7ggj3.aaRo3JQXxqZK1hrPTBjn2C5.CNgx2ZS', 'Active');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `buyers`
--
ALTER TABLE `buyers`
  ADD PRIMARY KEY (`buyer_id`),
  ADD UNIQUE KEY `unique_email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `buyers`
--
ALTER TABLE `buyers`
  MODIFY `buyer_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
