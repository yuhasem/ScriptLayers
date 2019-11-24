function onOpen(e) {
  DocumentApp.getUi().createMenu("Script Layers")
      .addItem("Run Script Layers", "createConfigDialog")
      .addToUi();
}

// createConfigDialog is the entry point for the UI Menu to parse the document.
function createConfigDialog() {
  Logger.log(DocumentApp.getActiveDocument().getId());
  openConfigDialog(DocumentApp.getActiveDocument());
}

// useConfig is the entry point for the "Update" and "Generate" buttons to effect the document.
function useConfig(config) {
  Logger.log("in parseConfig");
  Logger.log(config);
  
  var document = DocumentApp.getActiveDocument();
  var table = findTable(document.getBody(), CONFIG_TABLE_TITLE);
  // TODO: I tried passing the parsed config from the first execution trough the client side js,
  // but I wasn't able to get it to work properly.  Instead, reparse and merge the configs so that
  // we don't lose values in the table that the client dialog doesn't know about.
  var oldConfig = parseConfigTable(table);
  mergeConfigs(config, oldConfig);
  
  var result = {'success': true, 'messages': []};
  config = validateConfig(config, result);
  config = actOnConfig(document, config, result);
  
  fillConfigTable(document.getBody(), table, config, result);
  return result;
}

function mergeConfigs(newC, oldC) {
  for (key in oldC) {
    if (!newC[key] && newC[key] !== false) {
      newC[key] = oldC[key];
    }
  }
}

/*
openConfigDialog opens the dialog to modify the config, parse the document, and update
the associated gif spreadsheet.

params:
document - the Document which contains the config and script. (https://developers.google.com/apps-script/reference/document/document)
*/
function openConfigDialog(document) {
  var html = HtmlService.createTemplateFromFile("config.html");
  var table = findTable(document.getBody(), CONFIG_TABLE_TITLE);
  html.configWasFound = (table != null);
  Logger.log(table);
  
  var config = parseConfigTable(table);
  Logger.log(config);
  html.config = config;
  
  // This doesn't block!
  DocumentApp.getUi().showModalDialog(html.evaluate(), "Script Layers Customization");
  Logger.log("dialog served");
}

/*
findTable finds a table with the given title.  It will search all tables in body and
will return the table which has `title` as an exact match in the first cell of the first
row.  The returned Table will maintain its position in the given Body, so editiing it
will edit the document.

params:
body - the Body to search in (https://developers.google.com/apps-script/reference/document/body)
title - the string to search for to match the table (string)

returns:
a Table with the given title in the first cell. (https://developers.google.com/apps-script/reference/document/table)
*/
function findTable(body, title) {
  var searchResult = null;
  
  // Iterate through all the tables in the document. The first one that has
  // a matching title is assumed to be the configuration table.
  while (searchResult = body.findElement(DocumentApp.ElementType.TABLE, searchResult)) {
    table = searchResult.getElement().asTable();
    textAtFirstCell = table.getCell(0, 0).getText();
    Logger.log("text at first cell: " + textAtFirstCell);
    if (textAtFirstCell == title){
      return table;
    }
  }
  return null
}

/*
parseConfigTable takes a Table and returns the associated config.  This function ignores
the first row of the table.  Every row after that is expected to have 2 columns.  The first
will be the key in the config object and the second will be the value.  If any row has
more or less than 2 columns, the row is ignored.

params:
table - a Table to parse (https://developers.google.com/apps-script/reference/document/table)

returns:
an object which is the config represented by the table (never null).
*/
function parseConfigTable(table) {
  // This looks like an ugly hack to copy objects, but this is actually standard JS.
  // What I'm trying to say here is:  Programming in Javascript is bad practice.
  var config = JSON.parse(JSON.stringify(DEFAULTS));
  
  if (table == null) {
    return config;
  }
  
  // Skip the first row since that's just the header.
  for (var i = 1; i < table.getNumRows(); i++){
    var row = table.getRow(i);
    if (row.getNumCells() != 2){
      Logger.log("a row should only have 2 cells, the first being the attribute, the second being the value");
      continue;
    }
    config[row.getCell(0).getText()] = row.getCell(1).getText();
  }
  return config;
}

