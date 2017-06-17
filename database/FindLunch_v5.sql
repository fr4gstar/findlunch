-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';


-- -----------------------------------------------------
-- Schema ou7pojgz8l7rkgda
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `ou7pojgz8l7rkgda` ;

-- -----------------------------------------------------
-- Schema ou7pojgz8l7rkgda
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `ou7pojgz8l7rkgda` DEFAULT CHARACTER SET utf8 ;
USE `ou7pojgz8l7rkgda` ;

-- -----------------------------------------------------
-- Table `ou7pojgz8l7rkgda`.`country`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ou7pojgz8l7rkgda`.`country` (
  `country_code` VARCHAR(2) NOT NULL,
  `name` VARCHAR(30) NOT NULL,
  PRIMARY KEY (`country_code`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- ——————————————————————————
-- Table `ou7pojgz8l7rkgda`.`day_of_week`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ou7pojgz8l7rkgda`.`day_of_week` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(30) NOT NULL,
  `day_number` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `day_number_UNIQUE` (`day_number` ASC))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `ou7pojgz8l7rkgda`.`restaurant_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ou7pojgz8l7rkgda`.`restaurant_type` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(30) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `ou7pojgz8l7rkgda`.`restaurant`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ou7pojgz8l7rkgda`.`restaurant` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `customer_id` INT(11) NOT NULL,
  `name` VARCHAR(60) NOT NULL,
  `street` VARCHAR(60) NOT NULL,
  `street_number` VARCHAR(11) NOT NULL,
  `zip` VARCHAR(5) NOT NULL,
  `city` VARCHAR(60) NOT NULL,
  `country_code` VARCHAR(2) NOT NULL,
  `location_latitude` FLOAT NOT NULL,
  `location_longitude` FLOAT NOT NULL,
  `email` VARCHAR(60) NOT NULL,
  `phone` VARCHAR(60) NOT NULL,
  `url` VARCHAR(60) NULL DEFAULT NULL,
  `restaurant_type_id` INT(11) NULL DEFAULT NULL,
  `restaurant_uuid` VARCHAR(40) NOT NULL,
  `qr_uuid` BLOB NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_restaurant_countries1_idx` (`country_code` ASC),
  INDEX `fk_restaurant_restaurant_type1_idx` (`restaurant_type_id` ASC),
  UNIQUE INDEX `customer_id_UNIQUE` (`customer_id` ASC),
  CONSTRAINT `fk_restaurant_countries1`
    FOREIGN KEY (`country_code`)
    REFERENCES `ou7pojgz8l7rkgda`.`country` (`country_code`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_restaurant_restaurant_type1`
    FOREIGN KEY (`restaurant_type_id`)
    REFERENCES `ou7pojgz8l7rkgda`.`restaurant_type` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `ou7pojgz8l7rkgda`.`user_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ou7pojgz8l7rkgda`.`user_type` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(30) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `ou7pojgz8l7rkgda`.`account_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ou7pojgz8l7rkgda`.`account_type` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(30) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ou7pojgz8l7rkgda`.`account`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ou7pojgz8l7rkgda`.`account` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `account_number` INT(11) NOT NULL,
  `account_type_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_account_account_type1_idx` (`account_type_id` ASC),
  CONSTRAINT `fk_account_account_type1`
    FOREIGN KEY (`account_type_id`)
    REFERENCES `ou7pojgz8l7rkgda`.`account_type` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `ou7pojgz8l7rkgda`.`course_types`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ou7pojgz8l7rkgda`.`course_types` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `restaurant_id` INT(11) NOT NULL,
  `name` VARCHAR(30) NOT NULL,
  `sort_by` INT(11) DEFAULT 1,
  PRIMARY KEY (`id`),
  INDEX `fk_course_restaurant1_idx` (`restaurant_id` ASC),
  CONSTRAINT `fk_course_restaurant1`
    FOREIGN KEY (`restaurant_id`)
    REFERENCES `ou7pojgz8l7rkgda`.`restaurant` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)  
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

