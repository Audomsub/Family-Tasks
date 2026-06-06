$baseUrl = "http://localhost:8081"
$headers = @{ "Content-Type" = "application/json" }

function Log { param($msg) Write-Host "=== $msg ===" -ForegroundColor Cyan }

try {
    # 1. Register Parent
    Log "Register Parent"
    $parentReg = @{
        familyName = "SmithFamily"
        fullName = "John Smith"
        email = "john@test.com"
        password = "password123"
    }
    Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method Post -Body ($parentReg | ConvertTo-Json) -Headers $headers | Out-Host

    # 2. Login Parent
    Log "Login Parent"
    $parentLogin = @{
        email = "john@test.com"
        password = "password123"
    }
    $parentAuth = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body ($parentLogin | ConvertTo-Json) -Headers $headers
    $parentToken = $parentAuth.token
    $parentHeaders = @{ "Content-Type" = "application/json"; "Authorization" = "Bearer $parentToken" }

    # 3. Get Family (Parent) to get Invite Code
    Log "Get Family details (Parent)"
    $familyDetails = Invoke-RestMethod -Uri "$baseUrl/api/family/me" -Method Get -Headers $parentHeaders
    $familyDetails | Out-Host
    $inviteCode = $familyDetails.inviteCode

    # 4. Register Child
    Log "Register Child"
    $childReg = @{
        familyName = "ChildFamilyTemp"
        fullName = "Jimmy Smith"
        email = "jimmy@test.com"
        password = "password123"
    }
    Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method Post -Body ($childReg | ConvertTo-Json) -Headers $headers | Out-Host

    # 5. Login Child
    Log "Login Child"
    $childLogin = @{
        email = "jimmy@test.com"
        password = "password123"
    }
    $childAuth = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body ($childLogin | ConvertTo-Json) -Headers $headers
    $childToken = $childAuth.token
    $childHeaders = @{ "Content-Type" = "application/json"; "Authorization" = "Bearer $childToken" }

    # 6. Child Joins Family
    Log "Child Joins Family"
    $joinReq = @{ inviteCode = $inviteCode }
    Invoke-RestMethod -Uri "$baseUrl/api/auth/join" -Method Post -Body ($joinReq | ConvertTo-Json) -Headers $childHeaders | Out-Host

    # 7. Parent Gets Family again (to get Child ID)
    Log "Get Family details again to get Child ID"
    $familyDetails = Invoke-RestMethod -Uri "$baseUrl/api/family/me" -Method Get -Headers $parentHeaders
    $childId = ($familyDetails.member | Where-Object { $_.role -eq "CHILD" }).id
    Write-Host "Child ID is $childId"

    # 8. Parent creates Task
    Log "Parent Creates Task"
    $taskReq = @{
        title = "Clean the garage"
        description = "Sweep the floor and organize boxes"
        points = 50
        dueDate = "2026-12-31"
        assignee_Id = $childId
    }
    Invoke-RestMethod -Uri "$baseUrl/api/task" -Method Post -Body ($taskReq | ConvertTo-Json) -Headers $parentHeaders | Out-Host

    # 9. Get all Tasks
    Log "Get all Tasks"
    $tasks = Invoke-RestMethod -Uri "$baseUrl/api/task" -Method Get -Headers $parentHeaders
    $tasks | Out-Host
    $taskId = $tasks[0].id

    # 10. Child Submits Task
    Log "Child Submits Task"
    Invoke-RestMethod -Uri "$baseUrl/api/task/$taskId/submit" -Method Patch -Headers $childHeaders | Out-Host

    # 11. Parent Approves Task
    Log "Parent Approves Task"
    Invoke-RestMethod -Uri "$baseUrl/api/task/$taskId/approve" -Method Patch -Headers $parentHeaders | Out-Host

    # 12. Add Grocery
    Log "Add Grocery"
    $groceryReq = @{ name = "Milk" }
    Invoke-RestMethod -Uri "$baseUrl/api/groceries" -Method Post -Body ($groceryReq | ConvertTo-Json) -Headers $parentHeaders | Out-Host
    $groceries = Invoke-RestMethod -Uri "$baseUrl/api/groceries" -Method Get -Headers $parentHeaders
    $groceries | Out-Host
    $groceryId = $groceries[0].id

    # 13. Toggle Grocery
    Log "Toggle Grocery"
    Invoke-RestMethod -Uri "$baseUrl/api/groceries/$groceryId/toggle" -Method Patch -Headers $parentHeaders | Out-Host

    # 14. Add Reward
    Log "Add Reward"
    $rewardReq = @{
        name = "Ice Cream"
        description = "A big bowl of ice cream"
        pointsRequired = 20
    }
    Invoke-RestMethod -Uri "$baseUrl/api/rewards" -Method Post -Body ($rewardReq | ConvertTo-Json) -Headers $parentHeaders | Out-Host
    $rewards = Invoke-RestMethod -Uri "$baseUrl/api/rewards" -Method Get -Headers $parentHeaders
    $rewards | Out-Host
    $rewardId = $rewards[0].id

    # 15. Child Redeems Reward
    Log "Child Redeems Reward"
    Invoke-RestMethod -Uri "$baseUrl/api/rewards/$rewardId/redeem" -Method Post -Headers $childHeaders | Out-Host

    # 16. Dashboard
    Log "Dashboard Summary (Parent)"
    Invoke-RestMethod -Uri "$baseUrl/api/dashboard/summary" -Method Get -Headers $parentHeaders | Out-Host

    # 17. Leaderboard
    Log "Leaderboard (Parent)"
    Invoke-RestMethod -Uri "$baseUrl/api/leaderboard" -Method Get -Headers $parentHeaders | Out-Host

    Log "ALL TESTS FINISHED SUCCESSFULLY!"
} catch {
    Write-Host "ERROR:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    if ($_.ErrorDetails) {
        Write-Host $_.ErrorDetails.Message -ForegroundColor Yellow
    }
}
