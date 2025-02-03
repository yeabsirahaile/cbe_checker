-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 01, 2025 at 07:45 AM
-- Server version: 10.11.10-MariaDB-cll-lve
-- PHP Version: 8.3.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `finishmh_payment`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `telebirr_phone_number` varchar(20) NOT NULL,
  `telebirr_name` varchar(255) NOT NULL,
  `cbe_receiver_name` varchar(255) NOT NULL,
  `cbe_account_number` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `username`, `password`, `telebirr_phone_number`, `telebirr_name`, `cbe_receiver_name`, `cbe_account_number`, `created_at`, `updated_at`) VALUES
(1, 'admin', '$2a$12$D9MSkPZPntLoTt.wo.u1Nu4TitKQ/QvXrYkd2wDZt5w2B7ghDbbzm', '0914086037', 'REKAN KEDIR NURHUSSEN', 'YEabsira haile abreha', '1000296720848', '2025-01-27 18:02:40', '2025-02-01 06:22:16');

-- --------------------------------------------------------

--
-- Table structure for table `cbe_transactions`
--

CREATE TABLE `cbe_transactions` (
  `id` int(11) NOT NULL,
  `receiver` varchar(255) NOT NULL,
  `payer` varchar(255) NOT NULL,
  `receiver_account` varchar(50) NOT NULL,
  `payment_date` datetime NOT NULL,
  `transferred_amount` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `reference_no` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cbe_transactions`
--

INSERT INTO `cbe_transactions` (`id`, `receiver`, `payer`, `receiver_account`, `payment_date`, `transferred_amount`, `created_at`, `reference_no`) VALUES
(3, 'MELIKAMU TEWABE LIYEW', 'YEABSIRA HAILE ABREHA', '0848', '2024-11-24 00:05:00', 7.00, '2025-01-27 15:28:29', 'FT243309996W');

-- --------------------------------------------------------

--
-- Table structure for table `telebirr_transactions`
--

CREATE TABLE `telebirr_transactions` (
  `id` int(11) NOT NULL,
  `transaction_number` varchar(50) NOT NULL,
  `payer_name` varchar(255) NOT NULL,
  `transaction_date` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `telebirr_transactions`
--

INSERT INTO `telebirr_transactions` (`id`, `transaction_number`, `payer_name`, `transaction_date`, `created_at`) VALUES
(2, 'CAD6AQMWTM', 'Rediet Anteneh Hailu', '2025-01-13 10:43:25', '2025-01-27 14:23:19');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `cbe_transactions`
--
ALTER TABLE `cbe_transactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reference_no` (`reference_no`);

--
-- Indexes for table `telebirr_transactions`
--
ALTER TABLE `telebirr_transactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `transaction_number` (`transaction_number`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `cbe_transactions`
--
ALTER TABLE `cbe_transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `telebirr_transactions`
--
ALTER TABLE `telebirr_transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
