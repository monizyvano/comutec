/**
 * COMUTEC — Script da Página de Login
 * Ficheiro: login.js
 * 
 * FUNCIONALIDADES:
 * 1. Validação do formulário antes de submeter
 * 2. Botão para mostrar/esconder palavra-passe
 * 3. Simulação de login (modo offline)
 * 4. Feedback visual ao utilizador
 */

document.addEventListener('DOMContentLoaded', function () {

    /* --- Seleccionar elementos --- */
    const formulario    = document.getElementById('formulario-login');
    const campoEmail    = document.getElementById('email');
    const campoSenha    = document.getElementById('palavra-passe');
    const erroEmail     = document.getElementById('erro-email');
    const erroSenha     = document.getElementById('erro-senha');
    const btnVerSenha   = document.getElementById('btn-ver-senha');
    const btnEntrar     = document.getElementById('btn-entrar');


    /* =====================================================
       1. BOTÃO VER/ESCONDER PALAVRA-PASSE
       Alterna entre type="password" e type="text"
    ===================================================== */
    if (btnVerSenha) {
        btnVerSenha.addEventListener('click', function () {
            const estaEscondida = campoSenha.type === 'password';

            /* Muda o tipo do input */
            campoSenha.type = estaEscondida ? 'text' : 'password';

            /* Actualiza o ícone (olho aberto / fechado) */
            btnVerSenha.innerHTML = estaEscondida
                ? /* Olho fechado (senha visível) */
                  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>`
                : /* Olho aberto (senha escondida) */
                  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                  </svg>`;
        });
    }


    /* =====================================================
       2. VALIDAÇÃO DO FORMULÁRIO
    ===================================================== */

    /* Função para validar o email */
    function validarEmail(email) {
        /* Expressão regular simples para validar o formato do email */
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    /* Função para mostrar erro num campo */
    function mostrarErro(campo, mensagemElem, mensagem) {
        campo.classList.add('com-erro');
        mensagemElem.textContent = mensagem;
    }

    /* Função para limpar erro num campo */
    function limparErro(campo, mensagemElem) {
        campo.classList.remove('com-erro');
        mensagemElem.textContent = '';
    }

    /* Limpar erro quando o utilizador começa a escrever */
    campoEmail.addEventListener('input', function () {
        limparErro(campoEmail, erroEmail);
    });

    campoSenha.addEventListener('input', function () {
        limparErro(campoSenha, erroSenha);
    });


    /* =====================================================
       3. SUBMISSÃO DO FORMULÁRIO
    ===================================================== */
    formulario.addEventListener('submit', function (evento) {
        /* Impede o comportamento padrão (enviar para o servidor) */
        evento.preventDefault();

        const email = campoEmail.value.trim();
        const senha = campoSenha.value;
        let formularioValido = true;

        /* --- Validar email --- */
        if (email === '') {
            mostrarErro(campoEmail, erroEmail, 'Por favor, insira o seu e-mail.');
            formularioValido = false;
        } else if (!validarEmail(email)) {
            mostrarErro(campoEmail, erroEmail, 'O formato do e-mail não é válido.');
            formularioValido = false;
        }

        /* --- Validar senha --- */
        if (senha === '') {
            mostrarErro(campoSenha, erroSenha, 'Por favor, insira a sua palavra-passe.');
            formularioValido = false;
        } else if (senha.length < 6) {
            mostrarErro(campoSenha, erroSenha, 'A palavra-passe deve ter pelo menos 6 caracteres.');
            formularioValido = false;
        }

        /* --- Se o formulário for válido, simular login --- */
        if (formularioValido) {
            simularLogin(email);
        }
    });


    /* =====================================================
       4. SIMULAÇÃO DE LOGIN (MODO OFFLINE)
       Em produção, substituir por uma chamada à API real
    ===================================================== */
    function simularLogin(email) {
        /* Mostrar estado de carregamento no botão */
        btnEntrar.classList.add('carregando');
        btnEntrar.querySelector('span').textContent = 'A entrar...';

        /* Simular atraso de rede (1.5 segundos) */
        setTimeout(function () {
            btnEntrar.classList.remove('carregando');
            btnEntrar.querySelector('span').textContent = 'Entrar';

            /* ⚠️ NOTA PARA O PROGRAMADOR:
               Aqui deverás fazer um fetch/axios para a tua API real.
               Exemplo:
               fetch('/api/login', { method: 'POST', body: JSON.stringify({ email, senha }) })
                   .then(res => res.json())
                   .then(data => { window.location.href = '/dashboard' })
            */
            alert('✅ Login simulado com sucesso!\n\nE-mail: ' + email + '\n(Modo offline — sem ligação ao servidor)');
        }, 1500);
    }

    console.log('✅ Comutec — Login carregado com sucesso!');
});
