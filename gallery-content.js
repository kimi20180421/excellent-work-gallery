(() => {
  const CONTENT_STORAGE_KEY = 'pixel100-gallery-content-v1';
  const BUILTIN_SEED_KEY = 'pixel100-gallery-builtins-v1-seeded';
  const builtinContent = [
    { id: 'builtin-01', channel: 'works', title: '视觉语言形状分析', author: '黎浩民', mediaType: 'image', source: 'assets/li-haomin-01.webp' },
    { id: 'builtin-02', channel: 'works', title: '视觉语言质感分析', author: '黎浩民', mediaType: 'image', source: 'assets/li-haomin-02.webp' },
    { id: 'builtin-03', channel: 'works', title: '根据用户选择路径重构页面结构', author: '陈静芸', mediaType: 'image', source: 'assets/chen-jingyun-01.webp' },
    { id: 'builtin-04', channel: 'works', title: '围绕交易链路开展半结构式访谈', author: '卢若溪', mediaType: 'image', source: 'assets/lu-ruoxi-01.webp' },
    { id: 'builtin-05', channel: 'works', title: '生活服务图标设计', author: '安炳均', mediaType: 'image', source: 'assets/an-bingjun-01.webp' },
    { id: 'builtin-06', channel: 'works', title: 'IP卡牌主视觉设计', author: '赵一仪', mediaType: 'image', source: 'assets/zhao-yiyi-01.webp' },
    { id: 'builtin-07', channel: 'works', title: '影视内容筛选体验优化', author: '马冰蕊', mediaType: 'image', source: 'assets/ma-bingrui-01.webp' },
    { id: 'builtin-08', channel: 'works', title: '美团拼好饭首页体验优化', author: '李祎珺', mediaType: 'image', source: 'assets/li-yijun-01.webp' },
    { id: 'builtin-09', channel: 'works', title: '微博暑假主题活动视觉设计', author: '马冰蕊', mediaType: 'image', source: 'assets/ma-bingrui-02.webp' },
    { id: 'builtin-10', channel: 'works', title: '模块化设计', author: '马冰蕊', mediaType: 'image', source: 'assets/mbr.png' },
    { id: 'builtin-11', channel: 'works', title: 'QQ招兽闹新春主页面展示', author: '陈静芸', mediaType: 'image', source: 'assets/CHENJINGYUN.png' },
    { id: 'builtin-12', channel: 'works', title: 'QQ招兽闹新春分享海报', author: '陈静芸', mediaType: 'image', source: 'assets/chen.png' }
  ];

  function ensureBuiltins() {
    if (localStorage.getItem(BUILTIN_SEED_KEY) === 'true') return;

    let content;
    try {
      content = JSON.parse(localStorage.getItem(CONTENT_STORAGE_KEY) || '[]');
    } catch {
      content = [];
    }
    if (!Array.isArray(content)) content = [];

    const existingIds = new Set(content.map(entry => entry?.id));
    builtinContent.forEach(entry => {
      if (!existingIds.has(entry.id)) content.push({ ...entry });
    });
    localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(content));
    localStorage.setItem(BUILTIN_SEED_KEY, 'true');
  }

  window.GalleryContent = {
    ensureBuiltins
  };
})();
