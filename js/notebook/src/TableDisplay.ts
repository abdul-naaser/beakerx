/*
 *  Copyright 2017 TWO SIGMA OPEN SOURCE, LLC
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import * as widgets from './widgets';
import { DataGridScope } from './tableDisplay/dataGrid';

import './tableDisplay/css/datatables.scss';

class TableDisplayModel extends widgets.DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: 'TableDisplayModel',
      _view_name: 'TableDisplayView',
      _model_module: 'beakerx',
      _view_module: 'beakerx',
      _model_module_version: BEAKERX_MODULE_VERSION,
      _view_module_version: BEAKERX_MODULE_VERSION
    };
  }
}

// Custom View. Renders the widget model.
class TableDisplayView extends widgets.DOMWidgetView {
  private _currentScope: DataGridScope;

  render() {
    this._currentScope = null;
    this.$el.addClass('beaker-table-display');

    this.displayed.then(() => {
      const tableModel = this.model.get('model');

      if (tableModel.tooManyRows) {
        this.showWarning(tableModel);
      }

      this.initDataGridTable(tableModel);

      this.listenTo(this.model, 'beakerx-tabSelected', () => {
        this._currentScope && this._currentScope.setInitialSize();
      });

      this.listenTo(this.model, 'change:updateData', this.handleUpdateData);
      this.listenTo(this.model, 'change:model', this.handleModellUpdate);
    });
  }

  handleModellUpdate() {
    this._currentScope.updateModelData(this.model.get('model'));
    this._currentScope.doResetAll();
  }

  handleUpdateData() {
    const change = this.model.get('updateData');
    const currentModel = this.model.get('model');

    this.model.set('model', { ...currentModel, ...change }, { updated_view: this });
    this.handleModellUpdate();
  }

  showWarning(data) {
    const rowLength = data.rowLength;
    const rowLimit = data.rowLimit;
    const modal = document.createElement('div');

    modal.setAttribute('id', this.wrapperId);
    modal.innerHTML = `<p class="ansired">Note: table is too big to display.
      The limit is ${rowLimit} rows, but this table has ${rowLength} rows. 
      The first 10000 rows are displayed as a preview.</p>`;

    this.el.appendChild(modal);
  }

  initDataGridTable(data) {
    this._currentScope = new DataGridScope({
      element: this.el,
      data: data,
      widgetModel: this.model,
      widgetView: this
    });

    this._currentScope.render();
  }

  remove() {
    this._currentScope && this._currentScope.doDestroy();

    if (this.pWidget) {
      this.pWidget.dispose();
    }

    setTimeout(() => { this._currentScope = null; });

    return super.remove.call(this);
  }
}

export default {
  TableDisplayModel: TableDisplayModel,
  TableDisplayView: TableDisplayView
};