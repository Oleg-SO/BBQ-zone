document.addEventListener('DOMContentLoaded', function() {

    const burgerBtn = document.getElementById('burgerBtn');
    const mainNav = document.getElementById('mainNav');
    const menu = document.querySelector('.header__menu');
    const menuLinks = document.querySelectorAll('.header__link');
    const body = document.body;

    // Открытие/закрытие меню
    burgerBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        menu.classList.toggle('active');
        if (menu.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    });

    // Закрытие меню при клике на ссылку
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            body.style.overflow = '';
        });
    });

    // Закрытие меню при клике вне его
    document.addEventListener('click', function(e) {
        if (menu.classList.contains('active') && !menu.contains(e.target) && !burgerBtn.contains(e.target)) {
            menu.classList.remove('active');
            body.style.overflow = '';
        }
    });

    // Калькулятор
    const calcOptions = document.querySelectorAll('.calculator__option');
    const calcPriceDisplay = document.getElementById('calcPrice');

    calcOptions.forEach(btn => {
        btn.addEventListener('click', function() {
            calcOptions.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            calcPriceDisplay.textContent = this.getAttribute('data-price');
        });
    });

    document.querySelectorAll('.js-open-calc-form').forEach(button => {
        button.addEventListener('click', () => {
            const callbackModal = document.getElementById('callbackModal');
            if (callbackModal) {
                callbackModal.classList.add('active');
                body.style.overflow = 'hidden';
            }
        });
    });

    document.getElementById('openCallbackBtn')?.addEventListener('click', () => {
        const callbackModal = document.getElementById('callbackModal');
        if (callbackModal) {
            callbackModal.classList.add('active');
            body.style.overflow = 'hidden';
        }
    });

    const callbackModal = document.getElementById('callbackModal');
    const callbackClose = document.getElementById('callbackClose');

    function closeCallbackModal() {
        if (callbackModal) {
            callbackModal.classList.remove('active');
            body.style.overflow = '';
        }
    }

    callbackClose?.addEventListener('click', closeCallbackModal);
    callbackModal?.addEventListener('click', (e) => {
        if (e.target === callbackModal) closeCallbackModal();
    });

    // Галерея
    const modal = document.getElementById('galleryModal');
    const modalImg = document.getElementById('modalImage');
    const modalClose = document.getElementById('modalClose');

    document.querySelectorAll('.gallery__item').forEach(item => {
        item.addEventListener('click', () => {
            modalImg.src = item.getAttribute('data-src');
            modal.classList.add('active');
            body.style.overflow = 'hidden';
        });
    });

    function closeModal() {
        modal.classList.remove('active');
        body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    // FAQ
    document.querySelectorAll('.faq__question').forEach(q => {
        q.addEventListener('click', () => {
            const answer = q.nextElementSibling;
            const isOpen = answer.classList.contains('open');
            document.querySelectorAll('.faq__answer').forEach(a => a.classList.remove('open'));
            if (!isOpen) {
                answer.classList.add('open');
            }
        });
    });

    // Форма
    document.querySelectorAll('#contactForm, #callbackForm').forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const currentForm = this;
            const formData = new FormData(currentForm);
            const name = (formData.get('name') || '').toString().trim();
            const phone = (formData.get('phone') || '').toString().trim();
            if (!name || !phone) {
                alert('Заполните имя и телефон.');
                return;
            }

            const submitButton = currentForm.querySelector('button[type="submit"]');
            const originalText = submitButton?.textContent;
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Отправка...';
            }

            try {
                const response = await fetch(currentForm.action || 'send.php', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
                const result = await response.json();
                if (response.ok && result.success) {
                    window.location.href = 'thanks.html';
                    return;
                }
                throw new Error(result.message || 'Ошибка отправки формы.');
            } catch (error) {
                console.error('Form submit error:', error);
                alert('Не удалось отправить заявку. Попробуйте ещё раз.');
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                }
            }
        });
    });

    // Якорные ссылки
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === "#") return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

});

// Расширенный FAQ аккордеон
document.querySelectorAll('.faq-extended__question').forEach(q => {
    q.addEventListener('click', () => {
        const answer = q.nextElementSibling;
        // Закрыть все ответы в этом блоке
        document.querySelectorAll('.faq-extended__answer').forEach(a => a.classList.remove('open'));
        // Открыть текущий
        answer.classList.toggle('open');
    });
});