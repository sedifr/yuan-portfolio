// ===== 管理后台逻辑 =====

// 管理员密码 (生产环境应该使用加密和后端验证)
const ADMIN_PASSWORD = 'yuan2026';  // 默认密码,部署时可以修改

// 全局变量
let currentVideoImages = []; // [{ file, previewUrl }]
let videosData = { videos: [] };
let appsData = { apps: [] };
const MAX_UPLOAD_IMAGE_MB = 8;

// ===== 登录功能 =====
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const password = document.getElementById('password').value;
  const errorMsg = document.getElementById('errorMessage');

  if (password === ADMIN_PASSWORD) {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('adminPage').style.display = 'block';
    loadAllData();
  } else {
    errorMsg.style.display = 'block';
    setTimeout(() => {
      errorMsg.style.display = 'none';
    }, 3000);
  }
});

function logout() {
  document.getElementById('loginPage').style.display = 'flex';
  document.getElementById('adminPage').style.display = 'none';
  document.getElementById('password').value = '';
}

// ===== 标签切换 =====
function switchTab(tabName) {
  // 更新标签按钮状态
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.remove('active');
  });
  event.target.classList.add('active');

  // 显示对应内容
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  document.getElementById(tabName + 'Tab').classList.add('active');
}

// ===== 图片上传功能（支持多图）=====
function setupImageUpload() {
  const uploadArea = document.getElementById('videoUploadArea');
  const fileInput = document.getElementById('videoImageInput');
  const preview = document.getElementById('videoPreview');

  // 点击上传
  uploadArea.addEventListener('click', () => {
    fileInput.click();
  });

  // 文件选择（支持多选）
  fileInput.addEventListener('change', (e) => {
    handleMultipleImages(e.target.files);
  });

  // 拖拽上传
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
  });

  uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
  });

  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    handleMultipleImages(e.dataTransfer.files);
  });
}

function handleMultipleImages(files) {
  const preview = document.getElementById('videoPreview');
  const fileInput = document.getElementById('videoImageInput');

  Array.from(files).forEach(file => {
    if (!file.type.startsWith('image/')) return;

    if (file.size > MAX_UPLOAD_IMAGE_MB * 1024 * 1024) {
      alert(`图片 ${file.name} 超过 ${MAX_UPLOAD_IMAGE_MB}MB，请压缩后再上传`);
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    currentVideoImages.push({ file, previewUrl });

    // 创建预览项
    const previewItem = document.createElement('div');
    previewItem.className = 'preview-item';
    previewItem.innerHTML = `
      <img src="${previewUrl}" alt="预览">
      <button class="preview-remove" onclick="removeImage(${currentVideoImages.length - 1})">×</button>
    `;

    preview.appendChild(previewItem);
    preview.classList.add('active');
  });

  // 允许重复选择同一个文件
  fileInput.value = '';
}

function removeImage(index) {
  const removed = currentVideoImages.splice(index, 1)[0];
  if (removed && removed.previewUrl) {
    URL.revokeObjectURL(removed.previewUrl);
  }

  const preview = document.getElementById('videoPreview');
  const items = preview.querySelectorAll('.preview-item');
  if (items[index]) {
    items[index].remove();
  }

  // 如果没有图片了，隐藏预览区
  if (currentVideoImages.length === 0) {
    preview.classList.remove('active');
  }

  // 重新编号剩余图片的删除按钮
  preview.querySelectorAll('.preview-item').forEach((item, idx) => {
    const btn = item.querySelector('.preview-remove');
    btn.setAttribute('onclick', `removeImage(${idx})`);
  });
}

function resetVideoImageState() {
  currentVideoImages.forEach(item => {
    if (item && item.previewUrl) {
      URL.revokeObjectURL(item.previewUrl);
    }
  });

  currentVideoImages = [];
  const preview = document.getElementById('videoPreview');
  preview.innerHTML = '';
  preview.classList.remove('active');
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error(`读取图片失败: ${file.name}`));
    reader.readAsDataURL(file);
  });
}

async function uploadImagesToCloud(videoId, images) {
  const uploadedPaths = [];

  for (let i = 0; i < images.length; i += 1) {
    const imageItem = images[i];
    const imageFile = imageItem.file;

    const dataUrl = await fileToDataUrl(imageFile);
    const response = await fetch('/api/upload-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password: ADMIN_PASSWORD,
        folder: `assets/images/uploads/${videoId}`,
        fileName: imageFile.name,
        dataUrl
      })
    });

    const result = await response.json();
    if (!response.ok || !result.path) {
      throw new Error(result.error || `第 ${i + 1} 张图片上传失败`);
    }

    uploadedPaths.push(result.path);
  }

  return uploadedPaths;
}

// 初始化图片上传
setupImageUpload();

// ===== 加载数据 =====
async function loadAllData() {
  await loadVideosData();
  await loadAppsData();
  renderVideosList();
  renderAppsList();
}

