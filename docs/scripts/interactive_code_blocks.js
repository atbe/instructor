document.addEventListener("DOMContentLoaded", function() {

  // only select code blocks that have several span children, return only the code blocks, no spans
  const codeBlocks = Array.from(document.querySelectorAll("div.highlight pre")).filter(block => block.children.length > 1);
  console.log(codeBlocks);

  codeBlocks.forEach((block, index) => {
    // make each code block editable
    block.setAttribute("contenteditable", "true");

    const runButton = document.createElement("button");


    // give it a high contrast look
    runButton.style.backgroundColor = "black";
    runButton.style.color = "white";
    // and padding and rounding
    runButton.style.padding = "5px";
    runButton.style.borderRadius = "5px";
    runButton.style.cursor = "pointer";

    runButton.innerText = "Run";
    runButton.id = `run-button-${index}`;
    runButton.addEventListener('click', function() {
      const code = block.innerText;
      executeCode(runButton, index);
    });
    block.parentElement.appendChild(runButton);
  });
});

async function executeCode(event) {
  console.log(event);

  const button = event;
  const codeBlock = button.previousElementSibling;
  const code = codeBlock.innerText;

  const outputDiv = document.createElement("pre");
  outputDiv.classList.add("output");

  if (!window.pyodideInstance) {
    window.pyodideInstance = await loadPyodide();
  }

  try {
    const result = window.pyodideInstance.runPython(code);
    outputDiv.innerText = `Output: ${result}`;
  } catch (err) {
    outputDiv.innerText = `Error: ${err}`;
  }

  codeBlock.parentElement.appendChild(outputDiv);
}
