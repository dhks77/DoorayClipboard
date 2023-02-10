function initButton(id, buttonTitle, callbackFunc) {
  console.log("init button called")
  let button = document.createElement("button");
  button.id = id;
  button.textContent = buttonTitle;
  button.className = "btn btn-danger btn-sm";
  button.addEventListener("click", callbackFunc, false);
  return button;
}

function applyDoorayInfo(responseText) {
  let response = JSON.parse(responseText);
  if (response.header.isSuccessful == false) {
    return;
  }

  let content = response.result.content;
  document.querySelector(
    "input[id=pull_request_title]"
  ).value = `#클라우드DB개발팀/${content.number}: ${content.subject}`;
  document.querySelector(
    "textarea[id=pull_request_body]"
  ).value = `* https://nhnent.dooray.com/popup/project/posts/${content.id}`;
}

function fillTitle() {
  let postNumberText = document.getElementsByClassName(
    "css-truncate css-truncate-target"
  )[7].textContent;
  let postNumber = postNumberText.split("/")[1].split("-")[0];

  chrome.runtime.sendMessage(
    {
      contentScriptQuery: "fetchUrl",
      url: `https://nhnent.dooray.com/v2/wapi/projects/!2559193520715588701/posts/${postNumber}`,
    },
    (response) => applyDoorayInfo(response)
  );

  console.log("end send");
}

function appendButton(target) {
  let buttonIds = ["QFD1boxRNX4"];

  let previousButton = target.querySelector("button[id=" + buttonIds[0] + "]");
  if (previousButton) {
    return;
  }

  var copyButton = initButton(buttonIds[0], "자동완성", fillTitle);

  target.insertBefore(
    copyButton,
    document.getElementsByClassName("new-pr-form Details-content--hidden")[0]
  );
}

function checkAndAppendButton() {
  let targets = document.getElementsByClassName(
    "js-details-container Details js-compare-pr open Details--on"
  );
  for (let i = 0; i < targets.length; i++) {
    appendButton(targets[i]);
  }
}

console.log("loaded");
setInterval(() => {
  checkAndAppendButton();
}, 1000);
