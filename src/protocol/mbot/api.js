/**
 * @fileoverview Handles the communication with Makeblock mBots.
 *
 * This api allows to read and control the Makeblock mBot kits with
 * bluetooth connection.
 *
 * @license Copyright 2016 Shenzhen Maker Works Co, Ltd. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author wangyu@makeblock.cc (Yu Wang)
 */
goog.provide('cwc.protocol.mbot.Api');

goog.require('cwc.protocol.mbot.Command');
goog.require('cwc.protocol.mbot.Port');
goog.require('cwc.protocol.mbot.Commands');
goog.require('cwc.protocol.mbot.Monitoring');

goog.require('goog.events.EventTarget');



/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.protocol.mbot.Api = function(helper) {

  /** @type {!cwc.protocol.mbot.Command} */
  this.command = cwc.protocol.mbot.Command;

  /** @type {!cwc.protocol.mbot.Commands} */
  this.commands = new cwc.protocol.mbot.Commands();

  /** @type {string} */
  this.name = 'mBot';

  /** @type {boolean} */
  this.prepared = false;

  /** @type {string} */
  this.autoConnectName = 'Makeblock';

  /** @private {!array} */
  this.headerAsync_ = [0xff, 0x55];

  /** @private {!number} */
  this.headerMinSize_ = 5;

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {!cwc.protocol.mbot.Monitoring} */
  this.monitoring = new cwc.protocol.mbot.Monitoring(this);

  /** @type {goog.events.EventTarget} */
  this.eventHandler = new goog.events.EventTarget();
};


/**
 * AutoConnects the mbot through bluetooth.
 * @export
 */
cwc.protocol.mbot.Api.prototype.autoConnect = function() {
  var bluetoothInstance = this.helper.getInstance('bluetooth', true);
  bluetoothInstance.autoConnectDevice(this.autoConnectName,
      this.connect.bind(this));
};


/**
 * Connects the mbot.
 * @param {!string} address
 * @return {boolean} Was able to prepare and connect to the mbot.
 * @export
 */
cwc.protocol.mbot.Api.prototype.connect = function(address) {
  var bluetoothInstance = this.helper.getInstance('bluetooth', true);
  var device = bluetoothInstance.getDevice(address);
  if (!device) {
    console.error('mBot is not ready yet …');
    return false;
  }

  if (!this.prepared && device.isConnected()) {
    console.log('Preparing bluetooth api for', device.getAddress());
    this.device = device;
    this.prepare();
    // this.runTest();
  }

  return true;
};


/**
 * @return {boolean}
 */
cwc.protocol.mbot.Api.prototype.isConnected = function() {
  return (this.device && this.device.isConnected());
};


/**
 * @export
 */
cwc.protocol.mbot.Api.prototype.prepare = function() {
  this.device.setDataHandler(this.handleAsync_.bind(this),
      this.headerAsync_, this.headerMinSize_);
  // this.monitoring.init();
  // this.monitoring.start();
  this.playTone(524, 240, 240);
  this.playTone(584, 240, 240);
  this.prepared = true;
};


/**
 * Disconnects the mbot.
 */
cwc.protocol.mbot.Api.prototype.disconnect = function() {
  if (this.device) {
    this.device.disconnect();
  }
  this.cleanUp();
};


/**
 * When blockly/js program is about to run.
 * setup monitor to constantly monitor sensors.
 * @return {void}
 * @export
 */
cwc.protocol.mbot.Api.prototype.start = function() {
  this.monitoring.start();
};


/**
 * Basic cleanup for the mbot.
 * apparently this method is called by runner
 * @export
 */
cwc.protocol.mbot.Api.prototype.cleanUp = function() {
  console.log('Clean up Mbot …');
  this.reset();
  this.monitoring.stop();
  this.setLeftMotorPower(0);
  this.setRightMotorPower(0);
};


/**
 * Resets the mbot connection.
 */
cwc.protocol.mbot.Api.prototype.reset = function() {
  if (this.device) {
    this.device.reset();
  }
};


/**
 * @param {!boolean} enable
 * @export
 */
cwc.protocol.mbot.Api.prototype.monitor = function(enable) {
  if (enable && this.isConnected()) {
    this.monitoring.start();
  } else if (!enable) {
    this.monitoring.stop();
  }
};


/**
 * @return {goog.events.EventTarget}
 */
cwc.protocol.mbot.Api.prototype.getEventHandler = function() {
  return this.eventHandler;
};


/**
 * Handles async packets from the Bluetooth socket.
 * @param {ArrayBuffer} buffer
 * @private
 */
cwc.protocol.mbot.Api.prototype.handleAsync_ = function(buffer) {
  if (!buffer || buffer.length < 7) {
    return;
  }
  var dataBytes = this.arrayFromArrayBuffer(buffer);
  var index = dataBytes[this.command.BYTE_INDEX];
  var dataType = dataBytes[this.command.BYTE_DATATYPE];
  if (dataType == this.command.DATATYPE_FLOAT) {
    this.monitoring.onSensorReply(index, dataBytes.slice(
      this.command.BYTE_PAYLOAD, this.command.BYTE_PAYLOAD + 4));
  }
};


/**
 * Convert array of int to ArrayBuffer.
 * @param  {[int]} data array of int
 * @return {ArrayBuffer}      result array buffer
 * @private
 */
cwc.protocol.mbot.Api.prototype.arrayBufferFromArray = function(data) {
  var buffer = new ArrayBuffer(data.length);
  var result = new Int8Array(buffer);
  for (var i=0; i < data.length; i++){
    result[i] = data[i];
  }
  return buffer;
};


