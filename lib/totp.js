// Adapted from https://jsfiddle.net/nt18yhmL/
import sha from './sha'

function dec2hex(s) { return (s < 15.5 ? '0' : '') + Math.round(s).toString(16); }
function hex2dec(s) { return parseInt(s, 16); }

function base32tohex(base32) {
  var base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  var bits = "";
  var hex = "";

  for (var i = 0; i < base32.length; i++) {
    var val = base32chars.indexOf(base32.charAt(i).toUpperCase());
    bits += leftpad(val.toString(2), 5, '0');
  }

  for (var i = 0; i+4 <= bits.length; i+=4) {
    var chunk = bits.substr(i, 4);
    hex = hex + parseInt(chunk, 2).toString(16) ;
  }
  return hex;
}

function leftpad(str, len, pad) {
  if (len + 1 >= str.length) {
    str = Array(len + 1 - str.length).join(pad) + str;
  }
  return str;
}

export default function(generator) {
  let {epoch, secret, timeSlice} = generator;
  let currentTime = Date.now() / 1000;

  if (!epoch)
    epoch = currentTime | 0;
  if (!timeSlice)
    timeSlice = 30;

  var key = base32tohex(secret);
  var time = leftpad(dec2hex(Math.floor(epoch / timeSlice)), 16, '0');
  var expiresAt = ((epoch/timeSlice | 0) + 1) * timeSlice;

  var hmacObj = new sha('SHA-1', 'HEX');
  hmacObj.setHMACKey(key, 'HEX');
  hmacObj.update(time);
  var hmac = hmacObj.getHMAC('HEX');
  var offset = hex2dec(hmac.substring(hmac.length - 1));
  var otp = (hex2dec(hmac.substr(offset * 2, 8)) & hex2dec('7fffffff')) + '';
  otp = (otp).substr(otp.length - 6, 6);
  let secondsBeforeExpiration = Math.ceil(expiresAt - currentTime);
  return {otp,expiresAt,secondsBeforeExpiration}
}
