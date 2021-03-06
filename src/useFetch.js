import {useState, useEffect} from 'react';

const useFetch = (url) => {
    // Start out data as null and loading true, fetch from useEffect
    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);

    // Function to run every re-render
    // Or we can run function whenever specific state changes
    // Empty array just means on initial load
    useEffect(() => {
        // If component unmounts, abort
        const abortCont = new AbortController();

        // response object
        // use json method on it
        fetch(url, {signal: abortCont.signal })
            .then(res => {
                if (!res.ok) {
                    throw Error('Could not fetch data for that resource');
                }
                return res.json()
            }).then((data) => {
                // Update blog state
                setData(data);
                setIsPending(false);
                setError(null);
            })
            .catch((e) => {
                // Check for abort errors, don't udpate states
                if (e.name === 'AbortError') {
                    console.log('fetch aborted');
                } else {
                    // Log any errors to state
                    setIsPending(false);
                    setError(e.message);
                }
            })

        return () => abortCont.abort();
    }, [url]);

    return {data, isPending, error};
}

export default useFetch;