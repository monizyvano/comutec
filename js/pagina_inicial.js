/**
 * COMUTEC — Script Principal da Página Inicial
 * Ficheiro: pagina_inicial.js
 * 
 * O QUE ESTE FICHEIRO FAZ:
 * 1. Navegação para login e cadastro ao clicar nos botões
 * 2. Efeito de compactação do cabeçalho ao fazer scroll
 * 3. Animação dos cartões ao entrar no ecrã (IntersectionObserver)
 * 4. Contador animado das estatísticas
 * 5. Menu mobile (hambúrguer)
 */


/* =====================================================
   CONFIGURAÇÃO INICIAL
   Espera o HTML estar completamente carregado
===================================================== */
document.addEventListener('DOMContentLoaded', function () {

    /* --- Seleccionar os elementos do HTML --- */
    const cabecalho        = document.getElementById('cabecalho');
    const btnEntrar        = document.getElementById('btn-entrar');
    const btnRegistar      = document.getElementById('btn-registar');
    const btnCtaRegistar   = document.getElementById('btn-cta-registar');
    const btnComecar       = document.getElementById('btn-comecar');
    const btnMenuMobile    = document.getElementById('btn-menu-mobile');
    const cartoes          = document.querySelectorAll('.cartao-servico');
    const numerosEstat     = document.querySelectorAll('.stat-numero');


    /* =====================================================
       1. NAVEGAÇÃO — Redireccionamento de botões
    ===================================================== */
    
    /* Botão "Entrar" → vai para a página de login */
    if (btnEntrar) {
        btnEntrar.addEventListener('click', function () {
            window.location.href = 'html/login.html';
        });
    }

    /* Botão "Registar" no cabeçalho → vai para cadastro */
    if (btnRegistar) {
        btnRegistar.addEventListener('click', function () {
            window.location.href = 'html/cadastro.html';
        });
    }

    /* Botão "Registar Empresa" na secção CTA → vai para cadastro */
    if (btnCtaRegistar) {
        btnCtaRegistar.addEventListener('click', function () {
            window.location.href = 'html/cadastro.html';
        });
    }

    /* Botão "Começar Agora" no herói → vai para cadastro */
    if (btnComecar) {
        btnComecar.addEventListener('click', function () {
            window.location.href = 'html/cadastro.html';
        });
    }


    /* =====================================================
       2. CABEÇALHO — Compactar ao fazer scroll
       Quando o utilizador desce a página, o cabeçalho fica
       mais pequeno para dar mais espaço ao conteúdo
    ===================================================== */
    window.addEventListener('scroll', function () {
        /* Se desceu mais de 50px, adiciona a classe 'compacto' */
        if (window.scrollY > 50) {
            cabecalho.classList.add('compacto');
        } else {
            cabecalho.classList.remove('compacto');
        }
    });


    /* =====================================================
       3. MENU MOBILE — Hambúrguer
       Mostra e esconde a navegação em dispositivos móveis
    ===================================================== */
    if (btnMenuMobile) {
        btnMenuMobile.addEventListener('click', function () {
            const navegacao   = document.querySelector('.navegacao');
            const botoesAuth  = document.querySelector('.botoes-auth');
            const estaAberto  = navegacao.style.display === 'flex';

            if (estaAberto) {
                /* Fecha o menu */
                navegacao.style.display  = 'none';
                botoesAuth.style.display = 'none';
            } else {
                /* Abre o menu em coluna */
                navegacao.style.display        = 'flex';
                navegacao.style.flexDirection  = 'column';
                navegacao.style.position       = 'absolute';
                navegacao.style.top            = '70px';
                navegacao.style.left           = '0';
                navegacao.style.right          = '0';
                navegacao.style.background     = 'var(--cor-fundo-cartao)';
                navegacao.style.padding        = '20px';
                navegacao.style.borderBottom   = '1px solid var(--cor-borda)';

                botoesAuth.style.display       = 'flex';
                botoesAuth.style.position      = 'absolute';
                botoesAuth.style.top           = '200px';
                botoesAuth.style.left          = '0';
                botoesAuth.style.right         = '0';
                botoesAuth.style.padding       = '0 20px 20px';
                botoesAuth.style.background    = 'var(--cor-fundo-cartao)';
                botoesAuth.style.justifyContent = 'center';
            }
        });
    }


    /* =====================================================
       4. ANIMAÇÃO DOS CARTÕES — IntersectionObserver
       Os cartões só animam quando ficam visíveis no ecrã.
       Isto é mais eficiente do que animar tudo de uma vez.
    ===================================================== */
    
    /* Configurações do observador */
    const opcoes = {
        threshold: 0.15,       /* Activa quando 15% do elemento está visível */
        rootMargin: '0px 0px -50px 0px' /* Margem extra em baixo */
    };

    /* Cria o observador */
    const observador = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
            if (entrada.isIntersecting) {
                /* O elemento ficou visível — aplica o atraso e mostra */
                const cartao  = entrada.target;
                const atraso  = cartao.getAttribute('data-atraso') || 0;
                cartao.style.setProperty('--atraso', atraso);
                cartao.classList.add('visivel');

                /* Para de observar depois de animar (optimização) */
                observador.unobserve(cartao);
            }
        });
    }, opcoes);

    /* Começa a observar cada cartão */
    cartoes.forEach(function (cartao) {
        observador.observe(cartao);
    });


    /* =====================================================
       5. CONTADOR ANIMADO DAS ESTATÍSTICAS
       Os números contam do 0 até ao valor final
       quando a secção fica visível no ecrã
    ===================================================== */

    /* Função que anima um número de 0 até 'valorFinal' */
    function animarContador(elemento, valorFinal, duracao) {
        let valorActual = 0;
        const incremento  = valorFinal / (duracao / 16); /* ~60fps */

        const temporizador = setInterval(function () {
            valorActual += incremento;

            if (valorActual >= valorFinal) {
                valorActual = valorFinal;
                clearInterval(temporizador); /* Para quando chega ao fim */
            }

            /* Actualiza o texto do elemento */
            elemento.textContent = Math.floor(valorActual);
        }, 16);
    }

    /* Observador específico para os números das estatísticas */
    const observadorEstat = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
            if (entrada.isIntersecting) {
                const numero     = entrada.target;
                const valorFinal = parseInt(numero.getAttribute('data-valor'));
                
                /* Anima durante 1.5 segundos */
                animarContador(numero, valorFinal, 1500);

                /* Para de observar para não repetir a animação */
                observadorEstat.unobserve(numero);
            }
        });
    }, { threshold: 0.5 });

    /* Começa a observar cada número */
    numerosEstat.forEach(function (numero) {
        observadorEstat.observe(numero);
    });


    /* =====================================================
       6. ATRASO DINÂMICO DOS CARTÕES
       Define a variável CSS --atraso para cada cartão
       com base no atributo data-atraso
    ===================================================== */
    cartoes.forEach(function (cartao) {
        const atraso = cartao.getAttribute('data-atraso') || 0;
        cartao.style.setProperty('--atraso', atraso);
    });


    /* =====================================================
       FIM DO SCRIPT
    ===================================================== */
    console.log('✅ Comutec — Página carregada com sucesso!');

}); // Fim do DOMContentLoaded
