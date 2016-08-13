/**
 * @fileoverview runner profile for Makeblock mBots.
 *
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
goog.provide('cwc.runner.profile.makeblock.mbotRanger.Command');



/**
 * @param {!cwc.protocol.makeblock.mbotRanger.Api} api
 * @constructor
 * @struct
 * @final
 */
cwc.runner.profile.makeblock.mbotRanger.Command = function(api) {
  /** @type {cwc.protocol.makeblock.mbotRanger.Api} */
  this.api = api;
};


/**
 * set motor speed of mbot
 * @param  {Object} data
 * @export
 */
cwc.runner.profile.makeblock.mbotRanger.Command.prototype.setMotor = function(
    data) {
  if (data['direction'] == 1) {
    this.api.setLeftMotor(data['speed']);
  } else {
    this.api.setRightMotor(data['speed']);
  }
};


/**
 * move mbot forward or backward
 * @param {Object} data data package
 */
cwc.runner.profile.makeblock.mbotRanger.Command.prototype.movePower = function(
    data) {
  this.api.setMotorPower(data['speed'], data['slot']);
};


/**
 * turn mbot to a direction
 * @param {Object} data data package
 */
cwc.runner.profile.makeblock.mbotRanger.Command.prototype.rotatePower =
function(data) {
  this.api.setLeftMotorPower(data['speed']);
  this.api.setRightMotorPower(data['speed']);
};


/**
 * wait for a certain second
 * @param {Object=} opt_data
 */
cwc.runner.profile.makeblock.mbotRanger.Command.prototype.wait = function(
    opt_data) {};


/**
 * stop the mbot completely
 * @param {Object=} opt_data
 * @export
 */
cwc.runner.profile.makeblock.mbotRanger.Command.prototype.stop = function(
    opt_data) {
  this.api.setLeftMotor(0);
  this.api.setRightMotor(0);
};


/**
 * @param {!Object} data
 * @export
 */
cwc.runner.profile.makeblock.mbotRanger.Command.prototype.setRGBLED =
function(data) {
  this.api.setRGBLED(
    data['red'], data['green'], data['blue'], data['index']);
};


/**
 * @param {!Object} data
 * @export
 */
cwc.runner.profile.makeblock.mbotRanger.Command.prototype.playTone = function(
    data) {
  this.api.playTone(data['frequency'], data['duration']);
};


/**
 * return ultrasonic value from mbot
 * @return {number} sensor value
 * @export
 */
cwc.runner.profile.makeblock.mbotRanger.Command.prototype.ultrasonicValue =
function() {
  return this.api.ultrasonicValue();
};


/**
 * return lightness sensor value from mbot
 * @return {number} sensor value
 * @export
 */
cwc.runner.profile.makeblock.mbotRanger.Command.prototype.lightSensorValue =
function() {
  return this.api.lightSensorValue();
};
