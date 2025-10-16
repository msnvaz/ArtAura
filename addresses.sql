-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: mysql-artaura.alwaysdata.net
-- Generation Time: Oct 16, 2025 at 11:11 AM
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
-- Table structure for table `addresses`
--

CREATE TABLE `addresses` (
  `id` bigint(20) NOT NULL,
  `city` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `street_address` varchar(255) DEFAULT NULL,
  `zip_code` varchar(255) DEFAULT NULL,
  `artist_id` bigint(20) DEFAULT NULL,
  `buyer_id` bigint(20) DEFAULT NULL,
  `shop_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `addresses`
--

INSERT INTO `addresses` (`id`, `city`, `country`, `state`, `street_address`, `zip_code`, `artist_id`, `buyer_id`, `shop_id`) VALUES
(1, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL),
(3, 'bathamburaya', NULL, 'rambukkana', 'pinnalandawatta', '71100', NULL, 1, NULL),
(12, 'bchsdkvf', 'cjbskdhf', 'cshdvd', 'jbfhskf', '23548', NULL, NULL, 7),
(14, 'Moratuwa', 'Sri Lanka', 'State ', '123', '10400', NULL, NULL, 9),
(17, 'Kuruegala', 'Sri Lanka', 'NW', '\"Kumari\" Niwasa, Morathihe', '23456', NULL, NULL, 13),
(18, 'Kuruegala', 'Sri Lanka', 'NW', '\"Kumari\" Niwasa, Morathihe', '1234', NULL, NULL, 14),
(19, 'Mathara', 'Sri Lanka', 'SP', 'No04,Kamil Lane ', '60038', NULL, NULL, 15);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKfmyb6lvs66ed6i24u47omxiuj` (`artist_id`),
  ADD UNIQUE KEY `UKmx6hjjm799r4u0frqg4rcsqnm` (`buyer_id`),
  ADD UNIQUE KEY `UK8gvrhp66s5s7x9tu8101hwips` (`shop_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addresses`
--
ALTER TABLE `addresses`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `addresses`
--
ALTER TABLE `addresses`
  ADD CONSTRAINT `FKklmct5uegqru5ix9797e4b403` FOREIGN KEY (`shop_id`) REFERENCES `shops` (`shop_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FKmhl3eqcwrnywk83offs9ja068` FOREIGN KEY (`artist_id`) REFERENCES `artists` (`artist_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FKp2p0gwrvy9h6kd3m9yn8338f` FOREIGN KEY (`buyer_id`) REFERENCES `buyers` (`buyer_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
