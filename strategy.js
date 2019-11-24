// For any startegy, getLines should return a list (non-null).  TODO: Is there a way to enforce this?

// createStrategy is the factory function to create a new Strategy of the specified type.  `config` is an optional
// parameter that is passed to the new Strategy instance so that strategies can be configured by the user.
function createStrategy(type, config) {
  config = config || {};
  if (type == "clauses"){
    return new ClauseStrategy(config);
  } else if (type == "sentences") {
    return new SentenceStrategy(config);
  }
  return null;
}

function ClauseStrategy(config) {
  config = config || {};
  this.sentenceBreaksAlwaysEndClause = true;
  if (config[CONFIG_CLAUSES_SENTENCE_ENDS_CLAUSE] === false || config[CONFIG_CLAUSES_SENTENCE_ENDS_CLAUSE] == "false") {
    this.sentenceBreaksAlwaysEndClause = false;
  }
  this.clauseKeywords = ["and", "or", "but", "whose", "who", "that", "which", "to", "how", "from", "about", "when"];
  if (config[CONFIG_CLAUSES_EXTRA_KEYWORDS]) {
    var keywords = config[CONFIG_CLAUSES_EXTRA_KEYWORDS].split(/,\s?/);
    if (!keywords) {
      Logger.log("Couldn't get extra keywords from: " + config[CONFIG_CLAUSES_EXTRA_KEYWORDS]);
    }
    for (var i = 0; i < keywords.length; i++) {
      this.clauseKeywords.push(keywords[i]);
    }
  }
  if (config[CONFIG_CLAUSES_REMOVE_KEYWORDS]) {
    var keywords = config[CONFIG_CLAUSES_REMOVE_KEYWORDS].split(/,\s?/);
    if (!keywords) {
      Logger.log("Couldn't get keywords to remove from: " + config[CONFIG_CLAUSES_REMOVE_KEYWORDS]);
    }
    for (var i = this.clauseKeywords.length - 1; i >= 0; i--) {
      for (var j = 0; j < keywords.length; j++) {
        if (this.clauseKeywords[i] == keywords[j]) {
          this.clauseKeywords.splice(i, 1);
        }
      }
    }
  }
  Logger.log("Proceeding with keywords list: " + this.clauseKeywords);
  // The last mark was copy pasted from a doc, because it's a special unicode character separate from ".
  this.closeMarks = [">", ")", "]", "}", "\"", "'", "`", "”", "’"];
  this.minimumClauseLength = DEFAULT_MIN_LENGTH;
  if (config[CONFIG_CLAUSES_MIN_LENGTH]) {
    this.minimumClauseLength = Number(config[CONFIG_CLAUSES_MIN_LENGTH]);
  }
  this.maximumClauseLength = DEFAULT_MAX_LENGTH;
  if (config[CONFIG_CLAUSES_MAX_LENGTH]) {
    this.maximumClauseLength = Number(config[CONFIG_CLAUSES_MAX_LENGTH]);
  }
  // Stored for use in breaking sentences.
  this.config = config;
}

ClauseStrategy.prototype._isKeyword = function (word) {
  for (var i = 0; i < this.clauseKeywords.length; i++){
    if (this.clauseKeywords[i] == word) {
      return true;
    }
  }
  return false;
}

ClauseStrategy.prototype._isClosingMark = function (char) {
  for (var i = 0; i < this.closeMarks.length; i++){
    if (this.closeMarks[i] == char) {
      return true;
    }
  }
  return false;
}

ClauseStrategy.prototype.getLines = function (text) {
  if (this.sentenceBreaksAlwaysEndClause) {
    var sentenceStrategy = createStrategy("sentences", this.config);
    var sentences = sentenceStrategy.getLines(text);
    Logger.log("using sentences: " + sentences);
    var clauses = [];
    for (var i = 0; i < sentences.length; i++) {
      var nextClauses = this._getLines(sentences[i].text);
      if (nextClauses.length > 0) {
        Logger.log("clauses for sentence: " + nextClauses)
        for (var j = 0; j < nextClauses.length; j++) {
          nextClauses[j].offset += sentences[i].offset;
        }
        clauses = clauses.concat(nextClauses);
      } else {
        clauses.push(sentences[i]);
      }
    }
    return clauses;
  } else {
    return this._getLines(text);
  }
  return [];
}

