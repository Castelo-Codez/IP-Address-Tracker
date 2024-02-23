import axios from "axios";
import "./style.scss";
let $ip = document.getElementById("ip");
let $location = document.getElementById("location");
let $timezone = document.getElementById("timezone");
let $isp = document.getElementById("isp");
const $form = document.querySelector("form");
let $error = $form.querySelector("span");

let map = L.map("map");
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

let $icon = L.icon({
    iconUrl: "/icon-location.svg",
    iconSize: [46, 56],
});

$form.addEventListener("submit", (e) => {
    e.preventDefault();
    let $ip = $form.ip.value;
    if (!$ip) {
        $runError(true, "ip or domain cann't be empty");
    } else {
        $runError(false);
        geo($form.ip.value)
            .then((resp) => {
                let {data} = resp;
                $rendering(
                    data.ip,
                    data.location.city,
                    data.location.country,
                    data.location.timezone,
                    data.isp,
                    data.location.lat,
                    data.location.lng
                );
            })
            .catch((error) => {
                $runError(true, "please Enter a valid ip address");
            });
    }
});

function $runError($state, error) {
    $form.toggleAttribute("has-error", $state);
    $error.textContent = error;
}

async function geo($ip = "") {
    let $location = await axios.get(
        `https://geo.ipify.org/api/v2/country,city,vpn?apiKey=at_9R8wD1VOHh1mZcrDh7yCk9TzpPaTO${
            $ip ? `&ipAddress= ${$ip}` : ""
        }`,
        {
            headers: "application/json",
        }
    );
    return $location;
}

function $rendering(
    $ipAdress = "Not Found",
    $city = "Not Found",
    $country,
    timezone = "Not Found",
    isp = "Not Found",
    lat,
    lng
) {
    $ip.textContent = $ipAdress;
    $location.textContent = `${$city},${$country}`;
    $timezone.textContent = timezone;
    $isp.textContent = isp;
    map.setView([lat, lng], 15);
    L.marker([lat, lng], {icon: $icon}).addTo(map);
}

geo().then((resp) => {
    let {data} = resp;
    $rendering(
        data.ip,
        data.location.city,
        data.location.country,
        data.location.timezone,
        data.isp,
        data.location.lat,
        data.location.lng
    );
});
