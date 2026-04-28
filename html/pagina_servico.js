/**
 * COMUTEC — Script das Páginas de Serviços
 * Ficheiro: js/pagina_servico.js
 * Versão: 1.0
 */

document.addEventListener('DOMContentLoaded', function () {

    /* =====================================================
       0. PREFERÊNCIA DE MOVIMENTO REDUZIDO
    ===================================================== */
    const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


    /* =====================================================
       1. NAVEGAÇÃO — BOTÕES
    ===================================================== */
    const btnEntrar   = document.getElementById('btn-entrar');
    const btnRegistar = document.getElementById('btn-registar');

    if (btnEntrar)   btnEntrar.addEventListener('click',   () => { window.location.href = 'login.html'; });
    if (btnRegistar) btnRegistar.addEventListener('click', () => { window.location.href = 'cadastro.html'; });


    /* =====================================================
       2. CABEÇALHO COMPACTO + INDICADOR DE SCROLL
    ===================================================== */
    const cabecalho       = document.getElementById('cabecalho');
    const indicadorScroll = document.getElementById('indicador-scroll');
    const btnTopo         = document.getElementById('btn-topo');

    function actualizarScroll() {
        const scrollY     = window.scrollY;
        const alturaTotal = document.documentElement.scrollHeight - window.innerHeight;
        const percentagem = (scrollY / alturaTotal) * 100;

        if (scrollY > 50) cabecalho.classList.add('compacto');
        else              cabecalho.classList.remove('compacto');

        if (indicadorScroll) indicadorScroll.style.width = percentagem + '%';

        if (btnTopo) {
            if (scrollY > 400) btnTopo.classList.add('visivel');
            else               btnTopo.classList.remove('visivel');
        }
    }

    window.addEventListener('scroll', actualizarScroll, { passive: true });
    actualizarScroll();

    if (btnTopo) {
        btnTopo.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


    /* =====================================================
       3. MENU MOBILE
    ===================================================== */
    const btnMenuMobile = document.getElementById('btn-menu-mobile');
    if (btnMenuMobile) {
        btnMenuMobile.addEventListener('click', function () {
            const navegacao  = document.querySelector('.navegacao');
            const botoesAuth = document.querySelector('.botoes-auth');
            const estaAberto = navegacao.style.display === 'flex';

            if (estaAberto) {
                navegacao.style.display  = 'none';
                botoesAuth.style.display = 'none';
            } else {
                navegacao.style.display        = 'flex';
                navegacao.style.flexDirection  = 'column';
                navegacao.style.position       = 'absolute';
                navegacao.style.top            = '65px';
                navegacao.style.left           = '0';
                navegacao.style.right          = '0';
                navegacao.style.background     = 'var(--cor-fundo-cartao)';
                navegacao.style.padding        = '20px';
                navegacao.style.borderBottom   = '1px solid var(--cor-borda)';
                navegacao.style.gap            = '16px';
                navegacao.style.zIndex         = '999';

                botoesAuth.style.display        = 'flex';
                botoesAuth.style.position       = 'absolute';
                botoesAuth.style.top            = '210px';
                botoesAuth.style.left           = '0';
                botoesAuth.style.right          = '0';
                botoesAuth.style.padding        = '0 20px 20px';
                botoesAuth.style.background     = 'var(--cor-fundo-cartao)';
                botoesAuth.style.justifyContent = 'center';
                botoesAuth.style.zIndex         = '999';
            }
        });
    }


    /* =====================================================
       4. ANIMAÇÃO GERAL POR SCROLL
    ===================================================== */
    const elementosAnimar = document.querySelectorAll(
        '.animar, .caracteristica, .passo, .plano, .faq-item'
    );

    const observador = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
            if (entrada.isIntersecting) {
                const elemento = entrada.target;
                const atraso   = elemento.getAttribute('data-atraso') || 0;
                elemento.style.setProperty('--atraso', atraso);
                elemento.classList.add('visivel');
                observador.unobserve(elemento);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elementosAnimar.forEach(function (el, indice) {
        /* Aplicar atraso automático se não existir */
        if (!el.getAttribute('data-atraso') &&
            (el.classList.contains('caracteristica') ||
             el.classList.contains('passo') ||
             el.classList.contains('plano'))) {
            /* Calcula atraso com base na posição entre irmãos */
            const pais = el.parentElement;
            const irmaos = Array.from(pais.children).filter(c => c.classList.contains(el.classList[0]));
            const pos    = irmaos.indexOf(el);
            el.setAttribute('data-atraso', pos * 100);
        }

        const atraso = el.getAttribute('data-atraso') || 0;
        el.style.setProperty('--atraso', atraso);
        observador.observe(el);
    });


    /* =====================================================
       5. EFEITO MAGNÉTICO NOS BOTÕES
    ===================================================== */
    if (!movimentoReduzido) {
        document.querySelectorAll('.botao--magnetico').forEach(function (botao) {
            botao.addEventListener('mousemove', function (e) {
                const rect = botao.getBoundingClientRect();
                const x    = e.clientX - rect.left - rect.width  / 2;
                const y    = e.clientY - rect.top  - rect.height / 2;
                botao.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });
            botao.addEventListener('mouseleave', function () {
                botao.style.transform = '';
            });
        });
    }


    /* =====================================================
       6. SMOOTH SCROLL PARA ÂNCORAS INTERNAS
    ===================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(function (ligacao) {
        ligacao.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.length < 2) return;

            const alvo = document.querySelector(href);
            if (alvo) {
                e.preventDefault();
                const offset = 80;
                const posicao = alvo.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: posicao, behavior: 'smooth' });
            }
        });
    });


    /* =====================================================
       7. FAQ — FECHAR OUTROS AO ABRIR UM
    ===================================================== */
    document.querySelectorAll('.faq-item').forEach(function (item) {
        item.addEventListener('toggle', function () {
            if (item.open) {
                document.querySelectorAll('.faq-item').forEach(function (outro) {
                    if (outro !== item) outro.open = false;
                });
            }
        });
    });


    console.log('✅ Comutec — Página de serviço carregada com sucesso!');

});
