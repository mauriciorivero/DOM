document.getElementById("dashboard").style.display = "block";
document.getElementById("formulario-registro").style.display = "flex";
document.getElementById("btn-exit").style.display = "none";

document.getElementById("btn-registro").onclick = function() {
    document.getElementById("formulario-registro").style.display = "flex";
    document.getElementById("formulario-registro").style.zIndex = "1";
    document.getElementById("btn-exit").style.display = "flex";
    document.getElementById("navegacion").style.display = "none";
}

document.getElementById("btn-exit").onclick = function() {
    document.getElementById("dashboard").style.display = "block";
    document.getElementById("formulario-registro").style.display = "none";
    document.getElementById("btn-exit").style.display = "none";
    document.getElementById("navegacion").style.display = "flex";
}