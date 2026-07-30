-- Create a database
CREATE DATABASE IF NOT EXISTS  defaultdb;

USE defaultdb;

/* 
 * 
 *
 *
 *
*/

-- ADMIN
CREATE TABLE IF NOT EXISTS admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL,
    password VARCHAR(240) NOT NULL,
    isAdmin VARCHAR(10) NOT NULL
);

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(200) NOT NULL,
  password VARCHAR(300) NOT NULL,
  date VARCHAR(100) DEFAULT NULL,
  fix_email VARCHAR(200) NOT NULL,
  username VARCHAR(100) DEFAULT NULL,
  phone VARCHAR(100) DEFAULT NULL,
  company_name VARCHAR(100) DEFAULT NULL,
  isValid BOOLEAN DEFAULT false,
  facebook_link VARCHAR(1000) DEFAULT NULL,
  google_link VARCHAR(1000) DEFAULT NULL,
  temporaray_lock VARCHAR(100) DEFAULT '1234',
  isTemporaryLock BOOLEAN DEFAULT false,
  degree VARCHAR(300) DEFAULT NULL,
  uniqueId VARCHAR(200),
  active_time VARCHAR(200) DEFAULT NULL,
  email_message VARCHAR(600) DEFAULT NULL,
  sms_message VARCHAR(600) DEFAULT NULL,
  phato_path VARCHAR(200) DEFAULT NULL
);

-- CLIENT VISITOR
CREATE TABLE IF NOT EXISTS client_visitor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id VARCHAR(200),
    method VARCHAR(40),
    name VARCHAR(200),
    email VARCHAR(200),
    number VARCHAR(200),
    date VARCHAR(200),
    review_method VARCHAR(200) DEFAULT 'pending',
    user_email VARCHAR(200),
    isSend BOOLEAN DEFAULT FALSE,
    count INT DEFAULT 0,
    max_send_msg INT DEFAULT 2,
    unsubscribe BOOLEAN DEFAULT true
);

-- PRIVATE REVIEW
CREATE TABLE IF NOT EXISTS private_review (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id VARCHAR(200),
    rating VARCHAR(200),
    textarea VARCHAR(1000),
    username VARCHAR(200),
    email VARCHAR(200),
    user_email VARCHAR(200),
    number VARCHAR(200),
    date VARCHAR(200)
);

-- CUSTOMER SUPPORT
CREATE TABLE IF NOT EXISTS customer_support (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(200) NOT NULL,
    text VARCHAR(1000) NOT NULL,
    image_path VARCHAR(255)
);

-- USER MARKETING
CREATE TABLE IF NOT EXISTS user_marketing (
  id INT AUTO_INCREMENT PRIMARY KEY,
  unique_id VARCHAR(36) UNIQUE,
  name VARCHAR(200),
  email VARCHAR(200),
  user_email VARCHAR(200),
  phone VARCHAR(20),
  methods VARCHAR(10),
  content VARCHAR(2000),
  unsubscribe BOOLEAN DEFAULT FALSE,
  send_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- QR CODE
CREATE TABLE IF NOT EXISTS qr_code (
    id INT AUTO_INCREMENT PRIMARY KEY,
    unique_id VARCHAR(100) UNIQUE,
    user_email VARCHAR(255) NOT NULL,
    valid BOOLEAN DEFAULT true,
    facebook_link VARCHAR(2000) NOT NULL,
    compnay_logo VARCHAR(255),
    google_link VARCHAR(2000) NOT NULL,
    method VARCHAR(255) DEFAULT 'open_source'
);

-- OPEN PRIVATE REVIEW
CREATE TABLE IF NOT EXISTS open_private_review (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id VARCHAR(255),
    rating VARCHAR(10),
    textarea VARCHAR(1000),
    username VARCHAR(255) DEFAULT 'open source',
    user_email VARCHAR(255),
    email VARCHAR(255) DEFAULT 'open source',
    number VARCHAR(255) DEFAULT 'open source',
    date VARCHAR(25)
);

-- SHORTCUT
CREATE TABLE IF NOT EXISTS shortcutsql (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo VARCHAR(255) NOT NULL,
    google_link VARCHAR(255),
    facebook_link VARCHAR(255),
    yel_link VARCHAR(255),
    helth_link VARCHAR(255),
    user_email VARCHAR(255) NOT NULL,
    unique_id VARCHAR(255) NOT NULL,
    valid BOOLEAN DEFAULT true,
    custom_url VARCHAR(255) NOT NULL,
    custom_phato_url VARCHAR(255) NOT NULL,
    user_emial_view VARCHAR(255)
);

-- PUBLIC REVIEW SHORTCUT
CREATE TABLE IF NOT EXISTS public_review_shortcut (
    id INT AUTO_INCREMENT PRIMARY KEY,
    logo VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    date VARCHAR(255) NOT NULL,
    method VARCHAR(255) DEFAULT 'waiting',
    company_name VARCHAR(255) NOT NULL,
    user_emial_view VARCHAR(255)
);






