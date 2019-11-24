// https://developers.google.com/apps-script/reference/document/body#editAsText()
function getScriptAndLinkOffsets(body, config, result) {
  Logger.log("in getLinkOffsets");
  var boundingElements = getBoundingElements(body, config);
  if (boundingElements === null) {
    return [];
  }
  
  var currentElement = boundingElements.start;
  var script = "";
  var links = [];
  var lastLink = "";
  var prevOffset = 0;
  
  var i = 0;
  while (currentElement !== null && currentElement.getText() != boundingElements.end.getText() && i < 20) {
    i++;
    var text = currentElement.getText();
    for (var offset = 0; offset < text.length; offset++) {
      var nextLink = currentElement.getLinkUrl(offset);
      if (nextLink != lastLink && nextLink !== null) {
        lastLink = nextLink;
        Logger.log("new link " + nextLink);
        Logger.log("offset is " + offset);
        Logger.log("prevOffset is " + prevOffset);
        links.push({"link": nextLink, "offset": offset + prevOffset});
      }
      script += text[offset];
    }
    Logger.log("moving to next element");
    prevOffset += text.length;
    
    currentElement = getNextTextElement(currentElement);
    // Always add whitespace between paragraphs (for parsing later).
    script += "  ";
  }
  
  return {"links": links, "script": script};
}

function getBoundingElements (body, config) {
  var text = body.editAsText();
  
  var searchStart = text.findText(config[CONFIG_START_KEYWORD]);
  if (searchStart === null) {
    Logger.log("can't find start keyword");
    return null;
  }
  var startElement = getNextTextElement(searchStart.getElement());
  
  var searchEnd = text.findText(config[CONFIG_END_KEYWORD], searchStart);
  if (searchEnd === null) {
    Logger.log("can't find end keyword");
    return null;
  }
  
  return {"start": startElement, "end": searchEnd.getElement()};
}

/*
Does an in order traversal of the document from the starting point to find the next
element with type TEXT.
*/
// TODO: this and the below function really need to be unit tested, but setting up
// Docs in unit tests is hard.
function getNextTextElement(element) {
  var nextEl = element;
  var i = 0
  while ((nextEl = getNextElement(nextEl)) !== null && i < 20) {
    i++;
    if (nextEl.getType() == DocumentApp.ElementType.TEXT) {
      return nextEl;
    }
  }
  return null;
}

function getNextElement(element) {
  var nextEl = null;
  while ((nextEl = element.getNextSibling()) === null) {
    element = element.getParent();
    if (element === null) {
      // We're the last element in this case, since we made it to root without
      // finding the next sibling.
      return null;
    }
  }
  // We need to check if the element has a getNumChildren function, since not all
  // element type can have children.
  while (nextEl.getNumChildren !== undefined && nextEl.getNumChildren() > 0) {
    if (nextEl.getChild(0) === null) {
      break;
    }
    nextEl = nextEl.getChild(0);
  }
  return nextEl;
}