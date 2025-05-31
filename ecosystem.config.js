module.exports = {
    apps: [
      {
        name: "nestjs-app",  // Change to your app name
        script: "pnpm",
        args: "start:prod",
        exec_mode: "cluster",
        instances: 'max',
        autorestart: true,
        watch: false,
      },
    ],
  };
  