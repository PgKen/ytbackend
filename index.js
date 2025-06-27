const express = require('express');
const app = express();
// const mysql = require('mysql2');
const mysql = require('mysql2/promise');
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

let conn;
async function handleDisconnect() {
  try {
    conn = await mysql.createConnection(db_config);
    console.log('MySQL connected (promise)');
  } catch (err) {
    console.error('Error when connecting to db:', err);
    setTimeout(handleDisconnect, 2000);
  }
}
handleDisconnect();

function parseLine(line) {
  // ตัวอย่าง: "ตลาดไท-ผักบุ้งไทย-24-บาท/มัด"
  // จุดตัดคือ "-"
  // ["ตลาดไท", "ผักบุ้งไทย", "24", "บาท/มัด"]
  const parts = line.split("-");
  if (parts.length < 3) return null;
  const [market, product, priceStr] = parts;
  // แยกเฉพาะตัวเลขจาก priceStr
  const price = parseFloat(priceStr.replace(/[^\d.]/g, ""));
  return {
    market: market.trim(),
    product: product.trim(),
    price,
  };
}

app.post('/app_insertdata', async (req, res) => {
  try {
    // รับข้อมูลแบบ text หรือ array ก็ได้
    let { data, price_date, price_time } = req.body;
    if (!data) return res.status(400).json({ error: "No data" });

    // data อาจเป็น string ยาวหรือ array
    if (typeof data === 'string') {
      data = data.trim().split('\n').map(line => line.trim()).filter(line => line.length > 0);
    }

    // ดึงข้อมูลตลาดและสินค้า (map ชื่อเป็น id)
    const [results] = await conn.query('SELECT id, name_result FROM tb_result');
    const [products] = await conn.query('SELECT id_product, name_pro FROM tb_product');

    // แปลงเป็น map
    const resultMap = {};
    results.forEach(r => {
      resultMap[r.name_result.trim()] = r.id;
    });
    const productMap = {};
    products.forEach(p => {
      productMap[p.name_pro.trim()] = p.id_product;
    });

    // เตรียม insert
    const now = new Date();
    const today = price_date || now.toISOString().slice(0,10); // YYYY-MM-DD
    const time = price_time || now.toTimeString().slice(0,8);  // HH:MM:SS

    let inserted = 0;
    let updated = 0;
    for (const line of data) {
      const parsed = parseLine(line);
      if (!parsed) continue;
      const { market, product, price } = parsed;
      // ข้ามถ้าไม่มี id
      if (!resultMap[market] || !productMap[product] || isNaN(price)) continue;

      // เช็คว่ามีข้อมูลนี้อยู่หรือยัง
      const [rows] = await conn.query(
        'SELECT id FROM tb_price WHERE price_date = ? AND id_prod = ? AND id_result = ?',
        [today, productMap[product], resultMap[market]]
      );
      if (rows.length > 0) {
        // update
        await conn.query(
          'UPDATE tb_price SET price = ?, price_time = ? WHERE price_date = ? AND id_prod = ? AND id_result = ?',
          [price, time, today, productMap[product], resultMap[market]]
        );
        updated++;
      } else {
        // insert
        await conn.query(
          'INSERT INTO tb_price (price, price_date, price_time, id_prod, id_result) VALUES (?, ?, ?, ?, ?)',
          [price, today, time, productMap[product], resultMap[market]]
        );
        inserted++;
      }
    }

    res.json({ status: 'ok', inserted, updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/', (req, res) => {
  res.send('Hello, Express! Welcome to the backend server. dev');
});


app.post("/app_login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const [result] = await conn.query(
      "SELECT * FROM tb_user WHERE username = ? AND password = ?",
      [username, password]
    );
    if (result.length > 0) {
      res.json({ success: true, user: result[0] });
    } else {
      res.status(401).json({ success: false, message: "Invalid username or password" });
    }
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

app.get('/listresult', async (req, res) => {
  try {
    const [results] = await conn.query('SELECT * FROM tb_result');
    res.json(results);
  } catch (err) {
    console.error('Error fetching results:', err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});


app.get("/app_maintypes", async (req, res) => {
  try {
    log("Fetching main types from database...");
    const sql = "SELECT * FROM tb_maintype";
    const [result] = await conn.query(sql);
    res.json(result);
  } catch (err) {
    console.error("Error executing query:", err);
    return res.status(500).json({ success: false, message: "Database error" });
  }
});

app.get('/app_unit', async (req, res) => {
  try {
    console.log("Fetching list of units...");
    const sql = "SELECT * FROM tb_unit";
    const [result] = await conn.query(sql);
    console.log("Fetched units:", result);
    res.json(result);
  } catch (err) {
    console.error("Error executing query:", err);
    return res.status(500).json({ success: false, message: "Database error" });
  }
});

app.get('/app_result', async (req, res) => {
  try {
    const [results] = await conn.query('SELECT * FROM tb_result');
    res.json(results);
  } catch (err) {
    console.error('Error fetching results:', err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

app.get('/app_getmaintypes/:id/:id_result', async (req, res) => {
  const id = req.params.id;
  const id_result = req.params.id_result;
  console.log("Fetching image price for ID:", id, "id_result:", id_result);

  let sql = "SELECT * FROM tb_product ";
  sql += "INNER JOIN tb_maintype ON tb_product.id_group = tb_maintype.id ";
  sql += "WHERE tb_maintype.id = ? ";
  sql += "AND prod_status = 1 ";

  try {
    // ดึงวันที่ล่าสุดจาก tb_price
    const [latestDateRow] = await conn.query('SELECT MAX(price_date) AS latest_date FROM tb_price');
    const latestDate = latestDateRow[0].latest_date;
    const [result] = await conn.query(sql, [id]);
    if (result.length > 0) {
      // ดึงราคาล่าสุดของแต่ละ product เฉพาะ id_result ที่รับมา
      const prodIds = result.map(row => row.id_product);
      if (prodIds.length === 0) return res.json(result);
      const priceSql = `SELECT id_prod, price FROM tb_price WHERE price_date = ? AND id_result = ? AND id_prod IN (${prodIds.map(() => '?').join(',')})`;
      const [priceRows] = await conn.query(priceSql, [latestDate, id_result, ...prodIds]);
      // map id_prod => price
      const priceMap = {};
      priceRows.forEach(row => { priceMap[row.id_prod] = row.price; });
      // เพิ่ม field price_latest ให้แต่ละ product
      const merged = result.map(row => ({ ...row, price_latest: priceMap[row.id_product] || null }));
      res.json(merged);
    } else {
      res.json([]); // Return an empty array if no results found
    }
  } catch (err) {
    console.error("Error fetching latest price date:", err);
    res.status(500).json({ success: false, message: "Database error (latest date)" });
  }
});

app.post('/app_showprice', async (req, res) => {
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
      AND tb_product.prod_status = 1
  `;

  let params = [date, id_maintype];

  if (id_result && id_result !== '-1') {
    sql += " AND tb_price.id_result = ? ";
    params.push(id_result);
  }

  sql += " GROUP BY tb_product.id_product ";

  try {
    const [result] = await conn.query(sql, params);
    if (result.length > 0) {
      console.log("Fetched prices:", result[0]);
      res.json(result);
    } else {
      console.log("No prices found for the given criteria");
      res.json([]); // Return an empty array if no results found
    }
  } catch (err) {
    console.error("Error executing query:", err);
    return res.status(500).json({ success: false, message: "Database error" });
  }
});

app.post('/app_saveprice', async (req, res) => {
  console.log("Received request to save prices");
  const filteredPayload = req.body.filteredPayload;
  if (!Array.isArray(filteredPayload) || filteredPayload.length === 0) {
    return res.status(400).json({ success: false, message: "No data to save" });
  }

  let valTime = moment().format('HH:mm:ss');
  let inserted = 0;
  let updated = 0;

  try {
    for (const item of filteredPayload) {
      // เช็คว่ามีข้อมูลนี้อยู่หรือยัง
      const [rows] = await conn.query(
        'SELECT id FROM tb_price WHERE price_date = ? AND id_prod = ? AND id_result = ?',
        [item.date, item.id_prod, item.id_result]
      );
      if (rows.length > 0) {
        // update
        await conn.query(
          'UPDATE tb_price SET price = ?, price_time = ? WHERE price_date = ? AND id_prod = ? AND id_result = ?',
          [item.price, valTime, item.date, item.id_prod, item.id_result]
        );
        updated++;
      } else {
        // insert
        await conn.query(
          'INSERT INTO tb_price (price, price_date, price_time, id_prod, id_result) VALUES (?, ?, ?, ?, ?)',
          [item.price, item.date, valTime, item.id_prod, item.id_result]
        );
        inserted++;
      }
    }
    res.json({ success: true, message: "Prices saved successfully", inserted, updated });
  } catch (err) {
    console.error("Error saving prices:", err);
    return res.status(500).json({ success: false, message: "Database error" });
  }
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

app.post('/app_uploadimg', upload.single('image'), async (req, res) => {
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
  try {
    await conn.query(sql, [newFilename]);
    res.json({ success: true, message: 'File uploaded and saved to DB', filename: newFilename, path: `/public/upload/${newFilename}` });
  } catch (err) {
    console.error('Error saving image filename:', err);
    return res.status(500).json({ success: false, message: 'Database error (insert image)' });
  }
});

app.get('/app_listimg', async (req, res) => {
  const sql = 'SELECT * FROM tb_img ORDER BY id DESC';
  try {
    const [results] = await conn.query(sql);
    res.json(results);
  } catch (err) {
    console.error('Error fetching images:', err);
    return res.status(500).json({
      success: false, message: 'Database error'
    });
  }
});

// ให้ Express ให้บริการไฟล์ใน /public/upload ผ่าน /upload
app.use('/upload', express.static(path.join(__dirname, 'public', 'upload')));

app.get('/app_listproducts', async (req, res) => {
  console.log("Fetching list of products...today");
  let allProducts = [];
  // รองรับการส่ง date และ id_result มาทาง query string
  let dateNow = req.query.date || moment().format('YYYY-MM-DD');
  let id_result = req.query.id_result;
  console.log("Fetching products for date:", dateNow, "id_result:", id_result);
  let sql = `
    SELECT 
      tb_product.id_product,
      tb_product.name_pro,
      tb_maintype.name_maintype,
      tb_unit.unitname,
      tb_price.price,
      tb_price.price_date,
      tb_price.id_result,
      tb_result.name_result
    FROM tb_product
    LEFT JOIN tb_maintype ON tb_product.id_group = tb_maintype.id
    LEFT JOIN tb_unit ON tb_product.id_unit = tb_unit.id_unit
    LEFT JOIN tb_price ON tb_product.id_product = tb_price.id_prod
    LEFT JOIN tb_result ON tb_price.id_result = tb_result.id
    WHERE tb_price.price_date = ?
    AND tb_product.prod_status = 1
  `;
  let params = [dateNow];
  if (id_result && id_result !== '-1') {
    sql += ' AND tb_price.id_result = ?';
    params.push(id_result);
  }
  sql += ' ORDER BY tb_maintype.name_maintype, tb_product.id_product, tb_price.id_result';
  try {
    const [result] = await conn.query(sql, params);
    allProducts = result;
    console.log("Fetched products:", allProducts.length, "items");
    res.json(groupProductsByid_product(allProducts));
  } catch (err) {
    console.error("Error executing query:", err);
    return res.status(500).json({ success: false, message: "Database error" });
  }

  function groupProductsByid_product(products) {
    // กลุ่มข้อมูลตาม id_product ก่อน
    const grouped = products.reduce((acc, product) => {
      if (!acc[product.id_product]) {
        acc[product.id_product] = [];
      }
      acc[product.id_product].push(product);
      return acc;
    }, {});
    // แปลงให้อยู่ในรูปแบบที่ต้องการ (array ของ object)
    return Object.values(grouped).map(arr => {
      // arr คือ array ของ product ที่ id_product เดียวกัน
      const first = arr[0];
      return {
        id_product: first.id_product,
        name_pro: first.name_pro,
        price: first.price,
        name_maintype: first.name_maintype,
        result: arr.map(item => ({
          price: item.price,
          id_result: item.id_result,
          name_result: item.name_result
        })),
        unitname: first.unitname,
        price_date: first.price_date
      };
    });
  }
});

app.get('/app_listproducts_yeserday', async (req, res) => {
  console.log("Fetching list of products...yesterday");
  let allProducts = [];
  // รองรับการส่ง date และ id_result มาทาง query string
  let dateYesterDay = req.query.date || req.query.yesterdayStr || moment().subtract(1, 'days').format('YYYY-MM-DD');
  let id_result = req.query.id_result;
  console.log("Fetching products for date:", dateYesterDay, "id_result:", id_result);
  let sql = `
    SELECT 
      tb_product.id_product,
      tb_product.name_pro,
      tb_maintype.name_maintype,
      tb_unit.unitname,
      tb_price.price,
      tb_price.price_date,
      tb_price.id_result,
      tb_result.name_result
    FROM tb_product
    LEFT JOIN tb_maintype ON tb_product.id_group = tb_maintype.id
    LEFT JOIN tb_unit ON tb_product.id_unit = tb_unit.id_unit
    LEFT JOIN tb_price ON tb_product.id_product = tb_price.id_prod
    LEFT JOIN tb_result ON tb_price.id_result = tb_result.id
    WHERE tb_price.price_date = ?
  `;
  let params = [dateYesterDay];
  if (id_result && id_result !== '-1') {
    sql += ' AND tb_price.id_result = ?';
    params.push(id_result);
  }
  sql += ' ORDER BY tb_maintype.name_maintype, tb_product.id_product, tb_price.id_result';
  try {
    const [result] = await conn.query(sql, params);
    allProducts = result;
    console.log("Fetched products:", allProducts.length, "items");
    res.json(groupProductsByid_product(allProducts));
  } catch (err) {
    console.error("Error executing query:", err);
    return res.status(500).json({ success: false, message: "Database error" });
  }

  function groupProductsByid_product(products) {
    // กลุ่มข้อมูลตาม id_product ก่อน
    const grouped = products.reduce((acc, product) => {
      if (!acc[product.id_product]) {
        acc[product.id_product] = [];
      }
      acc[product.id_product].push(product);
      return acc;
    }, {});
    // แปลงให้อยู่ในรูปแบบที่ต้องการ (array ของ object)
    return Object.values(grouped).map(arr => {
      // arr คือ array ของ product ที่ id_product เดียวกัน
      const first = arr[0];
      return {
        id_product: first.id_product,
        name_pro: first.name_pro,
        price: first.price,
        name_maintype: first.name_maintype,
        result: arr.map(item => ({
          price: item.price,
          id_result: item.id_result,
          name_result: item.name_result
        })),
        unitname: first.unitname,
        price_date: first.price_date
      };
    });
  }
});

app.get('/app_vegetable-prices', async (req, res) => {
  // ดึง id ผัก 5 ตัว จากฐานข้อมูล
  const getProductIds = async () => {
    const sql = 'SELECT id_product FROM tb_product WHERE chart_status = 1 LIMIT 5';
    const [results] = await conn.query(sql);
    const ids = results.map(row => row.id_product);
    return ids;
  };

  // รับ id_result จาก query string ถ้าไม่มีให้ default เป็น 1
  const id_result = req.query.id_result ? parseInt(req.query.id_result) : 1;

  try {
    const ids = await getProductIds();
    if (ids.length !== 5) {
      return res.status(400).json({ success: false, message: "ไม่พบผัก chart_status = 1 ครบ 5 ตัว" });
    }
    const sql = `
      SELECT 
        tb_product.id_product,
        tb_product.name_pro,
        tb_maintype.name_maintype,
        tb_unit.unitname,
        tb_price.price,
        tb_price.price_date,
        tb_price.id_result,
        tb_result.name_result
      FROM tb_product
      LEFT JOIN tb_maintype ON tb_product.id_group = tb_maintype.id
      LEFT JOIN tb_unit ON tb_product.id_unit = tb_unit.id_unit
      LEFT JOIN tb_price ON tb_product.id_product = tb_price.id_prod
      LEFT JOIN tb_result ON tb_price.id_result = tb_result.id
      WHERE tb_price.price_date BETWEEN CURDATE() - INTERVAL 6 DAY AND CURDATE()
        AND tb_product.id_product IN (?, ?, ?, ?, ?)
        AND tb_result.id = ?
      ORDER BY tb_maintype.name_maintype, tb_product.id_product, tb_price.price_date, tb_price.id_result
    `;
    const [result] = await conn.query(sql, [...ids, id_result]);
    // map date ให้เป็น 10/02/25
    const mapped = result.map(row => ({
      ...row,
      date: row.price_date ? require('moment')(row.price_date).format('DD/MM/YY') : null
    }));
    res.json(mapped);
  } catch (err) {
    console.error("Error fetching product IDs:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

app.get('/app_listprompts', async (req, res) => {
  const sql = 'SELECT * FROM tb_prompt ORDER BY id DESC';
  try {
    const [results] = await conn.query(sql);
    res.json(results);
  } catch (err) {
    console.error('Error fetching prompts:', err);
    return res.status(500).json({ success: false, message: 'Database error' });
  }
});

app.get('/app_latestprices', async (req, res) => {
  // ดึงวันที่ล่าสุดจาก tb_price
  try {
    const [latestDateRow] = await conn.query('SELECT MAX(price_date) AS latest_date FROM tb_price');
    const latestDate = latestDateRow[0].latest_date;
    if (!latestDate) {
      return res.status(404).json({ success: false, message: 'No price data found' });
    }
    const sql = `
      SELECT 
        tb_product.id_product,
        tb_product.name_pro,
        tb_maintype.name_maintype,
        tb_unit.unitname,
        tb_price.price,
        tb_price.price_date,
        tb_price.id_result,
        tb_result.name_result
      FROM tb_product
      LEFT JOIN tb_maintype ON tb_product.id_group = tb_maintype.id
      LEFT JOIN tb_unit ON tb_product.id_unit = tb_unit.id_unit
      LEFT JOIN tb_price ON tb_product.id_product = tb_price.id_prod
      LEFT JOIN tb_result ON tb_price.id_result = tb_result.id
      WHERE tb_price.price_date = ?
      ORDER BY tb_maintype.name_maintype, tb_product.id_product, tb_price.id_result
    `;
    const [result] = await conn.query(sql, [latestDate]);
    res.json(result);
  } catch (err) {
    console.error('Error fetching latest price date:', err);
    return res.status(500).json({ success: false, message: 'Database error' });
  }
});

app.get('/app_listshow', async (req, res) => {
  try {
    const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
    const pageSize = 20;
    const offset = (page - 1) * pageSize;
    const search = req.query.search ? req.query.search.trim() : '';

    let where = '';
    let params = [];
    if (search) {
      where = 'WHERE tb_product.name_pro LIKE ?';
      params.push(`%${search}%`);
    }

    // ดึงจำนวนทั้งหมด (filter ด้วย search ถ้ามี)
    const [countRows] = await conn.query(
      `SELECT COUNT(*) as total FROM tb_product ${where}`,
      params
    );
    const total = countRows[0].total;
    const totalPages = Math.ceil(total / pageSize);

    // ดึงข้อมูลหน้าปัจจุบัน (filter ด้วย search ถ้ามี)
    const [rows] = await conn.query(
      `SELECT tb_product.*, tb_maintype.name_maintype, tb_unit.unitname
       FROM tb_product
       LEFT JOIN tb_maintype ON tb_product.id_group = tb_maintype.id
       LEFT JOIN tb_unit ON tb_product.id_unit = tb_unit.id_unit
       ${where}
       ORDER BY id_product LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    );
    res.json({
      data: rows,
      page,
      pageSize,
      total,
      totalPages
    });
  } catch (err) {
    console.error('Error fetching product list:', err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

app.post('/app_update_prodstatus', async (req, res) => {
  const { id_product, prod_status } = req.body;
  if (!id_product || typeof prod_status === 'undefined') {
    return res.status(400).json({ success: false, message: 'Missing id_product or prod_status' });
  }
  try {
    await conn.query('UPDATE tb_product SET prod_status = ? WHERE id_product = ?', [prod_status, id_product]);
    res.json({ success: true, message: 'Product status updated', id_product, prod_status });
  } catch (err) {
    console.error('Error updating prod_status:', err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});



const port = 4222;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});