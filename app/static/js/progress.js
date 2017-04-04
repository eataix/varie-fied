import "babel-polyfill";

import React from "react"; // eslint-disable-line no-unused-vars
import {render} from "react-dom";
import {createStore} from "redux";
import {Provider} from "react-redux";

import app from "./redux/reducers";
import ProjectPage from "./ProjectPage";
import init from "./main";

(() => {
    if ($('#content').length >= 1) {
        const store = createStore(app);
        console.log(store.getState()); // eslint-disable-line no-console

        store.subscribe(() => {
            console.log(store.getState()); // eslint-disable-line no-console
        });

        render(
            <Provider store={store}>
                <ProjectPage
                    progress={true}
                />
            </Provider>,
            document.getElementById('content')
        );

        init();
    }
})();

