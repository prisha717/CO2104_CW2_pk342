const attractions = [
  {
    name: "London Eye",
    description: "A giant observation wheel on the Thames.",
    category: "landmarks",
    reviewScore: 5,
    distance: 5
  },
  {
    name: "Wembley Stadium",
    description: "Iconic sports venue hosting major events.",
    category: "sport",
    reviewScore: 4,
    distance: 15
  },
  {
    name: "Dishoom Covent Garden",
    description: "Famous Indian restaurant in central London.",
    category: "food",
    reviewScore: 5,
    distance: 10
  },
  {
    name: "Tower of London",
    description: "Historic fortress with the Crown Jewels.",
    category: "landmarks",
    reviewScore: 4,
    distance: 5
  },
  {
    name: "Hyde Park",
    description: "Huge green space for walking and relaxing.",
    category: "landmarks",
    reviewScore: 4,
    distance: 10
  },
  {
    name: "Camden Market",
    description: "Vibrant market known for its street fodd, vintage shops and music.",
    category: "food",
    reviewScore: 4,
    distance: 15
  },
  {
    name: "Natural History Museum",
    description: "World famous museum with dinosaur skeletons.",
    category: "landmarks",
    reviewScore: 5,
    distance: 5
  },
  {
    name: "Stanford Bridge Stadium",
    description: "Home to Chelsea FC, offering stadium tours and a museum.",
    category: "sport",
    reviewScore: 4,
    distance: 25
  },
  {
    name: "Borough Market",
    description: "Historic food market with artisanal produce and street food.",
    category: "food",
    reviewScore: 5,
    distance: 8
  },
  {
    name: "The Shard",
    description: "Iconic skyscraper with a sky-high observation deck.",
    category: "landmarks",
    reviewScore: 5,
    distance: 5
  },
  {
    name: "Lee Valley White Water Centre",
    description: "Olympic venue for rafting and canoeing adventures.",
    category: "sport",
    reviewScore: 4,
    distance: 20
  },
  {
    name: "Brick Lane",
    description: "Famous street for curry houses, vintage shops, and street art.",
    category: "food",
    reviewScore: 4,
    distance: 9
  },
  {
    name: "Wimbledon Tennis Club",
    description: "World-renowned tennis venue and museum.",
    category: "sport",
    reviewScore: 5,
    distance: 18
  }
];


function searchAttractions() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  const sportChecked = document.getElementById('sport').checked;
  const foodChecked = document.getElementById('food').checked;
  const landmarksChecked = document.getElementById('landmarks').checked;


  const stars = [5, 4, 3, 2, 1].filter(s => document.getElementById(`star${s}`).checked);
  const distances = [5, 10, 15, 20].filter(d => document.getElementById(`dist${d}`).checked);


  const list = document.getElementById('attractionsList');
  list.innerHTML = "";


  const results = attractions.filter(a => {
    const matchesName = a.name.toLowerCase().includes(input);
    const matchesCategory =
      (!sportChecked && !foodChecked && !landmarksChecked) ||
      (sportChecked && a.category === "sport") ||
      (foodChecked && a.category === "food") ||
      (landmarksChecked && a.category === "landmarks");
    const matchesScore =
      stars.length === 0 || stars.includes(a.reviewScore);
    const matchesDistance =
      distances.length === 0 || distances.some(d => a.distance <= d);


    return matchesName && matchesCategory && matchesScore && matchesDistance;
  });


  if (results.length > 0) {
    results.forEach(a => {
      const card = `
        <div class="card mb-4 p-3">
          <h5>${a.name}</h5>
          <p>${a.description}</p>
          <p>Category: ${a.category}, Rating: ${'★'.repeat(a.reviewScore)}, Distance: ${a.distance} miles</p>
          <button class="btn btn-success btn-sm" onclick="addToWishList('${a.name}')">ADD</button>
        </div>
      `;
      list.innerHTML += card;
    });
  } else {
    list.innerHTML = "<p>No attractions match your search.</p>";
  }
}


