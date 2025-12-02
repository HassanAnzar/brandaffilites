// Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

const uploadForm = document.getElementById("uploadForm");
const statusDiv = document.getElementById("status");
const logoutBtn = document.getElementById("logoutBtn");

// Check if user is logged in
auth.onAuthStateChanged(user => {
    if (!user) {
        window.location.href = "login.html"; // redirect if not logged in
    }
});

// Logout
logoutBtn.addEventListener("click", () => {
    auth.signOut().then(() => window.location.href = "homepage.html");
});

// Handle form submit
uploadForm.addEventListener("submit", async e => {
    e.preventDefault();

    const companyName = document.getElementById("companyName").value;
    const campaignTitle = document.getElementById("campaignTitle").value;
    const description = document.getElementById("description").value;
    const cpm = document.getElementById("cpm").value;
    const logoFile = document.getElementById("logoFile").files[0];
    const adFile = document.getElementById("adFile").files[0];

    if (!logoFile || !adFile) return alert("Please select files!");

    statusDiv.innerText = "Uploading...";

    try {
        // Upload logo
        const logoRef = storage.ref().child(`logos/${Date.now()}_${logoFile.name}`);
        await logoRef.put(logoFile);
        const logoURL = await logoRef.getDownloadURL();

        // Upload ad video/image
        const adRef = storage.ref().child(`ads/${Date.now()}_${adFile.name}`);
        await adRef.put(adFile);
        const adURL = await adRef.getDownloadURL();

        // Save campaign to Firestore
        await db.collection("campaigns").add({
            company: companyName,
            title: campaignTitle,
            description: description,
            cpm: cpm,
            logoURL: logoURL,
            adURL: adURL,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        statusDiv.innerText = "Campaign uploaded successfully!";
        uploadForm.reset();

    } catch (err) {
        console.error(err);
        statusDiv.innerText = "Error uploading campaign.";
    }
});
