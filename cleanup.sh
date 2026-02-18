#!/bin/bash

# Cleanup script for time-tracker monorepo
# Removes node_modules, build, and dist folders from root and all workspaces

set -e

echo "🧹 Starting cleanup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to remove directory if it exists
remove_dir() {
    local dir=$1
    if [ -d "$dir" ]; then
        echo -e "${YELLOW}Removing: $dir${NC}"
        rm -rf "$dir"
        echo -e "${GREEN}✓ Removed: $dir${NC}"
    else
        echo -e "${RED}✗ Not found: $dir${NC}"
    fi
}

# Clean root node_modules
echo ""
echo "📦 Cleaning root directory..."
remove_dir "node_modules"

# Clean apps
echo ""
echo "📱 Cleaning apps..."
for app in apps/*/; do
    if [ -d "$app" ]; then
        echo ""
        echo "Processing: $app"
        remove_dir "${app}node_modules"
        remove_dir "${app}build"
        remove_dir "${app}dist"
    fi
done

# Clean packages
echo ""
echo "📦 Cleaning packages..."
for pkg in packages/*/; do
    if [ -d "$pkg" ]; then
        echo ""
        echo "Processing: $pkg"
        remove_dir "${pkg}node_modules"
        remove_dir "${pkg}build"
        remove_dir "${pkg}dist"
    fi
done

# Clean Turbo cache
echo ""
echo "🗑️  Cleaning Turbo cache..."
remove_dir ".turbo"

echo ""
echo -e "${GREEN}✅ Cleanup complete!${NC}"
