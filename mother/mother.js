let imageURL = "mother.jpg";

let bgCanvas;

window.onload = async function run() {
    bgCanvas = await crop(imageURL, 1/1);
    let rgb = getAverageColor(bgCanvas, 0, 0, bgCanvas.width, bgCanvas.height);
    document.getElementById("p").style.backgroundColor = 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')';
}

async function activate(id) {
    let buttons = document.getElementsByTagName("p")
    for (let button of buttons) {
        button.removeAttribute("active");
    }
    document.getElementById(id).setAttribute("active", "");
    switch (id) {
        case ("qr"):
            imageURL = "qr.jpg"
            break;
        case ("banana"):
            imageURL = "banana.jpg"
            break;
    }
    
    bgCanvas = await crop(imageURL, 1/1);
    let rgb = getAverageColor(bgCanvas, 0, 0, bgCanvas.width, bgCanvas.height);
    let p = document.getElementById("p");
    p.innerHTML = "";
    p.setAttribute("onmouseout", "getMouseEnter(this.id);");
    p.style.backgroundColor = 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')';
}

async function split(id) {
    if (document.getElementById(id).getBoundingClientRect().width > Math.ceil(document.getElementById("p").offsetWidth / bgCanvas.width)) {
        let idElement = document.getElementById(id);
        for (let i = 0; i < 4; i++){
            let div = document.createElement("div");
            div.setAttribute("id", id + "_" + i);
            div.setAttribute("onmouseout", "getMouseEnter(this.id);");
            idElement.appendChild(div);
            let rgb = await setAverageColor(document.getElementById(div.getAttribute("id")));
            document.getElementById(div.getAttribute("id")).style.backgroundColor = 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')';
        }
        idElement.style.backgroundColor = "transparent";
        idElement.removeAttribute("onmouseenter");
    }
}

function getMouseEnter(id) {
    let idElement = document.getElementById(id);
    idElement.setAttribute("onmouseenter", "split(this.id);");
    idElement.removeAttribute("onmouseout");
}

async function setAverageColor(div) {
    let p = document.getElementById("p");

    let x = (div.getBoundingClientRect().left - p.getBoundingClientRect().left) 
    / (p.offsetWidth / bgCanvas.width);

    let y = (div.getBoundingClientRect().top - p.getBoundingClientRect().top)
    / (p.offsetHeight / bgCanvas.height);

    let preWidth = bgCanvas.width * (div.getBoundingClientRect().width / p.offsetWidth);
    let relWidth = (preWidth > Math.ceil(p.offsetWidth / bgCanvas.width)) 
    ? preWidth : Math.ceil(p.offsetWidth / bgCanvas.width);

    let preHeight = bgCanvas.height * (div.getBoundingClientRect().height / p.offsetHeight);
    let relHeight = (preHeight > Math.ceil(p.offsetHeight / bgCanvas.height)) 
    ? preHeight : Math.ceil(p.offsetHeight / bgCanvas.height);

    let rgb = getAverageColor(bgCanvas, x, y, relWidth, relHeight);
    return rgb;
    
}

function getAverageColor(canvas, x, y, width, height) {
    let count = 0;
    let i = -4;
    let blockSize = 4;
    let rgb = {r: 0, g: 0, b: 0};
    let context = canvas.getContext && canvas.getContext("2d", { willReadFrequently: true });
    let data = context.getImageData(x, y, width, height);

    let length = data.data.length;

    while ( (i += blockSize * 4) < length ) {
        ++count;
        rgb.r += data.data[i];
        rgb.g += data.data[i+1];
        rgb.b += data.data[i+2];
    }

    // ~~ used to floor values
    rgb.r = ~~(rgb.r/count);
    rgb.g = ~~(rgb.g/count);
    rgb.b = ~~(rgb.b/count);

    return rgb;
}

function crop(url, aspectRatio) {
    // we return a Promise that gets resolved with our canvas element
    return new Promise((resolve) => {
        // this image will hold our source image data
        const inputImage = new Image();

        // we want to wait for our image to load
        inputImage.onload = () => {
            // let's store the width and height of our image
            const inputWidth = inputImage.naturalWidth;
            const inputHeight = inputImage.naturalHeight;

            // get the aspect ratio of the input image
            const inputImageAspectRatio = inputWidth / inputHeight;

            // if it's bigger than our target aspect ratio
            let outputWidth = inputWidth;
            let outputHeight = inputHeight;
            if (inputImageAspectRatio > aspectRatio) {
                outputWidth = inputHeight * aspectRatio;
            } else if (inputImageAspectRatio < aspectRatio) {
                outputHeight = inputWidth / aspectRatio;
            }

            // calculate the position to draw the image at
            const outputX = (outputWidth - inputWidth) * 0.5;
            const outputY = (outputHeight - inputHeight) * 0.5;

            // create a canvas that will present the output image
            const outputImage = document.createElement('canvas');

            // set it to the same size as the image
            outputImage.width = outputWidth;
            outputImage.height = outputHeight;

            // draw our image at position 0, 0 on the canvas
            const ctx = outputImage.getContext('2d', { willReadFrequently: true });
            ctx.drawImage(inputImage, outputX, outputY);
            resolve(outputImage);
        };

        // start loading our image
        inputImage.src = url;
    });
}