function addToWishList(attractionName) {
  const user = sessionStorage.getItem('currentUser');
  if (!user) {
    showAlert("You must log in first!");
    return;
  }

  let wishlist = JSON.parse(sessionStorage.getItem(user + '_wishlist')) || [];

  if (wishlist.includes(attractionName)) {
    showAlert("This attraction is already in your Wish List.");
    return;
  }

  if (Math.random() < 0.95) {
    wishlist.push(attractionName);
    sessionStorage.setItem(user + '_wishlist', JSON.stringify(wishlist));
    showAlert("Added to Wish List!");
  } else {
    showAlert("Failed to add. Please try again.");
  }
}

function displayWishList() {
  const user = sessionStorage.getItem('currentUser');
  if (!user) {
    document.getElementById('wishlistItems').innerHTML = "<p>Please log in to view your Wish List.</p>";
    return;
  }

  const wishlist = JSON.parse(sessionStorage.getItem(user + '_wishlist')) || [];
  const wishlistContainer = document.getElementById('wishlistItems');

  if (wishlist.length === 0) {
    wishlistContainer.innerHTML = "<p>No items in your Wish List yet!</p>";
  } else {
    wishlistContainer.innerHTML = "";
    wishlist.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = "wishlist-item d-flex justify-content-between align-items-center";
      div.innerHTML = `
        <span>${item}</span>
        <button class="btn btn-danger btn-sm" onclick="deleteFromWishlist(${index})">Delete</button>
      `;
      wishlistContainer.appendChild(div);
    });
  }
}

document.addEventListener('DOMContentLoaded', displayWishList);

function deleteFromWishlist(index) {
  const user = sessionStorage.getItem('currentUser');
  let wishlist = JSON.parse(sessionStorage.getItem(user + '_wishlist')) || [];

  wishlist.splice(index, 1); // Remove the item
  sessionStorage.setItem(user + '_wishlist', JSON.stringify(wishlist)); // Save updated list

  displayWishList(); // Re-render
}


document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById('calendar')) {
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth'
    });
    calendar.render();
    displayUserEvents();
    document.getElementById('eventForm').addEventListener('submit', function (e) {
      e.preventDefault();
      addEvent();
    });
  }
});

function addEvent() {
  const user = sessionStorage.getItem('currentUser');
  if (!user) {
    alert("You must log in first!");
    return;
  }
  const eventName = document.getElementById('eventName').value;
  const eventTime = document.getElementById('eventTime').value;
  const eventDate = document.getElementById('eventDate').value;
  const eventLocation = document.getElementById('eventLocation').value;
  const eventDescription = document.getElementById('eventDescription').value;
  
  if (!eventName || !eventTime || !eventDate || !eventLocation) {
    alert("Please fill in all required fields.");
    return;
  }

  const newEvent = {
    name: eventName,
    time: eventTime,
    date: eventDate,
    location: eventLocation,
    description: eventDescription
  };

  let userEvents = JSON.parse(sessionStorage.getItem(user + '_events')) || [];
  userEvents.push(newEvent);
  sessionStorage.setItem(user + '_events', JSON.stringify(userEvents));
  document.getElementById('eventForm').reset();
  const modal = bootstrap.Modal.getInstance(document.getElementById('addEventModal'));
  modal.hide();
  showAlert("Event Added!");
  displayUserEvents();
}

function displayUserEvents() {
  const user = sessionStorage.getItem('currentUser');
  const eventList = document.getElementById('myEvents');
  if (!user) {
    eventList.innerHTML = "<p class='text-center'>Please log in to see your events.</p>";
    return;
  }
  const userEvents = JSON.parse(sessionStorage.getItem(user + '_events')) || [];
  eventList.innerHTML = "";
  userEvents.forEach((event, index) => {
    const eventItem = document.createElement('div');
    eventItem.className = 'list-group-item d-flex justify-content-between align-items-center';
    eventItem.innerHTML = `
      <div>
        <strong>${event.name}</strong> | ${event.date} | ${event.time}
        <br>
        <small>${event.location}</small>
      </div>
      <button class="btn btn-danger btn-sm" onclick="deleteEvent(${index})">–</button>
    `;
    eventList.appendChild(eventItem);
  });
  if (userEvents.length === 0) {
    eventList.innerHTML = "<p class='text-center'>No events added yet.</p>";
  }
}

