/*!
 * jQuery Rowspanizer Plugin v0.1
 * https://github.com/marcosesperon/jquery.rowspanizer.js
 *
 * Copyright 2011, 2015 Marcos Esperón
 * Released under the MIT license
 * 
 * https://github.com/jquery-boilerplate/boilerplate/
 */

;
(function($, window, document, undefined) {
	"use strict";

	var rowspanizer = "rowspanizer", defaults = {
		vertical_align : "middle",
		cols : null
	};

	function f(element, options) {
		this.element = element;

		this.settings = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = rowspanizer;
		this.init();

	}

	$.extend(f.prototype, {
		init : function() {

			var _this = this;

			var $table = $(this.element);
			var arr = [];
			var td_selector = _td_selector();

			$table.find('tr').each(function(r, tr) {
				$(this).find(td_selector).each(function(d, td) {
					var $td = $(td);
					var v_dato = $td.html();
					if (typeof arr[d] != 'undefined' && 'dato' in arr[d] && arr[d].dato == v_dato) {
						var rs = arr[d].elem.data('rowspan');
						if (rs == 'undefined' || isNaN(rs)) rs = 1;
						arr[d].elem.data('rowspan', parseInt(rs) + 1).addClass('rowspan-combine');
						$td.addClass('rowspan-remove');
					} else {
						arr[d] = {
							dato : v_dato,
							elem : $td
						};
					};
				});
			});

			$('.rowspan-combine').each(function(r, tr) {
				var $this = $(this);
				$this.attr('rowspan', $this.data('rowspan')).css({'vertical-align' : _this.settings.vertical_align});
			});

			$('.rowspan-remove').hide();
			
			function _td_selector(){
				var sel = "td";
				if(_this.settings.cols){
					var sel = [];
					$.each(_this.settings.cols, function(idx, d){
						sel.push("td:eq("+d+")");
					});
					
					sel = sel.join(",");
				}
				
				return sel;
			}
		}
	});

	$.fn[rowspanizer] = function(options) {
		return this.each(function() {
			if (!$.data(this, "plugin_" + rowspanizer)) {
				$.data(this, "plugin_" + rowspanizer, new f(this, options));
			}
		});
	};

})(jQuery, window, document);


/*
 * (function($) { $.fn.rowspan = function(colIdx) { return this.each(function() {
 * var that; $("tr", this).each(function(row) { //console.log($('td:eq(' +
 * colIdx + '):visible', this)); $('td:eq(' + colIdx + '):visible',
 * this).each(function(col) { console.log($(this).html()); if ($(this).html() ==
 * $(that).html()) { rowspan = $(that).attr("rowSpan"); if (rowspan ==
 * undefined) { $(that).attr("rowSpan", 1); rowspan = $(that).attr("rowSpan"); }
 * rowspan = Number(rowspan) + 1; $(that).attr("rowSpan", rowspan);
 * $(this).hide(); } else { that = this; } that = (that == null) ? this : that;
 * }); }); }); }; })(jQuery);
 */
