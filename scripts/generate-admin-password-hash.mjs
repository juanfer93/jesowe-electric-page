import { randomBytes, scryptSync } from "node:crypto";
import { stdin, stdout } from "node:process";

if (!stdin.isTTY || typeof stdin.setRawMode !== "function") {
  console.error("Run this script in an interactive terminal so the password stays hidden.");
  process.exit(1);
}

stdin.setEncoding("utf8");
stdin.setRawMode(true);
stdout.write("Admin password (input hidden): ");

let password = "";
let finished = false;

stdin.on("data", (chunk) => {
  if (finished) return;
  for (const character of chunk) {
    if (character === "\u0003") {
      finished = true;
      password = "";
      stdin.setRawMode(false);
      stdout.write("\nCancelled.\n");
      process.exit(1);
    }
    if (character === "\r" || character === "\n") {
      if (password.length < 16) {
        password = "";
        stdout.write("\nUse at least 16 characters. Admin password (input hidden): ");
        continue;
      }
      finished = true;
      stdin.setRawMode(false);
      stdin.pause();
      const salt = randomBytes(16).toString("hex");
      const hash = scryptSync(password, salt, 64).toString("hex");
      password = "";
      stdout.write(`\nADMIN_PASSWORD_HASH=scrypt:${salt}:${hash}\n`);
      return;
    }
    if (character === "\u007f" || character === "\b") {
      password = password.slice(0, -1);
    } else {
      password += character;
    }
  }
});