/*
actOnConfig does the following:
1) checks config to see if spreadsheet should be generated, and stops if it isn't
2) gets the script out of the document
3) gets link offsets within the script
3) gets the list of lines in the script
4) updates the spreadsheet with the lines
5) updates and returns the config

parameters:
document - a Document which contains the script
config - an object which dictates how the script is parsed and used
result - an object with `success` and `messages` fields which are updated based on processing

returns:
the config, updated based on processing
*/
function actOnConfig(document, config, result) {
  if (config[CONFIG_GENERATE_GIF_SHEET] === "false" || config[CONFIG_GENERATE_GIF_SHEET] === false) {
    return config;
  }
  
  var scriptAndLinks = getScriptAndLinkOffsets(document.getBody(), config, result);
  var script = scriptAndLinks.script;
  var links = scriptAndLinks.links;
  Logger.log("Raw links:");
  for (var i = 0; i < links.length; i++) {
    Logger.log(links[i].link + ": " + links[i].offset);
  }
  
//  var text = document.getBody().getText();
//  var script = getScript(text, config);
//  if (!script) {
//    Logger.log("Could not parse script.");
//    result.success = false;
//    result.messages.push("Could not parse script.");
//    return config;
//  }
  Logger.log("Script parsed.  Proceeding with text = " + script);
  
  if (config[CONFIG_STRIP_SQUARE_BRACKETS] === true || config[CONFIG_STRIP_SQUARE_BRACKETS] === "true") {
    script = stripTextBetween('[', ']', script, links);
  }
  if (config[CONFIG_STRIP_CURLY_BRACES] === true || config[CONFIG_STRIP_CURLY_BRACES] === "true") {
    script = stripTextBetween('{', '}', script, links);
  }
  if (config[CONFIG_STRIP_ANGLE_BRACKETS] === true || config[CONFIG_STRIP_ANGLE_BRACKETS] === "true") {
    script = stripTextBetween('<', '>', script, links);
  }
  Logger.log("Stripped text: " + script);
  Logger.log("Final links:");
  for (var i = 0; i < links.length; i++) {
    Logger.log(links[i].link + ": " + links[i].offset);
  }
  
  var lines = getLinesFromScript(script, config, result);
  if (lines.length == 0){
    // No lines returned means we can't do anything with the gif sheet.  Just return instead of trying to modify anything further.
    Logger.log("Script has no lines.");
    result.success = false;
    result.messages.push("Couldn't use selected style to parse script.");
    return config;
  }
  
  var spreadsheet = getSpreadsheet(document, config, result);
  if (spreadsheet === null) {
    Logger.log("Couldn't create or open spreadsheet.");
    result.success = false;
    result.messages.push("Couldn't get or make a spreadsheet.");
    return config;
  }
  
  updateSpreadsheet(spreadsheet, lines, links, result);
  
  Logger.log("Done using config.");
  return config;
}

/*
getLinesFromScript returns a list of lines, parsed from the script as described by the config.

parameters:
script - a string which is the script to parse
config - an object which describes how to parse the script
result - an object with `success` and `messages` fields which are updated based on processing

returns:
a list of strings, never null, but may be empty.
*/
function getLinesFromScript(script, config, result) {
  var strategy = createStrategy(config[CONFIG_GENERATION_STYLE], config);
  if (strategy === null) {
    result.success = false;
    result.messages.push("Couldn't use selected style to parse script.");
    return [];
  }
  var lines = strategy.getLines(script);
  Logger.log(lines.length + " lines returned");
  Logger.log(lines);
  return lines;
}

