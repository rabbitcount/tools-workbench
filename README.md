# Markdown 编辑器工具集

一个基于浏览器的 Markdown 编辑器工具集，支持文件管理、实时预览、历史记录等功能。

## 功能特性

### 1. 界面布局
- 左侧窄导航栏（5% 宽度），支持多标签页切换
- 主编辑区域分为左右两部分：
  - 左侧历史记录面板（固定宽度 250px）
  - 右侧 Markdown 编辑器（自适应宽度）

### 2. Markdown 编辑器
- 基于 SimpleMDE 实现
- 支持常用 Markdown 语法工具栏
- 实时预览功能
- 分屏预览模式
- 全屏编辑模式
- 代码语法高亮

### 3. 文件操作
- 打开本地 Markdown 文件
- 保存当前文件
- 另存为新文件
- 文件修改提示
- 保存成功提示

### 4. 历史记录管理
- 显示最近打开的文件列表（最多10条）
- 每条记录显示：
  - 文件标题
  - 内容预览（前30字符）
  - 删除按钮
- 点击记录可直接打开文件
- 历史记录持久化存储

## 项目结构

```
.
├── index.html          # 主页面
├── styles.css          # 全局样式
├── main.js            # 主要脚本（标签页切换等）
└── md-editor/         # Markdown 编辑器相关文件
    └── editor.js      # 编辑器核心功能
```

### 核心文件说明

1. `index.html`
   - 页面整体结构
   - 外部依赖引入
   - DOM 结构定义

2. `styles.css`
   - 全局样式重置
   - 布局样式
   - 组件样式
   - SimpleMDE 编辑器样式覆盖

3. `main.js`
   - 标签页切换逻辑
   - 全局事件处理

4. `md-editor/editor.js`
   - MDEditor 类定义
   - 编辑器初始化
   - 文件操作处理
   - 历史记录管理

## 技术栈

- 原生 HTML5/CSS3/JavaScript
- SimpleMDE Markdown 编辑器
- Font Awesome 图标
- File System Access API（文件操作）
- LocalStorage（历史记录存储）

## 扩展方式

### 1. 添加新的标签页
1. 在 `index.html` 中的 `sidebar` 部分添加新的标签：

```html
<div class="tab-item" data-tab="new-tab-id">
    <div>新标签</div>
    <div>说明</div>
</div>
```

2. 在主内容区域添加对应的内容容器：

```html
<div id="new-tab-id" class="tab-content">
    <!-- 新标签页的内容 -->
</div>
```

### 2. 自定义编辑器功能
在 `md-editor/editor.js` 中：
1. 修改 `init()` 方法中的 SimpleMDE 配置
2. 扩展 `MDEditor` 类添加新方法
3. 在 `bindEvents()` 中添加新的事件监听

### 3. 修改样式
1. 全局样式：修改 `styles.css`
2. 编辑器样式：在 `styles.css` 中的 `/* SimpleMDE 样式覆盖 */` 部分添加自定义样式

### 4. 添加新功能
1. 创建新的功能模块：在 `md-editor` 目录下创建新的 JS 文件
2. 在 `index.html` 中引入新模块
3. 在 `MDEditor` 类中集成新功能

## 注意事项

1. 文件命名限制
   - 保存的文件名不允许使用中文
   - 仅支持 .md 文件格式

2. 浏览器兼容性
   - 需要使用支持 File System Access API 的现代浏览器
   - 推荐使用最新版本的 Chrome 浏览器

3. 本地存储
   - 历史记录使用 LocalStorage 存储
   - 清除浏览器数据会导致历史记录丢失

## 后续优化方向

1. 添加文件标签功能
2. 支持更多主题样式
3. 添加导出为 PDF/HTML 功能
4. 添加图片上传功能
5. 支持自动保存
6. 添加快捷键支持 