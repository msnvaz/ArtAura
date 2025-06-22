# Client structure
$clientDirs = @(
    "client/public/assets/images",
    "client/public/assets/icons",
    "client/src/components/common",
    "client/src/components/art",
    "client/src/components/competition",
    "client/src/components/user",
    "client/src/pages",
    "client/src/hooks",
    "client/src/services",
    "client/src/context",
    "client/src/utils",
    "client/src/styles/components"
)

# Server structure
$serverDirs = @(
    "server/config",
    "server/controllers",
    "server/models",
    "server/routes",
    "server/middleware",
    "server/utils",
    "server/uploads/arts",
    "server/uploads/profiles",
    "server/database/migrations",
    "server/database/seeds",
    "server/tests/controllers",
    "server/tests/models",
    "server/tests/routes"
)

# Shared and docs
$otherDirs = @(
    "shared",
    "docs"
)

# Create all directories
foreach ($dir in $clientDirs + $serverDirs + $otherDirs) {
    New-Item -ItemType Directory -Path $dir -Force
    Write-Host "Created: $dir"
}

Write-Host "Folder structure created successfully!"