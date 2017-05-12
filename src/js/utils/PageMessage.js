var createReactClass = require('create-react-class');
var {CSSTransitionGroup} = require('react-transition-group');
var PropTypes = require('prop-types');
var PortalMixins = require('../mixins/PortalMixins');
var React = require('react');

var PageMessage = createReactClass({
    propTypes: {
        message: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        duration: PropTypes.number,
        icon: PropTypes.string,
        closeIcon: PropTypes.string,
        disableTransition: PropTypes.bool
    },

    getDefaultProps: function() {
        return {
            duration: 3000
        };
    },

    getInitialState: function() {
        return {
            leaving: false
        };
    },

    componentDidMount: function() {
        // Dismiss the message with animation after the duration time if the message was not already closed manually.
        if (this.props.duration > 0) {
            this.timeout = setTimeout(function() {
                this.dismiss(true);
            }.bind(this), this.props.duration);
        }
    },

    componentWillUnmount: function() {
        // Future messages would have incorrect duration times if this is not cleared.
        clearTimeout(this.timeout);
        this.timeout = null;
    },

    render: function() {
        var messageMarkup = this.getMessageMarkup();
        if (!this.props.disableTransition) {
            // wrap message markup in CSSTransitionGroup if transitioning is not disabled
            messageMarkup = (
                <CSSTransitionGroup transitionName="message" transitionAppear transitionEnterTimeout={300} transitionLeaveTimeout={300} transitionAppearTimeout={300}>
                    {messageMarkup}
                </CSSTransitionGroup>
            );
        }
        return (
            <div className="page-message">
                {messageMarkup}
            </div>
        );
    },

    /**
     * Builds the markup for the message that is to be displayed.
     * @returns {ReactElement|Null} - The element containing the message.
     */
    getMessageMarkup: function() {
        // When null is returned, the message will remain in the DOM until the animation has completed if an animation was requested.
        if (this.state.leaving) {
            return null;
        }

        var closeIcon = this.props.closeIcon ? <i className={this.props.closeIcon + ' close'} onClick={this.dismiss.bind(this, false)} /> : null;
        var icon = this.props.icon ? <i className={this.props.icon} /> : null;

        return (
            <div className={"message " + this.props.type}>
                {closeIcon}
                <span>{icon} {this.props.message}</span>
            </div>
        );
    },

    /**
     * Triggers dismissal of the page message with or without animation.
     * @param {Number} animate - The duration to wait before animation.
     */
    dismiss: function(animate) {
        // If the close button was clicked, don't animate the message off of the screen. Simply remove it immediately.
        var animationAllowance = animate ? 1000 : 0;

        // Triggers removal of the message for the CSSTransitionGroup
        this.setState({
            leaving: animate
        });

        // Delay the closing of the portal so that the animation is allowed to complete.
        this.timeout = setTimeout(function() {
            PortalMixins.closePortal();
        }, animationAllowance);
    }
});

module.exports = PageMessage;
