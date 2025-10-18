-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: mysql-artaura.alwaysdata.net
-- Generation Time: Oct 17, 2025 at 12:46 PM
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
  `image` blob NOT NULL,
  `bio` varchar(255) DEFAULT NULL,
  `status` enum('Active','Suspended') DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `buyers`
--

INSERT INTO `buyers` (`buyer_id`, `agreed_terms`, `created_at`, `email`, `first_name`, `last_name`, `contactNo`, `password`, `image`, `bio`, `status`) VALUES
(1, b'1', '2025-06-28 00:22:27.000000', 'pawanibuyer@gmail.com', 'pawani2002', 'Kumari', '0741748684', '$2a$10$/tJRmH27KIo5Wk6Qd4N8i.aqFz1kQ6Ciby02G/MRPJnrN7H.DPCqa', 0x2f75706c6f6164732f70726f66696c655f315f313735363832323037393133352e6a7067, 'pissek yes pissek', 'Active'),
(2, b'1', '2025-06-30 21:05:57.000000', 'JaninduNKr2@gmail.com', 'Janindu', 'Hansaka', NULL, '$2a$10$AvGXptKnhVd8GXRFsqAf7uCOAj3roeeochAx1iiZDcPHP2BDZ3UVa', '', NULL, 'Active'),
(3, b'0', '2025-07-05 10:07:48.178872', 'vazJ12@gmail.com', 'Kavindu', 'Vass', '02559492', '$2a$10$HoJG6a2wiW64dRGe8IZRtOpO6b/4QAOVo8MQMc2Z55Ek.P4CBJCU6', '', NULL, 'Suspended'),
(5, b'1', '2025-07-05 10:15:20.954181', 'HanskaPW@gmail.com', 'Pawan', 'Hansaka', NULL, '$2a$10$pgjSrQXn7t5Q7a7U7phVE.BMz.MXiMkzgn5GQN.xEraX7rXL.eTaW', '', NULL, 'Suspended'),
(7, b'1', '2025-07-05 17:03:00.200505', 'janithdilshan45gmail.com', 'Janith', 'Dilshan', '537', '$2a$10$6Gdyh4d2iWQD5whX7ggj3.aaRo3JQXxqZK1hrPTBjn2C5.CNgx2ZS', '', NULL, 'Active'),
(8, b'1', '2025-07-21 20:04:06.650607', 'sv2@gmail.com', 'Sandeep', 'Vaz', '07878985458', '$2a$10$e4C1NqgyjUD1FIg4inSKXe6MIxhpxqNkr8c.TP92U58T.Kjx0Yohy', '', NULL, 'Active'),
(9, b'1', '2025-07-22 05:24:50.619942', 'anushad@gmail.com', 'Anushad', 'Kaveera', '0771122222', '$2a$10$02UDK8zcdVaJpLkuljPcqeiPz5FZuqWUQOAyRSU.2T7KfJJHbhrnW', '', NULL, 'Active');

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
  MODIFY `buyer_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
