function checkAnswer() {
    let mass = parseFloat(document.getElementById("mass").value);
    let velocity = parseFloat(document.getElementById("velocity").value);
    let energy = parseFloat(document.getElementById("KE").value);

    if (Math.abs(0.5*mass*(velocity**2)-energy)<0.05*energy) {
        document.getElementById("answer").innerHTML = "Correct";
    } else {
        document.getElementById("answer").innerHTML = "Incorrect";
    }
    
    
}