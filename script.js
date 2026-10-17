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

    // --- LÓGICA DO FILTRO DE CARDÁPIO (V0.3.1 - À PROVA DE FALHAS) ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuItems = document.querySelectorAll('.menu-item');

    if(filterButtons.length > 0 && menuItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault(); // Previne comportamentos inesperados do botão
                
                // Atualiza o botão ativo
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Captura a categoria escolhida ('all', 'tradicional' ou 'inclusivo')
                const targetCategory = button.getAttribute('data-filter');

                // Filtra os itens de forma segura
                menuItems.forEach(item => {
                    // Pega a categoria do item, ou 'none' caso o HTML esteja incompleto
                    const itemCategory = item.getAttribute('data-category') || 'none';
                    
                    if(targetCategory === 'all') {
                        // Se clicou em "Todos", mostra o item restaurando o flex do CSS original
                        item.style.display = 'flex';
                    } else if(itemCategory === targetCategory) {
                        // Se a categoria do item bater com a do botão, mostra o item
                        item.style.display = 'flex';
                    } else {
                        // Caso contrário, oculta
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
});