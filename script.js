/* =============================================
   Центр возможностей Феникс — interactions
   ============================================= */

(() => {
    'use strict';

    // ---------- Год в подвале ----------
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ---------- Бургер-меню ----------
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            const isOpen = nav.classList.toggle('is-open');
            burger.classList.toggle('is-open', isOpen);
            burger.setAttribute('aria-expanded', String(isOpen));
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('is-open');
                burger.classList.remove('is-open');
                burger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    // ---------- Модальное окно записи на услугу ----------
    const modal = document.getElementById('modal');
    const modalService = document.getElementById('service');
    const formEl = document.getElementById('bookingForm');
    const successEl = document.getElementById('formSuccess');
    const modalSubtitle = document.getElementById('modalSubtitle');

    let lastFocused = null;

    const openModal = (prefillService) => {
        if (!modal) return;
        lastFocused = document.activeElement;

        if (prefillService && modalService) {
            const exists = Array.from(modalService.options).some(o => o.value === prefillService);
            if (exists) {
                modalService.value = prefillService;
                if (modalSubtitle) {
                    modalSubtitle.textContent = `Запись на «${prefillService}» — заполните форму, и мы свяжемся с вами`;
                }
            }
        } else if (modalSubtitle) {
            modalSubtitle.textContent = 'Оставьте заявку — мы свяжемся с вами в ближайшее время';
        }

        if (formEl) {
            formEl.hidden = false;
            formEl.reset();
            clearErrors();
        }
        if (successEl) successEl.hidden = true;

        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        const firstInput = modal.querySelector('input, select');
        if (firstInput) setTimeout(() => firstInput.focus(), 100);
    };

    const closeModal = () => {
        if (!modal) return;
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lastFocused) lastFocused.focus();
    };

    document.querySelectorAll('[data-modal-open]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.service-card');
            const service = card ? card.dataset.service : null;
            openModal(service);
        });
    });

    document.querySelectorAll('[data-modal-close]').forEach(el => {
        el.addEventListener('click', closeModal);
    });

    // ---------- Модальное окно пожертвования ----------
    const donateModal = document.getElementById('donateModal');
    const donateForm = document.getElementById('donateForm');
    const donateSuccess = document.getElementById('donateSuccess');
    const customAmountWrap = document.getElementById('customAmountWrap');
    const customAmountInput = document.getElementById('customAmount');

    const openDonate = () => {
        if (!donateModal) return;
        lastFocused = document.activeElement;

        if (donateForm) {
            donateForm.hidden = false;
            donateForm.reset();
        }
        if (donateSuccess) donateSuccess.hidden = true;
        if (customAmountWrap) customAmountWrap.hidden = true;

        donateModal.classList.add('is-open');
        donateModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeDonate = () => {
        if (!donateModal) return;
        donateModal.classList.remove('is-open');
        donateModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lastFocused) lastFocused.focus();
    };

    document.querySelectorAll('[data-donate-open]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openDonate();
        });
    });

    document.querySelectorAll('[data-donate-close]').forEach(el => {
        el.addEventListener('click', closeDonate);
    });

    // Переключение "Своя сумма" — показать поле ввода
    if (donateForm && customAmountWrap) {
        donateForm.querySelectorAll('input[name="amount"]').forEach(radio => {
            radio.addEventListener('change', () => {
                if (radio.value === 'custom' && radio.checked) {
                    customAmountWrap.hidden = false;
                    if (customAmountInput) setTimeout(() => customAmountInput.focus(), 50);
                } else {
                    customAmountWrap.hidden = true;
                }
            });
        });
    }

    // Отправка формы пожертвования
    if (donateForm) {
        donateForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const data = new FormData(donateForm);
            const frequency = (data.get('frequency') || '').toString();
            const amountRadio = (data.get('amount') || '').toString();
            const customAmount = (data.get('customAmount') || '').toString();
            const payment = (data.get('payment') || '').toString();
            const name = (data.get('name') || '').toString().trim();
            const email = (data.get('email') || '').toString().trim();
            const policy = data.get('policy');

            let amount = amountRadio;
            if (amountRadio === 'custom') {
                const num = parseInt(customAmount, 10);
                if (isNaN(num) || num < 10) {
                    alert('Введите сумму от 10 рублей');
                    return;
                }
                amount = num;
            }

            if (!policy) {
                alert('Пожалуйста, дайте согласие с условиями оферты и политикой обработки данных');
                return;
            }

            const submitBtn = donateForm.querySelector('.btn--donate-submit');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Отправляем...';
            }

            setTimeout(() => {
                donateForm.hidden = true;
                if (donateSuccess) donateSuccess.hidden = false;
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Помочь';
                }

                console.log('[Phoenix] Пожертвование:', {
                    frequency,
                    amount: amount + ' ₽',
                    payment,
                    name,
                    email
                });
            }, 800);
        });
    }

    // Закрытие модалок по ESC
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        if (modal && modal.classList.contains('is-open')) closeModal();
        if (donateModal && donateModal.classList.contains('is-open')) closeDonate();
    });

    // ---------- Маска телефона ----------
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let digits = e.target.value.replace(/\D/g, '');
            if (digits.startsWith('8')) digits = '7' + digits.slice(1);
            if (!digits.startsWith('7') && digits.length > 0) digits = '7' + digits;
            digits = digits.slice(0, 11);

            let formatted = '';
            if (digits.length > 0) formatted = '+7';
            if (digits.length > 1) formatted += ' (' + digits.slice(1, 4);
            if (digits.length >= 4) formatted += ') ' + digits.slice(4, 7);
            if (digits.length >= 7) formatted += '-' + digits.slice(7, 9);
            if (digits.length >= 9) formatted += '-' + digits.slice(9, 11);

            e.target.value = formatted;
        });
        phoneInput.addEventListener('focus', (e) => {
            if (!e.target.value) e.target.value = '+7 ';
        });
    }

    // ---------- Валидация формы ----------
    const setError = (name, msg) => {
        const input = formEl.querySelector(`[name="${name}"]`);
        const errEl = formEl.querySelector(`[data-error-for="${name}"]`);
        if (input) input.classList.add('is-invalid');
        if (errEl) errEl.textContent = msg;
    };

    const clearErrors = () => {
        formEl.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
        formEl.querySelectorAll('[data-error-for]').forEach(el => el.textContent = '');
    };

    if (formEl) {
        formEl.addEventListener('submit', (e) => {
            e.preventDefault();
            clearErrors();

            const data = new FormData(formEl);
            const name = (data.get('name') || '').toString().trim();
            const phone = (data.get('phone') || '').toString().replace(/\D/g, '');
            const service = (data.get('service') || '').toString();
            const time = (data.get('time') || '').toString();

            let valid = true;

            if (name.length < 2) {
                setError('name', 'Введите ваше имя');
                valid = false;
            }
            if (phone.length !== 11) {
                setError('phone', 'Введите корректный номер телефона');
                valid = false;
            }
            if (!service) {
                alert('Пожалуйста, выберите услугу');
                valid = false;
            }
            if (!time) {
                alert('Пожалуйста, выберите удобное время');
                valid = false;
            }

            if (!valid) return;

            // Имитация отправки
            const submitBtn = formEl.querySelector('.form__submit');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Отправляем...';
            }

            setTimeout(() => {
                formEl.hidden = true;
                if (successEl) successEl.hidden = false;
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Отправить заявку';
                }

                console.log('[Phoenix] Заявка отправлена:', { name, phone, service, time });
            }, 800);
        });

        // Сброс ошибки при вводе
        formEl.querySelectorAll('.form__input').forEach(input => {
            input.addEventListener('input', () => {
                input.classList.remove('is-invalid');
                const name = input.getAttribute('name');
                const errEl = formEl.querySelector(`[data-error-for="${name}"]`);
                if (errEl) errEl.textContent = '';
            });
        });
    }

    // ---------- Подписка ----------
    const subscribeForm = document.getElementById('subscribeForm');
    const subscribeMsg = document.getElementById('subscribeMsg');
    const subscribeEmail = document.getElementById('subscribeEmail');

    if (subscribeForm && subscribeMsg) {
        subscribeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = (subscribeEmail.value || '').trim();
            const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

            if (!ok) {
                subscribeMsg.textContent = 'Введите корректный email';
                subscribeMsg.classList.remove('is-success');
                return;
            }

            subscribeMsg.textContent = 'Спасибо! Вы подписаны на новости центра.';
            subscribeMsg.classList.add('is-success');
            subscribeEmail.value = '';

            setTimeout(() => {
                subscribeMsg.textContent = '';
                subscribeMsg.classList.remove('is-success');
            }, 5000);
        });
    }

    // ---------- Плавное появление элементов при скролле ----------
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('.service-card, .team-card, .about__tile, .stat').forEach(el => {
            el.classList.add('reveal');
            observer.observe(el);
        });
    }
})();
