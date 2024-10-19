const asin = Math.asin
const cos = Math.cos
const sin = Math.sin
const sqrt = Math.sqrt
const PI = Math.PI

// equatorial mean radius of Earth (in meters)
const R = 6378137

function squared (x) { return x * x }
function toRad (x) { return x * PI / 180.0 }
function hav (x) {
  return squared(sin(x / 2))
}

// hav(theta) = hav(bLat - aLat) + cos(aLat) * cos(bLat) * hav(bLon - aLon)
function haversineDistance (a, b) {
  const aLat = toRad(Array.isArray(a) ? a[1] : a.latitude ?? a.lat)
  const bLat = toRad(Array.isArray(b) ? b[1] : b.latitude ?? b.lat)
  const aLng = toRad(Array.isArray(a) ? a[0] : a.longitude ?? a.lng ?? a.lon)
  const bLng = toRad(Array.isArray(b) ? b[0] : b.longitude ?? b.lng ?? b.lon)

  const ht = hav(bLat - aLat) + cos(aLat) * cos(bLat) * hav(bLng - aLng)
  return 2 * R * asin(sqrt(ht))
}

let id;
let target;
let options;
let prvCrd;
let prvDate;

function convertMpmToKmph(speedMpm) {
    return speedMpm * 3.6 * 1000;
}

 function updateSpeed(speed) {
        const needle = document.querySelector('.needle');
        const speedDisplay = document.querySelector('.speed');

        const degrees = (speed / 240) * 180; // Assuming 240 km/h as maximum speed
        needle.style.transform = `translateX(-50%) rotate(${degrees}deg)`;
        speedDisplay.textContent = speed + ' km/h';
    }

function success(pos) {
  let crd = pos.coords;
  let currDate = Date.now()
  if (prvCrd) {
    updateSpeed(Math.ceil(convertMpmToKmph(haversineDistance(crd, prvCrd) / (currDate - prvDate))))
  }
  prvDate = Date.now();
  prvCrd = crd;
}

function error(err) {
  console.error(`ERROR(${err.code}): ${err.message}`);
}

target = {
  latitude: 0,
  longitude: 0,
};

options = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0,
};

id = navigator.geolocation.watchPosition(success, error, options);