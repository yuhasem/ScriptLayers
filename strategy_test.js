function startegy_testAll() {
  var tests = {
    "testSentenceStrategyBreakForOneSpace_": testSentenceStrategyBreakForOneSpace_,
    "testSentenceStrategyBreakForTwoSpaces_": testSentenceStrategyBreakForTwoSpaces_,
    "testSentenceStrategyBreakForNewLines_": testSentenceStrategyBreakForNewLines_,
    "testSentenceStrategyBreakForExclamations_": testSentenceStrategyBreakForExclamations_,
    "testSentenceStrategyBreakForQuestions_": testSentenceStrategyBreakForQuestions_,
    "testSentenceStrategyCanBeginWithNumber_": testSentenceStrategyCanBeginWithNumber_,
    "testSentenceStrategyAbbreviationsDoNotBreak_": testSentenceStrategyAbbreviationsDoNotBreak_,
    "testSentenceStrategyOpenBracketsAreIncluded_": testSentenceStrategyOpenBracketsAreIncluded_,
    "testSentenceStrategyClosingBracketsAfterEndingMarkAreIncluded_": testSentenceStrategyClosingBracketsAfterEndingMarkAreIncluded_,
    "testSentenceStrategyUnparseableReturnsEmptyList_": testSentenceStrategyUnparseableReturnsEmptyList_,
    "testClauseStrategyAlwaysBreakAtPeriod_": testClauseStrategyAlwaysBreakAtPeriod_,
    "testClauseStrategyAlwaysBreakAtExclamation_": testClauseStrategyAlwaysBreakAtExclamation_,
    "testClauseStrategyAlwaysBreakAtQuestion_": testClauseStrategyAlwaysBreakAtQuestion_,
    "testClauseStrategyMultipleSpacesCountAsOneSpace_": testClauseStrategyMultipleSpacesCountAsOneSpace_,
    "testClauseStrategyNewLinesCountAsSpace_": testClauseStrategyNewLinesCountAsSpace_,
    "testClauseStrategyMinimumClauseLengthRespectedWithinSentence_": testClauseStrategyMinimumClauseLengthRespectedWithinSentence_,
    "testClauseStrategyMinimumClauseLengthRespected_": testClauseStrategyMinimumClauseLengthRespected_,
    "testClauseStrategyMaximumClauseLengthRespected_": testClauseStrategyMaximumClauseLengthRespected_,
    "testClauseStrategyCommasCanBreakClauses_": testClauseStrategyCommasCanBreakClauses_,
    "testClauseStrategySemicolonsCanBreakClauses_": testClauseStrategySemicolonsCanBreakClauses_,
    "testClauseStrategyColonsCanBreakClauses_": testClauseStrategyColonsCanBreakClauses_,
    "testClauseStrategyCommasDontBreakEarly_": testClauseStrategyCommasDontBreakEarly_,
    "testClauseStrategySemicolonsDontBreakEarly_": testClauseStrategySemicolonsDontBreakEarly_,
    "testClauseStrategyColonsDontBreakEarly_": testClauseStrategyColonsDontBreakEarly_,
    "testClausesStrategyQuoteCanEndSentence_": testClausesStrategyQuoteCanEndSentence_,
    "testClausesStrategyQuoteCanEndSentence2_": testClausesStrategyQuoteCanEndSentence2_,
    "testClausesStrategyExtraKeywordsAreUsed_": testClausesStrategyExtraKeywordsAreUsed_,
    "testClausesStrategyRemoveKeywordsAreNotUsed_": testClausesStrategyRemoveKeywordsAreNotUsed_,
  };
  testAll(tests);
}

function testSentenceStrategyBreakForOneSpace_() {
  var text = "Sentence. One space. ";
  var want = ["Sentence.", "One space."];
  var strat = createStrategy("sentences");
  
  var got = strat.getLines(text);
  
  return _listsAreEqual_(got, want);
}

function testSentenceStrategyBreakForTwoSpaces_() {
  var text = "Sentence.  Two spaces. ";
  var want = ["Sentence.", "Two spaces."];
  var strat = createStrategy("sentences");
  
  var got = strat.getLines(text);
  
  return _listsAreEqual_(got, want);
}

