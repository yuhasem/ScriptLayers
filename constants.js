CONFIG_TABLE_TITLE = "Script Layers Configuration";

CONFIG_GENERATE_GIF_SHEET = "generate-gif-sheet";
CONFIG_GENERATION_STYLE = "gif-sheet-generation-style";
CONFIG_START_KEYWORD = "script-start-keyword";
CONFIG_END_KEYWORD = "script-end-keyword";
CONFIG_SHEET_LINK = "gif-sheet-link";
CONFIG_CLAUSES_MIN_LENGTH = "clauses-min-clause-length";
CONFIG_CLAUSES_MAX_LENGTH = "clauses-max-clause-length";
CONFIG_CLAUSES_SENTENCE_ENDS_CLAUSE = "clauses-sentences-always-end-clause";
CONFIG_STRIP_SQUARE_BRACKETS = "parser-strip-text-between-square-brackets";
CONFIG_STRIP_CURLY_BRACES = "parser-strip-text-between-curly-braces";
CONFIG_STRIP_ANGLE_BRACKETS = "parser-strip-text-between-angle-brackets";
CONFIG_CLAUSES_EXTRA_KEYWORDS = "clauses-extra-keywords";
CONFIG_CLAUSES_REMOVE_KEYWORDS = "clauses-remove-keywords";

DEFAULTS = {};
DEFAULTS[CONFIG_GENERATE_GIF_SHEET] = true;
DEFAULTS[CONFIG_GENERATION_STYLE] = "clauses";
DEFAULTS[CONFIG_START_KEYWORD] = "SCRIPT-START";
DEFAULTS[CONFIG_END_KEYWORD] = "SCRIPT-END";
DEFAULTS[CONFIG_STRIP_SQUARE_BRACKETS] = false;
DEFAULTS[CONFIG_STRIP_CURLY_BRACES] = false;
DEFAULTS[CONFIG_STRIP_ANGLE_BRACKETS] = false;

// Not in the defaults map because they don't appear in the UI.
DEFAULT_MIN_LENGTH = 5;
DEFAULT_MAX_LENGTH = 20;

VALID_GIF_SHEET_STYLES = ["clauses", "sentences"];

// The regex to find the script can match the config table.  We assume that the script will
// be much larger than the config table, so we can use a minimum length to parse the correct
// thing.
// TODO: This is no longer necessary with the new parsing semantics, but also means we are 
// limited to keeping the config table at the end of the doc.  See if I can refactor it
// so that I can accept the script regardless of the config table location.
MINIMUM_SCRIPT_LENGTH = 100;

COMMENT_COMMAND_KEYWORD = "ipsl";