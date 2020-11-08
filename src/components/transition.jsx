import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactTextTransition, { presets } from "react-text-transition";

const randomNumber = () => Math.floor(Math.random() * 9999999999 + 10000000000);

const texts = ["Fast", "Scalable", "Potato"];

class Transition extends Component {

    constructor(props) {
        super(props);
        this.state = {
            index: [],
            number: randomNumber(),
            titleArray: [],
            textIndex: 0,
            textFastIndex: 0,
            paragraphIndex: 0


        };
    }

    componentDidMount() {
        setInterval(() => {
            this.setState({
                number: randomNumber(),
                textIndex: this.state.textIndex + 1,
                paragraphIndex: this.state.paragraphIndex + 1
            });
        }, 4000);
        setInterval(() => {
            this.setState({
                textFastIndex: this.state.textFastIndex + 1
            });
        }, 150);
    }

    render() {
        const { titleArray } = this.props;
        return (
            <React.Fragment>
                <ReactTextTransition
                    text={titleArray[0]}
                    spring={presets.gentle}
                    className="big"
                    delay={300}
                    inline
                />
            </React.Fragment>
        );
    }
}
Transition.propTypes = {
    titleArray: PropTypes.array.isRequired
};

export default Transition;
