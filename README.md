# Interaction Audio Alerts Twilio Flex Plugin

This plugin adds simple audio alerts using the Flex AudioPlayerManager API

## Configuration
Edit the `FlexInteractionAlertPlugin.tsx` and adjust the `AUDIO_FILE` to point to a URL of your choice, for example an uploaded asset


## Uploading audio files

### Prerequisite
Ensure the asset plugin is installed with:
```
twilio plugins:install @twilio-labs/plugin-assets
```

### Initialise the plugin
The Assets Plugin has three commands: `init`, `upload` and `list`. The first thing you should do is run the init command.
```
twilio assets:init
```

### Upload the asset
Now we have initialised the plugin, we can upload our first asset.

`twilio assets:upload path/to/file`

### List your assets (Audio files)
The final command for this version of the plugin is a way to list all the assets you have uploaded to your bucket. Run it with:

`twilio assets:list`


## Deploy flex plugin
Once you have uploaded the sound files and configured the `AUDIO_FILE` it's time to deploy your plugin

```bash
twilio flex plugins deploy
```

## Development

Run `twilio flex:plugins --help` to see all the commands we currently support. For further details on Flex Plugins refer to our documentation on the [Twilio Docs](https://www.twilio.com/docs/flex/developer/plugins/cli) page.

