const express = require('express');
const app = express();
const mysql = require('mysql2');
const moment = require('moment'); // ใช้ moment.js สำหรับจัดการวันที่

const cors = require('cors');
const { log } = require('node:console');

app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Allow all origins
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// เพิ่ม middleware ตรงนี้
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var db_config = {
  host: "localhost",
  user: "root",
  password: "comp@113",
  database: "db_yt",
};

var conn;

function handleDisconnect() {
  conn = mysql.createConnection(db_config); // Recreate the connection, since
  // the old one cannot be reused.
  conn.connect(function(err) {
    if (err) {
      console.error('Error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // Try to reconnect after 2 seconds
    }
  });       

  conn.on('error', function(err) {
    console.error('DB error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect(); // Reconnect if connection is lost
    } else {
      throw err; // Throw other errors
    }
  });
}

handleDisconnect();

app.get('/', (req, res) => {
  res.send('Hello, Express! Welcome to the backend server. dev');
});


app.post("/app_login", (req, res) => {
  const { username } = req.body;
  console.log("Login attempt with:", username);
  const { password } = req.body;
  console.log("Password attempt with:", password);
  // res.end();

  const sql = "SELECT * FROM tb_user WHERE username = ? AND password = ?";
  conn.query(sql, [username, password], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    if (result.length > 0) {
      // User found
      res.json({ success: true, user: result[0] });
    } else {
      // User not found
      res.status(401).json({ success: false, message: "Invalid username or password" });
    }
  }
  );
});

app.get ('/listresult', (req, res) => {
  const sql = 'SELECT * FROM tb_result';
  conn.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching results:', err);
      return res.status(500).send('Error fetching results');
    }
    res.json(results);
  });
});


app.get("/app_maintypes", (req, res) => {
  log("Fetching main types from database...");
  const sql = "SELECT * FROM tb_maintype";
  conn.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    console.log("Fetched main types:", result);
    
    res.json(result);
  });
});


app.get('/app_unit', (req, res) => {
  console.log("Fetching list of units...");
  const sql = "SELECT * FROM tb_unit";
  conn.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    console.log("Fetched units:", result);
    res.json(result);
  });
});

app.get('/app_result', (req, res) => {
  const sql = 'SELECT * FROM tb_result';
  conn.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching results:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    res.json(results);
  });
});

app.get('/app_getmaintypes/:id', (req, res) => {
  const id = req.params.id;
  console.log("Fetching image price for ID:", id);

  let sql =  "SELECT * FROM tb_product ";
  sql += "INNER JOIN tb_maintype ON tb_product.id_group = tb_maintype.id ";
  sql += "WHERE tb_maintype.id = ? ";

  conn.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    if (result.length > 0) {
      res.json(result);
    } else {
      res.json([]); // Return an empty array if no results found
      //res.status(404).json({ success: false, message: "No main type found for this ID" });
    }
  }
  );
});


const port = 4222;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});