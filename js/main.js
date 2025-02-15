const enhancer = document.getElementById('enhancer');
const convertor = document.getElementById('convertor');

window.onload = () => {
    changeContent(enhancerLayout());
    document.getElementById('inText').focus();
};

function changeContent(content) {
    document.getElementById('appBody').innerHTML = '';
    document.getElementById('appBody').appendChild(content);
}

function enhance(inText, outText, copy) {
    let inputText = `${inText.value}`;
    let enhancedText = inputText.trim();
    
    for (let i = 0; i < exps.length; i++) {
        enhancedText = enhancedText.replaceAll(exps[i][0], exps[i][1]);
    }
    
    outText.value = enhancedText;

    if (!enhancedText) {
        copy.classList.add('disabled');
    }
    else {
        copy.classList.remove('disabled');
    }
}

enhancer.addEventListener('click', () => {
    changeContent(enhancerLayout());
    enhancer.classList.add('active');
    convertor.classList.remove('active');
    document.getElementById('inText').focus();
});

convertor.addEventListener('click', () => {
    changeContent(convertorLayout());
    convertor.classList.add('active');
    enhancer.classList.remove('active');
    document.getElementById('inText').focus();
});

function convert(inText, outText, inCustomSelect, outCustomSelect, copy) {
    let inFont = inCustomSelect.children[0].value.trim().replaceAll(' ', '');
    let outFont = outCustomSelect.children[0].value.trim().replaceAll(' ', '');

    let inFontArray = dicts[inFont];
    let outFontArray = dicts[outFont];

    if (!inFontArray || !outFontArray) {
        console.error("Invalid font selection.");
        return;
    }

    inText.style.fontFamily = inCustomSelect.children[0].value.trim().replaceAll(' ', '-');
    outText.style.fontFamily = outCustomSelect.children[0].value.trim().replaceAll(' ', '-');

    let inputText = inText.value.trim();
    let tempText = "";
    let outputText = "";

    if (!inputText) {
        copy.classList.add('disabled');
        outText.value = "";
        return;
    }
    else {
        copy.classList.remove('disabled');
    }

    // Step 1: Convert input text into an array of characters
    let inputArray = inputText.split("");

    // To Standard (Abba Iwannyc)
    for (let char of inputArray) {
        tempText += Object.keys(inFontArray)[Object.values(inFontArray).indexOf(char)] || char;
    }

    // Convert from standard to output font
    let tempArray = tempText.split("");
    for (let char of tempArray) {
        outputText += Object.values(outFontArray)[Object.keys(outFontArray).indexOf(char)] || char;
    }

    outText.value = outputText;
    // console.log("Input:", inputText, "-> Output:", outputText);
}

function download(txt = '') {
    msgBox.prompt('Enter File Name', 'text', (fileName) => downloadTextFile(fileName, txt));
}

function downloadTextFile(fileName, txt) {
    // Create a Blob with the text content
    const blob = new Blob([txt], { type: "text/plain" });
    
    // Create a temporary anchor element
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = fileName.endsWith(".txt") ? fileName : fileName + ".txt";
    
    // Append anchor to body, trigger download, and remove it
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Revoke the blob URL to free memory
    URL.revokeObjectURL(a.href);
}