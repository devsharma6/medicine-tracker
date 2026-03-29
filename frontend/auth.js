const API = "http://127.0.0.1:5000";

async function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  await fetch(`${API}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  alert("Signup successful");
  window.location.href = "login.html";
}

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.userId) {
    localStorage.setItem("userId", data.userId);
    window.location.href = "index.html";
  } else {
    alert("Invalid login");
  }
}