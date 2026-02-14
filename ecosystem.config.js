module.exports = {
  apps: [
    {
      name: "orison-admin",
      script: "npm",
      args: "start",
      cwd: "/var/www/orison-admin/Orison_web_admin",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};
