import ActiveGig from "./Home/ActiveGig";
import AdminPreview from "./Home/AdminPreview";
import StatsCards from "./Home/statsCards";
import Layout from "./Layout/Layout";


const Home = () => {
    return (
        <Layout>
            <AdminPreview />
            {/* <StatsCards /> */}
            <ActiveGig />
        </Layout>
    );
};

export default Home;
