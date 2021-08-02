import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import QAPI from "qapi";

window.QAPI = QAPI;
ReactDOM.render(<App />, document.getElementById("root"));

function rend()
{
    const elem = (
        <div>
            <h1>hello world</h1>

        </div>
    );
    //ReactDOM.render(elem, document.getElementById('root'));
}
//rend()