function deleteEvent(index) {
  const user = sessionStorage.getItem('currentUser');
  let userEvents = JSON.parse(sessionStorage.getItem(user + '_events')) || [];
  userEvents.splice(index, 1);
  sessionStorage.setItem(user + '_events', JSON.stringify(userEvents));
  displayUserEvents();
  showAlert("Event Deleted!");
}


function showAlert(message) {
  const alertBox = document.createElement('div');
  alertBox.className = 'alert';
  alertBox.innerText = message;
  document.body.prepend(alertBox);
  setTimeout(() => {
    alertBox.remove();
  }, 3000);
}

const hardcodedReviews = {
  "London Eye": [
    { user: "John", rating: 4, text: "Amazing views at sunset, must visit!" }
  ],
  "Tower of London": [
    { user: "Alex", rating: 4, text: "Enjoyed it a lot :)." },
    { user: "Jane", rating: 5, text: "Loved the historical exhibitions, very educational." }
  ],
  "Hyde Park": [
    { user: "Alice", rating: 4, text: "Beautiful park for a picnic!" },
    { user: "Bob", rating: 5, text: "Loved the greenery and open space." }
  ],
  "Wembley Stadium": [
    { user: "Michael", rating: 5, text: "An unforgettable experience watching the final here!" },
    { user: "Sarah", rating: 4, text: "Great atmosphere, though getting out afterward took some time." },
    { user: "Liam", rating: 5, text: "Amazing concert venue! Sound quality was incredible." },
    { user: "Emma", rating: 4, text: "Comfortable seats and fantastic views from every angle." },
    { user: "James", rating: 5, text: "A must-visit for any football fan. Loved the stadium tour!" }
  ],
  "Dishoom": [
    { user: "Priya", rating: 5, text: "The best Indian food in London — everything was bursting with flavor!" },
    { user: "Tom", rating: 4, text: "Fantastic ambiance and great service, but the wait was a bit long." },
    { user: "Rachel", rating: 5, text: "Absolutely loved the chai and the bacon naan roll. Will return!" },
    { user: "Ahmed", rating: 4, text: "Delicious food, lovely decor, and excellent cocktails." },
    { user: "Sophie", rating: 5, text: "Hands down my favorite restaurant in the city." },
    { user: "Ben", rating: 4, text: "Great vibes and authentic Bombay feel. Worth the hype!" }
  ],
  "Camden Market": [
    { user: "Ella", rating: 5, text: "Loved the unique shops and vintage finds!" },
    { user: "Sam", rating: 4, text: "Great street food and music vibe." },
    { user: "Holly", rating: 5, text: "A must-visit for alternative fashion lovers." }
  ],
  "Natural History Museum": [
    { user: "Mark", rating: 5, text: "Incredible dinosaur exhibit, the kids were amazed!" },
    { user: "Sophie", rating: 4, text: "Beautiful building and fascinating collections." },
    { user: "Luca", rating: 5, text: "So much to see — we spent hours exploring." },
    { user: "Grace", rating: 4, text: "Educational and fun for the whole family." }
  ],
  "Stamford Bridge Stadium": [
    { user: "Ben", rating: 5, text: "As a Chelsea fan, this was a dream come true." },
    { user: "Olivia", rating: 4, text: "Fantastic tour and passionate guides." },
    { user: "James", rating: 5, text: "Really enjoyed seeing the locker rooms and pitch!" }
  ],
  "Borough Market": [
    { user: "Alex", rating: 5, text: "The cheese stalls were amazing!" },
    { user: "Maria", rating: 4, text: "Busy but worth it for the fresh produce." },
    { user: "Tom", rating: 5, text: "Best street food I’ve had in London." }
  ],
  "The Shard": [
    { user: "Nina", rating: 5, text: "The view from the top is breathtaking!" },
    { user: "Chris", rating: 4, text: "Expensive but absolutely worth it." },
    { user: "Anna", rating: 5, text: "Perfect spot for a romantic date night." }
  ],
  "Lee Valley White Water Centre": [
    { user: "Daniel", rating: 5, text: "Thrilling rafting experience, loved every second!" },
    { user: "Laura", rating: 4, text: "Fantastic for groups, but be ready to get soaked." },
    { user: "Megan", rating: 5, text: "The instructors were top-notch." }
  ],
  "Brick Lane": [
    { user: "Arjun", rating: 5, text: "Amazing curry houses and vibrant street art." },
    { user: "Zara", rating: 4, text: "Fun place to explore on a Sunday." },
    { user: "Kyle", rating: 5, text: "Loved the vintage shops and market vibe." }
  ],
  "Wimbledon Tennis Club": [
    { user: "Emily", rating: 5, text: "A dream come true for any tennis fan!" },
    { user: "Jack", rating: 5, text: "The museum tour was fascinating." },
    { user: "Sophie", rating: 4, text: "Beautiful grounds and great atmosphere." },
    { user: "Ryan", rating: 5, text: "Loved seeing Centre Court in person!" }
  ]
};

