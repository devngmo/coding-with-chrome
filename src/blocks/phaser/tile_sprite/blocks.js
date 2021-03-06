/**
 * @fileoverview Phaser Blocks for Blockly.
 *
 * @license Copyright 2017 The Coding with Chrome Authors.
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
 * @author mbordihn@google.com (Markus Bordihn)
 */


/**
 * Adjust tile sprite.
 */
Blockly.Blocks['phaser_tile_sprite_adjust'] = {
  init: function() {
    this.appendValueInput('sprite')
        .setCheck(null)
        .appendField(Blockly.BlocksTemplate.point())
        .appendField(i18t('set title sprite'));
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          [i18t('alpha'), 'alpha'],
          [i18t('angle'), 'angle'],
          [i18t('anchor'), 'anchor.set'],
          [i18t('buttonMode'), 'buttonMode'],
          [i18t('frame'), 'frame'],
          [i18t('height'), 'height'],
          [i18t('rotation'), 'rotation'],
          [i18t('visible'), 'visible'],
          [i18t('width'), 'width'],
          [i18t('x'), 'x'],
          [i18t('y'), 'y'],
          [i18t('z'), 'y']
        ]), 'property');
    this.appendValueInput('value')
        .setCheck('Number')
        .appendField(i18t('to'));
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(285);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};


/**
 * Destroy title sprite.
 */
Blockly.Blocks['phaser_tile_sprite_destroy'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.BlocksTemplate.point())
        .appendField('destroy tile sprite');
    this.appendValueInput('sprite')
        .setCheck(null);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(285);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};


/**
 * Auto scroll tile sprite.
 */
Blockly.Blocks['phaser_tile_sprite_autoScroll'] = {
  init: function() {
    this.appendValueInput('sprite')
        .setCheck(null)
        .appendField(Blockly.BlocksTemplate.point())
        .appendField(i18t('set tile sprite'));
    this.appendValueInput('x')
        .setCheck('Number')
        .appendField(i18t('autoscroll to'));
    this.appendValueInput('y')
        .setCheck('Number')
        .appendField(i18t('x'));
    this.appendDummyInput()
        .appendField(i18t('y'));
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(285);
    this.setTooltip('');
    this.setHelpUrl('');
  }
};
