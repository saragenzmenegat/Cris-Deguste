document.addEventListener('DOMContentLoaded', () => {
    // Inicializa a lógica de scroll do Carrossel de Destaques
    const carousel = document.getElementById('carousel');
    const prevBtn = document.querySelector('.nav-btn.prev');
    const nextBtn = document.querySelector('.nav-btn.next');

    if (carousel && prevBtn && nextBtn) {
        const scrollAmount = 300; 

        nextBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
    }
});