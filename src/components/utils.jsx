export function timeSince(timeStamp) {
  let now = new Date(),
    secondsPast = (now.getTime() - timeStamp) / 1000;
  if (secondsPast < 60) {
    return parseInt(secondsPast) + "s ago";
  }
  if (secondsPast < 3600) {
    return parseInt(secondsPast / 60) + "m ago";
  }
  if (secondsPast <= 86400) {
    return parseInt(secondsPast / 3600) + "h ago";
  }
  if (secondsPast > 86400) {
    let date = new Date(timeStamp);
    let day = date.getDate();
    let month = date
      .toDateString()
      .match(/ [a-zA-Z]*/)[0]
      .replace(" ", "");
    let year =
      date.getFullYear() === now.getFullYear() ? "" : " " + date.getFullYear();
    return day + " " + month + year;
  }
}
