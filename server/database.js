const mysql = require('mysql2/promise');
const debug = require('debug')('database');
const pool = mysql.createPool({
  host            : process.env.MARIADB_HOST,
  user            : process.env.MARIADB_USER,
  password        : process.env.MARIADB_PASSWORD,
  database        : process.env.MARIADB_DATABASE,
  connectionLimit : 10,
  dateStrings     : true
});
let connection_count = 0;

pool.on('acquire', function (connection) {
  debug('############## Connection %d acquired', connection.threadId);
});
pool.on('connection', function (connection) {
  debug('############## connection: ' + ++connection_count);
});
pool.on('enqueue', function () {
  debug('############## Waiting for available connection slot');
});
pool.on('release', function (connection) {
  debug('############## Connection %d released', connection.threadId);
});

module.exports = pool;

/*
DELIMITER $$
DROP FUNCTION IF EXISTS get_seq$$
CREATE FUNCTION get_seq (p_group_id INT UNSIGNED, p_seq_name VARCHAR(32))
 RETURNS INT UNSIGNED READS SQL DATA
BEGIN
 DECLARE RESULT_ID INT UNSIGNED;
 UPDATE master_seq SET id = LAST_INSERT_ID(id+1)
 WHERE group_id=p_group_id AND seq_name = p_seq_name;
 SET RESULT_ID = (SELECT LAST_INSERT_ID());
 RETURN RESULT_ID;
END $$
DELIMITER ;


DELIMITER $$
DROP FUNCTION IF EXISTS get_state$$
CREATE FUNCTION get_state(DOCUMENT_STATE INT UNSIGNED )
RETURNS VARCHAR(32)
BEGIN
  RETURN (CASE DOCUMENT_STATE
  WHEN 0 THEN "PENDING_ADDS"
  WHEN 1 THEN "PENDING_UPDATES"
  WHEN 2 THEN "ADDED"
  WHEN 3 THEN "UPDATED"
  WHEN 4 THEN "PREDEFINED"
  WHEN 5 THEN "DELETED"
  ELSE "UNKNOWN_STATE"
  END) ;
END $$
DELIMITER ;


DELIMITER $$
DROP FUNCTION IF EXISTS get_member_state$$
CREATE FUNCTION get_member_state(MEMBER_STATE INT UNSIGNED )
RETURNS VARCHAR(32)
BEGIN
  RETURN (CASE MEMBER_STATE
  WHEN 0 THEN "JOIN_REQUESTED"
  WHEN 1 THEN "JOIN_APPROVED"
  WHEN 2 THEN "JOIN_REJECTED"
  WHEN 3 THEN "ADDED"
  WHEN 4 THEN "UPDATED"
  WHEN 5 THEN "DELETED"
  ELSE "UNKNOWN_STATE"
  END) ;
END $$
DELIMITER ;
*/
