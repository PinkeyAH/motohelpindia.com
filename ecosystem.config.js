module.exports = {
  apps: [
    {
      name: "api-gateway",
      script: "./api-gateway/index.js",
      cwd: "/var/www/neotechnet.com/Moto_Help_Microservices"
    },
    {
      name: "vendor-service",
      script: "./vendor-service/index.js",
      cwd: "/var/www/neotechnet.com/Moto_Help_Microservices"
    },
    {
      name: "driver-service",
      script: "./driver-service/index.js",
      cwd: "/var/www/neotechnet.com/Moto_Help_Microservices"
    },
    {
      name: "customer-service",
      script: "./customer-service/index.js",
      cwd: "/var/www/neotechnet.com/Moto_Help_Microservices"
    }
  ]
};
