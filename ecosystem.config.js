module.exports = {
  apps: [
    {
      name: "api-gateway",
      script: "./api-gateway/index.js",
      cwd: "/var/www/motohelpindia.com"
    },
    {
      name: "vendor-service",
      script: "./vendor-service/index.js",
      cwd: "/var/www/motohelpindia.com"
    },
    {
      name: "driver-service",
      script: "./driver-service/index.js",
      cwd: "/var/www/motohelpindia.com"
    },
    {
      name: "customer-service",
      script: "./customer-service/index.js",
      cwd: "/var/www/motohelpindia.com"
    }
  ]
};
