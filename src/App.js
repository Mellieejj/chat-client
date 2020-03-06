import React, { Component } from "react";
import superagent from "superagent";
import { connect } from "react-redux";

// const baseUrl = "https://shielded-bayou-56100.herokuapp.com";

const baseUrl = "http://localhost:4000";

class App extends Component {
  state = {
    text: ""
  };

  stream = new EventSource(`${baseUrl}/stream`);

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
        .post(`${baseUrl}/message`)
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
    const messages = this.props.messages.map(message => <p>{message}</p>);
    const channels = this.props.channels.map(channel => <p>{channel}</p>);
    return (
      <main>
        <form onSubmit={this.onSubmit}>
          <input type="text" onChange={this.onChange} value={this.state.text} />
          <button>Send</button>
          <button onClick={this.reset}>Reset</button>
        </form>
        <h2>Channels</h2>

        {channels}
        <h2>Messages</h2>
        {messages}
      </main>
    );
  }
}

function mapStateToProps(state) {
  return {
    messages: state.messages,
    channels: state.channels
  };
}

export default connect(mapStateToProps)(App);
