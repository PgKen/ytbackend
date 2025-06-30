module.exports = {
  apps: [
    {
      name: "ytbackend",
      script: "index.js",
      watch: false,
      // Log file paths
      error_file: "./logs/ytbackend-error.log",
      out_file: "./logs/ytbackend-out.log",
      log_date_format: "YYYY-MM-DD HH:mm Z",
      // Instance mode (uncomment if you want to scale)
      // instances: "max",
      // exec_mode: "cluster",
      env: {
        NODE_ENV: "production"
        // ให้ backend อ่าน PORT, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME จาก .env เท่านั้น
      },
      env_development: {
        NODE_ENV: "development"
        // เพิ่ม ENV สำหรับ dev ถ้าต้องการ
      },
      // Restart policy
      max_restarts: 5,
      min_uptime: 10000
    }
  ]
};
