-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: store_rating_platform
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ratings`
--

DROP TABLE IF EXISTS `ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ratings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `store_id` int NOT NULL,
  `user_id` int NOT NULL,
  `rating` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `review` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_user_store` (`user_id`,`store_id`),
  KEY `store_id` (`store_id`),
  CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`),
  CONSTRAINT `ratings_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ratings`
--

LOCK TABLES `ratings` WRITE;
/*!40000 ALTER TABLE `ratings` DISABLE KEYS */;
INSERT INTO `ratings` VALUES (1,1,6,5,'2025-11-26 08:11:01',NULL),(2,1,7,3,'2025-11-26 18:32:22',NULL),(3,2,13,3,'2025-11-26 19:22:48',NULL),(4,1,13,5,'2025-11-26 19:22:51',NULL),(5,3,13,4,'2025-11-27 19:35:36',NULL),(6,2,14,5,'2025-11-27 21:14:26','Very good food served'),(7,3,14,3,'2025-11-27 22:38:34','Very good service '),(8,1,14,1,'2025-11-27 22:39:10','Poor hygiene '),(9,2,15,4,'2025-11-28 10:49:24','Nice'),(10,3,15,4,'2025-11-28 11:06:12','Nice service');
/*!40000 ALTER TABLE `ratings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stores`
--

DROP TABLE IF EXISTS `stores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `address` varchar(400) DEFAULT NULL,
  `owner_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `owner_id` (`owner_id`),
  CONSTRAINT `stores_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stores`
--

LOCK TABLES `stores` WRITE;
/*!40000 ALTER TABLE `stores` DISABLE KEYS */;
INSERT INTO `stores` VALUES (1,'McDonalds Burger King','macdonalds@gmail.com','Aundh',5,'2025-11-26 07:58:39'),(2,'Jadamba','jagdamba@gmail.com','Khed Shivapur',8,'2025-11-26 18:37:37'),(3,'Jai Bhawani','jaibhawani@gmail.com','Katraj',8,'2025-11-27 19:20:49'),(4,'Pan Asia','panasia@gmail.com','Kothrud',5,'2025-11-28 10:29:28'),(5,'Mainland China','mainlandchina@gmail.com','SB Road',16,'2025-11-28 11:01:29');
/*!40000 ALTER TABLE `stores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `address` varchar(400) DEFAULT NULL,
  `role` enum('ADMIN','USER','OWNER') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Johnathan Anderson Roberts','user1@example.com','$2b$10$7UmwZQDClsFnY1cnTWa7Ou5QdVMO1qsIVo9qQdyzPUWFw/mSQkypG','Pune, India','USER','2025-11-26 06:57:52'),(3,'System Administrator User','admin@example.com','$2a$10$04nHEX5tIQ8IXehdhPgK6.K8Z0Zzyq8IUeH9vnOw3POieGch8n.MW','Pune, India','ADMIN','2025-11-26 07:05:06'),(4,'Christopher Jonathan Smith','test@example.com','$2b$10$YFpkiYMbaxBJNME1YVym5uk9tZ0yMS2MTM5udj4q2PZIW8V7IYIWm','Pune','USER','2025-11-26 07:36:06'),(5,'Ramesh Suresh Mcdonalds','ramesh@gmail.com','$2b$10$isTZchuI4mXEbBdVjc2r9eck3pi3eUWPZXHDwvNomosO.e2jHYb6K','Pune','OWNER','2025-11-26 07:56:53'),(6,'Benjamin Lewis Carter Hamilton','user005@example.com','$2b$10$hosm75E83LhI9O7Ep4I4VeC2VIihg2iq4I0wqbqMAuqgM0Ax0Gemm','Bangalore','USER','2025-11-26 08:09:30'),(7,'root','root@gmail.com','$2b$10$lwOza3wiH/QYHC6DVPwEc.dvchSwsE1YgzJsUmzAn5vDBNT97aLwm','Pune','USER','2025-11-26 18:32:06'),(8,'Frank Ocean','ocean@gmail.com','$2b$10$B0IENsyhvZG61WamgSHA5elL2ltrngAIHzkB22CiU.ODbY5jk3YbO','Khed Shivapur','OWNER','2025-11-26 18:36:59'),(9,'Root Admin','admin@gmail.com','$2a$12$zTiwZXBbUm4mw2JwdZl1q.LSg29OWFbhvwrJhgGkbTYY29CyLsGma','Admin Office','ADMIN','2025-11-26 18:49:18'),(10,'Aadesh','aadesh@gmail.com','$2b$10$j8MMUg2.JeiRTmod0dy/H.WOMDAmdjc7ZOvFgOVNf33.U9BSJSnam','Aundh','USER','2025-11-26 18:53:56'),(11,'Zohan','hanzo@gmail.com','$2b$10$OgosoThtjdrFTkCXYHeX5eHMJnYeS7t1a3LukZvD04CKFrDwEP1S.','Kesari','USER','2025-11-26 18:55:01'),(12,'Hrutanshu','hazard0912@protonmail.com','$2b$10$VLpx7vULxqE8OxvJ7H8J7OHN.xSXVNp0RuteRSevjVIjd1zezxev.','Pune','USER','2025-11-26 19:05:31'),(13,'User','user@gmail.com','$2b$10$MrKs.bdXbp9ss32YuSqfkev.w/aTGDt3YaLYwwXBocAw47rAfmNyi','Kol','USER','2025-11-26 19:22:26'),(14,'Jonathan Major Alex Spectre','major@gmail.com','$2b$10$y52buLKZnTSfmwXHxITBtOP2xq9Bv3ooyznZnoEUeBfHCacnrMN.q','Pune','USER','2025-11-27 21:13:39'),(15,'Karen Michael Trevor Desanta','karen@gmail.com','$2b$10$C2TktU.2SeWwEP44mc3j.u2aLrhkYTOgZYN0q/b4FFpRJqHVREbrW','Aundh','USER','2025-11-28 10:25:04'),(16,'Yung ho','yung@gmail.com','$2b$10$hBUX9YPdw1dfHCnQEqOpjeJyROaMgDTd5oBRjdmxQShlXp2/QqrtS','Pune','OWNER','2025-11-28 11:00:57'),(17,'Test User Store Rating Platform','test@gmail.com','$2b$10$GCsOhhz.aVrad/ejdxVYFOSRJ6djSZh5CKxypd1HPo03PstJAx9Oy','Pune','USER','2025-11-29 09:48:58');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-29 15:42:11
