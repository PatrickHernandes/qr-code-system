// Script para o Sistema de Rastreamento de Produtos

document.addEventListener('DOMContentLoaded', function() {
    // Elementos da interface
    const loadingElement = document.getElementById('loading');
    const notFoundElement = document.getElementById('not-found');
    const productInfoElement = document.getElementById('product-info');
    const productDetailsElement = document.getElementById('product-details');
    const productQRCodeElement = document.getElementById('product-qrcode');
    
    // Função para obter parâmetros da URL
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }
    
    // Função para carregar os dados do produto
    async function loadProductData() {
        try {
            // Obter o ID do produto da URL
            const productId = getUrlParameter('id');
            
            if (!productId) {
                showNotFound();
                return;
            }
            
            // Carregar o arquivo JSON
            const response = await fetch('data/products.json');
            if (!response.ok) {
                throw new Error('Falha ao carregar dados dos produtos');
            }
            
            const data = await response.json();
            
            // Verificar se o produto existe
            if (!data[productId]) {
                showNotFound();
                return;
            }
            
            // Exibir os dados do produto
            displayProductData(data[productId], productId);
            
        } catch (error) {
            console.error('Erro:', error);
            showNotFound();
        }
    }
    
    // Função para exibir os dados do produto
    function displayProductData(product, productId) {
        // Limpar conteúdo anterior
        productDetailsElement.innerHTML = '';
        
        // Adicionar cada campo do produto em cards individuais
        for (const [key, value] of Object.entries(product)) {
            if (value && value !== 'undefined' && value !== 'null') {
                const cardDiv = document.createElement('div');
                cardDiv.className = 'product-detail-card mb-3';
                
                const titleDiv = document.createElement('div');
                titleDiv.className = 'detail-title';
                titleDiv.textContent = formatFieldName(key);
                
                const valueDiv = document.createElement('div');
                valueDiv.className = 'detail-value';
                valueDiv.textContent = value;
                
                cardDiv.appendChild(titleDiv);
                cardDiv.appendChild(valueDiv);
                productDetailsElement.appendChild(cardDiv);
            }
        }
        
        // Definir a imagem do QR code
        productQRCodeElement.src = `images/qrcodes/qrcode_${productId}.png`;
        productQRCodeElement.alt = `QR Code do Produto ${productId}`;
        
        // Esconder o loading e mostrar as informações do produto
        loadingElement.classList.add('d-none');
        productInfoElement.classList.remove('d-none');
        productInfoElement.classList.add('show');
        
        // Adicionar animação de entrada
        setTimeout(() => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }, 100);
    }
    
    // Função para formatar o nome dos campos
    function formatFieldName(fieldName) {
        // Mapeamento de nomes de campos para exibição mais amigável
        const fieldMap = {
            'OP': 'Ordem de Produção',
            'Lote': 'Número do Lote',
            'Produto': 'Código do Produto',
            'Descrição': 'Descrição',
            'Data Fabricação': 'Data de Fabricação',
            'Composição': 'Composição'
        };
        
        return fieldMap[fieldName] || fieldName;
    }
    
    // Função para mostrar mensagem de produto não encontrado
    function showNotFound() {
        loadingElement.classList.add('d-none');
        notFoundElement.classList.remove('d-none');
    }
    
    // Iniciar o carregamento dos dados
    loadProductData();
});
