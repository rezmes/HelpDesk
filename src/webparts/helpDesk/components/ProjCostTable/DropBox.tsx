import * as React from 'react';
import 'core-js/es6/array';

interface IDropBoxProps<T> {
  options: { label: string, value: T }[];
  value: string;
  onChange: (value: string) => void;
  onSelect: (item: { label: string, value: T }) => void;
}

interface IDropBoxState {
  inputValue: string;
}

class DropBox<T> extends React.Component<IDropBoxProps<T>, IDropBoxState> {
  constructor(props: IDropBoxProps<T>) {
    super(props);
    this.state = {
      inputValue: props.value
    };
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    this.setState({ inputValue: value });
    this.props.onChange(value);

    const selectedItem = this.props.options.find(option => option.label === value);
    if (selectedItem) {
      this.props.onSelect(selectedItem);
    }
  };

  render() {
    const { options } = this.props;
    const { inputValue } = this.state;
    //log options
    console.log(options);  // <-- Add this line
    return (
      <div>
        <input
          type="text"
          value={inputValue}
          onChange={this.handleChange}
          list="dropbox-options"
        />
        <datalist id="dropbox-options">
          {options.map((option, index) => (
            <option key={index} value={option.label} />
          ))}
        </datalist>
      </div>
    );
  }
}

export default DropBox;
