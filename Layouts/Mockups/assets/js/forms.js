/**
 * FORMS.JS - Страница подачи запроса
 */

document.addEventListener('DOMContentLoaded', () => {
  if (!window.App) return;
  initFileUploads();
  initCustomSelects();
  initRequiredCheckboxGroups();
});

function initFileUploads() {
  const uploadBlocks = document.querySelectorAll('.file-upload');
  if (!uploadBlocks.length) return;

  uploadBlocks.forEach(upload => {
    const fileInput = upload.querySelector('.file-upload__input');
    const fileLabel = upload.querySelector('.file-upload__label span');

    if (!fileInput || !fileLabel) return;

    const defaultLabel = fileLabel.textContent.trim() || 'Выберите файлы или перетащите их сюда';

    const updateLabel = () => {
      if (!fileInput.files || fileInput.files.length === 0) {
        fileLabel.textContent = defaultLabel;
        return;
      }

      const names = Array.from(fileInput.files).map(file => file.name);
      fileLabel.textContent = names.join(', ');
    };

    fileInput.addEventListener('change', updateLabel);

    ['dragenter', 'dragover'].forEach(eventName => {
      fileInput.addEventListener(eventName, (event) => {
        event.preventDefault();
        upload.classList.add('file-upload--dragover');
      });
    });

    ['dragleave', 'dragend'].forEach(eventName => {
      fileInput.addEventListener(eventName, () => {
        upload.classList.remove('file-upload--dragover');
      });
    });

    fileInput.addEventListener('drop', (event) => {
      event.preventDefault();
      event.stopPropagation();
      upload.classList.remove('file-upload--dragover');

      if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length) {
        fileInput.files = event.dataTransfer.files;
        fileInput.dispatchEvent(new Event('change', { bubbles: true }));
      } else {
        requestAnimationFrame(updateLabel);
      }
    });
  });
}

function initRequiredCheckboxGroups() {
  const groups = document.querySelectorAll('.js-require-one');
  if (!groups.length) return;

  groups.forEach(group => {
    const checkboxes = group.querySelectorAll('input[type="checkbox"]:not(.js-require-one-control)');
    const control = group.querySelector('.js-require-one-control');

    if (!checkboxes.length || !control) return;

    const message = group.dataset.requireMessage || 'Выберите хотя бы один вариант';

    const validate = () => {
      const hasChecked = Array.from(checkboxes).some(box => box.checked);
      control.checked = hasChecked;
      control.setCustomValidity(hasChecked ? '' : message);
    };

    checkboxes.forEach(box => box.addEventListener('change', validate));
    validate();
  });
}

const customSelectInstances = [];
let customSelectListenersBound = false;

function initCustomSelects() {
  const selects = document.querySelectorAll('.js-custom-select');
  if (!selects.length) return;

  selects.forEach(select => {
    if (select.dataset.customized === 'true') return;

    const wrapper = document.createElement('div');
    wrapper.className = 'custom-select';
    select.parentNode.insertBefore(wrapper, select);
    wrapper.appendChild(select);

    select.classList.add('custom-select__native');
    select.setAttribute('tabindex', '-1');
    select.setAttribute('aria-hidden', 'true');
    select.dataset.customized = 'true';

    const trigger = document.createElement('button');
    trigger.type = 'button';

    const baseClasses = Array.from(select.classList)
      .filter(cls => !['js-custom-select', 'custom-select__native', 'form-select--decorated'].includes(cls))
      .join(' ')
      .trim();

    trigger.className = `${baseClasses} custom-select__trigger`.trim();
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');

    const valueEl = document.createElement('span');
    valueEl.className = 'custom-select__value';
    trigger.appendChild(valueEl);

    const icon = document.createElement('span');
    icon.className = 'custom-select__icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.innerHTML = "<svg width='12' height='7' viewBox='0 0 12 7' xmlns='http://www.w3.org/2000/svg'><path d='M1 1L6 6L11 1' stroke='currentColor' stroke-width='2' stroke-linecap='round' fill='none'/></svg>";
    trigger.appendChild(icon);

    wrapper.appendChild(trigger);

    const menu = document.createElement('div');
    menu.className = 'custom-select__menu';
    menu.setAttribute('role', 'listbox');
    wrapper.appendChild(menu);

    const instance = {
      select,
      wrapper,
      trigger,
      menu,
      valueEl,
      options: []
    };

    buildCustomSelectOptions(instance);
    updateCustomSelectValue(instance);

    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      toggleCustomSelect(instance);
    });

    trigger.addEventListener('keydown', (event) => {
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        toggleCustomSelect(instance);
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        openCustomSelect(instance);
        focusNextOption(instance);
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        openCustomSelect(instance);
        focusPreviousOption(instance);
      }
    });

    select.addEventListener('change', () => updateCustomSelectValue(instance));

    if (select.form) {
      select.form.addEventListener('reset', () => {
        setTimeout(() => updateCustomSelectValue(instance), 0);
      });
    }

    customSelectInstances.push(instance);
  });

  if (!customSelectListenersBound) {
    document.addEventListener('click', handleCustomSelectDocumentClick);
    document.addEventListener('keydown', handleCustomSelectKeydown);
    customSelectListenersBound = true;
  }
}

