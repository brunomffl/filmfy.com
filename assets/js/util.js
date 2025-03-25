export function cardEffect(card, hover) {
    card.addEventListener('mouseover', () => {
        hover.style.opacity = 1;
    });

    card.addEventListener('mouseleave', () => {
        hover.style.opacity = 0;
    });
};

export function mobileMenu(){
    let phoneMenu = document.querySelector('.phone-menu');
    let phoneLinks = document.querySelector('.phone-links');
    phoneMenu.addEventListener('click', () => {
        phoneLinks.classList.toggle('visivel');
        phoneMenu.classList.toggle('menu-animation');
    });
}
