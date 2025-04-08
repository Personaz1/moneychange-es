/**
 * Модуль для управления изображениями в админ-панели
 */
import { auth } from './auth.js';

class ImageManager {
    constructor() {
        this.apiBaseUrl = '/api/images';
        this.imagesList = document.getElementById('imagesList');
        this.uploadForm = document.getElementById('imageUploadForm');
        this.dropZone = document.getElementById('imageDropZone');
        
        // Инициализация
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadImages();
    }
    
    setupEventListeners() {
        // Обработчик формы загрузки
        if (this.uploadForm) {
            this.uploadForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.uploadImage();
            });
        }
        
        // Обработчик кнопки загрузки
        const uploadBtn = document.getElementById('uploadImageBtn');
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => this.uploadImage());
        }
        
        // Drag and Drop для изображений
        if (this.dropZone) {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                this.dropZone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                });
            });
            
            ['dragenter', 'dragover'].forEach(eventName => {
                this.dropZone.addEventListener(eventName, () => {
                    this.dropZone.classList.add('highlight');
                });
            });
            
            ['dragleave', 'drop'].forEach(eventName => {
                this.dropZone.addEventListener(eventName, () => {
                    this.dropZone.classList.remove('highlight');
                });
            });
            
            this.dropZone.addEventListener('drop', (e) => {
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    document.getElementById('imageFile').files = files;
                    // Показать имя файла
                    document.getElementById('fileNameDisplay').textContent = files[0].name;
                }
            });
            
            // Клик на dropzone открывает диалог выбора файла
            this.dropZone.addEventListener('click', () => {
                document.getElementById('imageFile').click();
            });
        }
        
        // Обработчик для предпросмотра изображения
        const imageInput = document.getElementById('imageFile');
        if (imageInput) {
            imageInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    document.getElementById('fileNameDisplay').textContent = file.name;
                    
                    // Предпросмотр изображения
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const preview = document.getElementById('imagePreview');
                        if (preview) {
                            preview.src = e.target.result;
                            preview.classList.remove('d-none');
                        }
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
        
        // Делегирование событий для кнопок удаления изображений
        if (this.imagesList) {
            this.imagesList.addEventListener('click', (e) => {
                const deleteBtn = e.target.closest('.delete-image');
                if (deleteBtn) {
                    const imageId = deleteBtn.dataset.id;
                    this.deleteImage(imageId);
                }
                
                const setPrimaryBtn = e.target.closest('.set-primary');
                if (setPrimaryBtn) {
                    const imageId = setPrimaryBtn.dataset.id;
                    this.setPrimaryImage(imageId);
                }
                
                const copyBtn = e.target.closest('.copy-url');
                if (copyBtn) {
                    const url = copyBtn.dataset.url;
                    navigator.clipboard.writeText(url)
                        .then(() => this.showSuccess('URL скопирован в буфер обмена'))
                        .catch(() => this.showError('Не удалось скопировать URL'));
                }
            });
        }
    }
    
    /**
     * Загружает список изображений
     */
    async loadImages() {
        try {
            if (!this.imagesList) return;
            
            // Показываем загрузку
            this.imagesList.innerHTML = '<div class="d-flex justify-content-center"><div class="spinner-border text-primary" role="status"></div></div>';
            
            // В реальном приложении здесь должен быть запрос к API
            // const response = await fetch(this.apiBaseUrl, {
            //     headers: auth.getAuthHeader()
            // });
            // const images = await response.json();
            
            // Для демонстрации используем демо-данные
            setTimeout(() => {
                this.displayImages(this.getDemoImages());
            }, 500);
            
        } catch (error) {
            console.error('Ошибка при загрузке изображений:', error);
            this.showError('Не удалось загрузить изображения');
        }
    }
    
    /**
     * Отображает список изображений
     */
    displayImages(images) {
        if (!this.imagesList) return;
        
        if (!images || images.length === 0) {
            this.imagesList.innerHTML = '<div class="alert alert-info">Нет загруженных изображений</div>';
            return;
        }
        
        const imageCards = images.map(image => {
            return `
                <div class="col-md-4 col-lg-3 mb-4">
                    <div class="card h-100">
                        <div class="position-relative">
                            <img src="${image.url}" class="card-img-top" alt="${image.name}" style="height: 180px; object-fit: cover;">
                            ${image.isPrimary ? '<span class="position-absolute top-0 start-0 badge bg-primary m-2">Основное</span>' : ''}
                        </div>
                        <div class="card-body">
                            <h6 class="card-title">${image.name}</h6>
                            <p class="card-text text-muted small">
                                Загружено: ${new Date(image.createdAt).toLocaleString()}<br>
                                Размер: ${this.formatFileSize(image.size)}
                            </p>
                        </div>
                        <div class="card-footer bg-white d-flex justify-content-between">
                            <button class="btn btn-sm btn-primary copy-url" data-url="${image.url}" title="Копировать URL">
                                <i class="fas fa-copy me-1"></i> URL
                            </button>
                            <div>
                                ${!image.isPrimary ? `
                                <button class="btn btn-sm btn-success set-primary" data-id="${image.id}" title="Сделать основным">
                                    <i class="fas fa-star"></i>
                                </button>` : ''}
                                <button class="btn btn-sm btn-danger delete-image" data-id="${image.id}" title="Удалить">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        this.imagesList.innerHTML = `<div class="row">${imageCards}</div>`;
        
        // Добавляем обработчики для копирования URL
        this.imagesList.querySelectorAll('.copy-url').forEach(btn => {
            btn.addEventListener('click', () => {
                const url = btn.dataset.url;
                navigator.clipboard.writeText(url)
                    .then(() => this.showSuccess('URL скопирован в буфер обмена'))
                    .catch(() => this.showError('Не удалось скопировать URL'));
            });
        });
        
        // Добавляем обработчики для кнопки "Сделать основным"
        this.imagesList.querySelectorAll('.set-primary').forEach(btn => {
            btn.addEventListener('click', () => {
                const imageId = btn.dataset.id;
                this.setPrimaryImage(imageId);
            });
        });
    }
    
    /**
     * Устанавливает основное изображение
     */
    async setPrimaryImage(imageId) {
        try {
            // Здесь должен быть запрос к API
            // await fetch(`${this.apiBaseUrl}/${imageId}/primary`, {
            //     method: 'PATCH',
            //     headers: auth.getAuthHeader()
            // });
            
            this.showSuccess('Основное изображение успешно изменено');
            this.loadImages(); // Перезагружаем список
            
        } catch (error) {
            console.error('Ошибка при установке основного изображения:', error);
            this.showError('Не удалось установить основное изображение');
        }
    }
    
    /**
     * Загружает новое изображение
     */
    async uploadImage() {
        try {
            const fileInput = document.getElementById('imageFile');
            if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
                this.showError('Выберите файл для загрузки');
                return;
            }
            
            const file = fileInput.files[0];
            const formData = new FormData();
            formData.append('image', file);
            formData.append('name', document.getElementById('imageName').value || file.name);
            formData.append('altText', document.getElementById('imageAltText').value || '');
            
            // Здесь должен быть запрос к API
            // const response = await fetch(this.apiBaseUrl, {
            //     method: 'POST',
            //     headers: auth.getAuthHeader(),
            //     body: formData
            // });
            
            // if (!response.ok) {
            //     throw new Error('Ошибка загрузки');
            // }
            
            // Очищаем форму
            this.uploadForm.reset();
            document.getElementById('imagePreview').classList.add('d-none');
            document.getElementById('fileNameDisplay').textContent = 'Выберите файл...';
            
            this.showSuccess('Изображение успешно загружено');
            this.loadImages(); // Перезагружаем список
            
        } catch (error) {
            console.error('Ошибка при загрузке изображения:', error);
            this.showError('Не удалось загрузить изображение');
        }
    }
    
    /**
     * Удаляет изображение
     */
    async deleteImage(imageId) {
        if (!confirm('Вы уверены, что хотите удалить это изображение?')) {
            return;
        }
        
        try {
            // Здесь должен быть запрос к API
            // await fetch(`${this.apiBaseUrl}/${imageId}`, {
            //     method: 'DELETE',
            //     headers: auth.getAuthHeader()
            // });
            
            this.showSuccess('Изображение успешно удалено');
            this.loadImages(); // Перезагружаем список
            
        } catch (error) {
            console.error('Ошибка при удалении изображения:', error);
            this.showError('Не удалось удалить изображение');
        }
    }
    
    /**
     * Форматирует размер файла
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Байт';
        
        const k = 1024;
        const sizes = ['Байт', 'КБ', 'МБ', 'ГБ'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    /**
     * Демо-данные для изображений
     */
    getDemoImages() {
        return [
            {
                id: 'img1',
                name: 'trump.png',
                url: '/images/trump.png',
                size: 1638400,
                createdAt: '2024-03-26T16:43:00Z',
                isPrimary: true
            },
            {
                id: 'img2',
                name: 'Trump2.png',
                url: '/images/Trump2.png',
                size: 1843200,
                createdAt: '2024-03-26T17:00:00Z',
                isPrimary: false
            },
            {
                id: 'img3',
                name: 'deal.png',
                url: '/images/deal.png',
                size: 1947648,
                createdAt: '2024-03-30T21:36:00Z',
                isPrimary: false
            },
            {
                id: 'img4',
                name: 'exchange.jpg',
                url: '/images/exchange.jpg',
                size: 153600,
                createdAt: '2024-03-29T12:15:00Z',
                isPrimary: false
            }
        ];
    }
    
    /**
     * Показывает сообщение об ошибке
     */
    showError(message) {
        this.showNotification(message, 'danger');
    }
    
    /**
     * Показывает сообщение об успехе
     */
    showSuccess(message) {
        this.showNotification(message, 'success');
    }
    
    /**
     * Показывает уведомление
     */
    showNotification(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        
        const id = 'toast-' + Date.now();
        const html = `
            <div id="${id}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header bg-${type} text-white">
                    <strong class="me-auto">${type === 'success' ? 'Успех' : type === 'danger' ? 'Ошибка' : 'Информация'}</strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', html);
        const toastElement = document.getElementById(id);
        const toast = new bootstrap.Toast(toastElement, { delay: 5000 });
        toast.show();
        
        // Удаляем элемент после скрытия
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Проверяем, находимся ли мы на странице управления изображениями
    if (document.getElementById('imagesList')) {
        window.imageManager = new ImageManager();
    }
}); 