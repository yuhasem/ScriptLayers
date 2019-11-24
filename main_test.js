function main_testAll() {
  var tests = {
    'testMergeConfigsKeepsKeysFromNew_': testMergeConfigsKeepsKeysFromNew_,
    'testMergeConfigsReplacesBlanksFromNew_': testMergeConfigsReplacesBlanksFromNew_,
    'testMergeConfigsMissingKeysGetAddedToNew_': testMergeConfigsMissingKeysGetAddedToNew_,
    'testMergeConfigsValueFalseDoesNotBecomeTrue_': testMergeConfigsValueFalseDoesNotBecomeTrue_,
    'testParseConfigTableDefaultsAreUsed_': testParseConfigTableDefaultsAreUsed_,
    'testParseConfigTableDefaultsCanBeOverwritten_': testParseConfigTableDefaultsCanBeOverwritten_,
    'testParseConfigTableRowWithOneColumnIgnored_': testParseConfigTableRowWithOneColumnIgnored_,
    'testParseConfigTableRowWithThreeColumnsIgnored_': testParseConfigTableRowWithThreeColumnsIgnored_,
  };
  testAll(tests);
}

function testMergeConfigsKeepsKeysFromNew_() {
  newC = {'word': 'bird'};
  oldC = {'word': 'heard'};
  
  mergeConfigs(newC, oldC);
  
  return (newC.word === 'bird');
}

function testMergeConfigsReplacesBlanksFromNew_() {
  newC = {'word': ''};
  oldC = {'word': 'heard'};
  
  mergeConfigs(newC, oldC);
  
  return (newC.word === 'heard');
}

function testMergeConfigsMissingKeysGetAddedToNew_() {
  newC = {};
  oldC = {'word': 'heard'};
  
  mergeConfigs(newC, oldC);
  
  return (newC.word == 'heard');
}

function testMergeConfigsValueFalseDoesNotBecomeTrue_() {
  newC = {'word': false};
  oldC = {'word': true};
  
  mergeConfigs(newC, oldC);
  
  return !newC.word;
}

function testParseConfigTableDefaultsAreUsed_() {
  var oldDefaults = DEFAULTS;
  DEFAULTS = {'word': 'bird'};
  
  var got = parseConfigTable(null);
  
  var result = _objectsAreEqual_(got, DEFAULTS);
  DEFAULTS = oldDefaults;
  return result;
}

function testParseConfigTableDefaultsCanBeOverwritten_() {
  var oldDefaults = DEFAULTS;
  DEFAULTS = {'word': 'bird'};
  
  var copiedBody = DocumentApp.getActiveDocument().getBody().copy();
  var table = copiedBody.appendTable();
  table.appendTableRow();
  var firstConfigRow = table.appendTableRow();
  firstConfigRow.appendTableCell("word");
  firstConfigRow.appendTableCell("heard");
  
  var got = parseConfigTable(table);
  var want = {'word': 'heard'};
  
  var result = _objectsAreEqual_(got, want);
  DEFAULTS = oldDefaults;
  return result;
}

function testParseConfigTableRowWithOneColumnIgnored_() {
  var oldDefaults = DEFAULTS;
  DEFAULTS = {};
  
  var copiedBody = DocumentApp.getActiveDocument().getBody().copy();
  var table = copiedBody.appendTable();
  table.appendTableRow();
  var firstConfigRow = table.appendTableRow();
  firstConfigRow.appendTableCell("just one");
  
  var got = parseConfigTable(table);
  var want = {};
  
  var result = _objectsAreEqual_(got, want);
  DEFAULTS = oldDefaults;
  return result;
}

function testParseConfigTableRowWithThreeColumnsIgnored_() {
  var oldDefaults = DEFAULTS;
  DEFAULTS = {};
  
  var copiedBody = DocumentApp.getActiveDocument().getBody().copy();
  var table = copiedBody.appendTable();
  table.appendTableRow();
  var firstConfigRow = table.appendTableRow();
  firstConfigRow.appendTableCell("one");
  firstConfigRow.appendTableCell("two");
  firstConfigRow.appendTableCell("three!");
  
  var got = parseConfigTable(table);
  var want = {};
  
  var result = _objectsAreEqual_(got, want);
  DEFAULTS = oldDefaults;
  return result;
}

// TODO: test findTable