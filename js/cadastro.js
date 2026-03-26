/**
 * COMUTEC — Script da Página de Cadastro
 * Ficheiro: cadastro.js
 * 
 * FUNCIONALIDADES:
 * 1. Validação de todos os campos antes de submeter
 * 2. Indicador visual de força da palavra-passe
 * 3. Verificação de confirmação de senha
 * 4. Toggle (ver/esconder) palavra-passe
 * 5. Simulação de registo (modo offline)
 */

document.addEventListener('DOMContentLoaded', function () {

    /* --- Seleccionar elementos --- */
    const formulario      = document.getElementById('formulario-registo');
    const campoNome       = document.getElementById('nome-empresa');
    const campoEmail      = document.getElementById('email');
    const campoNif        = document.getElementById('nif');
    const campoContacto   = document.getElementById('contacto');
    const campoEndereco   = document.getElementById('endereco');
    const campoSenha      = document.getElementById('senha');
    const campoCsenha     = document.getElementById('confirmar-senha');
    const btnVerSenha     = document.getElementById('btn-ver-senha');
    const btnSubmeter     = document.getElementById('btn-submeter');
    const barraForca      = document.getElementById('barra-forca');
    const textoForca      = document.getElementById('texto-forca');

    /* Mapeamento de campos → elementos de erro */
    const erros = {
        nome:      document.getElementById('erro-nome'),
        email:     document.getElementById('erro-email'),
        nif:       document.getElementById('erro-nif'),
        contacto:  document.getElementById('erro-contacto'),
        endereco:  document.getElementById('erro-endereco'),
        senha:     document.getElementById('erro-senha'),
        confirmar: document.getElementById('erro-confirmar'),
    };


    /* =====================================================
       FUNÇÕES AUXILIARES
    ===================================================== */

    /* Mostrar mensagem de erro num campo */
    function mostrarErro(campo, chaveErro, mensagem) {
        campo.classList.add('com-erro');
        erros[chaveErro].textContent = mensagem;
    }

    /* Limpar erro de um campo */
    function limparErro(campo, chaveErro) {
        campo.classList.remove('com-erro');
        erros[chaveErro].textContent = '';
    }

    /* Validar formato de e-mail */
    function emailValido(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    /* Validar NIF angolano (9 dígitos) */
    function nifValido(nif) {
        return /^\d{9}$/.test(nif);
    }

    /* Validar contacto telefónico */
    function contactoValido(tel) {
        /* Remove espaços e verifica formato angolano */
        const limpo = tel.replace(/\s/g, '');
        return /^(\+244)?\d{9}$/.test(limpo);
    }


    /* =====================================================
       1. INDICADOR DE FORÇA DA PALAVRA-PASSE
       Analisa a senha à medida que o utilizador escreve
    ===================================================== */
    campoSenha.addEventListener('input', function () {
        const senha  = campoSenha.value;
        let pontos   = 0;

        /* Critérios de força */
        if (senha.length >= 8)           pontos++;  /* Comprimento mínimo */
        if (/[A-Z]/.test(senha))         pontos++;  /* Tem maiúscula */
        if (/[0-9]/.test(senha))         pontos++;  /* Tem número */
        if (/[^A-Za-z0-9]/.test(senha))  pontos++;  /* Tem símbolo */

        /* Actualizar barra visual */
        barraForca.className = 'forcometro__barra'; /* Reset */
        textoForca.className = 'forcometro__texto'; /* Reset */

        if (senha === '') {
            /* Campo vazio — nenhuma indicação */
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

        /* Limpar erro ao escrever */
        limparErro(campoSenha, 'senha');
    });


    /* =====================================================
       2. BOTÃO VER/ESCONDER PALAVRA-PASSE
    ===================================================== */
    if (btnVerSenha) {
        btnVerSenha.addEventListener('click', function () {
            const visivel = campoSenha.type === 'text';
            campoSenha.type = visivel ? 'password' : 'text';

            btnVerSenha.innerHTML = visivel
                ? /* Olho aberto */
                  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                  </svg>`
                : /* Olho fechado */
                  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>`;
        });
    }


    /* =====================================================
       3. LIMPAR ERROS AO ESCREVER
    ===================================================== */
    campoNome.addEventListener('input',     () => limparErro(campoNome,     'nome'));
    campoEmail.addEventListener('input',    () => limparErro(campoEmail,    'email'));
    campoNif.addEventListener('input',      () => limparErro(campoNif,      'nif'));
    campoContacto.addEventListener('input', () => limparErro(campoContacto, 'contacto'));
    campoEndereco.addEventListener('input', () => limparErro(campoEndereco, 'endereco'));
    campoCsenha.addEventListener('input',   () => limparErro(campoCsenha,   'confirmar'));

    /* Apenas permitir números no campo NIF */
    campoNif.addEventListener('keypress', function (e) {
        if (!/[0-9]/.test(e.key)) e.preventDefault();
    });


    /* =====================================================
       4. VALIDAÇÃO E SUBMISSÃO DO FORMULÁRIO
    ===================================================== */
    formulario.addEventListener('submit', function (evento) {
        evento.preventDefault();

        const nome      = campoNome.value.trim();
        const email     = campoEmail.value.trim();
        const nif       = campoNif.value.trim();
        const contacto  = campoContacto.value.trim();
        const endereco  = campoEndereco.value.trim();
        const senha     = campoSenha.value;
        const csenha    = campoCsenha.value;
        let valido      = true;

        /* --- Validar Nome --- */
        if (nome.length < 2) {
            mostrarErro(campoNome, 'nome', 'O nome deve ter pelo menos 2 caracteres.');
            valido = false;
        }

        /* --- Validar E-mail --- */
        if (email === '') {
            mostrarErro(campoEmail, 'email', 'O e-mail é obrigatório.');
            valido = false;
        } else if (!emailValido(email)) {
            mostrarErro(campoEmail, 'email', 'Formato de e-mail inválido.');
            valido = false;
        }

        /* --- Validar NIF --- */
        if (!nifValido(nif)) {
            mostrarErro(campoNif, 'nif', 'O NIF deve ter exactamente 9 dígitos.');
            valido = false;
        }

        /* --- Validar Contacto --- */
        if (!contactoValido(contacto)) {
            mostrarErro(campoContacto, 'contacto', 'Número de telefone inválido.');
            valido = false;
        }

        /* --- Validar Endereço --- */
        if (endereco.length < 5) {
            mostrarErro(campoEndereco, 'endereco', 'Por favor, insira um endereço válido.');
            valido = false;
        }

        /* --- Validar Senha --- */
        if (senha.length < 8) {
            mostrarErro(campoSenha, 'senha', 'A senha deve ter pelo menos 8 caracteres.');
            valido = false;
        }

        /* --- Validar Confirmação de Senha --- */
        if (csenha !== senha) {
            mostrarErro(campoCsenha, 'confirmar', 'As palavras-passe não coincidem.');
            valido = false;
        }

        /* --- Submeter se tudo estiver correcto --- */
        if (valido) {
            simularRegisto(nome, email);
        }
    });


    /* =====================================================
       5. SIMULAÇÃO DE REGISTO (MODO OFFLINE)
       Em produção, substituir por uma chamada à API real
    ===================================================== */
    function simularRegisto(nome, email) {
        /* Estado de carregamento */
        btnSubmeter.classList.add('carregando');
        btnSubmeter.querySelector('span').textContent = 'A registar...';

        /* Simular tempo de processamento */
        setTimeout(function () {
            btnSubmeter.classList.remove('carregando');
            btnSubmeter.querySelector('span').textContent = 'Criar Conta Corporativa';

            /* ⚠️ NOTA PARA O PROGRAMADOR:
               Aqui deverás enviar os dados para a tua API:
               fetch('/api/registar', {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify({ nome, email, nif, ... })
               })
               .then(res => res.json())
               .then(data => { window.location.href = '/dashboard' })
            */
            alert('✅ Empresa registada com sucesso!\n\nEmpresa: ' + nome + '\nE-mail: ' + email + '\n\n(Modo offline — sem ligação ao servidor)');
        }, 2000);
    }

    console.log('✅ Comutec — Cadastro carregado com sucesso!');
});
