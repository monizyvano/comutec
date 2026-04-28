/**
 * COMUTEC — Script da Página Inicial
 * Ficheiro: js/pagina_inicial.js
 * Versão: 5.0 — Animações Melhoradas + Interactividade
 */

document.addEventListener('DOMContentLoaded', function () {

    /* =====================================================
       0. PREFERÊNCIA DE MOVIMENTO REDUZIDO
    ===================================================== */
    const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


    /* =====================================================
       1. NAVEGAÇÃO — BOTÕES
    ===================================================== */
    const btnEntrar      = document.getElementById('btn-entrar');
    const btnRegistar    = document.getElementById('btn-registar');
    const btnCtaRegistar = document.getElementById('btn-cta-registar');
    const btnComecar     = document.getElementById('btn-comecar');

    if (btnEntrar)      btnEntrar.addEventListener('click',      () => { window.location.href = 'html/login.html'; });
    if (btnRegistar)    btnRegistar.addEventListener('click',    () => { window.location.href = 'html/cadastro.html'; });
    if (btnCtaRegistar) btnCtaRegistar.addEventListener('click', () => { window.location.href = 'html/cadastro.html'; });
    if (btnComecar)     btnComecar.addEventListener('click',     () => { window.location.href = 'html/cadastro.html'; });


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

        /* Cabeçalho compacto */
        if (scrollY > 50) cabecalho.classList.add('compacto');
        else              cabecalho.classList.remove('compacto');

        /* Barra de progresso do scroll */
        if (indicadorScroll) indicadorScroll.style.width = percentagem + '%';

        /* Botão voltar ao topo */
        if (btnTopo) {
            if (scrollY > 400) btnTopo.classList.add('visivel');
            else               btnTopo.classList.remove('visivel');
        }

        /* Parallax dos círculos do herói */
        if (!movimentoReduzido) {
            document.querySelectorAll('[data-parallax]').forEach(function (el) {
                const velocidade = parseFloat(el.dataset.parallax);
                el.style.transform = `translateY(${scrollY * velocidade}px)`;
            });
        }
    }

    window.addEventListener('scroll', actualizarScroll, { passive: true });
    actualizarScroll();

    /* Voltar ao topo */
    if (btnTopo) {
        btnTopo.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


    /* =====================================================
       3. MENU MOBILE (HAMBÚRGUER)
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
                btnMenuMobile.classList.remove('activo');
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
                navegacao.style.animation      = 'entrar-cima 0.3s ease both';

                botoesAuth.style.display        = 'flex';
                botoesAuth.style.position       = 'absolute';
                botoesAuth.style.top            = '210px';
                botoesAuth.style.left           = '0';
                botoesAuth.style.right          = '0';
                botoesAuth.style.padding        = '0 20px 20px';
                botoesAuth.style.background     = 'var(--cor-fundo-cartao)';
                botoesAuth.style.justifyContent = 'center';
                botoesAuth.style.zIndex         = '999';
                btnMenuMobile.classList.add('activo');
            }
        });
    }


    /* =====================================================
       4. ANIMAÇÃO GERAL POR SCROLL (IntersectionObserver)
    ===================================================== */
    const elementosAnimar = document.querySelectorAll('.animar, .cartao-servico');

    const observador = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
            if (entrada.isIntersecting) {
                const elemento = entrada.target;
                const atraso   = elemento.getAttribute('data-atraso') || 0;
                elemento.style.setProperty('--atraso', atraso);

                /* Aplica a classe que activa a transição */
                if (elemento.classList.contains('cartao-servico')) {
                    elemento.classList.add('visivel');
                } else {
                    elemento.classList.add('visivel');
                }

                observador.unobserve(elemento);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    elementosAnimar.forEach(function (el) {
        const atraso = el.getAttribute('data-atraso') || 0;
        el.style.setProperty('--atraso', atraso);
        observador.observe(el);
    });


    /* =====================================================
       5. EFEITO BRILHO QUE SEGUE O RATO NOS CARTÕES
    ===================================================== */
    if (!movimentoReduzido) {
        document.querySelectorAll('.cartao-servico').forEach(function (cartao) {
            cartao.addEventListener('mousemove', function (e) {
                const rect = cartao.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                cartao.style.setProperty('--mouse-x', x + '%');
                cartao.style.setProperty('--mouse-y', y + '%');
            });
        });
    }


    /* =====================================================
       6. EFEITO MAGNÉTICO NOS BOTÕES
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
       7. CONTADOR ANIMADO DAS ESTATÍSTICAS
    ===================================================== */
    function animarContador(elemento, valorFinal, duracao) {
        let valorActual  = 0;
        const incremento = valorFinal / (duracao / 16);

        const temporizador = setInterval(function () {
            valorActual += incremento;
            if (valorActual >= valorFinal) {
                valorActual = valorFinal;
                clearInterval(temporizador);
            }
            elemento.textContent = Math.floor(valorActual);
        }, 16);
    }

    const numerosEstat = document.querySelectorAll('.stat-numero');
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
       8. PARTÍCULAS FLUTUANTES NO HERÓI
    ===================================================== */
    const contentorParticulas = document.getElementById('particulas');
    if (contentorParticulas && !movimentoReduzido) {
        const numParticulas = 20;
        for (let i = 0; i < numParticulas; i++) {
            const particula = document.createElement('span');
            particula.className = 'particula';
            particula.style.left            = Math.random() * 100 + '%';
            particula.style.animationDuration = (Math.random() * 8 + 10) + 's';
            particula.style.animationDelay    = (Math.random() * 10) + 's';
            particula.style.width             = particula.style.height = (Math.random() * 3 + 2) + 'px';
            particula.style.opacity           = (Math.random() * 0.4 + 0.2);
            contentorParticulas.appendChild(particula);
        }
    }


    /* =====================================================
       9. CARROSSEL DE ROLETA (AUTOMÁTICO + MANUAL)
    ===================================================== */
    const faixa          = document.getElementById('faixa-carrossel');
    const btnAnterior    = document.getElementById('btn-anterior');
    const btnProximo     = document.getElementById('btn-proximo');
    const pontos         = document.querySelectorAll('.carrossel__ponto');
    const barraCarrossel = document.getElementById('barra-carrossel');
    const slides         = document.querySelectorAll('.carrossel__slide');

    if (!faixa) return;

    const totalSlides      = pontos.length;
    let   slideActual      = 0;
    let   temporizadorAuto = null;
    const DURACAO_SLIDE    = 5000;

    function irParaSlide(indice) {
        if (indice < 0)            indice = totalSlides - 1;
        if (indice >= totalSlides) indice = 0;

        slideActual = indice;

        faixa.style.transform = `translateX(-${slideActual * 100}%)`;

        pontos.forEach(function (ponto, i) {
            ponto.classList.toggle('activo', i === slideActual);
        });

        /* Marcar slide activo para animar o conteúdo */
        slides.forEach(function (slide, i) {
            slide.classList.toggle('activo', i === slideActual);
        });

        reiniciarBarra();
    }

    function proximoSlide()  { irParaSlide(slideActual + 1); }
    function slideAnterior() { irParaSlide(slideActual - 1); }

    function reiniciarBarra() {
        if (!barraCarrossel) return;
        barraCarrossel.style.transition = 'none';
        barraCarrossel.style.width      = '0%';

        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                barraCarrossel.style.transition = `width ${DURACAO_SLIDE}ms linear`;
                barraCarrossel.style.width      = '100%';
            });
        });
    }

    function iniciarAuto() {
        pararAuto();
        temporizadorAuto = setInterval(proximoSlide, DURACAO_SLIDE);
        reiniciarBarra();
    }

    function pararAuto() {
        if (temporizadorAuto) {
            clearInterval(temporizadorAuto);
            temporizadorAuto = null;
        }
        if (barraCarrossel) {
            const larguraActual = barraCarrossel.offsetWidth / barraCarrossel.parentElement.offsetWidth * 100;
            barraCarrossel.style.transition = 'none';
            barraCarrossel.style.width = larguraActual + '%';
        }
    }

    if (btnAnterior) {
        btnAnterior.addEventListener('click', function () {
            slideAnterior();
            pararAuto();
            setTimeout(iniciarAuto, 500);
        });
    }

    if (btnProximo) {
        btnProximo.addEventListener('click', function () {
            proximoSlide();
            pararAuto();
            setTimeout(iniciarAuto, 500);
        });
    }

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
        if (Math.abs(diferenca) > 50) {
            if (diferenca > 0) proximoSlide();
            else               slideAnterior();
        }
        setTimeout(iniciarAuto, 500);
    }, { passive: true });

    /* Pausar o auto quando o rato está sobre o carrossel */
    const carrosselElem = document.getElementById('carrossel-principal');
    if (carrosselElem) {
        carrosselElem.addEventListener('mouseenter', pararAuto);
        carrosselElem.addEventListener('mouseleave', iniciarAuto);
    }

    /* Navegação por teclado */
    document.addEventListener('keydown', function (e) {
        const rect = carrosselElem.getBoundingClientRect();
        const visivel = rect.top < window.innerHeight && rect.bottom > 0;
        if (!visivel) return;

        if (e.key === 'ArrowLeft')  { slideAnterior(); pararAuto(); setTimeout(iniciarAuto, 500); }
        if (e.key === 'ArrowRight') { proximoSlide();  pararAuto(); setTimeout(iniciarAuto, 500); }
    });

    irParaSlide(0);
    iniciarAuto();


    /* =====================================================
       10. SMOOTH SCROLL PARA ÂNCORAS INTERNAS
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


    console.log('✅ Comutec — Página inicial carregada com sucesso! (v5.0)');

});
