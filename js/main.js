// 获取DOM元素
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const previewArea = document.getElementById('previewArea');
const originalImage = document.getElementById('originalImage');
const compressedImage = document.getElementById('compressedImage');
const originalSize = document.getElementById('originalSize');
const compressedSize = document.getElementById('compressedSize');
const qualitySlider = document.getElementById('quality');
const qualityValue = document.getElementById('qualityValue');
const downloadBtn = document.getElementById('downloadBtn');

// 当前处理的图片文件
let currentFile = null;

// 文件大小格式化
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 处理图片上传
function handleImageUpload(file) {
    if (!file.type.match('image.*')) {
        alert('请上传图片文件！');
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        alert('图片大小不能超过10MB！');
        return;
    }

    currentFile = file;
    originalSize.textContent = formatFileSize(file.size);

    const reader = new FileReader();
    reader.onload = function(e) {
        originalImage.src = e.target.result;
        compressImage(e.target.result, qualitySlider.value);
    };
    reader.readAsDataURL(file);

    previewArea.hidden = false;
    downloadBtn.hidden = false;
}

// 压缩图片
function compressImage(imageData, quality) {
    const img = new Image();
    img.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // 保持原始宽高比
        canvas.width = img.width;
        canvas.height = img.height;

        // 绘制图片
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        // 压缩图片
        const compressedDataUrl = canvas.toDataURL(currentFile.type, quality / 100);
        compressedImage.src = compressedDataUrl;

        // 计算压缩后的大小
        const compressedSize = Math.round((compressedDataUrl.length - 22) * 3 / 4);
        document.getElementById('compressedSize').textContent = formatFileSize(compressedSize);
    };
    img.src = imageData;
}

// 下载压缩后的图片
function downloadCompressedImage() {
    const link = document.createElement('a');
    link.download = `compressed_${currentFile.name}`;
    link.href = compressedImage.src;
    link.click();
}

// 事件监听器
uploadArea.addEventListener('click', () => fileInput.click());

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--primary-color)';
    uploadArea.style.backgroundColor = 'rgba(0, 122, 255, 0.05)';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = 'var(--border-color)';
    uploadArea.style.backgroundColor = 'var(--white)';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--border-color)';
    uploadArea.style.backgroundColor = 'var(--white)';
    const file = e.dataTransfer.files[0];
    handleImageUpload(file);
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleImageUpload(file);
    }
});

qualitySlider.addEventListener('input', (e) => {
    const quality = e.target.value;
    qualityValue.textContent = quality + '%';
    if (currentFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            compressImage(e.target.result, quality);
        };
        reader.readAsDataURL(currentFile);
    }
});

downloadBtn.addEventListener('click', downloadCompressedImage); 