async function loadVideosData() {
  try {
    const response = await fetch('./data/videos.json');
    videosData = await response.json();
  } catch (error) {
    console.error('加载影像数据失败:', error);
    videosData = { videos: [] };
  }
}

async function loadAppsData() {
  try {
    const response = await fetch('./data/apps.json');
    appsData = await response.json();
  } catch (error) {
    console.error('加载应用数据失败:', error);
    appsData = { apps: [] };
  }
}

// ===== 影像作品表单提交 =====
document.getElementById('videoForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  if (currentVideoImages.length === 0) {
    alert('请至少上传 1 张封面图片');
    return;
  }

  const newVideoId = 'video-' + Date.now();

  let uploadedImagePaths = [];
  const uploadLoading = showLoading('正在上传图片到云端...');
  try {
    uploadedImagePaths = await uploadImagesToCloud(newVideoId, currentVideoImages);
  } catch (error) {
    hideLoading(uploadLoading);
    alert(`❌ 图片上传失败: ${error.message}\n\n请稍后重试，或先减少图片数量再保存。`);
    return;
  }
  hideLoading(uploadLoading);

  // 收集角色（包括自定义角色）
  const roles = [];
  document.querySelectorAll('input[name="roles"]:checked').forEach(cb => {
    roles.push(cb.value);
  });

  // 添加自定义角色
  const customRoles = formData.get('customRoles');
  if (customRoles && customRoles.trim()) {
    const customArray = customRoles.split(',').map(r => r.trim()).filter(r => r);
    roles.push(...customArray);
  }

  // 创建新作品对象（多语言支持）
  const newVideo = {
    id: newVideoId,
    title: {
      ja: formData.get('title_ja'),
      zh: formData.get('title_zh'),
      en: formData.get('title_en')
    },
    type: formData.get('type'),
    layout: formData.get('layout') || 'portrait',
    cover: uploadedImagePaths[0],
    link: formData.get('link') || '',
    roles: roles,
    delay: 2
  };

  // 添加描述（如果有）- 多语言
  const desc_ja = formData.get('description_ja');
  const desc_zh = formData.get('description_zh');
  const desc_en = formData.get('description_en');

  if ((desc_ja && desc_ja.trim()) || (desc_zh && desc_zh.trim()) || (desc_en && desc_en.trim())) {
    newVideo.description = {
      ja: desc_ja ? desc_ja.trim() : '',
      zh: desc_zh ? desc_zh.trim() : '',
      en: desc_en ? desc_en.trim() : ''
    };
  }

  // 如果上传了多张图片，添加images数组（用于图库作品）
  if (uploadedImagePaths.length > 1) {
    newVideo.images = uploadedImagePaths;
    newVideo.layout = 'image-only'; // 多图自动设为图库模式
  }

  // 添加到数据
  videosData.videos.push(newVideo);

  // 保存到云端并触发自动部署
  const saved = await saveToLocalStorage('videos', videosData);
  if (!saved) {
    return;
  }

  // 显示成功消息
  const successMsg = document.getElementById('videoSuccess');
  successMsg.style.display = 'block';
  setTimeout(() => {
    successMsg.style.display = 'none';
  }, 3000);

  // 重置表单
  e.target.reset();
  resetVideoImageState();

  // 刷新列表
  renderVideosList();
});

// ===== AI应用表单提交 =====
document.getElementById('appForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  // 处理标签
  const tagsInput = formData.get('tags');
  const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()) : [];

  // 创建新应用对象（多语言支持）
  const newApp = {
    id: 'app-' + Date.now(),
    name: {
      ja: formData.get('name_ja'),
      zh: formData.get('name_zh'),
      en: formData.get('name_en')
    },
    type: formData.get('type'),
    icon: formData.get('icon'),
    previewBg: 'preview-' + (appsData.apps.length + 1),
    link: formData.get('link') || '',
    isLive: formData.get('link') ? true : false,
    tags: tags,
    delay: appsData.apps.length * 0.1
  };

  // 添加到数据
  appsData.apps.push(newApp);

  // 保存
  const saved = await saveToLocalStorage('apps', appsData);
  if (!saved) {
    return;
  }

  // 显示成功消息
  const successMsg = document.getElementById('appSuccess');
  successMsg.style.display = 'block';
  setTimeout(() => {
    successMsg.style.display = 'none';
  }, 3000);

  // 重置表单
  e.target.reset();

  // 刷新列表
  renderAppsList();
});

