const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const receipt = 'C:/Users/Aayush/Documents/ChatGPT/Palateo/work/dietary-audit/antigravity-launch.json';
if (fs.existsSync(receipt)) process.exit(0);
const command = 'call "C:/Users/Aayush/.gemini/antigravity/bin/agentapi.bat" new-conversation "--title=Palateo other-city pure-veg audit" "Read and carry out C:/Users/Aayush/Documents/ChatGPT/Palateo/work/dietary-audit/antigravity-task.md. Save the requested evidence file and report your verified counts."';
const output = execFileSync('cmd.exe', ['/d', '/s', '/c', command], { encoding: 'utf8', windowsHide: true, windowsVerbatimArguments: true });
const result = JSON.parse(output);
if (result.error) throw new Error(result.error);
fs.writeFileSync(receipt, JSON.stringify(result, null, 2) + '\n');
