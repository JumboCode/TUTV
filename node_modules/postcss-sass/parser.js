"use strict";

var postcss = require('postcss');

var gonzales = require('gonzales-pe');

var DEFAULT_RAWS_ROOT = {
  before: ''
};
var DEFAULT_RAWS_RULE = {
  before: '',
  between: ''
};
var DEFAULT_RAWS_DECL = {
  before: '',
  between: '',
  semicolon: false
};
var DEFAULT_COMMENT_DECL = {
  before: '',
  left: '',
  right: ''
};

var SassParser =
/*#__PURE__*/
function () {
  function SassParser(input) {
    this.input = input;
  }

  var _proto = SassParser.prototype;

  _proto.parse = function parse() {
    try {
      this.node = gonzales.parse(this.input.css, {
        syntax: 'sass'
      });
    } catch (error) {
      throw this.input.error(error.message, error.line, 1);
    }

    this.lines = this.input.css.match(/^.*(\r?\n|$)/gm);
    this.root = this.stylesheet(this.node);
  };

  _proto.extractSource = function extractSource(start, end) {
    var nodeLines = this.lines.slice(start.line - 1, end.line);
    nodeLines[0] = nodeLines[0].substring(start.column - 1);
    var last = nodeLines.length - 1;
    nodeLines[last] = nodeLines[last].substring(0, end.column);
    return nodeLines.join('');
  };

  _proto.stylesheet = function stylesheet(node) {
    var _this = this;

    // Create and set parameters for Root node
    var root = postcss.root();
    root.source = {
      start: node.start,
      end: node.end,
      input: this.input // Raws for root node

    };
    root.raws = {
      semicolon: DEFAULT_RAWS_ROOT.semicolon,
      before: DEFAULT_RAWS_ROOT.before // Store spaces before root (if exist)

    };
    this.raws = {
      before: ''
    };
    node.content.forEach(function (contentNode) {
      return _this.process(contentNode, root);
    });
    return root;
  };

  _proto.process = function process(node, parent) {
    if (this[node.type]) return this[node.type](node, parent) || null;
    return null;
  };

  _proto.ruleset = function ruleset(node, parent) {
    var _this2 = this;

    // Loop to find the deepest ruleset node
    this.raws.multiRuleProp = '';
    node.content.forEach(function (contentNode) {
      switch (contentNode.type) {
        case 'block':
          {
            // Create Rule node
            var rule = postcss.rule();
            rule.selector = ''; // Object to store raws for Rule

            var ruleRaws = {
              before: _this2.raws.before || DEFAULT_RAWS_RULE.before,
              between: DEFAULT_RAWS_RULE.between // Variable to store spaces and symbols before declaration property

            };
            _this2.raws.before = '';
            _this2.raws.comment = false; // Look up throw all nodes in current ruleset node

            node.content.filter(function (content) {
              return content.type === 'block';
            }).forEach(function (innerContentNode) {
              return _this2.process(innerContentNode, rule);
            });

            if (rule.nodes.length) {
              // Write selector to Rule
              rule.selector = _this2.extractSource(node.start, contentNode.start).slice(0, -1).replace(/\s+$/, function (spaces) {
                ruleRaws.between = spaces;
                return '';
              }); // Set parameters for Rule node

              rule.parent = parent;
              rule.source = {
                start: node.start,
                end: node.end,
                input: _this2.input
              };
              rule.raws = ruleRaws;
              parent.nodes.push(rule);
            }

            break;
          }

        default:
      }
    });
  };

  _proto.block = function block(node, parent) {
    var _this3 = this;

    // If nested rules exist, wrap current rule in new rule node
    if (this.raws.multiRule) {
      if (this.raws.multiRulePropVariable) {
        this.raws.multiRuleProp = "$" + this.raws.multiRuleProp;
      }

      var multiRule = Object.assign(postcss.rule(), {
        source: {
          start: {
            line: node.start.line - 1,
            column: node.start.column
          },
          end: node.end,
          input: this.input
        },
        raws: {
          before: this.raws.before || DEFAULT_RAWS_RULE.before,
          between: DEFAULT_RAWS_RULE.between
        },
        parent: parent,
        selector: (this.raws.customProperty ? '--' : '') + this.raws.multiRuleProp
      });
      parent.push(multiRule);
      parent = multiRule;
    }

    this.raws.before = ''; // Looking for declaration node in block node

    node.content.forEach(function (contentNode) {
      return _this3.process(contentNode, parent);
    });

    if (this.raws.multiRule) {
      this.raws.beforeMulti = this.raws.before;
    }
  };

  _proto.declaration = function declaration(node, parent) {
    var _this4 = this;

    var isBlockInside = false; // Create Declaration node

    var declarationNode = postcss.decl();
    declarationNode.prop = ''; // Object to store raws for Declaration

    var declarationRaws = Object.assign(declarationNode.raws, {
      before: this.raws.before || DEFAULT_RAWS_DECL.before,
      between: DEFAULT_RAWS_DECL.between,
      semicolon: DEFAULT_RAWS_DECL.semicolon
    });
    this.raws.property = false;
    this.raws.betweenBefore = false;
    this.raws.comment = false; // Looking for property and value node in declaration node

    node.content.forEach(function (contentNode) {
      switch (contentNode.type) {
        case 'customProperty':
          _this4.raws.customProperty = true;
        // fall through

        case 'property':
          {
            /* this.raws.property to detect is property is already defined in current object */
            _this4.raws.property = true;
            _this4.raws.multiRuleProp = contentNode.content[0].content;
            _this4.raws.multiRulePropVariable = contentNode.content[0].type === 'variable';

            _this4.process(contentNode, declarationNode);

            break;
          }

        case 'propertyDelimiter':
          {
            if (_this4.raws.property && !_this4.raws.betweenBefore) {
              /* If property is already defined and there's no ':' before it */
              declarationRaws.between += contentNode.content;
              _this4.raws.multiRuleProp += contentNode.content;
            } else {
              /* If ':' goes before property declaration, like :width 100px */
              _this4.raws.betweenBefore = true;
              declarationRaws.before += contentNode.content;
              _this4.raws.multiRuleProp += contentNode.content;
            }

            break;
          }

        case 'space':
          {
            declarationRaws.between += contentNode.content;
            break;
          }

        case 'value':
          {
            // Look up for a value for current property
            switch (contentNode.content[0].type) {
              case 'block':
                {
                  isBlockInside = true; // If nested rules exist

                  if (Array.isArray(contentNode.content[0].content)) {
                    _this4.raws.multiRule = true;
                  }

                  _this4.process(contentNode.content[0], parent);

                  break;
                }

              case 'variable':
                {
                  declarationNode.value = '$';

                  _this4.process(contentNode, declarationNode);

                  break;
                }

              case 'color':
                {
                  declarationNode.value = '#';

                  _this4.process(contentNode, declarationNode);

                  break;
                }

              case 'number':
                {
                  if (contentNode.content.length > 1) {
                    declarationNode.value = contentNode.content.join('');
                  } else {
                    _this4.process(contentNode, declarationNode);
                  }

                  break;
                }

              case 'parentheses':
                {
                  declarationNode.value = '(';

                  _this4.process(contentNode, declarationNode);

                  break;
                }

              default:
                {
                  _this4.process(contentNode, declarationNode);
                }
            }

            break;
          }

        default:
      }
    });

    if (!isBlockInside) {
      // Set parameters for Declaration node
      declarationNode.source = {
        start: node.start,
        end: node.end,
        input: this.input
      };
      declarationNode.parent = parent;
      parent.nodes.push(declarationNode);
    }

    this.raws.before = '';
    this.raws.customProperty = false;
    this.raws.multiRuleProp = '';
    this.raws.property = false;
  };

  _proto.customProperty = function customProperty(node, parent) {
    this.property(node, parent);
    parent.prop = "--" + parent.prop;
  };

  _proto.property = function property(node, parent) {
    // Set property for Declaration node
    switch (node.content[0].type) {
      case 'variable':
        {
          parent.prop += '$';
          break;
        }

      case 'interpolation':
        {
          this.raws.interpolation = true;
          parent.prop += '#{';
          break;
        }

      default:
    }

    parent.prop += node.content[0].content;

    if (this.raws.interpolation) {
      parent.prop += '}';
      this.raws.interpolation = false;
    }
  };

  _proto.value = function value(node, parent) {
    if (!parent.value) {
      parent.value = '';
    } // Set value for Declaration node


    if (node.content.length) {
      node.content.forEach(function (contentNode) {
        switch (contentNode.type) {
          case 'important':
            {
              parent.raws.important = contentNode.content;
              parent.important = true;
              var match = parent.value.match(/^(.*?)(\s*)$/);

              if (match) {
                parent.raws.important = match[2] + parent.raws.important;
                parent.value = match[1];
              }

              break;
            }

          case 'parentheses':
            {
              parent.value += contentNode.content.join('') + ')';
              break;
            }

          case 'percentage':
            {
              parent.value += contentNode.content.join('') + '%';
              break;
            }

          default:
            {
              if (contentNode.content.constructor === Array) {
                parent.value += contentNode.content.join('');
              } else {
                parent.value += contentNode.content;
              }
            }
        }
      });
    }
  };

  _proto.singlelineComment = function singlelineComment(node, parent) {
    return this.comment(node, parent, true);
  };

  _proto.multilineComment = function multilineComment(node, parent) {
    return this.comment(node, parent, false);
  };

  _proto.comment = function comment(node, parent, inline) {
    // https://github.com/nodesecurity/eslint-plugin-security#detect-unsafe-regex
    // eslint-disable-next-line security/detect-unsafe-regex
    var text = node.content.match(/^(\s*)((?:\S[\s\S]*?)?)(\s*)$/);
    this.raws.comment = true;
    var comment = Object.assign(postcss.comment(), {
      text: text[2],
      raws: {
        before: this.raws.before || DEFAULT_COMMENT_DECL.before,
        left: text[1],
        right: text[3],
        inline: inline
      },
      source: {
        start: {
          line: node.start.line,
          column: node.start.column
        },
        end: node.end,
        input: this.input
      },
      parent: parent
    });

    if (this.raws.beforeMulti) {
      comment.raws.before += this.raws.beforeMulti;
      this.raws.beforeMulti = undefined;
    }

    parent.nodes.push(comment);
    this.raws.before = '';
  };

  _proto.space = function space(node, parent) {
    // Spaces before root and rule
    switch (parent.type) {
      case 'root':
        {
          this.raws.before += node.content;
          break;
        }

      case 'rule':
        {
          if (this.raws.comment) {
            this.raws.before += node.content;
          } else if (this.raws.loop) {
            parent.selector += node.content;
          } else {
            this.raws.before = (this.raws.before || '\n') + node.content;
          }

          break;
        }

      default:
    }
  };

  _proto.declarationDelimiter = function declarationDelimiter(node) {
    this.raws.before += node.content;
  };

  _proto.loop = function loop(node, parent) {
    var _this5 = this;

    var loop = postcss.rule();
    this.raws.comment = false;
    this.raws.multiRule = false;
    this.raws.loop = true;
    loop.selector = '';
    loop.raws = {
      before: this.raws.before || DEFAULT_RAWS_RULE.before,
      between: DEFAULT_RAWS_RULE.between
    };

    if (this.raws.beforeMulti) {
      loop.raws.before += this.raws.beforeMulti;
      this.raws.beforeMulti = undefined;
    }

    node.content.forEach(function (contentNode, i) {
      if (node.content[i + 1] && node.content[i + 1].type === 'block') {
        _this5.raws.loop = false;
      }

      _this5.process(contentNode, loop);
    });
    parent.nodes.push(loop);
    this.raws.loop = false;
  };

  _proto.atrule = function atrule(node, parent) {
    var _this6 = this;

    var atrule = postcss.rule();
    atrule.selector = '';
    atrule.raws = {
      before: this.raws.before || DEFAULT_RAWS_RULE.before,
      between: DEFAULT_RAWS_RULE.between
    };
    node.content.forEach(function (contentNode, i) {
      if (contentNode.type === 'space') {
        var prevNodeType = node.content[i - 1].type;

        switch (prevNodeType) {
          case 'atkeyword':
          case 'ident':
            atrule.selector += contentNode.content;
            break;

          default:
        }

        return;
      }

      _this6.process(contentNode, atrule);
    });
    parent.nodes.push(atrule);
  };

  _proto.parentheses = function parentheses(node, parent) {
    parent.selector += '(';
    node.content.forEach(function (contentNode) {
      if (typeof contentNode.content === 'string') {
        parent.selector += contentNode.content;
      }

      if (typeof contentNode.content === 'object') {
        contentNode.content.forEach(function (childrenContentNode) {
          if (contentNode.type === 'variable') parent.selector += '$';
          parent.selector += childrenContentNode.content;
        });
      }
    });
    parent.selector += ')';
  };

  _proto.interpolation = function interpolation(node, parent) {
    var _this7 = this;

    parent.selector += '#{';
    node.content.forEach(function (contentNode) {
      _this7.process(contentNode, parent);
    });
    parent.selector += '}';
  };

  _proto.atkeyword = function atkeyword(node, parent) {
    parent.selector += "@" + node.content;
  };

  _proto.operator = function operator(node, parent) {
    parent.selector += node.content;
  };

  _proto.variable = function variable(node, parent) {
    if (this.raws.loop) {
      parent.selector += "$" + node.content[0].content;
      return;
    }

    parent.selector += "$" + node.content;
  };

  _proto.ident = function ident(node, parent) {
    parent.selector += node.content;
  };

  return SassParser;
}();

