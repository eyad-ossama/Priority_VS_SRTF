// Below is the logic for the input and the first table

const form = document.querySelector('form');
const tbody = document.getElementById('content-table');
let processCount = 1;

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const arrivalTime = document.getElementById('arrival-time').value;
    const burstTime = document.getElementById('burst-time').value;
    const priority = document.getElementById('priority').value;

    if (!arrivalTime || !burstTime || !priority) {
        alert('Please fill in all fields.');
        return;
    }
    if(isNaN(arrivalTime) || isNaN(burstTime) || isNaN(priority)){
        alert('All values must be numeric');
        return;
    }
    if(arrivalTime < 0 || burstTime <= 0 || priority < 0){
        alert('All values must be positive and burst time must be more than 0');
        return;
    }

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>P${processCount++}</td>
        <td>${arrivalTime}</td>
        <td>${burstTime}</td>
        <td>${priority}</td>
        <td><button type="button" onclick="this.closest('tr').remove()">Delete</button></td>
    `;
    tbody.appendChild(row);

    form.reset();
});
// --------------------------PUT YOUR CODE BELOW THIS--------------------------------------------------
