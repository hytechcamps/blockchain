document.addEventListener('DOMContentLoaded', function() {
  function getRemixUrlFromCode(data) {
    let url = new URL("https://remix.ethereum.org");
    url.searchParams.set("code", btoa(data).replace(/=*$/, ''));

    return url;
  }

  gitbook.events.bind("page.change", function() {
    if (gitbook.state.filepath == "FollowAlong.md") {
      let remixCodeElement = document.querySelector("#pre-remix-code + pre");
      let remixCode = remixCodeElement.innerText;
      let remixUrl = getRemixUrlFromCode(remixCode);
      
      let remixLinkElement = document.querySelector("#remix-url");
      remixLinkElement.href = remixUrl;
    }
  });
});