// ===== 渲染作品列表 =====
function renderVideosList() {
  const list = document.getElementById('videosList');
  if (!videosData.videos || videosData.videos.length === 0) {
    list.innerHTML = '<p style="color: #64748b; text-align: center; padding: 40px;">还没有作品,快去添加吧!</p>';
    return;
  }

  list.innerHTML = videosData.videos.map((video, index) => {
    // 兼容新旧格式：如果是对象取中文，如果是字符串直接用
    const title = typeof video.title === 'object' ? video.title.zh : video.title;
    return `
    <div class="work-item">
      <img class="work-thumb" src="${video.cover}" alt="${title}">
      <div class="work-info">
        <div class="work-title">${title}</div>
        <div class="work-meta">
          ${video.type} | ${video.roles.join(', ')}
        </div>
      </div>
      <div class="work-actions">
        <button class="btn-edit" onclick="editVideo(${index})">✏️ 编辑</button>
        <button class="btn-delete" onclick="deleteVideo(${index})">🗑️ 删除</button>
      </div>
    </div>
  `;
  }).join('');
}

function renderAppsList() {
  const list = document.getElementById('appsList');
  if (!appsData.apps || appsData.apps.length === 0) {
    list.innerHTML = '<p style="color: #64748b; text-align: center; padding: 40px;">还没有应用,快去添加吧!</p>';
    return;
  }

  list.innerHTML = appsData.apps.map((app, index) => {
    // 兼容新旧格式：如果是对象取中文，如果是字符串直接用
    const name = typeof app.name === 'object' ? app.name.zh : app.name;
    return `
    <div class="work-item">
      <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 40px;">
        ${app.icon}
      </div>
      <div class="work-info">
        <div class="work-title">${name}</div>
        <div class="work-meta">
          ${app.type} | ${app.tags.join(', ')}
        </div>
      </div>
      <div class="work-actions">
        <button class="btn-edit" onclick="editApp(${index})">✏️ 编辑</button>
        <button class="btn-delete" onclick="deleteApp(${index})">🗑️ 删除</button>
      </div>
    </div>
  `;
  }).join('');
}

// ===== 删除功能 =====
async function deleteVideo(index) {
  if (confirm('确定要删除这个作品吗?')) {
    videosData.videos.splice(index, 1);
    const saved = await saveToLocalStorage('videos', videosData);
    if (!saved) {
      return;
    }
    renderVideosList();
    alert('✅ 作品已删除');
  }
}

async function deleteApp(index) {
  if (confirm('确定要删除这个应用吗?')) {
    appsData.apps.splice(index, 1);
    const saved = await saveToLocalStorage('apps', appsData);
    if (!saved) {
      return;
    }
    renderAppsList();
    alert('✅ 应用已删除');
  }
}

// ===== 编辑功能 (简化版) =====
function editVideo(index) {
  alert('编辑功能即将上线!目前请删除后重新添加。');
}

function editApp(index) {
  alert('编辑功能即将上线!目前请删除后重新添加。');
}

// ===== 保存到云端 (自动同步) =====
async function saveToLocalStorage(key, data) {
  // 显示加载提示
  const loadingMsg = showLoading('正在保存到云端...');

  try {
    // 调用 Vercel API 保存数据
    const response = await fetch('/api/save-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: key, // 'videos' 或 'apps'
        data: data,
        password: ADMIN_PASSWORD
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || '保存失败');
    }

    // 保存成功
    hideLoading(loadingMsg);
    showSuccess(`✅ 保存成功!\n\n数据已自动同步到 GitHub\nVercel 正在自动部署...\n\n预计 30-60 秒后网站将更新`);

    // 同时保存到 localStorage 作为备份
    localStorage.setItem(key, JSON.stringify(data));
    return true;

  } catch (error) {
    hideLoading(loadingMsg);

    // 如果 API 失败,降级到下载 JSON 模式
    console.error('自动保存失败:', error);

    const fallback = confirm(
      `⚠️ 自动保存失败: ${error.message}\n\n` +
      `可能原因:\n` +
      `1. GitHub 未配置 (需要设置环境变量)\n` +
      `2. 网络问题\n\n` +
      `是否下载 JSON 文件手动上传?\n` +
      `(点击"确定"下载文件)`
    );

    if (fallback) {
      downloadJSON(key, data);
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    }

    return false;
  }
}

// 显示加载提示
function showLoading(message) {
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'loading-overlay';
  loadingDiv.innerHTML = `
    <div class="loading-box">
      <div class="loading-spinner"></div>
      <p>${message}</p>
    </div>
  `;
  document.body.appendChild(loadingDiv);
  return loadingDiv;
}

// 隐藏加载提示
function hideLoading(loadingDiv) {
  if (loadingDiv && loadingDiv.parentNode) {
    loadingDiv.parentNode.removeChild(loadingDiv);
  }
}

// 显示成功提示
function showSuccess(message) {
  alert(message);
}

// ===== 下载JSON文件 =====
function downloadJSON(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// ===== 从localStorage恢复数据 =====
function restoreFromLocalStorage() {
  const savedVideos = localStorage.getItem('videos');
  const savedApps = localStorage.getItem('apps');

  if (savedVideos) {
    videosData = JSON.parse(savedVideos);
  }
  if (savedApps) {
    appsData = JSON.parse(savedApps);
  }
}

// 页面加载时恢复数据
restoreFromLocalStorage();
