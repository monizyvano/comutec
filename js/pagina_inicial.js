/**
 * COMUTEC — Script da Página Inicial
 * Ficheiro: js/pagina_inicial.js
 * Versão: 4.0 — Carrossel + Botões + Navegação
 */

document.addEventListener('DOMContentLoaded', function () {

    /* ── Elementos de navegação ── */
    const cabecalho      = document.getElementById('cabecalho');
    const btnEntrar      = document.getElementById('btn-entrar');
    const btnRegistar    = document.getElementById('btn-registar');
    const btnCtaRegistar = document.getElementById('btn-cta-registar');
    const btnComecar     = document.getElementById('btn-comecar');
    const btnMenuMobile  = document.getElementById('btn-menu-mobile');
    const cartoes        = document.querySelectorAll('.cartao-servico');
    const numerosEstat   = document.querySelectorAll('.stat-numero');


    /* =====================================================
       1. NAVEGAÇÃO — BOTÕES
    ===================================================== */
    if (btnEntrar)      btnEntrar.addEventListener('click',      () => { window.location.href = 'html/login.html'; });
    if (btnRegistar)    btnRegistar.addEventListener('click',    () => { window.location.href = 'html/cadastro.html'; });
    if (btnCtaRegistar) btnCtaRegistar.addEventListener('click', () => { window.location.href = 'html/cadastro.html'; });
    if (btnComecar)     btnComecar.addEventListener('click',     () => { window.location.href = 'html/cadastro.html'; });


    /* =====================================================
       2. CABEÇALHO COMPACTO AO FAZER SCROLL
    ===================================================== */
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            cabecalho.classList.add('compacto');
        } else {
            cabecalho.classList.remove('compacto');
        }
    });


    /* =====================================================
       3. MENU MOBILE (HAMBÚRGUER)
    ===================================================== */
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
       4. ANIMAÇÃO DOS CARTÕES (IntersectionObserver)
    ===================================================== */
    const observador = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
            if (entrada.isIntersecting) {
                const cartao = entrada.target;
                const atraso = cartao.getAttribute('data-atraso') || 0;
                cartao.style.setProperty('--atraso', atraso);
                cartao.classList.add('visivel');
                observador.unobserve(cartao);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    cartoes.forEach(function (cartao) {
        const atraso = cartao.getAttribute('data-atraso') || 0;
        cartao.style.setProperty('--atraso', atraso);
        observador.observe(cartao);
    });


    /* =====================================================
       5. CONTADOR ANIMADO DAS ESTATÍSTICAS
    ===================================================== */
    function animarContador(elemento, valorFinal, duracao) {
        let valorActual   = 0;
        const incremento  = valorFinal / (duracao / 16);

        const temporizador = setInterval(function () {
            valorActual += incremento;
            if (valorActual >= valorFinal) {
                valorActual = valorFinal;
                clearInterval(temporizador);
            }
            elemento.textContent = Math.floor(valorActual);
        }, 16);
    }

    const observadorEstat = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
            if (entrada.isIntersecting) {
                const numero     = entrada.target;
                const valorFinal = parseInt(numero.getAttribute('data-valor'));
                animarContador(numero, valorFinal, 1500);
                observadorEstat.unobserve(numero);
            }
        });
    }, { threshold: 0.5 });

    numerosEstat.forEach(function (numero) {
        observadorEstat.observe(numero);
    });


    /* =====================================================
       6. CARROSSEL DE ROLETA (AUTOMÁTICO + MANUAL)
    ===================================================== */
    const faixa          = document.getElementById('faixa-carrossel');
    const btnAnterior    = document.getElementById('btn-anterior');
    const btnProximo     = document.getElementById('btn-proximo');
    const pontos         = document.querySelectorAll('.carrossel__ponto');
    const barraCarrossel = document.getElementById('barra-carrossel');

    if (!faixa) return; /* Sai se não houver carrossel */

    const totalSlides       = pontos.length;  /* Número de slides */
    let   slideActual        = 0;              /* Slide actualmente visível */
    let   temporizadorAuto   = null;           /* Intervalo do avanço automático */
    let   animacaoProgresso  = null;           /* Animação da barra de progresso */
    const DURACAO_SLIDE      = 5000;           /* 5 segundos por slide */

    /* Ir para um slide específico */
    function irParaSlide(indice) {
        /* Garantir que o índice está dentro dos limites */
        if (indice < 0)           indice = totalSlides - 1;
        if (indice >= totalSlides) indice = 0;

        slideActual = indice;

        /* Mover a faixa de slides com transform */
        faixa.style.transform = `translateX(-${slideActual * 100}%)`;

        /* Actualizar os pontos de navegação */
        pontos.forEach(function (ponto, i) {
            ponto.classList.toggle('activo', i === slideActual);
        });

        /* Reiniciar a barra de progresso */
        reiniciarBarra();
    }

    /* Avançar para o próximo slide */
    function proximoSlide() {
        irParaSlide(slideActual + 1);
    }

    /* Recuar para o slide anterior */
    function slideAnterior() {
        irParaSlide(slideActual - 1);
    }

    /* Animar a barra de progresso de 0% → 100% */
    function reiniciarBarra() {
        if (!barraCarrossel) return;

        /* Parar animação anterior */
        barraCarrossel.style.transition = 'none';
        barraCarrossel.style.width      = '0%';

        /* Pequeno delay para o browser aplicar o reset */
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                barraCarrossel.style.transition = `width ${DURACAO_SLIDE}ms linear`;
                barraCarrossel.style.width      = '100%';
            });
        });
    }

    /* Iniciar o avanço automático */
    function iniciarAuto() {
        pararAuto();
        temporizadorAuto = setInterval(proximoSlide, DURACAO_SLIDE);
        reiniciarBarra();
    }

    /* Parar o avanço automático */
    function pararAuto() {
        if (temporizadorAuto) {
            clearInterval(temporizadorAuto);
            temporizadorAuto = null;
        }
        /* Parar a barra */
        if (barraCarrossel) {
            const larguraActual = barraCarrossel.offsetWidth / barraCarrossel.parentElement.offsetWidth * 100;
            barraCarrossel.style.transition = 'none';
            barraCarrossel.style.width = larguraActual + '%';
        }
    }

    /* Clicar nos botões de navegação */
    if (btnAnterior) {
        btnAnterior.addEventListener('click', function () {
            slideAnterior();
            pararAuto();
            setTimeout(iniciarAuto, 500); /* Retoma o auto depois de 0.5s */
        });
    }

    if (btnProximo) {
        btnProximo.addEventListener('click', function () {
            proximoSlide();
            pararAuto();
            setTimeout(iniciarAuto, 500);
        });
    }

    /* Clicar nos pontos */
    pontos.forEach(function (ponto) {
        ponto.addEventListener('click', function () {
            const indice = parseInt(ponto.getAttribute('data-indice'));
            irParaSlide(indice);
            pararAuto();
            setTimeout(iniciarAuto, 500);
        });
    });

    /* Suporte a swipe/arrasto no telemóvel */
    let inicioToque = 0;

    faixa.addEventListener('touchstart', function (e) {
        inicioToque = e.touches[0].clientX;
        pararAuto();
    }, { passive: true });

    faixa.addEventListener('touchend', function (e) {
        const diferenca = inicioToque - e.changedTouches[0].clientX;
        if (Math.abs(diferenca) > 50) { /* Swipe mínimo de 50px */
            if (diferenca > 0) {
                proximoSlide();  /* Swipe para a esquerda → próximo */
            } else {
                slideAnterior(); /* Swipe para a direita → anterior */
            }
        }
        setTimeout(iniciarAuto, 500);
    }, { passive: true });

    /* Pausar o auto quando o rato está sobre o carrossel */
    const carrosselElem = document.getElementById('carrossel-principal');
    if (carrosselElem) {
        carrosselElem.addEventListener('mouseenter', pararAuto);
        carrosselElem.addEventListener('mouseleave', iniciarAuto);
    }

    /* Iniciar o carrossel automaticamente */
    irParaSlide(0);
    iniciarAuto();


    /* =====================================================
       FIM DO SCRIPT
    ===================================================== */
    console.log('✅ Comutec — Página inicial carregada com sucesso!');

}); /* Fim do DOMContentLoaded */