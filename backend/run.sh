#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Load environment variables from .env if present
if [ -f ".env" ]; then
    set -a
    source <(grep -v '^#' .env | sed -e 's/\r$//')
    set +a
fi

# 1. Check if Maven is available
if ! command -v mvn &> /dev/null; then
    MAVEN_DIR="$SCRIPT_DIR/tools/apache-maven-3.9.9"
    if [ ! -f "$MAVEN_DIR/bin/mvn" ]; then
        echo "=================================================="
        echo " Maven not detected. Downloading portable Maven..."
        echo "=================================================="
        mkdir -p "$SCRIPT_DIR/tools"
        curl -L -o "$SCRIPT_DIR/tools/maven.zip" "https://archive.apache.org/dist/maven/maven-3/3.9.9/binaries/apache-maven-3.9.9-bin.zip"
        unzip -q "$SCRIPT_DIR/tools/maven.zip" -d "$SCRIPT_DIR/tools"
        rm -f "$SCRIPT_DIR/tools/maven.zip"
        echo "Maven ready!"
    fi
    export PATH="$MAVEN_DIR/bin:$PATH"
fi

echo "Using Maven: $(mvn -version | head -n 1)"
echo "Starting HRMS Spring Boot Backend on http://localhost:8081 ..."
mvn spring-boot:run
