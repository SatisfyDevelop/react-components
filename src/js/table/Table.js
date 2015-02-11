define(function(require) {
    'use strict';

    var BaseTable = require('drc/table/BaseTable');
    var BasicTable = require('drc/table/BasicTable');
    var GroupedActionsTable = require('drc/table/GroupedActionsTable');
    var React = require('react');

    var TABLE_TYPES = {
        BASIC: 'basic',
        GROUPED_ACTIONS: 'groupedActions'
    };

    return React.createClass({
        displayName: 'Table',

        getDefaultProps: function() {
            return {
                type: 'basic'
            };
        },

        propTypes: {
            type: React.PropTypes.oneOf([TABLE_TYPES.BASIC, TABLE_TYPES.GROUPED_ACTIONS])
        },

        getTable: function() {
            switch (this.props.type) {
                case TABLE_TYPES.BASIC:
                    return <BasicTable {...this.props} />;
                case TABLE_TYPES.GROUPED_ACTIONS:
                    return <GroupedActionsTable {...this.props} />;
            }
        },

        render: function() {
            return this.getTable();
        }
    });
});