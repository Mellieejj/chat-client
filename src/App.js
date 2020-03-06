import React, { Component } from "react";
import superagent from "superagent";
import { connect } from "react-redux";

class App extends Component {
  state = {
    text: ""
  };

  stream = new EventSource("http://localhost:4000/stream");

  componentDidMount() {
    this.stream.onmessage = event => {
      //event. data is a JSON string
      // we need a real JavaScript object to use the data
      //to convert, use JSON.parse
      console.log("Data Event", event.data);
      const parsed = JSON.parse(event.data);
      this.props.dispatch(parsed);
    };
  }

  onSubmit = async event => {
    event.preventDefault();
    try {
      const response = await superagent
        .post("http://localhost:4000/message")
        .send({ text: this.state.text });
      this.reset();
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  onChange = event => {
    this.setState({
      text: event.target.value
    });
  };

  reset = () => {
    this.setState({ text: "" });
  };

  render() {
    return (
      <main>
        <form onSubmit={this.onSubmit}>
          <input type="text" onChange={this.onChange} value={this.state.text} />
          <button>Send</button>
          <button onClick={this.reset}>Reset</button>
        </form>
      </main>
    );
  }
}

function mapStateToProps(state) {
  return {
    messages: state.messages
  };
}
const connector = connect(mapStateToProps);
const connected = connector(App);

export default connect(mapStateToProps)(App);
