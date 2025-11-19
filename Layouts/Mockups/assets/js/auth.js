/**
 * AUTH.JS - Скрипты для страниц авторизации/регистрации
 */

document.addEventListener('DOMContentLoaded', () => {
  if (!window.App) return;
  App.initAuth && App.initAuth();
  initRegistrationSteps();
  initPasswordStrengthMeter();
});

function initRegistrationSteps() {
  const form = document.querySelector('[data-registration-form]');
  if (!form) return;

  const steps = Array.from(form.querySelectorAll('.registration-step'));
  if (!steps.length) return;

  const indicator = document.querySelector('[data-step-indicator]');
  const nextBtn = form.querySelector('[data-action="next-step"]');
  const prevBtn = form.querySelector('[data-action="prev-step"]');
  let currentStep = 0;

  setupRoleFields(form);

  const updateSteps = () => {
    steps.forEach((step, index) => {
      const isActive = index === currentStep;
      step.hidden = !isActive;
      step.classList.toggle('is-active', isActive);
    });

    if (indicator) {
      indicator.textContent = `Шаг ${currentStep + 1} из ${steps.length}`;
    }
  };

  const validateCurrentStep = () => {
    const fields = steps[currentStep].querySelectorAll('input, select, textarea');

    for (const field of fields) {
      if (!field.hasAttribute('required') || field.disabled) continue;
      if (field.offsetParent === null && field.type !== 'hidden') continue;

      if (!field.checkValidity()) {
        field.reportValidity();
        return false;
      }
    }

    return true;
  };

  nextBtn?.addEventListener('click', () => {
    if (!validateCurrentStep()) return;
    currentStep = Math.min(currentStep + 1, steps.length - 1);
    updateSteps();
  });

  prevBtn?.addEventListener('click', () => {
    currentStep = Math.max(0, currentStep - 1);
    updateSteps();
  });

  form.addEventListener('submit', (event) => {
    if (currentStep !== steps.length - 1 && !validateCurrentStep()) {
      event.preventDefault();
      return;
    }

    if (!validateCurrentStep()) {
      event.preventDefault();
    }
  });

  updateSteps();
}

function setupRoleFields(form) {
  const roleInputs = form.querySelectorAll('input[name="role"]');
  const blocks = form.querySelectorAll('[data-role-fields]');
  const conditionalBlocks = form.querySelectorAll('[data-role-visible]');
  if (!roleInputs.length || !blocks.length) return;

  const updateBlocks = () => {
    const selected = form.querySelector('input[name="role"]:checked');
    const value = selected ? selected.value : null;

    blocks.forEach(block => {
      const isActive = block.dataset.roleFields === value;
      block.hidden = !isActive;
      block.querySelectorAll('[data-role-required]').forEach(input => {
        if (isActive) {
          input.setAttribute('required', 'required');
          input.setAttribute('aria-required', 'true');
        } else {
          input.removeAttribute('required');
          input.removeAttribute('aria-required');
        }
      });
    });

    conditionalBlocks.forEach(block => {
      const roles = (block.dataset.roleVisible || '').split(',').map(role => role.trim()).filter(Boolean);
      const isActive = roles.length === 0 || roles.includes(value);
      block.hidden = !isActive;
      block.querySelectorAll('input, select, textarea').forEach(field => {
        field.disabled = !isActive;
      });
    });
  };

  roleInputs.forEach(input => input.addEventListener('change', updateBlocks));
  updateBlocks();
}

function initPasswordStrengthMeter() {
  const passwordInput = document.getElementById('password');
  const barFill = document.querySelector('[data-password-strength-fill]');
  const label = document.querySelector('[data-password-strength-label]');
  if (!passwordInput || !barFill) return;

  const minLengthAttr = parseInt(passwordInput.getAttribute('minlength'), 10);
  const minLength = Number.isFinite(minLengthAttr) ? minLengthAttr : 8;

  const updateStrength = () => {
    const length = passwordInput.value.length;
    const percent = Math.max(0, Math.min(Math.round((length / minLength) * 100), 100));
    barFill.style.width = `${percent}%`;

    if (label) {
      label.textContent = length >= minLength
        ? 'Отличный пароль'
        : `Заполните пароль (минимум ${minLength} символов)`;
    }
  };

  passwordInput.addEventListener('input', updateStrength);
  updateStrength();
}
