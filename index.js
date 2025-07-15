require('dotenv').config();
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

// เปลี่ยนจาก createConnection เป็น createPool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

function parseLine(line) {
  // ตัวอย่าง: "ตลาดไท-ผักบุ้งไทย-24-บาท/มัด" หรือ "ตลาดไท ผักบุ้งไทย 24 บาท/มัด" หรือ "ผักชีไทย 25 บาท"
  // รองรับทั้งแบ่งด้วย - หรือ ช่องว่าง
  let parts = line.split("-");
  if (parts.length < 3) {
    // ถ้าไม่ใช่ - ให้ลอง split ด้วยช่องว่าง (เว้นวรรค)
    parts = line.trim().split(/\s+/);
    if (parts.length < 2) return null;
    let market, product, priceStr;
    if (parts.length === 3) {
      // ถ้าอันแรกขึ้นต้นด้วย "ตลาด" ให้ถือว่าเป็น market
      if (/^ตลาด/.test(parts[0])) {
        [market, product, priceStr] = parts;
      } else {
        // ไม่ใช่ตลาด ให้ default market = ตลาดศรีเมือง
        [product, priceStr] = [parts[0], parts[1]];
        market = 'ตลาดศรีเมือง';
      }
    } else if (parts.length === 2) {
      [product, priceStr] = parts;
      market = 'ตลาดศรีเมือง';
    } else if (parts.length > 3) {
      // ถ้ามากกว่า 3 ช่อง ให้เอาตัวแรกเป็น market ถ้าไม่ใช่ตลาด ให้ default เป็นตลาดศรีเมือง
      if (/^ตลาด/.test(parts[0])) {
        [market, product, priceStr] = parts;
      } else {
        [product, priceStr] = [parts[0], parts[1]];
        market = 'ตลาดศรีเมือง';
      }
    } else {
      return null;
    }
    // เพิ่ม mapping สำรวจ → สำรวจ
    if (market && (market === 'สำรวจ' || market === 'ตลาดสำรวจ')) {
      market = 'สำรวจ';
    }
    const price = parseFloat(priceStr.replace(/[^\d.]/g, ""));
    return {
      market: (market && market.trim()) ? market.trim() : 'ตลาดศรีเมือง',
      product: product.trim(),
      price,
    };
  } else {
    // เดิม: แบ่งด้วย -
    let [market, product, priceStr] = parts;
    if (!market || market === '' || market === '-') market = 'ตลาดศรีเมือง';
    // เพิ่ม mapping สำรวจ → สำรวจ
    if (market && (market === 'สำรวจ' || market === 'ตลาดสำรวจ')) {
      market = 'สำรวจ';
    }
    const price = parseFloat(priceStr.replace(/[^\d.]/g, ""));
    return {
      market: (market && market.trim()) ? market.trim() : 'ตลาดศรีเมือง',
      product: product.trim(),
      price,
    };
  }
}