/*
A subfunction to do only the line finding portion, used when breaking at sentences to do iterate the
strategy over every sentence.

TODO: document the algorithm
*/
ClauseStrategy.prototype._getLines = function (text) {
  var clauses = [[]];
  var words = text.split(/\s+/);
  // List of numbers where each number is an index of a word we can break after.
  var allowedBreaks = [];
  for (var i = 0; i < words.length; i++) {
    if (this._isKeyword(words[i+1])) {
      allowedBreaks.push(i);
      continue;
    }
    var word = words[i];
    var lastChar = word[word.length - 1];
    var fromEnd = 1;
    // Ignore characters that are ending quotations, parentheticals, etc.
    while (this._isClosingMark(lastChar) && fromEnd < word.length) {
      fromEnd++;
      lastChar = word[word.length - fromEnd];
    }
    if (lastChar == "." || lastChar == "?" || lastChar == "!" || lastChar == "," || lastChar == ";" || lastChar == ":") {
      allowedBreaks.push(i);
    }
  }
  // Always end with a break.
  if (allowedBreaks[allowedBreaks.length - 1] != words.length - 1) {
    allowedBreaks.push(words.length);
  }
  var breaksToUse = this.getValidBreaks(allowedBreaks, -1, []);
  Logger.log("allowed breaks: " + allowedBreaks);
  Logger.log("breaks to use: " + breaksToUse);
  if (breaksToUse === null) {
    return [];
  }
  
  var clauses = [];
  var currentClause = [];
  var breakIndex = 0;
  var currentOffset = 0;
  var totalOffset = 0;
  for (var i = 0; i < words.length; i++) {
    totalOffset += words[i].length + 1; // Assuming always one space which is a bad assumption.
    currentClause.push(words[i]);
    if (i == breaksToUse[breakIndex]) {
      currentClause = {"text": currentClause, "offset": currentOffset},
      Logger.log(currentClause);
      clauses.push(currentClause);
      currentClause = [];
      currentOffset = totalOffset;
      breakIndex++;
    }
  }
  
  if (clauses.length == 0) {
    Logger.log("failed to find an appropriate clause rendering of the script.");
  }
  for (var i = 0; i < clauses.length; i++) {
    clauses[i].text = clauses[i].text.join(" ");
  }
  return clauses;
}

ClauseStrategy.prototype.getValidBreaks = function (allowedBreaks, start, accumulator) {
  if (start == allowedBreaks[allowedBreaks.length - 1] || allowedBreaks.length == 0) {
    return accumulator;
  }
  for (var i = 0; i < allowedBreaks.length; i++) {
    if (allowedBreaks[i] < start + this.minimumClauseLength) {
      // Skip all the indecies which would make the next clause too short.
      continue;
    }
    if (allowedBreaks[i] > start + this.maximumClauseLength) {
      // null is the keyword meaning we haven't found any valid breaks.
      return null;
    }
    var next = copyArray(accumulator);
    next.push(allowedBreaks[i]);
    var valid = this.getValidBreaks(allowedBreaks, allowedBreaks[i], next);
    if (valid === null) {
      // Picking this breakpoint isn't valid, but maybe there's another one we can do.
      continue;
    }
    return valid;
  }
  return null;
}

function copyArray(a) {
  var b = [];
  for (var i = 0; i < a.length; i++) {
    b.push(a[i]);
  }
  return b;
}

function SentenceStrategy(config) {
  // I don't actually understand how the first \s matches at the end of a paragraph.  But it works, so...ship it?
  // It will fail on people's names like "J. R. R. Tolkein".  This could be fixed if people would actually do 2
  // spaces after a full stop like IEEE expects.
  // Note the other types of quotes.  These are unicode symbols copied from a doc because they're different than
  // the standard ".
  this.sentenceRegex = /((<|\(|\[|\{|"|'|“|‘)?[A-Z0-9].*?(\.|\!|\?)(>|\)|\]|\}|"|'|”|’)?)(?=\s\s?(<|\(|\[|\{|"|'|“|‘)?([A-Z0-9]|$))/gm;
}

SentenceStrategy.prototype.getLines = function (text) {
  // If the last element is a character, insert some whitespace so that the regex can match the last sentence.
  if (text[text.length - 1] != " " && text[text.length] - 1 != "\n") {
    text += " ";
  }
  
  var result = [];
  var match;
  while ((match = this.sentenceRegex.exec(text)) !== null) {
    result.push({"text": match[0], "offset": match.index});
  }
  return result;
}