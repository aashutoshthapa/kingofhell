// Suggested improvements for your Google Apps Script

// 1. Move API token to script properties for security
const API_TOKEN = PropertiesService.getScriptProperties().getProperty('COC_API_TOKEN') || 
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImExMjZkOGY5LWVkMmQtNDI3MC1hYzdlLTExOTJmNzFhZmIzYSIsImlhdCI6MTc0ODYwMTM3Nywic3ViIjoiZGV2ZWxvcGVyL2QyMzllMDZkLTk0MWMtOTg1Yi0wZjQ0LWY5NWRlYzFlNmU3MSIsInNjb3BlcyI6WyJjbGFzaCJdLCJsaW1pdHMiOlt7InRpZXIiOiJkZXZlbG9wZXIvc2lsdmVyIiwidHlwZSI6InRocm90dGxpbmcifSx7ImNpZHJzIjpbIjQ1Ljc5LjIxOC43OSJdLCJ0eXBlIjoiY2xpZW50In1dfQ.0QdpeO2FxzYHiS9dunJuIAXr7ulhu00r4H6gOPlg1vl4nH2T2CxyEV604e7Uc0035bmH1_-dbg-cAqfCO8sj8A';

// 2. Fix column reference in updateCapitalLoot
function updateCapitalLoot() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const startRow = 3;
  const tagCol = 2;     // Column B
  const lootCol = 17;   // Column Q (fixed from 6 to 17)
  
  // ... rest of function
}

// 3. Enhanced error handling for updateWarPerformance
function updateWarPerformance() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const startRow = 3;
  const tagCol = 2;         // B
  const mapPosCol = 19;     // S
  const perfectWarCol = 7;  // G
  const noMissCol = 8;      // H
  const perfectMonthCol = 9; // I

  const apiUrl = "https://cocproxy.royaleapi.dev/v1/clans/%23YV8LJYGL/currentwar";
  const headers = {
    "Authorization": "Bearer " + API_TOKEN
  };

  try {
    const response = UrlFetchApp.fetch(apiUrl, { method: "get", headers });
    if (!response.getContentText()) {
      Logger.log("Empty response from war API");
      return;
    }
    
    const data = JSON.parse(response.getContentText());
    const members = (data.clan && data.clan.members) || [];
    const memberMap = {};
    members.forEach(m => memberMap[m.tag] = m);

    // ... rest of your existing logic
  } catch (err) {
    Logger.log("Error in updateWarPerformance: " + err);
  }
}

// 4. Add data validation helper
function validatePlayerTag(tag) {
  return tag && tag.startsWith('#') && tag.length > 1;
} 