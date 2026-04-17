/**
 * COMUTEC — Script da Página de Contacto
 * Ficheiro: js/contacto.js
 */

document.addEventListener('DOMContentLoaded', function () {

    const formulario  = document.getElementById('formulario-contacto');
    const campoNome   = document.getElementById('nome');
    const campoEmail  = document.getElementById('email');
    const campoMensagem = document.getElementById('mensagem');
    const btnEnviar   = document.getElementById('btn-enviar');

    /* Validar email */
    function emailValido(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    /* Mostrar erro */
    function mostrarErro(campo, idErro, mensagem) {
        campo.classList.add('com-erro');
        const elem = document.getElementById(idErro);
        if (elem) elem.textContent = mensagem;
    }

    /* Limpar erro */
    function limparErro(campo, idErro) {
        campo.classList.remove('com-erro');
        const elem = document.getElementById(idErro);
        if (elem) elem.textContent = '';
    }

    /* Limpar ao escrever */
    if (campoNome)     campoNome.addEventListener('input',     () => limparErro(campoNome,     'erro-nome'));
    if (campoEmail)    campoEmail.addEventListener('input',    () => limparErro(campoEmail,    'erro-email'));
    if (campoMensagem) campoMensagem.addEventListener('input', () => limparErro(campoMensagem, 'erro-mensagem'));

    /* Submissão */
    if (formulario) {
        formulario.addEventListener('submit', function (e) {
            e.preventDefault();

            const nome     = campoNome.value.trim();
            const email    = campoEmail.value.trim();
            const mensagem = campoMensagem.value.trim();
            let   valido   = true;

            if (nome.length < 2) {
                mostrarErro(campoNome, 'erro-nome', 'Por favor, insira o seu nome.');
                valido = false;
            }
            if (!emailValido(email)) {
                mostrarErro(campoEmail, 'erro-email', 'Formato de e-mail inválido.');
                valido = false;
            }
            if (mensagem.length < 10) {
                mostrarErro(campoMensagem, 'erro-mensagem', 'Por favor, escreva uma mensagem.');
                valido = false;
            }

            if (!valido) return;

            btnEnviar.classList.add('carregando');
            btnEnviar.querySelector('span').textContent = 'A enviar...';

            setTimeout(function () {
                btnEnviar.classList.remove('carregando');
                btnEnviar.querySelector('span').textContent = 'Enviar Mensagem';
                alert('✅ Mensagem enviada com sucesso!\n\nA nossa equipa responderá em menos de 24 horas.\n(Modo offline — simulação)');
                formulario.reset();
            }, 1800);
        });
    }

    console.log('✅ Comutec — Contacto carregado com sucesso!');
});