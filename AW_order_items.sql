-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: mysql-artaura.alwaysdata.net
-- Generation Time: Oct 16, 2025 at 09:40 AM
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
-- Table structure for table `AW_order_items`
--

CREATE TABLE `AW_order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `artwork_id` bigint(20) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `artist_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `AW_order_items`
--

INSERT INTO `AW_order_items` (`id`, `order_id`, `artwork_id`, `quantity`, `price`, `title`, `artist_id`) VALUES
(6, 9, 19, 1, 7000.00, 'Wakanda Forever', 11),
(7, 10, 3, 1, 800.00, 'Abstract Flow', 1),
(8, 11, 3, 1, 800.00, 'Abstract Flow', 1),
(9, 12, 3, 1, 800.00, 'Abstract Flow', NULL),
(10, 13, 22, 1, 4500.00, 'Woman in dark', 11),
(11, 14, 14, 1, 3000.00, 'Birds 2', 11);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `AW_order_items`
--
ALTER TABLE `AW_order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `artist_id` (`artist_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `artwork_id` (`artwork_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `AW_order_items`
--
ALTER TABLE `AW_order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `AW_order_items`
--
ALTER TABLE `AW_order_items`
  ADD CONSTRAINT `AW_order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `AW_orders` (`id`),
  ADD CONSTRAINT `AW_order_items_ibfk_2` FOREIGN KEY (`artist_id`) REFERENCES `artists` (`artist_id`),
  ADD CONSTRAINT `AW_order_items_ibfk_3` FOREIGN KEY (`artwork_id`) REFERENCES `artworks` (`artwork_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
