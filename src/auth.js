export function getAccessTokenFromURL() {
  const queryParams = new URLSearchParams(document.location.search);
  let ghAccessToken;
  if (queryParams.get("access_token")) {
    ghAccessToken = queryParams.get("access_token");
    localStorage.setItem("access_token", ghAccessToken);
    window.history.pushState(null, "", document.location.href.split("?")[0]);
  } else {
    ghAccessToken = localStorage.getItem("access_token");
  }
  return ghAccessToken;
}

export function logout() {
  const token = localStorage.getItem("access_token");
  fetch(`/api/logout/${token}`);
  localStorage.setItem("access_token", "");
}
