function testAll(tests) {
  var successes = 0;
  var failures = 0;
  for (test in tests) {
    Logger.log("[ RUNNING ] Test " + test);
    var success = tests[test]();
    if (success) {
      Logger.log("[   OK    ] " + test + " succeeded");
      successes++;
    } else {
      Logger.log("[  FAIL   ] " + test + " failed");
      failures++;
    }
  }
  Logger.log("Finsished with " + successes + " successes and " + failures + " failures");
}

function _listsAreEqual_(got, want) {
  if (got.length != want.length) {
    Logger.log("differing lengths: got.length = " + got.length + ", want.length = " + want.length);
    return false;
  }
  for (var i = 0; i < got.length; i++){
    if (got[i] != want[i]) {
      Logger.log("differing value at index " + i + ": got[i] = " + got[i] + ", want[i] = " + want[i]);
      return false;
    }
  }
  return true;
}


function _objectsAreEqual_(got, want) {
  for (key in got) {
    if (want[key] === undefined) {
      Logger.log("differing keys: got had key " + key + " but was not wanted");
      return false;
    }
    if (got[key] !== want[key]) {
      Logger.log("differing values: got[" + key + "] = " + got[key] + ", want[" + key + "] = " + want[key]);
      return false;
    }
  }
  for (key in want) {
    if (got[key] === undefined) {
      Logger.log("differing keys: wanted key " + key + " but was not found");
    }
  }
  return true;
}