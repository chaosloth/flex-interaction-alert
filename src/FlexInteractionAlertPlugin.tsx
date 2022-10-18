import React from "react";
import * as Flex from "@twilio/flex-ui";
import { FlexPlugin } from "@twilio/flex-plugin";
import DeviceManager from "./components/DeviceManager/DeviceManager";
import { AudioPlayerError } from "@twilio/flex-ui";

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

    flex.MainHeader.Content.add(<DeviceManager key="device-manager" />, {
      sortOrder: 0,
      align: "end",
    });

    let mediaId: string = "";

    manager.workerClient.on("reservationCreated", function (reservation) {
      if (
        reservation.task.taskChannelUniqueName === "voice" &&
        reservation.task.attributes.direction === "inbound"
      ) {
        mediaId = Flex.AudioPlayerManager.play(
          {
            url: "alert.mp3",
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
