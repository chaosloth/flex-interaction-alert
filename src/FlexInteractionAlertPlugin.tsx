import React from "react";
import * as Flex from "@twilio/flex-ui";
import { FlexPlugin } from "@twilio/flex-plugin";
import DeviceManager from "components/DeviceManager/DeviceManager";

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
    const options: Flex.ContentFragmentProps = { sortOrder: -1 };
    let alertSound: ChromeAudio = new Audio(
      "%PUBLIC_URL%/alert.mp3"
    ) as ChromeAudio;

    alertSound.loop = true;

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

    manager.workerClient.on("reservationCreated", function (reservation) {
      if (
        reservation.task.taskChannelUniqueName === "voice" &&
        reservation.task.attributes.direction === "inbound"
      ) {
        if (!manager?.voiceClient?.audio) {
          console.error(PLUGIN_NAME + ": Manager is not defined");
          return;
        }

        // setSinkId is currently only available in Chrome-like browsers, check if it is exists
        if (typeof alertSound.setSinkId == "function") {
          manager.voiceClient.audio.ringtoneDevices.get().forEach((device) => {
            alertSound.setSinkId(device.deviceId);
          });
        }

        // Play the sound
        alertSound.play();
      }

      resStatus.forEach((e) => {
        reservation.on(e, () => {
          alertSound.pause();
        });
      });
    });
  }
}