function testSentenceStrategyBreakForNewLines_() {
  var text = "Sentence.\n\nTwo new lines.\n";
  var want = ["Sentence.", "Two new lines."];
  var strat = createStrategy("sentences");
  
  var got = strat.getLines(text);
  
  return _listsAreEqual_(got, want);
}

function testSentenceStrategyBreakForExclamations_() {
  var text = "Sentence! What a Sentence! ";
  var want = ["Sentence!", "What a Sentence!"];
  var strat = createStrategy("sentences");
  
  var got = strat.getLines(text);
  
  return _listsAreEqual_(got, want);
}

function testSentenceStrategyBreakForQuestions_() {
  var text = "Sentence?  How is a sentence? ";
  var want = ["Sentence?", "How is a sentence?"];
  var strat = createStrategy("sentences");
  
  var got = strat.getLines(text);
  
  return _listsAreEqual_(got, want);
}

function testSentenceStrategyCanBeginWithNumber_() {
  var text = "1 sentence.  5 more sentences. ";
  var want = ["1 sentence.", "5 more sentences."];
  var strat = createStrategy("sentences");
  
  var got = strat.getLines(text);
  
  return _listsAreEqual_(got, want);
}

function testSentenceStrategyAbbreviationsDoNotBreak_() {
  var text = "The U.S.A. is a country.  End in F.D.A. Still new sentece. ";
  var want = ["The U.S.A. is a country.", "End in F.D.A.", "Still new sentece."];
  var strat = createStrategy("sentences");
  
  var got = strat.getLines(text);
  
  return _listsAreEqual_(got, want);
}

function testSentenceStrategyOpenBracketsAreIncluded_() {
  var text = "(Parenthetical sentence.  Ignoring closing end. ";
  var want = ["(Parenthetical sentence.", "Ignoring closing end."];
  var strat = createStrategy("sentences");
  
  var got = strat.getLines(text);
  
  return _listsAreEqual_(got, want);
}

function testSentenceStrategyClosingBracketsAfterEndingMarkAreIncluded_() {
  var text = "Multiple sentenes inside parenthesis will trigger this case.) ";
  var want = ["Multiple sentenes inside parenthesis will trigger this case.)"];
  var strat = createStrategy("sentences");
  
  var got = strat.getLines(text);
  
  return _listsAreEqual_(got, want);
}

function testSentenceStrategyUnparseableReturnsEmptyList_() {
  var text = "no capital letter, no ending"
  var want = [];
  var strat = createStrategy("sentences");
  
  var got = strat.getLines(text);
  
  return _listsAreEqual_(got, want);
}

function testClauseStrategyAlwaysBreakAtPeriod_() {
  var text = "Short sentence. Will break.";
  var want = ["Short sentence.", "Will break."];
  var strat = createStrategy("clauses");
  
  var got = strat.getLines(text);
  
  return _listsAreEqual_(got, want);
}

function testClauseStrategyAlwaysBreakAtExclamation_() {
  var text = "Short sentence! Will break!";
  var want = ["Short sentence!", "Will break!"];
  var strat = createStrategy("clauses");
  
  var got = strat.getLines(text);
  
  return _listsAreEqual_(got, want);
}

function testClauseStrategyAlwaysBreakAtQuestion_() {
  var text = "Short sentence? Will break?";
  var want = ["Short sentence?", "Will break?"];
  var strat = createStrategy("clauses");
  
  var got = strat.getLines(text);
  
  return _listsAreEqual_(got, want);
}

function testClauseStrategyMultipleSpacesCountAsOneSpace_() {
  var text = "Spaces between sentences.  And between  words with enough words.";
  var want = ["Spaces between sentences.", "And between words with enough words."];
  var strat = createStrategy("clauses");
  
  var got = strat.getLines(text);
  
  return _listsAreEqual_(got, want);
}

function testClauseStrategyNewLinesCountAsSpace_() {
  var text = "Spaces between paragraphs.\n\nThe next paragraph.";
  var want = ["Spaces between paragraphs.", "The next paragraph."];
  var strat = createStrategy("clauses");
  
  var got = strat.getLines(text);
  
  return _listsAreEqual_(got, want);
}

function testClauseStrategyMinimumClauseLengthRespectedWithinSentence_() {
  var text = "And and and and and and and and and and.";
  var want = ["And and and and and", "and and and and and."];
  var strat = createStrategy("clauses");
  
  var got = strat.getLines(text);
  
  return _listsAreEqual_(got, want);
}

