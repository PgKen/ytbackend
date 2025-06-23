-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 23, 2025 at 10:54 AM
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
-- Table structure for table `tb_unit`
--

CREATE TABLE `tb_unit` (
  `id_unit` int(10) NOT NULL,
  `unitname` varchar(50) NOT NULL,
  `unitname_en` varchar(50) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tb_unit`
--

INSERT INTO `tb_unit` (`id_unit`, `unitname`, `unitname_en`) VALUES
(1, 'กิโลกรัม', 'kg'),
(2, 'มัด', 'bundle'),
(3, 'กรัม', 'g'),
(4, 'ขีด', 'clas'),
(5, 'กล่อง', 'boxes'),
(6, 'หัว', 'heads'),
(7, 'ถุง', 'bags'),
(8, 'แพ็ค', 'packs'),
(9, 'ลัง', 'backs'),
(10, 'ลูก', 'piece'),
(11, 'ร้อยละ', '\npercent'),
(12, 'หวี', 'bundle'),
(13, 'ห่อ', 'packs'),
(14, 'กำ', 'bundle');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tb_unit`
--
ALTER TABLE `tb_unit`
  ADD PRIMARY KEY (`id_unit`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tb_unit`
--
ALTER TABLE `tb_unit`
  MODIFY `id_unit` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