let currentAttraction = "";
let currentIndex = 0;
const attractionsList = Object.keys(hardcodedReviews);
window.addEventListener('DOMContentLoaded', function() {
  renderAttractions();
});
function renderAttractions() {
  const container = document.getElementById('attractionsContainer');
  container.innerHTML = '';

  for (let i = currentIndex; i < currentIndex + 2 && i < attractionsList.length; i++) {
    const name = attractionsList[i];
    const rating = averageRating(name);
    const count = hardcodedReviews[name].length;

    const card = document.createElement('div');
    card.className = 'col-md-6';
    card.innerHTML = `
      <div class="card p-3 mb-3">
        <h5>${name}</h5>
        <img src="images/${name.toLowerCase().replaceAll(' ', '-').replaceAll("'", '')}.jpg" alt="${name}" style="width: 100%; height: 300px; object-fit: cover; border-radius: 8px;">
        <p>${'★'.repeat(rating)}</p>
        <button class="btn btn-info btn-sm" onclick="showReviewDetail('${name}')">${count} REVIEW${count > 1 ? 'S' : ''}</button>
        <button class="btn btn-success btn-sm" onclick="showAddReview('${name}')">ADD REVIEW</button>
      </div>
    `;
    container.appendChild(card);
  }
}

function averageRating(attraction) {
  const reviews = hardcodedReviews[attraction];
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round(sum / reviews.length);
}

function nextAttractions() {
  currentIndex += 2;
  if (currentIndex >= attractionsList.length) {
    currentIndex = 0;
  }
  renderAttractions();
}

function prevAttractions() {
  currentIndex -= 2;
  if (currentIndex < 0) {
    currentIndex = Math.max(attractionsList.length - 2, 0); // wrap to last block
  }
  renderAttractions();
}

function showReviewDetail(attraction) {
  currentAttraction = attraction;
  document.getElementById('homeView').style.display = 'none';
  document.getElementById('detailView').style.display = 'block';
  document.getElementById('addReviewView').style.display = 'none';
  const reviews = hardcodedReviews[attraction] || [];
  const detailContainer = document.getElementById('detailView');
  detailContainer.innerHTML = `
    <button class="btn btn-secondary mb-3" onclick="goBack()">BACK</button>
    <h4>${attraction}</h4>
    <div id="reviewsContainer"></div>
  `;
  const reviewsContainer = document.createElement('div');
  reviewsContainer.id = 'reviewsContainer';

  if (reviews.length > 0) {
    reviews.forEach(r => {
      const reviewCard = document.createElement('div');
      reviewCard.className = 'card p-3 mb-2';
      reviewCard.innerHTML = `
        <h5>${r.user} - ${attraction}</h5>
        <p>${'★'.repeat(r.rating)}</p>
        <p>${r.text}</p>
      `;
      reviewsContainer.appendChild(reviewCard);
    });
  } else {
    reviewsContainer.innerHTML = '<p>No reviews yet</p>';
  }
  detailContainer.appendChild(reviewsContainer);
}

