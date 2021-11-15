let store = {
  roverPhotos: "",
  selectedRover: "Curiosity",
  roverInfo: "",
};

// add our markup to the page
const root = document.getElementById("root");

const updateStore = (store, newState) => {
  store = Object.assign(store, newState);
  render(root, store);
};

const render = async (root, state) => {
  root.innerHTML = App(state);

  // selecting the ul element after the app
  const ul = document.querySelector("ul");
  ul.addEventListener("click", (e) => {
    const roverSelected = e.target.innerHTML;
    updateSelectedRover(roverSelected);
    getRoverInfo(state);
    getRoverPhotos(state);
  });
};

// create content
const App = (state) => {
  let { roverPhotos, selectedRover, roverInfo } = state;
  return `
        <header>
            <h1>Mars Dashboard</h1>
            <p>Select a rover to inspect!</p>
        </header>
        <main>
            ${Nav(selectedRover)}
            <div class="roverInfo">
              <div class="innerRoverInfo">
                  <p>${RoverInfo(roverInfo)}</p>
              </div>
            </div>
            <div class="grid">
                ${RoverPhotos(roverPhotos)}
            </div>
        </main>
        <footer>
          <p>Credis to <a href="https://api.nasa.gov/">NASA Open APIs</a></p>
        </footer>
    `;
};

// listening for load event because page should load before any JS is called
window.addEventListener("load", () => {
  render(root, store);
});

// ------------------------------------------------------  COMPONENTS

// Nav component renders different content in base of the rover that is selected
const Nav = (selectedRover) => {
  if (selectedRover == "Curiosity") {
    return `
      <nav>
        <ul>
            <li><a class="active">Curiosity</a></li>
            <li><a>Opportunity</a></li>
            <li><a>Spirit</a></li>
        </ul>
      </nav>
    `;
  } else if (selectedRover == "Opportunity") {
    return `
      <nav>
        <ul>
            <li><a>Curiosity</a></li>
            <li><a class="active" href="#">Opportunity</a></li>
            <li><a>Spirit</a></li>
        </ul>
      </nav>
    `;
  } else if (selectedRover == "Spirit") {
    return `
      <nav>
        <ul>
            <li><a>Curiosity</a></li>
            <li><a>Opportunity</a></li>
            <li><a class="active" href="#">Spirit</a></li>
        </ul>
      </nav>
    `;
  } else {
    return `
      <nav>
        <ul>
            <li><a>Curiosity</a></li>
            <li><a>Opportunity</a></li>
            <li><a>Spirit</a></li>
        </ul>
      </nav>
    `;
  }
};

// RoverPhotos Component renders the images of the rover
const RoverPhotos = (roverPhotos) => {
  if (!roverPhotos) {
    getRoverPhotos(store);
  }
  let template = "";
  const photos = roverPhotos.photos.photos;
  photos.forEach((photo) => {
    template += `
        <div class="grid-item">
            <img src="${photo.img_src}" />
        </div>
    `;
  });

  return template;
};

// RoverInfo Component renders the information about the rover
const RoverInfo = (roverInfo) => {
  if (!roverInfo) {
    getRoverInfo(store);
  }
  const selectedRoverInfo = roverInfo.photos.photos[0].rover;
  const roverName = selectedRoverInfo.name;
  const { id, landing_date, launch_date, name, status } = selectedRoverInfo;

  return `
    <div>
      <p>name:</p><bold> ${roverName}</bold> <span class="right"><p>landing date: </p>${landing_date}</span> <br>
      <p>status:</p>${status} <span class="right"><p>launch date:</p>${launch_date}</span>
    </div>
  `;
};

// updating the selected rover
const updateSelectedRover = (selectedRover) => {
  updateStore(store, { selectedRover });
};

// ------------------------------------------------------  API CALLS

// API call for rover phoyos
const getRoverPhotos = (state) => {
  let { roverPhotos, selectedRover } = state;

  fetch(`http://localhost:3000/rover?rover=${selectedRover}`)
    .then((res) => res.json())
    .then((roverPhotos) => updateStore(store, { roverPhotos }));
};

// API call for rover info
const getRoverInfo = (state) => {
  let { roverInfo, selectedRover } = state;

  fetch(`http://localhost:3000/rover?rover=${selectedRover}`)
    .then((res) => res.json())
    .then((roverInfo) => updateStore(store, { roverInfo }));
};
