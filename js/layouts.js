function enhancerLayout() {
    // Create the main container
    const appBody = document.createElement('div');
    appBody.className = 'app-body enhancer-app';

    // Create in-field section
    const inField = document.createElement('div');
    inField.className = 'in-field';

    const inFieldContainer = document.createElement('div');
    inFieldContainer.className = 'field';

    const inTextArea = document.createElement('textarea');
    inTextArea.id = 'inText';
    inTextArea.placeholder = 'Enter Your Text';
    inTextArea.addEventListener('keyup', () => {
        enhance(inTextArea, outTextArea, copyButton);
        if (!inTextArea.value) {
            copyButton.classList.add('disabled');
            downloadButton.classList.add('disabled');
        } else {
            copyButton.classList.remove('disabled');
            downloadButton.classList.remove('disabled');
        }
    });

    const inFieldControl = document.createElement('div');
    inFieldControl.className = 'field-control';

    const inCustomSelect = createCustomSelect('inFont', 'inFontList', [
        'Abba Iwannyc (standard type)',
        'CS New Athanasius (standard type)',
        'Avva Shenouda (standard type)',
        'Athanasius',
    ]);

    const pasteButton = document.createElement('button');
    pasteButton.id = 'paste';
    pasteButton.textContent = 'Paste';
    pasteButton.addEventListener('click', async () => {
        if (navigator.clipboard && navigator.clipboard.readText) {
            const clipboardText = await navigator.clipboard.readText();
            inTextArea.value = clipboardText;
            enhance(inTextArea, outTextArea, copyButton);
        }
    });

    inFieldControl.appendChild(inCustomSelect);
    inFieldControl.appendChild(pasteButton);

    inFieldContainer.appendChild(inTextArea);
    inFieldContainer.appendChild(inFieldControl);
    inField.appendChild(inFieldContainer);

    // Create out-field section
    const outField = document.createElement('div');
    outField.className = 'out-field';

    const outFieldContainer = document.createElement('div');
    outFieldContainer.className = 'field';

    const outTextArea = document.createElement('textarea');
    outTextArea.id = 'outText';
    outTextArea.placeholder = 'New Text';
    outTextArea.disabled = true;

    const outFieldControl = document.createElement('div');
    outFieldControl.className = 'field-control';

    const downloadButton = document.createElement('button');
    downloadButton.id = 'download';
    downloadButton.textContent = 'Download';
    downloadButton.classList.add('disabled');
    downloadButton.addEventListener('click', () => {
        download(outTextArea.value);
    });

    const copyButton = document.createElement('button');
    copyButton.id = 'copy';
    copyButton.textContent = 'Copy';
    copyButton.classList.add('disabled');
    copyButton.addEventListener('click', () => {
        if (copyButton.classList.contains('disabled')) {
            return;
        }
    
        navigator.clipboard.writeText(outTextArea.value);
        copyButton.innerHTML = 'Copied!';
        setTimeout(() => {
            copyButton.innerHTML = 'Copy';
        }, 2000);
    });

    outFieldControl.appendChild(downloadButton);
    outFieldControl.appendChild(copyButton);

    outFieldContainer.appendChild(outTextArea);
    outFieldContainer.appendChild(outFieldControl);
    outField.appendChild(outFieldContainer);

    // Append everything to appBody
    appBody.appendChild(inField);
    appBody.appendChild(outField);

    // Append appBody to the document body

    function createCustomSelect(buttonId, listId, options) {
        const customSelect = document.createElement('div');
        customSelect.className = 'custom-select';
    
        const selectButton = document.createElement('button');
        selectButton.className = 'select-button';
        selectButton.id = buttonId;
        selectButton.value = options[0].split(' (')[0]; // Set initial value
    
        const selectedValue = document.createElement('span');
        selectedValue.className = 'selected-value';
        selectedValue.textContent = options[0].split(' (')[0];
    
        const arrow = document.createElement('span');
        arrow.className = 'arrow';
        arrow.innerHTML = '<i class="fa-solid fa-caret-down"></i>';
    
        selectButton.appendChild(selectedValue);
        selectButton.appendChild(arrow);
    
        const selectDropdown = document.createElement('ul');
        selectDropdown.className = 'select-dropdown hidden';
        selectDropdown.id = listId;
    
        options.forEach((option, index) => {
            const li = document.createElement('li');
            if (index === 0) li.className = 'selected';
            li.innerHTML = `<span class="font-name">${option.split(' (')[0]}</span> ${option.includes('(') ? option.match(/\(.*\)/)[0] : ''}`;
            
            li.addEventListener('click', () => {
                const chosenValue = option.split(' (')[0];
    
                // Update the selected value
                selectedValue.textContent = chosenValue;
                selectButton.value = chosenValue; // Set button value
                
                // Mark as selected
                Array.from(selectDropdown.children).forEach((item) => item.classList.remove('selected'));
                li.classList.add('selected');
    
                // Hide the dropdown
                selectDropdown.classList.add('hidden');
                arrow.children[0].classList.remove('rotate');
            });
    
            selectDropdown.appendChild(li);
        });
        selectButton.classList.add('disabled');
        selectButton.addEventListener('click', (e) => {
            return false;
            e.stopPropagation(); // Prevent the click event from propagating
            selectDropdown.classList.toggle('hidden');
            arrow.children[0].classList.toggle('rotate');
        });
    
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!customSelect.contains(e.target)) {
                selectDropdown.classList.add('hidden');
                arrow.children[0].classList.remove('rotate');
            }
        });
    
        customSelect.appendChild(selectButton);
        customSelect.appendChild(selectDropdown);
    
        return customSelect;
    }  

    return appBody;
}