function showAddReview(attraction) {
  currentAttraction = attraction;
  document.getElementById('homeView').style.display = 'none';
  document.getElementById('detailView').style.display = 'none';
  document.getElementById('addReviewView').style.display = 'block';
  document.getElementById('addReviewAttraction').innerText = attraction;
  document.getElementById('uploadConfirmation').style.display = 'none';
  const form = document.getElementById('addReviewForm');
  form.onsubmit = function (e) {
    e.preventDefault();
    addReview();
  };
}

function addReview() {
  const user = sessionStorage.getItem('currentUser') || 'Anonymous';
  const rating = parseInt(document.getElementById('rating').value);
  const text = document.getElementById('reviewContent').value;
  if (!hardcodedReviews[currentAttraction]) {
    hardcodedReviews[currentAttraction] = [];
  }
  hardcodedReviews[currentAttraction].push({ user, rating, text });
  document.getElementById('addReviewForm').reset();
  document.getElementById('uploadConfirmation').style.display = 'block';
  renderAttractions(); 
}

function goBack() {
  document.getElementById('homeView').style.display = 'block';
  document.getElementById('detailView').style.display = 'none';
  document.getElementById('addReviewView').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function () {
  const signupForm = document.getElementById('signup-form');
  const loginForm = document.getElementById('login-form');

  
  if (signupForm) {
    signupForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('signup-name').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value.trim();
      if (!name || !email || !password) {
        showAlert("Please fill in all fields to sign up.");
        return;
      }
      const users = JSON.parse(localStorage.getItem('users') || '{}');
      if (users[email]) {
        showAlert("That user already exists. Please log in instead.");
        return;
      }

      users[email] = { name, password };
      localStorage.setItem('users', JSON.stringify(users));

      showAlert(`Account created successfully, ${name}! You can now log in.`);
      showLogin(); // Switch back to login view
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value.trim();

      if (!email || !password) {
        showAlert("Please enter both email and password.");
        return;
      }

      const users = JSON.parse(localStorage.getItem('users') || '{}');

      if (!users[email] || users[email].password !== password) {
        showAlert("Incorrect email or password.");
        return;
      }

      sessionStorage.setItem('currentUser', email);
      alert("Login successful!");
      window.location.href = "index.html";
    });
  }
});

function showAlert(message) {
  const alertBox = document.createElement('div');
  alertBox.className = 'alert';
  alertBox.innerText = message;
  alertBox.style.backgroundColor = '#f8d7da';
  alertBox.style.color = '#721c24';
  alertBox.style.padding = '10px';
  alertBox.style.margin = '10px auto';
  alertBox.style.maxWidth = '400px';
  alertBox.style.borderRadius = '5px';
  alertBox.style.textAlign = 'center';
  document.body.prepend(alertBox);
  setTimeout(() => alertBox.remove(), 4000);
}

function showSignup() {
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('signup-form').style.display = 'block';
  document.getElementById('form-title').innerText = 'Sign Up';
}

function showLogin() {
  document.getElementById('signup-form').style.display = 'none';
  document.getElementById('login-form').style.display = 'block';
  document.getElementById('form-title').innerText = 'Login';
}

function logout() {
  sessionStorage.removeItem('loggedInUser');
  alert("You have been logged out.");
  window.location.href = 'login.html';
}

function showAlert(message) {
  const alertBox = document.createElement('div');
  alertBox.className = 'alert';
  alertBox.innerText = message;
  document.body.prepend(alertBox);
  setTimeout(() => {
    alertBox.remove();
  }, 3000);
}
