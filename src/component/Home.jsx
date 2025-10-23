import ActiveGig from "./Home/ActiveGig";
import AdminPreview from "./Home/AdminPreview";
import ProjectTracking from "./Home/ProjectTracking";
import Layout from "./Layout/Layout";


const Home = () => {
    return (
        <Layout>
            <AdminPreview />
            <ActiveGig />
            <ProjectTracking />
        </Layout>
    );
};

export default Home;
