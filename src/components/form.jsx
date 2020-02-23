import React, { Component } from "react";

class Form extends Component {
  render() {
    const { onChange, onSubmit, currentValue } = this.props;

    return (
      <form>
        <input
          type="text"
          name="text"
          value={currentValue}
          onChange={onChange}
          className="form-control"
        />
        <button className="btn btn-primary btn-sm" onClick={onSubmit}>
          Submit
        </button>
      </form>
    );
  }
}

export default Form;
