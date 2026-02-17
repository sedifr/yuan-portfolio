// Vercel Serverless Function - 保存数据到 GitHub
export default async function handler(req, res) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, data, password } = req.body;

  // 验证密码
  if (password !== 'yuan2026') {
    return res.status(401).json({ error: 'Invalid password' });
  }

  // 验证数据类型
  if (!['videos', 'apps'].includes(type)) {
    return res.status(400).json({ error: 'Invalid data type' });
  }

  try {
    // GitHub 配置 (从环境变量读取)
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_OWNER = process.env.GITHUB_OWNER;
    const GITHUB_REPO = process.env.GITHUB_REPO;
    const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

    if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
      return res.status(500).json({
        error: 'GitHub configuration missing',
        details: 'Please set GITHUB_TOKEN, GITHUB_OWNER, and GITHUB_REPO in Vercel environment variables'
      });
    }

    const filePath = `data/${type}.json`;
    const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`;

    // 1. 获取文件当前的 SHA (用于更新文件)
    const getResponse = await fetch(apiUrl, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Portfolio-Admin'
      }
    });

    let sha = null;
    if (getResponse.ok) {
      const fileData = await getResponse.json();
      sha = fileData.sha;
    }

    // 2. 更新文件到 GitHub
    const content = JSON.stringify(data, null, 2);
    const encodedContent = Buffer.from(content).toString('base64');

    const updateResponse = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'Portfolio-Admin'
      },
      body: JSON.stringify({
        message: `Update ${type} data via admin panel`,
        content: encodedContent,
        branch: GITHUB_BRANCH,
        ...(sha && { sha }) // 如果文件存在,需要提供 SHA
      })
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      console.error('GitHub API Error:', errorData);
      return res.status(500).json({
        error: 'Failed to update GitHub',
        details: errorData.message
      });
    }

    const result = await updateResponse.json();

    // 3. 返回成功响应
    return res.status(200).json({
      success: true,
      message: `${type} data saved successfully`,
      commit: result.commit.sha
    });

  } catch (error) {
    console.error('Error saving data:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
}