/**
 * Convert ArrayBuffer from array of int
 * @param  {ArrayBuffer} buffer the source arraybuffer
 * @return {[int]}        int array as the result;
 * @private
 */
cwc.protocol.mbot.Api.prototype.arrayFromArrayBuffer = function(buffer) {
  var dataView = new Uint8Array(buffer);
  var result = [];
  for (let i=0; i < dataView.length; i++) {
    result.push(dataView[i]);
  }
  return result;
};


/**
 * send read or write commands to robot
 * @param  {boolean} readOrWrite    read (1) or write (2)
 * @param  {int}     deviceType     device type
 * @param  {int}     index          id connected to the response
 * @param  {[int]}   commandBytes   array of bytes
 * @export
 */
cwc.protocol.mbot.Api.prototype.sendCommandToRobot = function(readOrWrite,
    deviceType, index, commandBytes) {
  var commandBody = [index, readOrWrite, deviceType].concat(commandBytes);
  var commandHeader = [this.command.PREFIX_A, this.command.PREFIX_B,
    commandBody.length];
  var command = commandHeader.concat(commandBody);
  console.log('OLD Data', command);
  var data = this.arrayBufferFromArray(command);
  this.send_(data);
};


/**
 * send read commands to robot
 * @param  {int}     deviceType     device type
 * @param  {int}     index          id connected to the response
 * @param  {[int]}   commandBytes   array of bytes
 * @export
 */
cwc.protocol.mbot.Api.prototype.sendReadCommandToRobot = function(deviceType,
    index, commandBytes) {
  this.sendCommandToRobot(
    this.command.COMMAND_READ, deviceType, index, commandBytes);
};


/**
 * send write commands to robot
 * @param  {int}     deviceType     device type
 * @param  {int}     index          id connected to the response
 * @param  {[int]}   commandBytes   array of bytes
 * @export
 */
cwc.protocol.mbot.Api.prototype.sendWriteCommandToRobot = function(deviceType,
    index, commandBytes) {
  this.sendCommandToRobot(
    this.command.COMMAND_WRITE, deviceType, index, commandBytes);
};


/**
 * send write commands to robot, not expecting response (id is 1)
 * @param  {int}     deviceType     device type
 * @param  {[int]}   commandBytes   array of bytes
 * @export
 */
cwc.protocol.mbot.Api.prototype.sendNoResponseCommand = function(deviceType,
    commandBytes) {
  this.sendCommandToRobot(this.command.COMMAND_WRITE, deviceType,
    this.command.INDEX_WITHOUT_RESPONSE, commandBytes);
};


/**
 * Sets left motor power
 * @param  {!number} power 0-255
 * @export
 */
cwc.protocol.mbot.Api.prototype.setLeftMotorPower = function(power) {
  this.send_(this.commands.setMotorPower(
    power, cwc.protocol.mbot.Port.LEFT_MOTOR));
};


/**
 * Sets right motor power
 * @param  {!number} power 0-255
 * @export
 */
cwc.protocol.mbot.Api.prototype.setRightMotorPower = function(power) {
  this.send_(this.commands.setMotorPower(
    power, cwc.protocol.mbot.Port.RIGHT_MOTOR));
};


/**
 * @param  {!number} index
 * @export
 */
cwc.protocol.mbot.Api.prototype.readUltrasonicSensor = function(index) {
  this.send_(this.commands.readUltrasonicSensor(index));
};


/**
 * Sets led light on the top of the mbot
 * @param {!number} red           red value (0-255)
 * @param {!number} green         green value (0-255)
 * @param {!number} blue          blue value (0-255)
 * @param {number=} opt_index   0 for all lights; 1 for left, 2 for right
 * @export
 */
cwc.protocol.mbot.Api.prototype.setLEDColor = function(red, green,
    blue, opt_index) {
  this.send_(this.commands.setRGBLED(red, green, blue, opt_index));
};


/**
 * Plays a tone through mbot's buzzer
 * @param {!number} frequency frequency of the tone to play
 * @param {!number} duration duration of the tone, in ms
 * @export
 */
cwc.protocol.mbot.Api.prototype.playTone = function(frequency, duration) {
  this.send_(this.commands.playTone(frequency, duration));
};


/**
 * @export
 */
cwc.protocol.mbot.Api.prototype.stop = function(opt_port) {
  this.setLeftMotorPower(0);
  this.setRightMotorPower(0);
  this.reset();
};


/**
 * ultrasonic sensor value changed, called from monitoring
 * @param {float} value the value to update
 * @export
 */
cwc.protocol.mbot.Api.prototype.ultrasonicValueChanged = function(value) {
  console.log('ultrasonicValueChanged', value);
  this.eventHandler.dispatchEvent(
    cwc.protocol.mbot.Events.UltrasonicSensorValue(value));
};


/**
 * lightness sensor value changed, called from monitoring
 * @param {float} value the value to update
 * @export
 */
cwc.protocol.mbot.Api.prototype.lightnessValueChanged = function(value) {
  console.log('lightnessValueChanged', value);
  this.eventHandler.dispatchEvent(
    cwc.protocol.mbot.Events.LightnessSensorValue(value));
};


/**
 * linefollower sensor value changed, called from monitoring
 * @param {float} value the value to update
 * @export
 */
cwc.protocol.mbot.Api.prototype.linefollowerValueChanged = function(value) {
  console.log('linefollowerValueChanged', value);
  this.eventHandler.dispatchEvent(
    cwc.protocol.mbot.Events.LinefollowerSensorValue(value));
};


/**
 * @param {!ArrayBuffer} buffer
 * @private
 */
cwc.protocol.mbot.Api.prototype.send_ = function(buffer) {
  if (!this.device) {
    return;
  }
  this.device.send(buffer);
};