app.post('/app_insertdata', async (req, res) => {
  try {
    // รับข้อมูลแบบ text หรือ array ก็ได้
    let { data, price_date, price_time } = req.body;
    // console.log("Received data:", data);
    
    if (!data) return res.status(400).json({ error: "No data" });

    // data อาจเป็น string ยาวหรือ array
    if (typeof data === 'string') {
      data = data.trim().split('\n').map(line => line.trim()).filter(line => line.length > 0);
    }

    // ดึงข้อมูลตลาดและสินค้า (map ชื่อเป็น id)
    const [results] = await pool.query('SELECT id, name_result FROM tb_result');
    const [products] = await pool.query('SELECT id_product, name_pro FROM tb_product');

    // console.log("Fetched results:", results
    //   , "\nFetched products:", products
    // );
    

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
    let insertedNames = [];
    let updatedNames = [];
    for (const line of data) {
      const parsed = parseLine(line);
      if (!parsed) continue;
      const { market, product, price } = parsed;
      // ข้ามถ้าไม่มี id
      if (!resultMap[market] || !productMap[product] || isNaN(price)) continue;

      // เช็คว่ามีข้อมูลนี้อยู่หรือยัง
      const [rows] = await pool.query(
        'SELECT id FROM tb_price WHERE price_date = ? AND id_prod = ? AND id_result = ?',
        [today, productMap[product], resultMap[market]]
      );
      if (rows.length > 0) {
        // update
        await pool.query(
          'UPDATE tb_price SET price = ?, price_time = ? WHERE price_date = ? AND id_prod = ? AND id_result = ?',
          [price, time, today, productMap[product], resultMap[market]]
        );
        updated++;
        updatedNames.push(product);
      } else {
        // insert
        await pool.query(
          'INSERT INTO tb_price (price, price_date, price_time, id_prod, id_result) VALUES (?, ?, ?, ?, ?)',
          [price, today, time, productMap[product], resultMap[market]]
        );
        inserted++;
        insertedNames.push(product);
      }
    }

    res.json({ status: 'ok', inserted, updated, insertedNames, updatedNames });
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
    const [result] = await pool.query(
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
    const [results] = await pool.query('SELECT * FROM tb_result');
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
    const [result] = await pool.query(sql);
    res.json(result);
  } catch (err) {
    console.error("Error executing query:", err);
    return res.status(500).json({ success: false, message: "Database error" });
  }
});

app.get('/app_unit', async (req, res) => {
  try {
    // console.log("Fetching list of units...");
    const sql = "SELECT * FROM tb_unit";
    const [result] = await pool.query(sql);
    // console.log("Fetched units:", result);
    res.json(result);
  } catch (err) {
    console.error("Error executing query:", err);
    return res.status(500).json({ success: false, message: "Database error" });
  }
});

app.get('/app_result', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM tb_result');
    res.json(results);
  } catch (err) {
    console.error('Error fetching results:', err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

app.get('/app_getmaintypes/:id/:id_result', async (req, res) => {
  const id = req.params.id;
  const id_result = req.params.id_result;
  // console.log("Fetching image price for ID:", id, "id_result:", id_result);

  let sql = "SELECT * FROM tb_product ";
  sql += "INNER JOIN tb_maintype ON tb_product.id_group = tb_maintype.id ";
  sql += "WHERE tb_maintype.id = ? ";
  sql += "AND prod_status = 1 ";

  try {
    // ดึงวันที่ล่าสุดจาก tb_price
    const [latestDateRow] = await pool.query('SELECT MAX(price_date) AS latest_date FROM tb_price');
    const latestDate = latestDateRow[0].latest_date;
    const [result] = await pool.query(sql, [id]);
    if (result.length > 0) {
      // ดึงราคาล่าสุดของแต่ละ product เฉพาะ id_result ที่รับมา
      const prodIds = result.map(row => row.id_product);
      if (prodIds.length === 0) return res.json(result);
      const priceSql = `SELECT id_prod, price FROM tb_price WHERE price_date = ? AND id_result = ? AND id_prod IN (${prodIds.map(() => '?').join(',')})`;
      const [priceRows] = await pool.query(priceSql, [latestDate, id_result, ...prodIds]);
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
  const { date, id_result, id_maintype } = req.body;

  let sql = `
    SELECT 
      tb_product.id_product,
      tb_product.name_pro,
      tb_maintype.name_maintype,
      tb_unit.unitname,
      tb_price.price,
      tb_price.price_date,
      tb_price.id_result,
      tb_result.name_result,
      tb_product.img_name
    FROM tb_product
    LEFT JOIN tb_maintype ON tb_product.id_group = tb_maintype.id
    LEFT JOIN tb_unit ON tb_product.id_unit = tb_unit.id_unit
    LEFT JOIN tb_price ON tb_product.id_product = tb_price.id_prod AND tb_price.price_date = ?
    LEFT JOIN tb_result ON tb_price.id_result = tb_result.id
    WHERE tb_product.prod_status = 1
  `;
  let params = [date];
  if (id_maintype && id_maintype !== '0' && id_maintype !== 0) {
    sql += ' AND tb_maintype.id = ?';
    params.push(id_maintype);
  }
  if (id_result && id_result !== '-1') {
    sql += ' AND tb_price.id_result = ?';
    params.push(id_result);
  }
  sql += ' ORDER BY tb_maintype.name_maintype, tb_product.id_product, tb_price.id_result';
  try {
    const [result] = await pool.query(sql, params);
    // กลุ่มข้อมูลตาม id_product
    const grouped = result.reduce((acc, product) => {
      if (!acc[product.id_product]) acc[product.id_product] = [];
      acc[product.id_product].push(product);
      return acc;
    }, {});
    // แปลงให้อยู่ในรูปแบบที่ต้องการ (array ของ object)
    const products = Object.values(grouped).map(arr => {
      const { img_name, ...rest } = arr[0];
      return { ...rest, img_name, prices: arr };
    });
    res.json(products);
  } catch (err) {
    console.error("Error executing query:", err);
    return res.status(500).json({ success: false, message: "Database error" });
  }
});

app.post('/app_saveprice', async (req, res) => {
  // console.log("Received request to save prices");
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
      const [rows] = await pool.query(
        'SELECT id FROM tb_price WHERE price_date = ? AND id_prod = ? AND id_result = ?',
        [item.date, item.id_prod, item.id_result]
      );
      if (rows.length > 0) {
        // update
        await pool.query(
          'UPDATE tb_price SET price = ?, price_time = ? WHERE price_date = ? AND id_prod = ? AND id_result = ?',
          [item.price, valTime, item.date, item.id_prod, item.id_result]
        );
        updated++;
      } else {
        // insert
        await pool.query(
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

  // Insert new filename into tb_img พร้อม img_status = 'active'
  const sql = 'INSERT INTO tb_img (name_img, img_status) VALUES (?, ?)';
  try {
    await pool.query(sql, [newFilename, 1]);
    res.json({ success: true, message: 'File uploaded and saved to DB', filename: newFilename, path: `/public/upload/${newFilename}` });
  } catch (err) {
    console.error('Error saving image filename:', err);
    return res.status(500).json({ success: false, message: 'Database error (insert image)' });
  }
});

app.get('/app_listimg', async (req, res) => {
  const sql = 'SELECT * FROM tb_img ORDER BY id_order ASC';
  try {
    const [results] = await pool.query(sql);
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

// สลับลำดับรูปภาพ (id_order) ระหว่าง 2 id
app.put('/app_swapimgorder', async (req, res) => {
  const { id1, id2 } = req.body;
  // console.log('swapimgorder req.body:', req.body);
  if (!id1 || !id2) {
    console.log('Missing id1 or id2');
    return res.status(400).json({ success: false, message: 'Missing id1 or id2' });
  }
  try {
    // ดึง id_order ของแต่ละภาพ
    const [rows] = await pool.query('SELECT id, id_order FROM tb_img WHERE id IN (?, ?)', [id1, id2]);
    console.log('swapimgorder rows:', rows);
    if (rows.length !== 2) {
      console.log('Images not found');
      return res.status(404).json({ success: false, message: 'Images not found' });
    }
    const img1 = rows.find(r => r.id == id1);
    const img2 = rows.find(r => r.id == id2);
    console.log('img1:', img1, 'img2:', img2);
    // สลับค่า id_order
    await pool.query('UPDATE tb_img SET id_order = ? WHERE id = ?', [img2.id_order, img1.id]);
    await pool.query('UPDATE tb_img SET id_order = ? WHERE id = ?', [img1.id_order, img2.id]);
    console.log('Swapped id_order:', img1.id, img2.id);
    res.json({ success: true, message: 'Swapped image order', id1, id2 });
  } catch (err) {
    console.error('Error swapping image order:', err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

// อัปเดตลำดับรูปภาพ (id_order)
app.put('/app_updateimgorder', async (req, res) => {
  console.log("Updating image order with data:", req.body);
  const { id, id_order } = req.body;
  if (!id || typeof id_order === 'undefined') {
    return res.status(400).json({ success: false, message: 'Missing id or id_order' });
  }
  try {
    await pool.query('UPDATE tb_img SET id_order = ? WHERE id = ?', [id_order, id]);
    res.json({ success: true, message: 'Image order updated', id, id_order });
  } catch (err) {
    console.error('Error updating image order:', err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

// ลบรูปภาพจากฐานข้อมูลและไฟล์จริง
app.delete('/app_deleteimg/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await pool.query('SELECT name_img FROM tb_img WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Image not found' });
    const filename = rows[0].name_img;
    // ลบไฟล์จริง
    const filePath = path.join(__dirname, 'public', 'upload', filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    // ลบ record ในฐานข้อมูล
    await pool.query('DELETE FROM tb_img WHERE id = ?', [id]);
    res.json({ success: true, message: 'Image deleted', filename });
  } catch (err) {
    console.error('Error deleting image:', err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

app.get('/app_listproducts', async (req, res) => {
  // console.log("Fetching list of products...today");
  let allProducts = [];
  // รองรับการส่ง date, id_result, id_maintype มาทาง query string
  let dateNow = req.query.date || moment().format('YYYY-MM-DD');
  let id_result = req.query.id_result;
  let id_maintype = req.query.id_maintype;
  // console.log("Fetching products for date:", dateNow, "id_result:", id_result, "id_maintype:", id_maintype);
  let sql = `
    SELECT 
      tb_product.id_product,
      tb_product.name_pro,
      tb_maintype.name_maintype,
      tb_unit.unitname,
      tb_price.price,
      tb_price.price_date,
      tb_price.id_result,
      tb_result.name_result,
      tb_product.img_name
    FROM tb_product
    LEFT JOIN tb_maintype ON tb_product.id_group = tb_maintype.id
    LEFT JOIN tb_unit ON tb_product.id_unit = tb_unit.id_unit
    LEFT JOIN tb_price ON tb_product.id_product = tb_price.id_prod
    LEFT JOIN tb_result ON tb_price.id_result = tb_result.id
    WHERE tb_price.price_date = ?
    AND tb_product.prod_status = 1
  `;
  let params = [dateNow];
  // เงื่อนไขเลือกทั้งหมด: ถ้า id_maintype ไม่มีหรือเป็น 0 ไม่ต้อง filter
  if (id_maintype && id_maintype !== '0' && id_maintype !== 0) {
    sql += ' AND tb_maintype.id = ?';
    params.push(id_maintype);
  }
  if (id_result && id_result !== '-1') {
    sql += ' AND tb_price.id_result = ?';
    params.push(id_result);
  }
  sql += ' ORDER BY tb_maintype.name_maintype, tb_product.id_product, tb_price.id_result';
  try {
    const [result] = await pool.query(sql, params);
    allProducts = result;
    // console.log("Fetched products:", allProducts.length, "items");
    res.json(groupProductsByid_product(allProducts));
  } catch (err) {
    console.error("Error executing query:", err);
    return res.status(500).json({ success: false, message: "Database error" });
  }

  function groupProductsByid_product(products) {
    // กลุ่มข้อมูลตาม id_product ก่อน
    const grouped = products.reduce((acc, product) => {
      const id = product.id_product;
      if (!acc[id]) {
        acc[id] = {
          id_product: product.id_product,
          name_pro: product.name_pro,
          name_maintype: product.name_maintype,
          unitname: product.unitname,
          img_name: product.img_name,
          result: []
        };
      }
      // เพิ่มข้อมูลราคาตามตลาด (ถ้ามี)
      if (product.name_result && product.price !== null && product.price !== undefined) {
        acc[id].result.push({
          name_result: product.name_result,
          price: product.price,
          price_date: product.price_date,
          id_result: product.id_result
        });
      }
      return acc;
    }, {});
    // แปลงให้อยู่ในรูปแบบที่ต้องการ (array ของ object)
    return Object.values(grouped);
  }
});

app.get('/app_listproducts_yeserday', async (req, res) => {
  // console.log("Fetching list of products...yesterday");
  let allProducts = [];
  // รองรับการส่ง date และ id_result มาทาง query string
  let dateYesterDay = req.query.date || req.query.yesterdayStr || moment().subtract(1, 'days').format('YYYY-MM-DD');
  let id_result = req.query.id_result;
  let id_maintype = req.query.id_maintype;
  // console.log("Fetching products for date:", dateYesterDay, "id_result:", id_result, "id_maintype:", id_maintype);
  let sql = `
    SELECT 
      tb_product.id_product,
      tb_product.name_pro,
      tb_maintype.name_maintype,
      tb_unit.unitname,
      tb_price.price,
      tb_price.price_date,
      tb_price.id_result,
      tb_result.name_result,
      tb_product.img_name
    FROM tb_product
    LEFT JOIN tb_maintype ON tb_product.id_group = tb_maintype.id
    LEFT JOIN tb_unit ON tb_product.id_unit = tb_unit.id_unit
    LEFT JOIN tb_price ON tb_product.id_product = tb_price.id_prod
    LEFT JOIN tb_result ON tb_price.id_result = tb_result.id
    WHERE tb_price.price_date = ?
  `;
  let params = [dateYesterDay];
  if (id_maintype && id_maintype !== '0' && id_maintype !== 0) {
    sql += ' AND tb_maintype.id = ?';
    params.push(id_maintype);
  }
  if (id_result && id_result !== '-1') {
    sql += ' AND tb_price.id_result = ?';
    params.push(id_result);
  }
  sql += ' ORDER BY tb_maintype.name_maintype, tb_product.id_product, tb_price.id_result';
  try {
    const [result] = await pool.query(sql, params);
    allProducts = result;
    // console.log("Fetched products:", allProducts.length, "items");
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
      // เพิ่ม img_name ใน object หลัก (ใช้ตัวแรกของกลุ่ม)
      const { img_name, ...rest } = arr[0];
      return { ...rest, img_name, prices: arr };
    });
  }
});

app.get('/app_vegetable-prices', async (req, res) => {
  // ดึง id ผัก 5 ตัว จากฐานข้อมูล
  const getProductIds = async () => {
    const sql = 'SELECT id_product FROM tb_product WHERE chart_status = 1 LIMIT 5';
    const [results] = await pool.query(sql);
    const ids = results.map(row => row.id_product);
    return ids;
  };

  // รับ id_result จาก query string ถ้าไม่มีให้ default เป็น 1
  const id_result = req.query.id_result ? parseInt(req.query.id_result) : 1;

  try {
    const ids = await getProductIds();
    if (!ids.length) return res.json([]); // ถ้าไม่มี id เลย return array ว่าง
    const placeholders = ids.map(() => '?').join(',');
    const sql = `
      SELECT 
        tb_product.id_product,
        tb_product.name_pro,
        tb_maintype.name_maintype,
        tb_unit.unitname,
        tb_price.price,
        tb_price.price_date,
        tb_price.id_result,
        tb_result.name_result,
        tb_product.img_name
      FROM tb_product
      LEFT JOIN tb_maintype ON tb_product.id_group = tb_maintype.id
      LEFT JOIN tb_unit ON tb_product.id_unit = tb_unit.id_unit
      LEFT JOIN tb_price ON tb_product.id_product = tb_price.id_prod
      LEFT JOIN tb_result ON tb_price.id_result = tb_result.id
      WHERE tb_price.price_date BETWEEN CURDATE() - INTERVAL 6 DAY AND CURDATE()
        AND tb_product.id_product IN (${placeholders})
        AND tb_result.id = ?
      ORDER BY tb_maintype.name_maintype, tb_product.id_product, tb_price.price_date, tb_price.id_result
    `;
    const [result] = await pool.query(sql, [...ids, id_result]);
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
    const [results] = await pool.query(sql);
    res.json(results);
  } catch (err) {
    console.error('Error fetching prompts:', err);
    return res.status(500).json({ success: false, message: 'Database error' });
  }
});

app.get('/app_latestprices', async (req, res) => {
  // ดึงวันที่ล่าสุดจาก tb_price
  try {
    const [latestDateRow] = await pool.query('SELECT MAX(price_date) AS latest_date FROM tb_price');
    const latestDate = latestDateRow[0].latest_date;
    if (!latestDate) return res.json([]);
    const sql = `
      SELECT 
        tb_product.id_product,
        tb_product.name_pro,
        tb_maintype.name_maintype,
        tb_unit.unitname,
        tb_price.price,
        tb_price.price_date,
        tb_price.id_result,
        tb_result.name_result,
        tb_product.img_name
      FROM tb_product
      LEFT JOIN tb_maintype ON tb_product.id_group = tb_maintype.id
      LEFT JOIN tb_unit ON tb_product.id_unit = tb_unit.id
      LEFT JOIN tb_price ON tb_product.id_product = tb_price.id_prod
      LEFT JOIN tb_result ON tb_price.id_result = tb_result.id
      WHERE tb_price.price_date = ?
      ORDER BY tb_maintype.name_maintype, tb_product.id_product, tb_price.id_result
    `;
    const [result] = await pool.query(sql, [latestDate]);
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
    const [countRows] = await pool.query(
      `SELECT COUNT(*) as total FROM tb_product ${where}`,
      params
    );
    const total = countRows[0].total;
    const totalPages = Math.ceil(total / pageSize);

    // ดึงข้อมูลหน้าปัจจุบัน (filter ด้วย search ถ้ามี)
    const [rows] = await pool.query(
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
    await pool.query('UPDATE tb_product SET prod_status = ? WHERE id_product = ?', [prod_status, id_product]);
    res.json({ success: true, message: 'Product status updated', id_product, prod_status });
  } catch (err) {
    console.error('Error updating prod_status:', err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

app.get('/app_product_req', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id_product, name_pro, unitname FROM tb_product 
       LEFT JOIN tb_unit ON tb_product.id_unit = tb_unit.id_unit
       WHERE prod_status = 1
       ORDER BY id_product`
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching product req:', err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

// --- Website CRUD ---
app.get('/app_listwebsite', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tb_website ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/app_listwebsite', async (req, res) => {
  const { name_website, url_website, web_status } = req.body;
  if (!name_website || !url_website) return res.status(400).json({ error: 'Missing data' });
  try {
    await pool.query('INSERT INTO tb_website (name_website, url_website, web_status) VALUES (?, ?, ?)', [name_website, url_website, web_status ?? 1]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.put('/app_listwebsite/:id', async (req, res) => {
  const { id } = req.params;
  const { name_website, url_website, web_status } = req.body;
  if (!name_website || !url_website) return res.status(400).json({ error: 'Missing data' });
  try {
    await pool.query('UPDATE tb_website SET name_website=?, url_website=?, web_status=? WHERE id=?', [name_website, url_website, web_status ?? 1, id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.delete('/app_listwebsite/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM tb_website WHERE id=?', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// --- Product Management CRUD ---
const productUpload = multer({ storage: storage });

app.post('/app_manage_product', productUpload.single('image'), async (req, res) => {
  const { name_pro, id_group, name_pro_en, name_pro_cn, id_unit, prod_status, chart_status } = req.body;
  let img_name = '';
  if (req.file) {
    // สร้างชื่อไฟล์ใหม่โดยเติมวันที่และเวลา
    const originalName = req.file.originalname;
    const ext = path.extname(originalName);
    const baseName = path.basename(originalName, ext);
    const now = moment().format('YYYYMMDD_HHmmss');
    const uniqueSuffix = now + '-' + Math.round(Math.random() * 1E9);
    const newFilename = `${baseName}_${uniqueSuffix}${ext}`;
    const oldPath = req.file.path;
    const newPath = path.join(req.file.destination, newFilename);
    fs.renameSync(oldPath, newPath);
    img_name = newFilename;
  }
  if (!name_pro || !id_group || !id_unit) return res.status(400).json({ error: 'Missing required fields' });
  try {
    await pool.query(
      `INSERT INTO tb_product (name_pro, id_group, name_pro_en, name_pro_cn, id_unit, prod_status, chart_status, img_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name_pro, id_group, name_pro_en || '', name_pro_cn || '', id_unit, prod_status ?? 1, chart_status ?? 0, img_name]
    );
    res.json({ success: true, img_name });
  } catch (err) {
    console.error('Error inserting product:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.put('/app_manage_product/:id', productUpload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name_pro, id_group, name_pro_en, name_pro_cn, id_unit, prod_status, chart_status } = req.body;
  let img_name = '';
  if (req.file) {
    // สร้างชื่อไฟล์ใหม่โดยเติมวันที่และเวลา
    const originalName = req.file.originalname;
    const ext = path.extname(originalName);
    const baseName = path.basename(originalName, ext);
    const now = moment().format('YYYYMMDD_HHmmss');
    const uniqueSuffix = now + '-' + Math.round(Math.random() * 1E9);
    const newFilename = `${baseName}_${uniqueSuffix}${ext}`;
    const oldPath = req.file.path;
    const newPath = path.join(req.file.destination, newFilename);
    fs.renameSync(oldPath, newPath);
    img_name = newFilename;
  }
  if (!name_pro || !id_group || !id_unit) return res.status(400).json({ error: 'Missing required fields' });
  try {
    let sql = `UPDATE tb_product SET name_pro = ?, id_group = ?, name_pro_en = ?, name_pro_cn = ?, id_unit = ?, prod_status = ?, chart_status = ?`;
    let params = [name_pro, id_group, name_pro_en || '', name_pro_cn || '', id_unit, prod_status ?? 1, chart_status ?? 0];
    if (img_name) {
      sql += ', img_name = ?';
      params.push(img_name);
    }
    sql += ' WHERE id_product = ?';
    params.push(id);
    await pool.query(sql, params);
    res.json({ success: true, img_name });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.delete('/app_manage_product/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM tb_product WHERE id_product = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ค้นหาชื่อสินค้า (autocomplete)
app.get('/app_searchname', async (req, res) => {
  const q = req.query.q ? req.query.q.trim() : '';
  if (!q || q.length < 3) {
    return res.json([]); // ต้องพิมพ์อย่างน้อย 3 ตัวอักษร
  }
  try {
    const [rows] = await pool.query(
      'SELECT id_product, name_pro FROM tb_product WHERE name_pro LIKE ? LIMIT 10',
      [`%${q}%`]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error searching product name:', err);
    res.status(500).json({ error: 'Database error' });
  }
});




app.get('/app_manage_product', async (req, res) => {
  try {
    const search = req.query.search ? req.query.search.trim() : '';
    const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
    const pageSize = 50;
    const offset = (page - 1) * pageSize;
    let where = '';
    let params = [];
    // เพิ่ม filter chart_status=1
    if (req.query.chart_status === '1') {
      where += (where ? ' AND ' : ' WHERE ') + 'chart_status = 1';
    }
    if (req.query.prod_status === '1') {
      where += (where ? ' AND ' : ' WHERE ') + 'prod_status = 1';
    }
    if (search) {
      where += (where ? ' AND ' : ' WHERE ') + '(name_pro LIKE ? OR name_pro_en LIKE ? OR name_pro_cn LIKE ?)';

      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    // ดึงจำนวนทั้งหมด
    const [countRows] = await pool.query(
      `SELECT COUNT(*) as total FROM tb_product${where}`,
      params
    );
    const total = countRows[0].total;
    const totalPages = Math.ceil(total / pageSize);
    // ดึงข้อมูลหน้าปัจจุบัน
    const [rows] = await pool.query(
      `SELECT tb_product.*, tb_maintype.name_maintype, tb_unit.unitname
       FROM tb_product
       LEFT JOIN tb_maintype ON tb_product.id_group = tb_maintype.id
       LEFT JOIN tb_unit ON tb_product.id_unit = tb_unit.id_unit
       ${where}
       ORDER BY id_product ASC LIMIT ? OFFSET ?`,
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
    console.error('Error fetching products:', err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

// --- สำหรับ Datecompareprices.js: ข้อมูลวันที่ 1 ---
app.get('/app_listproducts_startdate', async (req, res) => {
  let date = req.query.date;
  let id_result = req.query.id_result;
  let id_maintype = req.query.id_maintype;
  if (!date || !id_result) return res.status(400).json({ success: false, message: 'Missing date or id_result' });
  try {
    let sql = `
      SELECT 
        tb_product.id_product,
        tb_product.name_pro,
        tb_maintype.name_maintype,
        tb_unit.unitname,
        tb_price.price,
        tb_price.price_date,
        tb_price.id_result,
        tb_result.name_result,
        tb_product.img_name
      FROM tb_product
      LEFT JOIN tb_maintype ON tb_product.id_group = tb_maintype.id
      LEFT JOIN tb_unit ON tb_product.id_unit = tb_unit.id_unit
      LEFT JOIN tb_price ON tb_product.id_product = tb_price.id_prod
      LEFT JOIN tb_result ON tb_price.id_result = tb_result.id
      WHERE tb_price.price_date = ?
        AND tb_price.id_result = ?
        AND tb_product.prod_status = 1
    `;
    let params = [date, id_result];
    if (id_maintype && id_maintype !== '0' && id_maintype !== 0) {
      sql += ' AND tb_maintype.id = ?';
      params.push(id_maintype);
    }
    sql += ' ORDER BY tb_maintype.name_maintype, tb_product.id_product, tb_price.id_result';
    const [result] = await pool.query(sql, params);
    // group by id_product
    const grouped = result.reduce((acc, product) => {
      const id = product.id_product;
      if (!acc[id]) {
        acc[id] = {
          id_product: product.id_product,
          name_product: product.name_pro,
          name_maintype: product.name_maintype,
          unit: product.unitname,
          image: product.img_name,
          detail: '',
          result: []
        };
      }
      if (product.name_result && product.price !== null && product.price !== undefined) {
        acc[id].result.push({
          name_result: product.name_result,
          price: product.price,
          price_date: product.price_date,
          id_result: product.id_result
        });
      }
      return acc;
    }, {});
    res.json(Object.values(grouped));
  } catch (err) {
    console.error('Error fetching startdate products:', err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

// --- สำหรับ Datecompareprices.js: ข้อมูลวันที่ 2 ---
app.get('/app_listproducts_enddate', async (req, res) => {
  let date = req.query.date;
  let id_result = req.query.id_result;
  let id_maintype = req.query.id_maintype;
  if (!date || !id_result) return res.status(400).json({ success: false, message: 'Missing date or id_result' });
  try {
    let sql = `
      SELECT 
        tb_product.id_product,
        tb_product.name_pro,
        tb_maintype.name_maintype,
        tb_unit.unitname,
        tb_price.price,
        tb_price.price_date,
        tb_price.id_result,
        tb_result.name_result,
        tb_product.img_name
      FROM tb_product
      LEFT JOIN tb_maintype ON tb_product.id_group = tb_maintype.id
      LEFT JOIN tb_unit ON tb_product.id_unit = tb_unit.id_unit
      LEFT JOIN tb_price ON tb_product.id_product = tb_price.id_prod
      LEFT JOIN tb_result ON tb_price.id_result = tb_result.id
      WHERE tb_price.price_date = ?
        AND tb_price.id_result = ?
        AND tb_product.prod_status = 1
    `;
    let params = [date, id_result];
    if (id_maintype && id_maintype !== '0' && id_maintype !== 0) {
      sql += ' AND tb_maintype.id = ?';
      params.push(id_maintype);
    }
    sql += ' ORDER BY tb_maintype.name_maintype, tb_product.id_product, tb_price.id_result';
    const [result] = await pool.query(sql, params);
    // group by id_product (เหมือน startdate)
    const grouped = result.reduce((acc, product) => {
      const id = product.id_product;
      if (!acc[id]) {
        acc[id] = {
          id_product: product.id_product,
          name_product: product.name_pro,
          name_maintype: product.name_maintype,
          unit: product.unitname,
          image: product.img_name,
          detail: '',
          result: []
        };
      }
      if (product.name_result && product.price !== null && product.price !== undefined) {
        acc[id].result.push({
          name_result: product.name_result,
          price: product.price,
          price_date: product.price_date,
          id_result: product.id_result
        });
      }
      return acc;
    }, {});
    res.json(Object.values(grouped));
  } catch (err) {
    console.error('Error fetching enddate products:', err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

const port = process.env.PORT || 4222;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
