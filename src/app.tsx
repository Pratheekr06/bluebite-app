import React from 'react';
import { useParams } from 'react-router';
import PageComponent from './components/PageComponent';
import styles from './app.module.css';

const App = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <div className={styles.App}>
            <PageComponent id={id} />
        </div>
    )
};

export default App;