/*
getSpreadsheet returns the spreadsheet that will be updated with the parsed script.

parameters:
document - the Document which contains the script
config - an object which describes the spreadsheet to load
result - an object with `success` and `messages` fields which is updated during processing

returns:
a Spreadsheet (can be null).
*/
function getSpreadsheet(document, config, result) {
  if (!config[CONFIG_SHEET_LINK]) {
    Logger.log("Attempting to create a new spreadsheet");
    
    // Get the folder of the current document
    var currentFile = DriveApp.getFileById(document.getId());
    var folderIterator = currentFile.getParents();
    // Just use the first folder for now.  I don't know how this will react to a file in multiple folders.
    var folder = folderIterator.next();
    
    // TODO: is there a better way in the API to do this?
    // Right now we create a spreadsheet, copy it to the right folder, and then delete the original.
    // This just doesn't seem kosher.
    var spreadsheet = SpreadsheetApp.create("name");
    var id = spreadsheet.getId();
    var asFile = DriveApp.getFileById(id);
    var copiedSheet = asFile.makeCopy(document.getName() + " - Gif Sheet", folder);
    asFile.setTrashed(true);
    
    // Set config so that we can open it in the future
    config[CONFIG_SHEET_LINK] = copiedSheet.getUrl();
    result.messages.push("New sheet created at " + copiedSheet.getUrl());
  }
  Logger.log("Attempting to open spreadsheet");
  return SpreadsheetApp.openByUrl(config[CONFIG_SHEET_LINK]);
}

/*
updateSpreadsheet adds the given lines to the given spreadsheet.

parameters:
spreadsheet - a Spreadsheet to update
lines - a list of strings to add to the spreadsheet
result - an object with `success` and `messages` fields which is updated during processing
*/
function updateSpreadsheet(spreadsheet, lines, links, result) {
  var dataRange = spreadsheet.getDataRange();
  if (dataRange.getHeight() == 1 && dataRange.getWidth() == 1) {
    // Add data like it's the first time.
    Logger.log("Adding new title row");
    spreadsheet.appendRow(["Line", "Gif/Pic", "Comments", "Direction", "Backup Gifs"]);
  } else {
    // Data already exists, do our best not to destroy what's there already.
    var existingLines = spreadsheet.getRange('A2:B'+(1+dataRange.getHeight()));
    Logger.log("Clearing existing lines");
    existingLines.clearContent();
  }
  // Add the lines to the sheet.
  var range = spreadsheet.getRange('A2:A'+(1+lines.length));
  Logger.log("Adding new lines to the sheet");
  var newLines = [];
  var prevOffset = 0;
  for (var i = 0; i < lines.length; i++){
    newLines.push([lines[i].text]);
    var linksFound = 0;
    for (var j = 0; j < links.length; j++) {
      if (links[j].offset >= prevOffset && links[j].offset < lines[i].offset) {
        var row = 'B';
        if (linksFound) {
          row = String.fromCharCode('D'.charCodeAt(0) + linksFound);
        }
        var linkRange = spreadsheet.getRange(row+(1+i));
        linkRange.setValues([[links[j].link]]);
        linksFound++;
      }
    }
    prevOffset = lines[i].offset;
  }
  range.setValues(newLines);
  result.messages.push("Updated spreadsheet.");
}

/*
DEPRECATED - use getScriptAndLinkOffsets from links.gs

getScript finds a script (described by the config) in the text and returns it.  Specifically it finds
all text between the keywords in CONFIG_START_KEYWORD and CONFIG_END_KEYWORD, if such a pattern exists.
If it doesn't, null is returned.

parameters:
text - a string of the text to search
config - an object which describes what to look for.

returns:
a string of the script in the text described by config, or null.
*/
function getScript(text, config) {
  // JS is the only language where '.' (the character the matches anything) doesn't match everything, which is why the
  // unfamiliar (and ugly) [\s\S] is used.
  var scriptRegex = new RegExp(config[CONFIG_START_KEYWORD] + "([\\s\\S]*?)" + config[CONFIG_END_KEYWORD], "g");
  Logger.log(scriptRegex);
  var script = null;
  while ((match = scriptRegex.exec(text)) !== null){
    if (match[1].length > MINIMUM_SCRIPT_LENGTH) {
      script = match[1];
      break;
    }
  }
  return script;
}

