document.addEventListener('DOMContentLoaded', function() {
    const photoUpload = document.getElementById('photoUpload');
    const fileInput = document.getElementById('fileInput');
    const imagePreview = document.getElementById('imagePreview');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const limitMessage = document.getElementById('limitMessage');
    const reportForm = document.getElementById('reportForm');

    let uploadedImages = [];
    const MAX_IMAGES = 4;

    photoUpload.addEventListener('click', (e) => {
        if (e.target.tagName !== 'INPUT' && uploadedImages.length < MAX_IMAGES) {
            fileInput.click();
        } else if (uploadedImages.length >= MAX_IMAGES) {
            showLimitMessage();
        }
    });

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    // Drag and Drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        photoUpload.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        photoUpload.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        photoUpload.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
        if (uploadedImages.length < MAX_IMAGES) {
            photoUpload.classList.add('drag-over');
        }
    }

    function unhighlight(e) {
        photoUpload.classList.remove('drag-over');
    }

    photoUpload.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    function handleFiles(files) {
        const allowedFiles = Array.from(files).slice(0, MAX_IMAGES - uploadedImages.length);
        
        allowedFiles.forEach(file => {
            if (file.type.match('image.*')) {
                // Verificação de tamanho (aprox. 10MB)
                if (file.size > 10 * 1024 * 1024) {
                    alert(`Imagem ${file.name} muito grande! Máximo 10MB.`);
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = (e) => {
                    uploadedImages.push({
                        file: file,
                        url: e.target.result
                    });
                    displayPreview();
                    hideLimitMessage();
                };
                reader.readAsDataURL(file);
            }
        });

        fileInput.value = '';
    }

    function displayPreview() {
        imagePreview.innerHTML = '';
        imagePreview.style.display = 'flex';
        
        uploadedImages.forEach((imageData, index) => {
            const previewDiv = document.createElement('div');
            previewDiv.className = 'image-preview';
            previewDiv.innerHTML = `
                <img src="${imageData.url}" alt="Preview ${index + 1}" loading="lazy">
                <button type="button" class="remove-image" onclick="removeImage(${index})">×</button>
            `;
            imagePreview.appendChild(previewDiv);
        });
    
        // Scroll suave para a última imagem - Não tá funcionando :(
        imagePreviewContainer.scrollTop = imagePreviewContainer.scrollHeight;
    }

    window.removeImage = function(index) {
        uploadedImages.splice(index, 1);
        displayPreview();
        hideLimitMessage();
    };

    function showLimitMessage() {
        limitMessage.classList.add('show');
        setTimeout(() => {
            limitMessage.classList.remove('show');
        }, 4000);
    }

    function hideLimitMessage() {
        limitMessage.classList.remove('show');
    }

    // Submit do formulário
    reportForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateTelefone()) {
            alert('Por favor, insira um telefone válido no formato (99) 99999-9999');
            document.getElementById('telefone').focus();
            return;
        }

        if (uploadedImages.length === 0) {
            alert('Por favor, adicione pelo menos uma foto do problema.');
            return;
        }

        console.log('Formulário enviado com sucesso!');
        console.log('Imagens:', uploadedImages.length);
        
        alert('Reporte enviado com sucesso! Obrigado por contribuir com a cidade.');
        reportForm.reset();
        uploadedImages = [];
        imagePreview.innerHTML = '';
        hideLimitMessage();
    });
});

// Máscara de telefone
document.addEventListener('DOMContentLoaded', function() {
    const telefoneInput = document.getElementById('telefone');
    
    if (telefoneInput) {
        telefoneInput.addEventListener('input', formatTelefone);
        telefoneInput.addEventListener('keypress', onlyNumbers);
        telefoneInput.addEventListener('paste', handlePaste);
        telefoneInput.addEventListener('blur', validateTelefone);
    }
});

function onlyNumbers(e) {
    const char = String.fromCharCode(e.which);
    if (!/[0-9]/.test(char)) {
        e.preventDefault();
    }
}

function formatTelefone(e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{2})(\d)/, '($1) $2');
    value = value.replace(/(\d{5})(\d)/, '$1-$2');
    value = value.replace(/(-\d{4})\d+?$/, '$1');
    
    e.target.value = value;
    validateTelefoneVisual(e.target);
}

function handlePaste(e) {
    e.preventDefault();
    const paste = (e.clipboardData || window.clipboardData).getData('text');
    const numbers = paste.replace(/\D/g, '');
    document.getElementById('telefone').value = numbers;
    formatTelefone({ target: document.getElementById('telefone') });
}

function validateTelefoneVisual(input) {
    const value = input.value.replace(/\D/g, '');
    const isValid = value.length === 11 || value.length === 10;
    
    input.classList.toggle('valid', isValid);
    input.classList.toggle('invalid', !isValid && value.length > 0);
}

function validateTelefone() {
    const input = document.getElementById('telefone');
    const value = input.value.replace(/\D/g, '');
    
    if (value.length !== 11 && value.length !== 10) {
        input.setCustomValidity('Telefone inválido. Use o formato (99) 99999-9999');
        input.classList.add('invalid');
        input.classList.remove('valid');
        return false;
    } else {
        input.setCustomValidity('');
        input.classList.add('valid');
        input.classList.remove('invalid');
        return true;
    }
}