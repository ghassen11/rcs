/**
 * jitsi/janus
 * id, displayName, roomName
 */
const USER_SET="userSet"; 

/**
* jitsi/janus
 * id,displayName
 */

const PARTICIPANT_JOINED="participantJoined";
/**
 * jitisi/janus
 * message,id
 */
const MESSAGE_RECEIVED="messageReceived";
/***
 * only jitsi
 * none
 */
const CLOSING="closing";
/**
 * jitsi/janus
 * id
 */

const PARTICIPANT_LEFT="ParticipantLeft";
/**
 * only for jitsi
 * id,
 * avatarURL
 */
const AVATAR_CHANGED="avatarChanged";

const events={CLOSING,MESSAGE_RECEIVED,PARTICIPANT_JOINED,PARTICIPANT_LEFT,USER_SET,AVATAR_CHANGED};

export default events
