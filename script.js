// Below is the logic for the input and the first table

const form = document.querySelector("form");
const tbody = document.getElementById("content-table");
let count = 1;

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const arrivalTime = document.getElementById("arrival-time").value;
  const burstTime = document.getElementById("burst-time").value;
  const priority = document.getElementById("priority").value;

  if (!arrivalTime || !burstTime || !priority) {
    alert("Please fill in all inputs");
    return;
  }
  if (isNaN(arrivalTime) || isNaN(burstTime) || isNaN(priority)) {
    alert("All values must be numeric");
    return;
  }
  if (arrivalTime < 0 || burstTime <= 0 || priority < 0) {
    alert("All values must be positive, and Burst time must be more than 0");
    return;
  }

  const row = document.createElement("tr");
  row.innerHTML = `
        <td>P${count++}</td>
        <td>${arrivalTime}</td>
        <td>${burstTime}</td>
        <td>${priority}</td>
        <td><button type="button" class="delete-btn" onclick="this.closest('tr').remove()">Delete</button></td>
    `;
  tbody.appendChild(row);
  form.reset();
});

// --------------------------PUT YOUR CODE BELOW THIS--------------------------------------------------
//Below is the logic for the SRTF algorithm and the Gantt chart
let row = document.getElementById("srtfrow");
let TableOfProcesses = document.getElementById("content-table");
let btnstartsim = document.getElementById("Start-sim-btn");
let numberOfProcesses = 0;
let processes = [];
let track = [];
let completionTime = 0;
let currenttime = 0;
function addProcess(process = []) {
  for (let i = 0; i < numberOfProcesses; i++) {
    process.push({
      name: TableOfProcesses.getElementsByTagName("tr")[i].getElementsByTagName(
        "td",
      )[0].innerHTML,
      arrival: parseInt(
        TableOfProcesses.getElementsByTagName("tr")[i].getElementsByTagName(
          "td",
        )[1].innerHTML,
      ),
      burst: parseInt(
        TableOfProcesses.getElementsByTagName("tr")[i].getElementsByTagName(
          "td",
        )[2].innerHTML,
      ),
      remainingtime: parseInt(
        TableOfProcesses.getElementsByTagName("tr")[i].getElementsByTagName(
          "td",
        )[2].innerHTML,
      ),
      done: false,
    });
  }
}
function srtf() {
  while (completionTime < numberOfProcesses) {
    let shortest = -1,
      minRem = Infinity;
    for (let i = 0; i < numberOfProcesses; i++) {
      if (
        !processes[i].done &&
        processes[i].arrival <= currenttime &&
        processes[i].remainingtime < minRem
      ) {
        minRem = processes[i].remainingtime;
        shortest = i;
      }
    }
    if (shortest == -1) {
      track.push("Idle");
      currenttime++;
      continue;
    }
    track.push(processes[shortest].name);
    processes[shortest].remainingtime--;
    currenttime++;
    if (processes[shortest].remainingtime == 0) {
      processes[shortest].done = true;
      completionTime++;
    }
  }
}
let gantt = [];
let i = 0;
function EnterDataToGanttChart() {
  while (i < track.length) {
    let name = track[i],
      start = i;
    while (i < track.length && track[i] == name) {
      i++;
    }
    let end = i;
    gantt.push({ name, start, end });
  }
}
function DisplayGanttChart() {
  for (let i = 0; i < gantt.length; i++) {
    let td = document.createElement("td");
    td.innerHTML =
      gantt[i].name +
      ":" +
      " Start: " +
      gantt[i].start +
      " End: " +
      gantt[i].end;
    td.style.width = (gantt[i].end - gantt[i].start) * 100 + "px";
    td.style.height = "50px";
    row.appendChild(td);
  }
}

btnstartsim.addEventListener("click", function () {
  processes = [];
  track = [];
  gantt = [];
  i = 0;
  completionTime = 0;
  currenttime = 0;
  document.getElementById("srtfrow").innerHTML = "";
  numberOfProcesses = TableOfProcesses.rows.length;
  if (numberOfProcesses == 0) {
    alert("Please add at least one process to start the simulation");
    return;
  }
  addProcess(processes);
  srtf();
  EnterDataToGanttChart();
  DisplayGanttChart();
});
// --------------------------PUT YOUR CODE BELOW THIS--------------------------------------------------
