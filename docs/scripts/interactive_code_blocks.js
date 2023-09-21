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
    // window.pyodideInstance = await loadPyodide({
    //   indexUrl: "https://cdn.jsdelivr.net/pyodide/v0.24.0/full/"
    // });

    window.pyodideInstance = await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.0a1/full/"
    });
    await window.pyodideInstance.loadPackage('setuptools');
    await window.pyodideInstance.loadPackage('micropip'); // load micropip explicitly
    const micropip = window.pyodideInstance.pyimport("micropip");
    console.log('micropip', micropip);
    await micropip.install('pydantic');
    console.log('installing multidict');
    // await micropip.install('https://files.pythonhosted.org/packages/9d/5a/34bd606569178ad8a931ea4d59cda926b046cfa4c01b0191c2e04cfd44c2/multidict-6.0.4-cp311-cp311-manylinux_2_17_x86_64.manylinux2014_x86_64.whl');
    await micropip.install('https://files.pythonhosted.org/packages/ae/59/911d6e5f1d7514d79c527067643376cddcf4cb8d1728e599b3b03ab51c69/openai-0.28.0-py3-none-any.whl');
    // await window.pyodideInstance.runPythonAsync("import micropip; await micropip.install('pydantic')");
    // await window.pyodideInstance.runPythonAsync("import micropip; await micropip.install('https://files.pythonhosted.org/packages/ae/59/911d6e5f1d7514d79c527067643376cddcf4cb8d1728e599b3b03ab51c69/openai-0.28.0-py3-none-any.whl')");
  }

  try {
    const result = window.pyodideInstance.runPython(code);
    outputDiv.innerText = `Output: ${result}`;
  } catch (err) {
    outputDiv.innerText = `Error: ${err}`;
  }

  codeBlock.parentElement.appendChild(outputDiv);
}
