# Idea Project Script Layers

This repository contains the code for the [Google Docs add-on](https://gsuite.google.com/marketplace/app/idea_project_script_layers/769356592544) used by [Idea Project](https://www.youtube.com/channel/UCxVG9JnDocRPTiBMc_G04_w) to collect and organize gifs while writing scripts.

## Contributing

TODO

## Testing

TODO

## Deployment

For now, you'll have to talk ti the owner of the repo as they're the only ones with the permissions to deploy.  You can find them in the #tech-support channel of the [Idea Project Discord](https://discord.gg/uDCXfJ) under the name "14flash".

### Get `clasp`

This requires node.js to be installed and running version 4.7.4 or later

```sh
$ npm install -g @google/clasp
```

### Deploy

```sh
$ clasp version <description>
$ clasp deploy --verswionNumber <number>
# Verify the new deployment was made
$ clasp deployments
```

Then go to the [Cloud Platform Project](https://console.cloud.google.com/home/dashboard?authuser=0&project=idea-project-script-layers).

1. On the sidebar go to APIs & Services > Dashboard
1. Under the list at the bottom, click on "G Suite Marketplace SDK"
1. In the sidebat, click on Configuration
1. Near the bottom there is an "Editor Add-on extensions" heading.  You should see the "Docs add-on extension" box checked.
1. Change the version number (the second box) to the version you just deployed.

Changes should be picked up in ~10 minutes.

