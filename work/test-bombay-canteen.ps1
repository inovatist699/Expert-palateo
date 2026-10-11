$descriptor = "The Bombay Canteen progressive indian cocktails iconic".ToLower()
$regex = '\b(school|college|university|campus|institute|hostel|student\s+mess|mess\s+hall|cafeteria|canteen|dining hall)\b'
$match = [regex]::IsMatch($descriptor, $regex)
Write-Host "Is 'The Bombay Canteen' excluded? $match"
