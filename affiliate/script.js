const modal = document.getElementById("userTypeModal");
const closeBtn = document.querySelector(".close");

// Steps
const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const step2Title = document.getElementById("step2Title");
const step3 = document.getElementById("step3");
const step3Title = document.getElementById("step3Title");

// Buttons
const userTypeBtns = document.querySelectorAll(".userTypeBtn");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const backBtn = document.getElementById("backBtn");
const backStep2 = document.getElementById("backStep2");
const googleAuthBtn = document.getElementById("googleAuthBtn");
const emailForm = document.getElementById("emailForm");
const forgotPassword = document.getElementById("forgotPassword");

// Firebase setup
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

// Show modal
window.onload = () => modal.style.display = "flex";

// Close modal
closeBtn.onclick = () => modal.style.display = "none";
window.onclick = e => { if(e.target === modal) modal.style.display = "none"; }

let selectedType = "";

// Step 1 → Step 2
userTypeBtns.forEach(btn => {
    btn.onclick = () => {
        selectedType = btn.dataset.type;
        step1.classList.add("hidden");
        step2.classList.remove("hidden");
        step2Title.innerText = `You chose ${selectedType}`;
    }
});

// Step 2 → Step 3
loginBtn.onclick = () => showStep3("login");
signupBtn.onclick = () => showStep3("signup");

// Back buttons
backBtn.onclick = () => {
    step2.classList.add("hidden");
    step1.classList.remove("hidden");
}
backStep2.onclick = () => {
    step3.classList.add("hidden");
    step2.classList.remove("hidden");
}

// Show Step 3
function showStep3(mode){
    step2.classList.add("hidden");
    step3.classList.remove("hidden");
    step3Title.innerText = `${mode === "login" ? "Login" : "Sign Up"} as ${selectedType}`;
}

// Google Auth
googleAuthBtn.onclick = () => {
    auth.signInWithPopup(provider)
        .then(() => modal.style.display = "none")
        .catch(console.error);
}

// Email Auth
emailForm.addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const mode = step3Title.innerText.startsWith("Login") ? "login" : "signup";

    if(mode === "signup"){
        auth.createUserWithEmailAndPassword(email, password)
            .then(() => modal.style.display = "none")
            .catch(err => {
                if(err.code === "auth/email-already-in-use"){
                    alert("Email already exists. Try login.");
                } else alert(err.message);
            });
    } else {
        auth.signInWithEmailAndPassword(email, password)
            .then(() => modal.style.display = "none")
            .catch(console.error);
    }
});

// Forgot password
forgotPassword.onclick = () => {
    const email = document.getElementById("email").value;
    if(email){
        auth.sendPasswordResetEmail(email)
            .then(()=>alert("Password reset email sent!"))
            .catch(console.error);
    } else alert("Enter your email first.");
}
