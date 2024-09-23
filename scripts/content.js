let index = 0;
let prompts = []; // array that will hold all the prompt elements
let nl = null; // nodelist that will hold all prompt elements and their responses
let firstTime = true; 
let keybind = false;
let currentUrl = window.location.href;

// overlay element creation (when the user hits ctrl + s to search for a prompt)
const overlay = document.createElement("div");
overlay.style.position = "fixed";
overlay.style.top = "25%";
overlay.style.left = "25%";
overlay.style.width = "50%";
overlay.style.height = "50%";
overlay.style.backgroundColor = "rgb(24, 24, 27)";
overlay.style.color = "white";
overlay.style.display = "flex";
overlay.style.alignItems = "center";
overlay.style.justifyContent = "center";
overlay.style.borderRadius = "10px";
overlay.style.zIndex = "9999"; // Ensure it's on top of other content
overlay.style.fontSize = "20px";
overlay.style.fontFamily = "system-ui, sans-serif, arial";
overlay.style.paddingTop = "5px";
overlay.style.paddingBottom = "5px";
const promptHolder = document.createElement("div");
promptHolder.style.display = "flex";
promptHolder.style.flexDirection = "column";
promptHolder.style.width = "100%";
promptHolder.style.height = "100%";
promptHolder.style.overflowY = "scroll";
promptHolder.style.borderRadius = "10px";
overlay.appendChild(promptHolder);

function move(i) {
    let target = prompts[i];
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    index = i;
    keybind = false;
    document.body.removeChild(overlay);
}

function refreshOverlay() {
    promptHolder.innerHTML = '';
    prompts.map((prompt, index) => {
        let lines = prompt.innerText.split("\n");
        let temp = document.createElement("button");
        temp.style.flex = "1";
        temp.style.width = "100%";
        temp.style.height = "100%";
        if(index != prompts.length - 1) {
            temp.style.borderBottom = "1px solid white";
        }
        temp.style.textAlign = "left";
        temp.style.paddingLeft = "8px";
        temp.style.paddingRight = "8px";
        temp.setAttribute("id", index);
        temp.addEventListener("click", () => move(index));
        let tempText = document.createTextNode(lines[1]);
        temp.appendChild(tempText);
        promptHolder.appendChild(temp);
    });
}

function updatePrompts() {
    nl = document.querySelectorAll("article");
    prompts = [];
    for (let i = 0; i < nl.length; i += 2) {
        prompts.push(nl.item(i));
    }
}

function moveUp() {
    if (index - 1 >= 0) {
        index--;
    }
    prompts[index].scrollIntoView({ behavior: "smooth", block: "center" });
}

function moveDown() {
    if (index + 1 < prompts.length) {
        index++;
    }
    prompts[index].scrollIntoView({ behavior: "smooth", block: "center" });
}

// handle arrowkey up/down
document.addEventListener("keydown", (event) => {
    if(window.location.href != currentUrl) {
        firstTime = true;
        currentUrl = window.location.href;
    }
    updatePrompts();
    if (firstTime) {
        // used to update the index for the first time
        index = prompts.length;
        firstTime = false;
    }
    if (event.key == "ArrowUp") {
        moveUp();
    }
    if (event.key == "ArrowDown") {
        moveDown();
    }
    if (event.key == "Enter") {
        index = prompts.length - 1; // a new prompt is entered so we need to update the index accordingly
    }
    if (event.ctrlKey && event.key == "s") {
        refreshOverlay();
        if(!keybind) {
            document.body.appendChild(overlay);
        } else {
            document.body.removeChild(overlay);
        }
        keybind = !keybind;
    }
});

document.addEventListener("wheel", (event) => {
    if(firstTime) {
        updatePrompts();
    }
    // because they scrolled, we need to find what prompt they are now hovering over and update the index accordingly
    nl.forEach((node, i) => {
        const rect = node.getBoundingClientRect();
        if(rect.top >=0) {
            if(i % 2 != 0) {
                index = i - 1;
            }
            index = Math.floor(i / 2);
        }
    });
});