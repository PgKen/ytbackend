const express = require('express');
const app = express();
const mysql = require('mysql2');
const moment = require('moment'); // ใช้ moment.js สำหรับจัดการวันที่
const cors = require('cors');
const { log } = require('node:console');
const path = require('path');
const fs = require('fs');
const multer = require('multer'); // เพิ่ม multer สำหรับรับไฟล์อัปโหลด

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
  sql += "AND prod_status = 1 ";

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


app.post('/app_showprice', (req, res) => {
  // { date: '2025-06-24', id_result: '4', id_maintype: '6' }
  console.log(req.body);

  const { date, id_result, id_maintype } = req.body;

  let sql = `
    SELECT 
      tb_product.id_product,
      tb_product.*,
      tb_unit.*,
      tb_maintype.*,
      GROUP_CONCAT(tb_price.id_result) AS id_result_array,
      GROUP_CONCAT(tb_price.price) AS price_array,
      GROUP_CONCAT(tb_price.price_time) AS price_time_array
    FROM tb_price
    INNER JOIN tb_product ON tb_price.id_prod = tb_product.id_product
    INNER JOIN tb_unit ON tb_product.id_unit = tb_unit.id_unit
    INNER JOIN tb_maintype ON tb_product.id_group = tb_maintype.id
    WHERE tb_price.price_date = ?
      AND tb_maintype.id = ?
  `;

  let params = [date, id_maintype];

  if (id_result && id_result !== '-1') {
    sql += " AND tb_price.id_result = ? ";
    params.push(id_result);
  }

  sql += " GROUP BY tb_product.id_product ";

  conn.query(sql, params, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    if (result.length > 0) {
      console.log("Fetched prices:", result[0]);
      res.json(result);
    } else {
      console.log("No prices found for the given criteria");
      res.json([]); // Return an empty array if no results found
    }
  });
});

app.post('/app_saveprice', (req, res) => {
  console.log("Received request to save prices");
  const filteredPayload = req.body.filteredPayload;
  // console.log("Filtered payload:", filteredPayload);
  // res.end();
  if (!Array.isArray(filteredPayload) || filteredPayload.length === 0) {
    return res.status(400).json({ success: false, message: "No data to save" });
  }

  let valTime = moment().format('HH:mm:ss');

  // res.end();

  const sql = `
    INSERT INTO tb_price (price, price_date, price_time, id_prod, id_result)
    VALUES ?
  `;

  // Prepare values for bulk insert
  const values = filteredPayload.map(item => [
    item.price,
    item.date,
    valTime,
    item.id_prod,
    item.id_result,
  ]);

  conn.query(sql, [values], (err, result) => {
    if (err) {
      console.error("Error saving prices:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    res.json({ success: true, message: "Prices saved successfully", inserted: result.affectedRows });
  });
});

// ตั้งค่า multer สำหรับเก็บไฟล์ใน /public/upload


const uploadDir = path.join(__dirname, 'public', 'upload');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadDir);
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage: storage });

app.post('/app_uploadimg', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  // สร้างชื่อไฟล์ใหม่โดยเติมวันที่และเวลา
  const originalName = req.file.originalname;
  const ext = path.extname(originalName);
  const baseName = path.basename(originalName, ext);
  const now = moment().format('YYYYMMDD_HHmmss');
  const uniqueSuffix = now + '-' + Math.round(Math.random() * 1E9);
  const newFilename = `${baseName}_${uniqueSuffix}${ext}`;
  const oldPath = req.file.path;
  const newPath = path.join(req.file.destination, newFilename);
  // เปลี่ยนชื่อไฟล์จริงในโฟลเดอร์
  fs.renameSync(oldPath, newPath);

  // Insert new filename into tb_img
  const sql = 'INSERT INTO tb_img (name_img) VALUES (?)';
  conn.query(sql, [newFilename], (err, result) => {
    if (err) {
      console.error('Error saving image filename:', err);
      return res.status(500).json({ success: false, message: 'Database error (insert image)'});
    }
    res.json({ success: true, message: 'File uploaded and saved to DB', filename: newFilename, path: `/public/upload/${newFilename}` });
  });
});


app.get('/app_listimg', (req, res) => {
  const sql = 'SELECT * FROM tb_img ORDER BY id DESC';
  conn.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching images:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    res.json(results);
  });
});

// ให้ Express ให้บริการไฟล์ใน /public/upload ผ่าน /upload
app.use('/upload', express.static(path.join(__dirname, 'public', 'upload')));

const port = 4222;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});