-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: mysql-artaura.alwaysdata.net
-- Generation Time: Oct 17, 2025 at 01:20 PM
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
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `id` int(11) NOT NULL,
  `AW_order_id` int(11) DEFAULT NULL,
  `commission_request_id` int(11) DEFAULT NULL,
  `artist_id` bigint(11) NOT NULL,
  `buyer_id` bigint(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('escrow','paid','refunded') NOT NULL DEFAULT 'escrow',
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`id`, `AW_order_id`, `commission_request_id`, `artist_id`, `buyer_id`, `amount`, `status`, `created_at`, `updated_at`) VALUES
(1, 17, NULL, 11, 1, 6500.00, 'escrow', '2025-10-16 17:48:32', '2025-10-17 13:15:10'),
(2, 18, NULL, 11, 1, 3600.00, 'escrow', '2025-10-16 17:56:58', '2025-10-17 13:15:16'),
(4, NULL, 7, 11, 1, 1800.00, 'escrow', '2025-10-17 13:15:30', NULL);

--
-- Triggers `payment`
--
DELIMITER $$
CREATE TRIGGER `update_payment_timestamp` BEFORE UPDATE ON `payment` FOR EACH ROW BEGIN
  IF NOT (NEW.status <=> OLD.status) THEN
    SET NEW.updated_at = NOW();
  END IF;
END
$$
DELIMITER ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_payment_aw_order` (`AW_order_id`),
  ADD KEY `fk_payment_commission_request` (`commission_request_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `fk_payment_aw_order` FOREIGN KEY (`AW_order_id`) REFERENCES `AW_orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_payment_commission_request` FOREIGN KEY (`commission_request_id`) REFERENCES `commission_requests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
