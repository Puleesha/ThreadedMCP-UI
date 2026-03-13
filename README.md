# Docker Command Runner

A simple, clean web interface to run Docker commands with custom arguments.

## Features

- Clean, modern UI
- Two pre-configured Docker command options
- Real-time command execution
- Output display with success/error states
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- Docker installed and running on your system
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

## Usage

1. Start the server:
```bash
npm start
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

3. Enter your Docker arguments in the input fields and click "Run Command"

## Examples

### Command 1: Nginx Container
```
-d -p 8080:80 --name my-nginx nginx
```
This runs Nginx in detached mode on port 8080.

### Command 2: Ubuntu Container
```
--rm -it --name my-ubuntu ubuntu bash
```
This runs an interactive Ubuntu container that removes itself after exit.

## Customization

To modify the Docker commands, edit `server.js` and update the `DOCKER_COMMANDS` object:

```javascript
const DOCKER_COMMANDS = {
  command1: {
    name: 'Your Command Name',
    base: 'docker run',
    description: 'Your description'
  },
  command2: {
    name: 'Another Command',
    base: 'docker run',
    description: 'Another description'
  }
};
```

You can also update the UI text in `public/index.html`.

## Security Notes

⚠️ **Important Security Considerations:**

- This app executes Docker commands with the permissions of the Node.js process
- Only run this on a trusted network or localhost
- Consider implementing authentication for production use
- Validate and sanitize all inputs in production environments
- Never expose this to the public internet without proper security measures

## Project Structure

```
.
├── server.js           # Express backend server
├── public/
│   └── index.html      # Frontend UI
├── package.json        # Node.js dependencies
└── README.md          # This file
```

## Troubleshooting

**Docker commands not working?**
- Ensure Docker is running: `docker ps`
- Check Docker permissions: You may need to run with sudo or add your user to the docker group

**Port 3000 already in use?**
- Change the PORT variable in `server.js` to a different port

**Can't connect to the server?**
- Make sure the server is running: `npm start`
- Check firewall settings
