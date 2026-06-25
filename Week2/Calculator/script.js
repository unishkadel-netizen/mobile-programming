function calculate() {

    let total =
        Number(document.getElementById("s1").value) +
        Number(document.getElementById("s2").value) +
        Number(document.getElementById("s3").value) +
        Number(document.getElementById("s4").value) +
        Number(document.getElementById("s5").value) +
        Number(document.getElementById("s6").value) +
        Number(document.getElementById("s7").value) +
        Number(document.getElementById("s8").value);

    let result = document.getElementById("result");

    if (total > 700) {
        result.innerHTML = "Total Marks = " + total + "<br>Distinction";
        result.style.color = "green";
    }

    else if (total > 600) {
        result.innerHTML = "Total Marks = " + total + "<br>First Division";
        result.style.color = "black";
    }

    else if (total >= 500) {
        result.innerHTML = "Total Marks = " + total + "<br>Second Division";
        result.style.color = "black";
    }

    else if (total >= 400) {
        result.innerHTML = "Total Marks = " + total + "<br>Third Division";
        result.style.color = "black";
    }

    else {
        result.innerHTML = "Total Marks = " + total + "<br>Fail";
        result.style.color = "red";
    }
}

