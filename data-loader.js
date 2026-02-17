// ===== 数据加载器 =====
// 自动从JSON文件读取作品数据并生成卡片

// 获取当前语言设置
function getCurrentLanguage() {
  // 尝试从全局变量获取
  if (typeof getCurrentLang === 'function') {
    return getCurrentLang();
  }
  // 如果没有全局函数，从localStorage读取
  return localStorage.getItem('language') || 'ja';
}

// 获取多语言文本（兼容新旧格式）
function getText(textObj, fallback = '') {
  if (!textObj) return fallback;
  // 如果是字符串，直接返回（旧格式兼容）
  if (typeof textObj === 'string') return textObj;
  // 如果是对象，根据当前语言返回
  const lang = getCurrentLanguage();
  return textObj[lang] || textObj.zh || textObj.en || textObj.ja || fallback;
}

// 角色翻译映射
const roleTranslations = {
  'director': { ja: '監督', zh: '导演', en: 'Director' },
  'script': { ja: '脚本', zh: '编剧', en: 'Screenwriter' },
  'cinematography': { ja: '撮影', zh: '摄影', en: 'Cinematography' },
  'editing': { ja: '編集', zh: '剪辑', en: 'Editing' },
  'color': { ja: 'カラー', zh: '调色', en: 'Color Grading' }
};

// 作品类型翻译映射
const typeTranslations = {
  'shortfilm': { ja: 'Short Film', zh: '微电影', en: 'Short Film' },
  'documentary': { ja: 'Documentary', zh: '纪录片', en: 'Documentary' },
  'shortdrama': { ja: 'Short Drama', zh: '短剧', en: 'Short Drama' },
  'gallery': { ja: 'Photo', zh: '摄影', en: 'Photography' }
};

// 生成影像作品卡片HTML
function generateVideoCard(video) {
  const isGallery = video.layout === 'image-only';
  const hasLink = video.link && !isGallery;
  const title = getText(video.title, 'Untitled');

  let cardHTML = `<div class="video-card ${video.layout} animate-in delay-${video.delay}"`;

  if (isGallery && video.images) {
    cardHTML += ` data-lightbox="true" data-images='${JSON.stringify(video.images)}' data-title="${title}"`;
  } else if (hasLink) {
    cardHTML += ` onclick="window.open('${video.link}','_blank')"`;
  }

  cardHTML += `>
    <div class="video-thumb-wrap">
      <img class="video-thumb" src="${video.cover}" alt="${title}"`;

  if (video.fallbackCover) {
    cardHTML += ` onerror="this.src='${video.fallbackCover}';"`;
  }

  cardHTML += `>`;

  // 添加图库圆点
  if (isGallery && video.images) {
    cardHTML += `<div class="gallery-dots">`;
    for (let i = 0; i < video.images.length; i++) {
      cardHTML += `<span class="gallery-dot${i === 0 ? ' active' : ''}"></span>`;
    }
    cardHTML += `</div>`;
  }

  // 添加播放按钮或展开按钮
  if (hasLink) {
    cardHTML += `
      <div class="play-btn">
        <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      </div>`;
  } else if (isGallery) {
    cardHTML += `
      <div class="expand-btn">
        <svg viewBox="0 0 24 24"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l-7-7"/></svg>
      </div>`;
  }

  cardHTML += `</div>
    <div class="video-info">
      <div class="video-info-left">
        <div class="video-tag" data-i18n="video.type.${video.type}">${typeTranslations[video.type]?.ja || video.type}</div>
        <div class="video-title">${title}</div>
      </div>
      <div class="video-roles">`;

  // 添加角色标签
  if (video.roles && video.roles.length > 0) {
    video.roles.forEach(role => {
      const roleText = roleTranslations[role]?.ja || role;
      cardHTML += `<span class="role-pill" data-i18n="role.${role}">${roleText}</span>`;
    });
  }

  cardHTML += `</div></div></div>`;

  return cardHTML;
}

