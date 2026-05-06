# Script to generate sitemap.xml automatically from HTML files
# Author: Auto-generated
# Purpose: Keep sitemap updated with actual file modification dates

param(
    [string]$Domain = "https://agungperkasaborepile.com",
    [string]$OutputFile = "sitemap.xml"
)

# Files to exclude from sitemap
$ExcludedFiles = @(
    "head-snippet.html",
    "index.html"  # Will be added as homepage (/)
)

# Priority and change frequency mapping
$PriorityMap = @{
    "index.html" = @{priority = "1.0"; changefreq = "weekly"}
    "artikel.html" = @{priority = "0.9"; changefreq = "weekly"}
    "bore-pile.html" = @{priority = "0.9"; changefreq = "weekly"}
    "jasa-bore-pile.html" = @{priority = "0.9"; changefreq = "weekly"}
    "harga-bore-pile-2026.html" = @{priority = "0.9"; changefreq = "weekly"}
    "proses-borepile.html" = @{priority = "0.9"; changefreq = "monthly"}
}

# Get all HTML files
$HtmlFiles = @(Get-ChildItem -Name "*.html" | Where-Object { $_ -notin $ExcludedFiles })

# Build XML
$XmlHeader = '<?xml version="1.0" encoding="UTF-8"?>'
$XmlStart = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
$XmlEnd = '</urlset>'

$UrlEntries = @()

# Add homepage first
$IndexFile = Get-Item "index.html"
$LastMod = $IndexFile.LastWriteTime.ToString("yyyy-MM-dd")
$UrlEntries += @"
    <url>
        <loc>$Domain/</loc>
        <lastmod>$LastMod</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
"@

# Add other pages
$HtmlFiles | Sort-Object | ForEach-Object {
    $File = $_
    $FileItem = Get-Item $File
    $LastMod = $FileItem.LastWriteTime.ToString("yyyy-MM-dd")
    
    # Get priority and changefreq from map or use defaults
    $Priority = if ($PriorityMap[$File]) { $PriorityMap[$File].priority } else { "0.8" }
    $ChangeFreq = if ($PriorityMap[$File]) { $PriorityMap[$File].changefreq } else { "monthly" }
    
    $Url = "$Domain/$File"
    
    $UrlEntries += @"
    <url>
        <loc>$Url</loc>
        <lastmod>$LastMod</lastmod>
        <changefreq>$ChangeFreq</changefreq>
        <priority>$Priority</priority>
    </url>
"@
}

# Combine all parts
$SitemapContent = @(
    $XmlHeader
    $XmlStart
    $UrlEntries
    $XmlEnd
) -join "`n"

# Write to file
$SitemapContent | Set-Content -Path $OutputFile -Encoding UTF8

Write-Host "[OK] Sitemap generated: $OutputFile"
Write-Host "[OK] Total URLs: $($UrlEntries.Count)"
Write-Host "[OK] Domain: $Domain"