function buildCustomSelectOptions(instance) {
  const { select, menu } = instance;
  menu.innerHTML = '';
  instance.options = [];

  Array.from(select.options).forEach((option, index) => {
    const optionBtn = document.createElement('button');
    optionBtn.type = 'button';
    optionBtn.className = 'custom-select__option';
    optionBtn.textContent = option.textContent;
    optionBtn.dataset.value = option.value;
    optionBtn.setAttribute('role', 'option');
    optionBtn.dataset.index = String(index);

    if (option.disabled) {
      optionBtn.disabled = true;
    }

    optionBtn.addEventListener('click', () => {
      if (option.disabled) return;
      select.value = option.value;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      closeCustomSelect(instance);
    });

    optionBtn.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        focusNextOption(instance, optionBtn);
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        focusPreviousOption(instance, optionBtn);
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        closeCustomSelect(instance);
        instance.trigger.focus();
      }
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        optionBtn.click();
      }
    });

    instance.options.push(optionBtn);
    menu.appendChild(optionBtn);
  });
}

function updateCustomSelectValue(instance) {
  const { select, valueEl, options } = instance;
  const selectedOption = select.options[select.selectedIndex] || select.options[0];

  if (valueEl) {
    valueEl.textContent = selectedOption ? selectedOption.textContent : '';
  }

  options.forEach(optionBtn => {
    const isSelected = selectedOption && optionBtn.dataset.value === selectedOption.value;
    optionBtn.classList.toggle('is-selected', Boolean(isSelected));
    optionBtn.setAttribute('aria-selected', String(Boolean(isSelected)));
  });
}

function toggleCustomSelect(instance) {
  if (instance.wrapper.classList.contains('custom-select--open')) {
    closeCustomSelect(instance);
  } else {
    openCustomSelect(instance);
  }
}

function openCustomSelect(instance) {
  closeAllCustomSelects(instance);
  instance.wrapper.classList.add('custom-select--open');
  instance.trigger.setAttribute('aria-expanded', 'true');
  focusSelectedOption(instance);
}

function closeCustomSelect(instance) {
  instance.wrapper.classList.remove('custom-select--open');
  instance.trigger.setAttribute('aria-expanded', 'false');
}

function closeAllCustomSelects(exceptInstance) {
  customSelectInstances.forEach(instance => {
    if (instance !== exceptInstance) {
      closeCustomSelect(instance);
    }
  });
}

function focusSelectedOption(instance) {
  const selected = instance.options.find(option => option.classList.contains('is-selected'));
  const target = selected || instance.options[0];
  if (target) {
    target.focus();
  }
}

function focusNextOption(instance, currentOption) {
  if (!instance.options.length) return;
  const index = currentOption
    ? instance.options.indexOf(currentOption)
    : instance.options.findIndex(option => option.classList.contains('is-selected'));
  const nextIndex = (index + 1) % instance.options.length;
  instance.options[nextIndex].focus();
}

function focusPreviousOption(instance, currentOption) {
  if (!instance.options.length) return;
  const index = currentOption
    ? instance.options.indexOf(currentOption)
    : instance.options.findIndex(option => option.classList.contains('is-selected'));
  if (index < 0) {
    instance.options[instance.options.length - 1].focus();
    return;
  }
  const prevIndex = (index - 1 + instance.options.length) % instance.options.length;
  instance.options[prevIndex].focus();
}

function handleCustomSelectDocumentClick(event) {
  customSelectInstances.forEach(instance => {
    if (!instance.wrapper.contains(event.target)) {
      closeCustomSelect(instance);
    }
  });
}

function handleCustomSelectKeydown(event) {
  if (event.key === 'Escape') {
    customSelectInstances.forEach(instance => closeCustomSelect(instance));
  }
}