module.exports = SassParser;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhcnNlci5lczYiXSwibmFtZXMiOlsicG9zdGNzcyIsInJlcXVpcmUiLCJnb256YWxlcyIsIkRFRkFVTFRfUkFXU19ST09UIiwiYmVmb3JlIiwiREVGQVVMVF9SQVdTX1JVTEUiLCJiZXR3ZWVuIiwiREVGQVVMVF9SQVdTX0RFQ0wiLCJzZW1pY29sb24iLCJERUZBVUxUX0NPTU1FTlRfREVDTCIsImxlZnQiLCJyaWdodCIsIlNhc3NQYXJzZXIiLCJpbnB1dCIsInBhcnNlIiwibm9kZSIsImNzcyIsInN5bnRheCIsImVycm9yIiwibWVzc2FnZSIsImxpbmUiLCJsaW5lcyIsIm1hdGNoIiwicm9vdCIsInN0eWxlc2hlZXQiLCJleHRyYWN0U291cmNlIiwic3RhcnQiLCJlbmQiLCJub2RlTGluZXMiLCJzbGljZSIsInN1YnN0cmluZyIsImNvbHVtbiIsImxhc3QiLCJsZW5ndGgiLCJqb2luIiwic291cmNlIiwicmF3cyIsImNvbnRlbnQiLCJmb3JFYWNoIiwiY29udGVudE5vZGUiLCJwcm9jZXNzIiwicGFyZW50IiwidHlwZSIsInJ1bGVzZXQiLCJtdWx0aVJ1bGVQcm9wIiwicnVsZSIsInNlbGVjdG9yIiwicnVsZVJhd3MiLCJjb21tZW50IiwiZmlsdGVyIiwiaW5uZXJDb250ZW50Tm9kZSIsIm5vZGVzIiwicmVwbGFjZSIsInNwYWNlcyIsInB1c2giLCJibG9jayIsIm11bHRpUnVsZSIsIm11bHRpUnVsZVByb3BWYXJpYWJsZSIsIk9iamVjdCIsImFzc2lnbiIsImN1c3RvbVByb3BlcnR5IiwiYmVmb3JlTXVsdGkiLCJkZWNsYXJhdGlvbiIsImlzQmxvY2tJbnNpZGUiLCJkZWNsYXJhdGlvbk5vZGUiLCJkZWNsIiwicHJvcCIsImRlY2xhcmF0aW9uUmF3cyIsInByb3BlcnR5IiwiYmV0d2VlbkJlZm9yZSIsIkFycmF5IiwiaXNBcnJheSIsInZhbHVlIiwiaW50ZXJwb2xhdGlvbiIsImltcG9ydGFudCIsImNvbnN0cnVjdG9yIiwic2luZ2xlbGluZUNvbW1lbnQiLCJtdWx0aWxpbmVDb21tZW50IiwiaW5saW5lIiwidGV4dCIsInVuZGVmaW5lZCIsInNwYWNlIiwibG9vcCIsImRlY2xhcmF0aW9uRGVsaW1pdGVyIiwiaSIsImF0cnVsZSIsInByZXZOb2RlVHlwZSIsInBhcmVudGhlc2VzIiwiY2hpbGRyZW5Db250ZW50Tm9kZSIsImF0a2V5d29yZCIsIm9wZXJhdG9yIiwidmFyaWFibGUiLCJpZGVudCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTUEsT0FBTyxHQUFHQyxPQUFPLENBQUMsU0FBRCxDQUF2Qjs7QUFDQSxJQUFNQyxRQUFRLEdBQUdELE9BQU8sQ0FBQyxhQUFELENBQXhCOztBQUVBLElBQU1FLGlCQUFpQixHQUFHO0FBQ3hCQyxFQUFBQSxNQUFNLEVBQUU7QUFEZ0IsQ0FBMUI7QUFJQSxJQUFNQyxpQkFBaUIsR0FBRztBQUN4QkQsRUFBQUEsTUFBTSxFQUFFLEVBRGdCO0FBRXhCRSxFQUFBQSxPQUFPLEVBQUU7QUFGZSxDQUExQjtBQUtBLElBQU1DLGlCQUFpQixHQUFHO0FBQ3hCSCxFQUFBQSxNQUFNLEVBQUUsRUFEZ0I7QUFFeEJFLEVBQUFBLE9BQU8sRUFBRSxFQUZlO0FBR3hCRSxFQUFBQSxTQUFTLEVBQUU7QUFIYSxDQUExQjtBQU1BLElBQU1DLG9CQUFvQixHQUFHO0FBQzNCTCxFQUFBQSxNQUFNLEVBQUUsRUFEbUI7QUFFM0JNLEVBQUFBLElBQUksRUFBRSxFQUZxQjtBQUczQkMsRUFBQUEsS0FBSyxFQUFFO0FBSG9CLENBQTdCOztJQU1NQyxVOzs7QUFDSixzQkFBYUMsS0FBYixFQUFvQjtBQUNsQixTQUFLQSxLQUFMLEdBQWFBLEtBQWI7QUFDRDs7OztTQUNEQyxLLEdBQUEsaUJBQVM7QUFDUCxRQUFJO0FBQ0YsV0FBS0MsSUFBTCxHQUFZYixRQUFRLENBQUNZLEtBQVQsQ0FBZSxLQUFLRCxLQUFMLENBQVdHLEdBQTFCLEVBQStCO0FBQUVDLFFBQUFBLE1BQU0sRUFBRTtBQUFWLE9BQS9CLENBQVo7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QUFBQSxNQUFNLENBQUNLLFFBQVAsSUFBbUIsSUFBbkI7QUFDQS9CLElBQUFBLElBQUksQ0FBQ3NCLE9BQUwsQ0FBYUMsT0FBYixDQUFxQixVQUFBQyxXQUFXLEVBQUk7QUFDbEMsTUFBQSxNQUFJLENBQUNDLE9BQUwsQ0FBYUQsV0FBYixFQUEwQkUsTUFBMUI7QUFDRCxLQUZEO0FBR0FBLElBQUFBLE1BQU0sQ0FBQ0ssUUFBUCxJQUFtQixHQUFuQjtBQUNELEc7O1NBQ0QyQyxTLEdBQUEsbUJBQVcxRSxJQUFYLEVBQWlCMEIsTUFBakIsRUFBeUI7QUFDdkJBLElBQUFBLE1BQU0sQ0FBQ0ssUUFBUCxVQUF3Qi9CLElBQUksQ0FBQ3NCLE9BQTdCO0FBQ0QsRzs7U0FDRHFELFEsR0FBQSxrQkFBVTNFLElBQVYsRUFBZ0IwQixNQUFoQixFQUF3QjtBQUN0QkEsSUFBQUEsTUFBTSxDQUFDSyxRQUFQLElBQW1CL0IsSUFBSSxDQUFDc0IsT0FBeEI7QUFDRCxHOztTQUNEc0QsUSxHQUFBLGtCQUFVNUUsSUFBVixFQUFnQjBCLE1BQWhCLEVBQXdCO0FBQ3RCLFFBQUksS0FBS0wsSUFBTCxDQUFVOEMsSUFBZCxFQUFvQjtBQUNsQnpDLE1BQUFBLE1BQU0sQ0FBQ0ssUUFBUCxVQUF3Qi9CLElBQUksQ0FBQ3NCLE9BQUwsQ0FBYSxDQUFiLEVBQWdCQSxPQUF4QztBQUNBO0FBQ0Q7O0FBQ0RJLElBQUFBLE1BQU0sQ0FBQ0ssUUFBUCxVQUF3Qi9CLElBQUksQ0FBQ3NCLE9BQTdCO0FBQ0QsRzs7U0FDRHVELEssR0FBQSxlQUFPN0UsSUFBUCxFQUFhMEIsTUFBYixFQUFxQjtBQUNuQkEsSUFBQUEsTUFBTSxDQUFDSyxRQUFQLElBQW1CL0IsSUFBSSxDQUFDc0IsT0FBeEI7QUFDRCxHOzs7OztBQUdId0QsTUFBTSxDQUFDQyxPQUFQLEdBQWlCbEYsVUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBwb3N0Y3NzID0gcmVxdWlyZSgncG9zdGNzcycpXG5jb25zdCBnb256YWxlcyA9IHJlcXVpcmUoJ2dvbnphbGVzLXBlJylcblxuY29uc3QgREVGQVVMVF9SQVdTX1JPT1QgPSB7XG4gIGJlZm9yZTogJydcbn1cblxuY29uc3QgREVGQVVMVF9SQVdTX1JVTEUgPSB7XG4gIGJlZm9yZTogJycsXG4gIGJldHdlZW46ICcnXG59XG5cbmNvbnN0IERFRkFVTFRfUkFXU19ERUNMID0ge1xuICBiZWZvcmU6ICcnLFxuICBiZXR3ZWVuOiAnJyxcbiAgc2VtaWNvbG9uOiBmYWxzZVxufVxuXG5jb25zdCBERUZBVUxUX0NPTU1FTlRfREVDTCA9IHtcbiAgYmVmb3JlOiAnJyxcbiAgbGVmdDogJycsXG4gIHJpZ2h0OiAnJ1xufVxuXG5jbGFzcyBTYXNzUGFyc2VyIHtcbiAgY29uc3RydWN0b3IgKGlucHV0KSB7XG4gICAgdGhpcy5pbnB1dCA9IGlucHV0XG4gIH1cbiAgcGFyc2UgKCkge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLm5vZGUgPSBnb256YWxlcy5wYXJzZSh0aGlzLmlucHV0LmNzcywgeyBzeW50YXg6ICdzYXNzJyB9KVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aHJvdyB0aGlzLmlucHV0LmVycm9yKGVycm9yLm1lc3NhZ2UsIGVycm9yLmxpbmUsIDEpXG4gICAgfVxuICAgIHRoaXMubGluZXMgPSB0aGlzLmlucHV0LmNzcy5tYXRjaCgvXi4qKFxccj9cXG58JCkvZ20pXG4gICAgdGhpcy5yb290ID0gdGhpcy5zdHlsZXNoZWV0KHRoaXMubm9kZSlcbiAgfVxuICBleHRyYWN0U291cmNlIChzdGFydCwgZW5kKSB7XG4gICAgbGV0IG5vZGVMaW5lcyA9IHRoaXMubGluZXMuc2xpY2UoXG4gICAgICBzdGFydC5saW5lIC0gMSxcbiAgICAgIGVuZC5saW5lXG4gICAgKVxuXG4gICAgbm9kZUxpbmVzWzBdID0gbm9kZUxpbmVzWzBdLnN1YnN0cmluZyhzdGFydC5jb2x1bW4gLSAxKVxuICAgIGxldCBsYXN0ID0gbm9kZUxpbmVzLmxlbmd0aCAtIDFcbiAgICBub2RlTGluZXNbbGFzdF0gPSBub2RlTGluZXNbbGFzdF0uc3Vic3RyaW5nKDAsIGVuZC5jb2x1bW4pXG5cbiAgICByZXR1cm4gbm9kZUxpbmVzLmpvaW4oJycpXG4gIH1cbiAgc3R5bGVzaGVldCAobm9kZSkge1xuICAgIC8vIENyZWF0ZSBhbmQgc2V0IHBhcmFtZXRlcnMgZm9yIFJvb3Qgbm9kZVxuICAgIGxldCByb290ID0gcG9zdGNzcy5yb290KClcbiAgICByb290LnNvdXJjZSA9IHtcbiAgICAgIHN0YXJ0OiBub2RlLnN0YXJ0LFxuICAgICAgZW5kOiBub2RlLmVuZCxcbiAgICAgIGlucHV0OiB0aGlzLmlucHV0XG4gICAgfVxuICAgIC8vIFJhd3MgZm9yIHJvb3Qgbm9kZVxuICAgIHJvb3QucmF3cyA9IHtcbiAgICAgIHNlbWljb2xvbjogREVGQVVMVF9SQVdTX1JPT1Quc2VtaWNvbG9uLFxuICAgICAgYmVmb3JlOiBERUZBVUxUX1JBV1NfUk9PVC5iZWZvcmVcbiAgICB9XG4gICAgLy8gU3RvcmUgc3BhY2VzIGJlZm9yZSByb290IChpZiBleGlzdClcbiAgICB0aGlzLnJhd3MgPSB7XG4gICAgICBiZWZvcmU6ICcnXG4gICAgfVxuICAgIG5vZGUuY29udGVudC5mb3JFYWNoKGNvbnRlbnROb2RlID0+IHRoaXMucHJvY2Vzcyhjb250ZW50Tm9kZSwgcm9vdCkpXG4gICAgcmV0dXJuIHJvb3RcbiAgfVxuICBwcm9jZXNzIChub2RlLCBwYXJlbnQpIHtcbiAgICBpZiAodGhpc1tub2RlLnR5cGVdKSByZXR1cm4gdGhpc1tub2RlLnR5cGVdKG5vZGUsIHBhcmVudCkgfHwgbnVsbFxuICAgIHJldHVybiBudWxsXG4gIH1cbiAgcnVsZXNldCAobm9kZSwgcGFyZW50KSB7XG4gICAgLy8gTG9vcCB0byBmaW5kIHRoZSBkZWVwZXN0IHJ1bGVzZXQgbm9kZVxuICAgIHRoaXMucmF3cy5tdWx0aVJ1bGVQcm9wID0gJydcblxuICAgIG5vZGUuY29udGVudC5mb3JFYWNoKGNvbnRlbnROb2RlID0+IHtcbiAgICAgIHN3aXRjaCAoY29udGVudE5vZGUudHlwZSkge1xuICAgICAgICBjYXNlICdibG9jayc6IHtcbiAgICAgICAgICAvLyBDcmVhdGUgUnVsZSBub2RlXG4gICAgICAgICAgbGV0IHJ1bGUgPSBwb3N0Y3NzLnJ1bGUoKVxuICAgICAgICAgIHJ1bGUuc2VsZWN0b3IgPSAnJ1xuICAgICAgICAgIC8vIE9iamVjdCB0byBzdG9yZSByYXdzIGZvciBSdWxlXG4gICAgICAgICAgbGV0IHJ1bGVSYXdzID0ge1xuICAgICAgICAgICAgYmVmb3JlOiB0aGlzLnJhd3MuYmVmb3JlIHx8IERFRkFVTFRfUkFXU19SVUxFLmJlZm9yZSxcbiAgICAgICAgICAgIGJldHdlZW46IERFRkFVTFRfUkFXU19SVUxFLmJldHdlZW5cbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBWYXJpYWJsZSB0byBzdG9yZSBzcGFjZXMgYW5kIHN5bWJvbHMgYmVmb3JlIGRlY2xhcmF0aW9uIHByb3BlcnR5XG4gICAgICAgICAgdGhpcy5yYXdzLmJlZm9yZSA9ICcnXG4gICAgICAgICAgdGhpcy5yYXdzLmNvbW1lbnQgPSBmYWxzZVxuXG4gICAgICAgICAgLy8gTG9vayB1cCB0aHJvdyBhbGwgbm9kZXMgaW4gY3VycmVudCBydWxlc2V0IG5vZGVcbiAgICAgICAgICBub2RlLmNvbnRlbnRcbiAgICAgICAgICAgIC5maWx0ZXIoY29udGVudCA9PiBjb250ZW50LnR5cGUgPT09ICdibG9jaycpXG4gICAgICAgICAgICAuZm9yRWFjaChpbm5lckNvbnRlbnROb2RlID0+IHRoaXMucHJvY2Vzcyhpbm5lckNvbnRlbnROb2RlLCBydWxlKSlcblxuICAgICAgICAgIGlmIChydWxlLm5vZGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgLy8gV3JpdGUgc2VsZWN0b3IgdG8gUnVsZVxuICAgICAgICAgICAgcnVsZS5zZWxlY3RvciA9IHRoaXMuZXh0cmFjdFNvdXJjZShcbiAgICAgICAgICAgICAgbm9kZS5zdGFydCxcbiAgICAgICAgICAgICAgY29udGVudE5vZGUuc3RhcnRcbiAgICAgICAgICAgICkuc2xpY2UoMCwgLTEpLnJlcGxhY2UoL1xccyskLywgc3BhY2VzID0+IHtcbiAgICAgICAgICAgICAgcnVsZVJhd3MuYmV0d2VlbiA9IHNwYWNlc1xuICAgICAgICAgICAgICByZXR1cm4gJydcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAvLyBTZXQgcGFyYW1ldGVycyBmb3IgUnVsZSBub2RlXG4gICAgICAgICAgICBydWxlLnBhcmVudCA9IHBhcmVudFxuICAgICAgICAgICAgcnVsZS5zb3VyY2UgPSB7XG4gICAgICAgICAgICAgIHN0YXJ0OiBub2RlLnN0YXJ0LFxuICAgICAgICAgICAgICBlbmQ6IG5vZGUuZW5kLFxuICAgICAgICAgICAgICBpbnB1dDogdGhpcy5pbnB1dFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcnVsZS5yYXdzID0gcnVsZVJhd3NcbiAgICAgICAgICAgIHBhcmVudC5ub2Rlcy5wdXNoKHJ1bGUpXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgIH1cbiAgICB9KVxuICB9XG4gIGJsb2NrIChub2RlLCBwYXJlbnQpIHtcbiAgICAvLyBJZiBuZXN0ZWQgcnVsZXMgZXhpc3QsIHdyYXAgY3VycmVudCBydWxlIGluIG5ldyBydWxlIG5vZGVcbiAgICBpZiAodGhpcy5yYXdzLm11bHRpUnVsZSkge1xuICAgICAgaWYgKHRoaXMucmF3cy5tdWx0aVJ1bGVQcm9wVmFyaWFibGUpIHtcbiAgICAgICAgdGhpcy5yYXdzLm11bHRpUnVsZVByb3AgPSBgJCR7IHRoaXMucmF3cy5tdWx0aVJ1bGVQcm9wIH1gXG4gICAgICB9XG4gICAgICBsZXQgbXVsdGlSdWxlID0gT2JqZWN0LmFzc2lnbihwb3N0Y3NzLnJ1bGUoKSwge1xuICAgICAgICBzb3VyY2U6IHtcbiAgICAgICAgICBzdGFydDoge1xuICAgICAgICAgICAgbGluZTogbm9kZS5zdGFydC5saW5lIC0gMSxcbiAgICAgICAgICAgIGNvbHVtbjogbm9kZS5zdGFydC5jb2x1bW5cbiAgICAgICAgICB9LFxuICAgICAgICAgIGVuZDogbm9kZS5lbmQsXG4gICAgICAgICAgaW5wdXQ6IHRoaXMuaW5wdXRcbiAgICAgICAgfSxcbiAgICAgICAgcmF3czoge1xuICAgICAgICAgIGJlZm9yZTogdGhpcy5yYXdzLmJlZm9yZSB8fCBERUZBVUxUX1JBV1NfUlVMRS5iZWZvcmUsXG4gICAgICAgICAgYmV0d2VlbjogREVGQVVMVF9SQVdTX1JVTEUuYmV0d2VlblxuICAgICAgICB9LFxuICAgICAgICBwYXJlbnQsXG4gICAgICAgIHNlbGVjdG9yOiAodGhpcy5yYXdzLmN1c3RvbVByb3BlcnR5ID8gJy0tJyA6ICcnKSArIHRoaXMucmF3cy5tdWx0aVJ1bGVQcm9wXG4gICAgICB9KVxuICAgICAgcGFyZW50LnB1c2gobXVsdGlSdWxlKVxuICAgICAgcGFyZW50ID0gbXVsdGlSdWxlXG4gICAgfVxuXG4gICAgdGhpcy5yYXdzLmJlZm9yZSA9ICcnXG5cbiAgICAvLyBMb29raW5nIGZvciBkZWNsYXJhdGlvbiBub2RlIGluIGJsb2NrIG5vZGVcbiAgICBub2RlLmNvbnRlbnQuZm9yRWFjaChjb250ZW50Tm9kZSA9PiB0aGlzLnByb2Nlc3MoY29udGVudE5vZGUsIHBhcmVudCkpXG4gICAgaWYgKHRoaXMucmF3cy5tdWx0aVJ1bGUpIHtcbiAgICAgIHRoaXMucmF3cy5iZWZvcmVNdWx0aSA9IHRoaXMucmF3cy5iZWZvcmVcbiAgICB9XG4gIH1cbiAgZGVjbGFyYXRpb24gKG5vZGUsIHBhcmVudCkge1xuICAgIGxldCBpc0Jsb2NrSW5zaWRlID0gZmFsc2VcbiAgICAvLyBDcmVhdGUgRGVjbGFyYXRpb24gbm9kZVxuICAgIGxldCBkZWNsYXJhdGlvbk5vZGUgPSBwb3N0Y3NzLmRlY2woKVxuICAgIGRlY2xhcmF0aW9uTm9kZS5wcm9wID0gJydcblxuICAgIC8vIE9iamVjdCB0byBzdG9yZSByYXdzIGZvciBEZWNsYXJhdGlvblxuICAgIGxldCBkZWNsYXJhdGlvblJhd3MgPSBPYmplY3QuYXNzaWduKGRlY2xhcmF0aW9uTm9kZS5yYXdzLCB7XG4gICAgICBiZWZvcmU6IHRoaXMucmF3cy5iZWZvcmUgfHwgREVGQVVMVF9SQVdTX0RFQ0wuYmVmb3JlLFxuICAgICAgYmV0d2VlbjogREVGQVVMVF9SQVdTX0RFQ0wuYmV0d2VlbixcbiAgICAgIHNlbWljb2xvbjogREVGQVVMVF9SQVdTX0RFQ0wuc2VtaWNvbG9uXG4gICAgfSlcblxuICAgIHRoaXMucmF3cy5wcm9wZXJ0eSA9IGZhbHNlXG4gICAgdGhpcy5yYXdzLmJldHdlZW5CZWZvcmUgPSBmYWxzZVxuICAgIHRoaXMucmF3cy5jb21tZW50ID0gZmFsc2VcbiAgICAvLyBMb29raW5nIGZvciBwcm9wZXJ0eSBhbmQgdmFsdWUgbm9kZSBpbiBkZWNsYXJhdGlvbiBub2RlXG4gICAgbm9kZS5jb250ZW50LmZvckVhY2goY29udGVudE5vZGUgPT4ge1xuICAgICAgc3dpdGNoIChjb250ZW50Tm9kZS50eXBlKSB7XG4gICAgICAgIGNhc2UgJ2N1c3RvbVByb3BlcnR5JzpcbiAgICAgICAgICB0aGlzLnJhd3MuY3VzdG9tUHJvcGVydHkgPSB0cnVlXG4gICAgICAgICAgLy8gZmFsbCB0aHJvdWdoXG4gICAgICAgIGNhc2UgJ3Byb3BlcnR5Jzoge1xuICAgICAgICAgIC8qIHRoaXMucmF3cy5wcm9wZXJ0eSB0byBkZXRlY3QgaXMgcHJvcGVydHkgaXMgYWxyZWFkeSBkZWZpbmVkIGluIGN1cnJlbnQgb2JqZWN0ICovXG4gICAgICAgICAgdGhpcy5yYXdzLnByb3BlcnR5ID0gdHJ1ZVxuICAgICAgICAgIHRoaXMucmF3cy5tdWx0aVJ1bGVQcm9wID0gY29udGVudE5vZGUuY29udGVudFswXS5jb250ZW50XG4gICAgICAgICAgdGhpcy5yYXdzLm11bHRpUnVsZVByb3BWYXJpYWJsZSA9IGNvbnRlbnROb2RlLmNvbnRlbnRbMF0udHlwZSA9PT0gJ3ZhcmlhYmxlJ1xuICAgICAgICAgIHRoaXMucHJvY2Vzcyhjb250ZW50Tm9kZSwgZGVjbGFyYXRpb25Ob2RlKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgICAgY2FzZSAncHJvcGVydHlEZWxpbWl0ZXInOiB7XG4gICAgICAgICAgaWYgKHRoaXMucmF3cy5wcm9wZXJ0eSAmJiAhdGhpcy5yYXdzLmJldHdlZW5CZWZvcmUpIHtcbiAgICAgICAgICAgIC8qIElmIHByb3BlcnR5IGlzIGFscmVhZHkgZGVmaW5lZCBhbmQgdGhlcmUncyBubyAnOicgYmVmb3JlIGl0ICovXG4gICAgICAgICAgICBkZWNsYXJhdGlvblJhd3MuYmV0d2VlbiArPSBjb250ZW50Tm9kZS5jb250ZW50XG4gICAgICAgICAgICB0aGlzLnJhd3MubXVsdGlSdWxlUHJvcCArPSBjb250ZW50Tm9kZS5jb250ZW50XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8qIElmICc6JyBnb2VzIGJlZm9yZSBwcm9wZXJ0eSBkZWNsYXJhdGlvbiwgbGlrZSA6d2lkdGggMTAwcHggKi9cbiAgICAgICAgICAgIHRoaXMucmF3cy5iZXR3ZWVuQmVmb3JlID0gdHJ1ZVxuICAgICAgICAgICAgZGVjbGFyYXRpb25SYXdzLmJlZm9yZSArPSBjb250ZW50Tm9kZS5jb250ZW50XG4gICAgICAgICAgICB0aGlzLnJhd3MubXVsdGlSdWxlUHJvcCArPSBjb250ZW50Tm9kZS5jb250ZW50XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgICAgY2FzZSAnc3BhY2UnOiB7XG4gICAgICAgICAgZGVjbGFyYXRpb25SYXdzLmJldHdlZW4gKz0gY29udGVudE5vZGUuY29udGVudFxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgICAgY2FzZSAndmFsdWUnOiB7XG4gICAgICAgICAgLy8gTG9vayB1cCBmb3IgYSB2YWx1ZSBmb3IgY3VycmVudCBwcm9wZXJ0eVxuICAgICAgICAgIHN3aXRjaCAoY29udGVudE5vZGUuY29udGVudFswXS50eXBlKSB7XG4gICAgICAgICAgICBjYXNlICdibG9jayc6IHtcbiAgICAgICAgICAgICAgaXNCbG9ja0luc2lkZSA9IHRydWVcbiAgICAgICAgICAgICAgLy8gSWYgbmVzdGVkIHJ1bGVzIGV4aXN0XG4gICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGNvbnRlbnROb2RlLmNvbnRlbnRbMF0uY29udGVudCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJhd3MubXVsdGlSdWxlID0gdHJ1ZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHRoaXMucHJvY2Vzcyhjb250ZW50Tm9kZS5jb250ZW50WzBdLCBwYXJlbnQpXG4gICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlICd2YXJpYWJsZSc6IHtcbiAgICAgICAgICAgICAgZGVjbGFyYXRpb25Ob2RlLnZhbHVlID0gJyQnXG4gICAgICAgICAgICAgIHRoaXMucHJvY2Vzcyhjb250ZW50Tm9kZSwgZGVjbGFyYXRpb25Ob2RlKVxuICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSAnY29sb3InOiB7XG4gICAgICAgICAgICAgIGRlY2xhcmF0aW9uTm9kZS52YWx1ZSA9ICcjJ1xuICAgICAgICAgICAgICB0aGlzLnByb2Nlc3MoY29udGVudE5vZGUsIGRlY2xhcmF0aW9uTm9kZSlcbiAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgJ251bWJlcic6IHtcbiAgICAgICAgICAgICAgaWYgKGNvbnRlbnROb2RlLmNvbnRlbnQubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgIGRlY2xhcmF0aW9uTm9kZS52YWx1ZSA9IGNvbnRlbnROb2RlLmNvbnRlbnQuam9pbignJylcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3MoY29udGVudE5vZGUsIGRlY2xhcmF0aW9uTm9kZSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSAncGFyZW50aGVzZXMnOiB7XG4gICAgICAgICAgICAgIGRlY2xhcmF0aW9uTm9kZS52YWx1ZSA9ICcoJ1xuICAgICAgICAgICAgICB0aGlzLnByb2Nlc3MoY29udGVudE5vZGUsIGRlY2xhcmF0aW9uTm9kZSlcbiAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzKGNvbnRlbnROb2RlLCBkZWNsYXJhdGlvbk5vZGUpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgaWYgKCFpc0Jsb2NrSW5zaWRlKSB7XG4gICAgICAvLyBTZXQgcGFyYW1ldGVycyBmb3IgRGVjbGFyYXRpb24gbm9kZVxuICAgICAgZGVjbGFyYXRpb25Ob2RlLnNvdXJjZSA9IHtcbiAgICAgICAgc3RhcnQ6IG5vZGUuc3RhcnQsXG4gICAgICAgIGVuZDogbm9kZS5lbmQsXG4gICAgICAgIGlucHV0OiB0aGlzLmlucHV0XG4gICAgICB9XG4gICAgICBkZWNsYXJhdGlvbk5vZGUucGFyZW50ID0gcGFyZW50XG4gICAgICBwYXJlbnQubm9kZXMucHVzaChkZWNsYXJhdGlvbk5vZGUpXG4gICAgfVxuXG4gICAgdGhpcy5yYXdzLmJlZm9yZSA9ICcnXG4gICAgdGhpcy5yYXdzLmN1c3RvbVByb3BlcnR5ID0gZmFsc2VcbiAgICB0aGlzLnJhd3MubXVsdGlSdWxlUHJvcCA9ICcnXG4gICAgdGhpcy5yYXdzLnByb3BlcnR5ID0gZmFsc2VcbiAgfVxuICBjdXN0b21Qcm9wZXJ0eSAobm9kZSwgcGFyZW50KSB7XG4gICAgdGhpcy5wcm9wZXJ0eShub2RlLCBwYXJlbnQpXG4gICAgcGFyZW50LnByb3AgPSBgLS0keyBwYXJlbnQucHJvcCB9YFxuICB9XG4gIHByb3BlcnR5IChub2RlLCBwYXJlbnQpIHtcbiAgICAvLyBTZXQgcHJvcGVydHkgZm9yIERlY2xhcmF0aW9uIG5vZGVcbiAgICBzd2l0Y2ggKG5vZGUuY29udGVudFswXS50eXBlKSB7XG4gICAgICBjYXNlICd2YXJpYWJsZSc6IHtcbiAgICAgICAgcGFyZW50LnByb3AgKz0gJyQnXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgICBjYXNlICdpbnRlcnBvbGF0aW9uJzoge1xuICAgICAgICB0aGlzLnJhd3MuaW50ZXJwb2xhdGlvbiA9IHRydWVcbiAgICAgICAgcGFyZW50LnByb3AgKz0gJyN7J1xuICAgICAgICBicmVha1xuICAgICAgfVxuICAgICAgZGVmYXVsdDpcbiAgICB9XG4gICAgcGFyZW50LnByb3AgKz0gbm9kZS5jb250ZW50WzBdLmNvbnRlbnRcbiAgICBpZiAodGhpcy5yYXdzLmludGVycG9sYXRpb24pIHtcbiAgICAgIHBhcmVudC5wcm9wICs9ICd9J1xuICAgICAgdGhpcy5yYXdzLmludGVycG9sYXRpb24gPSBmYWxzZVxuICAgIH1cbiAgfVxuICB2YWx1ZSAobm9kZSwgcGFyZW50KSB7XG4gICAgaWYgKCFwYXJlbnQudmFsdWUpIHtcbiAgICAgIHBhcmVudC52YWx1ZSA9ICcnXG4gICAgfVxuICAgIC8vIFNldCB2YWx1ZSBmb3IgRGVjbGFyYXRpb24gbm9kZVxuICAgIGlmIChub2RlLmNvbnRlbnQubGVuZ3RoKSB7XG4gICAgICBub2RlLmNvbnRlbnQuZm9yRWFjaChjb250ZW50Tm9kZSA9PiB7XG4gICAgICAgIHN3aXRjaCAoY29udGVudE5vZGUudHlwZSkge1xuICAgICAgICAgIGNhc2UgJ2ltcG9ydGFudCc6IHtcbiAgICAgICAgICAgIHBhcmVudC5yYXdzLmltcG9ydGFudCA9IGNvbnRlbnROb2RlLmNvbnRlbnRcbiAgICAgICAgICAgIHBhcmVudC5pbXBvcnRhbnQgPSB0cnVlXG4gICAgICAgICAgICBsZXQgbWF0Y2ggPSBwYXJlbnQudmFsdWUubWF0Y2goL14oLio/KShcXHMqKSQvKVxuICAgICAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICAgIHBhcmVudC5yYXdzLmltcG9ydGFudCA9IG1hdGNoWzJdICsgcGFyZW50LnJhd3MuaW1wb3J0YW50XG4gICAgICAgICAgICAgIHBhcmVudC52YWx1ZSA9IG1hdGNoWzFdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIH1cbiAgICAgICAgICBjYXNlICdwYXJlbnRoZXNlcyc6IHtcbiAgICAgICAgICAgIHBhcmVudC52YWx1ZSArPSBjb250ZW50Tm9kZS5jb250ZW50LmpvaW4oJycpICsgJyknXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIH1cbiAgICAgICAgICBjYXNlICdwZXJjZW50YWdlJzoge1xuICAgICAgICAgICAgcGFyZW50LnZhbHVlICs9IGNvbnRlbnROb2RlLmNvbnRlbnQuam9pbignJykgKyAnJSdcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgfVxuICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgIGlmIChjb250ZW50Tm9kZS5jb250ZW50LmNvbnN0cnVjdG9yID09PSBBcnJheSkge1xuICAgICAgICAgICAgICBwYXJlbnQudmFsdWUgKz0gY29udGVudE5vZGUuY29udGVudC5qb2luKCcnKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcGFyZW50LnZhbHVlICs9IGNvbnRlbnROb2RlLmNvbnRlbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9XG4gIHNpbmdsZWxpbmVDb21tZW50IChub2RlLCBwYXJlbnQpIHtcbiAgICByZXR1cm4gdGhpcy5jb21tZW50KG5vZGUsIHBhcmVudCwgdHJ1ZSlcbiAgfVxuICBtdWx0aWxpbmVDb21tZW50IChub2RlLCBwYXJlbnQpIHtcbiAgICByZXR1cm4gdGhpcy5jb21tZW50KG5vZGUsIHBhcmVudCwgZmFsc2UpXG4gIH1cbiAgY29tbWVudCAobm9kZSwgcGFyZW50LCBpbmxpbmUpIHtcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbm9kZXNlY3VyaXR5L2VzbGludC1wbHVnaW4tc2VjdXJpdHkjZGV0ZWN0LXVuc2FmZS1yZWdleFxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBzZWN1cml0eS9kZXRlY3QtdW5zYWZlLXJlZ2V4XG4gICAgbGV0IHRleHQgPSBub2RlLmNvbnRlbnQubWF0Y2goL14oXFxzKikoKD86XFxTW1xcc1xcU10qPyk/KShcXHMqKSQvKVxuXG4gICAgdGhpcy5yYXdzLmNvbW1lbnQgPSB0cnVlXG5cbiAgICBsZXQgY29tbWVudCA9IE9iamVjdC5hc3NpZ24ocG9zdGNzcy5jb21tZW50KCksIHtcbiAgICAgIHRleHQ6IHRleHRbMl0sXG4gICAgICByYXdzOiB7XG4gICAgICAgIGJlZm9yZTogdGhpcy5yYXdzLmJlZm9yZSB8fCBERUZBVUxUX0NPTU1FTlRfREVDTC5iZWZvcmUsXG4gICAgICAgIGxlZnQ6IHRleHRbMV0sXG4gICAgICAgIHJpZ2h0OiB0ZXh0WzNdLFxuICAgICAgICBpbmxpbmVcbiAgICAgIH0sXG4gICAgICBzb3VyY2U6IHtcbiAgICAgICAgc3RhcnQ6IHtcbiAgICAgICAgICBsaW5lOiBub2RlLnN0YXJ0LmxpbmUsXG4gICAgICAgICAgY29sdW1uOiBub2RlLnN0YXJ0LmNvbHVtblxuICAgICAgICB9LFxuICAgICAgICBlbmQ6IG5vZGUuZW5kLFxuICAgICAgICBpbnB1dDogdGhpcy5pbnB1dFxuICAgICAgfSxcbiAgICAgIHBhcmVudFxuICAgIH0pXG5cbiAgICBpZiAodGhpcy5yYXdzLmJlZm9yZU11bHRpKSB7XG4gICAgICBjb21tZW50LnJhd3MuYmVmb3JlICs9IHRoaXMucmF3cy5iZWZvcmVNdWx0aVxuICAgICAgdGhpcy5yYXdzLmJlZm9yZU11bHRpID0gdW5kZWZpbmVkXG4gICAgfVxuXG4gICAgcGFyZW50Lm5vZGVzLnB1c2goY29tbWVudClcbiAgICB0aGlzLnJhd3MuYmVmb3JlID0gJydcbiAgfVxuICBzcGFjZSAobm9kZSwgcGFyZW50KSB7XG4gICAgLy8gU3BhY2VzIGJlZm9yZSByb290IGFuZCBydWxlXG4gICAgc3dpdGNoIChwYXJlbnQudHlwZSkge1xuICAgICAgY2FzZSAncm9vdCc6IHtcbiAgICAgICAgdGhpcy5yYXdzLmJlZm9yZSArPSBub2RlLmNvbnRlbnRcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICAgIGNhc2UgJ3J1bGUnOiB7XG4gICAgICAgIGlmICh0aGlzLnJhd3MuY29tbWVudCkge1xuICAgICAgICAgIHRoaXMucmF3cy5iZWZvcmUgKz0gbm9kZS5jb250ZW50XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5yYXdzLmxvb3ApIHtcbiAgICAgICAgICBwYXJlbnQuc2VsZWN0b3IgKz0gbm9kZS5jb250ZW50XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5yYXdzLmJlZm9yZSA9ICh0aGlzLnJhd3MuYmVmb3JlIHx8ICdcXG4nKSArIG5vZGUuY29udGVudFxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgIH1cbiAgfVxuICBkZWNsYXJhdGlvbkRlbGltaXRlciAobm9kZSkge1xuICAgIHRoaXMucmF3cy5iZWZvcmUgKz0gbm9kZS5jb250ZW50XG4gIH1cbiAgbG9vcCAobm9kZSwgcGFyZW50KSB7XG4gICAgbGV0IGxvb3AgPSBwb3N0Y3NzLnJ1bGUoKVxuICAgIHRoaXMucmF3cy5jb21tZW50ID0gZmFsc2VcbiAgICB0aGlzLnJhd3MubXVsdGlSdWxlID0gZmFsc2VcbiAgICB0aGlzLnJhd3MubG9vcCA9IHRydWVcbiAgICBsb29wLnNlbGVjdG9yID0gJydcbiAgICBsb29wLnJhd3MgPSB7XG4gICAgICBiZWZvcmU6IHRoaXMucmF3cy5iZWZvcmUgfHwgREVGQVVMVF9SQVdTX1JVTEUuYmVmb3JlLFxuICAgICAgYmV0d2VlbjogREVGQVVMVF9SQVdTX1JVTEUuYmV0d2VlblxuICAgIH1cbiAgICBpZiAodGhpcy5yYXdzLmJlZm9yZU11bHRpKSB7XG4gICAgICBsb29wLnJhd3MuYmVmb3JlICs9IHRoaXMucmF3cy5iZWZvcmVNdWx0aVxuICAgICAgdGhpcy5yYXdzLmJlZm9yZU11bHRpID0gdW5kZWZpbmVkXG4gICAgfVxuICAgIG5vZGUuY29udGVudC5mb3JFYWNoKChjb250ZW50Tm9kZSwgaSkgPT4ge1xuICAgICAgaWYgKG5vZGUuY29udGVudFtpICsgMV0gJiYgbm9kZS5jb250ZW50W2kgKyAxXS50eXBlID09PSAnYmxvY2snKSB7XG4gICAgICAgIHRoaXMucmF3cy5sb29wID0gZmFsc2VcbiAgICAgIH1cbiAgICAgIHRoaXMucHJvY2Vzcyhjb250ZW50Tm9kZSwgbG9vcClcbiAgICB9KVxuICAgIHBhcmVudC5ub2Rlcy5wdXNoKGxvb3ApXG4gICAgdGhpcy5yYXdzLmxvb3AgPSBmYWxzZVxuICB9XG4gIGF0cnVsZSAobm9kZSwgcGFyZW50KSB7XG4gICAgbGV0IGF0cnVsZSA9IHBvc3Rjc3MucnVsZSgpXG4gICAgYXRydWxlLnNlbGVjdG9yID0gJydcbiAgICBhdHJ1bGUucmF3cyA9IHtcbiAgICAgIGJlZm9yZTogdGhpcy5yYXdzLmJlZm9yZSB8fCBERUZBVUxUX1JBV1NfUlVMRS5iZWZvcmUsXG4gICAgICBiZXR3ZWVuOiBERUZBVUxUX1JBV1NfUlVMRS5iZXR3ZWVuXG4gICAgfVxuICAgIG5vZGUuY29udGVudC5mb3JFYWNoKChjb250ZW50Tm9kZSwgaSkgPT4ge1xuICAgICAgaWYgKGNvbnRlbnROb2RlLnR5cGUgPT09ICdzcGFjZScpIHtcbiAgICAgICAgbGV0IHByZXZOb2RlVHlwZSA9IG5vZGUuY29udGVudFtpIC0gMV0udHlwZVxuICAgICAgICBzd2l0Y2ggKHByZXZOb2RlVHlwZSkge1xuICAgICAgICAgIGNhc2UgJ2F0a2V5d29yZCc6XG4gICAgICAgICAgY2FzZSAnaWRlbnQnOlxuICAgICAgICAgICAgYXRydWxlLnNlbGVjdG9yICs9IGNvbnRlbnROb2RlLmNvbnRlbnRcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgfVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIHRoaXMucHJvY2Vzcyhjb250ZW50Tm9kZSwgYXRydWxlKVxuICAgIH0pXG4gICAgcGFyZW50Lm5vZGVzLnB1c2goYXRydWxlKVxuICB9XG4gIHBhcmVudGhlc2VzIChub2RlLCBwYXJlbnQpIHtcbiAgICBwYXJlbnQuc2VsZWN0b3IgKz0gJygnXG4gICAgbm9kZS5jb250ZW50LmZvckVhY2goY29udGVudE5vZGUgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBjb250ZW50Tm9kZS5jb250ZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgICBwYXJlbnQuc2VsZWN0b3IgKz0gY29udGVudE5vZGUuY29udGVudFxuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGNvbnRlbnROb2RlLmNvbnRlbnQgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGNvbnRlbnROb2RlLmNvbnRlbnQuZm9yRWFjaChjaGlsZHJlbkNvbnRlbnROb2RlID0+IHtcbiAgICAgICAgICBpZiAoY29udGVudE5vZGUudHlwZSA9PT0gJ3ZhcmlhYmxlJykgcGFyZW50LnNlbGVjdG9yICs9ICckJ1xuICAgICAgICAgIHBhcmVudC5zZWxlY3RvciArPSBjaGlsZHJlbkNvbnRlbnROb2RlLmNvbnRlbnRcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICAgIHBhcmVudC5zZWxlY3RvciArPSAnKSdcbiAgfVxuICBpbnRlcnBvbGF0aW9uIChub2RlLCBwYXJlbnQpIHtcbiAgICBwYXJlbnQuc2VsZWN0b3IgKz0gJyN7J1xuICAgIG5vZGUuY29udGVudC5mb3JFYWNoKGNvbnRlbnROb2RlID0+IHtcbiAgICAgIHRoaXMucHJvY2Vzcyhjb250ZW50Tm9kZSwgcGFyZW50KVxuICAgIH0pXG4gICAgcGFyZW50LnNlbGVjdG9yICs9ICd9J1xuICB9XG4gIGF0a2V5d29yZCAobm9kZSwgcGFyZW50KSB7XG4gICAgcGFyZW50LnNlbGVjdG9yICs9IGBAJHsgbm9kZS5jb250ZW50IH1gXG4gIH1cbiAgb3BlcmF0b3IgKG5vZGUsIHBhcmVudCkge1xuICAgIHBhcmVudC5zZWxlY3RvciArPSBub2RlLmNvbnRlbnRcbiAgfVxuICB2YXJpYWJsZSAobm9kZSwgcGFyZW50KSB7XG4gICAgaWYgKHRoaXMucmF3cy5sb29wKSB7XG4gICAgICBwYXJlbnQuc2VsZWN0b3IgKz0gYCQkeyBub2RlLmNvbnRlbnRbMF0uY29udGVudCB9YFxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHBhcmVudC5zZWxlY3RvciArPSBgJCR7IG5vZGUuY29udGVudCB9YFxuICB9XG4gIGlkZW50IChub2RlLCBwYXJlbnQpIHtcbiAgICBwYXJlbnQuc2VsZWN0b3IgKz0gbm9kZS5jb250ZW50XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTYXNzUGFyc2VyXG4iXX0=