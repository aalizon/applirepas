// Prépare le dossier deploy/ à envoyer sur l'hébergement après `next build`.
//
// deploy/
//   app.js          ← fichier de démarrage (Passenger / cPanel « Setup Node.js App »)
//   package.json    ← minimal, sans dépendance
//   app/            ← build autonome Next.js (server.js, node_modules, .next, public, drizzle)
//
// Le build est placé dans app/ car le sélecteur Node.js de CloudLinux (o2switch) interdit
// un dossier node_modules à la racine de l'application.
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, "deploy");
const app = path.join(out, "app");
const cp = (from, to) => fs.cpSync(path.join(root, from), path.join(app, to), { recursive: true });

fs.rmSync(out, { recursive: true, force: true });
cp(".next/standalone", ".");
cp(".next/static", ".next/static");
cp("public", "public");
cp("drizzle", "drizzle");
// Jamais de base de données ni de secrets dans le paquet
fs.rmSync(path.join(app, "data"), { recursive: true, force: true });
for (const f of fs.readdirSync(app)) if (f.startsWith(".env")) fs.rmSync(path.join(app, f));

fs.writeFileSync(
  path.join(out, "app.js"),
  `// Fichier de démarrage AppliRepas (o2switch / Passenger)
process.env.NODE_ENV = "production";
process.chdir(require("path").join(__dirname, "app"));
require("./app/server.js");
`,
);
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
fs.writeFileSync(
  path.join(out, "package.json"),
  JSON.stringify({ name: pkg.name, version: pkg.version, private: true, main: "app.js", scripts: { start: "node app.js" }, engines: pkg.engines }, null, 2) + "\n",
);
console.log("Paquet prêt dans deploy/ — fichier de démarrage : app.js");
