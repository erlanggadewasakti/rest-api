module.exports = {
  apps: [
    {
      name: 'mahasiswa-api',
      script: './dist/main.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
    {
      name: 'mahasiswa-studio',
      script: 'node_modules/prisma/build/index.js',
      args: 'studio --port 5555 --hostname 0.0.0.0 --browser none',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
    },
  ],
};
