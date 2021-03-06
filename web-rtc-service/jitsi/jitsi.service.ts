// import { WebRTCService } from "../webRtcService.interface";
// import { JitsiOptions } from "./types";
import eventHub from '../../event-hub/eventHub.ts'
import events from '../../event-hub/eventHubEvents.ts';

export default class JitsiService {
    


    constructor(options) {
        const domain = "meet.jit.si";

        this.rtcInstence = new window.JitsiMeetExternalAPI(domain, options);
        // window.rtc = this.rtcInstence;



        /*   {
               roomName: string, // the room name of the conference
                   id: string, // the id of the local participant
               displayName: string, // the display name of the local participant
               avatarURL: string // the avatar URL of the local participant
           }*/
        this.rtcInstence.on("videoConferenceJoined", ({ roomName, id, displayName, avatarURL }) => {
         
            eventHub.trigger(events.USER_SET, { id, displayName, roomName });
            eventHub.trigger(events.PARTICIPANT_JOINED, { id, displayName, avatarURL });


            //set default avatar as jitsi avatar
            this.rtcInstence.executeCommand('avatarUrl', 'https://avatars0.githubusercontent.com/u/3671647');
        });


        /*
        {
            id: string, // the id of the participant
            displayName: string // the display name of the participant
        }
         */

        this.rtcInstence.on(events.PARTICIPANT_JOINED, (joinedUser) => {
            eventHub.trigger(events.PARTICIPANT_JOINED, joinedUser);
        });
        /* 
        
     {
         from: string, // The id of the user that sent the message
             nick: string, // the nickname of the user that sent the message
                 message: string // the text of the message
         stamp:.....
     }
        */

        //this event listener is used by jitsi meet iframe only 

        this.rtcInstence.on("incomingMessage", ({ from, nick, message }) => {

            eventHub.trigger(events.MESSAGE_RECEIVED, { id: from, message, nickname: nick })
        });
        /* 
        {
            senderInfo: {
                jid: string, // the jid of the sender
                id: string // the participant id of the sender
            },
            eventData: {
                name: string // the name of the datachannel event: `endpoint-text-message`
                text: string // the received text from the sender
            }
        }
        
        */

        this.rtcInstence.on("endpointTextMessageReceived", ({ data: { senderInfo, eventData } }) => {
            eventHub.trigger(events.MESSAGE_RECEIVED, { id: senderInfo.id, message: eventData.text })
        });



        /* 
        {
            id: string, // the id of the participant that changed his avatar.
            avatarURL: string // the new avatar URL.
}
        */
        this.rtcInstence.on("avatarChanged", (userAvatar) => {
            if (userAvatar.avatarURL && userAvatar.id !== "local")
                eventHub.trigger(events.AVATAR_CHANGED, userAvatar);
        });



        this.rtcInstence.on("participantLeft", ({ id }) => {

            eventHub.trigger(events.PARTICIPANT_LEFT, id);

        });

        this.rtcInstence.on("readyToClose", () => {
            eventHub.trigger(events.CLOSING, "")

        });

        this.rtcInstence.executeCommand('displayName', 'ghassen');

    }



    sendMessage(message) {

        this.rtcInstence.executeCommand('sendEndpointTextMessage', "", message);

    }
    changeAvatar(avatarURL){
        this.rtcInstence.executeCommand('avatarUrl', avatarURL);

    }




}