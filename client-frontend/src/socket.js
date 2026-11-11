import { io } from "socket.io-client";
import axios from "axios";

// the access token is sent when the socket connects (the function runs again on every reconnect).
// It connects when the first comments box opens (see Comments.jsx) and is closed on logout.
const socket = io(import.meta.env.VITE_BASE_URL, {
  autoConnect: false,
  auth: (cb) => cb({ token: localStorage.getItem("token") }),
});

// the server refuses an expired token: get a new one with the refresh token and connect again (only once)
let retried = false;
socket.on("connect", () => {
  retried = false;
});
socket.on("connect_error", async (err) => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (err.message !== "Unauthorized" || !refreshToken || retried) return;
  retried = true;
  try {
    const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/users/refresh`, { refreshToken });
    localStorage.setItem("token", res.data.token);
    socket.connect();
  } catch {
    // the refresh token is not valid anymore, the next api call sends the user to login
  }
});

export default socket;
