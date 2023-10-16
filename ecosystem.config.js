module.exports = {
  apps: [
    {
      name: 'sales',
      exec_mode: 'fork',
      instances: 1, // Or a number of instances
      script: 'npm',
      args: 'run api:prod',
    },
  ],
};
