import React from 'react';
import RewardsPopup from './RewardsPopup';

class SafeRewardsWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('RewardsPopup crashed', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return null; // Fail silently, it's just a popup
    }
    return <RewardsPopup {...this.props} />;
  }
}

export default SafeRewardsWrapper;
