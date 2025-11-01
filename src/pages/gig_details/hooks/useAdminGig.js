import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { fetchById } from "../../../common/axiosInstance";

export default function useAdminGig() {
    const { gigId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [state, setState] = useState({ loading: true, error: null, gig: null });
    const [compareOpen, setCompareOpen] = useState(false);
    const readonly = localStorage.getItem("offline_readonly") === "1";
    const initialTab = searchParams.get("tab") || "basic";

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const gig = await fetchById("/gigs", gigId);
                if (!mounted) return;
                setState({ loading: false, error: null, gig });
                window.analytics?.track?.("AdminGigDetailsViewed", {
                    gigId, sellerId: gig?.seller_id, category_id: gig?.category_id
                });
            } catch (err) {
                if (!mounted) return;
                setState({ loading: false, error: err, gig: null });
            }
        })();
        return () => { mounted = false; };
    }, [gigId]);

    const pkgEntries = useMemo(
        () => Object.entries(state.gig?.packages || {}),
        [state.gig?.packages]
    );

    const setTabQuery = (k) => {
        const next = new URLSearchParams(searchParams);
        next.set("tab", k);
        setSearchParams(next);
        window.analytics?.track?.("AdminPackagesTabChanged", { gigId, tab: k });
    };

    return {
        gigId,
        initialTab,
        setTabQuery,
        compareOpen,
        setCompareOpen,
        readonly,
        ...state,
        pkgEntries,
    };
}
