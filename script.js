document.addEventListener('DOMContentLoaded', () => {
    
    // --- LÓGICA DO MENU MOBILE ---
    const menuIcon = document.getElementById('menu-icon');
    const navbar = document.querySelector('.navbar');

    if (menuIcon && navbar) {
        menuIcon.addEventListener('click', () => navbar.classList.toggle('active'));
        const navLinks = document.querySelectorAll('.nav-links li a');
        navLinks.forEach(link => link.addEventListener('click', () => navbar.classList.remove('active')));
    }

    // --- SISTEMA GLOBAL DE NOTIFICAÇÕES (TOAST) ---
    const toastContainer = document.getElementById('toast-container');
    window.showToast = function(message, type = 'success') {
        if(!toastContainer) return; 
        const toast = document.createElement('div');
        toast.classList.add('toast', `toast-${type}`); 
        const icone = type === 'success' ? '✅' : (type === 'warning' ? '⚠️' : '❌');
        toast.innerHTML = `<span>${icone}</span><p>${message}</p>`;
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
    if (btnTema) {
        const aplicarTema = (escuro) => {
            document.body.classList.toggle('modo-escuro', escuro);
            btnTema.textContent = escuro ? '☀️' : '🌙';
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

    // --- LÓGICA DO CARRINHO DE COMPRAS E INTEGRAÇÃO WHATSAPP ---
    const btnHeaderCart = document.getElementById('btn-header-cart');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartTotalSpan = document.querySelector('.cart-total span');
    const cartBadge = document.getElementById('cart-badge');
    const btnAddCartList = document.querySelectorAll('.btn-add-cart');
    const btnFinalizarPedido = document.getElementById('btn-finalizar-pedido');
    let cart = [];

    if(btnHeaderCart && cartSidebar && closeCartBtn) {
        btnHeaderCart.addEventListener('click', () => cartSidebar.classList.add('open'));
        closeCartBtn.addEventListener('click', () => cartSidebar.classList.remove('open'));
    }

    function updateCartUI() {
        if(!cartItemsList) return;
        cartItemsList.innerHTML = ''; 
        let total = 0; 
        cart.forEach((item, index) => {
            total += item.price; 
            const li = document.createElement('li');
            li.classList.add('cart-item');
            li.innerHTML = `
                <div class="cart-item-info"><h4>${item.name}</h4><p>R$ ${item.price.toFixed(2).replace('.', ',')}</p></div>
                <button class="btn-remove-item" data-index="${index}">&times;</button>
            `;
            cartItemsList.appendChild(li);
        });
        if(cartTotalSpan) cartTotalSpan.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        if(cartBadge) cartBadge.textContent = cart.length;

        document.querySelectorAll('.btn-remove-item').forEach(btn => {
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
                e.target.textContent = '✔'; e.target.style.background = '#2ecc71'; e.target.style.borderColor = '#2ecc71'; e.target.style.color = '#fff';
                setTimeout(() => { e.target.textContent = originalText; e.target.style.background = ''; e.target.style.borderColor = ''; e.target.style.color = ''; }, 1000);
            });
        });
    }

    if (btnFinalizarPedido) {
        btnFinalizarPedido.addEventListener('click', () => {
            if (cart.length === 0) return showToast('Seu carrinho está vazio!', 'error');
            const numeroWhatsApp = "5511970924433"; 
            let textoPedido = "Olá Cris Deguste! Gostaria de fazer o seguinte pedido:\n\n";
            let totalPedido = 0;
            cart.forEach((item) => { textoPedido += `- 1x ${item.name} (R$ ${item.price.toFixed(2).replace('.', ',')})\n`; totalPedido += item.price; });
            textoPedido += `\n*Total estimado: R$ ${totalPedido.toFixed(2).replace('.', ',')}*\n\nComo podemos prosseguir com o pagamento e a entrega?`;
            window.open(`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(textoPedido)}`, '_blank');
            showToast('Redirecionando para o WhatsApp...', 'success');
            cart = []; updateCartUI(); setTimeout(() => cartSidebar.classList.remove('open'), 1500);
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
            const nameElement = document.getElementById('rev-name');
            const textElement = document.getElementById('rev-text');
            
            const novaAvaliacao = {
                id: Date.now(),
                nome: nameElement ? nameElement.value.trim() : 'Anônimo',
                texto: textElement ? textElement.value.trim() : '',
                estrelas: ratingHidden ? parseInt(ratingHidden.value) : 5,
            };

            let avaliacoes = JSON.parse(localStorage.getItem('avaliacoes_salvas')) || [];
            avaliacoes.push(novaAvaliacao);
            localStorage.setItem('avaliacoes_salvas', JSON.stringify(avaliacoes));

            reviewForm.reset();
            currentRating = 5;
            if (ratingHidden) ratingHidden.value = 5;
            if (starInput) starInput.querySelectorAll('span').forEach(s => s.style.color = '#f4b63f');
            
            showToast('Sua avaliação foi publicada no mural!', 'success');
            
            loadReviews(); 
            currentReviewIndex = 0; 
            updateCarousel();
        });
    }

    // ==========================================================================
    // LÓGICA DE VALIDAÇÃO DO FORMULÁRIO DE CONTATO E ENVIO DE E-MAIL (API SEGURA)
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            const nome = document.getElementById('contato-nome').value.trim();
            const email = document.getElementById('contato-email').value.trim();
            const assuntoElement = document.getElementById('contato-assunto');
            const assunto = assuntoElement.options[assuntoElement.selectedIndex].text;
            const mensagem = document.getElementById('contato-mensagem').value.trim();

            if(!nome || !email || !assuntoElement.value || !mensagem) {
                return showToast('Preencha todos os campos obrigatórios.', 'warning');
            }
            
            if(!email.includes('@') || !email.includes('.')) {
                return showToast('O e-mail informado não parece ser válido.', 'error');
            }

            showToast('Enviando mensagem, aguarde...', 'warning');

            const web3formsAccessKey = "c7a8b00c-5f70-475c-bacd-7decf2ed036d"; 

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
                    access_key: web3formsAccessKey,
                    subject: `Cris Deguste: ${assunto}`,
                    from_name: nome,
                    replyto: email, 
                    message: corpoDoEmail
                })
            })
            .then(response => response.json())
            .then(data => {
                contactForm.reset(); 
                showToast(`Obrigado ${nome}! Sua mensagem foi enviada com sucesso.`, 'success');
            })
            .catch(error => {
                console.error("Erro no envio:", error);
                showToast('Houve um erro na comunicação com o servidor. Tente novamente mais tarde.', 'error');
            });
        });
    }
});