function convertorLayout() {
    // Create the main container
    const appBody = document.createElement('div');
    appBody.className = 'app-body convertor-app';

    // Create in-field section
    const inField = document.createElement('div');
    inField.className = 'in-field';

    const inFieldContainer = document.createElement('div');
    inFieldContainer.className = 'field';

    const inTextArea = document.createElement('textarea');
    inTextArea.id = 'inText';
    inTextArea.placeholder = 'Enter Your Text';
    inTextArea.addEventListener('keyup', () => {
        convert(inTextArea, outTextArea, inCustomSelect, outCustomSelect, copyButton);
        if (!inText.value) {
            copyButton.classList.add('disabled');
            downloadButton.classList.add('disabled');
        } else {
            copyButton.classList.remove('disabled');
            downloadButton.classList.remove('disabled');
        }
    });

    const inFieldControl = document.createElement('div');
    inFieldControl.className = 'field-control';

    const inCustomSelect = createCustomSelect('inFont', 'inFontList', [
        'Abba Iwannyc (standard type)',
        // 'CS New Athanasius (standard type)',
        // 'Avva Shenouda (standard type)',
        'Athanasius',
    ]);

    const pasteButton = document.createElement('button');
    pasteButton.id = 'paste';
    pasteButton.textContent = 'Paste';
    pasteButton.addEventListener('click', async () => {
        if (navigator.clipboard && navigator.clipboard.readText) {
            const clipboardText = await navigator.clipboard.readText();
            inText.value = clipboardText;
            convert(inTextArea, outTextArea, inCustomSelect, outCustomSelect, copyButton);
        }
    });

    inFieldControl.appendChild(inCustomSelect);
    inFieldControl.appendChild(pasteButton);

    inFieldContainer.appendChild(inTextArea);
    inFieldContainer.appendChild(inFieldControl);
    inField.appendChild(inFieldContainer);

    // Create out-field section
    const outField = document.createElement('div');
    outField.className = 'out-field';

    const outFieldContainer = document.createElement('div');
    outFieldContainer.className = 'field';

    const outTextArea = document.createElement('textarea');
    outTextArea.id = 'outText';
    outTextArea.placeholder = 'New Text';
    outTextArea.disabled = true;

    const outFieldControl = document.createElement('div');
    outFieldControl.className = 'field-control';

    const outCustomSelect = createCustomSelect('outFont', 'outFontList', [
        'Abba Iwannyc (standard type)',
        // 'CS New Athanasius (standard type)',
        // 'Avva Shenouda (standard type)',
        'Athanasius',
    ]);

    const downloadButton = document.createElement('button');
    downloadButton.id = 'download';
    downloadButton.className = 'disabled';
    downloadButton.textContent = 'Download';
    downloadButton.addEventListener('click', () => {
        download(outTextArea.value);
    });

    const copyButton = document.createElement('button');
    copyButton.id = 'copy';
    copyButton.textContent = 'Copy';
    copyButton.classList.add('disabled');
    copyButton.addEventListener('click', () => {
        if (copyButton.classList.contains('disabled')) {
            return;
        }
    
        navigator.clipboard.writeText(outTextArea.value);
        copyButton.innerHTML = 'Copied!';
        setTimeout(() => {
            copyButton.innerHTML = 'Copy';
        }, 2000);
    });

    outFieldControl.appendChild(outCustomSelect);
    outFieldControl.appendChild(downloadButton);
    outFieldControl.appendChild(copyButton);

    outFieldContainer.appendChild(outTextArea);
    outFieldContainer.appendChild(outFieldControl);
    outField.appendChild(outFieldContainer);

    // Append everything to appBody
    appBody.appendChild(inField);
    appBody.appendChild(outField);

    function createCustomSelect(buttonId, listId, options) {
        const customSelect = document.createElement('div');
        customSelect.className = 'custom-select';
    
        const selectButton = document.createElement('button');
        selectButton.className = 'select-button';
        selectButton.id = buttonId;
        selectButton.value = options[0].split(' (')[0]; // Set initial value
    
        const selectedValue = document.createElement('span');
        selectedValue.className = 'selected-value';
        selectedValue.textContent = options[0].split(' (')[0];
    
        const arrow = document.createElement('span');
        arrow.className = 'arrow';
        arrow.innerHTML = '<i class="fa-solid fa-caret-down"></i>';
    
        selectButton.appendChild(selectedValue);
        selectButton.appendChild(arrow);
    
        const selectDropdown = document.createElement('ul');
        selectDropdown.className = 'select-dropdown hidden';
        selectDropdown.id = listId;
    
        options.forEach((option, index) => {
            const li = document.createElement('li');
            if (index === 0) li.className = 'selected';
            li.innerHTML = `<span class="font-name">${option.split(' (')[0]}</span> ${option.includes('(') ? option.match(/\(.*\)/)[0] : ''}`;
            
            li.addEventListener('click', () => {
                // Update the button text and value
                selectedValue.textContent = option.split(' (')[0];
                selectButton.value = option.split(' (')[0]; // Set button's value to selected option
                
                // Remove previous selection and mark the new one
                selectDropdown.querySelectorAll('li').forEach(item => item.classList.remove('selected'));
                li.classList.add('selected');
    
                // Hide the dropdown
                selectDropdown.classList.add('hidden');
                arrow.children[0].classList.remove('rotate');
                convert(inTextArea, outTextArea, inCustomSelect, outCustomSelect, copyButton);
            });
    
            selectDropdown.appendChild(li);
        });
    
        // Toggle dropdown on button click
        selectButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent click event from propagating
            selectDropdown.classList.toggle('hidden');
            arrow.children[0].classList.toggle('rotate');
        });
    
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!customSelect.contains(e.target)) {
                selectDropdown.classList.add('hidden');
                arrow.children[0].classList.remove('rotate');
            }
        });
    
        customSelect.appendChild(selectButton);
        customSelect.appendChild(selectDropdown);
    
        return customSelect;
    }
    
    
    return appBody;
}