'use strict';

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _d = require('d3');

var _d2 = _interopRequireDefault(_d);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// return list including all nodes
module.exports.get_nodes = function (d) {
    var nodes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    nodes.push(d);
    _underscore2.default.each(d.children || d._children, function (i) {
        module.exports.get_nodes(i, nodes);
    });
    return nodes;
};

module.exports.init_nodes = function (nodes, config) {
    var color = function color(n) {
        var scheme = config.color_scheme.category.map(function (i) {
            return _d2.default.rgb(i);
        });
        return scheme[n % scheme.length];
    };
    _underscore2.default.each(nodes, function (i) {
        i.value = 0;
        i.values = [];
        i.keys = [];
        i.color = color(i.depth);
        if (config.functree.show_all_nodes) {
            return false;
        }
        if (i.name.match(/md:M\d{5}|md:EPM\d{4}|Undefined MODULE/)) {
            i._children = i.children;
            i.children = null;
        }
    });
};

module.exports.set_values = function (nodes, data, config) {
    _underscore2.default.each(data, function (i) {
        if (i.name.match('Root')) {
            return false;
        }
        // let match = _.find(nodes, (j) => {
        //     return i.name === j.name;
        // });
        // _.extend(match, i);
        var matches = _underscore2.default.filter(nodes, function (j) {
            return i.name === j.name;
        });
        _underscore2.default.each(matches, function (j) {
            if (j.depth < config.functree.disable_display_lower_than) {
                return false;
            }
            if (j.label.match('Undefined')) {
                return false;
            }
            _underscore2.default.extend(j, i);
        });
    });
};