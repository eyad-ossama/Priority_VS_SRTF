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
        <td><button type="button" class="delete-btn"onclick="deleteRow(this)">Delete</button></td>
    `;
  tbody.appendChild(row);
  form.reset();
});
function deleteRow(btn) {
  btn.closest("tr").remove();
  const rows = tbody.getElementsByTagName("tr");
  count = 1;
  for (let r of rows) {
    r.cells[0].innerHTML = "P" + count++;
  }
}

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
let srtfCompletionTimes = {};
let srtfFirstResponse = {};

function srtf() {
  srtfCompletionTimes = {};
  srtfFirstResponse = {};

  while (completionTime < numberOfProcesses) {
    let shortest = -1, minRem = Infinity;
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
    
    if (srtfFirstResponse[processes[shortest].name] === undefined) {
      srtfFirstResponse[processes[shortest].name] = currenttime;
    }
    track.push(processes[shortest].name);
    processes[shortest].remainingtime--;
    currenttime++;
    if (processes[shortest].remainingtime == 0) {
      processes[shortest].done = true;
      srtfCompletionTimes[processes[shortest].name] = currenttime;
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
      gantt[i].name + "<br/>" + gantt[i].start + " - " + gantt[i].end;
    td.style.width = (gantt[i].end - gantt[i].start) * 100 + "px";
    td.style.height = "50px";
    row.appendChild(td);
  }
}



// --------------------------PUT YOUR CODE BELOW THIS--------------------------------------------------
// -------------------------- Priority Scheduling Logic --------------------------
function priorityScheduling() {
  let pProcesses = [];
  for (let i = 0; i < numberOfProcesses; i++) {
    pProcesses.push({
      name: TableOfProcesses.rows[i].cells[0].innerHTML,
      arrival: parseInt(TableOfProcesses.rows[i].cells[1].innerHTML),
      burst: parseInt(TableOfProcesses.rows[i].cells[2].innerHTML),
      priority: parseInt(TableOfProcesses.rows[i].cells[3].innerHTML),
      remainingtime: parseInt(TableOfProcesses.rows[i].cells[2].innerHTML),
      done: false,
    });
  }

  let pTrack = [];
  let pCurrentTime = 0;
  let pCompletionTime = 0;

  while (pCompletionTime < numberOfProcesses) {
    let highestIdx = -1;
    let minPriority = Infinity;

    for (let i = 0; i < numberOfProcesses; i++) {
      if (!pProcesses[i].done && pProcesses[i].arrival <= pCurrentTime) {
        if (pProcesses[i].priority < minPriority) {
          minPriority = pProcesses[i].priority;
          highestIdx = i;
        }
      }
    }

    if (highestIdx == -1) {
      pTrack.push("Idle");
      pCurrentTime++;
    } else {
      pTrack.push(pProcesses[highestIdx].name);
      pProcesses[highestIdx].remainingtime--;
      pCurrentTime++;
      if (pProcesses[highestIdx].remainingtime == 0) {
        pProcesses[highestIdx].done = true;
        pCompletionTime++;
      }
    }
  }

  let pRow = document.getElementById("priorityRow");
  pRow.innerHTML = "";
  let j = 0;
  while (j < pTrack.length) {
    let name = pTrack[j],
      start = j;
    while (j < pTrack.length && pTrack[j] == name) {
      j++;
    }
    let end = j;

    let td = document.createElement("td");
    td.innerHTML = `${name}<br>${start}-${end}`;
    td.style.width = (end - start) * 60 + "px";
    pRow.appendChild(td);
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
  addProcess(processes);
  srtf();
  EnterDataToGanttChart();
  DisplayGanttChart();
  displaySRTFStats();
  priorityScheduling();
});
// --------------------------PUT YOUR CODE BELOW THIS--------------------------------------------------
function displaySRTFStats() {
  const tbody = document.getElementById("srtf-stats-body");
  tbody.innerHTML = "";
  let totalWT = 0, totalTAT = 0, totalRT = 0;

  for (let i = 0; i < processes.length; i++) {
    const p = processes[i];
    const ct = srtfCompletionTimes[p.name];
    const tat = ct - p.arrival;
    const wt = tat - p.burst;
    const rt = srtfFirstResponse[p.name] - p.arrival;

    totalWT += wt;
    totalTAT += tat;
    totalRT += rt;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${p.name}</td>
      <td>${p.arrival}</td>
      <td>${p.burst}</td>
      <td>${ct}</td>
      <td>${tat}</td>
      <td>${wt}</td>
      <td>${rt}</td>
    `;
    tbody.appendChild(row);
  }

  const n = processes.length;
  const avgRow = document.createElement("tr");
  avgRow.className = "avg-row";
  avgRow.innerHTML = `
    <td colspan="4">Average</td>
    <td>${(totalTAT / n).toFixed(2)}</td>
    <td>${(totalWT / n).toFixed(2)}</td>
    <td>${(totalRT / n).toFixed(2)}</td>
  `;
  tbody.appendChild(avgRow);
}