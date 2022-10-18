/**
 * @file Flex interaction alerts (Typescript, Flex 2.0)
 * @author Chris Connolly <cconnolly@twilio.com>
 * @version 1.0.0
 * @description Change the AUDIO_FILE to point to a publicly available URL with a sound file (Wave, MP3, etc)
 */
import * as Flex from "@twilio/flex-ui";
import { FlexPlugin } from "@twilio/flex-plugin";
import { AudioPlayerError } from "@twilio/flex-ui";

const PLUGIN_NAME = "FlexInteractionAlertPlugin";

const AUDIO_FILE =
  "https://www.soundboard.com/mediafiles/mz/Mzg1ODMxNTIzMzg1ODM3_JzthsfvUY24.MP3";
export default class FlexInteractionAlertPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * Simple interaction alert via sound
   *
   * @param flex { typeof Flex }
   */
  async init(flex: typeof Flex, manager: Flex.Manager): Promise<void> {
    const resStatus = [
      "accepted",
      "canceled",
      "rejected",
      "rescinded",
      "timeout",
    ];

    if (!manager) {
      console.error(PLUGIN_NAME + ": Manager is not defined");
      return;
    }
    if (!manager.workerClient) {
      console.error(PLUGIN_NAME + ": Manager.workerClient is not defined");
      return;
    }

    let mediaId: string = "";

    manager.workerClient.on("reservationCreated", function (reservation) {
      if (
        reservation.task.taskChannelUniqueName === "voice" &&
        reservation.task.attributes.direction === "inbound"
      ) {
        mediaId = Flex.AudioPlayerManager.play(
          {
            url: AUDIO_FILE,
            repeatable: true,
          },
          (error: AudioPlayerError) => {
            // handle error
            console.error(PLUGIN_NAME + ": Error playing sound", error);
          }
        );
      }

      resStatus.forEach((e) => {
        reservation.on(e, () => {
          if (mediaId && mediaId != "") Flex.AudioPlayerManager.stop(mediaId);
        });
      });
    });
  }
}
