// ── FAQ Acordeão ──
document.querySelectorAll('.faq__pergunta').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.closest('.faq__item');
        const aberto = item.classList.contains('aberto');
        document.querySelectorAll('.faq__item').forEach(i => {
            i.classList.remove('aberto');
            i.querySelector('.faq__pergunta').setAttribute('aria-expanded','false');
        });
        if (!aberto) {
            item.classList.add('aberto');
            btn.setAttribute('aria-expanded','true');
        }
    });
});

// ── Animação de entrada ao fazer scroll ──
const observador = new IntersectionObserver(entradas => {
    entradas.forEach(e => { if(e.isIntersecting) { e.target.style.opacity='1'; e.target.style.transform='translateY(0)'; } });
}, { threshold:0.1 });

document.querySelectorAll('.cartao-incluido,.passo,.vantagem,.cartao-caso,.cartao-outro').forEach(el => {
    el.style.opacity='0'; el.style.transform='translateY(20px)';
    el.style.transition='opacity 0.5s ease, transform 0.5s ease';
    observador.observe(el);
});