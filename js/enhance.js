const inputField = document.getElementById('inputField');
const outputField = document.getElementById('outputField');
const mainCopy = document.getElementById('mainCopy');
const clear = document.getElementById('clear');
const paste = document.getElementById('paste');
const convert = document.getElementById('convert');

const removeNewlineCheck = document.getElementById('removeNewlineCheck');
const spaceTabCheck = document.getElementById('spaceTabCheck');
const newLineCheck = document.getElementById('newLineCheck');
const sentence2ParagraphCheck = document.getElementById('sentence2ParagraphCheck');
const foot2ParagraphCheck = document.getElementById('foot2ParagraphCheck');

const separatedParagraphsContainer = document.getElementById('separatedParagraphsContainer');

let convertingMode = document.querySelector('input[name="convertingMode"]:checked').value;

window.onload = () => {
    changeFont();
    changeConvertingMode();
    loadConvertedText();
}

clear.addEventListener('click', () => {
    inputField.value = '';
    enhance(inputField, outputField);
});

paste.addEventListener('click', async () => {
    if (navigator.clipboard && navigator.clipboard.readText) {
        const clipboardText = await navigator.clipboard.readText();
        inputField.value += clipboardText;
        if (convertingMode == 'auto') {
            enhance(inputField, outputField);
        }
    }
});

convert.addEventListener('click', () => {
    enhance(inputField, outputField);

    const mainElement = document.getElementsByTagName('main')[0];
    mainElement.scrollTo({
        top: mainElement.scrollHeight,
        behavior: 'smooth'
    });

});

[removeNewlineCheck, spaceTabCheck, newLineCheck, sentence2ParagraphCheck, foot2ParagraphCheck].forEach(check => {
    check.addEventListener('change', handleEnhance);
});

mainCopy.addEventListener('click', () => {
    if (mainCopy.classList.contains('disabled')) {
        return;
    }

    navigator.clipboard.writeText(outputField.value);
    mainCopy.innerHTML = 'Copied!';
    setTimeout(() => {
        mainCopy.innerHTML = '<i class="fa-regular fa-copy"></i><span>Copy All</span>';
    }, 2000);
});

document.querySelectorAll('input[name="convertingMode"]').forEach(mode => {
    mode.addEventListener('change', () => {
        convertingMode = mode.value;
        changeConvertingMode();
    });
});

function changeFont() {
    const font = document.getElementById('enhanceFont').value;

    inputField.style.fontFamily = font;
    outputField.style.fontFamily = font;
    separatedParagraphsContainer.style.fontFamily = font;
}

function changeConvertingMode() {
    if (convertingMode == 'auto') {
        convert.style.visibility = 'hidden';

        inputField.addEventListener("keyup", handleEnhance);
    }
    else if (convertingMode == 'manual') {
        convert.style.visibility = 'visible';

        inputField.removeEventListener("keyup", handleEnhance);
    }
}

function loadConvertedText() {
    let convertedText = sessionStorage.getItem('convertedText');

    if (convertedText) {
        inputField.value = convertedText;
        sessionStorage.removeItem('convertedText');
        enhance(inputField, outputField);
    }
}

