const inputField = document.getElementById('inputField');
const outputField = document.getElementById('outputField');
const clear = document.getElementById('clear');
const paste = document.getElementById('paste');
const convertBtn = document.getElementById('convert');
const mainCopy = document.getElementById('mainCopy');
const mainEnhace = document.getElementById('mainEnhance');

const removeNewlineCheck = document.getElementById('removeNewlineCheck');
const spaceTabCheck = document.getElementById('spaceTabCheck');
const newLineCheck = document.getElementById('newLineCheck');
const sentence2ParagraphCheck = document.getElementById('sentence2ParagraphCheck');
const foot2ParagraphCheck = document.getElementById('foot2ParagraphCheck');

const separatedParagraphsContainer = document.getElementById('separatedParagraphsContainer');

let convertingMode = document.querySelector('input[name="convertingMode"]:checked').value;

window.onload = () => {
    changeConvertionFont();
    changeConvertingMode();
}

clear.addEventListener('click', () => {
    inputField.value = '';
    convert(inputField, outputField);
});

paste.addEventListener('click', async () => {
    if (navigator.clipboard && navigator.clipboard.readText) {
        const clipboardText = await navigator.clipboard.readText();
        inputField.value += clipboardText;
        if (convertingMode == 'auto') {
            convert(inputField, outputField);
        }
    }
});

convertBtn.addEventListener('click', () => {
    convert(inputField, outputField);

    const mainElement = document.getElementsByTagName('main')[0];
    mainElement.scrollTo({
        top: mainElement.scrollHeight,
        behavior: 'smooth'
    });

});

[removeNewlineCheck, spaceTabCheck, newLineCheck, sentence2ParagraphCheck, foot2ParagraphCheck].forEach(check => {
    check.addEventListener('change', handleConvertion);
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

mainEnhace.addEventListener('click', () => {
    sessionStorage.setItem('convertedText', outputField.value);
    window.location.href = '../enhance/';
});

document.querySelectorAll('input[name="convertingMode"]').forEach(mode => {
    mode.addEventListener('change', () => {
        convertingMode = mode.value;
        changeConvertingMode();
    });
});

function changeConvertionFont() {
    const inputfont = document.getElementById('inputFont').value;
    const outputfont = document.getElementById('outputFont').value;

    inputField.style.fontFamily = inputfont;
    outputField.style.fontFamily = outputfont;
    separatedParagraphsContainer.style.fontFamily = outputfont;
}

function changeConvertingMode() {
    if (convertingMode == 'auto') {
        convertBtn.style.visibility = 'hidden';
        inputField.addEventListener("keyup", handleConvertion);
    }
    else if (convertingMode == 'manual') {
        convertBtn.style.visibility = 'visible';
        inputField.removeEventListener("keyup", handleConvertion);
    }
}

function convert(inText, outText) {
    const inFontDict = getDict(inText.style.fontFamily);
    const outFontDict = getDict(outText.style.fontFamily);

    if (!inFontDict || !outFontDict) {
        console.error("Invalid font selection!");
        return;
    }

    let inputText = inText.value.trim();
    let tempText = "";
    let outputText = "";

    // Convert input text into an array of characters
    let inputArray = inputText.split("");

    // To Standard (Abba Iwannyc)
    for (let char of inputArray) {
        tempText += Object.keys(inFontDict)[Object.values(inFontDict).indexOf(char)] || char;
    }

    // Convert from standard to output font
    let tempArray = tempText.split("");
    for (let char of tempArray) {
        outputText += Object.values(outFontDict)[Object.keys(outFontDict).indexOf(char)] || char;
    }

    let convertedTexts = `${outputText}`.replace(/\n{2,}/gm, '\n').replaceAll(/\n(?=\s*$)/gm, '');

    if (removeNewlineCheck.checked) {
        convertedTexts = [convertedTexts.replaceAll(/\n/gm, '')];
    }
    else {
        convertedTexts = convertedTexts.split('\n');
    }

    if (spaceTabCheck.checked) {
        convertedTexts = convertedTexts.map((convertedText) => {
            return `    ${convertedText}`;
        });
    }

    if (newLineCheck.checked) {
        let arr = [];
        convertedTexts.forEach((convertedText) => {
            arr = arr.concat(convertedText.split('.'));
        });

        arr = arr.filter((convertedText) => {
            return convertedText != '';
        });

        arr = arr.map((convertedText) => {
            if (!convertedText.match(/@$/)) {
                return `${convertedText}.`;
            }
            else {
                return convertedText;
            }
        });

        arr = arr.map((convertedText) => {
            if (convertedText.match(/\s{4}/)) {
                return convertedText;
            }
            else {
                return convertedText.trim();
            }
        });

        arr = arr.filter((convertedText) => {
            return convertedText != '.';
        });

        convertedTexts = arr;
    }

    if (foot2ParagraphCheck.checked) {
        let arr = [];

        convertedTexts.forEach((convertedText) => {
            let parts = convertedText.split('@');

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

        convertedTexts = arr;
    }

    if (sentence2ParagraphCheck.checked) {
        let separatedParagraphs = [];
        let paragraph = [];

        convertedTexts.forEach(separatedParagraph => {
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

    outText.value = convertedTexts.join('\n');
}

function handleConvertion() {
    convert(inputField, outputField);
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