import React from "react";
import _ from "lodash";
import RGL, { WidthProvider } from "react-grid-layout";

const ReactGridLayout = WidthProvider(RGL);

export default class LazyLoadLayout extends React.PureComponent {
  static defaultProps = {
    className: "layout",
    items: 1000,
    rowHeight: 30,
    onLayoutChange: function() {},
    cols: 12
  };

  constructor(props) {
    super(props);

    const layout = this.generateLayout();
    this.state = { layout, containerRef: null };
  }

  generateDOM() {
    return _.map(_.range(this.props.items), function(i) {
      return (
        <div key={i}>
          <span className="text">{i}</span>
        </div>
      );
    });
  }

  generateLayout() {
    const p = this.props;

    return _.map(new Array(p.items), function(item, i) {
      const y = _.result(p, "y") || Math.ceil(Math.random() * 4) + 1;

      let height = y;

      /**
       * Test to ensure that elements that have a height greater
       * than the viewport are properly lazyloaded.
       */
      if (i === 0) height = 100;

      return {
        x: (i * 2) % 12,
        y: Math.floor(i / 6) * y,
        w: 2,
        h: height,
        i: i.toString()
      };
    });
  }

  onLayoutChange(layout) {
    this.setState({ layout });
    this.props.onLayoutChange(layout);
  }

  handleScroll = (e) => {
    this.setState({ scrollChanged: new Date().getTime() });
  }

  render() {

    return (
      <div 
      style={{ 
        height: '600px', 
        overflowY: 'scroll'
      }}
      onScroll={this.handleScroll}
      ref={e => {
        if (e && !this.state.containerRef) this.setState({ 
          containerRef: e,
        });
      }}
      >
      <ReactGridLayout
        margin={[0,0]}
        lazyload={this.state.layout.length > 100}
        disableDragPreview={this.state.layout.length > 100}
        parentContainer={this.state.containerRef}
        layout={this.state.layout}
        onLayoutChange={this.onLayoutChange}
        {...this.props}
      >
        {this.generateDOM()}
      </ReactGridLayout>
      </div>
    );
  }
}

if (process.env.STATIC_EXAMPLES === true) {
  import("../test-hook.jsx").then(fn => fn.default(BasicLayout));
}
