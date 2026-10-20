// script.js
document.addEventListener('DOMContentLoaded', () => {
    
    // --- CHAVE GLOBAL WEB3FORMS ---
    const WEB3FORMS_KEY = "95490c2d-df73-4547-afd1-dc0bb6117d22";

    // --- LÓGICA DO MENU MOBILE ---
    const menuIcon = document.getElementById('menu-icon');
    const navbar = document.querySelector('.navbar');

    if (menuIcon && navbar) {
        menuIcon.addEventListener('click', () => navbar.classList.toggle('active'));
        const navLinks = document.querySelectorAll('.nav-links li a');
        navLinks.forEach(link => link.addEventListener('click', () => navbar.classList.remove('active')));
    }

    // --- SISTEMA GLOBAL DE NOTIFICAÇÕES (TOAST) ---
    // [REFATORAÇÃO - UX LIMPA] Uso de SVGs injetados via string ao invés de emojis
    const toastContainer = document.getElementById('toast-container');
    
    const getToastIcon = (type) => {
        if (type === 'success') {
            return `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        }
        if (type === 'warning') {
            return `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
        }
        return `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    };

    window.showToast = function(message, type = 'success') {
        if(!toastContainer) return; 
        const toast = document.createElement('div');
        toast.classList.add('toast', `toast-${type}`); 
        toast.innerHTML = `<span style="display: flex; align-items: center;">${getToastIcon(type)}</span><p>${message}</p>`;
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
                    if(item.nextElementSibling) item.nextElementSibling.style.maxHeight = null;
                }
            });
            btn.classList.toggle('active');
            const answer = btn.nextElementSibling;
            if (answer && answer.style.maxHeight) {
                answer.style.maxHeight = null;
            } else if (answer) {
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    // --- LÓGICA DO BOTÃO VOLTAR AO TOPO ---
    const btnTopo = document.getElementById('btn-topo');
    if (btnTopo) {
        window.addEventListener('scroll', () => btnTopo.classList.toggle('visivel', window.scrollY > 400));
        btnTopo.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // --- LÓGICA DO MODO ESCURO ---
    const btnTema = document.getElementById('btn-tema');
    
    // [REFATORAÇÃO - UX LIMPA] SVG Icons no lugar dos emojis "☀️" e "🌙"
    const iconSun = `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    const iconMoon = `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

    if (btnTema) {
        const aplicarTema = (escuro) => {
            document.body.classList.toggle('modo-escuro', escuro);
            btnTema.innerHTML = escuro ? iconSun : iconMoon;
            localStorage.setItem('cris-tema', escuro ? 'escuro' : 'claro');
        };
        aplicarTema(localStorage.getItem('cris-tema') === 'escuro');
        btnTema.addEventListener('click', () => aplicarTema(!document.body.classList.contains('modo-escuro')));
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
                    if(targetCategory === 'all' || itemCategory === targetCategory) item.style.display = 'flex';
                    else item.style.display = 'none';
                });
            });
        });
    }

    // --- LÓGICA DOS LINKS DA SEÇÃO DESCUBRA ---
    const catLinks = document.querySelectorAll('.cat-link');
    if (catLinks.length > 0) {
        catLinks.forEach(link => {
            link.addEventListener('click', () => {
                const targetFilter = link.getAttribute('data-target-filter');
                const targetButton = document.querySelector(`.filter-btn[data-filter="${targetFilter}"]`);
                if (targetButton) {
                    targetButton.click();
                }
            });
        });
    }

    // ==========================================================================
    // CARRINHO DE COMPRAS INTELIGENTE (COM PERSISTÊNCIA E QUANTIDADES)
    // ==========================================================================
    const btnHeaderCart = document.getElementById('btn-header-cart');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartTotalSpan = document.querySelector('.cart-total span');
    const cartBadge = document.getElementById('cart-badge');
    const btnAddCartList = document.querySelectorAll('.btn-add-cart');
    const btnFinalizarPedido = document.getElementById('btn-finalizar-pedido');
    
    let cart = JSON.parse(localStorage.getItem('cris_cart')) || [];

    if(btnHeaderCart && cartSidebar && closeCartBtn) {
        btnHeaderCart.addEventListener('click', () => {
            cartSidebar.classList.add('open');
            if(toastContainer) {
                toastContainer.innerHTML = ''; // Limpa toasts se o carrinho é aberto
            }
        });
        closeCartBtn.addEventListener('click', () => cartSidebar.classList.remove('open'));
    }

    function saveAndRenderCart() {
        localStorage.setItem('cris_cart', JSON.stringify(cart));
        updateCartUI();
    }

    function updateCartUI() {
        if(!cartItemsList) return;
        cartItemsList.innerHTML = ''; 
        let total = 0; 
        let totalCount = 0;

        cart.forEach((item, index) => {
            const subtotal = item.price * item.quantity;
            total += subtotal;
            totalCount += item.quantity;

            const li = document.createElement('li');
            li.classList.add('cart-item');
            li.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>R$ ${subtotal.toFixed(2).replace('.', ',')} (${item.quantity}x)</p>
                </div>
                <div class="cart-item-actions">
                    <button class="cart-qty-btn btn-decrease" data-index="${index}">-</button>
                    <span class="cart-item-qty">${item.quantity}</span>
                    <button class="cart-qty-btn btn-increase" data-index="${index}">+</button>
                    <button class="btn-remove-item" data-index="${index}" title="Remover item">&times;</button>
                </div>
            `;
            cartItemsList.appendChild(li);
        });

        if(cartTotalSpan) cartTotalSpan.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        if(cartBadge) cartBadge.textContent = totalCount;

        document.querySelectorAll('.btn-decrease').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                if (cart[index].quantity > 1) {
                    cart[index].quantity -= 1;
                } else {
                    cart.splice(index, 1); 
                }
                saveAndRenderCart(); 
            });
        });

        document.querySelectorAll('.btn-increase').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                cart[index].quantity += 1;
                saveAndRenderCart(); 
            });
        });

        document.querySelectorAll('.btn-remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const indexToRemove = e.target.getAttribute('data-index');
                cart.splice(indexToRemove, 1); 
                saveAndRenderCart(); 
            });
        });
    }

    updateCartUI();

    if(btnAddCartList.length > 0) {
        btnAddCartList.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const name = e.target.getAttribute('data-name');
                const price = parseFloat(e.target.getAttribute('data-price'));
                
                const existingItemIndex = cart.findIndex(item => item.name === name);
                if (existingItemIndex > -1) {
                    cart[existingItemIndex].quantity += 1;
                } else {
                    cart.push({ name, price, quantity: 1 });
                }

                saveAndRenderCart();
                
                e.target.style.background = '#2ecc71'; 
                e.target.style.borderColor = '#2ecc71'; 
                e.target.style.color = '#fff';
                
                setTimeout(() => { 
                    e.target.style.background = ''; 
                    e.target.style.borderColor = ''; 
                    e.target.style.color = ''; 
                }, 1000);

                // [REFATORAÇÃO] Restringindo toast apenas a adição com carrinho fechado
                if (!cartSidebar.classList.contains('open')) {
                    showToast(`${name} adicionado ao carrinho`, 'success');
                }
            });
        });
    }

    if (btnFinalizarPedido) {
        btnFinalizarPedido.addEventListener('click', () => {
            if (cart.length === 0) return showToast('Seu carrinho está vazio!', 'error');
            
            const numeroWhatsApp = "5511970924433"; 
            let textoPedido = "Olá Cris Deguste! Gostaria de fazer o seguinte pedido:\n\n";
            let totalPedido = 0;
            
            cart.forEach((item) => {
                let subtotalItem = item.price * item.quantity;
                textoPedido += `- ${item.quantity}x ${item.name} (R$ ${subtotalItem.toFixed(2).replace('.', ',')})\n`; 
                totalPedido += subtotalItem; 
            });
            
            textoPedido += `\n*Total estimado: R$ ${totalPedido.toFixed(2).replace('.', ',')}*\n\nComo podemos prosseguir com o pagamento e a entrega?`;
            window.open(`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(textoPedido)}`, '_blank');
            
            // [REFATORAÇÃO] Removido uso indevido do Toast. Feedback alocado ao estado do botão.
            const btnOriginalText = btnFinalizarPedido.textContent;
            btnFinalizarPedido.textContent = 'Redirecionando...';
            btnFinalizarPedido.style.opacity = '0.7';
            btnFinalizarPedido.style.cursor = 'wait';
            
            setTimeout(() => {
                cart = []; 
                saveAndRenderCart(); 
                cartSidebar.classList.remove('open');
                
                btnFinalizarPedido.textContent = btnOriginalText;
                btnFinalizarPedido.style.opacity = '1';
                btnFinalizarPedido.style.cursor = 'pointer';
            }, 1500);
        });
    }

    // ==========================================================================
    // SISTEMA DE AVALIAÇÕES (MURAL COM CARROSSEL 3D)
    // ==========================================================================
    const reviewForm = document.getElementById('review-form');
    const starInput = document.getElementById('star-rating-input');
    const ratingHidden = document.getElementById('rev-rating');
    const reviewsList = document.getElementById('reviews-list');
    let currentRating = 5; 

    let carouselItems = [];
    let currentReviewIndex = 0;
    let autoPlayInterval;

    if (starInput) {
        const stars = starInput.querySelectorAll('span');
        const highlightStars = (rating) => {
            stars.forEach(s => s.style.color = parseInt(s.getAttribute('data-val')) <= rating ? '#f4b63f' : '#ccc');
        };
        highlightStars(currentRating);
        stars.forEach(star => {
            star.addEventListener('click', () => {
                currentRating = parseInt(star.getAttribute('data-val'));
                if (ratingHidden) ratingHidden.value = currentRating;
                highlightStars(currentRating);
            });
        });
    }

    function updateCarousel() {
        const totalItems = carouselItems.length;
        if (totalItems === 0) return;

        carouselItems.forEach((item, index) => {
            let offset = index - currentReviewIndex;

            if (offset > Math.floor(totalItems / 2)) {
                offset -= totalItems;
            } else if (offset < -Math.floor(totalItems / 2)) {
                offset += totalItems;
            }

            const absOffset = Math.abs(offset);

            const scale = Math.max(1 - absOffset * 0.15, 0); 
            const opacity = Math.max(1 - absOffset * 0.4, 0); 
            const translateX = offset * 110; 
            const translateZ = -absOffset * 150; 
            const zIndex = 100 - absOffset; 

            item.style.transform = `translateX(${translateX}%) translateZ(${translateZ}px) scale(${scale})`;
            item.style.opacity = opacity;
            item.style.zIndex = zIndex;
            item.style.visibility = absOffset > 2 ? 'hidden' : 'visible'; 
            item.style.pointerEvents = absOffset === 0 ? 'auto' : 'none'; 
        });
    }

    function initCarousel() {
        if(!reviewsList) return;
        carouselItems = Array.from(document.querySelectorAll('.review-card'));
        updateCarousel();
        startAutoPlay();
    }

    function startAutoPlay() {
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(() => {
            currentReviewIndex = (currentReviewIndex + 1) % carouselItems.length;
            updateCarousel();
        }, 4000); 
    }

    const prevBtn = document.getElementById('prev-review');
    const nextBtn = document.getElementById('next-review');

    if(prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            currentReviewIndex = (currentReviewIndex - 1 + carouselItems.length) % carouselItems.length;
            updateCarousel();
            startAutoPlay(); 
        });

        nextBtn.addEventListener('click', () => {
            currentReviewIndex = (currentReviewIndex + 1) % carouselItems.length;
            updateCarousel();
            startAutoPlay();
        });
    }

    function loadReviews() {
        if(!reviewsList) return;
        document.querySelectorAll('.dynamic-review').forEach(el => el.remove());
        let avaliacoes = JSON.parse(localStorage.getItem('avaliacoes_salvas')) || [];
        
        avaliacoes.forEach(av => {
            let starsHTML = '';
            for(let i=1; i<=5; i++) starsHTML += i <= av.estrelas ? '★' : '☆';

            const card = document.createElement('div');
            card.classList.add('review-card', 'dynamic-review');
            card.innerHTML = `
                <div class="review-stars">${starsHTML}</div>
                <p class="review-text">"${av.texto}"</p>
                <p class="review-author">- ${av.nome}</p>
            `;
            reviewsList.prepend(card); 
        });

        initCarousel();
    }
    
    loadReviews();

    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            const submitBtn = reviewForm.querySelector('button[type="submit"]');
            const originalBtnText = "Enviar Avaliação";
            
            const nameElement = document.getElementById('rev-name');
            const textElement = document.getElementById('rev-text');
            
            const nome = nameElement && nameElement.value.trim() !== '' ? nameElement.value.trim() : 'Anônimo';
            const mensagem = textElement ? textElement.value.trim() : '';
            const estrelas = ratingHidden ? parseInt(ratingHidden.value) : 5;

            if (!mensagem) {
                submitBtn.textContent = 'Escreva uma mensagem';
                submitBtn.style.background = '#e74c3c';
                submitBtn.style.borderColor = '#e74c3c';
                setTimeout(() => { 
                    submitBtn.textContent = originalBtnText; 
                    submitBtn.style.background = ''; 
                    submitBtn.style.borderColor = ''; 
                }, 2000);
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
            submitBtn.style.background = 'var(--color-brown-dark)';
            submitBtn.style.borderColor = 'var(--color-brown-dark)';
            submitBtn.style.opacity = '0.8';
            submitBtn.style.cursor = 'not-allowed';

            const corpoDoDepoimento = `
Estrelas: ${estrelas} de 5

Mensagem:
${mensagem}

----------------------------------------
Avaliação de: ${nome}
            `;

            fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    access_key: WEB3FORMS_KEY,
                    subject: "Novo Depoimento - Cris Deguste",
                    from_name: nome,
                    message: corpoDoDepoimento
                })
            })
            .then(response => response.json())
            .then(data => {
                let avaliacoes = JSON.parse(localStorage.getItem('avaliacoes_salvas')) || [];
                avaliacoes.push({
                    id: Date.now(),
                    nome: nome,
                    texto: mensagem,
                    estrelas: estrelas
                });
                localStorage.setItem('avaliacoes_salvas', JSON.stringify(avaliacoes));

                reviewForm.reset();
                currentRating = 5;
                if (ratingHidden) ratingHidden.value = 5;
                if (starInput) starInput.querySelectorAll('span').forEach(s => s.style.color = '#f4b63f');
                
                submitBtn.textContent = 'Enviado com sucesso!';
                submitBtn.style.background = '#2ecc71';
                submitBtn.style.borderColor = '#2ecc71';
                submitBtn.style.color = '#fff';
                submitBtn.style.opacity = '1';
                
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                    submitBtn.style.background = '';
                    submitBtn.style.borderColor = '';
                    submitBtn.style.color = '';
                    submitBtn.style.cursor = 'pointer';
                    
                    loadReviews(); 
                    currentReviewIndex = 0; 
                    updateCarousel();
                }, 3000);
            })
            .catch(error => {
                console.error("Erro no envio do depoimento:", error);
                
                submitBtn.textContent = 'Erro ao enviar';
                submitBtn.style.background = '#e74c3c';
                submitBtn.style.borderColor = '#e74c3c';
                submitBtn.style.opacity = '1';
                
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                    submitBtn.style.background = '';
                    submitBtn.style.borderColor = '';
                    submitBtn.style.cursor = 'pointer';
                }, 3000);
            });
        });
    }

    // ==========================================================================
    // LÓGICA DE VALIDAÇÃO DO FORMULÁRIO DE CONTATO E ENVIO DE E-MAIL
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = "Enviar Mensagem";
            
            const nome = document.getElementById('contato-nome').value.trim();
            const email = document.getElementById('contato-email').value.trim();
            const assuntoElement = document.getElementById('contato-assunto');
            const assunto = assuntoElement.options[assuntoElement.selectedIndex].text;
            const mensagem = document.getElementById('contato-mensagem').value.trim();

            if(!nome || !email || !assuntoElement.value || !mensagem) {
                submitBtn.textContent = 'Preencha os campos obrigatórios';
                submitBtn.style.background = '#e74c3c';
                submitBtn.style.borderColor = '#e74c3c';
                setTimeout(() => { 
                    submitBtn.textContent = originalBtnText; 
                    submitBtn.style.background = ''; 
                    submitBtn.style.borderColor = ''; 
                }, 2000);
                return;
            }
            
            if(!email.includes('@') || !email.includes('.')) {
                submitBtn.textContent = 'E-mail inválido';
                submitBtn.style.background = '#e74c3c';
                submitBtn.style.borderColor = '#e74c3c';
                setTimeout(() => { 
                    submitBtn.textContent = originalBtnText; 
                    submitBtn.style.background = ''; 
                    submitBtn.style.borderColor = ''; 
                }, 2000);
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
            submitBtn.style.background = 'var(--color-brown-dark)';
            submitBtn.style.borderColor = 'var(--color-brown-dark)';
            submitBtn.style.opacity = '0.8';
            submitBtn.style.cursor = 'not-allowed';

            const corpoDoEmail = `
Mensagem:
${mensagem}

----------------------------------------
Assinatura do Cliente:
Nome: ${nome}
E-mail de Contato: ${email}
            `;

            fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    access_key: WEB3FORMS_KEY,
                    subject: `Cris Deguste: ${assunto}`,
                    from_name: nome,
                    replyto: email, 
                    message: corpoDoEmail
                })
            })
            .then(response => response.json())
            .then(data => {
                contactForm.reset(); 
                
                submitBtn.textContent = 'Mensagem enviada com sucesso!';
                submitBtn.style.background = '#2ecc71';
                submitBtn.style.borderColor = '#2ecc71';
                submitBtn.style.color = '#fff';
                submitBtn.style.opacity = '1';
                
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                    submitBtn.style.background = '';
                    submitBtn.style.borderColor = '';
                    submitBtn.style.color = '';
                    submitBtn.style.cursor = 'pointer';
                }, 3000);
            })
            .catch(error => {
                console.error("Erro no envio:", error);
                
                submitBtn.textContent = 'Erro ao enviar';
                submitBtn.style.background = '#e74c3c';
                submitBtn.style.borderColor = '#e74c3c';
                submitBtn.style.opacity = '1';
                
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                    submitBtn.style.background = '';
                    submitBtn.style.borderColor = '';
                    submitBtn.style.cursor = 'pointer';
                }, 3000);
            });
        });
    }
});