/*
stripTextBetween will strip sections in text that occur between startChar and endChar.  It will treat
the chars as nested, e.g. with startChar < and endChar >, the text "<<word> other word> dude" will be
stripped to " dude".  Link offsets will also be updated.  Any links that occurred within text that is
stripped are removed and offsets are changed to reflect their new position in the text.

parameters:
startChar - a character to use as the start for filtering
endChar - a character to use as the end for filtering
text - the text to filter
links - an array of objects, each with a name and offset.  Updated in place.

returns:
The stripped text. 
*/
function stripTextBetween(startChar, endChar, text, links) {
  // Set (or reset) stripBy in the links.
  for (var index = 0; index < links.length; index++) {
    links[index].stripBy = 0;
  }
  var newText = ""
  var numStarts = 0;
  var strippedLength = 0;
  for (var i = 0; i < text.length; i++) {
    if (text[i] == startChar) {
      if (numStarts == 0) {
        strippedLength = 0;
      }
      numStarts++;
      strippedLength++;
    } else if (text[i] == endChar && numStarts > 0) {
      strippedLength++;
      numStarts--;
      if (numStarts == 0) {
        // Update links `stripBy` property according to strippedLength.
        Logger.log("new strippedLength = " + strippedLength);
        for (var index = 0; index < links.length; index++) {
          if (links[index].offset > (i - strippedLength) && links[index].offset <= i) {
            links[index].stripBy = -1;
          } else if (links[index].offset > i) {
            if (links[index].stripBy > 0) {
              links[index].stripBy += strippedLength;
            } else if (!links[index].stripBy) {
              links[index].stripBy = strippedLength;
            }
            Logger.log("for link " + links[index].link + " strip by is now " + links[index].stripBy);
          }
        }
      }
    } else if (numStarts == 0) {
      newText += text[i];
    } else {
      strippedLength++;
    }
  }
  // Apply stripBy.
  for (var index = links.length - 1; index >= 0; index--) {
    if (links[index].stripBy === undefined) {
      continue;
    }
    if (links[index].stripBy == -1) {
      links.splice(index, 1);
      continue;
    }
    Logger.log("for link " + links[index].link + " applying strip by " + links[index].stripBy);
    links[index].offset -= links[index].stripBy;
  }
  
  return newText;
}

/*
fillConfigTable puts a table into the document and fills it with the key value pairs in
config so that it can be parsed by this script in the future.  If table is null or 
undefined, a new table will be appended to the given body.  If a Table is given in
the table parameter, body is ignored.  result is updated with status and status
messages.

parameters:
body - a Body to append a Table to, if table is not given
table - a Table to update
config - an object
result - an object with `success` and `messages` fields
*/
function fillConfigTable(body, table, config, result) {
  if (!table) {
    Logger.log("Generating a new table...");
    table = body.appendTable();
    table.appendTableRow().appendTableCell().setText(CONFIG_TABLE_TITLE);
  }
  
  // TODO: consider using a strategy with consistent ordering (and that doesn't obliterate comments).
  while (table.getNumRows() > 1) {
    Logger.log("Row removed!");
    table.removeRow(1);
  }
  for (attribute in config) {
    var row = table.appendTableRow();
    var attributeCell = row.appendTableCell();
    attributeCell.setText(attribute);
    var valueCell = row.appendTableCell();
    valueCell.setText(config[attribute]);
    if (attribute == CONFIG_SHEET_LINK) {
      valueCell.setLinkUrl(config[attribute]);
    }
    Logger.log("Added row: [" + attribute + ", " + config[attribute] + "]");
  }
  result.messages.push("Updated config table.");
}

function validateConfig(config, result) {
  // TODO: basic validation. Is gif sheet link a valid url? Is the chosen style an option we can use?
  return config;
}

// Deprecated and no longer appearing in the menu.  Help doc is linked in the "Help" menu.  Keeping
// this in case I want to fix it up an re-release it.  The biggest problem was that it didn't work
// well with pop-up blockers.
/*
function gotoHelpDoc() {
  var html = HtmlService.createHtmlOutputFromFile("help");
  html.setWidth(90).setHeight(1);
  var ui = DocumentApp.getUi().showModalDialog(html, "Opening ..." );
}

function getHelpUrl() {
  return "https://docs.google.com/document/d/1nU838BQ6rZY5skqM9rssE3jHQPyemCyf2-7fmoypvDI/view#";
}
*/

// This is the recommended way to include CSS/JS as separate files in AppsScript development.
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}