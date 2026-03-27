/**
 * COMUTEC — Script da Página de Recuperação de Senha
 * Ficheiro: js/recuperar.js
 *
 * FLUXO COMPLETO:
 *  Etapa 1 → Utilizador insere o e-mail
 *  Etapa 2 → Utilizador insere o código de 6 dígitos + temporizador
 *  Etapa 3 → Utilizador define a nova palavra-passe + requisitos visuais
 *  Sucesso → Mensagem de confirmação + redireccionamento automático
 */

document.addEventListener('DOMContentLoaded', function () {

    /* =====================================================
       SELECCIONAR ELEMENTOS DO HTML
    ===================================================== */

    /* --- Etapa 1 --- */
    const etapa1           = document.getElementById('etapa-1');
    const formularioEmail  = document.getElementById('formulario-email');
    const campoEmail       = document.getElementById('email');
    const erroEmail        = document.getElementById('erro-email');
    const btnEnviarEmail   = document.getElementById('btn-enviar-email');

    /* --- Etapa 2 --- */
    const etapa2           = document.getElementById('etapa-2');
    const camposCodigo     = document.querySelectorAll('.campo-codigo');
    const erroCodigo       = document.getElementById('erro-codigo');
    const emailDestino     = document.getElementById('email-destino');
    const btnVerificar     = document.getElementById('btn-verificar-codigo');
    const blocoTemporizador = document.getElementById('bloco-temporizador');
    const contadorElem     = document.getElementById('contador');
    const btnReenviar      = document.getElementById('btn-reenviar');

    /* --- Etapa 3 --- */
    const etapa3           = document.getElementById('etapa-3');
    const formularioSenha  = document.getElementById('formulario-nova-senha');
    const campoNovaSenha   = document.getElementById('nova-senha');
    const campoConfirmar   = document.getElementById('confirmar-senha');
    const btnVerNova       = document.getElementById('btn-ver-nova');
    const btnVerConfirmar  = document.getElementById('btn-ver-confirmar');
    const barraForca       = document.getElementById('barra-forca');
    const textoForca       = document.getElementById('texto-forca');
    const erroNovaSenha    = document.getElementById('erro-nova-senha');
    const erroConfirmar    = document.getElementById('erro-confirmar');
    const btnGuardar       = document.getElementById('btn-guardar-senha');

    /* --- Sucesso --- */
    const etapaSucesso     = document.getElementById('etapa-sucesso');
    const contadorRedir    = document.getElementById('contador-redir');

    /* --- Progresso --- */
    const passo1           = document.getElementById('passo-1');
    const passo2           = document.getElementById('passo-2');
    const passo3           = document.getElementById('passo-3');
    const linha12          = document.getElementById('linha-1-2');
    const linha23          = document.getElementById('linha-2-3');
    const indicador        = document.getElementById('indicador-progresso');

    /* Variável para guardar o temporizador activo */
    let temporizadorReenvio = null;


    /* =====================================================
       FUNÇÕES AUXILIARES
    ===================================================== */

    /* Validar formato de e-mail */
    function emailValido(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    /* Mostrar mensagem de erro num campo */
    function mostrarErro(campo, mensagemElem, mensagem) {
        if (campo) campo.classList.add('com-erro');
        if (mensagemElem) mensagemElem.textContent = mensagem;
    }

    /* Limpar erro de um campo */
    function limparErro(campo, mensagemElem) {
        if (campo) campo.classList.remove('com-erro');
        if (mensagemElem) mensagemElem.textContent = '';
    }

    /* Mascarar o e-mail para mostrar ex: ex***@comutec.ao */
    function mascararEmail(email) {
        const [nome, dominio] = email.split('@');
        const mascara = nome.substring(0, 2) + '***';
        return mascara + '@' + dominio;
    }

    /* Avançar o indicador de progresso */
    function avancarProgresso(etapaActual) {
        /* Etapa 1 → 2 */
        if (etapaActual === 2) {
            passo1.classList.remove('activo');
            passo1.classList.add('completo');
            passo1.querySelector('.progresso__circulo').textContent = '✓';
            linha12.classList.add('activa');
            passo2.classList.add('activo');
        }
        /* Etapa 2 → 3 */
        if (etapaActual === 3) {
            passo2.classList.remove('activo');
            passo2.classList.add('completo');
            passo2.querySelector('.progresso__circulo').textContent = '✓';
            linha23.classList.add('activa');
            passo3.classList.add('activo');
        }
        /* Sucesso → esconde o indicador */
        if (etapaActual === 4) {
            passo3.classList.remove('activo');
            passo3.classList.add('completo');
            passo3.querySelector('.progresso__circulo').textContent = '✓';
            indicador.style.display = 'none';
        }
    }

    /* Mostrar uma etapa e esconder as outras */
    function mostrarEtapa(numero) {
        [etapa1, etapa2, etapa3, etapaSucesso].forEach(function (e) {
            if (e) e.classList.add('escondida');
        });
        const etapas = { 1: etapa1, 2: etapa2, 3: etapa3, 4: etapaSucesso };
        if (etapas[numero]) etapas[numero].classList.remove('escondida');
    }


    /* =====================================================
       ETAPA 1 — SUBMISSÃO DO E-MAIL
    ===================================================== */
    formularioEmail.addEventListener('submit', function (evento) {
        evento.preventDefault();
        limparErro(campoEmail, erroEmail);

        const email = campoEmail.value.trim();

        /* Validar e-mail */
        if (email === '') {
            mostrarErro(campoEmail, erroEmail, 'Por favor, insira o seu e-mail.');
            return;
        }
        if (!emailValido(email)) {
            mostrarErro(campoEmail, erroEmail, 'Formato de e-mail inválido.');
            return;
        }

        /* Estado de carregamento no botão */
        btnEnviarEmail.classList.add('carregando');
        btnEnviarEmail.querySelector('span').textContent = 'A enviar...';

        /*
         * ⚠️ MODO OFFLINE — Simulação de envio de e-mail
         * Em produção, substituir por:
         * fetch('/api/recuperar', { method:'POST', body: JSON.stringify({ email }) })
         */
        setTimeout(function () {
            btnEnviarEmail.classList.remove('carregando');
            btnEnviarEmail.querySelector('span').textContent = 'Enviar Código';

            /* Mostrar o e-mail mascarado na etapa 2 */
            emailDestino.textContent = mascararEmail(email);

            /* Avançar para a etapa 2 */
            avancarProgresso(2);
            mostrarEtapa(2);

            /* Iniciar o temporizador de reenvio */
            iniciarTemporizador(120); /* 2 minutos = 120 segundos */

            /* Focar no primeiro campo de código */
            camposCodigo[0].focus();

        }, 1500);
    });

    /* Limpar erro ao escrever no e-mail */
    campoEmail.addEventListener('input', function () {
        limparErro(campoEmail, erroEmail);
    });


    /* =====================================================
       ETAPA 2 — CAMPOS DE CÓDIGO (comportamento especial)
    ===================================================== */

    /* Para cada campo de código individual */
    camposCodigo.forEach(function (campo, indice) {

        /* Só aceitar dígitos */
        campo.addEventListener('keypress', function (e) {
            if (!/[0-9]/.test(e.key)) e.preventDefault();
        });

        /* Ao escrever: avança automaticamente para o próximo campo */
        campo.addEventListener('input', function () {
            /* Limpar erros */
            camposCodigo.forEach(function (c) { c.classList.remove('com-erro'); });
            erroCodigo.textContent = '';

            /* Marcar como preenchido se tiver valor */
            if (campo.value) {
                campo.classList.add('preenchida');
                campo.value = campo.value.replace(/[^0-9]/, ''); /* Só números */
                /* Avançar para o próximo campo */
                if (indice < camposCodigo.length - 1) {
                    camposCodigo[indice + 1].focus();
                }
            } else {
                campo.classList.remove('preenchida');
            }
        });

        /* Tecla Backspace: recua para o campo anterior */
        campo.addEventListener('keydown', function (e) {
            if (e.key === 'Backspace' && !campo.value && indice > 0) {
                camposCodigo[indice - 1].focus();
                camposCodigo[indice - 1].value = '';
                camposCodigo[indice - 1].classList.remove('preenchida');
            }
        });

        /* Colar (Ctrl+V): distribuir os dígitos pelos campos */
        campo.addEventListener('paste', function (e) {
            e.preventDefault();
            const texto = e.clipboardData.getData('text').replace(/[^0-9]/g, '');
            if (texto.length === 6) {
                camposCodigo.forEach(function (c, i) {
                    c.value = texto[i] || '';
                    if (c.value) c.classList.add('preenchida');
                });
                camposCodigo[5].focus();
            }
        });
    });

    /* Botão verificar código */
    btnVerificar.addEventListener('click', function () {
        /* Ler o código inserido */
        let codigoInserido = '';
        camposCodigo.forEach(function (c) { codigoInserido += c.value; });

        /* Validar: todos os 6 campos preenchidos */
        if (codigoInserido.length < 6) {
            camposCodigo.forEach(function (c) { c.classList.add('com-erro'); });
            erroCodigo.textContent = 'Insira os 6 dígitos do código.';
            return;
        }

        /* Estado de carregamento */
        btnVerificar.classList.add('carregando');
        btnVerificar.querySelector('span').textContent = 'A verificar...';

        /*
         * ⚠️ MODO OFFLINE — Código de teste: 123456
         * Em produção, verificar o código no servidor.
         */
        setTimeout(function () {
            btnVerificar.classList.remove('carregando');
            btnVerificar.querySelector('span').textContent = 'Verificar Código';

            if (codigoInserido === '123456') {
                /* Código correcto → avançar */
                clearInterval(temporizadorReenvio);
                avancarProgresso(3);
                mostrarEtapa(3);
                campoNovaSenha.focus();
            } else {
                /* Código errado → mostrar erro */
                camposCodigo.forEach(function (c) {
                    c.classList.add('com-erro');
                    c.value = '';
                    c.classList.remove('preenchida');
                });
                erroCodigo.textContent = 'Código incorrecto. Tente novamente.';
                camposCodigo[0].focus();
            }
        }, 1500);
    });

    /* Botão reenviar código */
    btnReenviar.addEventListener('click', function () {
        btnReenviar.classList.add('escondida');
        blocoTemporizador.classList.remove('escondida');
        /* Limpar campos do código */
        camposCodigo.forEach(function (c) {
            c.value = '';
            c.classList.remove('preenchida', 'com-erro');
        });
        erroCodigo.textContent = '';
        iniciarTemporizador(120);
        camposCodigo[0].focus();
        /* Simulação de reenvio */
        console.log('Código reenviado (simulação offline)');
    });


    /* =====================================================
       TEMPORIZADOR DE REENVIO
    ===================================================== */
    function iniciarTemporizador(segundosTotal) {
        let segundosRestantes = segundosTotal;

        /* Mostrar temporizador, esconder botão reenviar */
        blocoTemporizador.classList.remove('escondida');
        btnReenviar.classList.add('escondida');

        /* Actualizar o display */
        function actualizarDisplay() {
            const minutos = Math.floor(segundosRestantes / 60);
            const segs    = segundosRestantes % 60;
            /* Formatar como MM:SS com zero à esquerda */
            contadorElem.textContent =
                String(minutos).padStart(2, '0') + ':' + String(segs).padStart(2, '0');
        }
        actualizarDisplay();

        /* Limpar temporizador anterior se existir */
        if (temporizadorReenvio) clearInterval(temporizadorReenvio);

        temporizadorReenvio = setInterval(function () {
            segundosRestantes--;
            actualizarDisplay();

            /* Quando chega a zero: mostra botão de reenvio */
            if (segundosRestantes <= 0) {
                clearInterval(temporizadorReenvio);
                blocoTemporizador.classList.add('escondida');
                btnReenviar.classList.remove('escondida');
            }
        }, 1000);
    }


    /* =====================================================
       ETAPA 3 — NOVA PALAVRA-PASSE
    ===================================================== */

    /* Botões ver/esconder senha */
    function configurarBtnVerSenha(btn, campo) {
        if (!btn || !campo) return;
        btn.addEventListener('click', function () {
            const visivel = campo.type === 'text';
            campo.type = visivel ? 'password' : 'text';
            btn.innerHTML = visivel
                ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                       <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                       <circle cx="12" cy="12" r="3"/>
                   </svg>`
                : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                       <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                       <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                       <line x1="1" y1="1" x2="23" y2="23"/>
                   </svg>`;
        });
    }
    configurarBtnVerSenha(btnVerNova, campoNovaSenha);
    configurarBtnVerSenha(btnVerConfirmar, campoConfirmar);

    /* Verificar requisitos em tempo real */
    const reqTamanho   = document.getElementById('req-tamanho');
    const reqMaiuscula = document.getElementById('req-maiuscula');
    const reqNumero    = document.getElementById('req-numero');
    const reqSimbolo   = document.getElementById('req-simbolo');

    function marcarRequisito(elem, satisfeito) {
        if (!elem) return;
        if (satisfeito) {
            elem.classList.add('ok');
            elem.querySelector('.requisito__icone').textContent = '✓';
        } else {
            elem.classList.remove('ok');
            elem.querySelector('.requisito__icone').textContent = '○';
        }
    }

    /* Analisar a senha à medida que o utilizador escreve */
    campoNovaSenha.addEventListener('input', function () {
        const senha  = campoNovaSenha.value;
        let   pontos = 0;

        const temTamanho   = senha.length >= 8;
        const temMaiuscula = /[A-Z]/.test(senha);
        const temNumero    = /[0-9]/.test(senha);
        const temSimbolo   = /[^A-Za-z0-9]/.test(senha);

        /* Actualizar requisitos visuais */
        marcarRequisito(reqTamanho,   temTamanho);
        marcarRequisito(reqMaiuscula, temMaiuscula);
        marcarRequisito(reqNumero,    temNumero);
        marcarRequisito(reqSimbolo,   temSimbolo);

        /* Calcular força */
        if (temTamanho)   pontos++;
        if (temMaiuscula) pontos++;
        if (temNumero)    pontos++;
        if (temSimbolo)   pontos++;

        /* Actualizar barra de força */
        barraForca.className = 'forcometro__barra';
        textoForca.className = 'forcometro__texto';

        if (senha === '') {
            textoForca.textContent = '';
        } else if (pontos <= 1) {
            barraForca.classList.add('fraca');
            textoForca.classList.add('fraca');
            textoForca.textContent = '🔴 Senha fraca';
        } else if (pontos <= 3) {
            barraForca.classList.add('media');
            textoForca.classList.add('media');
            textoForca.textContent = '🟡 Senha média';
        } else {
            barraForca.classList.add('forte');
            textoForca.classList.add('forte');
            textoForca.textContent = '🟢 Senha forte';
        }

        limparErro(campoNovaSenha, erroNovaSenha);
    });

    campoConfirmar.addEventListener('input', function () {
        limparErro(campoConfirmar, erroConfirmar);
    });

    /* Submissão da nova senha */
    formularioSenha.addEventListener('submit', function (evento) {
        evento.preventDefault();

        const senha    = campoNovaSenha.value;
        const confirma = campoConfirmar.value;
        let   valido   = true;

        /* Validar comprimento */
        if (senha.length < 8) {
            mostrarErro(campoNovaSenha, erroNovaSenha, 'A senha deve ter pelo menos 8 caracteres.');
            valido = false;
        }

        /* Validar confirmação */
        if (confirma !== senha) {
            mostrarErro(campoConfirmar, erroConfirmar, 'As palavras-passe não coincidem.');
            valido = false;
        }

        if (!valido) return;

        /* Estado de carregamento */
        btnGuardar.classList.add('carregando');
        btnGuardar.querySelector('span').textContent = 'A guardar...';

        /*
         * ⚠️ MODO OFFLINE — Simulação de gravação
         * Em produção, enviar a nova senha para a API:
         * fetch('/api/nova-senha', {
         *     method: 'POST',
         *     body: JSON.stringify({ senha, token })
         * })
         */
        setTimeout(function () {
            btnGuardar.classList.remove('carregando');
            btnGuardar.querySelector('span').textContent = 'Guardar Nova Senha';

            /* Mostrar etapa de sucesso */
            avancarProgresso(4);
            mostrarEtapa(4);

            /* Iniciar contagem regressiva para redirecionar */
            iniciarRedireccionar(5);

        }, 2000);
    });


    /* =====================================================
       REDIRECCIONAMENTO AUTOMÁTICO (etapa de sucesso)
    ===================================================== */
    function iniciarRedireccionar(segundos) {
        let restantes = segundos;

        const timer = setInterval(function () {
            restantes--;
            if (contadorRedir) contadorRedir.textContent = restantes;

            if (restantes <= 0) {
                clearInterval(timer);
                /* Redirecionar para o login */
                window.location.href = 'login.html';
            }
        }, 1000);
    }


    /* =====================================================
       NOTAS PARA DESENVOLVIMENTO FUTURO
    ===================================================== */
    console.log('✅ Comutec — Recuperação de senha carregada.');
    console.log('ℹ️  Código de teste para a etapa 2: 123456');

}); /* Fim do DOMContentLoaded */
