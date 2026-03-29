// 🔔 Notification Permission
if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

let editMode = false;
let oldName = "";

const API = "http://localhost:5000/api";
const userId = localStorage.getItem("userId") || null;

if (!userId) {
  alert("⚠️ Please login first");
  window.location.href = "login.html";
}

// ⏳ Loader Functions
function showLoader() {
  document.getElementById("loader").style.display = "flex";
}

function hideLoader() {
  document.getElementById("loader").style.display = "none";
}

// ➕ ADD / UPDATE MEDICINE
async function addMedicine() {
  showLoader();

  const name = document.getElementById("name").value;
  const time = document.getElementById("time").value;

  if (!name || !time) {
    hideLoader();
    showToast("⚠️ Fill all fields", "error");
    return;
  }

  if (editMode) {
    await fetch(`${API}/update/${oldName}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, time })
    });

    showToast("✅ Medicine Updated");
    editMode = false;
  } else {
    await fetch(`${API}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, time, userId })
    });

    showToast("✅ Medicine Added");
  }

  document.getElementById("name").value = "";
  document.getElementById("time").value = "";

  await loadMedicines();
  hideLoader();
}

// 📋 LOAD MEDICINES
async function loadMedicines() {
  const res = await fetch(`${API}/get/${userId}`);
  const data = await res.json();

  const list = document.getElementById("list");
  list.innerHTML = "";

  data.forEach(med => {
    const li = document.createElement("li");

    li.innerHTML = `
      ${med.name} - ${med.time}
      <div>
        <button onclick="editMedicine('${med.name}','${med.time}')">✏️</button>
        <button onclick="deleteMedicine('${med.name}')">❌</button>
      </div>
    `;

    list.appendChild(li);
  });
}

// ❌ DELETE MEDICINE
async function deleteMedicine(name) {
  showLoader();

  await fetch(`${API}/delete/${name}`, {
    method: "DELETE"
  });

  showToast("🗑️ Medicine Deleted", "error");
  await loadMedicines();

  hideLoader();
}

// ✏️ EDIT MODE
function editMedicine(name, time) {
  document.getElementById("name").value = name;
  document.getElementById("time").value = time;

  editMode = true;
  oldName = name;

  showToast("✏️ Edit Mode ON");
}

// 🔔 REMINDER SYSTEM
setInterval(() => {
  const now = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  loadMedicinesForReminder(now);
}, 60000);

async function loadMedicinesForReminder(currentTime) {
  const res = await fetch(`${API}/get/${userId}`);
  const data = await res.json();

  data.forEach(med => {
    if (med.time === currentTime) {
      showReminder(med.name);
    }
  });
}

function showReminder(name) {
  if (Notification.permission === "granted") {
    new Notification("💊 Medicine Reminder", {
      body: "Time to take " + name
    });
  }

  const audio = new Audio("https://www.soundjay.com/buttons/beep-01a.mp3");
  audio.play();

  showToast("💊 Take " + name);
}

// 🤖 AI FEATURE
async function loadAI() {
  showLoader();

  const res = await fetch(`${API}/ai/suggest/${userId}`);
  const data = await res.json();

  const list = document.getElementById("ai-list");
  list.innerHTML = "";

  data.forEach(s => {
    const li = document.createElement("li");
    li.innerText = s;
    list.appendChild(li);
  });

  showToast("🤖 AI Suggestions Ready");
  hideLoader();
}

// 🔐 LOGOUT
function logout() {
  localStorage.removeItem("userId");
  window.location.href = "login.html";
}

// 🚀 PAGE LOAD
window.onload = loadMedicines;