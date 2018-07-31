/*
 *  Copyright 2018 TWO SIGMA OPEN SOURCE, LLC
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

var BeakerXPageObject = require('../beakerx.po.js');
var beakerxPO;

describe('Charting python test', function () {

  beforeAll(function () {
    beakerxPO = new BeakerXPageObject();
    beakerxPO.runNotebookByUrl('/test/ipynb/python/ChartingTest.ipynb');
  }, 2);

  afterAll(function () {
    beakerxPO.closeAndHaltNotebook();
  });

  var cellIndex;

  describe('Histogram', function () {
    it('Widget area has dtcontainer', function () {
      cellIndex = 0;
      beakerxPO.runCodeCellByIndex(cellIndex);
      cellIndex += 1;
      var dtContainer = beakerxPO.runCellToGetDtContainer(cellIndex);
      expect(dtContainer.$('#maing > g.plot-bar').isEnabled()).toBeTruthy();
    });

    it('Histogram has Title and Axes Labels', function () {
      cellIndex += 1;
      var dtContainer = beakerxPO.runCellToGetDtContainer(cellIndex);
      expect(dtContainer.$('#plotTitle').getText()).toEqual('Wide Histogram with Manual Parameters');
      expect(dtContainer.$('#xlabel').getText()).toEqual('Size');
      expect(dtContainer.$('#ylabel').getText()).toEqual('Count');
    });

    it('Plot has two histograms (Overlap)', function () {
      cellIndex += 1;
      var svgElement = beakerxPO.runCellToGetSvgElement(cellIndex);
      var g0 = svgElement.$('#maing > g#i0');
      var g1 = svgElement.$('#maing > g#i1');
      expect(g0.getCssProperty('fill').value).toEqual('rgb(0,154,166)');
      expect(g0.getCssProperty('fill-opacity').value).toEqual(1);
      expect(g1.getCssProperty('fill').value).toEqual('rgb(230,50,50)');
      expect(g1.getCssProperty('fill-opacity').value).toBeLessThan(1);
      expect(g0.$$('rect').length).toEqual(25);
      expect(g1.$$('rect').length).toEqual(25);
    });

    it('Plot has two histograms (Stack)', function () {
      cellIndex += 1;
      var svgElement = beakerxPO.runCellToGetSvgElement(cellIndex);
      var g0 = svgElement.$('#maing > g#i0');
      var g1 = svgElement.$('#maing > g#i1');
      expect(g0.$$('rect').length).toEqual(25);
      expect(g1.$$('rect').length).toEqual(25);
    });

    it('Plot has two histograms (Side by Side)', function () {
      cellIndex += 1;
      var svgElement = beakerxPO.runCellToGetSvgElement(cellIndex);
      var g0 = svgElement.$('#maing > g#i0');
      var g1 = svgElement.$('#maing > g#i1');
      expect(g0.$$('rect').length).toEqual(25);
      expect(g1.$$('rect').length).toEqual(25);
    });

    it('Plot has Cumulative histogram', function () {
      cellIndex += 1;
      var svgElement = beakerxPO.runCellToGetSvgElement(cellIndex);
      var g0 = svgElement.$('#maing > g#i0');
      expect(g0.$$('rect').length).toEqual(55);
    });

    it('Plot has Normed histogram', function () {
      cellIndex += 1;
      var svgElement = beakerxPO.runCellToGetSvgElement(cellIndex);
      var g0 = svgElement.$('#maing > g#i0');
      expect(g0.$$('rect').length).toBeGreaterThan(1);
    });

    it('Plot has Log histogram', function () {
      cellIndex += 1;
      var svgElement = beakerxPO.runCellToGetSvgElement(cellIndex);
      var g0 = svgElement.$('#maing > g#i0');
      expect(g0.$$('rect').length).toBeGreaterThan(1);
    });
  });

});