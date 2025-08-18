module.exports = {
  apps: [
    {
      name: process.env.PM2_APP_NAME || "strapi-app",
      script: "npm",
      args: "start",
      cwd: process.env.PM2_CWD || __dirname,
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: process.env.PORT || 1337
      },
      env_production: {
        NODE_ENV: "production",
        PORT: process.env.PORT || 1337
      },
      // Logs
      log_file: "./logs/combined.log",
      out_file: "./logs/out.log",
      error_file: "./logs/error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      
      // Restart policy
      max_memory_restart: "1G",
      min_uptime: "10s",
      max_restarts: 10,
      
      // Watch mode (désactivé en production)
      watch: false,
      ignore_watch: ["node_modules", "logs", "public/uploads"],
      
      // Merge logs
      merge_logs: true,
      
      // Kill timeout
      kill_timeout: 5000,
      
      // Wait ready
      wait_ready: true,
      listen_timeout: 10000
    }
  ]
};
