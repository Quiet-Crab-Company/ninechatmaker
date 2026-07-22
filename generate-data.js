import fs from 'fs';
import path from 'path';

const pachimonDir = 'c:/Users/natha/Desktop/vsprojects/pachimon';
const csvPath = path.join(pachimonDir, 'public/data/characters.csv');
const publicAssetsDir = 'public/assets';

// Ensure public/assets directory exists
if (!fs.existsSync(publicAssetsDir)) {
  fs.mkdirSync(publicAssetsDir, { recursive: true });
}

// Simple CSV parser
function parseCSV(content) {
  const lines = [];
  let currentLine = [];
  let currentVal = '';
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentVal += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentLine.push(currentVal.trim());
      currentVal = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      currentLine.push(currentVal.trim());
      if (currentLine.length > 1 || currentLine[0] !== '') {
        lines.push(currentLine);
      }
      currentLine = [];
      currentVal = '';
    } else {
      currentVal += char;
    }
  }
  if (currentLine.length > 0 || currentVal !== '') {
    currentLine.push(currentVal.trim());
    lines.push(currentLine);
  }
  return lines;
}

try {
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(csvContent);
  const headers = rows[0];

  const idIdx = headers.indexOf('id');
  const nameIdx = headers.indexOf('name');
  const nameJpIdx = headers.indexOf('name_jp');
  const nicknameIdx = headers.indexOf('nickname');
  const nicknameJpIdx = headers.indexOf('nickname_jp');
  const colorIdx = headers.indexOf('color');
  const costumeIdx = headers.indexOf('default_costume');

  const characters = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length < headers.length) continue;

    const id = row[idIdx];
    const name = row[nameIdx];
    const nameJp = row[nameJpIdx];
    const nickname = row[nicknameIdx];
    const nicknameJp = row[nicknameJpIdx];
    const color = row[colorIdx] || '#999999';
    const costume = row[costumeIdx];

    if (!id || !name) continue;

    // Define target avatar filename
    // Naming pattern matches the assets listed originally: e.g. "kuronaka yo.png", "q.png", "aoyama kazuki.png"
    const avatarName = name.toLowerCase() === 'q' ? 'q.png' : `${name.toLowerCase()}.png`;
    const targetAvatarPath = path.join(publicAssetsDir, avatarName);
    let hasAvatar = false;

    if (costume) {
      const srcAvatarPath = path.join(
        pachimonDir,
        'public/images/characters',
        id,
        costume,
        'default.png'
      );

      if (fs.existsSync(srcAvatarPath)) {
        fs.copyFileSync(srcAvatarPath, targetAvatarPath);
        hasAvatar = true;
        console.log(`Copied avatar for ${name} -> ${avatarName}`);
      } else {
        console.log(`Warning: Costume avatar not found at ${srcAvatarPath}`);
      }
    }

    // Determine initials for English and Japanese
    // English initials: e.g., Gotanda Yutaka -> GY, Q -> Q
    const nameParts = name.trim().split(/\s+/);
    const initialsEn = nameParts.map(part => part[0]).join('').toUpperCase();

    // Japanese initials: e.g. 五反田豊 -> 五 (first character of nameJp)
    let initialsJp = initialsEn;
    if (nameJp && nameJp.length > 0) {
      initialsJp = nameJp.trim()[0];
    }

    characters.push({
      id,
      name,
      nameJp: nameJp || name,
      color,
      avatar: hasAvatar ? `/assets/${avatarName}` : null,
      initialsEn,
      initialsJp
    });
  }

  // Create src/data directory if not exists
  const srcDataDir = 'src/data';
  if (!fs.existsSync(srcDataDir)) {
    fs.mkdirSync(srcDataDir, { recursive: true });
  }

  const jsContent = `// Static list of characters parsed from pachimon/public/data/characters.csv
export const characters = ${JSON.stringify(characters, null, 2)};
`;

  fs.writeFileSync(path.join(srcDataDir, 'characters.js'), jsContent, 'utf-8');
  console.log(`Successfully generated characters.js with ${characters.length} characters.`);
} catch (error) {
  console.error('Error generating character data:', error);
  process.exit(1);
}
