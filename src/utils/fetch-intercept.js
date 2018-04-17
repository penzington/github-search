function fetchIntercept(ghAccessToken) {
  let originalFetch = window.fetch;
  window.fetch = (...args) =>
    getWrappedFetch(originalFetch, ghAccessToken, ...args);
}

function sendData(data) {
  navigator.sendBeacon("/api/log", JSON.stringify(data));
}

function getWrappedFetch(fetch, ghAccessToken, ...args) {
  const metaData = {};
  const onRequest = () => {
    if (args[1]) {
      const body = JSON.parse(args[1].body);
      metaData.variables = body.variables;
      metaData.queryType = body.variables.queryType;
    }
    metaData.start = parseInt(performance.now(), 10);
  };
  const onResponse = async response => {
    metaData.end = parseInt(performance.now(), 10);
    sendData({ id: ghAccessToken, metaData });
    return response;
  };
  const onResponseError = error => {
    metaData.error = error.toString();
    sendData({ id: ghAccessToken, metaData });
    throw error;
  };
  return Promise.resolve()
    .then(() => onRequest())
    .then(() => fetch(...args))
    .then(onResponse, onResponseError);
}

export default fetchIntercept;
