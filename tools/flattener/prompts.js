const os = require('node:os');
const path = require('node:path');
const readline = require('node:readline');
const process = require('node:process');

function expandHome(p) {
  if (!p) return p;
  if (p.startsWith('~')) return path.join(os.homedir(), p.slice(1));
  return p;
}

function createRl() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

function promptQuestion(question) {
  return new Promise((resolve) => {
    const rl = createRl();
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function promptYesNo(question, defaultYes = true) {
  const suffix = defaultYes ? ' [Y/n] ' : ' [y/N] ';
  const ans = (await promptQuestion(`${question}${suffix}`)).trim().toLowerCase();
  if (!ans) return defaultYes;
  if (['y', 'yes'].includes(ans)) return true;
  if (['n', 'no'].includes(ans)) return false;
  return promptYesNo(question, defaultYes);
}

async function promptPath(question, defaultValue) {
  const prompt = `${question}${defaultValue ? ` (default: ${defaultValue})` : ''}: `;
  const ans = (await promptQuestion(prompt)).trim();
  return expandHome(ans || defaultValue);
}

module.exports = { promptYesNo, promptPath, promptQuestion, expandHome };
