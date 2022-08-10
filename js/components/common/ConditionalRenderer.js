import PropTypes from 'prop-types';

const ConditionalRenderer = ({ enabled, children }) => {
  return enabled ? children : null;
};

ConditionalRenderer.propTypes = {
  children: PropTypes.node.isRequired,
  enabled: PropTypes.bool.isRequired
};

export default ConditionalRenderer;