// 生成AI应用卡片HTML
function generateAppCard(app) {
  const hasLink = app.link;
  const name = getText(app.name, 'Untitled App');
  let cardHTML = `<div class="app-card reveal${hasLink ? ' app-card-clickable' : ''}" style="transition-delay:${app.delay}s"`;

  if (hasLink) {
    cardHTML += ` onclick="window.open('${app.link}', '_blank')"`;
  }

  cardHTML += `>
    <div class="app-preview">
      <div class="app-preview-bg ${app.previewBg}"></div>
      <div class="app-icon">${app.icon}</div>`;

  // 添加Live Demo或GitHub徽章
  if (app.isLive) {
    cardHTML += `
      <div class="app-live-badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
        </svg>
        Live Demo
      </div>`;
  } else if (app.badgeType === 'github') {
    cardHTML += `
      <div class="app-live-badge" style="background: rgba(139, 92, 246, 0.95); box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
        </svg>
        GitHub
      </div>`;
  }

  cardHTML += `
    </div>
    <div class="app-body">
      <div class="app-type" data-i18n="app.${app.id}.type">${app.type === 'webapp' ? 'AI ウェブアプリ' : app.type === 'suite' ? '映像制作スイート' : app.type === 'native' ? 'macOS ネイティブアプリ' : 'Claude Code スキル'}</div>
      <div class="app-name">${name}</div>
      <div class="app-desc" data-i18n="app.${app.id}.desc"></div>
      <div class="app-tags">`;

  // 添加标签
  if (app.tags && app.tags.length > 0) {
    app.tags.forEach(tag => {
      cardHTML += `<span class="app-tag">${tag}</span>`;
    });
  }

  cardHTML += `</div></div></div>`;

  return cardHTML;
}

// 加载并渲染影像作品
async function loadVideos() {
  try {
    const response = await fetch('./data/videos.json');
    const data = await response.json();
    const videoGrid = document.querySelector('.video-grid');

    if (videoGrid && data.videos) {
      videoGrid.innerHTML = data.videos.map(video => generateVideoCard(video)).join('');

      // 重新初始化图库功能
      initializeGalleries();
    }
  } catch (error) {
    console.error('加载影像作品失败:', error);
  }
}

// 加载并渲染AI应用
async function loadApps() {
  try {
    console.log('📱 开始加载 AI 应用数据...');
    const response = await fetch('./data/apps.json');
    console.log('📱 apps.json 响应状态:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('📱 成功解析 apps.json:', data);
    console.log('📱 应用数量:', data.apps ? data.apps.length : 0);

    const appsGrid = document.querySelector('.apps-grid');
    console.log('📱 找到 apps-grid 元素:', appsGrid);

    if (!appsGrid) {
      console.error('❌ 错误:未找到 .apps-grid 元素!');
      return;
    }

    if (!data.apps || data.apps.length === 0) {
      console.warn('⚠️ 警告:apps.json 中没有应用数据');
      return;
    }

    const cardsHTML = data.apps.map(app => generateAppCard(app)).join('');
    console.log('📱 生成的 HTML 长度:', cardsHTML.length);
    appsGrid.innerHTML = cardsHTML;
    console.log('✅ AI 应用加载完成!共 ' + data.apps.length + ' 个应用');

    // 触发 reveal 动画:让新添加的应用卡片显示出来
    setTimeout(() => {
      const appCards = document.querySelectorAll('.app-card.reveal');
      appCards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('visible');
        }, index * 100); // 每个卡片延迟 100ms,产生依次出现的效果
      });
      console.log('✅ 已触发应用卡片显示动画');
    }, 100);

  } catch (error) {
    console.error('❌ 加载AI应用失败:', error);
    console.error('错误类型:', error.name);
    console.error('错误信息:', error.message);
    console.error('完整错误:', error);
  }
}

// 初始化图库功能
function initializeGalleries() {
  const galleryCards = document.querySelectorAll('[data-lightbox="true"]');

  galleryCards.forEach(card => {
    const thumbWrap = card.querySelector('.video-thumb-wrap');
    const thumb = card.querySelector('.video-thumb');
    const dots = card.querySelectorAll('.gallery-dot');
    const images = JSON.parse(card.getAttribute('data-images'));
    let currentIndex = 0;
    let autoSlideInterval;

    // 自动轮播
    function startAutoSlide() {
      autoSlideInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        updateGallery();
      }, 3000);
    }

    function stopAutoSlide() {
      if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
      }
    }

    function updateGallery() {
      thumb.src = images[currentIndex];
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    // 点击圆点切换
    dots.forEach((dot, index) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = index;
        updateGallery();
        stopAutoSlide();
        startAutoSlide();
      });
    });

    // 鼠标悬停暂停
    thumbWrap.addEventListener('mouseenter', stopAutoSlide);
    thumbWrap.addEventListener('mouseleave', startAutoSlide);

    // 启动自动轮播
    startAutoSlide();

    // 点击卡片打开lightbox
    card.addEventListener('click', () => {
      const title = card.getAttribute('data-title');
      if (typeof openLightbox === 'function') {
        openLightbox(images, title, currentIndex);
      }
    });
  });
}

// 页面加载完成后自动加载数据
document.addEventListener('DOMContentLoaded', () => {
  loadVideos();
  loadApps();
});
