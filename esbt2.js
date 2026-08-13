const m = require("esbuild");
const fs = require("fs");
const src = fs.readFileSync("src/views/adminDashboard/Default/users/UsersUpsertPaper.jsx","utf8");
const idx = src.indexOf("sx={{");
let j = 0;
while (j < 40) { const k = src.indexOf("sx={{", idx+1); if (k===-1) break; }
// find the sx around email textfield
const emailSx = src.slice(src.indexOf("sx={{", 8000), src.indexOf("sx={{", 8000)+400);
console.log("---snippet---");
console.log(emailSx);
