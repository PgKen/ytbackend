-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 23, 2025 at 12:09 PM
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
-- Database: `db_yt`
--

-- --------------------------------------------------------

--
-- Table structure for table `tb_maintype`
--

CREATE TABLE `tb_maintype` (
  `id` int(10) NOT NULL,
  `name_maintype` varchar(255) NOT NULL,
  `bud` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tb_maintype`
--

INSERT INTO `tb_maintype` (`id`, `name_maintype`, `bud`) VALUES
(1, 'ผักทั่วไป', 1),
(6, 'อาหารสด', 5),
(8, 'ผักปรุงรส', 1),
(9, 'ผักเมืองหนาว', 2),
(10, 'ผักพื้นบ้าน', 1),
(11, 'ผลไม้ฤดูกาล', 3),
(12, 'ผลไม้นอก', 3),
(14, 'พืชไร่', 4),
(15, 'ส้ม', 4);

-- --------------------------------------------------------

--
-- Table structure for table `tb_price`
--

CREATE TABLE `tb_price` (
  `id` int(11) NOT NULL,
  `price_date` date NOT NULL DEFAULT current_timestamp(),
  `price_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `id_prod` int(11) NOT NULL,
  `id_result` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_product`
--

CREATE TABLE `tb_product` (
  `id_product` int(10) NOT NULL,
  `name_pro` varchar(100) NOT NULL,
  `id_group` int(11) NOT NULL,
  `name_pro_en` varchar(100) NOT NULL,
  `name_pro_cn` varchar(255) NOT NULL,
  `id_unit` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tb_product`
--

INSERT INTO `tb_product` (`id_product`, `name_pro`, `id_group`, `name_pro_en`, `name_pro_cn`, `id_unit`) VALUES
(1, 'กระเจี๊ยบเขียว', 1, 'Okra', '秋葵', 1),
(4, 'กะหล่ำปลีเขียว', 1, 'Green cabbage', '青菜', 1),
(6, 'กะหล่ำปลีม่วง', 1, 'Purple cabbage', '紫甘蓝', 1),
(7, 'กะหล่ำปลีหัวใจ', 1, 'Heart cabbage', '心白菜', 1),
(9, 'กุยช่ายขาว', 1, 'garlic chives', '蒜韭菜', 1),
(10, 'กุยช่ายดอก', 1, 'garlic chives', '蒜韭菜', 1),
(11, 'ข้าวโพดฝักอ่อน', 1, 'Baby corn', '玉米笋', 1),
(12, 'ขึ้นฉ่าย', 1, 'Celery', '芹菜', 1),
(13, 'แขนงคะน้า', 1, 'Kale', '羽衣甘蓝', 1),
(24, 'บวบเหลี่ยม', 1, 'Zucchini', '夏南瓜', 1),
(25, 'บวบงู', 1, 'Zucchini', '夏南瓜', 1),
(26, 'บวบหอม', 1, 'Zucchini', '夏南瓜', 1),
(27, 'ผักกวางตุ้งไต้หวัน', 1, 'Guangdong vegetable', '广东蔬菜', 1),
(28, 'ผักกวางตุ้งดอก', 1, 'Choy', '广东蔬菜', 1),
(29, 'ผักกวางตุ้งธรรมดา', 1, 'Choy', '广东蔬菜', 1),
(35, 'ผักกาดขาว(ลุ้ย)', 1, 'Chinese cabbage', '白菜', 1),
(36, 'ผักกาดหอม', 1, 'Lettuce', '生菜', 1),
(37, 'ผักขมจีน', 1, 'Chinese spinach', '中国菠菜', 1),
(38, 'ผักบุ้งไทย', 1, 'Thai Convolvulus', '喇叭花', 1),
(39, 'ผักบุ้งจีน', 1, 'Chinese Convolvulus', '喇叭花', 1),
(41, 'ฟักเขียวอ่อน', 1, 'winter melon', '冬瓜', 1),
(45, 'มะเขือเทศผลใหญ่ ', 1, 'Big tomatoes', '番茄', 1),
(46, 'มะเขือเทศราชินี ', 1, 'Cherry tomatoes', '番茄', 1),
(47, 'มะเขือเทศสีดา ', 1, 'Tomato', '番茄', 1),
(48, 'มะเขือเปราะ ', 1, 'Eggplant', '茄子', 1),
(49, 'มะเขือไข่เต่า ', 1, 'Eggplant Eggplant', '茄子', 1),
(50, 'มะเขือพวง ', 1, 'pea eggplant', '茄子', 1),
(52, 'มะเขือม่วง ', 1, 'Eggplant', '茄子', 1),
(53, 'มะเขือยาว ', 1, 'Eggplant ', '茄子', 1),
(56, 'มะเขือลิง ', 1, 'Eggplant', '茄子', 1),
(58, 'มะระจีน ', 1, 'Chinese gourd', '中国葫芦', 1),
(59, 'มะละกอดิบ ', 1, 'Raw papaya', '生木瓜', 1),
(62, 'ยอดมะพร้าว ', 1, 'Coconut', '椰子', 1),
(64, 'ลูกน้ำเต้า ', 1, 'Gourd', '葫芦', 1),
(72, 'เห็ดเป๋าฮื้อ ', 1, 'Abalone mushroom', '鲍鱼蘑菇', 1),
(73, 'เห็ดนางฟ้า ', 1, 'Mushroom', '菇', 1),
(74, 'เห็ดนางรม ', 1, 'Oyster mushroom', '平菇', 1),
(75, 'เห็ดฟาง ', 1, 'Straw mushroom', '草菇', 1),
(76, 'เห็ดหอมสด ', 1, 'Fresh mushroom', '新鲜的蘑菇', 1),
(77, 'เห็ดหูหนู ', 1, 'Mushroom', '菇', 1),
(78, 'เห็ดโคนญี่ปุ่น ', 1, 'Japanese mushroom', '日本蘑菇', 1),
(143, 'คะน้าต้น', 1, 'Kale', '羽衣甘蓝', 1),
(144, 'คะน้ายอด', 1, 'Kale', '羽衣甘蓝', 1),
(145, 'คะน้าฮ่องกง', 1, 'Hong Kong kale', '羽衣甘蓝', 1),
(146, 'แตงโมอ่อน', 1, 'Baby Watermelon', '西瓜', 1),
(147, 'แตงกวา', 1, 'cucumber', '黄瓜', 1),
(148, 'แตงร้าน', 1, 'Long Cucumber', '长黄瓜', 1),
(149, 'ถั่วฝักยาว', 1, 'Long bean', '长豆', 1),
(150, 'ถั่วพู', 1, 'Bean', '豆', 1),
(151, 'ถั่วลันเตาจีน', 1, 'Chinese beans', '豆', 1),
(152, 'ถั่วลันเตาหวานนอก', 1, 'Sweet beans', '豆', 1),
(153, 'กะหล่ำดอก(ขาว)', 1, 'Cauliflower (white)', '花椰菜（白色）', 1),
(154, 'ผักกระเฉด', 1, 'water minis', '水迷你', 1),
(155, 'มะเขือเขียวเสวย', 1, 'Green Ablong Eggplant', '绿色长方形茄子', 1),
(156, 'สายบัว', 1, 'lotus stem', '莲花茎', 1),
(157, 'ไหลบัว', 1, 'Flowing lotus', '流动的莲花', 1),
(158, 'เห็ดแพ็ค', 1, 'Mushroom packs', '蘑菇包', 1),
(159, 'กระชายหัว', 1, 'Fingerroot', '凹唇姜', 1),
(160, 'กระชายซอย', 1, 'Fingerroot', '凹唇姜', 1),
(161, 'ขมิ้นขาว(ปอก)', 1, 'White Turmeric', '白姜黄', 1),
(162, 'ขมิ้นเหลือง', 1, 'Yellow turmeric', '黄姜黄', 1),
(163, 'ขิงอ่อน', 1, 'Soft ginger', '软姜', 1),
(164, 'ขิงแก่', 1, 'Ginger', '生姜', 1),
(165, 'ขิงซอย', 1, 'Ginger', '生姜', 1),
(166, 'ข่าอ่อน', 1, 'Galangal', '高良姜', 1),
(167, 'ข่าแก่', 1, 'Galvanize', '高良姜', 1),
(168, 'ตะไคร้', 1, 'lemon grass', '柠檬草', 1),
(169, 'ต้นหอม', 1, 'Onion', '洋葱', 1),
(170, 'ผักชีไทย', 1, 'Coriander Thailand', '香菜泰国', 1),
(171, 'ผักชีฝรั่ง', 1, 'Parsley', '芹菜', 1),
(172, 'ผักชีลาว', 1, 'Dill', '莳萝', 1),
(176, 'ลูกมะกรูด', 1, 'Bergamot', '佛手柑', 1),
(177, 'ใบกระเพรา', 1, 'Holy basil', '圣罗勒', 1),
(178, 'ใบมะกรูด', 1, 'Lime leaf', '石灰叶', 1),
(179, 'ใบแมงลัก', 1, 'Basil', '罗勒', 1),
(180, 'ใบสะระแหน่', 1, 'Mint leaves', '薄荷叶', 1),
(181, 'ใบโหระพา', 1, 'Basil leaf', '罗勒叶', 1),
(182, 'พริกไทยอ่อน', 1, 'pepper', '胡椒', 1),
(183, 'พริกชี้ฟ้าเขียว', 1, 'Green chili', '青辣椒', 1),
(184, 'พริกชี้ฟ้าแดง', 1, 'Red chili', '红辣椒', 1),
(185, 'พริกจินดาเขียว', 1, 'Green chili', '青辣椒', 1),
(186, 'พริกจินดาแดง', 1, 'Red chili', '红辣椒', 1),
(188, 'พริกกะเหรี่ยง', 1, 'Bird chili', '辣椒', 1),
(189, 'พริกขี้หนูสวนใหญ่', 1, 'Big Chilli', '辣椒头', 1),
(190, 'พริกขี้หนูสวนเล็ก', 1, 'Small Chilli', '小辣椒', 1),
(191, 'พริกขี้หนูคลองท่อ', 1, 'Chilli', '辣椒', 1),
(192, 'พริกขี้หนูยอดสน', 1, 'Chilli', '小辣椒', 1),
(193, 'พริกยำเขียว', 1, 'Green Pepper', '绿皮书', 1),
(194, 'พริกยำแดง', 1, 'Red Pepper', '辣椒', 1),
(195, 'พริกมัน', 1, 'Chili', '辣椒', 1),
(196, 'พริกหยวก', 1, 'Bell pepper', '灯笼椒', 1),
(197, 'ใบกระเจี๊ยบ', 1, 'Okra', '秋葵', 1),
(198, 'มะระขี้นก', 1, 'Bitter gourd', '苦瓜', 1),
(199, 'ดอกแค', 1, 'Agasta', '大花田菁', 1),
(200, 'ดอกขี้เหล็ก', 1, 'Cassia', '决明子鲜花', 1),
(201, 'ดอกสลิด', 1, 'Cowslip creeper', '夜来香', 1),
(202, 'ดอกโสน', 1, 'Sesbania', '田菁', 1),
(204, 'อบเชย', 1, 'cinnamon', '肉桂', 1),
(205, 'ใบบัวบก', 1, 'Centella asiatica', '积雪草', 1),
(207, 'ใบเตย', 1, 'Pandanus odorus Ridl', '香兰', 1),
(208, 'ใบย่านาง', 1, 'Tiliacora triandra', '', 1),
(209, 'ผักบุ้งนา', 1, 'Thai water convolvulus', '蕹菜', 1),
(210, 'ยอดผักปลัง', 1, 'Ceylon spinach', '落葵', 1),
(211, 'ยอดฝักทอง', 1, 'Pumpkin', '大南瓜', 1),
(213, 'ยอดมะขามอ่อน', 1, 'Young Tamarind leaves', '罗望子', 1),
(215, 'ผักหวานบ้าน', 1, 'Star gooseberry', '罗望子', 1),
(216, 'ผักหวานป่า', 1, 'Melientha suavis Pierre', '蔬菜', 1),
(218, 'สะตอ', 1, 'Bitter bean', '臭豆', 1),
(219, 'สะเดา(ขม)', 1, 'Neem ', '印度苦楝樹', 1),
(221, 'ลูกมะกอก', 1, 'Hog plum', '橄', 1),
(222, 'มะขามป้อม', 1, 'Indian gooseberry', '餘甘子', 1),
(223, 'มะขามฝักอ่อน', 1, 'Tamarind', '罗望子荚', 1),
(224, 'เห็ดโคน', 1, 'Silver Sillago', '蘑菇', 1),
(226, 'เห็ดภูฎาน(ดอกใหญ่)', 1, 'Lung Oyster', '蘑菇不丹', 1),
(227, 'กระเทียมต้น', 1, 'Leek', '早期的大蒜', 1),
(228, 'กรีนโอ๊ค', 1, 'Green Oak', '绿橡树', 1),
(229, 'กรีนคอส', 1, 'Green Cos', '绿橡树', 1),
(230, 'กะหล่ำดอกนอก', 1, 'Cauliflower', '菜花', 1),
(231, 'กะหล่ำปลีม่วงไทย', 1, 'purple cabbage', '紫甘蓝', 1),
(232, 'กะหล่ำปลีเขียวจีน', 1, 'chinese cabbage', '卷心菜', 1),
(233, 'สะเดา(มัน)', 1, '', '', 1),
(234, 'ขึ้นฉ่ายฝรั่ง', 1, 'Celery', '芹菜', 1),
(235, 'คาราจีโอ้', 1, 'tatsoi', '塌棵菜', 1),
(236, 'ชูก้าสแน็ค(ถั่วหวาน)', 1, 'Sugar Snap Pea', '糖豌豆', 1),
(237, 'ซุกินี่', 1, 'Zucchini', '西葫芦', 1),
(238, 'ต้นหอมญี่ปุ่น', 1, 'Bunching onion', '洋葱', 1),
(239, 'ถั่วแดง', 1, 'Kidney bean', '菜豆', 1),
(240, 'บร็อคโคลี่จีน', 1, 'Chinese Broccoli', '中国西兰花', 1),
(241, 'บล็อคโคลี่ไทย', 1, 'Broccoli', '西兰花', 1),
(242, 'บัตเตอร์เฮท', 1, 'Butterhead Lettuce', '生菜', 1),
(243, 'บัวหิมะ', 1, 'Yacon', '菊薯', 1),
(244, 'บีทรูท', 1, 'Beetroot', '甜菜頭', 1),
(245, 'ปวยเหล็งไทย', 1, 'Spinach', '菠菜', 1),
(246, 'ผักกาดหางหงษ์', 1, 'Michilli Chinese Cabbage', '卷心菜', 1),
(247, 'ผักกาดแก้ว', 1, 'Lettuce', '卷心菜', 1),
(248, 'พริกหวานสีเขียว', 1, 'Green Sweet Pepper', '辣椒', 1),
(249, 'พริกหวานสีเหลือง', 1, 'Yellow Sweet Pepper', '辣椒', 1),
(250, 'พริกหวานสีแดง', 1, 'Red Sweet Pepper', '辣椒', 1),
(252, 'ฟักทองญี่ปุ่น', 1, 'Japanese Pumpkin', '日本南瓜', 1),
(253, 'พาร์สเลย์', 1, 'Parsley', '', 1),
(254, 'มะนาวเหลือง(เลมอน)', 1, 'Lemon', '柠檬', 1),
(255, 'มะเขือม่่วงก้านเขียว', 1, 'Thai PurpleEggplant', '茄', 1),
(256, 'มะเขือเทศโทมัส', 1, ' Tomato Thomas', '番茄', 1),
(257, 'มันฝรั่ง', 1, 'Potato', '土豆', 1),
(258, 'ยอดฟักแม้ว', 1, 'Chayote leaves', '佛手瓜叶', 1),
(259, 'ร็อคเก็ต', 1, 'Rocket', '', 1),
(260, 'ลูกฟักแม้ว', 1, 'Chayote Fruit', '佛手瓜果', 1),
(261, 'สลัดคอส', 1, 'Cos lettuce', '莴苣', 1),
(262, 'สลัดแก้ว', 1, 'Lettuce', '生菜', 1),
(263, 'สลัดใบแดง', 1, 'Red Lettuce ', '生菜', 1),
(264, 'อิตาเลี่ยน พาร์สเลย์', 1, 'Parsley', '香菜', 1),
(265, 'เซลอรี่', 1, 'Celery', '芹菜', 1),
(266, 'เบบี้บล็อคไทย', 1, 'Baby Thai Broccoli', '', 1),
(267, 'เบบี้หางหงษ์', 1, 'Baby Hawk', '', 1),
(268, 'เบบี้แครอท', 1, 'Baby Carrot', '胡萝卜', 1),
(269, 'เรดิชิโอ', 1, 'Radicchio', '菊苣', 1),
(270, 'เรดโอ้ค', 1, 'Red Oak', '红橡木生菜', 1),
(271, 'เสาวรส', 1, 'Passion fruit', '百香果', 1),
(273, 'เห็ดหอมสด', 1, 'Fresh mushroom', '新鲜的蘑菇', 1),
(274, 'เห็ดเข็มทอง', 1, 'Golden Mushroom', '蘑菇', 1),
(276, 'แตงกวาญี่ปุ่น', 1, 'Japanese Cucumber', '日本黄瓜', 1),
(277, 'แฟเนล', 1, 'Fennel', '茴香', 1),
(278, 'แรดิช', 1, 'Radish', '萝卜', 1),
(279, 'กระท้อนทับทิม', 1, 'Tub Tim Santol', '山陀儿', 1),
(280, 'กระท้อนอีหล้า', 1, 'E-La Santol', '山陀儿', 1),
(281, 'กระท้อนปุยฝ้าย', 1, 'Pui Fhai Santol', '山陀儿', 1),
(282, 'กล้วยไข่ดิบ', 1, 'Golden Banana', '香蕉', 1),
(283, 'กล้วยไข่สุุก', 1, 'Golden Ripe Banana', '香蕉', 1),
(284, 'กล้วยน้ำว้า', 1, 'Pisang Awak banana', '香蕉种植', 1),
(285, 'กล้วยหอม', 1, 'Cavendish Banana', '香蕉', 1),
(286, 'ขนุนทองประเสริฐ', 1, 'Tong Prasert Jack fruit', '菠萝蜜', 1),
(287, 'ขนุนทองสุดใจ', 1, 'Tong Sood Jai Jack fruit', '菠萝蜜', 1),
(288, 'ขนุนมาเลย์', 1, 'Malay Jack fruit', '菠萝蜜', 1),
(289, 'ขนุนเหรียญบาท', 1, 'Rean Bath Jack fruit', '菠萝蜜', 1),
(290, 'เงาโรงเรียน(โกย)', 1, 'Rong Rian Rambutan (Mix)', '红毛丹', 1),
(291, 'เงาะโรงเรียน(พวง)', 1, 'Rong Rian Rambutan (Bunch)', '红毛丹', 1),
(292, 'เงาะโรงเรียน(ใส่ลัง)', 1, 'Rambutan (In crate)', '红毛丹', 1),
(293, 'ชมพู่ทับทิมจันทร์', 1, 'Thapthim Chan Rose Apple', '蒲桃属', 1),
(294, 'ชมพู่ทูลเกล้า', 1, 'Thun Klaw Rose Apple', '蒲桃属', 1),
(295, 'ชมพู่เพชรสายรุ้ง', 1, 'Phet Sai Rung Rose Apple', '蒲桃属', 1),
(297, 'ทุเรียนก้านยาว', 1, 'Kan Yao Durian', '榴莲', 1),
(298, 'ทุเรียนชะนี', 1, 'Chani Durian', '榴莲', 1),
(299, 'ทุเรียนกระดุม', 1, 'Kradum Durian', '榴莲', 1),
(300, 'ทุเรียนหมอนทอง', 1, 'Mon Thong Durian', '榴莲', 1),
(301, 'น้อยหน่า', 1, 'Sugar apple', '释迦', 1),
(302, 'น้อยหน่าเพชรปากช่อง', 1, 'Phet Paak Chong  Sugar apple', '释迦', 1),
(303, 'ฝรั่งแป้นสีทอง', 1, 'Pan Si Thong Guava', '番石榴', 1),
(304, 'ฝรั่งกิมจู', 1, 'Kim Ju Guava', '金叶番石榴', 1),
(305, 'ฝรั่งกลมสาลี่', 1, 'Klom Sa Li  Guava', '番石榴', 1),
(306, 'ฝรั่งไร้เมล็ด', 1, 'Seedless Guava', '番石榴', 1),
(308, 'มะขามหวานขันตรี', 1, 'Khaan Three Sweet tamarind', '甜罗望子', 1),
(309, 'มะขามหวานประกายทอง', 1, 'Prakai Thong Sweet tamarind', '甜罗望子', 1),
(310, 'มะขามหวานสีทอง', 1, 'Golden Sweet tamarind', '甜罗望子', 1),
(311, 'มะขามหวานอินทผลัม', 1, 'Indhaplum Sweet tamarind', '甜罗望子', 1),
(312, 'มะปราง', 1, 'Marian plum', '', 1),
(313, 'มะไฟไข่เต่า', 1, 'Turtle egg  Burmese grape', '木奶果', 1),
(314, 'มะไฟเหรียญทอง', 1, 'Rianthong  Burmese grape', '木奶果', 1),
(315, 'มังคุด', 1, 'Mangosteen', '山竹', 1),
(316, 'มะละกอฮอลแลนด์', 1, 'Holland Papaya', '番木瓜', 1),
(317, 'มะละกอแต้ม/สุก', 1, 'Tam Papaya', '番木瓜', 1),
(318, 'มะละกอฮาวาย/สุก', 1, 'Papaya hawaii', '番木瓜', 1),
(319, 'มะละกอแขกดำ/สุก', 1, 'Papaya blackamoor', '番木瓜', 1),
(320, 'ระกำ', 1, 'Salacca', '', 1),
(321, 'มะม่วงแก้วดิบ', 1, 'Kaew  Green mango', '芒果', 1),
(322, 'มะม่วงเขียวมรกต', 1, 'Khiao Morakot Green mango', '芒果', 1),
(323, 'มะม่วงแก้มแดงดิบ', 1, 'Kaemdaeng mango', '芒果', 1),
(324, 'มะม่วงแก้มแดงสุก', 1, 'Kaemdaeng  Ripe mango', '芒果', 1),
(325, 'มะม่วงแก้วลืมรังดิบ', 1, 'Kaeo Luemrang mango', '芒果', 1),
(326, 'มะม่วงมันขุนศรี', 1, 'Manbangkhunsi mango', '芒果', 1),
(327, 'มะม่วงเขียวเสวย', 1, 'Khiaosawoey mango', '芒果', 1),
(328, 'มะม่วงโชคอนันต์', 1, 'Chok Anan mango', '芒果', 1),
(329, 'มะม่วงมันเดือนเก้า', 1, 'Nam Green mango', '芒果', 1),
(330, 'มะม่วงน้ำดอกไม้ดิบ', 1, 'Nam Dokmai Green mango', '芒果', 1),
(331, 'มะม่วงน้ำดอกไม้สุก', 1, 'Nam Dokmai Ripe mango', '芒果', 1),
(332, 'มะม่วงฟ้าลั่น', 1, 'Falan mango', '芒果', 1),
(333, 'มะม่วงมันหมู', 1, 'Manmu mango', '芒果', 1),
(334, 'มะม่วงแรด', 1, 'Raet mango', '芒果', 1),
(335, 'มะม่วงหนองแซง', 1, 'Nongsaeng  mango', '芒果', 1),
(336, 'มะม่่วงหนังกลางวันดิบ', 1, 'Nangklangwan mango', '芒果', 1),
(337, 'มะม่วงหนังกลางวันสุก', 1, 'Nangklangwan Ripe mango', '芒果', 1),
(338, 'มะม่วงอกร่อง', 1, 'Okrong mango', '芒果', 1),
(340, 'มะม่วงอกร่องทอง', 1, 'Okrong Thong Mango', '芒果', 1),
(341, 'มะม่วงเจ้าคุณทิพย์', 1, 'Chaokhunthip  Mango', '芒果', 1),
(342, 'มะม่วงทองดำ', 1, 'Thongdum  Mango', '芒果', 1),
(343, 'พุทราสามรส', 1, 'Saamrod Jujube', '枣', 1),
(344, 'พุทราแอปเปิ้ล', 1, 'Apple Jujube', '枣', 1),
(345, 'พุทราบอมส์', 1, 'Boms Jujube', '枣', 1),
(346, 'ลองกอง', 1, 'Longkong', '蘭撒', 1),
(347, 'ละมุดไข่ห่าน', 1, 'Goose eggs Sapodilla', '人心果', 1),
(348, 'ละมุดมาเลย์', 1, 'Malay Sapodilla', '人心果', 1),
(349, 'ละไม', 1, 'Lamai', '多脉木奶果', 1),
(350, 'ลางสาด', 1, 'Fairy', '', 1),
(351, 'ลำไยอีดอ', 1, 'E- Do Longan', '龙眼', 1),
(352, 'ลำไยกระโหลก', 1, 'Kralok Longan', '龙眼', 1),
(353, 'ลำไยสีชมพู', 1, 'Pink Longan', '龙眼', 1),
(354, 'ลิ้นจี่ค่อม', 1, 'Kom Lychee', '荔枝', 1),
(355, 'ลิ้นจี่จักรพรรดิ์', 1, 'Chakraphat Lychee', '荔枝', 1),
(356, 'ลิ้นจี่ฮองฮวย', 1, 'Honghuai Lychee', '荔枝', 1),
(357, 'ส้มโอขาวน้ำผึ้ง', 1, 'Khao Namphung Pomelo', '荔枝', 1),
(358, 'ส้มโอขาวใหญ่', 1, 'Khao Yai Pomelo', '柚', 1),
(359, 'ส้มโอทองดี', 1, 'Thong Dee pomelo', '柚', 1),
(360, 'สละ', 1, 'Sala', '蛇皮果', 1),
(361, 'สับปะรดใต้(ศรีราชา)', 1, 'Southern Pineapple', '菠萝', 1),
(362, 'สับปะรดปัตตาเวีย', 1, 'Pineapple Batavia', '菠萝', 1),
(364, 'แก้วมังกรแดง', 1, 'Dragon Fruit( Red Flesh)', '火龙果', 1),
(365, 'แคนตาลูป', 1, 'Cantaloupe', '哈密瓜', 1),
(366, 'มะกอก', 1, 'Olive', '橄', 1),
(367, 'องุ่นเขียว', 1, 'Green Grapes', '绿葡萄', 1),
(368, 'องุ่นแดง', 1, 'Red Grapes', '红葡萄', 1),
(369, 'องุ่นดำ', 1, 'Black Grapes', '黑葡萄', 1),
(370, 'แตงโมกินรี', 1, 'Kinnaree Watermelon', '西瓜', 1),
(371, 'แตงโมจินตรา', 1, 'Jintara Watermelon', '西瓜', 1),
(372, 'แตงโมตอปิโด', 1, 'Torpedo Watermelon', '西瓜', 1),
(373, 'แตงโมเหลือง', 1, 'Yellow Watermelon', '西瓜', 1),
(374, 'มะพร้าวน้ำหอม', 1, 'Fragrant Coconut', '椰子', 1),
(375, 'มะพร้าวเผา', 1, 'Fire Coconut', '椰子', 1),
(376, 'ข้าวโพดหวาน(ปอกเปลือก)', 1, 'Sweet Corn (Peel)', '玉米', 1),
(377, 'ข้าวโพดหวาน(ไม่ปอกเปลือก)', 1, 'Sweet Corn (Do Not Peel)', '玉米', 1),
(378, 'แตงไทย', 1, 'Thai  Cantaloupe', '哈密瓜', 1),
(379, 'ถั่วลิสง', 1, 'Peanut', '花生米', 1),
(380, 'ถั่วแระ', 1, 'Soya', '黄豆', 1),
(381, 'มันแกว', 1, 'Yam Bean', '薯', 1),
(382, 'เผือกหอม', 1, 'Taro', '芋头', 1),
(383, 'มันเทศ', 1, 'Sweet Potato ', '甘薯', 1),
(384, 'มันไข่', 1, 'Yam', '甘薯', 1),
(385, 'มันต่อเผือก', 1, 'Sweet potato', '甘薯', 1),
(386, 'แห้ว', 1, 'Waternut', '油莎草', 1),
(388, 'แตงทิเบต', 1, 'Tibetan Melon', '瓜', 1),
(389, 'แตงฮามิกัว จีน', 1, 'Chinese Hamigua Melon', '哈密瓜', 1),
(390, 'ทับทิมน้ำผึ้ง จีน', 1, 'Chinese Honey Pomegranate', '石榴', 1),
(391, 'ทับทิมเนื้อชมพู จีน', 1, 'Chinese Pink Pomegranate', '石榴', 1),
(392, 'ทับทิมเนื้อแดง จีน', 1, 'Chinese Red Pomegranate', '石榴', 1),
(393, 'ลูกพลับ', 1, 'Persimmon', '柿子', 1),
(394, 'พุทราจีนแห้ง', 1, '\nChinese Dried  jujube', '中国干枣', 1),
(395, 'สตอเบอรี่', 1, 'Strawberry', '草莓', 1),
(396, 'ส้มแมนดาริน', 1, 'Mandarin Orange', '橘子', 1),
(397, 'เชอรี่', 1, 'Cherry', '樱桃', 1),
(398, 'สาลี่ญี่ปุ่น', 1, 'Japanese Pear', '梨', 1),
(399, 'สาลี่ก้านยาว', 1, 'Pear with Long stem', '梨', 1),
(400, 'สาลี่สีทอง', 1, 'Pear with Gold', '梨', 1),
(401, 'สาลี่น้ำผึ้ง', 1, 'Honey Pear', '梨', 1),
(402, 'สาลี่เป็ด', 1, 'Duck Pear', '梨', 1),
(403, 'สาลี่มงกุฎ', 1, 'Crown Pear', '梨', 1),
(404, 'สาลี่หยก', 1, 'Jade Pear', '梨', 1),
(405, 'สาลี่หอม', 1, 'Fragrant Pear', '梨', 1),
(406, 'สาลี่หิมะ', 1, 'Snow Pear', '梨', 1),
(407, 'แอปเปิ้ลจีนลังเล็ก', 1, 'Chinese Apple (small)', '苹果', 1),
(408, 'แอปเปิ้ลสีทอง', 1, 'Apple with gold', '苹果', 1),
(409, 'แอปเปิ้ลฟูจิลังใหญ่', 1, 'Fuji Apple (Big)', '苹果', 1),
(410, 'แอปเปิ้ลกาล่า นิวซีแลนด์', 1, 'Newzealand  Gala Apple', '苹果', 1),
(411, 'แอปเปิ้ลวอชิงตันแดง', 1, 'Washington Red Apple', '苹果', 1),
(412, 'แอปเปิ้ลวอชิงตันเขียว', 1, 'Washington Green Apple', '苹果', 1),
(413, 'องุ่นเขียวไร้เมล็ด อเมริกา', 1, 'America  Seedless Green Grapes', '绿葡萄', 1),
(414, 'องุ่นดำไร้เมล็ด/อเมริกา', 1, 'America  Seedless Black Grapes', '黑葡萄', 1),
(415, 'องุ่นแดงมีเมล็ด จีน', 1, 'Chinese red grapes', '红葡萄', 1),
(416, 'องุ่นแดงไร้เมล็ด จีน', 1, 'Chinese Seedless red grapes', '红葡萄', 1),
(417, 'มะเขือจาน', 1, 'Eggplant', '茄子', 1),
(419, 'หน่อไม้ฝรั่ง', 1, 'Asparagus', '芦笋', 1),
(420, 'ใบกุยช่าย', 1, 'Garlic chives ', '韭菜', 1),
(422, 'ส้มสายน้ำผึ้ง เบอร์ 4', 1, 'Orange Honey No.4', '橙子 4', 1),
(423, 'ส้มสายน้ำผึ้ง เบอร์ 5', 1, 'Orange Honey No.5', '橙子 5', 1),
(424, 'ส้มสายน้ำผึ้ง เบอร์ 6', 1, 'Orange Honey No.6', '橙子 6', 1),
(425, 'ส้มเขียวหวาน เบอร์ 0', 1, 'Tangerine No. 0', '橙子 0', 1),
(426, 'ส้มเขียวหวาน เบอร์ 1', 1, 'Tangerine No. 1', '橙子 1', 1),
(427, 'ส้มเขียวหวาน เบอร์ 2', 1, 'Tangerine No. 2', '橙子 2', 1),
(428, 'ส้มโชกุน เบอร์ 7', 1, 'Orange Shogun No.7', '橙子 - 7', 1),
(431, 'ส้มโชกุน เบอร์ 6', 1, 'Orange Shogun No.6', '橙子 - 6', 1),
(432, 'ส้มโชกุน เบอร์ 5', 1, 'Orange Shogun No.5', '橙子 - 5', 1),
(433, 'กระเทียมไม่ตัดหมวด', 1, 'garlic', '大蒜', 1),
(434, 'หอมแดงไม่ตัดหมวด', 1, 'Shallots', '青葱', 1),
(507, 'มะเขือบัวลอย', 1, 'Eggplant', '茄子', 1),
(508, 'มะเขือเหลือง', 1, 'Yellow Eggplant', '茄子', 1),
(509, 'ผักกาดหัว(ไชเท้า)', 1, 'White Radish', '白萝卜', 1),
(510, 'พริกเหลือง', 1, 'Hybrid Yellow Bird Chilli', '黄辣椒', 1),
(511, 'มะขามเปียกแกะเมล็ด', 1, 'Ripe tamarind', '成熟的罗望子', 1),
(512, 'อะโวคาโด', 1, 'Avocado', '鳄梨', 1),
(513, 'แครอทไทย', 1, 'Thai Carrot', '胡萝卜', 1),
(514, 'แครอทนอก', 1, 'Foreign carrot', '胡萝卜', 1),
(515, 'ใบพลู', 1, 'Betel', '蒌叶', 1),
(516, 'ถั่วแขก', 1, 'Bush Bean', '豆类', 1),
(517, 'ฟักทองลูกเล็ก', 1, 'Pumpkin (small)', '南瓜', 1),
(518, 'ฟักทองลูกใหญ่', 1, 'Pumpkin (Big)', '南瓜', 1),
(521, 'มะเฟือง', 1, 'Carambola', '杨桃', 1),
(522, 'กระจับ', 1, 'Chestnut', '栗', 1),
(527, 'ส้มจีน', 1, 'Mandarin', '橙', 1),
(528, 'ส้มเช้ง', 1, 'Citrus', '柑橘', 1),
(529, 'ดอกหอม', 1, 'Onion Flower Stem', '洋葱', 1),
(530, 'ลูกพลับแห้ง', 1, 'Dried persimmon', '柿饼干', 1),
(531, 'ลำไยพวงทอง', 1, 'Golden Longan', '龙眼', 1),
(532, 'เห็ดเข็มทอง(แพ็ค)', 1, 'Golden Mushroom', '蘑菇', 1),
(533, 'หน่อไม้ปี๊บ', 1, 'Pip bamboo shoots', '竹笋', 1),
(534, 'หน่อไม้ไผ่ตง', 1, 'Bamboosaceae', '竹笋', 1),
(535, 'ชะอม(ถุง)', 1, 'Climbing Wattle', '羽叶金合欢', 1),
(536, 'ยอดตำลึง', 1, 'Gourd', '红瓜', 1),
(537, 'หัวปลี (หัว)', 1, 'banana blossom', '香蕉开花', 1),
(538, 'ส้มสายน้ำผึ้ง เบอร์ 3', 1, 'Orange Honey No.3', '橙子 3', 1),
(543, 'ส้มโชกุน เบอร์ 4', 1, 'Orange Shogun No.4', '橙子-4', 1),
(544, 'ส้มโชกุน เบอร์ 3', 1, 'Orange Shogun No.3', '橙子-3', 1),
(547, 'ข้าวโพดข้าวเหนียว', 1, 'Corn Glutinous rice', '玉米糯米', 1),
(548, 'มะขามเทศ', 1, 'Manila tamarind', '马尼拉罗望子', 1),
(549, 'มะขามหวานสีชมพู', 1, 'Sweet pink tamarind', '甜罗望子', 1),
(551, 'องุ่นแดงไร้เมล็ด(อเมริกา)', 1, 'America  Seedless Red Grapes', '红葡萄', 1),
(556, 'แก้วมังกรขาว', 1, 'White Dragon fruit', '火龙果', 1),
(557, 'มะนาวเบอร์ใหญ่', 1, 'Lemon (big)', '柠檬（大）', 1),
(558, 'มะนาวเบอร์กลาง', 1, 'Lemon (medium)', '柠檬（中）', 1),
(559, 'มะนาวเบอร์เล็ก', 1, 'Lemon (small)', '柠檬（小）', 1),
(560, 'ใบชะพลู', 1, 'Leaves', '树叶', 1),
(561, 'มะรุม', 1, 'Horseradish', '辣木', 1),
(563, 'แก้วมังกรเวียดนาม', 1, 'Vietnam Dragon fruit', '火龙果', 1),
(564, 'ส้มซันคลิก', 1, 'Sunkist Orange', '新奇士橙', 1),
(565, 'มะยงชิด', 1, 'Marian Plum', '玛丽安梅花', 1),
(566, 'ส้มเขียวหวาน เบอร์ 4', 1, 'Tangerine No. 4', '橘子4号', 1),
(567, 'ส้มเขียวหวาน เบอร์ 3', 1, 'Tangerine No. 3', '橘子3号', 1),
(568, 'ทุเรียนหมอนทอง เบอร์เล็ก', 1, 'Mon Thong durian (small) ', '榴莲（小）', 1),
(569, 'ทุเรียนหมอนทอง เบอร์กลาง', 1, 'Mon Thong durian (medium) ', '榴莲（中）', 1),
(570, 'ทุเรียนหมอนทอง เบอร์ใหญ่', 1, 'Mon Thong durian (big) ', '榴莲（大）', 1),
(571, 'พุทราจีนสด', 1, 'Chinese jujube', '中国枣', 1),
(572, 'แอปเปิ้ลแคระ', 1, 'Crab Apple', '苹果', 1),
(574, 'องุ่นดำไข่ปลา', 1, 'Champagne Black Grapes', '黑葡萄', 1),
(575, 'องุ่นเขียวไข่ปลา', 1, 'Champagne Green Grapes', '绿葡萄', 1),
(576, 'อินผาลัม', 1, 'Datepalm', '椰棗', 1),
(577, 'ฟักทองแฟนซี', 1, 'Pumpkin fancy', '南瓜', 1),
(578, 'สตอเบอรี่เกาหลี', 1, 'Korea Strawberry', '草莓', 1),
(579, 'ลูกพลับญี่ปุ่น', 1, 'Japanese Persimmon', '草莓', 1),
(580, 'องุ่นแดงไร้เมล็ด/ออสเตรเลีย', 1, 'Austria  Seedless Red Grapes', '红葡萄', 1),
(582, 'องุ่นดำไร้เมล็ด/ออสเตรเลีย', 1, 'Austria  Seedless Black Grapes', '黑葡萄', 1),
(585, 'องุ่นเขียวไร้เมล็ด/ออตเตรเลีย', 1, 'Austria  Seedless Green Grapes', '绿葡萄', 1),
(586, 'ส้มโชกุน', 1, 'Orange Shogun', '橙色幕府将军', 1),
(587, 'เชอรี่ชิลี', 1, 'Chile Cherry', '樱桃', 1),
(590, 'องุ่นดำมีเมล็ด', 1, 'Black Grapes', '黑葡萄', 1),
(591, 'องุ่นดำไร้เมล็ด', 1, 'Seedless Black Grapes', '黑葡萄', 1),
(592, 'แตงโมไดอาน่า', 1, 'Watermelon Diana', '西瓜戴安娜', 1),
(593, 'แตงโมซอนญ่า', 1, 'Watermelon Zonya', '西瓜', 1),
(594, 'เงาะสีทอง', 1, 'Rambutan with gold', '红毛丹', 1),
(596, 'มะไฟอีดก', 1, 'Rambeh', '木奶果', 1),
(597, 'ลิ้นจี่ค่อม', 1, 'lychee ', '荔枝', 1),
(598, 'กระท้อนล้าแป้น', 1, 'Crunch', '山陀儿', 1),
(599, 'องุ่นดำมีเมล็ด/ออสเตรเลีย', 1, 'Austria Black Grapes', '黑葡萄', 1),
(600, 'องุ่นแดงมีเมล็ด/ออสเตเลีย', 1, 'Austria Red Grapes', '红葡萄', 1),
(601, 'แตงโมไร้เมล็ด', 1, 'Seedless Watermelon', '西瓜', 1),
(603, 'ขนุนเพชรราชา', 1, 'Jackfruit', '菠萝蜜', 1),
(604, 'กระท้อน(เขียวหวาน)', 1, 'Santol (Green Sweet)', '山陀儿', 1),
(607, 'สละสุมาลี', 1, 'Sumalee Salacca', '', 1),
(608, 'แตงโม', 1, 'watermelon', '西瓜', 1),
(609, 'องุ่นแดงมีเมล็ด/ชิลี', 1, 'Chile Red grape', '红葡萄', 1),
(610, 'องุ่นแดงไข่ปลา', 1, 'Red grape roe', '红葡萄', 1),
(611, 'องุ่นเขียว', 1, 'Green Grapes', '绿葡萄', 1),
(612, 'แอปเปิ้ลฟูจิ จีน', 1, 'Chinese Fuji Apple', '苹果', 1),
(613, 'แอปเปิ้ลเขียว อเมริกา', 1, 'America Green Apple', '青苹果', 1),
(614, 'องุ่นเขียวไร้เมล็ด จีน', 1, 'Chinese Seedless green grapes', '中国绿葡萄无核', 1),
(615, 'องุ่นดำไร้เมล็ด จีน', 1, 'Chinese Seedless black grapes', '中国黑葡萄', 1),
(616, 'องุ่นแดงไร้เมล็ด จีน', 1, 'Chinese Seedless red grapes', '红葡萄无核中国。', 1),
(617, 'องุ่นดำไร้เมล็ดชิลี', 1, 'Chile Seedless black grapes', '黑葡萄无核', 1),
(618, 'องุ่นแดงไร้เมล็ดชิลี', 1, 'Chile Seedless red grapes', '红葡萄无核', 1),
(619, 'องุ่นเขียวมีเมล็ดออสเตรเลีย', 1, 'Austria Green Grapes', '澳大利亚绿葡萄', 1),
(620, 'องุ่นเขียวมีเมล็ดอเมริกา', 1, 'America Green Grape', '绿葡萄有美国种子。', 1),
(621, 'องุ่นเขียวมีเมล็ดนิวซีแลนด์', 1, 'Newzealand Green Grapes', '绿葡萄', 1),
(622, 'องุ่นดำมีเมล็ดชิลี', 1, 'Chile Black Grape', '黑葡萄', 1),
(623, 'องุ่นดำมีเมล็ดอเมริกา', 1, 'America Black Grapes', '美国黑葡萄', 1),
(624, 'แอปเปิ้ลเอ็นวี่', 1, 'Envy Apple', '苹果', 1),
(625, 'แอปเปิ้ลเอ็นวี่', 1, 'Envy Apple', '苹果', 1),
(626, 'แอปเปิ้ลเอ็นวี่', 1, 'Envy Apple', '苹果', 1),
(627, 'แอปเปิ้ลเอ็นวี่', 1, 'Envy Apple', '苹果', 1),
(628, 'มันเทศญี่ปุ่น', 1, 'Japanese sweet potato', '日本红薯', 1),
(629, 'ขมิ้นขาว(ไม่ปอก)', 1, 'White glaze', '姜黄', 1),
(630, 'หอมใหญ่', 1, 'Onion', '洋葱', 1),
(631, 'องุ่นแดงเปโล', 1, 'Pero Red Grape', '红葡萄', 1),
(632, 'สับปะรดสวนผึ้ง', 1, '', '', 1),
(633, 'ลูกเนียง', 1, '', '', 1),
(634, 'เห็ดเผาะ', 1, '', '', 1),
(635, 'หน่อไม้ต้ม', 1, '', '', 1),
(636, 'ไผ่หวานดิบ', 1, '', '', 1),
(637, 'ฟักแก่', 1, '', '', 1),
(638, 'ไผ่กิมซุง', 1, '', '', 1),
(639, 'หน่อไม้ไผ่ลวก(ดิบ)', 1, '', '', 1),
(640, 'ส้มยอ', 1, '', '', 1),
(641, 'กระเทียมกลีบ', 1, '', '', 1),
(642, 'ชมพู่เพชรสุพรรณ', 1, '', '', 1),
(643, 'พุทรานมสด', 1, '', '', 1),
(644, 'ส้มสายน้ำผึ้ง เบอร์ 7', 1, '', '', 1),
(645, 'องุ่นเขียวไร้เมล็ด(นิวซีแลนด์)', 1, '', '', 1),
(646, 'องุ่นดำไร้เมล็ด(นิวซีแลนด์)', 1, '', '', 1),
(647, 'รากผักชี', 1, '', '', 1),
(648, 'เสาวรส', 1, '', '', 1),
(649, 'สับปะรดภูแล', 1, '', '', 1),
(650, 'เมล่อน', 1, '', '', 1),
(651, 'เคพกูสเบอร์รี่', 1, '', '', 1),
(652, 'ขนุนอ่อน', 1, '', '', 1),
(653, 'กระเทียมไทย', 1, '', '', 1),
(654, 'เมล่อนญี่ปุ่น', 1, '', '', 1),
(655, 'ใบเหลียง', 1, '', '', 1),
(656, 'มะม่วงปลาตะเพียน', 1, '', '', 1),
(657, 'มะขามหวานขวักสีทอง', 1, '', '', 1),
(658, 'มะขามหวานสีชมพู', 1, '', '', 1),
(659, 'หน่อไม้ไผ่ลวก(ต้ม)', 1, '', '', 1),
(660, 'มันแครอท', 1, '', '', 1),
(661, 'มันกะปิ', 1, '', '', 1),
(662, 'ทุเรียนพวงมณี', 1, '', '', 1),
(663, 'สะตอแกะ', 1, '', '', 1),
(664, 'มัน5นาที', 1, '', '', 1),
(665, 'ฝรั่งไส้แดง', 1, '', '', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tb_result`
--

CREATE TABLE `tb_result` (
  `id` int(11) NOT NULL,
  `name_result` varchar(255) NOT NULL,
  `result_status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_result`
--

INSERT INTO `tb_result` (`id`, `name_result`, `result_status`) VALUES
(1, 'ตลาดศรีเมือง', 1),
(2, 'ตลาดไท', 1),
(3, 'ตลาดสี่มุมเมือง', 1),
(4, 'สำรวจ', 1);

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

-- --------------------------------------------------------

--
-- Table structure for table `tb_user`
--

CREATE TABLE `tb_user` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `user_status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_user`
--

INSERT INTO `tb_user` (`id`, `username`, `password`, `user_status`) VALUES
(1, 'admin', 'pass', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tb_maintype`
--
ALTER TABLE `tb_maintype`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `id_maintype` (`id`) USING BTREE,
  ADD KEY `bud` (`bud`) USING BTREE;

--
-- Indexes for table `tb_price`
--
ALTER TABLE `tb_price`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_product`
--
ALTER TABLE `tb_product`
  ADD PRIMARY KEY (`id_product`);

--
-- Indexes for table `tb_result`
--
ALTER TABLE `tb_result`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_unit`
--
ALTER TABLE `tb_unit`
  ADD PRIMARY KEY (`id_unit`);

--
-- Indexes for table `tb_user`
--
ALTER TABLE `tb_user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tb_maintype`
--
ALTER TABLE `tb_maintype`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `tb_price`
--
ALTER TABLE `tb_price`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_product`
--
ALTER TABLE `tb_product`
  MODIFY `id_product` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=666;

--
-- AUTO_INCREMENT for table `tb_result`
--
ALTER TABLE `tb_result`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tb_unit`
--
ALTER TABLE `tb_unit`
  MODIFY `id_unit` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `tb_user`
--
ALTER TABLE `tb_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
