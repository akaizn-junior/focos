// Code block
var codeBlocks = document.getElementsByTagName("pre");

for (var i = 0; i < codeBlocks.length; i++) {
    var block = codeBlocks[i];
    block.removeAttribute("hidden");
    var lines = block.innerText.trim().split("\n");
    block.innerHTML = "";
    for (var j = 0; j < lines.length; j++) {
        var line = lines[j];
        var c = document.createElement("code");
        var ln = document.createElement("span");
        ln.className = "line-number";
        ln.innerHTML = j + 1;
        c.append(ln);
        c.innerHTML += "".concat(" ", line.replace(/\s{7}/g, ""));
        block.append(c);
    }
}
// end Code block
