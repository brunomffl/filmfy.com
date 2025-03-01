export function cardEffect(card, hover) {
    card.addEventListener('mouseover', () => {
        hover.style.opacity = 1;
    });

    card.addEventListener('mouseleave', () => {
        hover.style.opacity = 0;
    });
}
