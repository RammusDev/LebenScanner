const debugData = {};

export function debug(key, value) {
    debugData[key] = value;

    const box = document.getElementById("debug");

    if (!box) {
        return;
    }

    let html = "Debug<br><br>";

    Object.keys(debugData).forEach(item => {
        html += `${item}: ${debugData[item]}<br>`;
    });

    box.innerHTML = html;
}