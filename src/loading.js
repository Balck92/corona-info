import React from "react";
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
import Layout from "./common/components/Layout"
import "bootstrap/dist/css/bootstrap.css";
import * as newsLoader from "./newsLoader.json";
import * as doneData from "./doneloading.json";

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: newsLoader.default,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
}
const defaultOptions2 = {
    loop: false,
    autoplay: true,
    animationData: doneData.default,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
};

export default class Loading extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: undefined,
            done: undefined
        };
    }
    componentDidMount() {
        setTimeout(() => {
            fetch("https://jsonplaceholder.typicode.com/posts")
                .then(response => response.json())
                .then(json => {
                    this.setState({ loading: true });
                    setTimeout(() => {
                        this.setState({ done: true });
                    }, 1000);
                });
        }, 1000);
    }
    render() {
        return (
            <div>
                {!this.state.done ? (
                    <FadeIn>
                        <div className="d-flex justify-content-center align-items-center">
                            <h1>Loading</h1>
                            {!this.state.loading ? (
                                <Lottie options={defaultOptions} height={240} width={240} />
                            ) : (
                                    <Lottie options={defaultOptions2} height={240} width={240} />
                                )}
                        </div>
                    </FadeIn>
                ) : (
                        <Layout/>
                    )}
            </div>
        )
    }
}