const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

console.log("connection establishing...");
// module.exports = pool;

pool.connect((err) => {
  if (err) return console.log(err) // Shows error if something happened
});

const properties = require('./json/properties.json');
const users = require('./json/users.json');

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  return pool.query(`
    SELECT *
    FROM users
    WHERE users.email = $1;`, [email])
    .then(res => {
      if (res.rows[0]) {
        // console.log(res.rows);
        return res.rows[0];
      } else {
        console.log('USER EMAIL NOT EXIST!');
        return null;
      }
    })
    .catch(err => console.err('query error', err.stack));
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  return pool.query(`
  SELECT *
  FROM users
  WHERE users.id = $1;`, [id])
    .then(res => {
      if (res.rows[0]) {
        // console.log(res.rows);
        return res.rows[0];
      } else {
        console.log('USER ID NOT EXIST!');
        return null;
      }
    })
    .catch(err => console.err('query error', err.stack));
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  // console.log('user = ', user);
  return pool.query(`
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;`, [user.name, user.email, user.password])
    .then(res => {
      return res.rows[0];
    })
    .catch(err => console.err('query error', err.stack));
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  return pool.query(`
  SELECT properties.*, reservations.*, avg(property_reviews.rating) as average_rating
  FROM property_reviews
  JOIN properties ON property_id = properties.id
  JOIN reservations ON reservation_id = reservations.id
  JOIN users ON property_reviews.guest_id = users.id
  WHERE reservations.guest_id = $1 AND now()::date > reservations.end_date
  GROUP BY reservations.id, properties.id
  ORDER BY reservations.start_date ASC
  LIMIT $2;
  `, [guest_id, limit])
  .then(res => {
    if (res.rows[0]) {
      return res.rows;
    } else {
      console.log(`${guest_id} has no reservation.`);
      return null;
    }
  })
  .catch(err => console.err('query error', err.stack));  
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {
  return pool.query(`
  SELECT * FROM properties 
  LIMIT $1
  `, [limit])
    .then(res => res.rows);
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
