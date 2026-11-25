const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://lfnwqbzcwticwdjowsmv.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmbndxYnpjd3RpY3dkam93c212Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzQzMzkwMiwiZXhwIjoyMTA5MDA5OTAyfQ.PWV1-blUTTsEzQjNKRAUa5AUlFttEoPcGWokk7GCAIM';
const BUCKET = 'editorial360_data';

async function main() {
  console.log('--- 1. DOWNLOADING ORIGINAL AVATAR ---');
  // First download Karez Namiq's original photo
  const avatarRes = await fetch(`${SUPABASE_URL}/storage/v1/object/authenticated/manuscripts/profiles/avatar_1794000723893_IMG_1551.jpeg`, {
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` }
  });
  console.log('Avatar download status:', avatarRes.status);
  if (avatarRes.ok) {
    const buffer = Buffer.from(await avatarRes.arrayBuffer());
    console.log('Downloaded avatar buffer length:', buffer.length, 'bytes (~' + Math.round(buffer.length/1024) + ' KB)');
    // Save to public/images/editors/karez-namiq.jpg
    fs.writeFileSync(path.join(process.cwd(), 'public/images/editors/karez-namiq.jpg'), buffer);
    // Also save with full original name just in case
    fs.writeFileSync(path.join(process.cwd(), 'public/images/editors/avatar_1794000723893_IMG_1551.jpeg'), buffer);
    console.log('Successfully saved original high-res photo to public/images/editors/karez-namiq.jpg!');
  } else {
    console.error('Failed to download avatar:', await avatarRes.text());
  }

  console.log('\n--- 2. SYNCING LOCAL JSON TO SUPABASE CLOUD STORAGE ---');
  const filesToSync = [
    'editorial-board-onboarding.json',
    'invitation-responses.json',
    'users.json'
  ];

  for (const fileName of filesToSync) {
    const filePath = path.join(process.cwd(), 'lib', 'data', fileName);
    if (!fs.existsSync(filePath)) {
      console.warn('File not found locally:', filePath);
      continue;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(content);
    console.log(`Uploading ${fileName} (${content.length} chars, records: ${Array.isArray(parsed) ? parsed.length : 'object'})...`);

    const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${fileName}`, {
      method: 'POST',
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'x-upsert': 'true'
      },
      body: content
    });

    console.log(`Status for ${fileName}:`, uploadRes.status);
    if (!uploadRes.ok) {
      console.error(`Error uploading ${fileName}:`, await uploadRes.text());
    } else {
      console.log(`Successfully synced ${fileName} to Supabase!`);
    }
  }

  console.log('\n--- 3. VERIFYING CLOUD STORAGE READ ---');
  for (const fileName of filesToSync) {
    const testRes = await fetch(`${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${fileName}`, {
      cache: 'no-store'
    });
    if (testRes.ok) {
      const data = await testRes.json();
      if (Array.isArray(data)) {
        console.log(`Verified ${fileName}: ${data.length} items`);
        const foundKarez = data.find(item => 
          (item.email && item.email.toLowerCase().includes('karez')) || 
          (item.fullName && item.fullName.toLowerCase().includes('karez')) ||
          (item.name && item.name.toLowerCase().includes('karez'))
        );
        console.log(`-> Found Karez in ${fileName}:`, !!foundKarez, foundKarez ? { id: foundKarez.id || foundKarez.applicationId, name: foundKarez.fullName || foundKarez.name, email: foundKarez.email, status: foundKarez.status } : '');
      } else {
        console.log(`Verified ${fileName} object`);
      }
    } else {
      console.warn(`Could not read public ${fileName}:`, testRes.status);
    }
  }
}

main().catch(console.error);