function testClauseStrategyMinimumClauseLengthRespected_() {
  var text = "And and and and and and and and and and.";
  var want = ["And and and and and", "and and and and and."];
  config = {};
  config[CONFIG_CLAUSES_SENTENCE_ENDS_CLAUSE] = false;
  var strat = createStrategy("clauses", config);
  
  var got = strat.getLines(text);
  
  return _listsAreEqual_(got, want);
}

function testClauseStrategyMaximumClauseLengthRespected_() {
  var text = "No clause breaking keywords dude dude dude dude dude dude dude dude dude dude dude dude dude.";
  var want = [];
  config = {};
  config[CONFIG_CLAUSES_SENTENCE_ENDS_CLAUSE] = false;
  config[CONFIG_CLAUSES_MAX_LENGTH] = 12;
  var strat = createStrategy("clauses", config);
  
  var got = strat.getLines(text);
  
  return _listsAreEqual_(got, want);
}

function testClauseStrategyCommasCanBreakClauses_() {
  var text = "Get some appropriate clause length, then comma with enough words.";
  var want = ["Get some appropriate clause length,", "then comma with enough words."];
  var strat = createStrategy("clauses");
  
  var got = strat.getLines(text);
  
  return _listsAreEqual_(got, want);
}

function testClauseStrategySemicolonsCanBreakClauses_() {
  var text = "Get some appropriate clause length; then semicolon with enough words.";
  var want = ["Get some appropriate clause length;", "then semicolon with enough words."];
  var strat = createStrategy("clauses");
  
  var got = strat.getLines(text);
  
  return _listsAreEqual_(got, want);
}

function testClauseStrategyColonsCanBreakClauses_() {
  var text = "Get some appropriate clause length: then colon with enough words.";
  var want = ["Get some appropriate clause length:", "then colon with enough words."];
  var strat = createStrategy("clauses");
  
  var got = strat.getLines(text);
  
  return _listsAreEqual_(got, want);
}

function testClauseStrategyCommasDontBreakEarly_() {
  var text = "Too long, didn't read.";
  var want = ["Too long, didn't read."];
  var strat = createStrategy("clauses");
  
  var got = strat.getLines(text);
  
  return _listsAreEqual_(got, want);
}

function testClauseStrategySemicolonsDontBreakEarly_() {
  var text = "Too long; didn't read.";
  var want = ["Too long; didn't read."];
  var strat = createStrategy("clauses");
  
  var got = strat.getLines(text);
  
  return _listsAreEqual_(got, want);
}

function testClauseStrategyColonsDontBreakEarly_() {
  var text = "Too long: didn't read.";
  var want = ["Too long: didn't read."];
  var strat = createStrategy("clauses");
  
  var got = strat.getLines(text);
  
  return _listsAreEqual_(got, want);
}

function testClausesStrategyQuoteCanEndSentence_() {
  var text = "\"This is a lengthy quoted sentence.\" This is not.";
  var want = ["\"This is a lengthy quoted sentence.\"", "This is not."];
  var strat = createStrategy("clauses");
  
  var got = strat.getLines(text);
  
  return _listsAreEqual_(got, want);
}

function testClausesStrategyQuoteCanEndSentence2_() {
  var text = "“Quotes can be a problem in your parser,” I said, “especially when ending a sentence.”";
  var want = ["“Quotes can be a problem in your parser,”", "I said, “especially when ending a sentence.”"];
  var strat = createStrategy("clauses", {"clauses-max-clause-length": 15});
  
  var got = strat.getLines(text);
  
  return _listsAreEqual_(got, want);
}

function testClausesStrategyExtraKeywordsAreUsed_() {
  var text = "Not that I want it because I have to do it.";
  var want = ["Not that I want it", "because I have to do it."];
  var strat = createStrategy("clauses", {"clauses-extra-keywords": "other, because"});
  
  var got = strat.getLines(text);
  
  return _listsAreEqual_(got, want);
}

function testClausesStrategyRemoveKeywordsAreNotUsed_() {
  var text = "And and and and and and and and and and and.";
  var want = ["And and and and and and and and and and and."];
  var strat = createStrategy("clauses", {"clauses-remove-keywords": "and"});
  
  var got = strat.getLines(text);
  
  return _listsAreEqual_(got, want);
}