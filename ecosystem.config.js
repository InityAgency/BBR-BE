module.exports = {
    apps: [
      {
        name: "nestjs-app",  // Change to your app name
        script: "pnpm",
        args: "start:prod",
        exec_mode: "fork",
        instances: 1,
        autorestart: true,
        watch: false,
      },
    ],
  };
  