#!/bin/bash
set -euo pipefail

REPO="necessarylion/aj-cli"
INSTALL_DIR="/usr/local/bin"
BINARY_NAME="aj"

# Detect OS
OS="$(uname -s)"
case "$OS" in
  Linux*)  OS="linux" ;;
  Darwin*) OS="darwin" ;;
  *)       echo "Unsupported OS: $OS"; exit 1 ;;
esac

# Detect architecture
ARCH="$(uname -m)"
case "$ARCH" in
  x86_64)  ARCH="x64" ;;
  aarch64) ARCH="arm64" ;;
  arm64)   ARCH="arm64" ;;
  *)       echo "Unsupported architecture: $ARCH"; exit 1 ;;
esac

ARTIFACT="aj-${OS}-${ARCH}"

# Get latest release tag
LATEST=$(curl -fsSL "https://api.github.com/repos/${REPO}/releases/latest" | grep '"tag_name"' | cut -d '"' -f 4)

if [ -z "$LATEST" ]; then
  echo "Failed to fetch latest release"
  exit 1
fi

DOWNLOAD_URL="https://github.com/${REPO}/releases/download/${LATEST}/${ARTIFACT}"

echo "Downloading ${BINARY_NAME} ${LATEST} (${OS}/${ARCH})..."
curl -fsSL "$DOWNLOAD_URL" -o "/tmp/${BINARY_NAME}"
chmod +x "/tmp/${BINARY_NAME}"

echo "Installing to ${INSTALL_DIR}/${BINARY_NAME}..."
if [ -w "$INSTALL_DIR" ]; then
  mv "/tmp/${BINARY_NAME}" "${INSTALL_DIR}/${BINARY_NAME}"
else
  sudo mv "/tmp/${BINARY_NAME}" "${INSTALL_DIR}/${BINARY_NAME}"
fi

echo "Successfully installed ${BINARY_NAME} ${LATEST}"
echo "Run 'aj --help' to get started"
