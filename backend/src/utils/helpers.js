const formatLapTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return "N/A";
  const min = Math.floor(seconds / 60);
  const sec = (seconds % 60).toFixed(3).padStart(6, "0");
  return `${min}:${sec}`;
};

const formatInterval = (seconds) => {
  if (typeof seconds !== "number" || isNaN(seconds)) return "-";
  return "+" + seconds.toFixed(3);
};

const checkIfSessionIsLive = (session) => {
  if (!session || !session.date_start || !session.date_end) return false;
  const now = new Date();
  const start = new Date(session.date_start);
  const end = new Date(session.date_end);
  return now >= start && now <= end;
};

module.exports = {
  formatLapTime,
  formatInterval,
  checkIfSessionIsLive
};
