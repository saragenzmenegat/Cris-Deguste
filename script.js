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

    if(reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('rev-name').value;
            const text = document.getElementById('rev-text').value;
            const rating = ratingHidden.value;
            const fileInput = document.getElementById('rev-file');
            
            let starsHTML = '';
            for(let i=1; i<=5; i++) {
                starsHTML += i <= rating ? '★' : '☆';
            }

            let mediaHTML = '';
            if (fileInput.files && fileInput.files[0]) {
                const file = fileInput.files[0];
                const fileURL = URL.createObjectURL(file);
                
                if(file.type.startsWith('image/')) {
                    mediaHTML = `<img src="${fileURL}" class="review-media" alt="Foto da avaliação">`;
                } else if(file.type.startsWith('video/')) {
                    mediaHTML = `<video src="${fileURL}" class="review-media" controls></video>`;
                }
            }

            const reviewCard = document.createElement('div');
            reviewCard.classList.add('review-card');
            reviewCard.innerHTML = `
                <div class="review-stars">${starsHTML}</div>
                <p class="review-text">"${text}"</p>
                ${mediaHTML}
                <p class="review-author">- ${name}</p>
            `;

            reviewsList.prepend(reviewCard);

            reviewForm.reset();
            currentRating = 5;
            ratingHidden.value = 5;
            if(starInput) {
                starInput.querySelectorAll('span').forEach(s => s.style.color = '#f4b63f');
            }
            
            alert('Sua avaliação foi publicada com sucesso! Obrigado pelo carinho.');
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

    // --- LÓGICA DO FILTRO DE CARDÁPIO (V0.3.1) ---
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

    // --- LÓGICA DO CARRINHO DE COMPRAS (V0.4.0) ---
    const btnFloatingCart = document.getElementById('btn-floating-cart');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartTotalSpan = document.querySelector('.cart-total span');
    const cartBadge = document.getElementById('cart-badge');
    const btnAddCartList = document.querySelectorAll('.btn-add-cart');
    const btnFinalizarPedido = document.getElementById('btn-finalizar-pedido');

    // Array que armazenará os produtos selecionados
    let cart = [];

    // Função para abrir o carrinho
    if(btnFloatingCart && cartSidebar && closeCartBtn) {
        btnFloatingCart.addEventListener('click', () => {
            cartSidebar.classList.add('open');
        });
        
        closeCartBtn.addEventListener('click', () => {
            cartSidebar.classList.remove('open');
        });
    }

    // Função que redesenha a interface do carrinho sempre que algo muda
    function updateCartUI() {
        cartItemsList.innerHTML = ''; // Limpa a lista na tela
        let total = 0; // Zera a contagem de preço
        
        cart.forEach((item, index) => {
            total += item.price; // Soma os preços
            
            // Cria o elemento da lista
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

        // Atualiza os valores visuais do Total e da "Bolinha vermelha" de notificação
        cartTotalSpan.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        cartBadge.textContent = cart.length;

        // Adiciona funcionalidade de deletar nos botões 'x' criados acima
        const removeBtns = document.querySelectorAll('.btn-remove-item');
        removeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const indexToRemove = e.target.getAttribute('data-index');
                cart.splice(indexToRemove, 1); // Remove 1 item do array baseado no índice
                updateCartUI(); // Atualiza a interface
            });
        });
    }

    // Adiciona o evento de "Colocar no Carrinho" em todos os botões do cardápio
    if(btnAddCartList.length > 0) {
        btnAddCartList.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const name = e.target.getAttribute('data-name');
                const price = parseFloat(e.target.getAttribute('data-price'));
                
                // Salva no array
                cart.push({ name, price });
                updateCartUI();
                
                // Feedback visual sutil (animação no botão)
                const originalText = e.target.textContent;
                e.target.textContent = 'Adicionado ✔';
                e.target.style.background = '#2ecc71';
                e.target.style.color = '#fff';
                e.target.style.borderColor = '#2ecc71';
                
                // Volta ao normal após 1 segundo
                setTimeout(() => {
                    e.target.textContent = originalText;
                    e.target.style.background = '';
                    e.target.style.color = '';
                    e.target.style.borderColor = '';
                }, 1000);
            });
        });
    }

    // Ação do botão Finalizar
    if (btnFinalizarPedido) {
        btnFinalizarPedido.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Seu carrinho está vazio. Adicione alguns doces primeiro!');
            } else {
                alert('Pedido finalizado com sucesso! (Em breve redirecionamento para o WhatsApp).');
                cart = []; // Esvazia o carrinho
                updateCartUI();
                cartSidebar.classList.remove('open');
            }
        });
    }
});