/**
 * ============================================================================
 * PROJETO ACADÊMICO: CRIS DEGUSTE
 * ARQUIVO: script.js
 * DESCRIÇÃO: Central de interatividade com múltiplas lógicas de Front-End
 * para atender aos requisitos da disciplina.
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- LÓGICA DO MENU MOBILE ---
    const menuIcon = document.getElementById('menu-icon');
    const navbar = document.querySelector('.navbar');

    if (menuIcon && navbar) {
        menuIcon.addEventListener('click', () => {
            navbar.classList.toggle('active');
        });
        
        const navLinks = document.querySelectorAll('.nav-links li a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navbar.classList.remove('active');
            });
        });
    }

    // --- SISTEMA GLOBAL DE NOTIFICAÇÕES (TOAST) ---
    const toastContainer = document.getElementById('toast-container');

    window.showToast = function(message, type = 'success') {
        if(!toastContainer) return; 

        const toast = document.createElement('div');
        toast.classList.add('toast', `toast-${type}`); 
        
        const icone = type === 'success' ? '✅' : (type === 'error' ? '❌' : '⚠️');

        toast.innerHTML = `
            <span>${icone}</span>
            <p>${message}</p>
        `;

        toastContainer.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300); 
        }, 3000);
    };

    // --- LÓGICA DO FAQ (ACORDEÃO) ---
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            faqQuestions.forEach(item => {
                if (item !== btn) {
                    item.classList.remove('active');
                    item.nextElementSibling.style.maxHeight = null;
                }
            });

            btn.classList.toggle('active');
            const answer = btn.nextElementSibling;
            if (answer.style.maxHeight) {
                answer.style.maxHeight = null;
            } else {
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    // --- LÓGICA DE AVALIAÇÕES (ESTRELAS E FORMULÁRIO) ---
    const starInput = document.getElementById('star-rating-input');
    const ratingHidden = document.getElementById('rev-rating');
    let currentRating = 5; 

    if(starInput) {
        const stars = starInput.querySelectorAll('span');
        
        const highlightStars = (rating) => {
            stars.forEach(s => {
                s.style.color = s.getAttribute('data-val') <= rating ? '#f4b63f' : '#ccc';
            });
        };
        highlightStars(currentRating);

        stars.forEach(star => {
            star.addEventListener('click', () => {
                currentRating = star.getAttribute('data-val');
                ratingHidden.value = currentRating;
                highlightStars(currentRating);
            });
        });
    }

    const reviewForm = document.getElementById('review-form');
    const reviewsList = document.getElementById('reviews-list');

    // --- LÓGICA DE AVALIAÇÕES (MODERAÇÃO E PREVENÇÃO DE SPAM) ---
    const reviewForm = document.getElementById('review-form');
    // const reviewsList = document.getElementById('reviews-list'); // Não usaremos mais a injeção direta

    if(reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // 1. Captura os dados
            const name = document.getElementById('rev-name').value.trim();
            const text = document.getElementById('rev-text').value.trim();
            const rating = ratingHidden.value;
            
            // 2. Cria o objeto simulando um envio (Payload)
            const novaAvaliacao = {
                id: Date.now(),
                nome: name,
                texto: text,
                estrelas: parseInt(rating),
                dataCriacao: new Date().toISOString(),
                status: 'pendente' // Flag crucial para moderação
            };

            // 3. Simula o salvamento no banco de dados (usando LocalStorage temporariamente)
            let avaliacoesPendentes = JSON.parse(localStorage.getItem('avaliacoes_pendentes')) || [];
            avaliacoesPendentes.push(novaAvaliacao);
            localStorage.setItem('avaliacoes_pendentes', JSON.stringify(avaliacoesPendentes));

            // Log no console para o professor ver que a lógica dos dados está funcionando
            console.log("NOVA AVALIAÇÃO ENVIADA PARA MODERAÇÃO:", novaAvaliacao);

            // 4. Limpa o formulário e reseta as estrelas
            reviewForm.reset();
            currentRating = 5;
            ratingHidden.value = 5;
            if(starInput) {
                const stars = starInput.querySelectorAll('span');
                stars.forEach(s => s.style.color = '#f4b63f');
            }
            
            // 5. Exibe o feedback seguro para o usuário
            showToast('Avaliação enviada para moderação. Após análise, ela aparecerá no mural!', 'success');
        });
    }

    // --- LÓGICA DO BOTÃO VOLTAR AO TOPO ---
    const btnTopo = document.getElementById('btn-topo');

    if (btnTopo) {
        window.addEventListener('scroll', () => {
            btnTopo.classList.toggle('visivel', window.scrollY > 400);
        });

        btnTopo.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- LÓGICA DO MODO ESCURO ---
    const btnTema = document.getElementById('btn-tema');

    if (btnTema) {
        const aplicarTema = (escuro) => {
            document.body.classList.toggle('modo-escuro', escuro);
            btnTema.textContent = escuro ? '☀️' : '🌙';
            localStorage.setItem('cris-tema', escuro ? 'escuro' : 'claro');
        };

        aplicarTema(localStorage.getItem('cris-tema') === 'escuro');

        btnTema.addEventListener('click', () => {
            aplicarTema(!document.body.classList.contains('modo-escuro'));
        });
    }

    // --- LÓGICA DO FILTRO DE CARDÁPIO ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuItems = document.querySelectorAll('.menu-item');

    if(filterButtons.length > 0 && menuItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault(); 
                
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const targetCategory = button.getAttribute('data-filter');

                menuItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category') || 'none';
                    
                    if(targetCategory === 'all' || itemCategory === targetCategory) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // --- LÓGICA DO CARRINHO DE COMPRAS E INTEGRAÇÃO WHATSAPP ---
    const btnFloatingCart = document.getElementById('btn-floating-cart');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartTotalSpan = document.querySelector('.cart-total span');
    const cartBadge = document.getElementById('cart-badge');
    const btnAddCartList = document.querySelectorAll('.btn-add-cart');
    const btnFinalizarPedido = document.getElementById('btn-finalizar-pedido');

    let cart = [];

    if(btnFloatingCart && cartSidebar && closeCartBtn) {
        btnFloatingCart.addEventListener('click', () => cartSidebar.classList.add('open'));
        closeCartBtn.addEventListener('click', () => cartSidebar.classList.remove('open'));
    }

    function updateCartUI() {
        cartItemsList.innerHTML = ''; 
        let total = 0; 
        
        cart.forEach((item, index) => {
            total += item.price; 
            
            const li = document.createElement('li');
            li.classList.add('cart-item');
            li.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                </div>
                <button class="btn-remove-item" data-index="${index}">&times;</button>
            `;
            cartItemsList.appendChild(li);
        });

        cartTotalSpan.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        cartBadge.textContent = cart.length;

        const removeBtns = document.querySelectorAll('.btn-remove-item');
        removeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const indexToRemove = e.target.getAttribute('data-index');
                const itemName = cart[indexToRemove].name;
                cart.splice(indexToRemove, 1); 
                updateCartUI(); 
                showToast(`${itemName} removido do carrinho.`, 'warning');
            });
        });
    }

    if(btnAddCartList.length > 0) {
        btnAddCartList.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const name = e.target.getAttribute('data-name');
                const price = parseFloat(e.target.getAttribute('data-price'));
                
                cart.push({ name, price });
                updateCartUI();
                
                showToast(`${name} adicionado ao carrinho!`, 'success');

                const originalText = e.target.textContent;
                e.target.textContent = '✔';
                e.target.style.background = '#2ecc71';
                e.target.style.borderColor = '#2ecc71';
                e.target.style.color = '#fff';
                
                setTimeout(() => {
                    e.target.textContent = originalText;
                    e.target.style.background = '';
                    e.target.style.borderColor = '';
                    e.target.style.color = '';
                }, 1000);
            });
        });
    }

    // Ação do Botão "Finalizar Pedido" (Redirecionamento WhatsApp)
    if (btnFinalizarPedido) {
        btnFinalizarPedido.addEventListener('click', () => {
            if (cart.length === 0) {
                showToast('Seu carrinho está vazio!', 'error');
                return;
            } 
            
            // Defina aqui o número do WhatsApp da loja (com código do país 55 e DDD)
            const numeroWhatsApp = "5511970924433"; 

            // Monta a string do pedido
            let textoPedido = "Olá Cris Deguste! Gostaria de fazer o seguinte pedido:\n\n";
            let totalPedido = 0;

            cart.forEach((item) => {
                textoPedido += `- 1x ${item.name} (R$ ${item.price.toFixed(2).replace('.', ',')})\n`;
                totalPedido += item.price;
            });

            textoPedido += `\n*Total estimado: R$ ${totalPedido.toFixed(2).replace('.', ',')}*\n\n`;
            
            // O encodeURIComponent transforma espaços e quebras de linha em formato seguro para URL
            const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(textoPedido)}`;

            // Redireciona o usuário (abre nova aba)
            window.open(urlWhatsApp, '_blank');

            // Feedback visual e limpeza do carrinho
            showToast('Redirecionando para o WhatsApp...', 'success');
            cart = []; 
            updateCartUI();
            setTimeout(() => cartSidebar.classList.remove('open'), 1500);
        });
    }

    // --- LÓGICA DE VALIDAÇÃO DO FORMULÁRIO DE CONTATO ---
    const contactForm = document.getElementById('contact-form');
    
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            const nome = document.getElementById('contato-nome').value.trim();
            const email = document.getElementById('contato-email').value.trim();
            const assunto = document.getElementById('contato-assunto').value;
            const mensagem = document.getElementById('contato-mensagem').value.trim();

            if(nome === '' || email === '' || assunto === '' || mensagem === '') {
                showToast('Por favor, preencha todos os campos obrigatórios.', 'warning');
                return; 
            }

            if(!email.includes('@') || !email.includes('.')) {
                showToast('O e-mail informado não parece ser válido.', 'error');
                return;
            }

            contactForm.reset(); 
            showToast(`Obrigado ${nome}! Sua mensagem foi enviada.`, 'success');
        });
    }
});