// Firebase config (replace with your project info)
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

const adsContainer = document.getElementById("adsContainer");

// Render a campaign card for creators
function renderAdCard(c) {
    const card = document.createElement("div");
    card.classList.add("ad-card");
    card.innerHTML = `
        <img class="ad-logo" src="${c.logoURL}" alt="${c.company}">
        <h3 class="ad-title">${c.title}</h3>
        <p class="ad-description">${c.description}</p>
        <p class="ad-cpm">${c.cpm}</p>
        ${c.adURL.endsWith('.mp4') ? 
            `<video class="ad-video" src="${c.adURL}" controls muted></video>` : 
            `<img class="ad-video" src="${c.adURL}" alt="${c.title}">`
        }
        <a href="#" class="ad-btn">Promote Now</a>
    `;
    adsContainer.appendChild(card);
}

// Load campaigns for signed-in creators
auth.onAuthStateChanged(user => {
    if (!user) {
        adsContainer.innerHTML = "<p>Please sign in as a creator to see campaigns.</p>";
        return;
    }

    db.collection("campaigns")
      .orderBy("createdAt", "desc")
      .onSnapshot(snapshot => {
          adsContainer.innerHTML = ""; // clear old cards
          snapshot.forEach(doc => {
              renderAdCard(doc.data());
          });
      });
});
