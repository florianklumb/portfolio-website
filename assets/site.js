'use strict';

// Page navigation uses ordinary links. JavaScript only enhances image and slide views.
document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('portfolio');
  if (!root) return;

  const dialog = root.querySelector('[data-image-dialog]');
  if (dialog) {
    const closeButton = dialog.querySelector('[data-close-image]');
    const image = dialog.querySelector('img');
    const caption = dialog.querySelector('[data-image-caption]');
    const scrollArea = dialog.querySelector('[data-image-scroll]');
    let opener;
    let backdropPressed = false;

    const close = () => { if (dialog.open) dialog.close(); };
    const outside = (event) => {
      const box = dialog.getBoundingClientRect();
      return event.clientX < box.left || event.clientX > box.right ||
        event.clientY < box.top || event.clientY > box.bottom;
    };

    root.querySelectorAll('[data-image-open]').forEach((button) => {
      button.addEventListener('click', () => {
        const source = button.querySelector('img');
        if (!source) return;
        opener = button;
        image.src = source.src;
        image.alt = source.alt;
        caption.textContent = source.alt;
        dialog.dataset.portrait = String(button.hasAttribute('data-image-portrait'));
        dialog.showModal();
        document.documentElement.classList.add('is-viewing-image');
        scrollArea.scrollTop = 0;
        closeButton.focus({ preventScroll: true });
      });
    });

    closeButton.addEventListener('click', close);
    dialog.addEventListener('pointerdown', (event) => { backdropPressed = outside(event); });
    dialog.addEventListener('click', (event) => {
      if (backdropPressed && outside(event)) close();
      backdropPressed = false;
    });
    dialog.addEventListener('cancel', (event) => { event.preventDefault(); close(); });
    dialog.addEventListener('close', () => {
      document.documentElement.classList.remove('is-viewing-image');
      opener?.focus({ preventScroll: true });
    });
  }

  root.querySelectorAll('[data-slide-deck]').forEach((deck) => {
    const selected = deck.querySelector('[data-slide-main] img');
    const status = deck.querySelector('[data-slide-status]');
    deck.querySelectorAll('[data-slide]').forEach((button) => {
      button.addEventListener('click', () => {
        deck.querySelectorAll('[data-slide]').forEach((item) => {
          item.setAttribute('aria-pressed', String(item === button));
        });
        const source = button.querySelector('img');
        selected.src = source.src;
        selected.alt = `Folie ${button.dataset.slide}: ${source.alt}`;
        status.textContent = `Folie ${button.dataset.slide} von ${deck.dataset.slideCount} · ${source.alt}`;
      });
    });
  });
});
