const express = require('express');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = 5050;

app.use(express.json());
app.use(express.static('public'));

// Define your Docker command templates
const DOCKER_COMMANDS = {
  command1: {
    name: 'Run Both Server Variants',
    description: 'Runs two Docker containers with specified iterations and TODO limit',
    // Define your two docker commands here
    // Use {limit} as a placeholder
    commands: [
      'docker run --rm -p 9100:9100 java-mcp-server --bench {limit} --mode baseline',
      'docker run --rm -p 9101:9101 java-mcp-server --bench {limit} --mode structured',
      'docker run --rm -p 9102:9102 rust-mcp-server --bench {limit} --mode baseline',
      'docker run --rm -p 9103:9103 rust-mcp-server --bench {limit} --mode structured'
    ]
  }
};

app.post('/execute', (req, res) => {
  const { commandType, iterations, limit } = req.body;

  if (!DOCKER_COMMANDS[commandType]) {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid command type' 
    });
  }

  const commandConfig = DOCKER_COMMANDS[commandType];
  
  // Replace placeholders with actual values
  const commands = commandConfig.commands.map(cmd => 
    cmd.replace('{limit}', limit)
  );
  
  console.log(`Executing commands:`);
  commands.forEach((cmd, i) => console.log(`  [${i + 1}] ${cmd}`));

  // Execute both commands in parallel
  const execPromises = commands.map((command, index) => {
    return new Promise((resolve) => {
      exec(command, { timeout: 30000 }, (error, stdout, stderr) => {
        resolve({
          commandIndex: index + 1,
          command: command,
          success: !error,
          error: error ? error.message : null,
          stdout: stdout,
          stderr: stderr
        });
      });
    });
  });

  // Wait for both commands to complete
  Promise.all(execPromises).then(results => {
    const allSuccessful = results.every(r => r.success);
    
    res.json({
      success: allSuccessful,
      results: results,
      message: allSuccessful 
        ? 'Both commands executed successfully' 
        : 'One or more commands failed'
    });
  });
});

app.get('/commands', (req, res) => {
  res.json(DOCKER_COMMANDS);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});