-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: mysql-artaura.alwaysdata.net
-- Generation Time: Oct 16, 2025 at 04:20 PM
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
-- Table structure for table `AW_orders`
--

CREATE TABLE `AW_orders` (
  `id` int(11) NOT NULL,
  `buyer_id` bigint(20) NOT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `email` varchar(32) DEFAULT NULL,
  `order_date` datetime NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `shipping_fee` decimal(50,0) DEFAULT NULL,
  `shipping_address` text DEFAULT NULL,
  `contact_number` varchar(32) DEFAULT NULL,
  `status` varchar(32) DEFAULT 'paid',
  `delivery_status` enum('pending','accepted','outForDelivery','delivered','N/A') DEFAULT 'N/A',
  `payment_method` varchar(32) DEFAULT NULL,
  `stripe_payment_id` varchar(128) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `AW_orders`
--

INSERT INTO `AW_orders` (`id`, `buyer_id`, `first_name`, `last_name`, `email`, `order_date`, `total_amount`, `shipping_fee`, `shipping_address`, `contact_number`, `status`, `delivery_status`, `payment_method`, `stripe_payment_id`) VALUES
(9, 1, 'pawani2002', 'Kumari2002', 'pawanibuyer@gmail.com', '2025-08-16 01:05:38', 7000.00, NULL, 'pinnalandawatta, bathamburaya, rambukkana, 71100, Sri Lanka', '0741748684', 'paid', 'pending', 'stripe', 'pi_3RwTPWQcGakY3xP22rT0KqbV'),
(10, 1, 'pawani2002', 'Kumari2002', 'pawanibuyer@gmail.com', '2025-08-26 23:22:35', 800.00, NULL, 'pinnalandawatta, bathamburaya, rambukkana, 71100, Sri Lanka', '0741748684', 'paid', 'outForDelivery', 'stripe', 'pi_3S0R2pQcGakY3xP21xfij8pT'),
(11, 1, 'pawani2002', 'Kumari2002', 'pawanibuyer@gmail.com', '2025-08-28 14:41:23', 800.00, NULL, 'pinnalandawatta, bathamburaya, rambukkana, 71100, Sri Lanka', '0741748684', 'paid', 'accepted', 'stripe', 'pi_3S11rYQcGakY3xP228SuGvdF'),
(12, 1, 'pawani2002', 'Kumari2002', 'pawanibuyer@gmail.com', '2025-09-02 19:35:00', 800.00, NULL, 'pinnalandawatta, bathamburaya, rambukkana, 71100, Sri Lanka', '0741748684', 'paid', NULL, 'stripe', 'pi_3S2upRQcGakY3xP20b2AUOlo'),
(13, 1, 'pawani2002', 'Kumari', 'pawanibuyer@gmail.com', '2025-09-05 23:31:34', 4500.00, NULL, 'pinnalandawatta, bathamburaya, rambukkana, 71100, Sri Lanka', '0741748684', 'paid', 'accepted', 'stripe', 'pi_3S43x0QcGakY3xP22q4iOqtp'),
(14, 1, 'pawani2002', 'Kumari', 'pawanibuyer@gmail.com', '2025-09-05 23:34:50', 3000.00, NULL, 'pinnalandawatta, bathamburaya, rambukkana, 71100, Sri Lanka', '0741748684', 'paid', 'delivered', 'stripe', 'pi_3S440BQcGakY3xP21O0JvPdN');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `AW_orders`
--
ALTER TABLE `AW_orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `buyer_id` (`buyer_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `AW_orders`
--
ALTER TABLE `AW_orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `AW_orders`
--
ALTER TABLE `AW_orders`
  ADD CONSTRAINT `AW_orders_ibfk_1` FOREIGN KEY (`buyer_id`) REFERENCES `buyers` (`buyer_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
