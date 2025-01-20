class SVGPreviewer {
  constructor() {
    this.input = document.getElementById('svg-input');
    this.preview = document.getElementById('svg-preview');
    this.downloadBtn = document.getElementById('download-btn');
    this.debounceTimer = null;
    this.init();
  }

  init() {
    // 初始化事件监听
    this.input.addEventListener('input', () => this.handleInput());
    this.downloadBtn.addEventListener('click', () => this.downloadAsPNG());
    
    // 设置初始示例SVG
    this.input.value = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="80" fill="#2563eb" />
</svg>`;
    this.renderSVG();
  }

  handleInput() {
    // 防抖处理
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.renderSVG();
    }, 300);
  }

  renderSVG() {
    try {
      const svgString = this.input.value.trim();
      if (!svgString) {
        this.preview.innerHTML = '';
        return;
      }

      // 使用DOMParser解析SVG
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgString, 'image/svg+xml');
      
      // 检查解析错误
      const parserError = doc.querySelector('parsererror');
      if (parserError) {
        throw new Error('无效的SVG代码');
      }

      // 清空并插入新的SVG
      this.preview.innerHTML = '';
      this.preview.appendChild(doc.documentElement);
    } catch (error) {
      this.showError(error.message);
    }
  }

  async downloadAsPNG() {
    try {
      if (!this.preview.firstChild) {
        throw new Error('没有可转换的SVG内容');
      }

      // 使用html2canvas转换
      const canvas = await html2canvas(this.preview, {
        useCORS: true,
        allowTaint: true,
        scale: 2 // 提高分辨率
      });

      // 创建下载链接
      const link = document.createElement('a');
      link.download = 'image.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      this.showError('PNG转换失败: ' + error.message);
    }
  }

  showError(message) {
    this.preview.innerHTML = `<div class="error">${message}</div>`;
  }
}

// 初始化应用
new SVGPreviewer();
