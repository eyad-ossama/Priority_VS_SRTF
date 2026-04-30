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
   pTrack = [];
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
  displayPriorityStats();
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
//___________________________________________________________________________
function displayPriorityStats() {
  const tbody = document.getElementById("priorty-stats-body");
  tbody.innerHTML = "";
  let totalWT = 0, totalTAT = 0, totalRT = 0;

  for (let i = 0; i < numberOfProcesses; i++) {
    let name = TableOfProcesses.rows[i].cells[0].innerHTML;
    let arrival = parseInt(TableOfProcesses.rows[i].cells[1].innerHTML);
    let burst = parseInt(TableOfProcesses.rows[i].cells[2].innerHTML);


    let ct = pTrack.lastIndexOf(name) + 1; 
    let firstOccur = pTrack.indexOf(name); 
    let rt = firstOccur - arrival;         
    let tat = ct - arrival;               
    let wt = tat - burst;                  

    totalWT += wt;
    totalTAT += tat;
    totalRT += rt;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${name}</td>
      <td>${arrival}</td>
      <td>${burst}</td>
      <td>${ct}</td>
      <td>${tat}</td>
      <td>${wt}</td>
      <td>${rt}</td>`
    ;
    tbody.appendChild(row);
  }

  if (numberOfProcesses > 0) {
    const avgRow = document.createElement("tr");
    avgRow.innerHTML =` 
      <td colspan="4" style="font-weight:bold">Average</td>
      <td style="font-weight:bold">${(totalTAT / numberOfProcesses).toFixed(2)}</td>
      <td style="font-weight:bold">${(totalWT / numberOfProcesses).toFixed(2)}</td>
      <td style="font-weight:bold">${(totalRT / numberOfProcesses).toFixed(2)}</td>
      `
    ;
    tbody.appendChild(avgRow);
  }
}
/*---------------------- Final Conclusion & Comparison Section -----------------------------*/
function getLastRowAverage(tbodyId) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody || tbody.rows.length === 0) return null;
  return tbody.rows[tbody.rows.length - 1];
}

function displayComparison() {
  const srtfAvgRow = getLastRowAverage("srtf-stats-body");
  const priAvgRow = getLastRowAverage("priorty-stats-body");

  if (!srtfAvgRow || !priAvgRow) return;

  const srtfAvgTAT = parseFloat(srtfAvgRow.cells[1].textContent);
  const srtfAvgWT = parseFloat(srtfAvgRow.cells[2].textContent);
  const srtfAvgRT = parseFloat(srtfAvgRow.cells[3].textContent);

  const priAvgTAT = parseFloat(priAvgRow.cells[1].textContent);
  const priAvgWT = parseFloat(priAvgRow.cells[2].textContent);
  const priAvgRT = parseFloat(priAvgRow.cells[3].textContent);

  const wtWinner =
    srtfAvgWT < priAvgWT ? "SRTF" :
    priAvgWT < srtfAvgWT ? "Priority" :
    "Both algorithms (equal)";

  const rtWinner =
    srtfAvgRT < priAvgRT ? "SRTF" :
    priAvgRT < srtfAvgRT ? "Priority" :
    "Both algorithms (equal)";

  const tatWinner =
    srtfAvgTAT < priAvgTAT ? "SRTF" :
    priAvgTAT < srtfAvgTAT ? "Priority" :
    "Both algorithms (equal)";

    const srtfTotal = srtfAvgWT + srtfAvgRT + srtfAvgTAT;
const priTotal  = priAvgWT  + priAvgRT  + priAvgTAT;

const recommendation =
  srtfTotal < priTotal ? "SRTF" :
  priTotal < srtfTotal ? "Priority" :
  "Either algorithm";


document.getElementById("q1").innerHTML = `
  <span class="question-text">1. Which algorithm produced the lower average waiting time?</span>
  <span class="answer-text">➜ ${wtWinner} had the lower average waiting time (SRTF: ${srtfAvgWT.toFixed(2)}, Priority: ${priAvgWT.toFixed(2)}).</span>`;

document.getElementById("q2").innerHTML = `
  <span class="question-text">2. Which algorithm produced the lower average response time?</span>
  <span class="answer-text">➜ ${rtWinner} had the lower average response time (SRTF: ${srtfAvgRT.toFixed(2)}, Priority: ${priAvgRT.toFixed(2)}).</span>`;

document.getElementById("q3").innerHTML = `
  <span class="question-text">3. Did priority values improve treatment of urgent processes?</span>
  <span class="answer-text">➜ Yes. Priority scheduling gives urgent processes better service based on their assigned priority value.</span>`;

document.getElementById("q4").innerHTML = `
  <span class="question-text">4. Did SRTF favor short jobs more aggressively?</span>
  <span class="answer-text">➜ Yes. SRTF always preempts in favor of the shortest remaining time, so short jobs are served earlier.</span>`;

document.getElementById("q5").innerHTML = `
  <span class="question-text">5. Which algorithm would you recommend for the tested workload, and why?</span>
  <span class="answer-text">➜ ${
    recommendation === "Either algorithm" 
    ? "Either algorithm can be recommended, since both performed equally on this workload." 
    : `${recommendation} is recommended because it achieved better overall average performance (WT + RT + TAT) on this workload.`
  }</span>`;

document.getElementById("f1").innerHTML = `
  <span class="question-text">1. Which algorithm performed better?</span>
  <span class="answer-text">➜ ${recommendation === "Either algorithm" 
    ? "Both algorithms performed equally on this dataset." 
    : `${recommendation} performed better on the selected dataset.`}</span>`;

document.getElementById("f2").innerHTML = `
  <span class="question-text">2. Which metrics were better under each algorithm?</span>
  <span class="answer-text">➜ SRTF: Avg WT=${srtfAvgWT.toFixed(2)}, TAT=${srtfAvgTAT.toFixed(2)}, RT=${srtfAvgRT.toFixed(2)} | Priority: Avg WT=${priAvgWT.toFixed(2)}, TAT=${priAvgTAT.toFixed(2)}, RT=${priAvgRT.toFixed(2)}.</span>`;

document.getElementById("f3").innerHTML = `
  <span class="question-text">3. What is the main trade-off?</span>
  <span class="answer-text">➜ Efficiency vs policy: SRTF favors short jobs aggressively, while Priority respects urgency levels regardless of burst time.</span>`;

document.getElementById("f4").innerHTML = `
  <span class="question-text">4. Which algorithm appeared fairer in practice?</span>
  <span class="answer-text">➜ Priority is fairer for urgent tasks; SRTF is fairer for short jobs. Fairness depends on the workload context.</span>`;

}


btnstartsim.addEventListener("click", function () {
  setTimeout(displayComparison, 0);
});

// reset button logic  
document.getElementById("reset-btn").addEventListener("click", function () {
  tbody.innerHTML = "";
  count = 1;
  document.getElementById("srtfrow").innerHTML = "";
  document.getElementById("priorityRow").innerHTML = "";
  document.getElementById("srtf-stats-body").innerHTML = "";
  document.getElementById("priorty-stats-body").innerHTML = "";
  ["q1","q2","q3","q4","q5","f1","f2","f3","f4"].forEach(id => {
    document.getElementById(id).innerHTML = "";
  });
  processes = []; track = []; gantt = [];
  i = 0; completionTime = 0; currenttime = 0;
  numberOfProcesses = 0;
  srtfCompletionTimes = {}; srtfFirstResponse = {};
  pTrack = [];
  form.reset();
});
