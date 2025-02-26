const express = require("express");
const router = express.Router();
const crypto = require("crypto-js");
const conn = require("../db");

// register user
router.post("/register", (request, response) => {
  const { uname, email, password, mobile } = request.body;

  const statement = `INSERT INTO users
  (uname, email, password, mobile) VALUES(?,?,?,?)`;

  conn.execute(statement, [uname, email, password, mobile], (err, result) => {
    if (err) response.send(err.message);
    else response.send("registered successfully...");
  });
});

// login user
router.post("/login", (request, response) => {
  
  const { email, password } = request.body;

  const statement = `SELECT
      id, uname, mobile, role
      FROM users
      WHERE email =? AND password =?`;

  conn.execute(statement, [email, password], (err, users) => {
    if (err) response.send(err.message);
    else {
      if (users.length == 0) response.status(404).send("No user found");
      else {
        const { uname, email, mobile, role } = users[0];

        response.json({
          status: "success",
          data: {
            uname,
            email,
            mobile,
            role,
          },
        });
      }
    }
  });
});

// fetch all mobiles
router.get("/mobiles", (request, response) => {
  const statement = `SELECT * FROM mobiles`;
  conn.execute(statement, (err, rows) => {
    if (err) response.send(err.message);
    else if (rows.length === 0) response.send("no mobiles found");
    else response.json({ status: "success", data: rows });
  });
});

// fetch mobile by id
router.get("/mobile/:id", (request, response) => {
  const { id } = request.params;
  const statement = `SELECT * FROM mobiles WHERE id =?`;

  conn.execute(statement, [id], (err, rows) => {
    if (err) response.send(err.message);
    else if (rows.length === 0) response.send("no mobile found");
    else response.json({ status: "success", data: rows[0] });
  });
});

// place mobile order
router.post("/place-order", (request, response) => {
  const { userId, mobileId } = request.body;

  const statement = `
    INSERT INTO orders (uid, mid)
    VALUES (?,?)
  `;

  conn.execute(statement, [userId, mobileId], (err, result) => {
    if (err) response.send(err.message);
    else
      response.json({
        status: "success",
        message: "Order placed successfully",
      });
  });
});

// fetch all orders by a specific user
router.get("/orders/:userId", (request, response) => {
  const { userId } = request.params;

  if (!userId) {
    return response.json({ status: "error", message: "Invalid user ID" });
  }

  const statement = `
      SELECT o.id, m.mname, m.ram, m.storage, m.company, m.price, m.image
      FROM orders o
      JOIN mobiles m ON o.mid = m.id
      WHERE o.uid = ?
    `;

  conn.execute(statement, [userId], (err, rows) => {
    if (err) {
      console.error(err);
      return response.json({
        status: "error",
        message: "Internal server error",
      });
    }

    if (rows.length === 0) {
      return response.json({
        status: "error",
        message: "No orders found for this user",
      });
    }

    return response.json({
      status: "success",
      message: `Found ${rows.length} order(s) for user ID ${userId}`,
      data: rows,
    });
  });
});

// router.get("/profile", (request, response) => {
//   const statement = `
//     SELECT first_name, last_name, email
//     FROM ${USER_TABLE}
//     WHERE user_id = ?
//   `;
//   pool.query(statement, [request.user["userId"]], (error, users) => {
//     if (error) {
//       response.send(utils.createError(error));
//     } else {
//       if (users.length == 0) {
//         response.send(utils.createError("user does not exist"));
//       } else {
//         response.send(utils.createSuccess(users[0]));
//       }
//     }
//   });
// });

module.exports = router;
