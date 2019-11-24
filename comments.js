// TODONT: comments on doc should get added as gif links in the sheet
// getting comments: https://developers.google.com/apps-script/guides/services/advanced
// https://developers.google.com/drive/api/v3/reference/comments/list
// https://stackoverflow.com/questions/50913184/access-google-docs-comments-from-google-app-scripts

// I'm abandoning the idea of using comments to mark where gifs go.  There's no good way of knowing where
// the comment is attached (if it is) and they aren't all that versatile.  Instead, I'd like to move to
// direct links in the script itself.  It solves all the structure problems that comments had while still
// being understandable for the people adding them.

// TODO: document this decision for future developers (and future me)

// API return sample
/*
{
 "kind": "drive#commentList",
 "comments": [
  {
   "kind": "drive#comment",
   "id": "AAAACtjbsg8",
   "createdTime": "2019-05-19T17:12:57.796Z",
   "modifiedTime": "2019-05-19T17:13:04.398Z",
   "author": {
    "kind": "drive#user",
    "displayName": "Eric Yuhas",
    "photoLink": "//lh3.googleusercontent.com/-hcN5NXDiKBk/AAAAAAAAAAI/AAAAAAAABo4/rEIKEFEKmno/s96-k-no/photo.jpg",
    "me": true
   },
   "htmlContent": "ipsl gif funny_thing",
   "content": "ipsl gif funny_thing",
   "deleted": false,
   "quotedFileContent": {
    "mimeType": "text/html",
    "value": "mments on"                      <---------------- Changing the text hilighted by the comment does NOT change this value.  This is immutable from what I can tell
   },
   "anchor": "kix.49mlg9uabwaq",
   "replies": [
    {
     "kind": "drive#reply",
     "id": "AAAACtjbshA",
     "createdTime": "2019-05-19T17:13:04.398Z",
     "modifiedTime": "2019-05-19T17:13:04.398Z",
     "author": {
      "kind": "drive#user",
      "displayName": "Eric Yuhas",
      "photoLink": "//lh3.googleusercontent.com/-hcN5NXDiKBk/AAAAAAAAAAI/AAAAAAAABo4/rEIKEFEKmno/s96-k-no/photo.jpg",
      "me": true
     },
     "htmlContent": "ipsl remove",
     "content": "ipsl remove",
     "deleted": false
    }
   ]
  },
  {
   "kind": "drive#comment",
   "id": "AAAACtjbsg4",
   "createdTime": "2019-05-19T17:12:43.328Z",
   "modifiedTime": "2019-05-19T17:12:43.328Z",
   "author": {
    "kind": "drive#user",
    "displayName": "Eric Yuhas",
    "photoLink": "//lh3.googleusercontent.com/-hcN5NXDiKBk/AAAAAAAAAAI/AAAAAAAABo4/rEIKEFEKmno/s96-k-no/photo.jpg",
    "me": true
   },
   "htmlContent": "ipsl gif \u003ca href=\"https://www.google.com/url?q=http://i.imgur.com&amp;sa=D&amp;ust=1558289563328000&amp;usg=AFQjCNGwgH-g_rqYI2hgSkzrFzcEObwfnw\" data-rawHref=\"http://i.imgur.com\" target=\"_blank\"\u003ehttp://i.imgur.com\u003c/a\u003e",
   "content": "ipsl gif http://i.imgur.com",
   "deleted": false,
   "quotedFileContent": {
    "mimeType": "text/html",
    "value": "editing"
   },
   "anchor": "kix.26mb3zxyzvze",
   "replies": []
  },
  {
   "kind": "drive#comment",
   "id": "AAAACtjbsg0",
   "createdTime": "2019-05-19T17:12:25.261Z",
   "modifiedTime": "2019-05-19T17:12:25.261Z",
   "author": {
    "kind": "drive#user",
    "displayName": "Eric Yuhas",
    "photoLink": "//lh3.googleusercontent.com/-hcN5NXDiKBk/AAAAAAAAAAI/AAAAAAAABo4/rEIKEFEKmno/s96-k-no/photo.jpg",
    "me": true
   },
   "htmlContent": "This is inside the script",
   "content": "This is inside the script",
   "deleted": false,
   "quotedFileContent": {
    "mimeType": "text/html",
    "value": "esting nodes? I"
   },
   "anchor": "kix.55twko44rxxx",
   "replies": []
  },
  {
   "kind": "drive#comment",
   "id": "AAAACtjbsgw",
   "createdTime": "2019-05-19T17:12:13.475Z",
   "modifiedTime": "2019-05-19T17:12:13.475Z",
   "author": {
    "kind": "drive#user",
    "displayName": "Eric Yuhas",
    "photoLink": "//lh3.googleusercontent.com/-hcN5NXDiKBk/AAAAAAAAAAI/AAAAAAAABo4/rEIKEFEKmno/s96-k-no/photo.jpg",
    "me": true
   },
   "htmlContent": "This is outside the script",
   "content": "This is outside the script",
   "deleted": false,
   "quotedFileContent": {
    "mimeType": "text/html",
    "value": "with gifs&lt;/gif&gt;. &lt;act note=&quot;finger point&quot;&gt;Some text may be annotated for acting&lt;/act&gt; direction. Others can have &lt;e"
   },
   "anchor": "kix.s9xwire5va9t",
   "replies": []
  },
  {
   "kind": "drive#comment",
   "id": "AAAACLN4sEg",
   "createdTime": "2018-09-01T17:33:10.551Z",
   "modifiedTime": "2018-09-01T17:33:10.551Z",
   "author": {
    "kind": "drive#user",
    "displayName": "Eric Yuhas",
    "photoLink": "//lh3.googleusercontent.com/-hcN5NXDiKBk/AAAAAAAAAAI/AAAAAAAABo4/rEIKEFEKmno/s96-k-no/photo.jpg",
    "me": true
   },
   "htmlContent": "test",
   "content": "test",
   "deleted": false,
   "resolved": false,
   "quotedFileContent": {
    "mimeType": "text/html",
    "value": "or the R"
   },
   "anchor": "kix.wj6tnnrwuij4",
   "replies": []
  },
  {
   "kind": "drive#comment",
   "id": "AAAACLN4sEQ",
   "createdTime": "2018-09-01T17:30:23.922Z",
   "modifiedTime": "2018-09-01T17:30:23.922Z",
   "author": {
    "kind": "drive#user",
    "displayName": "Eric Yuhas",
    "photoLink": "//lh3.googleusercontent.com/-hcN5NXDiKBk/AAAAAAAAAAI/AAAAAAAABo4/rEIKEFEKmno/s96-k-no/photo.jpg",
    "me": true
   },
   "htmlContent": "Should have been &quot;nesting nodes&quot;",
   "content": "Should have been \"nesting nodes\"",
   "deleted": false,
   "resolved": false,
   "quotedFileContent": {
    "mimeType": "text/html",
    "value": "nodes?"
   },
   "anchor": "kix.s9mk8rqh90bp",
   "replies": []
  }
 ]
}
*/

// The docs said anchor would be a JSON string.  Instead we're gettin stuff like "anchor": "kix.s9mk8rqh90bp" which makes no god damn sense.  Will the non-REST api help interpret it?