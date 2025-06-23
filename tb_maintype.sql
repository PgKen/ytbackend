-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 23, 2025 at 10:25 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_price`
--

-- --------------------------------------------------------

--
-- Table structure for table `tb_maintype`
--

CREATE TABLE `tb_maintype` (
  `id_maintype` int(10) NOT NULL,
  `name_mtype` varchar(50) NOT NULL,
  `bud` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tb_maintype`
--

INSERT INTO `tb_maintype` (`id_maintype`, `name_mtype`, `bud`) VALUES
(1, 'ผักทั่วไป', 1),
(6, 'อาหารสด', 5),
(8, 'ผักปรุงรส', 1),
(9, 'ผักเมืองหนาว', 2),
(10, 'ผักพื้นบ้าน', 1),
(11, 'ผลไม้ฤดูกาล', 3),
(12, 'ผลไม้นอก', 3),
(14, 'พืชไร่', 4),
(15, 'ส้ม', 4);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tb_maintype`
--
ALTER TABLE `tb_maintype`
  ADD PRIMARY KEY (`id_maintype`) USING BTREE,
  ADD KEY `id_maintype` (`id_maintype`) USING BTREE,
  ADD KEY `bud` (`bud`) USING BTREE;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tb_maintype`
--
ALTER TABLE `tb_maintype`
  MODIFY `id_maintype` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
