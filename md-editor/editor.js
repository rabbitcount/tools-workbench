class MDEditor {
    constructor() {
        this.editor = null;
        this.currentFile = null;
        this.history = [];
        this.isEdited = false;
        this.init();
    }

    init() {
        // 初始化编辑器
        this.editor = new SimpleMDE({
            element: document.getElementById('editor'),
            spellChecker: false,
            autofocus: true,
            status: false,
            toolbar: [
                'bold', 'italic', 'strikethrough', '|',
                'heading-1', 'heading-2', 'heading-3', '|',
                'quote', 'unordered-list', 'ordered-list', '|',
                'link', 'image', 'table', '|',
                'preview', 'side-by-side', 'fullscreen', '|',
                'guide'
            ],
            placeholder: '开始编写...',
            renderingConfig: {
                singleLineBreaks: false,
                codeSyntaxHighlighting: true,
            }
        });

        // 加载历史记录
        this.loadHistory();
        
        // 绑定事件
        this.bindEvents();
    }

    bindEvents() {
        // 打开文件按钮
        document.getElementById('openFileBtn').addEventListener('click', () => this.openFile());
        
        // 保存按钮
        document.getElementById('saveBtn').addEventListener('click', () => this.saveFile());
        
        // 另存为按钮
        document.getElementById('saveAsBtn').addEventListener('click', () => this.saveFileAs());
        
        // 编辑器内容变化
        this.editor.codemirror.on('change', () => {
            this.isEdited = true;
        });
    }

    async openFile() {
        try {
            const handle = await window.showOpenFilePicker({
                types: [{
                    description: 'Markdown Files',
                    accept: {
                        'text/markdown': ['.md']
                    }
                }]
            });
            
            if (this.isEdited) {
                if (!confirm('当前文档未保存，是否继续？')) {
                    return;
                }
            }

            const file = await handle[0].getFile();
            const content = await file.text();
            
            this.currentFile = handle[0];
            this.editor.value(content);
            this.isEdited = false;
            
            // 添加到历史记录
            this.addToHistory({
                path: file.name,
                title: file.name.replace('.md', ''),
                preview: content.substring(0, 30) + '...',
                handle: handle[0]
            });
        } catch (err) {
            console.error('Error opening file:', err);
        }
    }

    async saveFile() {
        if (!this.currentFile) {
            return this.saveFileAs();
        }

        try {
            const writable = await this.currentFile.createWritable();
            await writable.write(this.editor.value());
            await writable.close();
            
            this.isEdited = false;
            this.showToast('保存成功');
        } catch (err) {
            console.error('Error saving file:', err);
        }
    }

    async saveFileAs() {
        try {
            const handle = await window.showSaveFilePicker({
                types: [{
                    description: 'Markdown Files',
                    accept: {
                        'text/markdown': ['.md']
                    }
                }],
                suggestedName: this.currentFile ? this.currentFile.name : 'untitled.md'
            });

            const writable = await handle.createWritable();
            await writable.write(this.editor.value());
            await writable.close();

            this.currentFile = handle;
            this.isEdited = false;
            this.showToast('保存成功');

            // 添加到历史记录
            const content = this.editor.value();
            this.addToHistory({
                path: handle.name,
                title: handle.name.replace('.md', ''),
                preview: content.substring(0, 30) + '...',
                handle: handle
            });
        } catch (err) {
            console.error('Error saving file:', err);
        }
    }

    loadHistory() {
        const savedHistory = localStorage.getItem('md-history');
        if (savedHistory) {
            this.history = JSON.parse(savedHistory);
            this.renderHistory();
        }
    }

    addToHistory(fileInfo) {
        // 检查是否已存在
        const index = this.history.findIndex(item => item.path === fileInfo.path);
        if (index !== -1) {
            this.history.splice(index, 1);
        }
        
        // 添加到开头
        this.history.unshift(fileInfo);
        
        // 最多保存10条记录
        if (this.history.length > 10) {
            this.history.pop();
        }
        
        // 保存到localStorage
        localStorage.setItem('md-history', JSON.stringify(this.history));
        
        // 重新渲染历史记录
        this.renderHistory();
    }

    renderHistory() {
        const historyList = document.getElementById('historyList');
        historyList.innerHTML = '';
        
        this.history.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'history-item';
            div.innerHTML = `
                <h4>${item.title}</h4>
                <p>${item.preview}</p>
                <span class="delete-btn" data-index="${index}">×</span>
            `;
            
            // 点击打开文件
            div.addEventListener('click', async (e) => {
                if (e.target.classList.contains('delete-btn')) {
                    this.removeFromHistory(parseInt(e.target.dataset.index));
                } else {
                    if (this.isEdited) {
                        if (!confirm('当前文档未保存，是否继续？')) {
                            return;
                        }
                    }
                    try {
                        const file = await item.handle.getFile();
                        const content = await file.text();
                        this.currentFile = item.handle;
                        this.editor.value(content);
                        this.isEdited = false;
                    } catch (err) {
                        console.error('Error opening file from history:', err);
                        this.removeFromHistory(index);
                    }
                }
            });
            
            historyList.appendChild(div);
        });
    }

    removeFromHistory(index) {
        this.history.splice(index, 1);
        localStorage.setItem('md-history', JSON.stringify(this.history));
        this.renderHistory();
    }

    showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.style.display = 'block';
        
        setTimeout(() => {
            toast.style.display = 'none';
        }, 2000);
    }
}

// 初始化编辑器
document.addEventListener('DOMContentLoaded', () => {
    window.mdEditor = new MDEditor();
}); 