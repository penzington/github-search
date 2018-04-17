import React from "react";
import { withRouter } from "react-router-dom";

// Scrolls the user back to the top of the page on any page changed,
// except when the page change is due to typing in the search bar

class ScrollToTop extends React.Component {
  componentDidUpdate(prevProps) {
    if (
      this.props.location !== prevProps.location &&
      !(
        this.props.location.pathname.includes("/search") &&
        prevProps.location.pathname.includes("/search")
      )
    ) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return null;
  }
}

export default withRouter(ScrollToTop);
