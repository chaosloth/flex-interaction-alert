import React from "react";
import * as Flex from "@twilio/flex-ui";
import { FlexPlugin } from "@twilio/flex-plugin";
import { AudioPlayerError } from "@twilio/flex-ui";
import { audioFile } from "./alert.mp3";

const PLUGIN_NAME = "FlexInteractionAlertPlugin";

export interface ChromeAudio extends HTMLAudioElement {
  setSinkId(id: string): void;
}

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
            url: audioFile,
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
