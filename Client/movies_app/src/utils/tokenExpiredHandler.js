import { jwtDecode } from "jwt-decode";

let logoutTimeout;

// 
export function startSessionMonitor(token, onExpire) {
  if (!token) return;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = (decoded.exp - currentTime) * 1000;

    if (timeUntilExpiry <= 0) {
      // callback function that loggin out when the user session is expired
      onExpire();
    } else {
      logoutTimeout = setTimeout(() => {
        onExpire();
      }, timeUntilExpiry);
    }
  } catch (err) {
    console.error("Invalid token in session monitor", err);
    onExpire();
  }
}

export function clearSessionMonitor() {
  if (logoutTimeout) clearTimeout(logoutTimeout);
}
