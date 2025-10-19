# Test script for artwork deletion API
# This script tests the improved artwork deletion functionality

$baseUrl = "http://localhost:8081"
$token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiYXJ0aXN0IiwidXNlcklkIjoxMSwiZXhwIjoxNzYyNDQxNDQwfQ.KCOZFTALgDC8YkmjgOh5mJF0GzEUYHDL03Z2kgWGkts"

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Write-Host "Testing Artwork Deletion API..." -ForegroundColor Yellow

# Test 1: Try to delete artwork that doesn't exist
Write-Host "`n1. Testing deletion of non-existent artwork (ID: 999)..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/artworks/999" -Method DELETE -Headers $headers
    Write-Host "Response: $response" -ForegroundColor Green
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    $errorMessage = $_.Exception.Response.StatusDescription
    Write-Host "Status Code: $statusCode" -ForegroundColor Red
    Write-Host "Error: $errorMessage" -ForegroundColor Red
}

# Test 2: Try to delete artwork that exists but is in orders (ID: 27)
Write-Host "`n2. Testing deletion of artwork in orders (ID: 27)..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/artworks/27" -Method DELETE -Headers $headers
    Write-Host "Response: $response" -ForegroundColor Green
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    $responseBody = $_.ErrorDetails.Message
    Write-Host "Status Code: $statusCode" -ForegroundColor Red
    Write-Host "Error Response: $responseBody" -ForegroundColor Red
}

# Test 3: Get list of artworks to find one that can be deleted
Write-Host "`n3. Getting list of artworks..." -ForegroundColor Cyan
try {
    $artworks = Invoke-RestMethod -Uri "$baseUrl/api/artworks" -Method GET -Headers $headers
    Write-Host "Found $($artworks.Count) artworks" -ForegroundColor Green
    
    # Display first few artworks
    $artworks | Select-Object -First 5 | ForEach-Object {
        Write-Host "  - ID: $($_.artworkId), Title: $($_.title)" -ForegroundColor White
    }
} catch {
    Write-Host "Failed to get artworks: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nTest completed!" -ForegroundColor Yellow