-- -----------------------------------------------------
-- Table `ou7pojgz8l7rkgda`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ou7pojgz8l7rkgda`.`user` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(60) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `restaurant_id` INT(11) NULL DEFAULT NULL,
  `user_type_id` INT(11) NOT NULL,
  `account_id` INT(11) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC),
  INDEX `fk_user_restaurant1_idx` (`restaurant_id` ASC),
  INDEX `fk_user_user_type1_idx` (`user_type_id` ASC),
  INDEX `fk_user_account1_idx` (`account_id` ASC),
  CONSTRAINT `fk_user_restaurant1`
    FOREIGN KEY (`restaurant_id`)
    REFERENCES `ou7pojgz8l7rkgda`.`restaurant` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_user_type1`
    FOREIGN KEY (`user_type_id`)
    REFERENCES `ou7pojgz8l7rkgda`.`user_type` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_account1`
    FOREIGN KEY (`account_id`)
    REFERENCES `ou7pojgz8l7rkgda`.`account` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `ou7pojgz8l7rkgda`.`favorites`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ou7pojgz8l7rkgda`.`favorites` (
  `user_id` INT(11) NOT NULL,
  `restaurant_id` INT(11) NOT NULL,
  PRIMARY KEY (`user_id`, `restaurant_id`),
  INDEX `fk_user_has_restaurant_restaurant1_idx` (`restaurant_id` ASC),
  INDEX `fk_user_has_restaurant_user1_idx` (`user_id` ASC),
  CONSTRAINT `fk_user_has_restaurant_restaurant1`
    FOREIGN KEY (`restaurant_id`)
    REFERENCES `ou7pojgz8l7rkgda`.`restaurant` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_has_restaurant_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `ou7pojgz8l7rkgda`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `ou7pojgz8l7rkgda`.`kitchen_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ou7pojgz8l7rkgda`.`kitchen_type` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(30) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `ou7pojgz8l7rkgda`.`offer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ou7pojgz8l7rkgda`.`offer` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `restaurant_id` INT(11) NOT NULL,
  `title` VARCHAR(60) NOT NULL,
  `description` TINYTEXT NOT NULL,
  `price` DECIMAL(5,2) NOT NULL,
  `preparation_time` INT(11) NOT NULL,
  `start_date` DATE NULL DEFAULT NULL,
  `end_date` DATE NULL DEFAULT NULL,
  `needed_points` INT NOT NULL,
  `sold_out` TINYINT(1) NOT NULL,
  `course_type` INT(11) NOT NULL,
  `sort_by` INT(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  INDEX `fk_product_restaurant1_idx` (`restaurant_id` ASC),
  CONSTRAINT `fk_product_restaurant1`
    FOREIGN KEY (`restaurant_id`)
    REFERENCES `ou7pojgz8l7rkgda`.`restaurant` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  INDEX `fk_product_course_idx` (`course_type` ASC),
  CONSTRAINT `fk_productcourse1`
    FOREIGN KEY (`course_type`)
    REFERENCES `ou7pojgz8l7rkgda`.`course_types` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

-- -----------------------------------------------------
-- Table `ou7pojgz8l7rkgda`.`user_pushtoken`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ou7pojgz8l7rkgda`.`user_pushtoken` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `fcm_token` TEXT(4096) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_user_pushtoken_user1_idx` (`user_id` ASC),
  CONSTRAINT `fk_user_pushtoken_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `ou7pojgz8l7rkgda`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

-- -----------------------------------------------------
-- Table `ou7pojgz8l7rkgda`.`offer_has_day_of_week`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ou7pojgz8l7rkgda`.`offer_has_day_of_week` (
  `offer_id` INT(11) NOT NULL,
  `day_of_week_id` INT(11) NOT NULL,
  PRIMARY KEY (`offer_id`, `day_of_week_id`),
  INDEX `fk_offer_has_day_of_week_day_of_week1_idx` (`day_of_week_id` ASC),
  INDEX `fk_offer_has_day_of_week_offer1_idx` (`offer_id` ASC),
  CONSTRAINT `fk_offer_has_day_of_week_day_of_week1`
    FOREIGN KEY (`day_of_week_id`)
    REFERENCES `ou7pojgz8l7rkgda`.`day_of_week` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_offer_has_day_of_week_offer1`
    FOREIGN KEY (`offer_id`)
    REFERENCES `ou7pojgz8l7rkgda`.`offer` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `ou7pojgz8l7rkgda`.`offer_photo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ou7pojgz8l7rkgda`.`offer_photo` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `offer_id` INT(11) NOT NULL,
  `photo` MEDIUMBLOB NOT NULL,
  `thumbnail` MEDIUMBLOB NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_offer_photo_offer1_idx` (`offer_id` ASC),
  CONSTRAINT `fk_offer_photo_offer1`
    FOREIGN KEY (`offer_id`)
    REFERENCES `ou7pojgz8l7rkgda`.`offer` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `ou7pojgz8l7rkgda`.`time_schedule`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ou7pojgz8l7rkgda`.`time_schedule` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `restaurant_id` INT(11) NOT NULL,
  `offer_start_time` DATETIME NULL DEFAULT NULL,
  `offer_end_time` DATETIME NULL DEFAULT NULL,
  `day_of_week_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_time_schedule_restaurant1_idx` (`restaurant_id` ASC),
  INDEX `fk_time_schedule_day_of_week1_idx` (`day_of_week_id` ASC),
  CONSTRAINT `fk_time_schedule_day_of_week1`
    FOREIGN KEY (`day_of_week_id`)
    REFERENCES `ou7pojgz8l7rkgda`.`day_of_week` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_time_schedule_restaurant1`
    FOREIGN KEY (`restaurant_id`)
    REFERENCES `ou7pojgz8l7rkgda`.`restaurant` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `ou7pojgz8l7rkgda`.`opening_time`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ou7pojgz8l7rkgda`.`opening_time` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `opening_time` DATETIME NOT NULL,
  `closing_time` DATETIME NOT NULL,
  `time_schedule_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_opening_time_time_schedule1_idx` (`time_schedule_id` ASC),
  CONSTRAINT `fk_opening_time_time_schedule1`
    FOREIGN KEY (`time_schedule_id`)
    REFERENCES `ou7pojgz8l7rkgda`.`time_schedule` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `ou7pojgz8l7rkgda`.`push_notification`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ou7pojgz8l7rkgda`.`push_notification` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `title` VARCHAR(60) NULL DEFAULT NULL,
  `latitude` FLOAT NOT NULL,
  `longitude` FLOAT NOT NULL,
  `radius` INT(11) NOT NULL,
  `fcm_token` TEXT(4096) NOT NULL,
  `sns_token` TEXT(4096) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_push_notification_user1_idx` (`user_id` ASC),
  CONSTRAINT `fk_push_notification_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `ou7pojgz8l7rkgda`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `ou7pojgz8l7rkgda`.`push_notification_has_day_of_week`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ou7pojgz8l7rkgda`.`push_notification_has_day_of_week` (
  `push_notification_id` INT(11) NOT NULL,
  `day_of_week_id` INT(11) NOT NULL,
  PRIMARY KEY (`push_notification_id`, `day_of_week_id`),
  INDEX `fk_push_notification_has_day_of_week_day_of_week1_idx` (`day_of_week_id` ASC),
  INDEX `fk_push_notification_has_day_of_week_push_notification1_idx` (`push_notification_id` ASC),
  CONSTRAINT `fk_push_notification_has_day_of_week_day_of_week1`
    FOREIGN KEY (`day_of_week_id`)
    REFERENCES `ou7pojgz8l7rkgda`.`day_of_week` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_push_notification_has_day_of_week_push_notification1`
    FOREIGN KEY (`push_notification_id`)
    REFERENCES `ou7pojgz8l7rkgda`.`push_notification` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `ou7pojgz8l7rkgda`.`push_notification_has_kitchen_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ou7pojgz8l7rkgda`.`push_notification_has_kitchen_type` (
  `push_notification_id` INT(11) NOT NULL,
  `kitchen_type_id` INT(11) NOT NULL,
  PRIMARY KEY (`push_notification_id`, `kitchen_type_id`),
  INDEX `fk_push_notification_has_kitchen_type_kitchen_type1_idx` (`kitchen_type_id` ASC),
  INDEX `fk_push_notification_has_kitchen_type_push_notification1_idx` (`push_notification_id` ASC),
  CONSTRAINT `fk_push_notification_has_kitchen_type_kitchen_type1`
    FOREIGN KEY (`kitchen_type_id`)
    REFERENCES `ou7pojgz8l7rkgda`.`kitchen_type` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_push_notification_has_kitchen_type_push_notification1`
    FOREIGN KEY (`push_notification_id`)
    REFERENCES `ou7pojgz8l7rkgda`.`push_notification` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `ou7pojgz8l7rkgda`.`restaurant_has_kitchen_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ou7pojgz8l7rkgda`.`restaurant_has_kitchen_type` (
  `restaurant_id` INT(11) NOT NULL,
  `kitchen_type_id` INT(11) NOT NULL,
  PRIMARY KEY (`restaurant_id`, `kitchen_type_id`),
  INDEX `fk_restaurant_has_kitchen_type_kitchen_type1_idx` (`kitchen_type_id` ASC),
  INDEX `fk_restaurant_has_kitchen_type_restaurant1_idx` (`restaurant_id` ASC),
  CONSTRAINT `fk_restaurant_has_kitchen_type_kitchen_type1`
    FOREIGN KEY (`kitchen_type_id`)
    REFERENCES `ou7pojgz8l7rkgda`.`kitchen_type` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_restaurant_has_kitchen_type_restaurant1`
    FOREIGN KEY (`restaurant_id`)
    REFERENCES `ou7pojgz8l7rkgda`.`restaurant` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `ou7pojgz8l7rkgda`.`points`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ou7pojgz8l7rkgda`.`points` (
  `user_id` INT(11) NOT NULL,
  `restaurant_id` INT(11) NOT NULL,
  `points` INT(11) NOT NULL,
  PRIMARY KEY (`user_id`, `restaurant_id`),
  INDEX `fk_points_restaurant1_idx` (`restaurant_id` ASC),
  CONSTRAINT `fk_points_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `ou7pojgz8l7rkgda`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_points_restaurant1`
    FOREIGN KEY (`restaurant_id`)
    REFERENCES `ou7pojgz8l7rkgda`.`restaurant` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ou7pojgz8l7rkgda`.`euro_per_point`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ou7pojgz8l7rkgda`.`euro_per_point` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `euro` DECIMAL(3,2) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ou7pojgz8l7rkgda`.`minimum_profit`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ou7pojgz8l7rkgda`.`minimum_profit` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `profit` DECIMAL(5,2) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ou7pojgz8l7rkgda`.`bill`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ou7pojgz8l7rkgda`.`bill` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `bill_number` VARCHAR(12) NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `paid` TINYINT(1) NOT NULL,
  `minimum_profit_id` INT NOT NULL,
  `restaurant_id` INT(11) NOT NULL,
  `bill_pdf` MEDIUMBLOB NOT NULL,
  `total_price` DECIMAL(6,2) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_bill_minimum_profit1_idx` (`minimum_profit_id` ASC),
  INDEX `fk_bill_restaurant1_idx` (`restaurant_id` ASC),
  CONSTRAINT `fk_bill_minimum_profit1`
    FOREIGN KEY (`minimum_profit_id`)
    REFERENCES `ou7pojgz8l7rkgda`.`minimum_profit` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_bill_restaurant1`
    FOREIGN KEY (`restaurant_id`)
    REFERENCES `ou7pojgz8l7rkgda`.`restaurant` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ou7pojgz8l7rkgda`.`reservation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ou7pojgz8l7rkgda`.`reservation` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `reservation_number` INT(11) NOT NULL,
  `reservation_time` DATETIME NOT NULL,
  `confirmed` TINYINT(1) NOT NULL DEFAULT 0,
  `rejected` TINYINT(1) NOT NULL DEFAULT 0,
  `total_price` DECIMAL(5,2) NOT NULL,
  `donation` DECIMAL(5,2) NOT NULL,
  `used_points` TINYINT(1) NOT NULL,
  `user_id` INT(11) NOT NULL,
  `euro_per_point_id` INT NOT NULL,
  `bill_id` INT(11) NULL DEFAULT NULL,
  `restaurant_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_reservation_user1_idx` (`user_id` ASC),
  INDEX `fk_reservation_euro_per_point1_idx` (`euro_per_point_id` ASC),
  INDEX `fk_reservation_bill1_idx` (`bill_id` ASC),
  INDEX `fk_reservation_restaurant1_idx` (`restaurant_id` ASC),
  UNIQUE INDEX `reservation_number_UNIQUE` (`reservation_number` ASC),
  CONSTRAINT `fk_reservation_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `ou7pojgz8l7rkgda`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_reservation_euro_per_point1`
    FOREIGN KEY (`euro_per_point_id`)
    REFERENCES `ou7pojgz8l7rkgda`.`euro_per_point` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_reservation_bill1`
    FOREIGN KEY (`bill_id`)
    REFERENCES `ou7pojgz8l7rkgda`.`bill` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_reservation_restaurant1`
    FOREIGN KEY (`restaurant_id`)
    REFERENCES `ou7pojgz8l7rkgda`.`restaurant` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `ou7pojgz8l7rkgda`.`reservation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ou7pojgz8l7rkgda`.`reservation_offers` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `reservation_id` INT(11) NOT NULL,
  `offer_id` INT(11) NOT NULL,
  `amount` INT(3) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_reservation_idx` (`reservation_id` ASC),
  INDEX `fk__offer1_idx` (`offer_id` ASC),
  CONSTRAINT `fk_reservation1`
    FOREIGN KEY (`reservation_id`)
    REFERENCES `ou7pojgz8l7rkgda`.`reservation` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_offer1`
    FOREIGN KEY (`offer_id`)
    REFERENCES `ou7pojgz8l7rkgda`.`offer` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `ou7pojgz8l7rkgda`.`booking_reason`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ou7pojgz8l7rkgda`.`booking_reason` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `reason` VARCHAR(30) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ou7pojgz8l7rkgda`.`booking`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ou7pojgz8l7rkgda`.`booking` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `book_id` INT NOT NULL,
  `booking_time` DATETIME NOT NULL,
  `amount` DECIMAL(6,2) NOT NULL,
  `booking_reason_id` INT(11) NOT NULL,
  `account_id` INT(11) NOT NULL,
  `bill_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_booking_booking_reason1_idx` (`booking_reason_id` ASC),
  INDEX `fk_booking_account1_idx` (`account_id` ASC),
  INDEX `fk_booking_bill1_idx` (`bill_id` ASC),
  CONSTRAINT `fk_booking_booking_reason1`
    FOREIGN KEY (`booking_reason_id`)
    REFERENCES `ou7pojgz8l7rkgda`.`booking_reason` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_booking_account1`
    FOREIGN KEY (`account_id`)
    REFERENCES `ou7pojgz8l7rkgda`.`account` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_booking_bill1`
    FOREIGN KEY (`bill_id`)
    REFERENCES `ou7pojgz8l7rkgda`.`bill` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ou7pojgz8l7rkgda`.`donation_per_month`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ou7pojgz8l7rkgda`.`donation_per_month` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `date` DATE NOT NULL,
  `amount` DECIMAL(5,2) NOT NULL,
  `restaurant_id` INT(11) NOT NULL,
  `datetime_of_update` DATETIME NOT NULL,
  `bill_id` INT(11) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_donation_per_month_restaurant1_idx` (`restaurant_id` ASC),
  INDEX `fk_donation_per_month_bill1_idx` (`bill_id` ASC),
  CONSTRAINT `fk_donation_per_month_restaurant1`
    FOREIGN KEY (`restaurant_id`)
    REFERENCES `ou7pojgz8l7rkgda`.`restaurant` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_donation_per_month_bill1`
    FOREIGN KEY (`bill_id`)
    REFERENCES `ou7pojgz8l7rkgda`.`bill` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ou7pojgz8l7rkgda`.`bill_counter`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ou7pojgz8l7rkgda`.`bill_counter` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `counter` INT NOT NULL,
  `date` DATE NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `ou7pojgz8l7rkgda`.`reset_password`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `ou7pojgz8l7rkgda`.`reset_password` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `token` VARCHAR(45) NOT NULL,
  `date` DATETIME NULL,
  `user_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`, `user_id`),
  INDEX `fk_reset_password_user1_idx` (`user_id` ASC),
  CONSTRAINT `fk_reset_password_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `ou7pojgz8l7rkgda`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `ou7pojgz8l7rkgda`.`allergenic`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ou7pojgz8l7rkgda`.`offer_has_allergenic` ;
DROP TABLE IF EXISTS `ou7pojgz8l7rkgda`.`allergenic` ;

CREATE TABLE IF NOT EXISTS `ou7pojgz8l7rkgda`.`allergenic` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `description` VARCHAR(255) NULL,
  `short` VARCHAR(255) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ou7pojgz8l7rkgda`.`offer_has_allergenic`
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS `ou7pojgz8l7rkgda`.`offer_has_allergenic` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `offer_id` INT(11) NOT NULL,
  `allergenic_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_offer_has_allergenic_offer1_idx` (`offer_id` ASC),
  INDEX `fk_offer_has_allergenic_allergenic1_idx` (`allergenic_id` ASC),
  CONSTRAINT `fk_offer_has_allergenic_offer1`
    FOREIGN KEY (`offer_id`)
    REFERENCES `ou7pojgz8l7rkgda`.`offer` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_offer_has_allergenic_allergenic1`
    FOREIGN KEY (`allergenic_id`)
    REFERENCES `ou7pojgz8l7rkgda`.`allergenic` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ou7pojgz8l7rkgda`.`additives`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ou7pojgz8l7rkgda`.`offer_has_additives` ;
DROP TABLE IF EXISTS `ou7pojgz8l7rkgda`.`additives` ;

CREATE TABLE IF NOT EXISTS `ou7pojgz8l7rkgda`.`additives` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `description` VARCHAR(255) NULL,
  `short` VARCHAR(255) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ou7pojgz8l7rkgda`.`offer_has_additives`
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS `ou7pojgz8l7rkgda`.`offer_has_additives` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `additives_id` INT NOT NULL,
  `offer_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_offer_has_additives_additives1_idx` (`additives_id` ASC),
  INDEX `fk_offer_has_additives_offer1_idx` (`offer_id` ASC),
  CONSTRAINT `fk_offer_has_additives_additives1`
    FOREIGN KEY (`additives_id`)
    REFERENCES `ou7pojgz8l7rkgda`.`additives` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_offer_has_additives_offer1`
    FOREIGN KEY (`offer_id`)
    REFERENCES `ou7pojgz8l7rkgda`.`offer` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
