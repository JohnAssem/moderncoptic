const customSelects = document.querySelectorAll('.custom-select');

customSelects.forEach(customSelect => {
    const button = customSelect.children[0];
    const ul = customSelect.children[1];

    // Disable enhance font
    if (button.id == 'enhanceFont') {
        return;
    }

    button.addEventListener('click', () => {
        ul.classList.toggle('hidden');
    });

    Array.from(ul.children).forEach(li => {
        li.addEventListener('click', () => {
            Array.from(ul.children).forEach(li => li.classList.remove('selected'));
            li.classList.add('selected');

            button.value = li.children[0].textContent.replaceAll(' ', '-').toLowerCase();
            button.children[0].textContent = li.children[0].textContent;
            ul.classList.add('hidden');

            if (button.id == 'enhanceFont') {
                changeFont();
            }

            if (button.id == 'inputFont' || button.id == 'outputFont') {
                changeConvertionFont();
            }
        });

    });

    document.addEventListener('click', (e) => {
        if (!customSelect.contains(e.target)) {
            ul.classList.add('hidden');
        }
    });
});