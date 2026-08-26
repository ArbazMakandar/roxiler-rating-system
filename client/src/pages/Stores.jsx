import { useEffect, useState } from "react";

import {
    getStores,
    submitRating,
    getMyRating
} from "../api/api";

import Navbar from "../components/Navbar";

const Stores = () => {
    const [stores, setStores] = useState([]);
    const [ratings, setRatings] = useState({});
    const [selectedRatings, setSelectedRatings] = useState({});
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadStores();
    }, []);

    const loadStores = async () => {
        try {
            setLoading(true);
            setError("");
            

            const data = await getStores();

            setStores(data.stores || []);

            const myRatings = {};

            for (const store of data.stores || []) {
                try {
                    const ratingData = await getMyRating(store.id);

                    if (ratingData.rating) {
                        myRatings[store.id] =
                            ratingData.rating.rating;
                    }
                } catch {
                    // User has not rated this store
                }
            }

            setRatings(myRatings);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRatingChange = (storeId, value) => {
        setSelectedRatings({
            ...selectedRatings,
            [storeId]: Number(value)
        });
    };

    const handleSubmitRating = async (storeId) => {
        const rating = selectedRatings[storeId];

        if (!rating) {
            setError("Please select a rating first.");
            return;
        }

        try {
            setError("");
            setMessage("");

            await submitRating(storeId, rating);

            setRatings({
                ...ratings,
                [storeId]: rating
            });

            setMessage("Rating submitted successfully!");

            await loadStores();

            setSelectedRatings({
                ...selectedRatings,
                [storeId]: undefined
            });
        } catch (error) {
            setError(error.message);
        }
    };

    const filteredStores = stores.filter((store) => {
        const searchText = search.toLowerCase();

        return (
            store.name
                .toLowerCase()
                .includes(searchText) ||
            store.address
                .toLowerCase()
                .includes(searchText)
        );
    });

    if (loading) {
        return (
            <div className="page-container">
                <div className="loading-state">
                    Loading stores...
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar />

            <div className="page-container">

                <div className="stores-header">
                    <div>
                        <h1>Find a Store</h1>

                        <p>
                            Discover stores and share your
                            experience with a rating.
                        </p>
                    </div>
                </div>

                <div className="search-wrapper">

                    <span className="search-icon">
                        ⌕
                    </span>

                    <input
                        className="store-search"
                        type="text"
                        placeholder="Search stores by name or address..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="success-message">
                        {message}
                    </div>
                )}

                {filteredStores.length === 0 ? (

                    <div className="empty-state">

                        <h2>No stores found</h2>

                        <p>
                            Try searching with a different
                            store name or address.
                        </p>

                    </div>

                ) : (

                    <div className="store-grid">

                        {filteredStores.map((store) => (

                            <div
                                className="store-card"
                                key={store.id}
                            >

                                <div className="store-card-header">

                                    <div className="store-icon">
                                        {store.name
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    <div>
                                        <h2>{store.name}</h2>

                                        <p>
                                            {store.address}
                                        </p>
                                    </div>

                                </div>

                                <div className="store-details">

                                    <p>
                                        <strong>
                                            Email
                                        </strong>

                                        <span>
                                            {store.email}
                                        </span>
                                    </p>

                                    <p>
                                        <strong>
                                            Average rating
                                        </strong>

                                        <span className="rating">
                                            ★{" "}
                                            {store.overallRating ??
                                                "No ratings yet"}
                                        </span>
                                    </p>

                                    <p>
                                        <strong>
                                            Your rating
                                        </strong>

                                        <span>
                                            {ratings[store.id]
                                                ? `${ratings[store.id]} / 5`
                                                : "Not rated yet"}
                                        </span>
                                    </p>

                                </div>

                                <div className="rating-section">

    <label>
        Rate this store
    </label>

    <div className="star-rating">

        {[1, 2, 3, 4, 5].map((star) => (

            <button
                key={star}
                type="button"
                className={
                    star <=
                    (selectedRatings[store.id] || 0)
                        ? "star active"
                        : "star"
                }
                onClick={() =>
                    handleRatingChange(
                        store.id,
                        star
                    )
                }
                aria-label={`Rate ${star} out of 5`}
            >
                ★
            </button>

        ))}

    </div>

    <div className="rating-hint">

        {selectedRatings[store.id]
            ? `${selectedRatings[store.id]} out of 5`
            : "Click a star to rate"}

    </div>

    <button
        onClick={() =>
            handleSubmitRating(store.id)
        }
    >
        Submit Rating
    </button>

</div>

                            </div>

                        ))}

                    </div>

                )}

            </div>
        </>
    );
};

export default Stores;