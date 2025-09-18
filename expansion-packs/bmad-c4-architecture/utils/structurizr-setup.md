# Structurizr Lite Setup Guide

## Overview

This guide helps you set up Structurizr Lite for use with the BMAD C4 Architecture Expansion Pack.

## Prerequisites

- Docker (recommended) OR Java 17+ (for Spring Boot)
- Internet connection (for downloading)

## Installation

### Option 1: Docker (Recommended)

#### 1. Pull the Docker Image

```bash
docker pull structurizr/lite
```

#### 2. Create Data Directory

```bash
mkdir -p ~/structurizr
```

#### 3. Run Structurizr Lite

```bash
docker run -it --rm -p 8080:8080 -v ~/structurizr:/usr/local/structurizr structurizr/lite
```

### Option 2: Spring Boot

#### 1. Download the WAR File

```bash
wget https://github.com/structurizr/lite/releases/latest/download/structurizr-lite.war
```

#### 2. Create Data Directory

```bash
mkdir -p ~/structurizr
```

#### 3. Run Structurizr Lite

```bash
java -jar structurizr-lite.war ~/structurizr
```

### 4. Verify Installation

Open your browser and navigate to:

```
http://localhost:8080
```

You should see the Structurizr Lite interface.

## Configuration

### Default Settings

- **Port**: 8080
- **Host**: localhost
- **Data Directory**: `./data`

### Custom Configuration

You can customize Structurizr Lite by creating a `application.properties` file:

```properties
# Custom port
server.port=8080

# Custom data directory
structurizr.data.directory=./data

# Enable CORS (if needed)
structurizr.cors.enabled=true
```

## Usage with BMAD C4 Architecture

### 1. Start Structurizr Lite

```bash
cd structurizr-lite
./gradlew bootRun
```

### 2. Use C4 Architect Agent

```bash
# In your IDE
@c4-architect
*create-workspace
```

### 3. Import DSL Files

- Copy generated `.dsl` files to Structurizr Lite
- Use the web interface to visualize diagrams
- Export diagrams in various formats

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>

# Or use a different port
./gradlew bootRun --args='--server.port=8081'
```

### Java Version Issues

```bash
# Check Java version
java -version

# Install Java 17+ if needed (for Spring Boot option)
# Ubuntu/Debian
sudo apt install openjdk-17-jdk

# macOS
brew install openjdk@17

# Or use Docker instead (recommended)
docker pull structurizr/lite
```

### Memory Issues

```bash
# Increase heap size
export JAVA_OPTS="-Xmx2g"
./gradlew bootRun
```

## Integration with CI/CD

### Docker Setup

```dockerfile
FROM openjdk:11-jre-slim

WORKDIR /app
COPY structurizr-lite.jar .

EXPOSE 8080
CMD ["java", "-jar", "structurizr-lite.jar"]
```

### Docker Compose

```yaml
version: '3.8'
services:
  structurizr-lite:
    build: .
    ports:
      - '8080:8080'
    volumes:
      - ./data:/app/data
    environment:
      - JAVA_OPTS=-Xmx2g
```

## Best Practices

### 1. Data Management

- Regularly backup your Structurizr data directory
- Use version control for DSL files
- Keep workspace files organized

### 2. Performance

- Monitor memory usage
- Use appropriate heap size
- Consider scaling for large workspaces

### 3. Security

- Run behind a reverse proxy in production
- Use HTTPS for external access
- Restrict access to sensitive diagrams

## Support

For Structurizr Lite specific issues:

- [Structurizr Documentation](https://docs.structurizr.com/)
- [GitHub Issues](https://github.com/structurizr/lite/issues)
- [Structurizr Community](https://structurizr.com/help)

For BMAD C4 Architecture issues:

- [BMAD Discord](https://discord.gg/gk8jAdXWmj)
- [BMAD GitHub Issues](https://github.com/bmadcode/bmad-method/issues)
