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
            // Fecha os outros (Opcional, remove se quiser abrir vários ao mesmo tempo)
            faqQuestions.forEach(item => {
                if (item !== btn) {
                    item.classList.remove('active');
                    item.nextElementSibling.style.maxHeight = null;
                }
            });

            // Abre o clicado
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
    let currentRating = 5; // Padrão 5 estrelas

    if(starInput) {
        const stars = starInput.querySelectorAll('span');
        
        // Pinta estrelas padrão
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

            // Pega os dados do form
            const name = document.getElementById('rev-name').value;
            const text = document.getElementById('rev-text').value;
            const rating = ratingHidden.value;
            const fileInput = document.getElementById('rev-file');
            
            // Monta as estrelas
            let starsHTML = '';
            for(let i=1; i<=5; i++) {
                starsHTML += i <= rating ? '★' : '☆';
            }

            // Prepara a imagem/vídeo se houver anexo
            let mediaHTML = '';
            if (fileInput.files && fileInput.files[0]) {
                const file = fileInput.files[0];
                const fileURL = URL.createObjectURL(file);
                
                // Checa se é imagem ou vídeo
                if(file.type.startsWith('image/')) {
                    mediaHTML = `<img src="${fileURL}" class="review-media" alt="Foto da avaliação">`;
                } else if(file.type.startsWith('video/')) {
                    mediaHTML = `<video src="${fileURL}" class="review-media" controls></video>`;
                }
            }

            // Cria o elemento do comentário
            const reviewCard = document.createElement('div');
            reviewCard.classList.add('review-card');
            reviewCard.innerHTML = `
                <div class="review-stars">${starsHTML}</div>
                <p class="review-text">"${text}"</p>
                ${mediaHTML}
                <p class="review-author">- ${name}</p>
            `;

            // Adiciona no topo da lista
            reviewsList.prepend(reviewCard);

            // Limpa o formulário e reseta estrelas
            reviewForm.reset();
            currentRating = 5;
            ratingHidden.value = 5;
            if(starInput) {
                starInput.querySelectorAll('span').forEach(s => s.style.color = '#f4b63f');
            }
            
            alert('Sua avaliação foi publicada com sucesso! Obrigado pelo carinho.');
        });
    }
});