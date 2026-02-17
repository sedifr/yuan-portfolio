function getGitHubConfig() {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';

  if (!token || !owner || !repo) {
    throw new Error('GitHub configuration missing');
  }

  return { token, owner, repo, branch };
}

function sanitizeSegment(input) {
  return String(input || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function sanitizeFolder(folder) {
  const normalized = String(folder || 'assets/images/uploads').replace(/\\/g, '/');
  const cleaned = normalized
    .split('/')
    .filter(Boolean)
    .map(sanitizeSegment)
    .filter(Boolean)
    .join('/');

  if (!cleaned.startsWith('assets/images/')) {
    return 'assets/images/uploads';
  }

  return cleaned;
}

function parseDataUrl(dataUrl) {
  const match = String(dataUrl || '').match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=\n\r]+)$/);
  if (!match) {
    return null;
  }

  return {
    mimeType: match[1].toLowerCase(),
    base64: match[2].replace(/[\n\r]/g, '')
  };
}

function extensionFromMime(mimeType) {
  const map = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif'
  };

  return map[mimeType] || 'jpg';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password, folder, fileName, dataUrl } = req.body || {};
  if (password !== 'yuan2026') {
    return res.status(401).json({ error: 'Invalid password' });
  }

  const parsed = parseDataUrl(dataUrl);
  if (!parsed) {
    return res.status(400).json({ error: 'Invalid image data format' });
  }

  const { mimeType, base64 } = parsed;
  const imageSizeBytes = Buffer.byteLength(base64, 'base64');
  if (imageSizeBytes > 8 * 1024 * 1024) {
    return res.status(413).json({ error: 'Image too large. Please keep single image under 8MB' });
  }

  const ext = extensionFromMime(mimeType);
  const safeFolder = sanitizeFolder(folder);
  const baseName = sanitizeSegment(String(fileName || '').replace(/\.[^.]+$/, '')) || 'image';
  const finalName = `${Date.now()}-${baseName}.${ext}`;
  const filePath = `${safeFolder}/${finalName}`;

  try {
    const { token, owner, repo, branch } = getGitHubConfig();
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

    const updateResponse = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'Portfolio-Admin'
      },
      body: JSON.stringify({
        message: `Upload image ${finalName} via admin panel`,
        content: base64,
        branch
      })
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      return res.status(500).json({
        error: errorData.message || 'Failed to upload image to GitHub'
      });
    }

    const result = await updateResponse.json();
    return res.status(200).json({
      success: true,
      path: `./${filePath}`,
      commit: result.commit.sha
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message || 'Internal server error'
    });
  }
}