function enhance(inText, outText) {
    let enhancedTexts = `${inText.value}`.replace(/\n{2,}/gm, '\n').replaceAll(/\n(?=\s*$)/gm, '');

    if (removeNewlineCheck.checked) {
        enhancedTexts = [enhancedTexts.replaceAll(/\n/gm, '')];
    }
    else {
        enhancedTexts = enhancedTexts.split('\n');
    }

    enhancedTexts = enhancedTexts.map((enhancedText) => {
        for (let i = 0; i < exps.length; i++) {
            enhancedText = enhancedText.replaceAll(exps[i][0], exps[i][1]);
        }
        return enhancedText.trim();
    });

    if (spaceTabCheck.checked) {
        enhancedTexts = enhancedTexts.map((enhancedText) => {
            return `    ${enhancedText}`;
        });
    }

    if (newLineCheck.checked) {
        let arr = [];
        enhancedTexts.forEach((enhancedText) => {
            arr = arr.concat(enhancedText.split('.'));
        });

        arr = arr.filter((enhancedText) => {
            return enhancedText != '';
        });

        arr = arr.map((enhancedText) => {
            if (!enhancedText.match(/@$/)) {
                return `${enhancedText}.`;
            }
            else {
                return enhancedText;
            }
        });

        arr = arr.map((enhancedText) => {
            if (enhancedText.match(/\s{4}/)) {
                return enhancedText;
            }
            else {
                return enhancedText.trim();
            }
        });

        arr = arr.filter((enhancedText) => {
            return enhancedText != '.';
        });

        enhancedTexts = arr;
    }

    if (foot2ParagraphCheck.checked) {
        let arr = [];

        enhancedTexts.forEach((enhancedText) => {
            let parts = enhancedText.split('@');

            parts.forEach((rawPart, index) => {
                // Split at ". " (preserving punctuation)
                let subParts = rawPart.split(/(?<=\.)\s+/);

                subParts.forEach((subPart, subIndex) => {
                    let hasNextAt = index < parts.length - 1;
                    let isLastSubPart = subIndex === subParts.length - 1;

                    // Preserve only 4-space indentation, strip other leading spaces
                    subPart = subPart.replace(/^(?! {4})\s+/, '');

                    // Remove trailing spaces to avoid "  @\n"
                    subPart = subPart.replace(/\s+$/, '');

                    // Determine appropriate suffix
                    let suffix = (hasNextAt && isLastSubPart) ? ' @' : '';

                    // Skip empty parts (e.g. trailing @)
                    if (subPart.trim() !== '') {
                        arr.push(subPart + suffix);
                    }
                });
            });
        });

        enhancedTexts = arr;
    }

    if (sentence2ParagraphCheck.checked) {
        let separatedParagraphs = [];
        let paragraph = [];

        enhancedTexts.forEach(separatedParagraph => {
            paragraph.push(separatedParagraph);

            if (separatedParagraph.includes('.')) {
                separatedParagraphs.push(paragraph);
                paragraph = [];
            }
        });

        if (paragraph.length > 0) {
            separatedParagraphs.push(paragraph);
        }

        createSeparatedParagraphs(separatedParagraphs);
    }

    outText.value = enhancedTexts.join('\n');
}

function handleEnhance() {
    enhance(inputField, outputField);
}

function createSeparatedParagraphs(separatedParagraphs = []) {
    separatedParagraphsContainer.innerHTML = '';
    separatedParagraphs.forEach(separatedParagraph => {
        const separatedParagraphElement = document.createElement('div');
        separatedParagraphElement.classList.add('separated-paragraph');

        const separatedParagraphTextElement = document.createElement('div');
        separatedParagraphTextElement.classList.add('separated-paragraph-text');
        separatedParagraphTextElement.textContent = separatedParagraph.join('\n');

        const separatedParagraphControls = document.createElement('div');
        separatedParagraphControls.classList.add('separated-paragraph-controls');

        const delButton = document.createElement('div');
        delButton.classList.add('delete-button', 'button');

        const delIcon = document.createElement('i');
        delIcon.classList.add('fa-regular', 'fa-trash-can');
        delButton.appendChild(delIcon);

        delButton.addEventListener('click', () => {
            separatedParagraphElement.classList.add('deleted');

            setTimeout(() => {
                separatedParagraphElement.remove();
            }, 1000);
        });
        separatedParagraphControls.appendChild(delButton);


        const copyButton = document.createElement('div');
        copyButton.classList.add('copy-button', 'button');

        const copyIcon = document.createElement('i');
        copyIcon.classList.add('fa-regular', 'fa-copy');
        copyButton.appendChild(copyIcon);

        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(separatedParagraphTextElement.textContent.replaceAll(/\n(?=\s*$)/gm, ''));

            copyIcon.classList.replace('fa-regular', 'fa-solid');
            copyIcon.classList.replace('fa-copy', 'fa-check');
            setTimeout(() => {
                copyIcon.classList.replace('fa-solid', 'fa-regular');
                copyIcon.classList.replace('fa-check', 'fa-copy');
            }, 2000);
        });

        separatedParagraphControls.appendChild(copyButton);

        separatedParagraphElement.appendChild(separatedParagraphTextElement);
        separatedParagraphElement.appendChild(separatedParagraphControls);
        separatedParagraphsContainer.appendChild(separatedParagraphElement);
    });
    
}